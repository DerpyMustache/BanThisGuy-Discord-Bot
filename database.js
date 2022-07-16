const mongoUtil = require( './mongoUtil' );
const Discord = require("discord.js")
require("dotenv").config()
const client = new Discord.Client({ intents: [ "GUILDS",
 "GUILD_MESSAGES",
 "GUILD_MEMBERS" ] });

client.on("ready", async () =>  {   
    const db = await mongoUtil.getDb();
    guilds = client.guilds.cache
    guilds.forEach(guild => {
    db.collection("phrasedata").countDocuments({_id: guild.id}, { limit: 1 }).then(num =>{
        if(num != 1)
        {
            db.collection("phrasedata").insertOne(
                {
                    _id: guild.id,
                    banMessage:["can we ban this guy"],
                    preBanQuip: [],
                    postBanQuip: [],
                }
            );
        }
        })
    });
})

client.on("guildCreate", async guild => {
    const db = await mongoUtil.getDb();
    id = guild.id
    db.collection("phrasedata").countDocuments({_id: id}, { limit: 1 }).then(num =>{
        if(num != 1)
        {
            db.collection("phrasedata").insertOne(
                {
                    _id: id,
                    banMessage:["can we ban this guy"],
                    preBanQuip: [],
                    postBanQuip: [],
                }
            );
        }
    })
});


client.login(process.env.TOKEN)