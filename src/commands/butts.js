const snek = require("snekfetch");
const got = require('got');
const _ = require('lodash');
// const DBL = require("dblapi.js");
// const dbl = new DBL('');

getAss = (callback) => {
    got('http://api.obutts.ru/butts/noise/' + _.random(100,10732)).then(res => {
      try {
        let length =  JSON.parse(res.body).length;
        callback(undefined, JSON.parse(res.body)[_.random(0,length)].preview);
      } catch (err) {
        callback(err);
      }
    }).catch(callback);
  };


exports.run = function (client, msg) {

    if(!msg.channel.permissionsOf(client.user.id).has('embedLinks')) return msg.channel.createMessage("I don't have `Send Embed` permission.\nPlease contact an administrator if you think this is a bug.");
    try {
        //Make user upvote!
        //   let upvote = dbl.hasVoted(msg.author.id)
        //       if(!upvote) return msg.channel.createMessage(`You must upvote this bot for NSFW commands! Do: \`c!upvote\``)
        if (msg.channel.nsfw) {
            return getAss((a,b)=>{
                b ='http://media.obutts.ru/'+b;
              //This part is d.js, recreating this on eris!
            //   emb.setImage(b);
            //   msg.channel.send(' ', {embed: emb});
            msg.channel.createMessage({embed:{
                "color": config.options.embedColour,
                "image": {
                    "url": b
                }
            }})
            });
          } else {
            return msg.channel.createMessage("You must only run this command in a NSFW channel!");
          }
       
          
        } catch(e) {
            msg.channel.createMessage(`An error occured:\n**${e}**\n\nPlease report this to the administrator if you think this is a bug.`)
        }
    
}

exports.usage = {
    main: '{prefix}{command}',
    description: 'Shows random butts.'
};
