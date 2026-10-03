// Crash Protection
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});


require("dotenv").config();

const fs = require("fs");
const express = require("express");
const Discord = require("discord.js");
const { Client, Collection } = require("discord.js");

const app = express();

app.use(express.json());


// Web Server
app.get("/", (req, res) => {
  res.send("Bot web server online!");
});


// Advancement Export Receiver
const advtop = require("./events/advtop");

app.post("/advancements", (req, res) => {
  console.log("✅ Advancement data received");

  try {
    fs.writeFileSync(
      "advancements.json",
      JSON.stringify(req.body, null, 2)
    );

    advtop.setAdvancementData(req.body, client);

    res.send("OK");

  } catch (err) {
    console.error("Advancement save error:", err);
    res.status(500).send("Error");
  }
});


// Express Start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});



// Discord Client
const client = new Client({
  disableEveryone: false
});


client.commands = new Collection();
client.aliases = new Collection();



// Load Commands
["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});



// Discord Errors
client.on("error", console.error);

client.on("shardError", error => {
  console.error("Discord shard error:", error);
});

client.on("disconnect", () => {
  console.log("Discord disconnected");
});



// Bot Ready
client.on("ready", () => {

  console.log(
    `・${client.user.username} is now online and part of ${client.guilds.cache.size} guilds.`
  );


  client.user.setPresence({
    status: "online",
    activity: {
      name: "",
      type: "PLAYING"
    }
  });


  require("./events/baltop")(client);

  advtop.start(client);

});



// DM + Commands
client.on("message", async message => {

  const prefix = process.env.PREFIX;


  if (message.author.bot) return;


  // DM Logger
  if (message.channel.type === "dm") {

    const logChannel = client.channels.cache.get(
      process.env.DM_LOG_CHANNEL_ID
    );


    if (!logChannel) return;


    const embed = new Discord.MessageEmbed()

      .setAuthor(
        message.author.username,
        message.author.displayAvatarURL({
          dynamic: true
        })
      )

      .setDescription(message.content)

      .addField(
        "User ID",
        message.author.id
      )

      .setTimestamp();


    return logChannel.send(embed);
  }



  // 67 message
  if (message.content.includes("67")) {
    message.channel.send("67");
  }



  // Commands
  if (!message.content.startsWith(prefix)) return;


  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);


  const cmd = args.shift().toLowerCase();


  let command = client.commands.get(cmd);


  if (!command) {
    command = client.commands.get(
      client.aliases.get(cmd)
    );
  }


  if (command) {
    command.run(client, message, args);
  }

});



// Start Minecraft Advancement Exporter
require("./adv_export.js");



// Login
client.login(process.env.TOKEN);