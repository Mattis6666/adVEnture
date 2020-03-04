const functions = require('../../utility/functions.js');
const db = require('../../utility/mongo.js');
module.exports = {
    name: 'warn',
    description: 'Warns a user. Prompts to ban them instead if they already have 3 warns.',
    extended: '',
    usage: '[User ID/@user] <Reason>',
    aliases: [],
    guildonly: true,
    developersOnly: false,
    args: true,
    category: 'Mod',
    memberPermission: 'BAN_MEMBERS',
    botPermission: '',
    async execute(message, args) {
        const member = functions.getMemberMod(message, args, 0);
        if (!member || member === 'reactions') return functions.noMember(message);

        const reason = args[1] ? args.splice(1).join(' ') : 'None';

        const dbEntry = await db.getUser(member.id);
        if (!dbEntry)
            return;
        const count = dbEntry.warns.length;
        await db.createWarn(member.id, reason, message.author.id, message.author.tag, new Date());
        const output = functions.newEmbed()
            .setTitle('Warn')
            .setDescription(`${member} has successfully been warned.`)
            .addField('Member', member.user.tag)
            .addField('Moderator', message.author.tag)
            .addField('Reason', reason)
            .setThumbnail(member.user.displayAvatarUrl)
            .setFooter(count ? `They now have ${count + 1} warns.` : 'This is their first warn.');
        await message.channel.send(output);
        functions.modLog(message, output);
        member.send(output.setDescription(`You have been warned on ${message.guild.name}.`).setFooter(`You now have ${count + 1} warns.`))
            .catch(() => {
                return;
            });

        if (count >= 3) {
            const msg = await message.channel.send('This user has 3 or more warns. Ban?');
            await msg.react('✅');
            await msg.react('❌');
            const collector = msg.createReactionCollector((_reaction, user) => user.id === message.author.id, { time: 1000 * 60 * 5 });
            collector.on('collect', r => {
                if (r.emoji.name === '✅') {
                    member.send(`You have been banned from ${message.guild.name} due to having ${count + 1} warns.`)
                        .catch(() => {
                            return;
                        })
                        .then(() => {
                            member.ban();
                        });
                    functions.modLog(message, `${member.user.tag} has been banned due to having ${count + 1} warns.`);
                }
                else functions.errorMessage(message, 'Ban cancelled.');
                msg.delete();
            });
        }
    }
};