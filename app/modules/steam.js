//TODO: Write the listener for games
var db = require('./database');
var Steam = require('steam');
var Servers = db.collection('steam_servers');

module.exports = function(){
    Servers.findOne({},function(err,data){
        // Update the server list if we have it in the DB
        if(data){
            console.log('Found saved server list');
            Steam.servers = data.list;
        }

        Listener.logOn({
            accountName: process.env.STEAM_USER,
            password: process.env.STEAM_PASSWORD
        });
    });
    var Listener = new Steam.SteamClient();

    Listener.on('loggedOn',function(){
        console.log('Logged in to Steam');
    });

    Listener.on('servers',function(list){
        console.log('Got updated server list, total: ',list.length);
        // Empty the collection and add new servers
        Servers.remove();
        Servers.save({list:list});
    });

    Listener.on('fromGC',function(id,type,body){
        console.log('GC arguments',JSON.stringify(arguments));
        console.log('GC Message', id, type);
        console.log('GC Body',body);
    });

    Listener.on('message',function(){
        console.log('Message arguments',JSON.stringify(arguments));
    });

    Listener.on('error',function(error){
        console.log('Error occurred: ',error);
    });
};


/*var SteamClient = Steam.SteamClient;

var EMsg = SteamClient.EMsg;
var schema = SteamClient.Internal;

var protoMask = 0x80000000;

// Methods

var prototype = SteamClient.prototype;

prototype.PICSChangesSince = function(p_LastChangeNumber, p_SendAppChangelist, p_SendPackageChangelist) {
  this._send(EMsg.PICSChangesSinceRequest | protoMask, schema.CMsgPICSChangesSinceRequest.serialize({
    since_change_number: p_LastChangeNumber,
    send_app_info_changes: p_SendAppChangelist,
    send_package_info_changes: p_SendPackageChangelist
  }));
};

// Handlers
var handlers = prototype._handlers;

handlers[EMsg.PICSChangesSinceResponse] = function(p_Data) {
  schema.CMsgPICSChangesSinceResponse.parse(p_Data); // Do something with this
};*/