const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const fs = require("fs");
const filePath =
  "C:/Users/Caden/Documents/Personal Projects/Discord Bots/Mia and Tia Bot/Mia/roles.json";

module.exports = {
  name: "reaction_add",
  description: "Adds a new reaction role",
  //devOnly: Boolean,
  // testOnly: true,
  adminOnly: true,
  options: [
    {
      name: "name",
      description: "The emoji name of the role",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "id",
      description: "The ID of the role",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  // botPermissions: [PermissionFlagsBits.Administrator],
  // deleted: true,

  callback: async (client, interaction) => {
    try {
      let roleName = interaction.options.getString("name");
      let roleId = interaction.options.getString("id");

      //get the existing contents of the json file
      const existingContent = fs.readFileSync(filePath, "utf8");

      //parse the content into a javascript object
      const jsonData = JSON.parse(existingContent);

      //add a new entry to the javascrip object
      jsonData[roleName] = `${roleId}`;

      //convert back to Json
      const updatedContent = JSON.stringify(jsonData, null, 2);

      //Write the updated JSON content back into the original file
      fs.writeFileSync(filePath, updatedContent, "utf8");

      interaction.reply("Sucessfully added new reaction role");
    } catch (error) {
      interaction.reply(`There was an error ${error}`);
    }
  },
};
