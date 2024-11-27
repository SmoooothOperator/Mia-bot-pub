const randmoji = ["RANDADDY", "ahhah"];
const replyTargets = ["389306806393896960"];
const fetchAndReact = require("../../utils/fetchAndReact");

module.exports = async (client, message) => {
  //if target includes the message sender id
  if (
    replyTargets.includes(message.author.id) &&
    message.content.toLowerCase().includes("toyota")
  ) {
    await fetchAndReact(randmoji, client, message);
  }
};
