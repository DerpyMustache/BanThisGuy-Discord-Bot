const Discord = require("discord.js");
let guildData = require("./globals")

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
client.on("interactionCreate", (interaction) => {
  if (interaction.isCommand())
    {
      const slashcmd = client.slashcommands.get(interaction.commandName)
      if (slashcmd.perms && !interaction.member.permissions.has(slashcmd.perms))
      {
        return interaction.reply(`You do not have permission for this command. (Requires perm: ${slashcmd.perms})`)
      }
      slashcmd.run(client, interaction)
    }
})

userHistory = [] //Store target's roles and nickname
client.on("messageCreate", async (message) => {
 let {banMessage, preBanQuip, postBanQuip} = guildData.get(message.guildId)
  const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
  if(message.member.permissionsIn(message.channel).has("KICK_MEMBERS")){ //Checks to make sure person initiating "ban" has correct perms
    if (banMessage.includes(message.content) && message.reference)
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
                .then(invite => user.send(`Think about what you said, then come back. https://discord.gg/${invite.code}`)) //Create invite code based on server, then send it
                .catch(error => { if (error) 
                  console.log(error)
                  return message.channel.send("Failed to re-invite the user.")}); 
                })
            await delay(1000); //Wait to send invite before banning user
            member.ban(member).then(console.log) //ban the user
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
})

client.on('guildMemberAdd', (member) => {
  try{
  userHistory.forEach(element => {
    if(member.id == element.id && member.guild.id == element.guildId)
    {
      member.roles.add(element.roles); // Re add target's roles
      member.setNickname(element.nick) // re-set nickname
    }
    console.log(userHistory)
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
// possible error if same person in multiple servers