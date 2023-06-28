import { DiscordClient } from "../../bot.js";
import { CommandInterface, EventInterface } from "../../typings/index";
import { Events, ChatInputCommandInteraction } from "discord.js";

const event: EventInterface = {
  name: Events.InteractionCreate,
  options: { once: false, rest: false },
  execute: async (
    interaction: ChatInputCommandInteraction,
    client: DiscordClient
  ) => {
    if (!interaction.isChatInputCommand()) return;
    const command: CommandInterface | undefined = client.commands.get(
      interaction.commandName
    );
    if (!command) {
      return interaction.reply({
        content: `${client.config.emojis.error} oh no! And error occured :(`,
        ephemeral: true,
      });
    }

    const subcommand = interaction.options.getSubcommand(false);
    try {
      if (subcommand) {
        const subCommandFile = client.subcommands.get(
          `${interaction.commandName}.${subcommand}`
        );
        subCommandFile?.execute(interaction, client);
      } else {
        command.execute(interaction, client);
      }
    } catch (error) {
      return interaction.reply({
        content: `${client.config.emojis.error} oh no! And error occured :(`,
        ephemeral: true,
      });
    }
  },
};
export default event;
