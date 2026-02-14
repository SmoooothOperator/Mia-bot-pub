const spamDetector = require("../../utils/naiveBayesPredict");
const trainNaiveBayes = require("../../utils/trainNaiveBayes");
const { boardChannelID } = require("../../../constants");

const verifyChannelID = "902108236713426975";
const testChannelID = "1141162992310960218";

// Import the same regex patterns from Tia
const verifyMessageFormat =
  /^(.+)\s*[|,/-]\s*(warren|sixth|seventh|revelle|muir|marshall|erc|eighth)\s*[|,/-]\s*(1[0-9]'*|2[0-9]'*|20[1-3][0-9])$/i;

const differentThanVerifyFormat =
  /^(.+)\s*[|,/-]\s*(.+)\s*[|,/-]\s*(1[0-9]'*|2[0-9]'*|20[1-3][0-9])$/i;

const differentThanVerifyFormat2 = /^(.+)\s*[|,/-]\s*(.+)\s*$/i;



module.exports = async (client, message) => {
  const verifyChannel = client.channels.cache.get(verifyChannelID);

  // Skip if not in verify channel
  if (message.channel.id !== verifyChannelID) return;

  // Skip bot messages
  if (message.author.bot) return;

  // Skip valid verification messages - these should be handled by Tia
  // if (
  //   verifyMessageFormat.test(message.content.trim()) ||
  //   differentThanVerifyFormat.test(message.content.trim()) ||
  //   differentThanVerifyFormat2.test(message.content.trim())
  // ) {
  //   console.log("Valid verification format detected - skipping spam detection");
  //   return;
  // }

  let spam = false;
  let reason = "";



  // Check with Naive Bayes for non-verification messages
  if (!spam) {
    try {
      const prediction = await spamDetector(message.content);

      if (prediction.prediction === "spam") {
        try {
          console.log("Auto-banning spammer...");

          // 1. Ban the user
          const member = await message.guild.members.fetch(message.author.id);
          await member.ban({
            reason: "Detected Spam",
          });

          // 2. Train the model automatically (reinforcement)
          await trainNaiveBayes(message.content, "spam");

          if (verifyChannel) {
            await verifyChannel.send(
              `🚫 <@${message.author.id}> has been banned due to spam detection.`
            );
          }

          // 3. Notify the Board Channel (Informational)
          const boardChannel = client.channels.cache.get(boardChannelID);
          if (boardChannel) {
            await boardChannel.send(
              `🤖 **Spam Detection Auto-Ban**\n` +
                `User: ${message.author} (${message.author.tag})\n` +
                `Channel: <#${message.channel.id}>\n` +
                `**Message:** ${message.content}\n\n` +
                `**Status:** ✅ User automatically banned and model updated.`,
            );
          }
        } catch (error) {
          console.error("Auto-ban failed:", error);
          const boardChannel = client.channels.cache.get(boardChannelID);
          if (boardChannel) {
            await boardChannel.send(
              `⚠️ **Spam Detection Error:** Detected spam from ${message.author} but failed to ban.\nError: ${error.message}. Ban manually if needed.`,
            );
          }
        }
        return;
      }
    } catch (error) {
      console.error("Error in spam detection:", error);
    }
  }

  // If we get here, it's a message that doesn't match verification formats
  // and wasn't detected as spam by the ML model
  console.log("Message in verify channel doesn't match any known format");
};
