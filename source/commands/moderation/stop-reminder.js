const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

// Import the activeReminders map from the reminder command
const reminderModule = require("./reminder.js");

module.exports = {
  name: "stop-reminder",
  description: "Stop an active reminder",
  adminOnly: true,
  options: [
    {
      name: "reminder_id",
      description:
        "The ID of the reminder to stop (leave empty to see all active reminders)",
      required: false,
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    try {
      const activeReminders = reminderModule.getActiveReminders();
      const reminderId = interaction.options.getString("reminder_id");

      // Filter reminders for this guild
      const guildReminders = Array.from(activeReminders.entries()).filter(
        ([id]) => id.startsWith(interaction.guildId)
      );

      if (guildReminders.length === 0) {
        return await interaction.reply({
          content: "❌ No active reminders found in this server.",
          ephemeral: true,
        });
      }

      // If no ID provided, show all active reminders
      if (!reminderId) {
        const reminderList = guildReminders
          .map(([id, data], index) => {
            const timeLeft = Math.max(0, data.endTime - Date.now());
            const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutesLeft = Math.floor(
              (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
            );

            return `**${index + 1}.** ID: \`${id}\`\n   Message: "${
              data.message
            }"\n   Channel: <#${
              data.channel
            }>\n   Time left: ${hoursLeft}h ${minutesLeft}m\n   Frequency: Every ${
              data.frequency
            } minutes`;
          })
          .join("\n\n");

        return await interaction.reply({
          content: `📋 **Active Reminders:**\n\n${reminderList}\n\nUse \`/stop-reminder reminder_id:<ID>\` to stop a specific reminder.`,
          ephemeral: true,
        });
      }

      // Stop specific reminder
      if (!activeReminders.has(reminderId)) {
        return await interaction.reply({
          content:
            "❌ Reminder not found. Use `/stop-reminder` without parameters to see active reminders.",
          ephemeral: true,
        });
      }

      const reminderData = activeReminders.get(reminderId);
      clearInterval(reminderData.interval);
      activeReminders.delete(reminderId);

      // Send final message to the reminder channel
      const channel = client.channels.cache.get(reminderData.channel);
      if (channel) {
        // Handle both role and user pings - role starts with <@&, user starts with <@
        const mentionTarget = reminderData.role.startsWith('<@&') 
          ? reminderData.role  // Already formatted role mention
          : reminderData.role.startsWith('<@') 
            ? reminderData.role  // Already formatted user mention
            : `<@${reminderData.role}>`; // Fallback for user ID

        await channel.send(
          `🛑 **Reminder stopped by administrator:** ${reminderData.message}\n${mentionTarget} - This reminder has been manually stopped.`
        );
      }

      await interaction.reply({
        content: `✅ Successfully stopped reminder: "${reminderData.message}"`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error in stop-reminder command:", error);
      await interaction.reply({
        content: `❌ There was an error stopping the reminder: ${error.message}`,
        ephemeral: true,
      });
    }
  },
};
