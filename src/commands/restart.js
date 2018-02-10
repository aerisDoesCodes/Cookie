const fs = require('fs');

exports.run = function(client, msg, args) {
    if (msg.author.id !== '241216483592634368') return;
    fs.writeFile('./prefixes.json', JSON.stringify(prefixes, '', '\t'), (err) => {
        if (err) console.log('Failed to update prefixes.');

        msg.channel.createMessage(':gear: Now restarting...').then(() => {
            process.exit();
        });
    });
};

exports.usage = {
    main: '{prefix}{command}',
    argss: 'None',
    description: 'Developer command'
};
