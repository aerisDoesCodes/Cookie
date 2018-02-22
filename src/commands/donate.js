exports.run = function (client, msg) {
    
    msg.channel.createMessage("All amount of donation are appreciated!\n\nHere is my donation link to keep me alive! https://www.paypal.me/JohnLoveCookies")
}

exports.usage = {
    main: '{prefix}{command}',
    description: 'Donation to keep cookie alive.'
};
