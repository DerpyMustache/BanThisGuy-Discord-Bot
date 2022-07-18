const mongoUtil = require( '../mongoUtil' );
const run = async (client, interaction) => {
    const db = mongoUtil.getDb();
    const phrasedata = await db.collection("phrasedata").findOne({ _id: interaction.guildId})
    let {banMessage, preBanQuip, postBanQuip, inviteMessage} = phrasedata || {}
    if(!banMessage)
    {
      return interaction.reply("Failed to retrieve data from database. Try again shortly.")
    }
   if(interaction.options.getSubcommand() == "banmessage")
    {
        try{
            if(banMessage.includes(interaction.options.getString("message").toLowerCase()))
                {
                   return interaction.reply("Phrase already exists.")
                }
            banMessage.push(interaction.options.getString("message").toLowerCase())
            interaction.reply(`${banMessage[banMessage.length-1]} has been added to the list of ban phrases.`)
        }
        catch(err){
            if(err){
            console.log(err)
            interaction.reply("Failed to set message")
            }
        }
    }
    else if (interaction.options.getSubcommand() == "prebanquip")
    {
        try{
            preBanQuip[0] = interaction.options.getString("message")
            interaction.reply(`Pre ban quip has been set to ${preBanQuip[0]}`)
        }
        catch(err){
            if(err){
            console.log(err)
            interaction.reply("Failed to set message")
            }
        }
    }
    else if(interaction.options.getSubcommand() == "invitemessage")
    {
        try{
            inviteMessage[0] = interaction.options.getString("message")
            interaction.reply(`Invite message has been set to ${inviteMessage}`)
        }
        catch(err){
            console.log(err)
            interaction.reply("Failed to set message")
        }
    }
    else{
        try{
            postBanQuip[0] = interaction.options.getString("message")
            interaction.reply(`Post ban quip has been set to ${postBanQuip}`)
        }
        catch(err){
            if(err){
            console.log(err)
            interaction.reply("Failed to set message")
            }
        }
    }
    db.collection("phrasedata").updateOne({ _id: interaction.guildId },
         { $set: {
             banMessage: banMessage,
             preBanQuip: preBanQuip,
            postBanQuip: postBanQuip,
            inviteMessage: inviteMessage
                 }
          });
}


module.exports = {
    name: "set",
    description: "Cutstomize various aspects of the bot",
    perms: ["KICK_MEMBERS","BAN_MEMBERS"],
    options: [
        {
            type: "SUB_COMMAND",
            name: "banmessage",
            description: "Add to the list of phrases that activates the bot (Can have multiple)",
            options: [ 
            {
                name: "message",
                type: "STRING",
                description: "The desired phrase",
                required: true
            }

            ]
        },
        {
            type: "SUB_COMMAND",
            name: "prebanquip",
            description: "Change the phrase the bot sends in response to being actiavted (Can have one)",
            options: [ 
            {
                name: "message",
                type: "STRING",
                description: "The desired phrase",
                required: true
            }

            ]
        },
        {
            type: "SUB_COMMAND",
            name: "postbanquip",
            description: "Change the phrase the bot sends in response to the user being banned (Can have one)",
            options: [ 
            {
                name: "message",
                type: "STRING",
                description: "The desired phrase",
                required: true
            }

            ]
        },
        {
            type: "SUB_COMMAND",
            name: "invitemessage",
            description: "Change the phrase the bot sends when re-inviting someone (Can have one)",
            options: [ 
            {
                name: "message",
                type: "STRING",
                description: "The desired phrase",
                required: true
            }

            ]
        }
    ],run
}
