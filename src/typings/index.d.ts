import {
  SlashCommandBuilder,
  ClientEvents,
  PermissionFlagsBits,
  ColorResolvable,
} from "discord.js";

export type ObjectNameIDArray = Array[{ name: string; id: string }];

export interface ConfigInterface {
  bot: {
    token: string;
  };
  guilds: ObjectNameIDArray;
  colors: Object[ColorResolvable];
  emojis: Object[(...args: any[]) => any];
}

export interface EventInterface {
  name: keyof ClientEvents;
  options: { rest: boolean; once: boolean };
  execute: (...args: any[]) => any;
}

export interface CommandInterface {
  cooldown?: number;
  subCommand?: string;
  data: SlashCommandBuilder | any;
  execute: (...args: any[]) => any;
}

export interface SubCommandInterface {
  cooldown?: number;
  subCommand?: string;
  data: SlashCommandBuilder | any;
}

export interface SubCommand {
  subCommand: string;
  execute: (...args: any[]) => any;
}