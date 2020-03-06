// LIBRARY IMPORT
const fs = require('fs');
const Discord = require('discord.js');
const config = require('config');
const functions = require('./utility/functions');

// INITIATE BOT CLIENT, COMMANDS
const client = new Discord.Client();
client.commands = new Discord.Collection();
fs.readdirSync('./commands').forEach(folder => {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
});

// ACTIONS DONE ON STARTUP
client.once('ready', () => {
    client.user.setPresence({
        game: {
            name: `${config.prefix}help`,
            type: 'PLAYING',
        }
    });
    console.log(`Successfully logged in as ${client.user.username} - ${client.user.id}\nServing ${client.guilds.cache.size} guilds\nPrefix: ${config.prefix}`);
    if (config.token === 'heroku') client.channels.cache.get(config.errorChannel).send('<@265560538937819137> I successfully rebooted!');

    Object.keys(config.reactionRoles).forEach(message => {
        client.channels.cache.get(config.reactionRoles[message].channel).messages.fetch(message).then(msg => msg.react('✅'));
    });
});

// MESSAGE HANDLER FOR COMMANDS AND SUCH
client.on('message', message => {
    if (message.guild)
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
    if (message.author.bot)
        return;
    if (config.blockedChannels.includes(message.channel.id))
        return;
    if (message.mentions.has(client.user))
        message.channel.send(`**Prefix:** ${config.prefix}\nFor a list of commands, type \`${config.prefix}help\``);
    if (message.guild)
        if (!message.channel.permissionsFor(message.member).has('MANAGE_MESSAGES')) functions.filterMessages(message);
    if (!message.content.startsWith(config.prefix))
        return;

    const args = message.content.slice(config.prefix.length).split(/ +/);

    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    if (command.developersOnly && !config.developers.includes(message.author.id)) return;
    if (command.guildOnly && !message.guild)
        return functions.errorMessage(message, 'This command can only be used on a server!');
    if (command.memberPermission && !message.channel.permissionsFor(message.member).has(command.memberPermission))
        return functions.errorMessage(message, `You cannot use this command as it requires you to have the \`${command.memberPermission}\` Permission!`);
    if (command.botPermission && !message.channel.permissionsFor(message.guild.me).has(command.botPermission))
        return functions.errorMessage(message, `I require the \`${command.botPermission}\` Permission to do this!`);
    if (command.args && !args.length)
        return functions.errorMessage(message, `Missing input. Please refer to the \`${config.prefix}help ${command.name}\` page.`);

    try {
        command.execute(message, args);
    } catch (error) {
        functions.logError(error, client, message);
    }
});

// REACTION ROLES
client.on('messageReactionAdd', (reaction, user) => {
    const messageID = reaction.message.id;
    if (!Object.keys(config.reactionRoles).includes(messageID))
        return;
    if (user !== client.user)
        reaction.users.remove(user);
    const role = reaction.message.guild.roles.cache.get(config.reactionRoles[messageID].role);
    if (!role)
        return;
    const member = reaction.message.guild.members.cache.get(user.id);
    if (!member || member.user.bot)
        return;
    if (member.roles.cache.has(role.id)) {
        member.roles.remove(role);
        user.send(`I successfully removed the role \`${role.name}\` from you.`).catch(() => { return; });
    }
    else {
        member.roles.add(role);
        user.send(`I successfully added the role \`${role.name}\` to you.`).catch(() => { return; });
    }
});

// ERROR LOGGING
client.on('error', error => {
    functions.logError(error, client);
});
client.on('warn', warn => {
    functions.logError(warn, client);
});

// CLIENT LOGIN
if (config.token === 'heroku')
    client.login(process.env.BOT_TOKEN);
else
    client.login(config.token);