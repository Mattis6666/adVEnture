const functions = require('../../utility/functions.js');
module.exports = {
    name: 'avatar',
    description: 'Sends the avatar of a @user or yourself.',
    extended: '',
    usage: '<@user>',
    aliases: ['icon', 'pfp', 'av'],
    guildonly: false,
    developersOnly: false,
    args: false,
    category: 'Utility',
    execute(message, args) {
        const output = functions.newEmbed();

        if (args[0]) {
            const member = functions.getMember(message, args, 0);
            if (!member)
                return functions.noMember(message);

            const name = member.user.username.toUpperCase();
            const username = name.endsWith('Z') || name.endsWith('S') ? member.user.username + "'" : member.user.username + "'s";

            if (!member) {
                output.setDescription('Please use a proper mention if you want to see someone elses avatar.');
                return message.channel.send(output);
            }

            output
                .setTitle(`${username} avatar`)
                .setImage(member.user.displayAvatarURL);
            return message.channel.send(output);
        }

        output
            .setTitle(`${message.author.username}, your avatar`)
            .setImage(message.author.displayAvatarURL);

        return message.channel.send(output);
    },
};