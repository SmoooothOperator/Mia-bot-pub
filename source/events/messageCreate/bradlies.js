const read_write = require("../../utils/read_write");
const bradmoji = ["pufferfish", "brad"];
const catMemes = [
  ":Zyessir:",
  ":sad:",
  ":nooo:",
  ":sadthumbsup:",
  ":Catting:",
  ":CatPray:",
  ":CA100RJI_popcatblankie:",
  ":ForYou:",
  ":CA100RJI_happycat:",
  ":CA100RJI_trollcatlaugh:",
  ":smugcat:",
  ":EatEatEat:",
  ":sadfistcat:",
  ":CA100RJI_2_Sadcatgun:",
  ":catnobanana:",
  ":CatDance:",
  ":CA100RJI_CatVibin:",
  ":balls:",
  ":NerdCat:",
  ":rat_jump:",
  ":rat_pat:",
  ":copdootbear:",
  ":pog_rat:",
  ":rat_rolled_newspaper:",
  ":rat_menacing:",
  ":CB_duck_kisses:",
  ":bonk:",
];
const bradmessage = ["cat", "rat"];
const replyTargets = ["307977164240846849"];

let bradCatCounter = 0;

module.exports = async (client, message) => {
  let existing_file = await read_write("bradCtr.json", 0);
  //if file is empty
  if (!existing_file) {
    existing_file = {};
    existing_file.bradCtr = bradCatCounter;
  }
  //Get the message the user sent
  console.log(message.content);

  messageContent = message.content.toString();
  //See if the message includes any stings in catMemes[]
  catDetected = catMemes.some((catMeme) => messageContent.includes(catMeme));
  //if target includes the message sender id
  if (replyTargets.includes(message.author.id) && catDetected === true) {
    console.log(message.content);
    existing_file.bradCtr += 1;
    if (existing_file.bradCtr == 5) {
      existing_file.bradCtr = 0;
      await message.reply(
        `Bradley has reached 5 warnings, recommend timeout <@${"756272221944676484"}>`
      );
    } else {
      await message.reply(
        `Bradley's Illegal Emoji detected, incrementing counter... Bradley now has ${existing_file.bradCtr} warnings. Bradley will be timed out at 5 warnings.`
      );
    }
    //save bradCatCounter to file at the end
    await read_write("bradCtr.json", 1, existing_file);
  } else if (
    (replyTargets.includes(message.author.id) &&
      message.content.toLowerCase().includes("cat")) ||
    (replyTargets.includes(message.author.id) &&
      message.content.toLowerCase().includes("rat"))
  ) {
    existing_file.bradCtr += 1;
    if (existing_file.bradCtr == 5) {
      existing_file.bradCtr = 0;
      await message.reply(
        `Bradley has reached 5 warnings, recommend timeout <@${"756272221944676484"}>`
      );
    } else {
      await message.reply(
        `Bradley's message related to cat or rat, incrementing counter... Bradley now has ${existing_file.bradCtr} warnings. Bradley will be timed out at 5 warnings.`
      );
    }
    //save bradCatCounter to file at the end
    await read_write("bradCtr.json", 1, existing_file);
  }
};
