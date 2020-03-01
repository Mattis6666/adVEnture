// const functions = require('../../utility/functions.js');
const config = require('config');
module.exports = {
    name: 'dice',
    description: 'Throws a dice. Pass along a number to customize the amount of sides.',
    extended: `\`${config.prefix}dice\` - Throw a 6-sided dice.\n\`${config.prefix}dice 69\` - Throw a 69-sided dice.`,
    usage: '<Sides>',
    aliases: ['diceroll'],
    guildonly: false,
    developersOnly: false,
    args: false,
    category: 'Misc',
    memberPermission: '',
    botPermission: '',
    execute(message, args) {
        const amount = parseInt(args[0]) || 6;
        message.channel.send(`🎲 *I rolled a **${Math.floor(Math.random() * amount) + 1}**, ${message.author.username}!*`);
    }
};