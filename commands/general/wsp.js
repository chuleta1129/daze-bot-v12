const Discord = require("discord.js");

module.exports = {
  name: "wsp",
  aliases: [" "],
  run: async (client, message, args, guild) => {

    if (message.author.id === "853299726421065738") {

      const sayMessage = args.join(" ");

      message.delete().catch(O_o => { });

      message.channel.send(sayMessage).then(sentMessage => {
        sentMessage.delete();
      });

    } else {

      message.delete().catch(O_o => { });
      message.channel.send("`You dont have permissions to do that!`")

    }
  }
}