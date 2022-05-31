let guildData = require("../globals")
const run = (client, interaction) => {
let {banMessage, preBanQuip, postBanQuip} = guildData.get(interaction.guildId)
   if(interaction.options.getSubcommand() == "banmessage")
    {
        try{
            if(banMessage.includes(interaction.options.getString("message")))
                {
                   return interaction.reply("Phrase already exists.")
                }
            banMessage.push(interaction.options.getString("message"))
            return interaction.reply(`Ban message has been set to ${banMessage[banMessage.length-1]}`)
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
            return interaction.reply(`Pre ban quip has been set to ${preBanQuip[0]}`)
        }
        catch(err){
            if(err){
            console.log(err)
            interaction.reply("Failed to set message")
            }
        }
    }
    else{
        try{
            postBanQuip[0] = interaction.options.getString("message")
            return interaction.reply(`Post ban quip has been set to ${postBanQuip}`)
        }
        catch(err){
            if(err){
            console.log(err)
            interaction.reply("Failed to set message")
            }
        }
    }
}


module.exports = {
    name: "set",
    description: "Cutstomize various aspects of the bot",
    perms: "KICK_MEMBERS",
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
        }
    ],run
}
