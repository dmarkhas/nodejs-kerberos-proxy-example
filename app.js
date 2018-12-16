const express = require('express')
const kerberos = require('express-kerberos')
const proxy = require('express-http-proxy')
const session = require('express-session')
const proxyConfig = require('./proxyConfig.js')
const auth = require('./auth.js')

const app = express()

var listenPort = 80

if (process.env.PORT > 0) {
  listenPort = process.env.PORT
}

app.use(session({
  secret: 'kitty',
  resave: false,
  saveUninitialized: false
}));

app.use(kerberos.default()) // Kerberos auth
app.use(auth); // Authentication logic


// Proxy middleware - inject authorization headers to upstream call
app.use('/', proxy(function (req) { return proxyConfig[req.hostname].url },
  {
    proxyReqOptDecorator: function (proxyReqOpts, req) {
      proxyReqOpts.headers['Authorization'] = proxyConfig[req.hostname].authHeader
      return proxyReqOpts;
    } 
  }
)
)

app.listen(listenPort, function () {
  console.log(`Kibana Proxy listening on port ${listenPort}!`)
})


