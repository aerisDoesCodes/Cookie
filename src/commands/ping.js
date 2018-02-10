exports.run = function (client, msg, args) {

    msg.channel.createMessage(`Pong! \`${msg.channel.guild.shard.latency}ms\``);

};

exports.usage = {
    main: '{prefix}{command}',
    description: 'Views the response latency of the client.'
};
