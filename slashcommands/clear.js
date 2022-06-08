const mongoUtil = require( '../mongoUtil' );
const run = async (client, interaction) => {
  const db = mongoUtil.getDb();
  const phrasedata = await db.collection("phrasedata").findOne({ _id: interaction.guildId})
  let {banMessage, preBanQuip, postBanQuip} = phrasedata
  if(interaction.options.getSubcommand() == "banmessage")
    {
        try{
            if(banMessage.includes(interaction.options.getString("message")))
            {
                let removed = banMessage.splice(banMessage.indexOf(interaction.options.getString("message")),1)
                interaction.reply(`Removed ${removed}`)
            }
            else{
            interaction.reply("Phrase does not exist in the list.")
            }
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
            preBanQuip.length = 0
            interaction.reply("Pre ban quip has been cleared")
        }
        catch(err){
            if(err){
            console.log(err)
            interaction.reply("Failed to clear message")
            }
        }
    }
    else if (interaction.options.getSubcommand() == "postbanquip")
    {
        try{
            postBanQuip.length = 0
            interaction.reply("Post ban quip has been cleared")
        }
        catch(err){
            if(err){
            console.log(err)
            interaction.reply("Failed to clear message")
            }
        }
    }
    else
    {
        try{
             if(interaction.options.getString("confirmation") == "CONFIRM")
               {
                banMessage.length = 0
                preBanQuip.length = 0
                postBanQuip.length = 0
                interaction.reply("All phrases have been cleared")
              }
              else{
               interaction.reply("Wrong confirmation phrase, command cancelled.")
                 }
        }
        catch(err){
            if(err){
            console.log(err)
            interaction.reply("Failed to clear messages")
            }
        }
    }
    db.collection("phrasedata").updateOne({ _id: interaction.guildId },
        { $set: {
            banMessage: banMessage,
            preBanQuip: preBanQuip,
           postBanQuip: postBanQuip
                }
         });
}


module.exports = {
    name: "clear",
    description: "Remove some or all of the bots saved phrases",
    perms: "KICK_MEMBERS",
    options: [
        {
            type: "SUB_COMMAND",
            name: "banmessage",
            description: "Clear one of the phrases that activates the bot",
            options: [ 
            {
                name: "message",
                type: "STRING",
                description: "The desired phrase",
                required: true,
                autocomplete: true
            }

            ]
        },
        {
            type: "SUB_COMMAND",
            name: "prebanquip",
            description: "Clear the phrase the bot sends in response to being actiavted (Default is none)",
        },
        {
            type: "SUB_COMMAND",
            name: "postbanquip",
            description: "Clear the phrase the bot sends in response to the user being banned (Default is none)",
        },
        {
            type: "SUB_COMMAND",
            name: "all",
            description: "Clear all saved phrases",
            options: [
                {
                    name: "confirmation",
                    type: "STRING",
                    description: "Please type 'CONFIRM' into this option to confirm you want to use this command.",
                    required: true
                }
            ]
        }
    ],run
}
