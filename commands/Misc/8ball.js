module.exports = {
    name: '8ball',
    description: 'Ask a yes or no question and the 8ball will respond.',
    extended: '',
    usage: '[question]',
    aliases: ['fortune', '8b'],
    guildonly: false,
    developersOnly: false,
    args: true,
    category: 'Misc',
    execute(message) {
        const responses = ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes - definitely.', 'You may rely on it.', 'As I see it, yes.', 'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.', 'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.', 'Don\'t count on it.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful.'];
        return message.channel.send(
            responses[Math.floor(Math.random() * responses.length)]
        );
    }
};