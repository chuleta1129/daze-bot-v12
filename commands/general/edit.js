const Discord = require("discord.js");

module.exports = {
  name: "edit",
  aliases: [" "],
  run: async (client, message) => {

    let args = message.content.split(" | ");

    // =embedit | messageID | title | body | thumbnail | image | color

    const messageId = args[1];

    let embed = new Discord.MessageEmbed()
      .setTitle(args[2])
      .setDescription(args[3])
      .setFooter(args[4])
      .setThumbnail(args[5])
      .setImage(args[6])
      .setColor(args[7]);

    try {
      const msg = await message.channel.messages.fetch(messageId);

      await msg.edit(embed);

      message.reply("embed updated!");
    } catch (err) {
      message.reply("couldn't find that message.");
    }
  }
};