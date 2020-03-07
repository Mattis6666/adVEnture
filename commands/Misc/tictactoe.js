const ttt = require('tictactoejs');
const functions = require('../../utility/functions.js');
module.exports = {
    name: 'tictactoe',
    description: 'Play a game of Tic Tac Toe against the bot.',
    extended: 'Maybe I will make a PvP mode in the future.',
    usage: '',
    aliases: ['ttt'],
    guildonly: false,
    developersOnly: false,
    args: false,
    category: 'Misc',
    async execute(message) {
        const game = new ttt.TicTacToe();
        const board = await message.channel.send('```' + game.ascii() + '\n\nX is the Player, O the bot.\nTo make a move, simply type [rowNumber] [lineNumber] counting from the bottom left corner.\nThe bottom-right corner would be "3 1", the top right one "3 3".\nSend [q]uit, [c]ancel or [s]top to end the game.```');
        const collector = message.channel.createMessageCollector(msg => msg.author === message.author, { time: 1000 * 60 * 5 });

        collector.on('collect', msg => {
            if (['stop', 's', 'quit', 'q', 'cancel', 'c'].includes(msg.content.toLowerCase())) {
                collector.stop();
                msg.delete();
                board.delete();
                return functions.errorMessage(message, 'Cancelled the game!');
            }
            const [x, y] = msg.content.split(' ');
            if (!game.legalMoves().some(ele => ele.x === (x | 0) && ele.y === (y | 0)))
                return functions.errorMessage(msg, 'Invalid move!');

            if (game.status() === 'in progress') {
                game.turn();
                game.move(x, y);
            }

            if (game.status() === 'in progress') {
                game.turn();
                game.randomMove();
            }
            msg.delete();
            if (game.status() === 'in progress')
                return board.edit('```' + game.ascii() + '\n\nX is the Player, O the bot.\nTo make a move, simply type [rowNumber] [lineNumber] counting from the bottom left corner.\nThe bottom-right corner would be "3 1", the top right one "3 3".\nSend [q]uit, [c]ancel or [s]top to end the game.```');
            if (game.status() === 'draw')
                board.edit('```' + game.ascii() + '\n\nDRAW!```');
            if (game.status() === 'X')
                board.edit('```' + game.ascii() + '\n\nPLAYER WINS!```');
            if (game.status() === 'O')
                board.edit('```' + game.ascii() + '\n\nBOT WINS!```');
            collector.stop();
        });
    }
};