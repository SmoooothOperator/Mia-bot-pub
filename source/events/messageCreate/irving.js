const fetchAndReact = require("../../utils/fetchAndReact");

const target_emojis = ["Irvingfetus"];

module.exports = async (client, message) => {
  //if target includes the message sender id
  if (message.content.toLowerCase().includes("diddy")) {
    try {
      await fetchAndReact(target_emojis, client, message);
      await message.reply(`<@${"287799584321699843"}>`);
    } catch (error) {
      console.error("Error reacting with emoji:", error);
    }
  }
};
