export const analyticsEvents = [
  "booking_cta_clicked", "booking_started", "passengers_selected", "date_selected",
  "duration_selected", "slot_selected", "contact_details_submitted", "hold_created",
  "payment_started", "payment_failed", "payment_completed", "booking_confirmed",
  "booking_abandoned", "admin_manual_booking_created", "resource_block_created",
];

export function track(event, properties = {}) {
  if (!analyticsEvents.includes(event)) return;
  const safe = Object.fromEntries(Object.entries(properties).filter(([key]) => !["name", "phone", "payment"].includes(key)));
  window.nevaAnalytics = window.nevaAnalytics || [];
  window.nevaAnalytics.push({ event, properties: safe, timestamp: new Date().toISOString() });
}
