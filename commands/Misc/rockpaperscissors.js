const functions = require('../../utility/functions.js');
module.exports = {
    name: 'rockpaperscissors',
    description: 'Play a game of Rock Paper Scissors against the bot.',
    extended: '',
    usage: '[rock|r / paper|p / scissors|s]',
    aliases: ['rps'],
    guildonly: false,
    developersOnly: false,
    args: true,
    category: 'Misc',
    execute(message, args) {
        const choices = [['Rock', 'Paper', 'Scissors'], ['👊', '🤚', '✌️']];
        const playerChoice = choices[0].find(element => element.toLowerCase().startsWith(args[0].toLowerCase()));
        if (!playerChoice)
            return functions.errorMessage(message, 'That was not a valid play. Please select either Rock, Paper or Scissors.');
        const botChoice = choices[0][choices[0].length * Math.random() | 0];

        const result = choices[0].indexOf(playerChoice) - choices[0].indexOf(botChoice);
        const out = `${choices[1][choices[0].indexOf(botChoice)]} I chose ${botChoice}. `;
        if (result === 0)
            return message.channel.send(out + "It's a draw!");
        if (result === 1 || result === -2)
            return message.channel.send(out + 'You win!');
        if (result === 2 || result === -1)
            return message.channel.send(out + 'I win!');
    }
};