module.exports = async (client, message) => {
  const catFishRoast = [
    "The Catfish is still broken",
    "At this rate, the Catfish will be forever broken",
    "That slow car? It will likely never run again",
    "Still down",
    "The Catfish remains stubbornly broken.",
    "Seems like the Catfish is destined to be forever broken. What a shame.",
    "The Catfish is stuck in its broken state, and there's a loss on how to fix it.",
    "The Catfish has become an inmovable object, permanently",
  ];

  const catFishAlive =
    "Actually the catfish is running, for the moment at least.";
  const replyTargets = ["551279669979119616", "389306806393896960"];

  if (
    replyTargets.includes(message.author.id) &&
    message.content.toLowerCase().includes("mia") &&
    message.content.toLowerCase().includes("catfish")
  ) {
    const randomIndex = Math.floor(Math.random() * catFishRoast.length);
    const catFishReply = catFishRoast[randomIndex];
    await message.reply(catFishAlive);
  } else if (
    replyTargets.includes(message.author.id) &&
    message.content.toLowerCase().includes("mia") &&
    message.content.toLowerCase().includes("running") &&
    message.content.toLowerCase().includes("catfish")
  ) {
    await message.reply(catFishAlive);
  }
};
