const functions = require('../../utility/functions.js');
const config = require('config');
module.exports = {
    name: 'unban',
    description: 'Unbans the user.',
    extended: '',
    usage: '[UserID] <Reason>',
    aliases: [],
    guildonly: true,
    developersOnly: false,
    args: true,
    category: 'Mod',
    memberPermission: 'BAN_MEMBERS',
    botPermission: 'BAN_MEMBERS',
    execute(message, args) {
        const success = functions.newEmbed()
            .setAuthor('Unban')
            .setDescription('User has successfully been unbanned!');
        message.guild.unban(args[0])
            .then(user => {
                success
                    .addField('User', user.tag, false)
                    .addField('Moderator', message.author.tag, false)
                    .addField('Reason', args[1] ? args.slice(1).join(' ') : '-', false)
                    .setThumbnail(user.displayAvatarURL);
                message.channel.send(success);
                message.client.channels.get(config.modLogChannel).send(success);
            })
            .catch(() => {
                return functions.errorMessage(message, "Oops, that didn't work! Double check your input!");
            });
    }
};