exports.run = function (client, msg, args) {

    if (!msg.member.isAdmin) return msg.channel.createMessage({ embed: {
        color: config.options.embedColour,
        title: 'Insufficient Permissions',
    }});

    if (!client.voiceConnections.get(msg.channel.guild.id)) return msg.channel.createMessage({ embed: {
        color: config.options.embedColour,
        title: 'There\'s no playback activity.'
    }});

    guilds[msg.channel.guild.id].repeat = 'None';
    guilds[msg.channel.guild.id].queue.splice(1, guilds[msg.channel.guild.id].queue.length);
    client.voiceConnections.get(msg.channel.guild.id).stopPlaying();

};

exports.usage = {
    main: '{prefix}{command}',
    argss: 'None',
    description: 'Clears the queue and halts playback'
};
