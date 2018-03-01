const randomPuppy = require('random-puppy');
var subreddits = [
    'awwnime'
]
var sub = subreddits[Math.round(Math.random() * (subreddits.length - 1))];

exports.run = function (client, msg) {

    if(!msg.channel.permissionsOf(client.user.id).has('embedLinks')) return msg.channel.createMessage("I don't have `Send Embed` permission.\nPlease contact an administrator if you think this is a bug.");
    try {
        //Make user upvote!
        randomPuppy(sub).then(url=> {
            msg.channel.createMessage({embed:{
                "color": config.options.embedColour,
                "image": {
                    "url": url
                },
                "footer" : { text: "Powered by random-puppy" }
            }})
        })
        } catch(e) {
            msg.channel.createMessage(`An error occured:\n**${e}**\n\nPlease report this to the administrator if you think this is a bug.`)
        }

}

exports.usage = {
    main: '{prefix}{command}',
    description: 'Shows random anime from /r/awwnime.'
};
