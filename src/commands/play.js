const ytutil           = require('../../util/youtube.js');
const scutil           = require('../../util/soundcloud.js');
const sthandle         = require('../streamHandler.js');
const messageCollector = require('../../util/messageCollector.js');

const ytrx = new RegExp('(?:youtube\\.com.*(?:\\?|&)(?:v|list)=|youtube\\.com.*embed\\/|youtube\\.com.*v\\/|youtu\\.be\\/)((?!videoseries)[a-zA-Z0-9_-]*)');
const scrx = new RegExp('((https:\\/\\/)|(http:\\/\\/)|(www.)|(s))+(soundcloud.com\\/)+[a-zA-Z0-9-.]+(\\/)+[a-zA-Z0-9-.]+');

exports.run = async function (client, msg, args) {
    if (!args[0]) return msg.channel.createMessage({ embed: {
        color: config.options.embedColour,
        title: 'You need to specify something',
        description: 'YouTube: Search Term, URL or Playlist URL\nSoundCloud: URL'
    }});

    if (!client.voiceConnections.isConnected(msg.channel.guild.id)) {
        if (!msg.member.voiceState.channelID)
            return msg.channel.createMessage({ embed: {
                color: config.options.embedColour,
                title: 'Join a voicechannel first',
            }});

        if (!client.getChannel(msg.member.voiceState.channelID).hasPermissions(client.user.id, 'voiceConnect', 'voiceSpeak'))
            return msg.channel.createMessage({ embed: {
                color: config.options.embedColour,
                title: 'Unable to Connect',
                description: 'This channel doesn\'t allow me to connect/speak.'
            }});


        await client.joinVoiceChannel(msg.member.voiceState.channelID)
            .catch(e => {
                msg.channel.createMessage({ embed: {
                    color: config.options.embedColour,
                    title: 'Unable to Connect',
                    description: e.message
                }});
            });

        if (!client.voiceConnections.isConnected(msg.channel.guild.id)) return;

    } else if (msg.member.voiceState.channelID !== client.voiceConnections.get(msg.channel.guild.id).channelID)
        return msg.channel.createMessage({ embed: {
            color: config.options.embedColour,
            title: 'Join my voicechannel to queue.',
        }});

    const guild = guilds[msg.channel.guild.id];
    guild.msgc = msg.channel.id;

    const query = args.join(' ').replace(/<|>/g, '');
    const ytrxm = query.match(ytrx);
    const scrxm = query.match(scrx);

    const res = {};

    if ((!ytrxm || !ytrxm[1]) && (!scrxm || !scrxm[1])) {

        if (!config.keys.youtube) {
            if (client.voiceConnections.isConnected(msg.channel.guild.id) && guild.queue.length === 0) client.leaveVoiceChannel(client.voiceConnections.get(msg.channel.guild.id).channelID);
            return msg.channel.createMessage({ embed: {
                color: config.options.embedColour,
                title: 'No YouTube key specified',
                description: 'No YouTube key was configured in `config.json`. YouTube not available.'
            }});
        }

        res.src = 'youtube';
        res.type = 'search';
        res.items = await ytutil.search(query);

    } else {

        if (ytrxm && ytrxm[1]) {

            if (!config.keys.youtube) {
                if (client.voiceConnections.isConnected(msg.channel.guild.id) && guild.queue.length === 0) client.leaveVoiceChannel(client.voiceConnections.get(msg.channel.guild.id).channelID);
                return msg.channel.createMessage({ embed: {
                    color: config.options.embedColour,
                    title: 'No YouTube key specified',
                    description: 'No YouTube key was configured in `config.json`. YouTube not available.'
                }});
            }

            res.src = 'youtube';

            if (ytrxm[1].length >= 15) {
                res.type = 'playlist';
                res.items = await ytutil.getPlaylist(ytrxm[1]);
            } else {
                res.type = 'url';
                res.items = await ytutil.videoInfo(ytrxm[1]);
            }

        } else {

            if (!config.keys.soundcloud) {
                if (client.voiceConnections.isConnected(msg.channel.guild.id) && guild.queue.length === 0) client.leaveVoiceChannel(client.voiceConnections.get(msg.channel.guild.id).channelID);
                return msg.channel.createMessage({ embed: {
                    color: config.options.embedColour,
                    title: 'No SoundCloud key specified',
                    description: 'No SoundCloud key was configured in `config.json`. SoundCloud not available.'
                }});
            }

            res.src = 'soundcloud';
            res.type = 'soundcloud';
            res.items = await scutil.getTrack(query);

        }

    }

    if (res.items.length === 0) {
        if (client.voiceConnections.isConnected(msg.channel.guild.id) && guild.queue.length === 0) client.leaveVoiceChannel(client.voiceConnections.get(msg.channel.guild.id).channelID);
        return msg.channel.createMessage({ embed: {
            color: config.options.embedColour,
            title: 'No results found.',
        }});
    }

    if (res.type !== 'search') {

        res.items.map(v => guild.queue.push({ id: v.id, title: v.title, req: msg.author.id, src: res.src, durl: res.src === 'soundcloud' ? scrxm[1] : undefined }));
        const embed = {
            color: config.options.embedColour,
            title: `Enqueued ${res.items[0].title}`
        };
        if (res.type === 'playlist') embed.description = `...and ${res.items.slice(1).length} songs.`;

        msg.channel.createMessage({ embed: embed });

    } else {

        const src = await msg.channel.createMessage({ embed: {
            color: config.options.embedColour,
            title: 'Select Song',
            description: res.items.map((v, i) => `**${i + 1}.** ${v.snippet.title}`).join('\n'),
            footer: {
                text: '1, 2 or 3 || c to cancel selection'
            }
        }});

        const selected = await msg.channel.awaitMessages(m => m.author.id === msg.author.id && m.channel.guild && (parseInt(m.content) && m.content >= 1 && m.content <= res.items.length || m.content.toLowerCase().startsWith(`${msg.channel.guild.prefix}p`) || m.content === 'c'), { timeout: 10e3 });

        if (!selected || selected.content.toLowerCase().startsWith(`${msg.channel.guild.prefix}p`) || selected.content === 'c') {
            if (!selected || selected.content === 'c' && client.voiceConnections.isConnected(msg.channel.guild.id) && guild.queue.length === 0) client.leaveVoiceChannel(client.voiceConnections.get(msg.channel.guild.id).channelID);
            return src.delete();
        }

        if (msg.channel.permissionsOf(client.user.id).has('manageMessages')) selected.delete();
        guild.queue.push({ id: res.items[selected.content - 1].id.videoId, title: res.items[selected.content - 1].snippet.title, req: msg.author.id, src: 'youtube' });

        src.edit({ embed: {
            color: config.options.embedColour,
            title: `Enqueued ${res.items[selected.content - 1].snippet.title}`,
            description: `Requested by ${msg.author.username}#${msg.author.discriminator}`
        }});
    }

    sthandle.play(guild, client);
};

exports.usage = {
    main: '{prefix}{command}',
    args: '<YouTube URL/Playlist/Search | Soundcloud URL>',
    description: 'Play the specified song'
};
