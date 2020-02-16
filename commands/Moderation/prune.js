const functions = require('../../utility/functions.js');
const config = require('config');
module.exports = {
    name: 'prune',
    description: 'Bulk delete messages. If no input provided, 20 messages will be pruned.',
    extended: 'Options:',
    usage: '<amount> <option>',
    aliases: ['clear', 'nuke', 'purge'],
    guildonly: true,
    developersOnly: false,
    args: false,
    category: 'Mod',
    memberPermission: 'MANAGE_MESSAGES',
    botPermission: 'MANAGE_MESSAGES',
    execute(message, args) {
        if (!args.length) {
            message.channel.bulkDelete(21, false);
            return functions.errorMessage(message, 'Successfully deleted 20 messages!');
        }
        else {
            const amount = args[0] ? parseInt(args[0]) : 20;
            if (isNaN(amount))
                return functions.errorMessage(message, `Invalid args. Please refer to the \`${config.prefix}help prune\` page`);

            message.channel.fetchMessages({ limit: amount }).then(fetched => {
                let messages = fetched;
                if (args.includes('bot'))
                    messages = messages.filter(m => m.author.bot);
                for (let i = 1; i < args.length; i++) {
                    const member = functions.getMember(message, args, i);
                    if (!member) continue;
                    messages = messages.filter(m => m.member === member);
                }
                for (const item in args.slice(1)) {
                    console.log(item);
                    messages = messages.filter(m => m.content.toLowerCase().includes(item.toLowerCase()));
                }

                messages.forEach(message => {
                    console.log(message.content);
                });
                if (!messages) return functions.errorMessage(message, 'No');
                if (!messages.size) return functions.errorMessage(message, 'No');
                console.log(messages.size);
                messages.bulkDelete(amount, true);
            });
        }
    }
};