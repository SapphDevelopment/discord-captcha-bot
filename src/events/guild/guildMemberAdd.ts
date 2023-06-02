import { DiscordClient } from "../../bot.js";
import { EventInterface } from "../../typings/index";
import {
  AttachmentBuilder,
  EmbedBuilder,
  Events,
  GuildMember,
  Message,
} from "discord.js";
import { CaptchaGenerator } from "captcha-canvas";

const event: EventInterface = {
  name: Events.GuildMemberAdd,
  options: { once: false, rest: false },
  execute: async (member: GuildMember, client: DiscordClient) => {
    let messages = {
      success: `${client.config.emojis.success} Thanks for joining us! You have now gained access to the server.`,
      failed: `${client.config.emojis.error} Oh no! You failed the verification stage. Please try again.`,
      timedout: `${client.config.emojis.error} Oh no! You failed! Next time, be a little faster.`,
      wrongCode: `${client.config.emojis.error} Oh no! You sent me the wrong captcha. Please try again.`,
      dmDisabled: `${client.config.emojis.error} Oh no! DMs are disabled.`,
      roleInvalid: `${client.config.emojis.error} Oh no! I couldn't find the verification role. Please contact a staff member.`,
      description: `In order to prove you have feelings, send a message with the letters and numbers highlighted in blue. You have three attempts -- good luck!`,
    };

    const { guild, id } = member;
    if (!guild) return;

    const settings = await client.db.guild.findUnique({
      where: { id: guild.id },
      select: { captcha: true },
    });

    if (!settings) return;
    if (!settings.captcha) return;
    if (!settings.captcha.isEnabled) return;
    if (!member.kickable) return;
    if (member.user.bot) return;

    const captcha = new CaptchaGenerator()
      .setDimension(150, 450)
      .setCaptcha({
        size: 60,
        color: client.config.colors.theme,
      })
      .setDecoy({ opacity: 0.5 })
      .setTrace({ color: client.config.colors.theme });
    const attachment = new AttachmentBuilder(captcha.generateSync(), {
      name: "captcha.png",
      description: "Captcha verification image.",
    });

    await member
      .send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: `${guild.name} | Captcha`,
              iconURL: `${guild.iconURL() || client.user?.displayAvatarURL()}`,
            })
            .setColor(client.config.colors.theme)
            .setDescription(messages.description)
            .setImage(`attachment://captcha.png`),
        ],
        files: [attachment],
      })
      .catch(() => {
        member.kick(messages.dmDisabled);
      });

    const filter = (msg: Message) => msg.author.id === id;
    const collector = member.dmChannel?.createMessageCollector({
      filter,
      time: 60000,
      max: 3,
    });

    let attempts = 0;
    collector?.on("collect", (msg) => {
      attempts++;
      const memberInput = msg.content.toLowerCase();

      if (memberInput === captcha.text?.toLowerCase()) {
        const role = guild.roles.cache.find(
          (r) => r.id === settings.captcha?.role
        );
        if (role) {
          member.roles.add(role);
          member.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.colors.green)
                .setDescription(messages.success),
            ],
          });
          if (attempts <= 2) {
            collector.stop();
          }
        } else {
          member.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.colors.green)
                .setDescription(messages.roleInvalid),
            ],
          });
        }
      } else {
        if (attempts >= 3) {
          member.kick(messages.failed);
          member.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.colors.green)
                .setDescription(messages.failed),
            ],
          });
        } else {
          member.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.colors.green)
                .setDescription(messages.wrongCode),
            ],
          });
        }
      }
    });

    collector?.on("end", (collected, reason) => {
      if (reason === "time") {
        member.kick(messages.failed);
        member.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.colors.green)
              .setDescription(messages.timedout),
          ],
        });
      }
    });
  },
};
export default event;
