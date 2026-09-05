const doEventsOverlap = (event1, event2) => {
  // Convert date and time to Date objects
  // Format assumption for date: "YYYY-MM-DD", time: "HH:mm" (or anything Date can parse correctly, e.g. "2023-10-25 14:30")
  const start1 = new Date(`${event1.date} ${event1.time}`).getTime();
  const start2 = new Date(`${event2.date} ${event2.time}`).getTime();

  // If dates are invalid, fallback to false or throw error. We assume valid dates based on earlier validation.
  if (isNaN(start1) || isNaN(start2)) return false;

  const end1 = start1 + event1.duration * 60 * 1000; // duration is in minutes
  const end2 = start2 + event2.duration * 60 * 1000;

  // Overlap condition
  return start1 < end2 && start2 < end1;
};

module.exports = {
  doEventsOverlap,
};
