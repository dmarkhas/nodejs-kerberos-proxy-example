const proxyMap = {
    'kibana-proxy-biz1.mydomain.com':{
      url:'localhost:5601',
      authHeader:'Basic aGVsbG86a2l0dHk=',
      groups: [
          'CN=Users,OU=Groups,DC=corp,DC=company,DC=com',
          'CN=Admins,OU=Groups,DC=corp,DC=company,DC=com'
      ]
    },
    'kibana-proxy-biz2.mydomain.com':{
      url:'http://remote-server.mydomain.com/',
      authHeader:'Basic aGVsbG8yOmtpdHR5Mg==',
      groups: [
        'CN=PowerUsers,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=Admins,OU=Groups,DC=corp,DC=company,DC=com'
    ]
    }
  }

  module.exports = proxyMap