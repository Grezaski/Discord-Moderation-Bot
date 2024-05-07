const { readdirSync } = require("fs");
const { Client } = require("discord.js");

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  const eventFolders = readdirSync("./src/events").filter((f) =>
    f.endsWith(".js")
  );
  for (const event of eventFolders) {
    const eventFile = require(`../events/${event}`);
    if (eventFile.once) {
      client.once(eventFile.name, (...args) =>
        eventFile.execute(...args, client)
      );
    } else {
      client.on(eventFile.name, (...args) =>
        eventFile.execute(...args, client)
      );
    }
  }
};
