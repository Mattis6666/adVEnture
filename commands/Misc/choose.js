const functions = require('../../utility/functions.js');
module.exports = {
    name: 'choose',
    description: 'Let the bot choose out of 2 or more options divided by `|`.',
    extended: '',
    usage: '[choice1 | choice2 | ...]',
    aliases: ['select', 'choice'],
    guildonly: false,
    developersOnly: false,
    args: true,
    category: 'Misc',
    execute(message, args) {
        const choices = args.join(' ').split('|');
        if (choices.length < 2)
            return functions.errorMessage(message, 'You only gave me once choice, silly!');
        return message.channel.send(`:thinking: ${message.author.username}, I choose:\n\`\`\`${choices[(Math.random() * choices.length) | 0].replace(/`/gi, "'")}\`\`\``);
    }
};