const functions = require('../../utility/functions.js');
const db = require('../../utility/mongo.js');
module.exports = {
    name: 'warns',
    description: 'Views the modlog of the user.',
    extended: '',
    usage: '[@User/User ID]',
    aliases: ['modlog', 'warnlog', 'ml'],
    guildonly: true,
    developersOnly: false,
    args: true,
    category: 'Mod',
    memberPermission: 'BAN_MEMBERS',
    botPermission: '',
    async execute(message, args) {
        const user = functions.getMember(message, args, 0);
        if (!user)
            return functions.noMember(message);

        const dbEntry = await db.getUser(user.id);
        if (!dbEntry)
            return;

        const output = functions.newEmbed()
            .setTitle(`Mod Logs for ${user.user.tag}`)
            .setThumbnail(user.user.displayAvatarURL({ size: 256, dynamic: true }));

        if (!dbEntry.warns.length)
            return message.reply(`Good news! ${user.user.tag} does not have any warns.`);

        dbEntry.warns.forEach(entry => {
            const mod = message.guild.members.cache.get(entry.moderator) || entry.moderatorTag;
            output.addField(
                `Warn ${dbEntry.warns.indexOf(entry) + 1}`,
                `**Moderator:** ${mod}\n**Date:** ${entry.date.toString().substring(0, 24) + ' CEST'}\n**Reason:** \`${entry.reason}\``
            );
        });

        message.channel.send(output);
    }
};