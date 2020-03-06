const functions = require('../../utility/functions.js');
const config = require('config');
module.exports = {
    name: 'report',
    description: 'Send a message to all Moderators.',
    extended: 'You can also upload an attachment.\nThis can be used for anything.\nUsage Examples:\n- Reporting a user\n- Asking a question',
    usage: '[Your message]',
    aliases: ['contact', 'mail'],
    guildonly: false,
    developersOnly: false,
    args: true,
    category: 'Mod',
    memberPermission: '',
    botPermission: '',
    async execute(message, args) {
        const output = functions.newEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 256, dynamic: true }))
            .setDescription(args.join(' '))
            .setTitle('User Report');

        const modChannel = message.client.channels.cache.get(config.mailChannel);

        if (message.attachments.size) {
            const image = await functions.imageStore(message, message.attachments.first().url);
            output.setImage(image);
        }

        if (!message.guild) {
            message.channel.send('Your message has successfully been sent!');
            return modChannel.send(output);
        }

        output.addFields(
            [
                { name: 'Channel', value: message.channel },
                { name: 'Message', value: `[Click me to jump to the message.](${message.url})` }
            ]
        );
        functions.errorMessage(message, 'Your message has successfully been sent!');
        modChannel.send(output);
    }
};