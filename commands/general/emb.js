const Discord = require("discord.js");

module.exports = {
  name: "emb",
  aliases: [" "],
  run: async (client, message, guild) => {

let args = message.content.split(" | ");

//    message.delete().catch(O_o => {});
    
    const embed = new Discord.MessageEmbed()
  
      .setTitle(args[1])
      .setDescription(args[2])
      .setFooter(args[3])
      .setThumbnail(args[4])
      .setImage(args[5])
      .setColor(args[6])

    message.channel.send(embed);
  }
};