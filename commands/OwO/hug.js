const owo = require('../../utility/nekos.js');
module.exports = {
    name: 'hug',
    description: 'Sends a hug gif/picture.',
    extended: '',
    usage: '',
    aliases: [],
    guildonly: false,
    developersOnly: false,
    args: false,
    category: 'OwO',
    memberPermission: '',
    botPermission: '',
    async execute(message, args) {
        const image = await owo.getImage('hug');
        const output = owo.embed(message.author)
            .setImage(image);
        if (args.length) {
            const member = owo.getMember(message, args, 0);
            if (member) output.setDescription(`*${member} was hugged by ${message.author}*`);
        }
        message.channel.send(output);
    }
};