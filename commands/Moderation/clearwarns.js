const functions = require('../../utility/functions.js');
const db = require('../../utility/mongo.js');
module.exports = {
    name: 'clearwarns',
    description: 'Clears all warns of the user.',
    extended: '',
    usage: '[@User/User ID] <Reason>',
    aliases: ['clearmodlog', 'warnclean', 'pardon'],
    guildonly: true,
    developersOnly: false,
    args: true,
    category: 'Mod',
    memberPermission: 'BAN_MEMBERS',
    botPermission: '',
    async execute(message, args) {
        const user = functions.getMemberMod(message, args, 0);
        if (!user || user === 'reactions') return functions.noMember(message);

        const dbEntry = await db.getUser(user.id);
        if (!dbEntry)
            return;
        while (dbEntry.warns.length)
            dbEntry.warns.pop();
        dbEntry.save();

        const reasonStr = args.splice(1);
        const reason = reasonStr.length ? reasonStr.join(' ') : 'None';
        const output = functions.newEmbed()
            .setTitle('Warn Clear')
            .setDescription(`All warns for ${user} have successfully been cleared.`)
            .addField('Member', user.user.tag)
            .addField('Moderator', message.author.tag)
            .addField('Reason', reason)
            .setThumbnail(user.user.displayAvatarUrl);

        message.channel.send(output);
        functions.modLog(message, output);
        user.send(output.setDescription(`All your warns on ${message.guild.name} have been cleared.`))
            .catch(() => {
                return;
            });
    }
};