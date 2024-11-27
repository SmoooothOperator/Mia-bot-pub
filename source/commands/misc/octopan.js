const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

//Import the file i/o function
const read_write = require("../../utils/read_write");

const { exec, execSync, execFileSync } = require("child_process");
const { stdout } = require("process");

const replyTargets = ["613579814095290398"];

module.exports = {
  name: "octopan",
  description: "🐙🥞",
  //devOnly: Boolean,
  // testOnly: false,
  // miaOnly: false,
  options: [
    {
      name: "content",
      description: "enter your message here to translate",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "visible_to_others",
      description: "choose visibility",
      required: true,
      type: ApplicationCommandOptionType.Boolean,
    },
  ],

  callback: async (client, interaction) => {
    try {
      if (replyTargets.includes(interaction.user.id)) {
        interaction.reply({
          content: `Use Octopan Steve cannot. For worthy, Steve is not. 🐙🥞`,
          ephemeral: false,
        });
        return;
      }
      let octopan = "";
      //If others can see the translated message
      const visibility = interaction.options.getBoolean("visible_to_others");
      const message = interaction.options.getString("content");

      //Mode
      let toEng = false;
      let toPan = false;

      //Check translation direction
      if (message.includes("🐙") || message.includes("🥞")) {
        toEng = true;
      } else {
        toPan = true;
      }

      //To Octopan

      /*
    Plan for toPan
    1. Save message to a .txt file (default name of 2compress.txt)
    2. call compress.exe to compress file, save to file called (compressed.txt)
    3. read the stdout of compress.exe and save to a variable called huffcode
    4. rename compressed.txt to what is stored in huffcode
    6. output the huffcode to the user

    */
      if (toPan) {
        let huffcode;
        //1.
        console.log(message);
        read_write("source\\huffman\\2compress.txt", 2, message);

        //2.

        //Execute the compress.exe function
        huffcode = execSync(
          '"source/huffman/compress" source/huffman/2compress.txt source/huffman/compressed.txt',
          { encoding: "utf8" }
        );

        console.log(huffcode);

        //Replace with octopan
        octopan += huffcode.replace(/0/g, "🥞").replace(/1/g, "🐙");

        let trimmed_huffcode = huffcode.split(/\r?\n|\r/).join("");
        let new_name = "source\\huffman\\" + trimmed_huffcode + ".txt";

        //4.
        read_write("source\\huffman\\compressed.txt", 3, new_name);
      }
      /*
      Plan for toEng
      1. use the user input message as name to file to decompress
      2. read the file to decompress with uncompress.exe
      3. save the result to uncompressed.exe
      4. read the file of uncompressed.exe and output to user

      */
      let final_binary = "";
      //To English
      if (toEng) {
        final_binary = message.replace(/🥞/g, "0").replace(/🐙/g, "1");

        console.log(final_binary);

        //uncompress
        execSync(
          `"source/huffman/uncompress" source/huffman/${final_binary}.txt source/huffman/uncompressed.txt`,
          { encoding: "utf8" }
        );
        //read the output file from uncompressed
        octopan = await read_write("source\\huffman\\uncompressed.txt", 4);
        await read_write(`source/huffman/${final_binary}.txt`, 5);
      }

      if (visibility) {
        interaction.reply(
          `**Original:** ${message}\n**Translation:** ${octopan}`
        );
      } else {
        interaction.reply({ content: octopan, ephemeral: true });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
