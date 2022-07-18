const mongoUtil = require( '../mongoUtil' );
const run = async (client, interaction) => {
    const db = mongoUtil.getDb();
    const phrasedata = await db.collection("phrasedata").findOne({ _id: interaction.guildId})
    let {banMessage, preBanQuip, postBanQuip, inviteMessage} = phrasedata || {}
    if(!banMessage)
    {
      return interaction.reply("Failed to retrieve data from database. Try again shortly.")
    }
        try{
            let allPhrases = "The ban phrases are: "
            banMessage.forEach(element => {
                allPhrases += element + ", "
            });
            allPhrases += `\nThe pre ban quip is ${preBanQuip}`
            allPhrases += `\nThe post ban quip is ${postBanQuip}`
            allPhrases += `\nThe invite message is ${inviteMessage}`
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
