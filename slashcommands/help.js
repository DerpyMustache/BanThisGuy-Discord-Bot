
const run = async (client, interaction) => {
    return interaction.reply("To use the bot as is, simply reply to any message with the phrase 'Can we ban this guy'\nYou can use the set commands to add to the list of phrases that will activate the bot, and optionally add up to two messages (Pre ban quip and Post ban quip) to send after.\nYou can use the clear commands to remove the default ban message, and also any additional phrases you may have added. \nFor any additional questions, bugs or suggestions, you can message the creator @DerpyMustache#9374.")
}

module.exports = {
    name: "help",
    description: "Clarification on how to use the bot",
    run
}