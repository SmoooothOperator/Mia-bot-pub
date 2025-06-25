const spamDetector = require("../../utils/naiveBayesPredict");
const trainNaiveBayes = require("../../utils/trainNaiveBayes");
const { boardChannelID } = require("../../constants");

const verifyChannelID = "902108236713426975";

// Import the same regex patterns from Tia
const verifyMessageFormat =
  /^(.+)\s*[|,/-]\s*(warren|sixth|seventh|revelle|muir|marshall|erc|eighth)\s*[|,/-]\s*(1[0-9]'*|2[0-9]'*|20[1-3][0-9])$/i;

const differentThanVerifyFormat =
  /^(.+)\s*[|,/-]\s*(.+)\s*[|,/-]\s*(1[0-9]'*|2[0-9]'*|20[1-3][0-9])$/i;

const differentThanVerifyFormat2 = /^(.+)\s*[|,/-]\s*(.+)\s*$/i;

module.exports = async (client, message) => {
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
        console.log("spam");
        // Don't automatically ban, ask board for verification
        const boardChannel = client.channels.cache.get(boardChannelID);

        if (boardChannel) {
          const verificationMessage = await boardChannel.send(
            `🤖 **Spam Detection Alert**\n` +
              `User: ${message.author} (${message.author.tag})\n` +
              `Channel: <#${message.channel.id}>\n` +
              `**Message:** ${message.content}\n\n` +
              `**AI Prediction:** Likely spam\n\n` +
              `React with ✅ to ban user, ❌ to mark as legitimate, 📚 to use as training data`
          );

          await verificationMessage.react("✅");
          await verificationMessage.react("❌");
          await verificationMessage.react("📚");
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
