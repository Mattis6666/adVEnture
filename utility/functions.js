const Discord = require('discord.js');
const config = require('config');

module.exports = {
    newEmbed() {
        return new Discord.RichEmbed().setTimestamp().setColor(Math.random().toString(16).slice(2, 8).toUpperCase());
    },
    logError(err, client, msg) {
        if (config.token === 'heroku')
            client.channels.get(config.errorChannel).send(`<@${config.developers.join('> <@')}> An error occurred!\n\`\`\`js\n${err.stack}\`\`\``);
        if (msg)
            msg.reply('Oops, something went wrong. Please contact VenNeptury#6666.').then(message => message.delete(3000));
        console.error(err);
    },
    getRole(message, args, spot) {
        const roleInput = args[spot];
        let role = message.guild.roles.get(roleInput);
        if (!role) role = message.mentions.roles.first();
        if (!role) role = message.guild.roles.get(roleInput.substring(3, roleInput.length - 1));
        if (!role) role = message.guild.roles.find(role => role.name.substring(0, roleInput.length).toLowerCase() === roleInput.toLowerCase());
        return role ? role : false;
    },
    noRole(message) {
        message.reply('You did not provide a valid role. Please run the command again and this time provide a valid role! This can be a mention, its id or its name')
            .then(message => message.delete(3000));
    },
    getMember(message, args, spot) {
        const memberInput = args[spot];
        let member = message.guild.members.get(memberInput);
        if (!member) member = message.mentions.members.first();
        if (!member) member = message.guild.members.get(memberInput.substring(3, memberInput.length - 1));
        if (!member) member = message.guild.members.some(member => member.user.username.substring(0, memberInput.length).toLowerCase() === memberInput.toLowerCase()) ? 'reactions' : false;
        return member ? member : false;
    },
    noMember(message) {
        message.reply('You did not provide a valid member. Please run the command again and this time provide a valid member! This can be a mention, their id or their name')
            .then(message => message.delete(3000));
    },
    errorMessage(message, text) {
        message.reply(text)
            .then(msg => {
                msg.delete(3000);
                if (message.guild)
                    message.delete(3000);
            });
    },
    isMemberHigher(member1, member2) {
        return member1.highestRole.comparePositionTo(member2.highestRole) > 0;
    },
    filterMessages(message) {
        const redacted = [];
        let text = message.content;
        config.bannedWords.forEach(word => {
            if (text.toLowerCase().includes(word))
                redacted.push(word);
        });
        if (!redacted.length)
            return;
        redacted.forEach(word => {
            text = text.replace(new RegExp(word, 'gi'), '####################################################'.substring(0, word.length));
        });
        message.delete(1000);
        const output = new Discord.RichEmbed().setTimestamp().setColor(Math.random().toString(16).slice(2, 8).toUpperCase())
            .setAuthor(message.author.tag, message.author.displayAvatarURL)
            .setDescription(text)
            .setFooter('Deleted due to containing banned words.');
        message.channel.send(output);
        output
            .setDescription(message.content)
            .addField('Banned Words', '```' + redacted.join(', ') + '```')
            .setTitle('Profanity Alert');
        message.client.channels.get(config.modLogChannel).send(output);
    },
    async imageStore(message, image) {
        const msg = await message.client.channels.get(config.imageStorage).send({
            files: [
                {
                    attachment: image,
                    name: message.author.username + '.png'
                }
            ]
        });
        return msg.attachments.first().url;
    },
    modLog(message, log) {
        message.client.channels.get(config.modLogChannel).send(log);
    }
};