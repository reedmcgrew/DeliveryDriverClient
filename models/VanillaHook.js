var HookIo = require('hook.io');
var hook = HookIo.createHook({
    name: "bus"
});

hook.bootstrap = function(callback){
    hook.on("hook::ready", function(){
        callback();
    });
    hook.start();
};

module.exports = hook;
