const owo = require('../../utility/nekos.js');
// const config = require('config');
module.exports = {
    name: 'foxgirl',
    description: 'Sends a foxgirl gif/picture.',
    extended: '',
    usage: '',
    aliases: [],
    guildonly: false,
    developersOnly: false,
    args: false,
    category: 'OwO',
    memberPermission: '',
    botPermission: '',
    async execute(message) {
        const image = await owo.getImage('foxGirl');
        const output = owo.embed(message.author)
            .setImage(image);
        message.channel.send(output);
    }
};