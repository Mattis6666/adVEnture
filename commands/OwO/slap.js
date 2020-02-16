const owo = require('../../utility/nekos.js');
// const config = require('config');
module.exports = {
    name: 'slap',
    description: 'Sends a slap gif/picture.',
    extended: '',
    usage: '',
    aliases: [],
    guildonly: false,
    developersOnly: false,
    args: false,
    category: 'OwO',
    memberPermission: '',
    botPermission: '',
    async execute(message, _args, nekos) {
        const image = await owo.getImage(nekos, 'slap');
        const output = owo.embed(message.author)
            .setImage(image);
        message.channel.send(output);
    }
};