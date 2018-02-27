const snek = require("snekfetch");
const got = require('got');
const _ = require('lodash');
const DBL = require("dblapi.js");
const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQxMTUzODk3MzY2NDYwODI1NyIsImJvdCI6dHJ1ZSwiaWF0IjoxNTE5NzEyODE5fQ.IKJXAx-SR6_Upx4VhR2UKuODAh5yuu3sisXiXpBXuUw');


getBoobs = (callback) => {
    got('http://api.oboobs.ru/boobs/noise/' + _.random(100,10732)).then(res => {
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
      dbl.getVotes(true, 7).then(voters => {
        let k = voters.includes(msg.author.id)
        if(!k) return msg.channel.createMessage('You must upvote this bot for NSFW commands!\nUpvote Here: https://discordbots.org/bot/411538973664608257')
      if (!msg.channel.nsfw) return msg.channel.createMessage("You must only run this command in a NSFW channel!");
          return getBoobs((a,b)=>{
            b ='http://media.oboobs.ru/'+b;
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
})
      } catch(e) {
          msg.channel.createMessage(`An error occured:\n**${e}**\n\nPlease report this to the administrator if you think this is a bug.`)
      }
    
}

exports.usage = {
    main: '{prefix}{command}',
    description: 'Shows random boobs.',
    alias: 'tits'
};
