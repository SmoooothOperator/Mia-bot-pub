const banSpammer = require("./source/events/messageCreate/ban_spammer.js");
const { boardChannelID } = require("./constants.js");

// 1. Mock the Discord Client
const mockClient = {
  channels: {
    cache: {
      get: (id) => {
        // Return a fake channel object based on the ID requested
        if (id === boardChannelID) {
          return {
            send: async (msg) =>
              console.log(
                `\nUsing BOARD CHANNEL to send:\n------------------\n${msg}\n------------------`,
              ),
          };
        }
        // Verify/Public Log Channel
        if (id === "902108236713426975") {
          return {
            send: async (msg) =>
              console.log(`\nUsing VERIFY CHANNEL to send:\n"${msg}"`),
          };
        }
        return null;
      },
    },
  },
};

// 2. Mock the Message Object
const mockMessage = {
  // This must match the 'testChannelID' in your ban_spammer.js for the logic to run
  channel: { id: "1375169221415276564" },

  // Test Spam Content
  content:
    "Hello . @everyone I want to give out my Mac Book Air 2021& Charger for free, it's in perfect health and good as new, alongside a charger so it's perfect, I want to give it out because I just got a new model and I thought of giving out the old one to someone who can't afford one and is in need of it... Strictly First come first serve !",

  author: {
    bot: false,
    id: "1234567890",
    tag: "TestSpammer#0000",
    toString: () => "<@1234567890>",
  },

  guild: {
    members: {
      fetch: async (id) => {
        console.log(`\n[System] Fetching member ${id} to ban...`);
        return {
          // The mock Ban function
          ban: async (options) => {
            console.log(`\n✅ SUCCESS: Member.ban() was called!`);
            console.log(`   Reason: "${options.reason}"`);
            return true;
          },
        };
      },
    },
  },
  reply: async (msg) => console.log(`[Bot Reply]: ${msg}`),
};

// 3. Run the Test
console.log("--- Starting Local Spam Ban Test ---");
console.log(`Testing message: "${mockMessage.content}"`);

banSpammer(mockClient, mockMessage)
  .then(() => {
    console.log("\n--- Test Completed ---");
  })
  .catch((err) => {
    console.error("Test Crashed:", err);
  });
