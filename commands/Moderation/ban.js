const functions = require('../../utility/functions.js');
const config = require('config');
module.exports = {
    name: 'ban',
    description: 'Bans the mentioned member.',
    extended: 'You can either mention the user, use their ID, or just write their username!',
    usage: '[User] <Reason>',
    aliases: [],
    guildonly: true,
    developersOnly: false,
    args: true,
    category: 'Mod',
    memberPermission: 'BAN_MEMBERS',
    botPermission: 'BAN_MEMBERS',
    async execute(message, args) {
        function ban(member) {
            if (!functions.isMemberHigher(message.member, member))
                return functions.errorMessage(message, 'You can\'t ban this user, because your highest role is not higher than theirs.');
            if (!functions.isMemberHigher(message.guild.me, member))
                return functions.errorMessage(message, 'I can\'t ban this user, because my highest role is lower than theirs.');

            const success = functions.newEmbed()
                .setAuthor('Ban')
                .setDescription('User has successfully been banned!')
                .addFields(
                    [
                        { name: 'User', value: member.user.tag },
                        { name: 'Moderator', value: message.author.tag },
                        { name: 'Reason', value: args[1] ? args.slice(1).join(' ') : '-' }
                    ]
                )
                .setThumbnail(member.user.displayAvatarURL({ size: 256, dynamic: true }));

            message.channel.send(success);
            message.client.channels.cache.get(config.modLogChannel).send(success);
            member.send(success.setDescription(`You have been banned from ${message.guild.name}.`))
                .catch(() => {
                    return;
                })
                .then(() => {
                    member.ban();
                });
        }

        let member = functions.getMemberMod(message, args, 0);
        if (!member) return functions.noMember(message);
        if (member !== 'reactions')
            return ban(member);

        const menu = functions.newEmbed();
        const memberObj = message.guild.members.cache.filter(m => m.user.username.toLowerCase().includes(args[0].toLowerCase()));
        const members = [];
        memberObj.forEach(m => members.push([m.user.username, m.user.displayAvatarURL({ size: 256, dynamic: true }), m]));

        let i = 0;
        menu
            .setTitle(`Selected user: ${members[i][0]}`)
            .setThumbnail(members[i][1]).setFooter(`${i + 1}/${members.length}`)
            .setDescription('<a:loading:679334829359366165> *In the process of banning a user...*\n\nUse ⬅️/➡️ to navigate pages.\nUse ✅ to confirm and kick the selected user.\nUse ❌ to cancel any time.');

        const msg = await message.channel.send(menu);
        await msg.react('⬅️');
        await msg.react('➡️');
        await msg.react('✅');
        await msg.react('❌');

        const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id, { time: 1000 * 60 * 5 });
        const spam = msg.createReactionCollector((reaction, user) => user.id !== message.author.id, { time: 1000 * 60 * 5 });

        spam.on('collect', r => {
            r.users.cache.filter(user => user.id !== message.client.user.id).forEach(user => r.users.remove(user));
        });
        collector.on('collect', r => {
            r.users.cache.filter(user => user.id !== message.client.user.id).forEach(user => r.users.remove(user));
            switch (r.emoji.name) {
                case '⬅️':
                    if (i === 0)
                        return;
                    i--;
                    menu.setTitle(`Selected user: ${members[i][0]}`).setThumbnail(members[i][1]).setFooter(`${i + 1}/${members.length}`);
                    msg.edit(menu);
                    break;
                case '➡️':
                    if (i >= members.length - 1)
                        return;
                    i++;
                    menu.setTitle(`Selected user: ${members[i][0]}`).setThumbnail(members[i][1]).setFooter(`${i + 1}/${members.length}`);
                    msg.edit(menu);
                    break;
                case '❌':
                    collector.stop();
                    functions.errorMessage(message, 'Operation canceled!');
                    break;
                case '✅':
                    member = members[i][2];
                    collector.stop();
                    break;
                default:
                    break;
            }
        });
        collector.on('end', () => {
            if (msg)
                msg.delete();
            if (!member || member === 'reactions')
                return;
            ban(member);
        });
    }
};