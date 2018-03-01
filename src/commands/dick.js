const randomPuppy = require('random-puppy');
const DBL = require("dblapi.js");
const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQxMTUzODk3MzY2NDYwODI1NyIsImJvdCI6dHJ1ZSwiaWF0IjoxNTE5OTIyNDYyfQ.ZC7kyDkP6f7xBeC0sEn0kB9w8V7CrgG8THD9OvsU_To');
var subreddits = [
    'ratemycock',
    'Cock'
]
var sub = subreddits[Math.round(Math.random() * (subreddits.length - 1))];

exports.run = function (client, msg) {

    if(!msg.channel.permissionsOf(client.user.id).has('embedLinks')) return msg.channel.createMessage("I don't have `Send Embed` permission.\nPlease contact an administrator if you think this is a bug.");
    try {
        //Make user upvote!
        dbl.getVotes(true, 3).then(voters => {
          let k = voters.includes(msg.author.id)
          if(!k) return msg.channel.createMessage('You must upvote this bot for NSFW commands!\nUpvote Here: https://discordbots.org/bot/411538973664608257')
        if (!msg.channel.nsfw) return msg.channel.createMessage("You must only run this command in a NSFW channel!");
        randomPuppy(sub).then(url=> {
            msg.channel.createMessage({embed:{
                "color": config.options.embedColour,
                "image": {
                    "url": url
                },
                "footer" : { text: "Powered by random-puppy" }
            }})
        })
          })
        } catch(e) {
            msg.channel.createMessage(`An error occured:\n**${e}**\n\nPlease report this to the administrator if you think this is a bug.`)
        }
    
}

exports.usage = {
    main: '{prefix}{command}',
    description: 'Shows random penis from /r/ratemycock.',
    alias: 'cock'
};
