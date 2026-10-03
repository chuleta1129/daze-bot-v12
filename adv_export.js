require("dotenv").config();

const fs = require("fs");
const path = require("path");
const http = require("http");
const Database = require("better-sqlite3");
const { Rcon } = require("rcon-client");


const WORLD_PATH = process.env.WORLD_PATH;

const BOT_URL = process.env.BOT_URL || "http://127.0.0.1:3000/advancements";


const CMI_DB = new Database(
  process.env.CMI_DB_PATH,
  { readonly: true }
);


const RCON_CONFIG = {
  host: process.env.RCON_HOST,
  port: Number(process.env.RCON_PORT || 25575),
  password: process.env.RCON_PASSWORD
};



function getPlayerNames() {

  const cache = JSON.parse(
    fs.readFileSync(
      path.join(WORLD_PATH, "..", "usercache.json"),
      "utf8"
    )
  );

  let names = {};

  cache.forEach(player => {
    names[player.uuid] = player.name;
    names[player.uuid.replace(/-/g, "")] = player.name;
  });

  return names;
}



function stripColors(name) {

  return name
    .replace(/§x(§[0-9A-Fa-f]){6}/g, "")
    .replace(/§[0-9A-FK-ORa-fk-or]/g, "");

}



function getCMIDisplayName(uuid, fallback) {

  try {

    const row = CMI_DB
      .prepare(
        "SELECT DisplayName, nickname FROM users WHERE player_uuid = ?"
      )
      .get(uuid);


    if (!row) {

      return {
        mcName: "§f" + fallback,
        discordName: fallback
      };

    }


    let rawName = row.DisplayName || row.nickname || fallback;


    // Force white if no color is set
    if (!/§[0-9A-FK-ORa-fk-or]/.test(rawName)) {
      rawName = "§f" + rawName;
    }


    return {
      mcName: rawName,
      discordName: stripColors(rawName)
    };


  } catch (err) {

    console.log("CMI Database Error:", err);

    return {
      mcName: "§f" + fallback,
      discordName: fallback
    };

  }

}





async function getAdvancements() {

  const folder = path.join(
    WORLD_PATH,
    "players",
    "advancements"
  );


  const names = getPlayerNames();

  let players = [];


  for (const file of fs.readdirSync(folder)) {


    if (!file.endsWith(".json")) continue;


    const uuid = file.replace(".json", "");


    const uuidWithDashes = uuid.replace(
      /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
      "$1-$2-$3-$4-$5"
    );


    const data = JSON.parse(
      fs.readFileSync(
        path.join(folder, file)
      )
    );


    let completed = 0;


    for (const adv in data) {

      if (data[adv].done === true) {
        completed++;
      }

    }


    const username =
      names[uuid] ||
      names[uuidWithDashes] ||
      "Unknown";


    const namesData = getCMIDisplayName(
      uuidWithDashes,
      username
    );


    console.log(
      username,
      "=>",
      namesData.mcName,
      "🏆",
      completed
    );


    players.push({
      name: namesData.discordName,
      mcName: namesData.mcName,
      completed
    });

  }


  return players.sort(
    (a, b) => b.completed - a.completed
  );

}





async function updateAdvHologram(players) {

  try {

    const rcon = await Rcon.connect(RCON_CONFIG);


    for (let i = 0; i < 10; i++) {

      const player = players[i];


      await rcon.send(
        `cmi hologram editline advtop ${i + 2} &7#${i + 1} ${player?.mcName || "§fNone"} &f- &7${player?.completed || 0}`
      );

    }


    console.log("AdvTop hologram updated");


    await rcon.end();


  } catch (err) {

    console.log(
      "Hologram RCON Error:",
      err.message
    );

  }

}





async function sendAdvancements() {

  try {

    const advancements = await getAdvancements();


    await updateAdvHologram(
      advancements
    );


    const discordData = advancements.map(player => ({
      name: player.name,
      completed: player.completed
    }));


    const data = JSON.stringify(
      discordData
    );


    const req = http.request(
      BOT_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data)
        }
      },
      res => {

        console.log(
          "Sent:",
          res.statusCode
        );

      }
    );


    req.write(data);
    req.end();


  } catch (err) {

    console.log(
      "Export Error:",
      err.message
    );

  }

}



sendAdvancements();


setInterval(() => {

  sendAdvancements();

}, 300000);