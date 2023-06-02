import { DiscordClient } from "../../bot.js";
import { SubCommand } from "../../typings/index";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

const command: SubCommand = {
  subCommand: "verification.configure",
  execute: async (
    interaction: ChatInputCommandInteraction,
    client: DiscordClient
  ) => {
    const { options, guild } = interaction;
    const isVerificationEnabled = options.getBoolean("enable") ?? false;
    const verificationdRole = options.getRole("role")?.id ?? "";
    const guildId = guild?.id ?? "";

    try {
      const settings = await client.db.guild.findUnique({
        where: { id: guildId },
        select: { id: true, captcha: true },
      });
      if (settings) {
        await client.db.captcha.update({
          where: { id: guildId },
          data: { isEnabled: isVerificationEnabled, role: verificationdRole },
        });
      } else {
        await client.db.guild.create({
          data: {
            id: guildId,
            captcha: {
              create: {
                isEnabled: isVerificationEnabled,
                role: verificationdRole,
              },
            },
          },
        });
      }

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colors.green)
            .setDescription(
              `${client.config.emojis.success} successfully created the data.`
            ),
        ],
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colors.red)
            .setDescription(
              `${client.config.emojis.error} Failed to update/create the data.`
            ),
        ],
        ephemeral: true,
      });
    }
  },
};

export default command;
