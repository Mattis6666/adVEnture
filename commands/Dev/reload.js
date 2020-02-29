const fs = require('fs');
module.exports = {
    name: 'reload',
    description: 'Reloads all commands. Bot Developer only.',
    extended: '',
    usage: '',
    aliases: ['restart', 'refresh'],
    guildonly: false,
    developersOnly: true,
    args: false,
    category: 'Dev',
    execute(message) {
        let i = 0;
        fs.readdirSync('./commands').forEach(folder => {
            const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                delete require.cache[require.resolve(`../${folder}/${file}`)];
                try {
                    const newCommand = require(`../${folder}/${file}`);
                    message.client.commands.set(newCommand.name, newCommand);
                    i++;
                } catch (error) {
                    console.log(error);
                    message.channel.send(`There was an error while reloading a command \`${file}\`:\n\`${error.message}\``);
                }
            }
        });
        message.channel.send(`Successfully reloaded ${i} commands.`);

    }
};