const sf     = require('snekfetch');
var dbotsKey = "e4f476451d22298a3f7f0c942422097ea61edb0682f66e153e29e77dedf7fd422a11afe51b0644a08bf8e58a7d2737d135bf22f78fcc29dfcbd10c2b5e4522b2";

exports.run = function (client, msg) {
  sf.post(`https://botsfordiscord.com/api/v1/bots/${client.user.id}`)
  .set('Authorization', dbotsKey)
  .send({ server_count: client.guilds.size })
  .then(() => msg.channel.createMessage("Updated BFD stats."))
  .catch(err => msg.channel.createMessage(`Something went wrong while trying to update server count over botsfordiscord.com : ${err.body}`));
}

exports.usage = {
    main: '{prefix}{command}',
    description: 'Post server count on BFD.'
};
