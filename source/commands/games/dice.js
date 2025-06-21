const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "dice",
  description: "Roll dice with various options!",
  options: [
    {
      name: "sides",
      description: "Number of sides on the die (default: 6)",
      type: 4, // INTEGER
      required: false,
      min_value: 2,
      max_value: 100,
    },
    {
      name: "count",
      description: "Number of dice to roll (default: 1)",
      type: 4, // INTEGER
      required: false,
      min_value: 1,
      max_value: 10,
    },
  ],

  callback: async (client, interaction) => {
    const sides = interaction.options.getInteger("sides") || 6;
    const count = interaction.options.getInteger("count") || 1;

    const rolls = [];
    let total = 0;

    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rolls.push(roll);
      total += roll;
    }

    // Get appropriate emoji based on die type
    const getDiceEmoji = (roll, sides) => {
      if (sides === 6) {
        const diceEmojis = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
        return diceEmojis[roll - 1] || "🎲";
      }
      return "🎲";
    };

    const rollsDisplay = rolls
      .map((roll, index) => {
        if (sides === 6) {
          return `${getDiceEmoji(roll, sides)} **${roll}**`;
        }
        return `🎲 **${roll}**`;
      })
      .join("  ");

    const embed = new EmbedBuilder()
      .setTitle("🎲 Dice Roll!")
      .setColor(0x00bfff)
      .addFields(
        {
          name: "🎯 Configuration",
          value: `${count}d${sides} (${count} dice with ${sides} sides each)`,
          inline: false,
        },
        { name: "🎲 Results", value: rollsDisplay || "🎲 **1**", inline: false }
      )
      .setTimestamp();

    if (count > 1) {
      embed.addFields({
        name: "📊 Total",
        value: `**${total}**`,
        inline: true,
      });
      embed.addFields({
        name: "📈 Average",
        value: `**${(total / count).toFixed(1)}**`,
        inline: true,
      });
    }

    // Add special messages for certain rolls
    if (sides === 6 && count === 1) {
      if (rolls[0] === 1) {
        embed.setDescription("💀 Snake eyes! Better luck next time!");
      } else if (rolls[0] === 6) {
        embed.setDescription("🎉 Lucky six! Nice roll!");
      }
    } else if (count > 1) {
      const maxPossible = count * sides;
      const minPossible = count;

      if (total === maxPossible) {
        embed.setDescription("🏆 PERFECT ROLL! Maximum possible score!");
      } else if (total === minPossible) {
        embed.setDescription("💀 Minimum roll... That's rough!");
      } else if (total >= maxPossible * 0.9) {
        embed.setDescription("🔥 Excellent roll! Very high!");
      } else if (total <= minPossible * 1.5) {
        embed.setDescription("😅 Pretty low roll, but that's how dice work!");
      }
    }

    const rollAgainButton = new ButtonBuilder()
      .setCustomId(`dice_again_${interaction.user.id}_${sides}_${count}`)
      .setLabel("🎲 Roll Again")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(rollAgainButton);

    await interaction.reply({ embeds: [embed], components: [row] });

    // Handle button interaction
    const filter = (i) =>
      i.customId.startsWith(`dice_again_${interaction.user.id}`) &&
      i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      if (
        i.customId === `dice_again_${interaction.user.id}_${sides}_${count}`
      ) {
        const newRolls = [];
        let newTotal = 0;

        for (let j = 0; j < count; j++) {
          const roll = Math.floor(Math.random() * sides) + 1;
          newRolls.push(roll);
          newTotal += roll;
        }

        const newRollsDisplay = newRolls
          .map((roll) => {
            if (sides === 6) {
              return `${getDiceEmoji(roll, sides)} **${roll}**`;
            }
            return `🎲 **${roll}**`;
          })
          .join("  ");

        const newEmbed = new EmbedBuilder()
          .setTitle("🎲 Dice Roll!")
          .setColor(0x00bfff)
          .addFields(
            {
              name: "🎯 Configuration",
              value: `${count}d${sides} (${count} dice with ${sides} sides each)`,
              inline: false,
            },
            {
              name: "🎲 Results",
              value: newRollsDisplay || "🎲 **1**",
              inline: false,
            }
          )
          .setTimestamp();

        if (count > 1) {
          newEmbed.addFields({
            name: "📊 Total",
            value: `**${newTotal}**`,
            inline: true,
          });
          newEmbed.addFields({
            name: "📈 Average",
            value: `**${(newTotal / count).toFixed(1)}**`,
            inline: true,
          });
        }

        // Add special messages for new rolls
        if (sides === 6 && count === 1) {
          if (newRolls[0] === 1) {
            newEmbed.setDescription("💀 Snake eyes! Better luck next time!");
          } else if (newRolls[0] === 6) {
            newEmbed.setDescription("🎉 Lucky six! Nice roll!");
          }
        } else if (count > 1) {
          const maxPossible = count * sides;
          const minPossible = count;

          if (newTotal === maxPossible) {
            newEmbed.setDescription("🏆 PERFECT ROLL! Maximum possible score!");
          } else if (newTotal === minPossible) {
            newEmbed.setDescription("💀 Minimum roll... That's rough!");
          } else if (newTotal >= maxPossible * 0.9) {
            newEmbed.setDescription("🔥 Excellent roll! Very high!");
          } else if (newTotal <= minPossible * 1.5) {
            newEmbed.setDescription(
              "😅 Pretty low roll, but that's how dice work!"
            );
          }
        }

        await i.update({ embeds: [newEmbed], components: [row] });
      }
    });

    collector.on("end", () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        rollAgainButton.setDisabled(true)
      );
      interaction.editReply({ components: [disabledRow] }).catch(() => {});
    });
  },
};
