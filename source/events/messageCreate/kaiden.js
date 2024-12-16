const fetchAndReact = require("../../utils/fetchAndReact");

// const target_emojis = ["Irvingfetus"]; Enable when wanting emoji react

module.exports = async (client, message) => {
  //if target includes the message sender id
  if (
    message.content.toLowerCase().includes("freak") ||
    message.content.toLowerCase().includes("变态")
  ) {
    try {
      /* The commented line `// await fetchAndReact(target_emojis, client, message);` is calling a function
named `fetchAndReact` from a module located at `../../utils/fetchAndReact`. This function is likely
responsible for fetching some data and reacting to a message with emojis based on that data. */
      // await fetchAndReact(target_emojis, client, message);
      await message.reply(`<@${"262013598685986816"}>`);
    } catch (error) {
      console.error("Error reacting with emoji:", error);
    }
  }
};
