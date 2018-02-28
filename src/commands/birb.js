const request = require('request');

exports.run = function (client, msg) {
    if(!msg.channel.permissionsOf(client.user.id).has('embedLinks')) return msg.channel.createMessage("I don't have `Send Embed` permission.\nPlease contact an administrator if you think this is a bug.");

        try {
            request("https://random.birb.pw/tweet", function (err, body, res) {
                msg.channel.createMessage({
                    embed: {
                        color: config.options.embedColour,
                        image: {
                            url: `https://random.birb.pw/img/${res}`
                        },
                        footer: { text: "Powered by random.birb.pw" }
                    }
                })
       })


        } catch(e) {
            msg.channel.createMessage(`An error occured:\n**${e}**\n\nPlease report this to the administrator if you think this is a bug.`)
        }


}

exports.usage = {
    main: '{prefix}{command}',
    description: 'Show random birb.'
};
