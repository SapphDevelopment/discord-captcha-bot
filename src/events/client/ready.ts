import { DiscordClient } from "../../bot.js";
import { EventInterface } from "../../typings/index.js";
import { Events } from "discord.js";

const event: EventInterface = {
  name: Events.ClientReady,
  options: { once: true, rest: false },
  execute: async (client: DiscordClient) => {
    console.log(`Logged in as ${client.user?.username}`);
  },
};
export default event;
