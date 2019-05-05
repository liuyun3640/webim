var Long = require("long");
var _utils = require("../utils").utils;
var handleMessage = function(meta, status, conn){
	var self = conn;
	var messageBodyMessage = self.context.root.lookup("easemob.pb.RosterBody");
    var thirdMessage = messageBodyMessage.decode(meta.payload);
    var msgId = new Long(meta.id.low, meta.id.high, meta.id.unsigned).toString();
    var type = null;
    var msg = {
        to: thirdMessage.to[0].name,
        from: thirdMessage.from.name,
        status: thirdMessage.reason
    };
    switch (thirdMessage.operation){
        case 0:
            break;
        case 2:
            msg.type = 'subscribe';
            break;
        case 3:
            msg.type = 'unsubscribed';
            break;
        case 4:
            msg.type = 'subscribed';
            break;
        case 5:
            msg.type = 'unsubscribed';
            break;
        case 6:
            conn.getBlacklist();
            break;
        case 7:
            conn.getBlacklist();
            break;
        case 8:
            msg.type = 'subscribed';
            break;
        case 9:
            msg.type = 'unsubscribed';
             break;

    }

    conn.onPresence(msg);
    console.log(thirdMessage.operation);
    
    
}

export {
    handleMessage,
}