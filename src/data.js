export const boats = [
  { id: "boat-a", name: "Катер A", capacity: 4, note: "Demo" },
  { id: "boat-b", name: "Катер B", capacity: 6, note: "Demo" },
  { id: "boat-c", name: "Катер C", capacity: 8, note: "Demo" },
];

export const instructors = [
  { id: "alexey", name: "Алексей" },
  { id: "mikhail", name: "Михаил" },
];

export const shifts = [
  { date: "2026-08-23", instructorId: "alexey", start: "10:00", end: "18:00" },
  { date: "2026-08-23", instructorId: "mikhail", start: "14:00", end: "22:00" },
  { date: "2026-08-24", instructorId: "alexey", start: "10:00", end: "18:00" },
  { date: "2026-08-24", instructorId: "mikhail", start: "12:00", end: "22:00" },
  { date: "2026-08-25", instructorId: "alexey", start: "12:00", end: "22:00" },
  { date: "2026-08-25", instructorId: "mikhail", start: "10:00", end: "18:00" },
];

export const initialBookings = [
  {
    id: "NV-1842",
    date: "2026-08-23",
    start: "11:00",
    duration: 2,
    passengers: 5,
    boatId: "boat-b",
    instructorId: "alexey",
    customer: "Анна Петрова",
    phone: "+7 921 555-24-18",
    source: "Онлайн",
    payment: "Частично оплачено",
    status: "Confirmed",
  },
  {
    id: "NV-1845",
    date: "2026-08-23",
    start: "14:00",
    duration: 1,
    passengers: 7,
    boatId: "boat-c",
    instructorId: "mikhail",
    customer: "Мария Орлова",
    phone: "+7 911 238-70-15",
    source: "Ручная",
    payment: "Оплата у причала",
    status: "Confirmed",
  },
  {
    id: "NV-1847",
    date: "2026-08-23",
    start: "16:00",
    duration: 2,
    passengers: 3,
    boatId: "boat-a",
    instructorId: "alexey",
    customer: "Елена Смирнова",
    phone: "+7 931 624-11-90",
    source: "Онлайн",
    payment: "Частично оплачено",
    status: "Confirmed",
  },
  {
    id: "NV-1848",
    date: "2026-08-23",
    start: "16:00",
    duration: 2,
    passengers: 6,
    boatId: "boat-b",
    instructorId: "mikhail",
    customer: "Иван Соколов",
    phone: "+7 911 401-32-87",
    source: "Ручная",
    payment: "Не оплачено",
    status: "Confirmed",
  },
  {
    id: "NV-1891",
    date: "2026-09-05",
    start: "16:00",
    duration: 2,
    passengers: 5,
    boatId: "boat-b",
    instructorId: null,
    customer: "Ольга Крылова",
    phone: "+7 921 100-20-30",
    source: "Онлайн",
    payment: "Частично оплачено",
    status: "Confirmed",
  },
];

export const initialBlocks = [
  {
    id: "block-1",
    date: "2026-08-23",
    boatId: "boat-c",
    start: "18:00",
    end: "21:00",
    reason: "Техническое обслуживание",
  },
];

export const durations = [1, 2, 3, 4];
