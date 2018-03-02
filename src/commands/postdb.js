const superagent = require('superagent')

exports.run = function (client, msg) {
  superagent.post(`https://discordbots.org/api/bots/stats`)
    .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQxMTUzODk3MzY2NDYwODI1NyIsImJvdCI6dHJ1ZSwiaWF0IjoxNTE5OTIyNDYyfQ.ZC7kyDkP6f7xBeC0sEn0kB9w8V7CrgG8THD9OvsU_To')
    .send({ server_count: client.guilds && client.guilds.size ? client.guilds.size : (client.Guilds ? client.Guilds.size : Object.keys(client.Servers).length) })
    .then(() => msg.channel.createMessage('Updated discordbots.org stats'))
    .catch(err => msg.channel.createMessage(`Error updating discordbots.org stats: ${err.body || err}`));
}
