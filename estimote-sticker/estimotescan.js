var EstimoteSticker = require('./estimote-sticker.js');
var mqtt = require('mqtt');
var moment = require('moment');

//params
var topic = "a";
var qos = 1;
//var broker = "mqtt://be.shineseniors.org" ;
var broker = "mqtt://127.0.0.1" ;
var clientId = "ioat";
var KeepAlive = 60;
var timeOut = 30;

//Array for passing in Options
var clientOptions = {timeOut:timeOut,keepAlive:KeepAlive,clean:false,clientId:clientId,protocolId:'MQIsdp',protocolVersion:3};

//Publish Option
var publishOption = {qos:qos};

//returns a sticker oject on discover in json
EstimoteSticker.on('discover', function(estimoteSticker) {
  
	var test;
	relevantdata(estimoteSticker,function(data){
	
	test = data;


});
	
	publish(test);
	
});

// starts Scanning for stickers
EstimoteSticker.startScanning();

//Parse data and returns in callback
function relevantdata(estimoteSticker, callback){

var relevantJson ={'id':estimoteSticker.id,'temperature':estimoteSticker.temperature,'moving':estimoteSticker.moving,'acceleration': estimoteSticker.acceleration,'timestamp': moment().format()};

callback(relevantJson);

}

//Publish and forget

function publish(sticker){

var id = sticker.id;
var temperature = sticker.temperature.toString();
var moving = sticker.moving;
var acceleration = JSON.stringify(sticker.acceleration);
var timestamp = sticker.timestamp.toString();


var client  = mqtt.connect(broker,clientOptions);


topicid = "bbb/sensor/sticker/nearable/"+id+"/id/";
topictemperature = "bbb/sensor/sticker/nearable/"+id+"/temperature/"
topicmoving = "bbb/sensor/sticker/nearable/"+id+"/moving/"
topicacceleration = "bbb/sensor/sticker/nearable/"+id+"/acceleration/"
topictimestamp = "bbb/sensor/sticker/nearable/"+id+"/timestamp/"

console.log(topicid)
console.log(topictemperature)
console.log(topicmoving)
console.log(topicacceleration)
console.log(topictimestamp)


client.publish(topicid,id,publishOption,function(err,client){

if(err===null){
	console.log("Publish Successfull")
}else{
	console.log("Publish Gone Wrong")
}
console.log(client);

});

//temperature
client.publish(topictemperature,temperature,publishOption,function(err,client){

if(err===null){
	console.log("Publish Successfull")
}else{
	console.log("Publish Gone Wrong")
}
console.log(client);

});
//moving
client.publish(topicmoving,moving,publishOption,function(err,client){

if(err===null){
	console.log("Publish Successfull")
}else{
	console.log("Publish Gone Wrong")
}
console.log(client);

});
//acceleration
client.publish(topicacceleration,acceleration,publishOption,function(err,client){

if(err===null){
	console.log("Publish Successfull")
}else{
	console.log("Publish Gone Wrong")
}
console.log(client);

});
//timestamp
client.publish(topictimestamp,timestamp,publishOption,function(err,client){

if(err===null){
	console.log("Publish Successfull")
}else{
	console.log("Publish Gone Wrong")
}
console.log(client);

});
client.end(false,function(message){
	console.log("client close");
});

}





