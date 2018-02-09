const sf  = require('snekfetch');
const sck = require('../src/config.json').keys.soundcloud;

module.exports = {

    async getTrack(id) {

        const req = await sf.get('http://api.soundcloud.com/resolve.json')
            .query({
                url       : id,
                client_id : sck
            }).catch(() => { return []; });

        if (!req || !req.body || req.body.kind !== 'track') return [];

        const stream = await sf.get(`https://api.soundcloud.com/i1/tracks/${req.body.id}/streams`).query({
            client_id : sck
        }).catch(() => { return null; });

        if(!stream.body.http_mp3_128_url) return [];

        return [{
            id    : stream.body.http_mp3_128_url,
            title : `${req.body.user.username} - ${req.body.title}`
        }];
    }

};
