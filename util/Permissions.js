const owners = config.prop.owners;

module.exports = {

    hasRole(member, rolename) {
        if (!member.guild) return false;
        const role = member.guild.roles.find(r => r.name === rolename);
        return role && member.roles.includes(role.id);
    },

    isAdmin(member) {
        return module.exports.hasRole(member, 'Admin') || owners.includes(member.id) || member.guild.ownerID === member.id;
    },

};
