import { DiscordClient } from "../bot.js";

export async function getGuilds(client: DiscordClient) {
  const guildCounts = await client.cluster.fetchClientValues("guilds.cache.size");
  const totalGuilds = guildCounts.reduce(
    (prev: number, val: number) => prev + val,
    0
  );
  return totalGuilds;
}

export async function getUsers(client: DiscordClient) {
  const guildCounts = (
    await client.cluster.broadcastEval((c) =>
      c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
    )
  ).reduce((acc, memberCount) => acc + memberCount, 0);
  return guildCounts;
}
