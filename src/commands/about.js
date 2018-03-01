exports.run = function (client, msg) {

    if(!msg.channel.permissionsOf(client.user.id).has('embedLinks')) return msg.channel.createMessage("I don't have `Send Embed` permission.\nPlease contact an administrator if you think this is a bug.");


    msg.channel.createMessage({embed:{
        color: config.options.embedColour,
        title: 'Cookie 🍪',
        description: ("Coded by aeris#0018 with love of cookies.\n\n") +
        ("I'm a well coded discord bot that does NSFW, Images, fun and useful commands coded in NodeJS and the library used is [Eris](http://npmjs.com/package/eris). Why Eris? Eris is fast, lightweight, consistent,") +
        ("predictable, flexible and up-to-date.\n\n") +
        ("If you like me please add me to your server!\n[discord.invite.bot](https://discordapp.com/oauth2/authorize/?permissions=19949578&scope=bot&client_id=411538973664608257)\n\n") +
        ("Join my server for free cookies!\nhttps://discord.gg/DP9949T")
    }})
}

exports.usage = {
    main: '{prefix}{command}',
    description: 'View information about the bot.'
};
