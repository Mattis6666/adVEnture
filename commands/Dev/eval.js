/* eslint-disable no-unused-vars */
module.exports = {
    name: 'eval',
    description: 'Runs code. Dev only.',
    usage: '',
    aliases: ['debug', 'code'],
    guildonly: false,
    developersOnly: true,
    args: true,
    modCommand: false,
    category: 'Dev',
    async execute(message, args) {
        const db = require('../../utility/mongo.js');
        const functions = require('../../utility/functions.js');
        const nekos = require('../../utility/nekos.js');
        const config = require('config');
        let output;
        try {
            output = await eval(args.join(' '));
        }
        catch (err) {
            message.channel.send(`An error occurred!\n\`\`\`js\n${err.stack}\`\`\``);
        }
        try {
            if (!output) return;
            const jsonObj = typeof output !== 'object' ? JSON.parse(output) : output;
            const out = JSON.stringify(jsonObj, null, '\t');
            message.channel.send(`\`\`\`js\n${out.replace(config.token, '[REDACTED]').replace(config.mongoString, '[REDACTED]')}\`\`\``);
        }
        catch (err) {
            try {
                message.channel.send(output);
            }
            catch (err) {
                message.channel.send(`An error occurred!\n\`\`\`js\n${err.stack}\`\`\``);
            }
        }
    },
};

