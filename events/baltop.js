const { Rcon } = require("rcon-client");
const Discord = require("discord.js");

const CHANNEL_ID = process.env.BALTOP_CHANNEL_ID;
const MESSAGE_ID = process.env.BALTOP_MESSAGE_ID;

const rconOptions = {
  host: process.env.RCON_HOST,
  port: Number(process.env.RCON_PORT || 25575),
  password: process.env.RCON_PASSWORD
};

let baltopMessage;

async function getBaltop() {
  const rcon = await Rcon.connect(rconOptions);

  const response = await rcon.send("cmi baltop");

  await rcon.end();

  return response;
}

async function updateBaltop(client) {
  try {
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) return console.log("Balance top channel not found.");

    const baltop = await getBaltop();

    console.log("✅ Balance top updated!");

    const embed = new Discord.MessageEmbed()
      .setTitle("💰 Server Balance Top 💰")
      .setDescription("```" + baltop + "```")
      .setColor("#FFFFFF")
      .setTimestamp()
      .setFooter("Updates every 5 minutes")

    if (MESSAGE_ID) {
      const msg = await channel.messages.fetch(MESSAGE_ID);
      await msg.edit(embed);
    } else if (!baltopMessage) {
      baltopMessage = await channel.send(embed);
    }

  } catch (err) {
    console.log("Balance Top Error:", err);
  }
}

module.exports = client => {
  console.log("Balance top started!");

  updateBaltop(client);

  setInterval(() => {
    updateBaltop(client);
  }, 300000);
};