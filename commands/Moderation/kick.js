const functions = require('../../utility/functions.js');
const config = require('config');
module.exports = {
    name: 'kick',
    description: 'Kicks the mentioned member.',
    extended: '',
    usage: '[User] <Reason>',
    aliases: [],
    guildonly: true,
    developersOnly: false,
    args: true,
    category: 'Mod',
    memberPermission: 'KICK_MEMBERS',
    botPermission: 'KICK_MEMBERS',
    execute(message, args) {
        const member = functions.getMember(message, args, 0);
        if (!member) return functions.noMember(message);

        if (!functions.isMemberHigher(message.member, member))
            return functions.errorMessage(message, 'You can\'t kick this user, because your highest role is not higher than theirs.');
        if (!functions.isMemberHigher(message.guild.me, member))
            return functions.errorMessage(message, 'I can\'t kick this user, because my highest role is lower than theirs.');

        const success = functions.newEmbed()
            .setAuthor('Kick')
            .setDescription('User has successfully been kicked!')
            .addField('User', member.user.tag, false)
            .addField('Moderator', message.author.tag, false)
            .addField('Reason', args[1] ? args.slice(1).join(' ') : '-', false)
            .setThumbnail(member.user.displayAvatarURL);

        message.channel.send(success);
        message.client.channels.get(config.modLogChannel).send(success);
        member.send(success.setDescription(`You have been kicked from ${message.guild.name}.`))
            .catch(() => {
                return;
            })
            .then(() => {
                member.kick();
            });
    }
};