const Discord = require("discord.js")

require("dotenv").config()

const client = new Discord.Client({ intents: [ "GUILDS",
 "GUILD_MESSAGES",
 "GUILD_MEMBERS" ] });

let bot = {
  client
 }

client.slashcommands = new Discord.Collection()
client.loadSlashCommands = (bot, reload) => require("./handlers/slashcommands")(bot, reload)
client.loadSlashCommands(bot, false)

client.on("ready", async () => {
     await client.application.commands.set([...client.slashcommands.values()])
     console.log(`Succesfully loaded in ${client.slashcommands.size}`)
     process.exit(0)
})

client.login(process.env.TOKEN)