import assert from "node:assert/strict";
import test from "node:test";
import { allocateBooking } from "../src/availability.js";
import { initialBlocks, initialBookings } from "../src/data.js";

const base = { bookings: initialBookings, blocks: initialBlocks };

test("same-day lead time blocks starts less than one hour away", () => {
  const result = allocateBooking({ ...base, passengers: 2, date: "2026-08-23", start: "15:00", duration: 1 });
  assert.equal(result.available, false);
  assert.match(result.reason, /не меньше часа/);
});

test("a third boat is not sellable when both instructors are occupied", () => {
  const result = allocateBooking({ ...base, passengers: 2, date: "2026-08-23", start: "16:00", duration: 2 });
  assert.equal(result.available, false);
  assert.match(result.reason, /инструктора/);
});

test("system chooses the smallest suitable boat", () => {
  const result = allocateBooking({ ...base, passengers: 3, date: "2026-08-24", start: "10:00", duration: 1 });
  assert.equal(result.available, true);
  assert.equal(result.boat.id, "boat-a");
});

test("boat and instructor buffers block the following 30 minutes", () => {
  const result = allocateBooking({ ...base, passengers: 5, date: "2026-08-23", start: "13:00", duration: 1 });
  assert.equal(result.available, false);
});

test("technical block removes a boat from availability", () => {
  const result = allocateBooking({ ...base, passengers: 7, date: "2026-08-23", start: "18:30", duration: 1 });
  assert.equal(result.available, false);
  assert.match(result.reason, /катера/);
});

test("four-hour rental must fit inside operating hours", () => {
  const result = allocateBooking({ ...base, passengers: 2, date: "2026-08-24", start: "18:30", duration: 4 });
  assert.equal(result.available, false);
  assert.match(result.reason, /10:00–22:00/);
});

test("future booking is confirmed with instructor TBD and staffing commitment", () => {
  const result = allocateBooking({ ...base, passengers: 3, date: "2026-09-05", start: "10:00", duration: 2 });
  assert.equal(result.available, true);
  assert.equal(result.instructor, null);
  assert.equal(result.staffingCommitment, true);
});

test("manual booking immediately changes online availability", () => {
  const manual = {
    id: "manual-test", date: "2026-08-24", start: "10:00", duration: 2,
    passengers: 3, boatId: "boat-a", instructorId: "alexey", status: "Confirmed",
  };
  const result = allocateBooking({ ...base, bookings: [...initialBookings, manual], passengers: 3, date: "2026-08-24", start: "10:00", duration: 1 });
  assert.equal(result.available, false);
});
