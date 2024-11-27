const timestamp = new Date("2023-04-15T00:00:00Z").getTime() / 1000;
const fixedTime = new Date("2023-10-06T06:00:00Z").getTime() / 1000;
let currentTime = Date.now() / 1000;
let timeDifferenceSeconds = fixedTime - timestamp;

let fishDownDays = Math.floor(timeDifferenceSeconds / 86400);
let fishDownHours = Math.floor((timeDifferenceSeconds % 86400) / 3600);
let fishDownMins = Math.floor(((timeDifferenceSeconds % 86400) % 3600) / 60);

module.exports = {
  name: "fish_broken_timer",
  description: "I will tell you how long the fish was down.",
  adminOnly: false,

  callback: (client, interaction) => {
    interaction.reply({
      content: `The Catfish was dead for **${fishDownDays}** days, **${fishDownHours}** hours and **${fishDownMins}** mins`,
      ephemeral: false,
    });
  },
};
