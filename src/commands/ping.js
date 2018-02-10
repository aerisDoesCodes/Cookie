exports.run = function (client, msg, args) {

    msg.channel.createMessage('Pong!');

};

exports.usage = {
    main: '{prefix}{command}',
    description: 'Ping Pong!'
};
