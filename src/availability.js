import { boats, instructors, shifts } from "./data.js";
import { moscowDateKey, moscowNowMinutes } from "./dates.js";

const BUFFER_MINUTES = 30;
const OPEN_MINUTES = 10 * 60;
const CLOSE_MINUTES = 22 * 60;

export function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function toTime(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export function formatPrice(hours) {
  return `${new Intl.NumberFormat("ru-RU").format(hours * 6000)} ₽`;
}

function overlapsWithBuffer(start, end, otherStart, otherEnd) {
  return start < otherEnd + BUFFER_MINUTES && end + BUFFER_MINUTES > otherStart;
}

function bookingConflicts(resourceKey, resourceId, date, start, end, bookings, ignoreId) {
  return bookings.some((booking) => {
    if (booking.id === ignoreId || booking.date !== date || booking.status === "Cancelled") return false;
    if (booking[resourceKey] !== resourceId) return false;
    const otherStart = toMinutes(booking.start);
    const otherEnd = otherStart + booking.duration * 60;
    return overlapsWithBuffer(start, end, otherStart, otherEnd);
  });
}

function boatIsBlocked(boatId, date, start, end, blocks) {
  return blocks.some((block) => {
    if (block.boatId !== boatId || block.date !== date) return false;
    return start < toMinutes(block.end) && end > toMinutes(block.start);
  });
}

export function allocateBooking({
  passengers,
  date,
  start,
  duration,
  bookings,
  blocks,
  now = new Date(),
  ignoreId,
}) {
  const startMinutes = toMinutes(start);
  const endMinutes = startMinutes + duration * 60;

  if (startMinutes < OPEN_MINUTES || endMinutes > CLOSE_MINUTES) {
    return { available: false, reason: "Поездка выходит за часы работы 10:00–22:00" };
  }

  const dateStart = new Date(`${date}T00:00:00+03:00`);
  const todayKey = moscowDateKey(now);
  if (date < todayKey) return { available: false, reason: "Дата уже прошла" };
  if (date === todayKey) {
    if (startMinutes - moscowNowMinutes(now) < 60) {
      return { available: false, reason: "До начала должно оставаться не меньше часа" };
    }
  }

  const suitableBoats = boats
    .filter((boat) => boat.capacity >= passengers)
    .sort((a, b) => a.capacity - b.capacity);
  if (!suitableBoats.length) return { available: false, reason: "Группа больше demo-вместимости флота" };

  const freeBoat = suitableBoats.find(
    (boat) =>
      !boatIsBlocked(boat.id, date, startMinutes, endMinutes, blocks) &&
      !bookingConflicts("boatId", boat.id, date, startMinutes, endMinutes, bookings, ignoreId),
  );
  if (!freeBoat) return { available: false, reason: "Нет подходящего свободного катера" };

  const dayShifts = shifts.filter((shift) => shift.date === date);
  if (!dayShifts.length) {
    const concurrentCommitments = bookings.filter((booking) => {
      if (booking.id === ignoreId || booking.date !== date || booking.status === "Cancelled") return false;
      const otherStart = toMinutes(booking.start);
      const otherEnd = otherStart + booking.duration * 60;
      return overlapsWithBuffer(startMinutes, endMinutes, otherStart, otherEnd);
    }).length;
    if (concurrentCommitments >= instructors.length) {
      return { available: false, reason: "Будущая потребность в инструкторах уже исчерпана" };
    }
    return {
      available: true,
      boat: freeBoat,
      instructor: null,
      staffingCommitment: true,
      dateStart,
    };
  }

  const freeInstructor = dayShifts
    .map((shift) => ({
      shift,
      instructor: instructors.find((instructor) => instructor.id === shift.instructorId),
    }))
    .find(({ shift, instructor }) => {
      if (!instructor) return false;
      const coversRentalAndBuffer =
        toMinutes(shift.start) <= startMinutes && toMinutes(shift.end) >= endMinutes + BUFFER_MINUTES;
      return (
        coversRentalAndBuffer &&
        !bookingConflicts(
          "instructorId",
          instructor.id,
          date,
          startMinutes,
          endMinutes,
          bookings,
          ignoreId,
        )
      );
    });

  if (!freeInstructor) return { available: false, reason: "Нет свободного инструктора на смене" };

  return {
    available: true,
    boat: freeBoat,
    instructor: freeInstructor.instructor,
    staffingCommitment: false,
    dateStart,
  };
}

export function validateResourceBlock({ block, bookings, blocks, ignoreId }) {
  const start = toMinutes(block.start);
  const end = toMinutes(block.end);
  if (!boats.some((boat) => boat.id === block.boatId)) return "Выберите катер";
  if (end <= start) return "Окончание должно быть позже начала";
  if (start < OPEN_MINUTES || end > CLOSE_MINUTES) return "Блокировка должна быть в пределах 10:00–22:00";
  const conflict = bookings.find((booking) => {
    if (booking.status === "Cancelled" || booking.date !== block.date || booking.boatId !== block.boatId) return false;
    const bookingStart = toMinutes(booking.start);
    const bookingEnd = bookingStart + booking.duration * 60;
    return start < bookingEnd && end > bookingStart;
  });
  if (conflict) return `Конфликт с бронью ${conflict.id}: ${conflict.start}–${toTime(toMinutes(conflict.start) + conflict.duration * 60)}`;
  const blockConflict = blocks.find((item) => item.id !== ignoreId && item.date === block.date && item.boatId === block.boatId && start < toMinutes(item.end) && end > toMinutes(item.start));
  if (blockConflict) return `Конфликт с блокировкой ${blockConflict.start}–${blockConflict.end}`;
  return "";
}

export function getAvailableSlots(params) {
  const slots = [];
  for (let minute = OPEN_MINUTES; minute <= CLOSE_MINUTES - params.duration * 60; minute += 30) {
    const time = toTime(minute);
    const allocation = allocateBooking({ ...params, start: time });
    slots.push({ time, ...allocation });
  }
  return slots;
}

export function validateReassignment({ booking, boatId, instructorId, bookings, blocks }) {
  const start = toMinutes(booking.start);
  const end = start + booking.duration * 60;
  const boat = boats.find((item) => item.id === boatId);
  if (!boat || boat.capacity < booking.passengers) return "Катер не вмещает группу";
  if (boatIsBlocked(boatId, booking.date, start, end, blocks)) return "Катер заблокирован на это время";
  if (bookingConflicts("boatId", boatId, booking.date, start, end, bookings, booking.id)) {
    return "Катер уже занят с учётом 30-минутного буфера";
  }
  if (instructorId) {
    const shift = shifts.find(
      (item) => item.date === booking.date && item.instructorId === instructorId,
    );
    if (!shift || toMinutes(shift.start) > start || toMinutes(shift.end) < end + BUFFER_MINUTES) {
      return "Инструктор не на смене весь период с учётом буфера";
    }
    if (bookingConflicts("instructorId", instructorId, booking.date, start, end, bookings, booking.id)) {
      return "Инструктор уже занят с учётом 30-минутного буфера";
    }
  }
  return "";
}
