const Discord = require("discord.js");

module.exports = {
  name: "msg",
  aliases: [" "],
  run: async (client, message, args, guild) => {
    
    if (!message.member.hasPermission(["ADMINISTRATOR"]))
      return message.channel.send("`Sorry, you don't have permissions to use this!`");
         if(!message.mentions.members.first()) return message.channel.send("`Please ping someone to execute the command!`")

//    message.delete().catch(O_o => {});

    let sayMessage = args.slice(1).join(" ");
    let user = message.mentions.users.first();

    try {
      await user.send(sayMessage);
      message.channel.send(`✅ Successfully sent a DM to **${user.username}**.`);
    } catch (err) {
      message.channel.send(`❌ I couldn't send a DM to **${user.username}**. They may have DMs disabled or have blocked the bot.`);
    }

    //user.send(sayMessage);
  }
}