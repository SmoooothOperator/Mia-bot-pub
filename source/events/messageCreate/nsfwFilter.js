const { OpenAI } = require("openai");
require("dotenv").config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

module.exports = async (client, message) => {
  // Replace this with the specific user's ID
  const targetUserId = "955687944826523719"; //Tu

  // Check if it's the target user
  if (message.author.id !== targetUserId) return;

  // Skip empty messages
  if (!message.content) return;

  try {
    // Use OpenAI's free Moderation API
    const response = await openai.moderations.create({
      input: message.content,
    });

    const result = response.results[0];

    // Check if the message is flagged as sexual
    // result.categories contains: sexual, sexual/minors, self-harm, violence, etc.
    if (result.flagged) {
      const isNSFW =
        result.categories.sexual || result.categories["sexual/minors"];

      if (isNSFW) {
        await message.delete();
        console.log(
          `Deleted NSFW message from ${message.author.tag} (Detected by OpenAI)`,
        );
        // Optional: Send a warning message
        // await message.channel.send(`${message.author}, that content is not allowed.`);
        return;
      }
    }
  } catch (error) {
    console.error("OpenAI Moderation Error:", error);

    // Fallback: Use basic word filter if API fails
    const nsfwWords = [
      "sex",
      "sexy",
      "sexual",
      "nude",
      "nudes",
      "naked",
      "boobs",
      "tits",
      "tit",
      "pussy",
      "dick",
      "cock",
      "cum",
      "ass",
      "anal",
      "fuck",
      "fucking",
      "fucked",
      "fucker",
      "fucks",
      "shit",
      "bitch",
      "slut",
      "whore",
      "blowjob",
      "bj",
      "handjob",
      "hj",
      "porn",
      "porno",
      "pornography",
      "xxx",
      "milf",
      "nsfw",
      "deepthroat",
      "69",
      "cunnilingus",
      "fellatio",
      "masturbate",
      "masturbation",
      "masturbating",
      "jerk off",
      "jerking",
      "jerked",
      "orgasm",
      "orgy",
      "threesome",
      "foursome",
      "gangbang",
      "creampie",
      "spank",
      "spanking",
      "bondage",
      "bdsm",
      "dominatrix",
      "dominant",
      "submissive",
      "sub",
      "dom",
      "kinky",
      "fetish",
      "fetishes",
      "lick",
      "licking",
      "suck",
      "sucking",
      "sucked",
      "kiss",
      "kissing",
      "clit",
      "clitoris",
      "vagina",
      "penis",
      "erection",
      "ejaculate",
      "ejaculation",
      "cumshot",
      "cumshots",
      "pegging",
      "rimjob",
      "rim job",
      "butt plug",
      "buttplug",
      "dildo",
      "vibrator",
      "sex toy",
      "sex toys",
      "strapon",
      "strap on",
      "orgasm",
      "moan",
      "moaning",
      "wet dream",
      "wet dreams",
      "panties",
      "panty",
      "thong",
      "g-string",
      "g string",
      "cameltoe",
      "camel toe",
      "teabag",
      "teabagging",
      "tease",
      "teasing",
      "hard on",
      "hardon",
      "nipple",
      "nipples",
      "grope",
      "groping",
      "hentai",
      "incest",
      "stepmom",
      "stepdad",
      "stepsis",
      "stepbro",
      "step sister",
      "step brother",
      "step mother",
      "step father",
      "pawg",
      "bbw",
      "bwc",
      "bbc",
      "bwc",
      "bdsm",
      "futanari",
      "futa",
      "yiff",
      "yiffy",
      "yiffing",
      "furry porn",
      "furry yiff",
      "furry yiffy",
    ];
    const content = message.content.toLowerCase();
    const hasNsfw = nsfwWords.some((word) => content.includes(word));

    if (hasNsfw) {
      try {
        await message.delete();
        console.log(
          `Deleted NSFW message from ${message.author.tag} (Fallback Filter)`,
        );
      } catch (deleteError) {
        console.error("Error deleting message:", deleteError);
      }
    }
  }
};
