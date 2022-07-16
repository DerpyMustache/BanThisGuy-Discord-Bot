const run = async (client, interaction) => {
    return interaction.reply("To use the bot as is, simply reply to any message with the phrase 'Can we ban this guy'\nPhrases are not case-sensitive.\nYou can use the set commands to add to the list of phrases that will activate the bot, and optionally add up to two messages (Pre ban quip and Post ban quip) to send after.\nYou can use the clear commands to remove the default ban message, and also any additional phrases you may have added.\nIf the bot is not working correctly, make sure that the bot role is at the top of the role hiearchy and that it has the correct permissions (e.g. ban members, manage roles) \nFor any additional questions, bugs or suggestions, you can message the creator @DerpyMustache#9374.")
}

module.exports = {
    name: "help",
    description: "Clarification on how to use the bot",
    run
}