const request = require('request');

exports.run = function (client, msg) {
    if(!msg.channel.permissionsOf(client.user.id).has('embedLinks')) return msg.channel.createMessage("I don't have `Send Embed` permission.\nPlease contact an administrator if you think this is a bug.");
    try {
    const response = request('https://random.dog/woof.json', (e,r,b) => {
    var imageURL = JSON.parse(b).url
    msg.channel.createMessage({embed:{
        "color": config.options.embedColour,
        "image": {
            "url": imageURL
        }
    }})
        })
        
    } catch(e) {
        msg.channel.createMessage(`An error occured:\n**${e}**\n\nPlease report this to the administrator if you think this is a bug.`)
    }

}

exports.usage = {
    main: '{prefix}{command}',
    description: 'Show random dog.',
    alias: 'doggo'
};
