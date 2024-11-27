const tiaId = "1128903492849909890";
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = async (client, message) => {
  if (message.content.includes("_IS_") && tiaId.includes(message.author.id)) {
    await sleep(1000);
    await message.reply("_ALWAYS_");
  } else if (
    message.content.includes("_THE_") &&
    tiaId.includes(message.author.id)
  ) {
    await sleep(1000);
    await message.reply("_ANSWER!_");
  }
};
