module.exports = {
    name: 'shutdown',
    description: 'Shuts down the bot. Bot Developer only.',
    extended: '',
    usage: '',
    aliases: ['die', 'kys'],
    guildonly: false,
    developersOnly: true,
    args: false,
    category: 'Dev',
    execute(message) {
        message.reply('Bye, cruel world!')
            .then(() => message.client.destroy());
    }
};