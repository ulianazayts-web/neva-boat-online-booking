import assert from "node:assert/strict";
import test from "node:test";
import { allocateBooking, validateResourceBlock } from "../src/availability.js";
import { initialBlocks, initialBookings } from "../src/data.js";

const base = { bookings: initialBookings, blocks: initialBlocks };

test("same-day lead time blocks starts less than one hour away", () => {
  const result = allocateBooking({ ...base, passengers: 2, date: "2026-08-23", start: "15:00", duration: 1 });
  assert.equal(result.available, false);
  assert.match(result.reason, /не меньше часа/);
});

test("a third boat is not sellable when both instructors are occupied", () => {
  const result = allocateBooking({ ...base, passengers: 2, date: "2026-08-23", start: "16:00", duration: 2, now: new Date("2026-08-23T12:00:00+03:00") });
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
  const result = allocateBooking({ ...base, passengers: 7, date: "2026-08-23", start: "18:30", duration: 1, now: new Date("2026-08-23T12:00:00+03:00") });
  assert.equal(result.available, false);
  assert.match(result.reason, /катера/);
});

test("same-day boundary rejects 59 minutes and accepts exactly 60", () => {
  const now = new Date("2026-08-23T14:01:00+03:00");
  const rejected = allocateBooking({ ...base, passengers: 2, date: "2026-08-23", start: "15:00", duration: 1, now });
  const accepted = allocateBooking({ ...base, passengers: 2, date: "2026-08-23", start: "15:01", duration: 1, now });
  assert.equal(rejected.available, false);
  assert.notEqual(accepted.reason, "До начала должно оставаться не меньше часа");
});

test("past dates are rejected across Moscow midnight", () => {
  const result = allocateBooking({ ...base, passengers: 2, date: "2026-08-23", start: "20:00", duration: 1, now: new Date("2026-08-24T00:05:00+03:00") });
  assert.equal(result.available, false);
  assert.match(result.reason, /прошла/);
});

test("Moscow lead time is independent from the device offset", () => {
  const instantFromNewYork = new Date("2026-08-23T07:00:00-04:00");
  const result = allocateBooking({ ...base, passengers: 2, date: "2026-08-23", start: "15:00", duration: 1, now: instantFromNewYork });
  assert.notEqual(result.reason, "До начала должно оставаться не меньше часа");
});

test("resource block validates booking conflicts and valid periods", () => {
  const conflict = validateResourceBlock({ block: { date: "2026-08-23", boatId: "boat-b", start: "11:30", end: "12:30" }, ...base });
  const valid = validateResourceBlock({ block: { date: "2026-08-24", boatId: "boat-c", start: "10:00", end: "11:30" }, ...base });
  assert.match(conflict, /NV-1842/);
  assert.equal(valid, "");
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
