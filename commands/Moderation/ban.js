const functions = require('../../utility/functions.js');
const config = require('config');
module.exports = {
    name: 'ban',
    description: 'Bans the mentioned member.',
    extended: '',
    usage: '[User] <Reason>',
    aliases: [],
    guildonly: true,
    developersOnly: false,
    args: true,
    category: 'Mod',
    memberPermission: 'BAN_MEMBERS',
    botPermission: 'BAN_MEMBERS',
    execute(message, args) {
        const member = functions.getMember(message, args, 0);
        if (!member) return functions.noMember(message);

        if (!functions.isMemberHigher(message.member, member))
            return functions.errorMessage(message, 'You can\'t ban this user, because your highest role is not higher than theirs.');
        if (!member.bannable || !functions.isMemberHigher(message.guild.me, member))
            return functions.errorMessage(message, 'I can\'t ban this user, because my highest role is lower than theirs.');

        const success = functions.newEmbed()
            .setAuthor('Ban')
            .setDescription('User has successfully been banned!')
            .addField('User', member.user.tag, false)
            .addField('Moderator', message.author.tag, false)
            .addField('Reason', args[1] ? args.slice(1).join(' ') : '-', false)
            .setThumbnail(member.user.displayAvatarURL);

        message.channel.send(success);
        message.client.channels.get(config.modLogChannel).send(success);
        member.send(success.setDescription(`You have been banned from ${message.guild.name}.`))
            .catch(() => {
                return;
            })
            .then(() => {
                member.ban();
            });
    }
};