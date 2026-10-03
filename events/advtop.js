const Discord = require("discord.js");

const CHANNEL_ID = process.env.ADVTOP_CHANNEL_ID;
const MESSAGE_ID = process.env.ADVTOP_MESSAGE_ID;

let advMessage;
const fs = require("fs");

let advancementData = [];

if (fs.existsSync("advancements.json")) {
  advancementData = JSON.parse(
    fs.readFileSync("advancements.json")
  );
}

function setAdvancementData(data, client) {
  advancementData = data;

  if (client) {
    updateAdvTop(client);
  }
}

async function updateAdvTop(client) {
  try {
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) return;

    let description = "";

    advancementData.slice(0, 10).forEach((player, index) => {
      description += `**${index + 1}.** ${player.name} — 🏆 ${player.completed}\n`;
    });

    const embed = new Discord.MessageEmbed()
      .setTitle("🏆 Server Advancement Top 🏆")
      .setDescription(description || "Waiting for data...")
      .setColor("#FFFFFF")
      .setTimestamp()
      .setFooter("Updates every 5 minutes");


    const msg = await channel.messages.fetch(MESSAGE_ID);
    await msg.edit(embed);

    console.log("✅ Advancement top updated!");

  } catch (err) {
    console.log("Advancement Top Error:", err);
  }
}


module.exports = {
  start(client) {
    console.log("Advancement top started!");

    updateAdvTop(client);

    setInterval(() => {
      updateAdvTop(client);
    }, 300000);
  },

  setAdvancementData
};