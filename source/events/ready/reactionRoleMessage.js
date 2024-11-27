const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

let sent = false;

let leftOverMoji = [];

const ismoji = ["valorant", "🦵", "🏎️", "🚀"];

module.exports = async (client) => {
  if (sent === false) {
    return;
  }
  try {
    const valorant = client.emojis.cache.find(
      (emoji) => emoji.name === "valorant"
    );
    const channel = await client.channels.cache.get("1031416527754362900");
    if (!channel) return;

    const sentMessage = await channel.send({
      content: `**Wanna be pinged for a topic of interest? React to an emote below to assign a role to yourself to be pinged!**
      \n -Valorant ${valorant}
      \n -League of Legends 🦵
      \n -Rocket League 🚀
      \n -Sim Racing 🏎️
      \n`,
      //   components: [row],
    });

    //get all emojis that matches the name in randmoji
    const emojis = client.emojis.cache.filter((emoji) =>
      ismoji.includes(emoji.name)
    );
    console.log(emojis);
    //if the emojis array is not null or empty
    if (emojis) {
      //for every element of emojis
      for (const emoji of emojis.values()) {
        // console.log(emoji.toString());
        //react with the string representation of the emoji object(required by discord)
        await sentMessage.react(emoji);
        const remove = emoji.name;
        leftOverMoji = ismoji.filter((element) => element !== remove);
      }
      for (const emoji of leftOverMoji) {
        console.log(emoji);
        await sentMessage.react(emoji);
      }
    } else {
      console.log("No emojis found");
    }

    // console.log(sentMessage);

    process.exit();
  } catch (error) {
    console.log(error);
  }
};
