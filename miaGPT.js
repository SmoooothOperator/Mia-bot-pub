const { OpenAI } = require("openai");
require("dotenv").config();

const replyTargets = ["389306806393896960", "551279669979119616", ""];

//Creates a OpenAI instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

module.exports = async (client, message) => {
  //If bot is not pinged, return
  if (!message.mentions.users.has(client.user.id)) return;
  // if (!replyTargets.includes(message.author.id)) return;

  const sendTypingInterval = setInterval(() => {
    message.channel.sendTyping();
  }, 5000);

  let lessthan2000 = message.content;
  try {
    const response = await openai.chat.completions
      .create({
        //Choose the GPT model
        model: "gpt-3.5-turbo",
        //Message history array
        messages: [
          {
            //The role tells GPT whose message it is
            //The content in this case tells GPT the initial role it plays and provides context
            //name:
            role: "system",
            content: "ChatGPT",
          },
          {
            //This role tells GPT its a user's messgae
            //The content is the message the user sent
            //name:
            role: "user",
            content: lessthan2000,
          },
        ],
      })
      .catch((error) => console.error("OpenAI Error:\n", error));

    clearInterval(sendTypingInterval);

    if (!response) {
      message.reply("OpenAI API did not reply...");
    }

    message.reply(response.choices[0].message.content);
  } catch (errors) {
    console.log("There was an error", error);
  }
};
