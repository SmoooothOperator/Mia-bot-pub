const messageId = "1195461066134659154";
const role = "1135747187721113623";
const { reactionRoleMessages } = require(`../../../config.json`);
const roles = require(`../../../roles.json`);

module.exports = async (client, reaction, user) => {
  console.log(reactionRoleMessages);
  console.log("New reaction detected");
  //Check if reaction is from a bot
  if (user.bot) {
    console.log("is bot");
    return;
  }
  //Check if the structure is partial
  if (user.partial) {
    console.log("user is partial");
    //If the message this reaction belongs to was removed, handle the error
    try {
      //fetch() is a new function that comes with partials
      await user.fetch();
    } catch (error) {
      console.error("Something went wrong when fetching message:", error);
      return;
    }
  }
  if (reaction.partial) {
    console.log("reaction is partial");
    //If the message this reaction belongs to was removed, handle the error
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Something went wrong when fetching message:", error);
      return;
    }
  }

  //Check if reaction is on a reaction role message
  if (reactionRoleMessages.includes(reaction.message.id)) {
    console.log("reaction is on reaction role message");
    console.log(`User ID is: ${user.id}`);
    try {
      //get reaction name
      const roleName = reaction.emoji.name;
      console.log(`Role is ${roleName}`);
      //get reaction Id from Json file
      //roleId is undefined when it is not in the Json file
      const roleId = roles[roleName.toLowerCase()];

      if (roleId != undefined) {
        const member = await reaction.message.guild.members.fetch(user.id);
        await member.roles.add(roleId).then(console.log("Role added!"));
      }
    } catch (error) {
      console.error("There was an error", error);
    }
  }
};
