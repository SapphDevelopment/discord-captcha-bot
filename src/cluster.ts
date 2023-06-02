import { ClusterManager, HeartbeatManager } from "discord-hybrid-sharding";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import "dotenv/config";

const manager = new ClusterManager(
  `${dirname(fileURLToPath(import.meta.url))}/bot.js`,
  {
    totalShards: "auto",
    shardsPerClusters: 3,
    mode: "process",
    token: process.env.DISCORD_TOKEN,
  }
);

manager.on("clusterCreate", (cluster) =>
  console.log(`Launched Cluster ${cluster.id}`)
);
manager.spawn({ timeout: -1 });

manager.extend(
  new HeartbeatManager({ interval: 2000, maxMissedHeartbeats: 5 })
);
