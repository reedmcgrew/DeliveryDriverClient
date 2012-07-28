var HookIo = require('hook.io');
var hookB = HookIo.createHook({
  name: "b"
});
hookB.on('hook::ready', function(){
  hookB.on('*::foursquareUpdate', function(data){
    console.log(data);
  });
});
hookB.start();
