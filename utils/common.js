const melbourneFullTime = new Date().toLocaleString("en-AU", {
    timeZone: "Australia/Melbourne",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit"
});

module.exports = { melbourneFullTime };