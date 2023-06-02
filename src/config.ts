import { ConfigInterface } from "./typings/index";
import { ColorResolvable } from "discord.js";
import "dotenv/config";

export const config: ConfigInterface = {
  bot: { token: process.env.DISCORD_TOKEN as string },
  colors: {
    theme: "#5865f2" as ColorResolvable,
    green: "#00E09E" as ColorResolvable,
    red: "#FF434E" as ColorResolvable,
  },
  guilds: [{ name: "Test Server", id: "1087090760224084018" }],
  emojis: {
    success: "😊",
    error: "😥",
  },
};
