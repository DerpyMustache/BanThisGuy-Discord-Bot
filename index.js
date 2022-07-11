const mongoUtil = require( './mongoUtil' );
const Discord = require("discord.js");
const { AutoPoster } = require('topgg-autoposter')
require("dotenv").config()
require("./database.js")
const client = new Discord.Client({ intents: [ "GUILDS",
 "GUILD_MESSAGES",
 "GUILD_MEMBERS" ] });
let bot = {
  client
 }
 
 client.on("ready", () => {

  const ap = AutoPoster(process.env.GG, client)

  ap.on('posted', () => {
    console.log('Posted stats to Top.gg!')
  })

})
client.slashcommands = new Discord.Collection()
client.loadSlashCommands = (bot, reload) => require("./handlers/slashcommands")(bot, reload)
client.loadSlashCommands(bot, false)



mongoUtil.connectToServer( function( err, client ) {
  if (err) console.log(err);
} );



client.on("interactionCreate", (interaction) => {
  if (interaction.isCommand())
    {
      const slashcmd = client.slashcommands.get(interaction.commandName)
      if (slashcmd.perms && (!interaction.member.permissions.has(slashcmd.perms[0]) && !interaction.member.permissions.has(slashcmd.perms[1])) )
      {
        return interaction.reply(`You do not have permission for this command. (Requires perm: ${slashcmd.perms})`)
      }
      slashcmd.run(client, interaction)
    }
})

userHistory = [] //Store target's roles and nickname
client.on("messageCreate", async (message) => {
  if (message.member == null)
  {
    return
  }
  if(message.reference)
  {
    const db = await mongoUtil.getDb();
    let {banMessage, preBanQuip, postBanQuip} = await db.collection("phrasedata").findOne({ _id: message.guild.id}) || {}
    if(!banMessage)
    {
      return message.channel.send("Failed to retrieve data from database. Try again shortly.")
    }
    const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
    if(message.member.permissionsIn(message.channel).has("KICK_MEMBERS") || message.member.permissionsIn(message.channel).has("BAN_MEMBERS") ){ //Checks to make sure person initiating "ban" has correct perms
      if (banMessage.includes(message.content))
        {
          const msg = await message.channel.messages.fetch(message.reference.messageId);//cache the message that was replied to
          const member = msg.member //cache the author of reply message
          if(member.bannable)
            {
              if(preBanQuip.length != 0)
              {
                message.channel.send(preBanQuip[0])
              }
              
              if (!(userHistory.filter(e => e.id == member.id && e.guildId == member.guild.id).length > 0)) // Check if users roles have already been logged
              {
                userHistory.push({
                  guildId: member.guild.id,
                  roles: member.roles.cache,
                  id: member.id,
                  nick: member.nickname
                  })
              }
              else{
                let user = userHistory.find(e => e.id == member.id && e.guildId == member.guild.id) //find the user in the history array
                user.roles = member.roles.cache  //Updates users role and nickname in the history if they changed, else nothing happens
                user.nick = member.nickname
              }
              client.users.fetch(member, false).then((user) => {
                  message.channel.createInvite()
                  .then(invite => user.send(`Think about what you said, then come back. https://discord.gg/${invite.code}`)
                  .catch(error =>   {if (error) 
                    console.log(error)
                      return message.channel.send("Unable to message user. (User may have dm privacy settings preventing this)") })) //Create invite code based on server, then send it
                
                  })
              await delay(1000); //Wait to send invite before banning user
              member.ban(member).then(console.log(`Guild: ${member.guild.name}\n User: ${member.user.username}`)) //ban the user
              .then(message.guild.members.unban(member)) 
              .catch(error => { 
                    if (error) 
                    {
                      message.channel.send("Failed to ban the user. (Check if bot role is above other roles)")
                    } 
                  })
              if(postBanQuip.length != 0)
              {
                msg.reply(postBanQuip[0])
              }
            }
            else{
              message.channel.send("Failed to ban the user. (Check if bot role is above other roles)")
            }
      }
    }
  }
})

client.on('guildMemberAdd', async (member) => {
  const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
  await delay(2000);
  try{
  userHistory.forEach(element => {
    if(member.id == element.id && member.guild.id == element.guildId)
    {
      member.roles.add(element.roles); // Re add target's roles
      member.setNickname(element.nick) // re-set nickname
    }
  });
}
catch(err)
{
  console.log(error)
}
});

client.login(process.env.TOKEN)

//change reinvite message
// 1984 mode
