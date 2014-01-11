var Steam = require('../steam_client');
var SteamID = require('../steamID');

var EMsg = Steam.EMsg;
var schema = Steam.Internal;

var protoMask = 0x80000000;

// Methods

var prototype = Steam.SteamClient.prototype;

prototype.PICSChangesSince = function(p_LastChangeNumber, p_SendAppChangelist, p_SendPackageChangelist) 
{
  this._send(EMsg.PICSChangesSinceRequest | protoMask, schema.CMsgPICSChangesSinceRequest.serialize({
    since_change_number: p_LastChangeNumber,
    send_app_info_changes: p_SendAppChangelist,
    send_package_info_changes: p_SendPackageChangelist
  }));
};

// Handlers

var handlers = prototype._handlers;

handlers[EMsg.PICSChangesSinceResponse] = function(p_Data) 
{
  schema.CMsgPICSChangesSinceResponse.parse(p_Data); // Do something with this
};