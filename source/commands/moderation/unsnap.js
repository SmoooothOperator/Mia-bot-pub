const { adminOnly } = require("./snap");

module.exports = {
  name: "unsnap",
  description: "Remove the SNAPPED role and give the Members role to a member.",
  adminOnly: true,
  options: [
    {
      name: "member",
      description: "The member to unsnap.",
      type: 6, // 6 corresponds to USER type
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const member = interaction.options.getMember("member");

    // Define the role names
    const snappedRoleName = "SNAPPED";
    const membersRoleName = "Members";

    // Get roles from the guild
    const snappedRole = interaction.guild.roles.cache.find(
      (role) => role.name === snappedRoleName
    );
    const membersRole = interaction.guild.roles.cache.find(
      (role) => role.name === membersRoleName
    );

    // Check if roles exist
    if (!snappedRole) {
      return interaction.reply(`The role "${snappedRoleName}" does not exist.`);
    }
    if (!membersRole) {
      return interaction.reply(`The role "${membersRoleName}" does not exist.`);
    }

    // Attempt to update roles
    try {
      if (!member.roles.cache.has(snappedRole.id)) {
        return interaction.reply(
          `${member.user.username} does not have the SNAPPED role.`
        );
      }
      await member.roles.remove(snappedRole);
      await member.roles.add(membersRole);
      return interaction.reply(`${member.user.username} has been unsnapped!`);
    } catch (error) {
      console.error(error);
      return interaction.reply(
        "There was an error trying to unsnap this member. Make sure I have the proper permissions."
      );
    }
  },
};
