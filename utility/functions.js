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
        return message.mentions.roles.first()
            || message.guild.roles.get(args[spot].replace(/[^0-9]/gi, ''))
            || message.guild.roles.find(role => role.name.substring(0, args[spot].length).toLowerCase() === args[spot].toLowerCase())
            || false;
    },
    noRole(message) {
        message.reply('You did not provide a valid role. Please run the command again and this time provide a valid role! This can be a mention, its id or its name')
            .then(message => message.delete(3000));
    },
    getMemberMod(message, args, spot) {
        let member = message.mentions.members.first()
            || message.guild.members.get(args[spot].replace(/[^0-9]/gi, ''));
        if (!member) member = message.guild.members.some(member => member.user.username.substring(0, args[spot].length).toLowerCase() === args[spot].toLowerCase()) ? 'reactions' : false;
        return member || false;
    },
    getMember(message, args, spot) {
        return message.mentions.members.first()
            || message.guild.members.get(args[spot].replace(/[^0-9]/gi, ''))
            || message.guild.members.find(member => member.user.username.substring(0, args[spot].length).toLowerCase() === args[spot].toLowerCase())
            || false;
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