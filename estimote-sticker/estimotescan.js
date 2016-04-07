var EstimoteSticker = require('./estimote-sticker.js');
var mqtt = require('mqtt');
var moment = require('moment');
var Struct = require('struct');
var fs = require('fs');
var uuid = 0;

// check for file input else exit process
if (process.argv.length < 3) {
	console.log(process.argv[1]);
	process.exit(1);
} // end if 

configFile =  process.argv[2];

try {
	var configuration = JSON.parse(fs.readFileSync(configFile));
} // end try
catch (err) {
	if (err.code !== 'ENOENT') {
		console.log(err);
	} // end if 
	else {
		console.log("ERROR: File does not exist");
	} // end else
} // end catch

// ############
// ConfigFile PARAM
var nodeId = configuration["generic.node-id"];
var configVer = configuration.configVer;
var modalityMap = configuration.modalityMap;

// ###############
// MQTT PARAMS
var topic = configuration["mqtt.local.pubTopic"]+nodeId;
var broker = configuration["mqtt.local.host"];
var port = configuration["mqtt.local.port"];
var qos = configuration["mqtt.local.options.qos"];
var clientId = configuration["mqtt.local.options.clientId"];
var KeepAlive = configuration["mqtt.local.options.KeepAlive"];
var timeOut = configuration["mqtt.local.options.timeOut"];

// ##########
// TEST

console.log("LoadedData");
console.log(configVer);
console.log(modalityMap);
console.log(topic);
console.log(broker);
console.log(port);
console.log(qos);
console.log(clientId);
console.log(KeepAlive);
console.log(timeOut);

//Array for passing in Options
var clientOptions = {timeOut:timeOut,keepAlive:KeepAlive,clean:false,clientId:clientId,protocolId:'MQIsdp',protocolVersion:3};

//Publish Option
var publishOption = {qos:qos};

//returns a sticker oject on discover in json
EstimoteSticker.on('discover', function(estimoteSticker) {
	var estimoteData;
	relevantdata(estimoteSticker,function(data) {	
	estimoteData = data;
});
	publish(estimoteData);
});

// starts scanning for stickers
EstimoteSticker.startScanning();

// Parse data and returns in callback
function relevantdata(estimoteSticker, callback) {
	console.log(estimoteSticker);
	var currentTime = moment().unix();
	// var header = {'timestamp':currentTime,'configVer': configVer,'modalityMap': modalityMap};
	// var relevantJson ={'sensor_id':estimoteSticker.uuid,'battery_level':estimoteSticker.batteryLevel,'power':estimoteSticker.power,'acceleration': estimoteSticker.acceleration,'acc_x':estimoteSticker.acceleration['x']};
	var relevantJson ={'uuid':estimoteSticker.uuid,'battery_level':estimoteSticker.batteryLevel,'power':estimoteSticker.power,'acc_x':estimoteSticker.acceleration['x'], 'acc_y':estimoteSticker.acceleration['y'], 'acc_z':estimoteSticker.acceleration['z']};
	uuid = estimoteSticker.uuid;
	// var payloadlength = relevantJson.length;
	// header['payloadLen'] = payloadlength;
	callback(relevantJson);
} // end relevantdata

// Publish and forget

function publish(sticker) {
	var client  = mqtt.connect(broker,clientOptions);
	// console.log(topicid)
	// send buffered data across
	topic = configuration["mqtt.local.pubTopic"]+uuid;
	client.publish(topic,JSON.stringify(sticker),publishOption,function(err,client) {
		if (err===null) {
			console.log("Publish Successful")
		} // end if 
		else {
			console.log("Publish Gone Wrong")
		} // end else
		console.log(client);
	});
	client.end(false,function(message) {
		console.log("client close");
	});
} // end publish
