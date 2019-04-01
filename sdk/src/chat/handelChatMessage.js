var Long = require("long");
var _utils = require("../utils").utils;
var handelMessage = function(meta, conn){
	var self = conn;
	var messageBodyMessage = self.context.root.lookup("easemob.pb.MessageBody");
    var thirdMessage = messageBodyMessage.decode(meta.payload);
    var msgId = new Long(meta.id.low, meta.id.high, meta.id.unsigned).toString();
    var type = null;
    if (thirdMessage.type === 1) {
        type = "chat";
    }
    else if (thirdMessage.type === 2) {
        type = "groupchat";
    }
    else if (thirdMessage.type === 3) {
        type = "chatroom";
    }
    for (var i = 0; i < thirdMessage.contents.length; i++) {
        var msg = {};
        var msgBody = thirdMessage.contents[i];
        var from = thirdMessage.from.name;
        var to = thirdMessage.to.name
        switch(msgBody.type){
            case 0:
            	var receiveMsg = thirdMessage.contents[i].text;
            	var emojibody = _utils.parseTextMessage(receiveMsg, WebIM.Emoji);
            	if (emojibody.isemoji) {
                    msg = {
                        id: id
                        , type: type
                        , from: from
                        , to: to
                        // , delay: parseMsgData.delayTimeStamp
                        , data: emojibody.body
                        , ext: extmsg
                    };
                    !msg.delay && delete msg.delay;
                    self.onEmojiMessage(msg);
                }
                else{
		            msg = {
		                id: msgId,
		                type: type,
		                from: from,
		                to: to,
		                data: msgBody.text,
		                ext: thirdMessage.ext,
		                sourceMsg: msgBody.text
		            }
		            msg.error = "";
			        msg.errorText = "";
			        msg.errorCode = "";
			        conn.onTextMessage(msg);
                }
            break;
        case 1:
        	// var rwidth = 0;
         //    var rheight = 0;
            if (msgBody.size) {
                var rwidth = msgBody.size.width || 0;
                var rheight = msgBody.size.height || 0;
            }
            msg = {
                id: msgId
                , type: type
                , from: from
                , to: to
                ,
                url: msgBody.url && (location.protocol != 'https:' && self.isHttpDNS) ? (self.apiUrl + msgBody.url.substr(msgBody.url.indexOf("/", 9))) : msgBody.url
                , secret: msgBody.secret
                , filename: msgBody.filename
                , thumb: msgBody.thumb
                , thumb_secret: msgBody.thumb_secret
                , file_length: msgBody.file_length || ''
                , width: rwidth
                , height: rheight
                , filetype: msgBody.filetype || ''
                , accessToken: conn.context.accessToken || ''
                // , ext: extmsg
                // , delay: parseMsgData.delayTimeStamp
            };
            !msg.delay && delete msg.delay;
            msg.error = "";
            msg.errorText = "";
            msg.errorCode = "";
            conn.onPictureMessage(msg);
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            break;
        case 5:
            break;
        case 6:
            break;
        default:
            break;
        }

        // msg.error = "";
        // msg.errorText = "";
        // msg.errorCode = "";
        // conn.onTextMessage(msg);
    }
}

export {handelMessage}