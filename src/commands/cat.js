const {get} = require("snekfetch");

exports.run = function (client, msg) {
    if(!msg.channel.permissionsOf(client.user.id).has('embedLinks')) return msg.channel.createMessage("I don't have `Send Embed` permission.\nPlease contact an administrator if you think this is a bug.");
    try {
    get("https://random.cat/meow").then(res => {
        msg.channel.createMessage({embed: {
            "color": config.options.embedColour,
        "image": { "url": res.body.file },
        'footer': { text: "Powered by random.cat" }
        }})
    });
        
    } catch(e) {
        msg.channel.createMessage(`An error occured:\n**${e}**\n\nPlease report this to the administrator if you think this is a bug.`)
    }

}

exports.usage = {
    main: '{prefix}{command}',
    description: 'Show random cat.',
    alias: 'kat'
};
