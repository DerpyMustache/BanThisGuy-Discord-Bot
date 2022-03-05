const Discord = require("discord.js")

const TOKEN = "OTQwMTM0MzA2Mjk3MzA3MTY3.YgC-TQ.KzGt7O05S6HVDVRrscsncBhscHo"

const client = new Discord.Client({ intents: [ "GUILDS",
 "GUILD_MESSAGES",
 "GUILD_MEMBERS" ] });

client.on("messageCreate", async (message) => {
  const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
    if (message.content == "https://tenor.com/view/awkward-gif-19335190" || message.content == "https://cdn.discordapp.com/attachments/891154973017116712/943654382296268850/ezgif.com-gif-maker.gif"){
        message.reply("https://tenor.com/view/no-chungus-facepalm-stress-gif-16582514") //Chungus auto deletion
        await delay(2000);
        message.delete();
    }
  if(message.member.permissionsIn(message.channel).has("ADMINISTRATOR") || message.author.id == '209787432952922122'){ //Checks to make sure person initiating ban is an admin or me
    if (message.content == "Can we ban this guy" && message.reference || message.content == "https://tenor.com/view/good-argument-you-are-banned-gif-24468307" || message.content == "https://media0.giphy.com/media/R3ed6mqphgE8JW6Xs8/giphy.gif?cid=790b76111bef3c9ab82e41bfa51aed42d83c1881ace0f4bc&rid=giphy.gif&ct=g" ) {
      await delay (1000)
        if(message.content == "https://media0.giphy.com/media/R3ed6mqphgE8JW6Xs8/giphy.gif?cid=790b76111bef3c9ab82e41bfa51aed42d83c1881ace0f4bc&rid=giphy.gif&ct=g" || message.content == "Can we ban this guy")
        {
          message.channel.send("Right away sir.");
        }
        const msg = await message.channel.messages.fetch(message.reference.messageId);//cache the message that was replied to
        const member = msg.member//cache the author of reply message
        roleHistory = member.roles.cache; //Store target's roles
        client.users.fetch(member, false).then((user) => {
          message.channel.createInvite()
          .then(invite => user.send(`Think about what you said, then come back. https://discord.gg/${invite.code}`)) //Create invite code based on server, then send it
          .catch(console.error);
            });
        await delay(1000); //Wait to send invite before banning user
        member.ban(member).then(console.log)//ban the user
        .catch(console.error);
        message.guild.members.unban(member)// unban the user
        msg.reply('https://tenor.com/view/cope-cope-harder-saul-goodman3d-better-call-saul-saul-goodman-gif-24033192') // Cope
        }
       
    }
})

client.on('guildMemberAdd', (member) => {
    member.roles.add(roleHistory); // Re add target's roles
 });


client.login(TOKEN)
// Add music bot
// add quips after ban