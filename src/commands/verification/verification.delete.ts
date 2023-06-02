import { DiscordClient } from "../../bot.js";
import { SubCommand } from "../../typings/index";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

const command: SubCommand = {
  subCommand: "verification.delete",
  execute: async (
    interaction: ChatInputCommandInteraction,
    client: DiscordClient
  ) => {
    const guildId = interaction.guild?.id;

    try {
      await client.db.captcha.deleteMany({
        where: { guild: { id: guildId } },
      });

      await client.db.guild.delete({
        where: { id: guildId },
      });

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colors.green)
            .setDescription(
              `${client.config.emojis.success} Data has been deleted successfully.`
            ),
        ],
        ephemeral: true,
      });
    } catch (error) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colors.red)
            .setDescription(
              `${client.config.emojis.error} Failed to delete the data.`
            ),
        ],
        ephemeral: true,
      });
    }
  },
};
export default command;
