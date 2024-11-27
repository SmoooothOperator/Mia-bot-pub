const ismoji = [
  "GorillaSteve",
  "5Eggs",
  "SteveLeftRight",
  "StoveHype",
  "StoveHype~1",
  "StrongLeg",
];
const replyTargets = ["613579814095290398"];

let randomNumber;

module.exports = async (client, message) => {
  randomNumber = Math.floor(Math.random() * 5) + 1;
  //if target includes the message sender id
  if (replyTargets.includes(message.author.id) && randomNumber === 3) {
    console.log(message.content);
    try {
      //get all emojis that matches the name in randmoji
      const emojis = client.emojis.cache.filter((emoji) =>
        ismoji.includes(emoji.name)
      );
      //if the emojis array is not null or empty
      if (emojis) {
        //for every element of emojis
        for (const emoji of emojis) {
          //   console.log(emoji.toString());
          //react with the string representation of the emoji object(required by discord)
          await message.react(emoji.toString());
        }
      } else {
        console.log("No emojis found");
      }
    } catch (error) {
      console.error("Error reacting with emoji:", error);
    }
    await message.reply(`Steve you Hidiot..`);
  }
};
