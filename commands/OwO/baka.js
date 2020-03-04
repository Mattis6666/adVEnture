const owo = require('../../utility/nekos.js');
// const config = require('config');
module.exports = {
    name: 'baka',
    description: 'Sends a baka gif/picture.',
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
        const image = await owo.getImage('baka');
        const output = owo.embed(message.author)
            .setImage(image);
        if (args.length) {
            const member = owo.getMember(message, args, 0);
            if (member) output.setDescription(`*${message.author} called you baka, ${member}.*`);
        }
        message.channel.send(output);
    }
};