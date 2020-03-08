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
        message.channel.send('Pinging...').then(sent => {
            sent.edit(`Pong! Took \`${sent.createdTimestamp - message.createdTimestamp}ms\`.`);
        });
    }
};