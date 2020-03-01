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
    async execute(message) {
        await message.reply('Bye, cruel world!');
        await message.client.destroy();
        await process.exit();
    }
};