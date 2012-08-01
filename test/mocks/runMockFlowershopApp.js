/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/31/12
 * Time: 9:47 PM
 * To change this template use File | Settings | File Templates.
 */
var bootstrapDetails = {
  port:4444,
  host:'localhost',
  eslBaseRoute:'deliveries'
};
var fsApp = require('./MockFlowershopApp');
fsApp.bootstrap(bootstrapDetails)(function(){
   console.info("started");
});
