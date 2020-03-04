const owo = require('../../utility/nekos.js');
// const config = require('config');
module.exports = {
    name: 'meow',
    description: 'Sends a cat gif/picture.',
    extended: '',
    usage: '',
    aliases: ['cat', 'kitten'],
    guildonly: false,
    developersOnly: false,
    args: false,
    category: 'OwO',
    memberPermission: '',
    botPermission: '',
    async execute(message) {
        const image = await owo.getImage('meow');
        const output = owo.embed(message.author)
            .setImage(image);
        message.channel.send(output);
    }
};