const { callback } = require("./ban");

module.exports = {
  name: "snap",
  description: "Give a member the SNAPPED role and remove the Members role.",
  adminOnly: true,
  options: [
    {
      name: "member",
      description: "The member to snap.",
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
      if (member.roles.cache.has(snappedRole.id)) {
        return interaction.reply(
          `${member.user.username} already has the SNAPPED role.`
        );
      }
      await member.roles.add(snappedRole);
      await member.roles.remove(membersRole);
      return interaction.reply(`${member.user.username} has been snapped!`);
    } catch (error) {
      console.error(error);
      return interaction.reply(
        "There was an error trying to snap this member. Make sure I have the proper permissions."
      );
    }
  },
};
