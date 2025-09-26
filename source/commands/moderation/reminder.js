const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

// Store active reminders
const activeReminders = new Map();

// Export function to access activeReminders from other files
function getActiveReminders() {
  return activeReminders;
}

module.exports = {
  name: "reminder",
  description: "Set up a recurring reminder with role or user ping",
  adminOnly: true,
  options: [
    {
      name: "target",
      description: "The role or user to ping",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "message",
      description: "The reminder message",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "frequency",
      description: "How often to send the reminder (in minutes)",
      required: true,
      type: ApplicationCommandOptionType.Integer,
      min_value: 1,
      max_value: 10080, // Max 1 week in minutes
    },
    {
      name: "duration",
      description: "How long the reminder should last (in hours)",
      required: true,
      type: ApplicationCommandOptionType.Integer,
      min_value: 1,
      max_value: 168, // Max 1 week in hours
    },
    {
      name: "channel",
      description: "Channel to send reminders to (defaults to current channel)",
      required: false,
      type: ApplicationCommandOptionType.Channel,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    try {
      const target = interaction.options.getMentionable("target");
      const message = interaction.options.getString("message");
      const frequencyMinutes = interaction.options.getInteger("frequency");
      const durationHours = interaction.options.getInteger("duration");
      const targetChannel =
        interaction.options.getChannel("channel") || interaction.channel;

      // Convert to milliseconds
      const frequencyMs = frequencyMinutes * 60 * 1000;
      const durationMs = durationHours * 60 * 60 * 1000;
      const endTime = Date.now() + durationMs;

      // Create unique reminder ID
      const reminderId = `${interaction.guildId}_${Date.now()}`;

      // Send initial confirmation
      await interaction.reply({
        content: `✅ Reminder set!\n**Target:** ${target}\n**Message:** ${message}\n**Frequency:** Every ${frequencyMinutes} minutes\n**Duration:** ${durationHours} hours\n**Channel:** ${targetChannel}\n**Reminder ID:** \`${reminderId}\`\n\n*Use \`/stop-reminder reminder_id:${reminderId}\` to stop this reminder early.*`,
        ephemeral: true,
      });

      // Function to send reminder
      const sendReminder = () => {
        if (Date.now() >= endTime) {
          // Stop the reminder
          clearInterval(reminderInterval);
          activeReminders.delete(reminderId);
          targetChannel.send(
            `⏰ **Reminder ended:** ${message}\n${target} - This was the final reminder.`
          );
          return;
        }

        targetChannel.send(`⏰ **Reminder:** ${message}\n${target}`);
      };

      // Send first reminder immediately
      sendReminder();

      // Set up recurring reminder
      const reminderInterval = setInterval(sendReminder, frequencyMs);

      // Store reminder info
      activeReminders.set(reminderId, {
        interval: reminderInterval,
        endTime: endTime,
        role: target.toString(),
        message: message,
        channel: targetChannel.id,
        frequency: frequencyMinutes,
        guildId: interaction.guildId,
        createdBy: interaction.user.id,
      });

      // Auto-cleanup after duration
      setTimeout(() => {
        if (activeReminders.has(reminderId)) {
          clearInterval(reminderInterval);
          activeReminders.delete(reminderId);
        }
      }, durationMs);
    } catch (error) {
      console.error("Error in reminder command:", error);
      await interaction.reply({
        content: `❌ There was an error setting up the reminder: ${error.message}`,
        ephemeral: true,
      });
    }
  },
  getActiveReminders,
};
