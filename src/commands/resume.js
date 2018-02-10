exports.run = function (client, msg, args) {

    if (!msg.member.isAdmin) return msg.channel.createMessage({ embed: {
        color: config.options.embedColour,
        title: 'Insufficient Permissions',
    }});

    if (!client.voiceConnections.get(msg.channel.guild.id) || guilds[msg.channel.guild.id].queue.length === 0) return msg.channel.createMessage({ embed: {
        color: config.options.embedColour,
        title: 'There\'s no playback activity.'
    }});

    client.voiceConnections.get(msg.channel.guild.id).resume();

};

exports.usage = {
    main: '{prefix}{command}',
    argss: 'None',
    description: 'Resume playback of the current song if it was paused'
};
