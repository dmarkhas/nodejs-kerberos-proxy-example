const activedirectory = require('activedirectory')
const proxyConfig = require('./proxyConfig.js')
const _ = require('underscore')


function authorize(req, res, next) {

    // Fail if user is unauthenticated
    if (typeof req.auth == 'undefined') { 
        return res.status(403).send('Authentication Failure')
    }

    // If already authenticated - skip LDAP lookup
    if (req.session.authorized) {
        return next();
    }

    const allowedGroups = proxyConfig[req.hostname].groups

    // LDAP Settings
    const ad = new activedirectory({
        url: 'ldap://ldap.server.com',
        baseDN: 'dc=company,dc=com',
        username: 'user@company.com',
        password: 'password'
    })
    
    var idsid = req.auth.username.split('@')[0]
    var opts = { attributes: ['cn', 'dn'] }

    ad.getGroupMembershipForUser(opts, idsid, function (err, ldapGroups) {
        if (err) { // Error getting user group membership
            return res.status(403).send(err)
        }

        else if (!ldapGroups || ldapGroups.length === 0) {
            return res.status(403).send(err)
        }

        else {
            for (var i = 0 ; i < allowedGroups.length; i++) {   
                var result = _.any(ldapGroups, function (item) {
                    return (item.dn === allowedGroups[i] || item.cn === allowedGroups[i]);
                });
                if (result) {
                    console.log(`User ${req.auth.username} is authorized`)
                    req.session.authorized = true
                    req.session.save()
                    return next()
                }
            }
        }
        return res.status(403).send(err)
    })
}


module.exports = authorize

