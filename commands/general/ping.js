const Discord = require("discord.js");

module.exports = {
  name: "ping",
  aliases: [" "],
  run: async (client, message, args, guild) => {
    
    const embed = new Discord.MessageEmbed()
    .setColor(process.env.COLOR)
    .setDescription(`\`\`Pong! Latency is ${Date.now() - message.createdTimestamp} ms. API Latency is ${Math.round(
        client.ws.ping
      )} ms!\`\``);
    
   message.channel.send(embed
    )
  }
}
