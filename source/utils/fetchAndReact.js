module.exports = async (emojiInput, client, message) => {
  try {
    //get all emojis that matches the name in given Emoji array
    const emojis = client.emojis.cache.filter((emoji) =>
      emojiInput.includes(emoji.name)
    );
    //if the emojis array is not null or empty
    if (emojis) {
      //for every element of emojis
      for (const emoji of emojis.values()) {
        // 11/8/24: Added .values() here because filter() returns a collection not an array, this makes it each emoji object the correct type
        //react with the string representation of the emoji object(required by discord)
        await message.react(emoji);
      }
    } else {
      console.log("No emojis found");
    }
  } catch (error) {
    console.error("Error reacting with emoji:", error);
  }
};
