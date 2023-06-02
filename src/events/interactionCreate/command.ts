import { DiscordClient } from "../../bot.js";
import { CommandInterface, EventInterface } from "../../typings/index";
import { Events, ChatInputCommandInteraction, Collection } from "discord.js";

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

    /**
     * Cooldown
     */
    const { cooldowns } = client;
    const defaultCooldownDuration = 5;
    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }
    let timestamps = cooldowns.get(command.data.name);
    if (!timestamps) {
      timestamps = new Collection<string, number>();
      cooldowns.set(command?.data.name, timestamps);
    }

    const now = Date.now();
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;
    if (timestamps?.has(interaction.user.id)) {
      const expirationTime =
        timestamps.get(interaction.user.id)! + cooldownAmount;
      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        return interaction.reply({
          content: `Please wait <t:${expiredTimestamp}:R> more second(s) before reusing the \`${command.data.name}\` command.`,
          ephemeral: true,
        });
      }
    }

    timestamps?.set(interaction.user.id, now);
    setTimeout(() => timestamps?.delete(interaction.user.id), cooldownAmount);

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
