const CHANNEL_ID = [
  "616473403125268497",
  "857527000410226698",
  "801608682595942400",
  "937908056354881576",
  "956083703426199623",
  "1129107811364769924",
  "1054804987424804914",
  "1129104989185384458",
  "1129524058753617961",
  "1129105495320432801",
  "1063004412676669482",
];
const USER_ID = "305588049977409536";
let index = 0;
const min = 1;

// Define the target date and time range
const TARGET_DATE = "2024-10-18";
const START_HOUR = 10; // 10 AM
const END_HOUR = 23; // 11 PM

// Check if the current date and time match the target date and time range
function isWithinTargetTime() {
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const currentHour = now.getHours();

  return (
    currentDate === TARGET_DATE &&
    currentHour >= START_HOUR &&
    currentHour <= END_HOUR
  );
}

module.exports = (client) => {
  setInterval(() => {
    if (isWithinTargetTime()) {
      const channel = client.channels.cache.get(CHANNEL_ID[index]);
      if (channel) {
        channel.send(`<@${USER_ID}> Happy 18th Birthday!`);
      } else {
        console.log("Channel not found");
      }
      index = (index + 1) % CHANNEL_ID.length;
    }
  }, 1000 * 60 * 3);
};
