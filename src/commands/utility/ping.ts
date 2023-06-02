import { DiscordClient } from "../../bot.js";
import { CommandInterface } from "../../typings/index";
import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

const command: CommandInterface = {
  cooldown: 3, // In seconds
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping bot to see if it is alive")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .setDMPermission(false),
  execute: async (
    interaction: ChatInputCommandInteraction,
    client: DiscordClient
  ) => {
    const msg = await interaction.deferReply({
      ephemeral: true,
      fetchReply: true,
    });

    const diff = msg.createdTimestamp - interaction.createdTimestamp;
    const ping = Math.round(client.ws.ping);
    return interaction.editReply(
      `${client.config.emojis.success} Pong 🏓! (Round trip took: ${diff}ms. Heartbeat: ${ping}ms.)`
    );
  },
};
export default command;
