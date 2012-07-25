var hookio = require('hook.io');
var hook = hookio.createHook({
    name: "vanilla-hook",
});

hook.bootstrap = function(callback){
    hook.on("hook::ready", function(){
        callback();
    });
    hook.start();
};

module.exports = hook;
