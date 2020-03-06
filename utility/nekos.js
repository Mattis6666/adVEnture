const functions = require('./functions.js');
const nekoClient = require('nekos.life');
const { sfw } = new nekoClient();

module.exports = {
    async OwOify(text) {

        const out = await sfw.OwOify({
            text: text
        });
        return out.owo;
    },
    embed(user) {
        return functions.newEmbed().setAuthor(user.tag, user.displayAvatarURL({ size: 256, dynamic: true }));
    },
    async getImage(type) {
        const out = await sfw[type]();
        return out.url;
    },
    getMember(message, args, spot) {
        return message.mentions.members.first()
            || message.guild.members.cache.get(args[spot].replace(/[^0-9]/gi, ''))
            || message.guild.members.cache.find(member => member.user.username.toLowerCase().startsWith(args[spot].toLowerCase()))
            || false;
    },
    client: sfw
};