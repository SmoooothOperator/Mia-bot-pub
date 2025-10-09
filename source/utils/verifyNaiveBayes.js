const trainNaiveBayes = require("./trainNaiveBayes");
const { boardChannelID, verifyChannelID } = require("../../constants");

module.exports = async (client, reaction, user) => {
  // Skip if bot reaction or not in board channel
  if (user.bot || reaction.message.channel.id !== boardChannelID) {
    console.log("No detection");
    return;
  }

  // Check if this is a spam detection message
  if (!reaction.message.content.includes("🤖 **Spam Detection Alert**")) {
    console.log("Not a Spam Detection Message");
    return;
  }

  try {
    console.log("Is a Spam Detection Message");

    const verifyChannel = client.channels.cache.get(verifyChannelID);

    // Extract message content and user info from the alert
    const alertContent = reaction.message.content;
    const messageMatch = alertContent.match(/\*\*Message:\*\* (.+?)\n/);
    const userMatch = alertContent.match(/User: <@(\d+)>/);

    if (!messageMatch || !userMatch) return;

    const originalMessage = messageMatch[1];
    const userId = userMatch[1];

    if (reaction.emoji.name === "✅") {
      // Ban the user
      try {
        console.log("ban!!");
        const guild = reaction.message.guild;
        const member = await guild.members.fetch(userId);

        await member.ban({
          reason: "Board-verified spam detection",
        });

        await reaction.message.edit(
          `${alertContent}\n\n✅ **BANNED** by ${user.tag}`
        );

        // Send feedback message to verify channel
        if (verifyChannel) {
          await verifyChannel.send(
            `🚫 <@${userId}> has been banned due to spam detection.`
          );
        }

        // Train model with this spam
        await trainNaiveBayes(originalMessage, "spam");
      } catch (error) {
        console.error("Error banning user:", error);
        await reaction.message.reply("Failed to ban user. Check permissions.");
      }
    } else if (reaction.emoji.name === "❌") {
      console.log("don't ban!!");

      // Mark as legitimate
      await reaction.message.edit(
        `${alertContent}\n\n❌ **Marked as illegitimate** by ${user.tag}`
      );

      // Train model with this legitimate message
      await trainNaiveBayes(originalMessage, "legitimate");
    } else if (reaction.emoji.name === "📚") {
      // Use as training data - ask for label
      await reaction.message.reply(
        `📚 ${user}, please use the \`/train_spam\` command to manually label this message for training.`
      );
    }
  } catch (error) {
    console.error("Error in spam verification reaction:", error);
  }
};
