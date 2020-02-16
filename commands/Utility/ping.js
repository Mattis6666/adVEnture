module.exports = {
    name: 'ping',
    description: 'Returns the client ping/heartbeat',
    extended: '',
    usage: '',
    aliases: ['heartbeat', 'delay', 'responsetime'],
    guildonly: false,
    developersOnly: false,
    args: false,
    category: 'Utility',
    execute(message) {
        message.channel.send(`Pong! \`${new Date().getTime() - message.createdTimestamp} ms\``);
    }
};