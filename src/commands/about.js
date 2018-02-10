exports.run = function (client, msg) {
    
    msg.channel.createMessage({embed:{
        color: config.options.embedColour,
        title: 'Cookie 🍪',
        description: ("Coded by aeris#0018 with love of cookies.\n\n") +
        ("Cookie is mainly a music bot with high quality coded in NodeJS and the library used is [Eris](http://npmjs.com/package/eris). Why Eris? Eris is fast, lightweight, consistent,") + 
        ("predictable, flexible and up-to-date.\n\n") +
        ("Add me to your server!\nhttps://discordapp.com/oauth2/authorize/?permissions=19949578&scope=bot&client_id=411538973664608257\n\n") +
        ("Join my server for free cookies!\nhttps://discord.gg/wp2Z6yy")
    }})
}

exports.usage = {
    main: '{prefix}{command}',
    description: 'View information about the bot.'
};
