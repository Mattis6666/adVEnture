const owo = require('../../utility/nekos.js');
// const config = require('config');
module.exports = {
    name: 'owoify',
    description: 'OwOify youw text! **U w U**',
    extended: '',
    usage: '[Text]',
    aliases: ['uwuify', 'uwu', 'owo'],
    guildonly: false,
    developersOnly: false,
    args: true,
    category: 'OwO',
    memberPermission: '',
    botPermission: '',
    async execute(message, args, nekos) {
        const OwO = await owo.OwOify(nekos, args.join(' '));
        const output = owo.embed(message.author)
            .setDescription(OwO);
        message.channel.send(output);
    }
};