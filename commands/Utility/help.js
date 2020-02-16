const functions = require('../../utility/functions.js');
const config = require('config');
module.exports = {
    name: 'help',
    description: 'Lists all commands or info on one command if provided.',
    extended: '',
    usage: '<command name>',
    aliases: ['command', 'info', 'i'],
    guildOnly: false,
    developersOnly: false,
    args: false,
    category: 'Utility',
    execute(message, args) {
        const output = functions.newEmbed().setAuthor('Help Menu', message.author.avatarURL);
        const { commands } = message.client;

        if (!args.length) {
            const utilityCommandList = [];
            const modCommandList = [];
            const miscCommandList = [];
            const owoCommandList = [];
            for (const k of message.client.commands.keys()) {
                const command = message.client.commands.get(k);
                switch (command.category) {
                    case 'Utility':
                        utilityCommandList.push(`\`${config.prefix}${command.name}\` - *${command.description}*`);
                        break;
                    case 'Mod':
                        modCommandList.push(`\`${config.prefix}${command.name}\` - *${command.description}*`);
                        break;
                    case 'Misc':
                        miscCommandList.push(`\`${config.prefix}${command.name}\` - *${command.description}*`);
                        break;
                    case 'Dev':
                        break;
                    case 'OwO':
                        owoCommandList.push(`\`${config.prefix}${command.name}\` - *${command.description}*`);
                        break;
                    default:
                        miscCommandList.push(`\`${config.prefix}${command.name}\` - *${command.description}*`);
                        break;
                }
            }
            output
                .setTitle("Here's a list of all available commands!")
                .addField('Utility Commands', utilityCommandList.join('\n'))
                .addField('Moderator Commands', modCommandList.join('\n'))
                .addField('Miscellaneous Commands', miscCommandList.join('\n'))
                .addField('OwO Commands', owoCommandList.join('\n'))
                .setFooter(`Type ${config.prefix}help [command name] to get info on a specific command.`);
            return message.channel.send(output);
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command)
            return message.reply('That\'s not a valid command!');

        const info = [];

        info.push(`**Name:** \`${command.name}\``);
        info.push(`**Description:** \`${command.description ? command.description : '-'}\``);
        info.push(`**Extended:** \`${command.extended ? command.extended : '-'}\``);
        info.push(`**Usage:** \`${config.prefix}${command.name}${command.usage ? ' ' + command.usage : ''}\``);
        info.push(`**Aliases:** \`${command.aliases.length ? command.aliases.join(', ') : '-'}\``);
        output
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setDescription(info.join('\n\n'));

        message.channel.send(output);
    },
};