var settings = require('./settings')
  , HookIo = require('hook.io');
var twilioReceiverHook = module.exports = HookIo.createHook({
  "name": "twilioreceiverhook",
});

