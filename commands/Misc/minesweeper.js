const functions = require('../../utility/functions.js');
// const config = require('config');
const Minesweeper = require('discord.js-minesweeper');
module.exports = {
    name: 'minesweeper',
    description: 'Play a game of minesweeper using Discord\'s Spoiler tags! Default board is a 9x9 with 10 bombs, but you can customize this via args.',
    extended: 'If you see the 💥 you lose. The goal of the game is to open all the cells of the board which do not contain a bomb. You lose if you set off a bomb cell. Any cell that is not a bomb will tell you the total number of bombs in the eight neighboring cells. Tap a cell to start!',
    usage: '<rows> <columns> <mines>',
    aliases: ['mines'],
    guildonly: false,
    developersOnly: false,
    args: false,
    category: 'Misc',
    memberPermission: '',
    botPermission: '',
    execute(message, args) {
        const rows = args[0] ? parseInt(args[0]) : false;
        const cols = args[1] ? parseInt(args[1]) : false;
        const mines = args[2] ? parseInt(args[2]) : false;

        if (isNaN(rows) || isNaN(cols) || isNaN(mines))
            return functions.errorMessage(message, 'Invalid input. Only numbers are allowed!');
        if (mines)
            if (mines >= rows * cols) return functions.errorMessage(message, "That's too many bombs, silly!");

        const minesweeper = new Minesweeper(
            {
                rows: rows || 9,
                columns: cols || 9,
                mines: mines || 10,
                spaces: true,
                revealFirstCell: true
            }
        );
        const matrix = minesweeper.start();

        if (typeof matrix !== 'string') return;

        if (matrix.length > 2000) {
            functions.errorMessage(message, "Sorry, Discord's character limit of 2000 doesn't allow such a big board! Here's the standard board instead.");
            const alternative = new Minesweeper({ spaces: true, revealFirstCell: true });
            const altMatrix = alternative.start();
            return message.channel.send(altMatrix);
        }
        message.channel.send(matrix);
    }
};