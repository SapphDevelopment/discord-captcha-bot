import { DiscordClient } from "../../bot.js";
import { EventInterface } from "../../typings/index.js";
import { Events, ActivityType } from "discord.js";
import { getGuilds, getUsers } from "../../helpers/discord.js";

const event: EventInterface = {
  name: Events.ClientReady,
  options: { once: true, rest: false },
  execute: async (client: DiscordClient) => {
    async function getPresence() {
      const presences = [
        {
          name: `${await getGuilds(client)} Guilds`,
          type: ActivityType.Watching as const,
        },
        {
          name: `${await getUsers(client)} Users`,
          type: ActivityType.Watching as const,
        },
      ];

      const presence = presences[Math.floor(Math.random() * presences.length)];

      client.user?.setPresence({
        status: "online",
        activities: [
          {
            name: presence.name,
            type: presence.type,
          },
        ],
      });
    }

    await getPresence();
    setInterval(async function () {
      await getPresence();
    }, 1800000);
  },
};
export default event;
