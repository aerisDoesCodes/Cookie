const exec = require('child_process').exec;

exports.run = function (client, msg) {
    if (!config.prop.owners.includes(msg.author.id)) return false;
    
    exec(`${args.join(' ')}`, (error, stdout) => {
        const response = (error || stdout);
        msg.channel.createMessage(`Ran: ${msg.content}\n\`\`\`${response}\`\`\``, {split: true}).catch(console.error);
      });
}

exports.usage = {
    main: '{prefix}{command}',
    description: 'Executes a new process.'
};
