exports.run = function (client, msg, args) {

    msg.channel.createMessage("Invite Bot: <https://discordapp.com/oauth2/authorize/?permissions=19949578&scope=bot&client_id=411538973664608257>\n" + 
    "Support: https://discord.gg/DP9949T");

};

exports.usage = {
    main: '{prefix}{command}',
    description: 'Shows server and bot invite links'
};
