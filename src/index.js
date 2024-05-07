require("dotenv/config");
require("colors");

const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder, ChannelType } = require("discord.js");
const { readdirSync } = require("fs");
const config = require('./config/config.json')

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.GuildMember],
  presence: {
    activities: [{ name: `Give ⭐`, type: 0 }],
    status: "online"
  }
});

client.commands = new Collection();
const voiceData = new Collection();
client.config = require("./config/config.json")

const handlerFolder = readdirSync("./src/handlers").filter((f) =>
  f.endsWith(".js")
);
for (const handler of handlerFolder) {
  const handlerFile = require(`./handlers/${handler}`);
  handlerFile(client);
}

// Mention Response
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const mentionsEveryone = message.mentions.everyone;
  const mentionsHere = message.content.includes("@here");
  const isReplyMention = message.type === "REPLY";

  if (mentionsEveryone || mentionsHere || isReplyMention) return;

  if (message.mentions.has(client.user.id)) {
    const embed = new EmbedBuilder()
      .setTitle(`Hello, I'm Template. Did you ping me?`)
      .setDescription(`Need help? Try </help:1230092671469486081>\n\ `)
      .setColor(0xFFFFFF)
      .setFooter({ text: "Made by Grezaski" })

    message.reply({ embeds: [embed] });
  }
});

// Event Code: When voiceData of any Member is updated
client.on("voiceStateUpdate", async (oldState, newState) => {
  const member = oldState.member;
  const guild = oldState.guild;

  // implement mongodb here for Multi guild bot, to fetch variables from database rather than JSON file
  const channelid = config.channelId;
  const userlimit = config.userLimit;
  const nameFormat = config.nameFormat;
  const categoryid = config.categoryId;
  const bitrate = config.bitrate;
  const memberPerms = config.memberPerms;
  const everyonePerms = config.everyonePerms;

  // ---------------------------------------------
  if (!channelid || channelid.length == 0) return console.log(`[J2C Bot] Channel ID is missing in config.json File or unable to get it from Database.`.bold.brightRed);
  const j2c = guild.channels.cache.get(channelid);
  if (!j2c) return console.log(`[J2C Bot] J2C Channel ID is not Valid.`.bold.brightRed);

  // When user is reconnects due to network issues
  if (newState.channel?.id == oldState.channel?.id) return;

  // Member joins J2C Channel
  if (newState.channel?.id == channelid) {
    // If user shifts from existing J2C VC to J2C Channel
    const data = voiceData.get(member.id);
    if (data && data.channel == oldState.channel?.id) return await member.voice.setChannel(data.channel).catch(e => console.log(`[J2C Bot] Missing Move member permission.`.red));

    // Creating a new VC for the user
    let vcId = await guild.channels.create({
      name: `${nameFormat} ${member.displayName}`,
      type: ChannelType.GuildVoice,
      parent: categoryid.length == 0 ? j2c.parentId : categoryid,
      bitrate: bitrate,
      permissionOverwrites: [
        {
          id: member.id,
          allow: [memberPerms],
        },
        {
          id: guild.id,
          allow: [everyonePerms],
        },
      ],
      userLimit: userlimit
    }).then(c => c.id, e => console.log(`[Bot] Something went wrong while creating a new VC for ${member.displayName}: ${e}`.red));

    if (!vcId) return;
    // Data to store in collection: Modify the object according to your needs.
    voiceData.set(member.id, { channel: vcId, time: Date.now() });
    return await member.voice.setChannel(vcId).catch(e => console.log(`[Bot] Missing Move member permission.`.red));
  }

  // Member leaves J2C VC
  const data = voiceData.get(member.id);
  if (!data) return;
  if (oldState.channel?.id != data.channel) return;
  const remainingMembers = oldState.channel.members.filter(m => !m.user.bot).map((m) => m.id);

  if (remainingMembers.length == 0) {
    oldState.channel.delete().catch(e => console.log(`[Bot] Missing Channel Delete permission.`.red));
    return voiceData.delete(member.id);
  } else {
    let otherVcMember = await guild.members.fetch(remainingMembers[0]).catch(e => null);
    if (!otherVcMember) {
      oldState.channel.delete().catch(e => console.log(`[Bot] Missing Channel Delete permission.`.red));
      return voiceData.delete(member.id);
    }

    oldState.channel.setName(`${nameFormat} ${otherVcMember.displayName}`).catch(e => null);
    voiceData.set(otherVcMember.id, { channel: oldState.channel.id, time: Date.now() });
    voiceData.delete(member.id);
  }
});

client.login(config.Token);
