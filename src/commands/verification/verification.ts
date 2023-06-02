import { SubCommandInterface } from "../../typings/index";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const command: SubCommandInterface = {
  data: new SlashCommandBuilder()
    .setName("verification")
    .setDescription("Manage the verification module")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("configure")
        .setDescription("Configure the verification module")
        .addBooleanOption((options) =>
          options
            .setName("enable")
            .setDescription("Enable or disable the verification system")
            .setRequired(true)
        )
        .addRoleOption((options) =>
          options
            .setName("role")
            .setDescription("Choose a role to give to verifiers")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Delete the verification data.")
    ),
};
export default command;
