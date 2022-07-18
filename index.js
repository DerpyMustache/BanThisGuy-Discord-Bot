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
    let {banMessage, preBanQuip, postBanQuip, inviteMessage} = await db.collection("phrasedata").findOne({ _id: message.guild.id}) || {}
    if(!banMessage)
    {
      return message.channel.send("Failed to retrieve data from database. Try again shortly.")
      .catch(error => message.member.send("I don't have permission to send messages in the channel you used me in!"))
      .catch(error => console.log(error))
    }
    const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
    if (banMessage.includes(message.content.toLowerCase()))
    {
      if(message.member.permissionsIn(message.channel).has("KICK_MEMBERS") || message.member.permissionsIn(message.channel).has("BAN_MEMBERS") ) //Checks to make sure person initiating "ban" has correct perms
      { 
        {
          const msg = await message.channel.messages.fetch(message.reference.messageId);//cache the message that was replied to
          const member = await message.guild.members.fetch(msg.member) 
        
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
              let invited = true;
              client.users.fetch(member, false).then((user) => {
                  message.channel.createInvite({maxUses: 1, unique: true})
                  .then(invite => user.send(`${inviteMessage} ${invite}`)) //Create invite code based on server, then send it
                  .catch(error => {
                    invited = false;
                    message.channel.send("Unable to message user to re-invite. Ban process cancelled. (User may have dm privacy settings preventing this or bot cannot create invites)")
                  })
                  .catch(error => message.member.send("I don't have permission to send messages in the channel you used me in!"))
                  .catch(error => console.log(error))
                  })
              await delay(1000)
              if(invited)
              {
              member.ban(member)
              .then(console.log(`Guild: ${member.guild.name}\n User: ${member.user.username}`)) //ban the user
              .then(message.guild.members.unban(member))
              }
              if(postBanQuip.length != 0)
              {
                msg.reply(postBanQuip[0])
              }
            }
            else{
              message.channel.send("Failed to ban the user. (Check if bot role is above other roles)")
              .catch(error => message.member.send("I don't have permission to send messages in the channel you used me in!"))
              .catch(error => console.log(error))
            }
          }
    }
      else{
      message.channel.send("You don't have permission to do that! (Requires kick or ban permissions)")
      .catch(error => message.member.send("I don't have permission to send messages in the channel you used me in!"))
              .catch(error => console.log(error))
      }
  }
  }
})

client.on('guildMemberAdd', async (member) => {
  const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
  await delay(2000);
  userHistory.forEach(element => {
    if(member.id == element.id && member.guild.id == element.guildId)
    {
      member.roles.add(element.roles).catch(error => console.log(member.guild.me.permissions.has("MANAGE_ROLES"))); // Re add target's roles
      member.setNickname(element.nick) // re-set nickname
    }
  });
});

client.login(process.env.TOKEN)

//change reinvite message
// 1984 mode
