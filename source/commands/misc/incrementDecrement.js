const { ApplicationCommandOptionType } = require("discord.js");
//id for the kick value messages
const cadenid = "1207929304801878050";
const steveid = "1207929279430660102";
const robid = "1207929177672777808";
//id for the kick channel
const kickChannelid = "1206140426420101151";

module.exports = {
  name: "decrement_increment",
  description: "for editing penalty points",
  devOnly: false,
  testOnly: true,
  options: [
    {
      name: "operation",
      description: "enter decrement or increment",
      required: true,
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: "Increment", value: "increment" }, // Defining choices for the operation option
        { name: "Decrement", value: "decrement" },
      ],
    },
    {
      name: "target",
      description: "name of the person to give or remove penalty from",
      required: true,
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: "rob", value: "rob" },
        { name: "steve", value: "steve" },
        { name: "caden", value: "caden" },
      ],
    },
  ],

  callback: async (client, interaction) => {
    //get the options
    const operation = interaction.options.getString("operation");
    let target = interaction.options.getString("target");
    let targetID = "";
    try {
      //get channel object
      const kickChannel = await client.channels.cache.get(kickChannelid);
      if (kickChannel) {
        //decide who the target is
        switch (target) {
          case "rob":
            targetID = robid;
            break;
          case "caden":
            targetID = cadenid;
            break;
          case "steve":
            targetID = steveid;
            break;
          //could add default: later
        }
        //fetch old message
        const oldMessage = await kickChannel.messages.fetch(targetID);
        //get index of 0x
        const index = oldMessage.content.indexOf("0x");
        //get the hexval
        let hexval = oldMessage.content.substring(index + 2);
        console.log(hexval);
        //convert to deci
        let decival = parseInt(hexval, 16);

        console.log(decival);

        //increment or decrement
        if (operation == "increment") {
          decival += 1;
        } else {
          decival -= 1;
        }
        //convert back to hex
        hexval = decival.toString(16);

        console.log(hexval);
        //uppercase first letter of target
        target = target.charAt(0).toUpperCase() + target.slice(1);
        console.log(target);
        //make new message
        edited = `${target}: 0x${hexval}`;
        //edit ogMessage
        await oldMessage.edit(edited);
        interaction.reply({ content: "done", ephemeral: true });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
