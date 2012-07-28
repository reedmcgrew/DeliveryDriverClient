var settings = require('./settings')
  , hookio = require('hook.io');
var fsReceiverHook = module.exports = hookio.createHook({
  "name": "fsreceiverhook",
});

