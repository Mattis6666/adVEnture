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
    },
    getMember(message, args, spot) {
        const memberInput = args[spot];
        let member = message.guild.members.get(memberInput);
        if (!member) member = message.mentions.members.first();
        if (!member) member = message.guild.members.get(memberInput.substring(3, memberInput.length - 1));
        if (!member) member = message.guild.members.find(member => member.user.username.substring(0, memberInput.length).toLowerCase() === memberInput.toLowerCase()) || false;
        return member || false;
    },
};