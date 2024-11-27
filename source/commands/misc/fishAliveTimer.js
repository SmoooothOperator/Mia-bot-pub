const fixedTime = new Date("2023-10-06T06:00:00Z").getTime() / 1000;
let currentTime = Date.now() / 1000;

let timeDifferenceSeconds = currentTime - fixedTime;

let fishDownDays = Math.floor(timeDifferenceSeconds / 86400);
let fishDownHours = Math.floor((timeDifferenceSeconds % 86400) / 3600);
let fishDownMins = Math.floor(((timeDifferenceSeconds % 86400) % 3600) / 60);

module.exports = {
  name: "fish_alive_timer",
  description: "I will tell you how long the fish has been up.",
  adminOnly: false,

  callback: (client, interaction) => {
    interaction.reply(
      `The Catfish has been running for **${fishDownDays}** days, **${fishDownHours}** hours and **${fishDownMins}** mins`
    );
  },
};
