var settings = require('./settings')
  , HookIo = require('hook.io');
var fsReceiverHook = module.exports = HookIo.createHook({
  "name": "fsreceiverhook",
});

