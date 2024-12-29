module.exports = (ms) => {
  const minutes = Math.floor(ms / 60000); // 1 minute = 60,000 ms
  const seconds = ((ms % 60000) / 1000).toFixed(0); // Remaining seconds
  let remainingMs = ms % 1000; // Remaining milliseconds
  if (remainingMs === 0) {
    remainingMs = "000";
  }
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}.${remainingMs}`; // Format as MM:SS
};
