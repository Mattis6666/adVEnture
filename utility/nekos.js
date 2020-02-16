const functions = require('./functions.js');

module.exports = {
    async OwOify(nekos, text) {
        const out = await nekos.OwOify({
            text: text
        });
        return out.owo;
    },
    embed(user) {
        return functions.newEmbed().setAuthor(user.tag, user.displayAvatarURL);
    },
    async getImage(nekos, type) {
        const out = await nekos[type]();
        return out.url;
    }
};