let guildData = require("../globals")
const run = (client, interaction) => {
let {banMessage, preBanQuip, postBanQuip} = guildData.get(interaction.guildId)
        try{
            let allPhrases = "The ban phrases are: "
            banMessage.forEach(element => {
                allPhrases += element + ", "
            });
            allPhrases += `\nThe pre ban quip is ${preBanQuip}`
            allPhrases += `\nThe post ban quip is ${postBanQuip}`
            return interaction.reply(allPhrases)
        }
        catch(err){
            if(err){
            console.log(err)
            interaction.reply("Failed to list phrases")
            }
        }
}


module.exports = {
    name: "list",
    description: "List all the phrases the bot has saved",
    run
}
