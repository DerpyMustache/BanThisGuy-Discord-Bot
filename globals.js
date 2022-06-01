const Discord = require("discord.js")
require("dotenv").config()
const client = new Discord.Client({ intents: [ "GUILDS",
 "GUILD_MESSAGES",
 "GUILD_MEMBERS" ] });
const guildData = new Map()
client.on("ready", () =>  {
guilds = client.guilds.cache
guilds.forEach(guild => {
    guildData.set(guild.id,{
        banMessage:["Can we ban this guy"],
        preBanQuip: [],
        postBanQuip: [],
        })
});
})
client.on("guildCreate", guild => {
    id = guild.id
    guildData.set(id,{
        banMessage:["Can we ban this guy"],
        preBanQuip: [],
        postBanQuip: [],
        })
});


module.exports = guildData

client.login(process.env.TOKEN)