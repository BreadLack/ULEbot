/*

	ULEbot Informer Main Script

	AlbertoMGV & AlbertoFDR

*/

/* _____________________ Required imports ____________________ */

var twit = require('twit');
var config = require('./config.js');
var utils = require('./utils.js'); 
var fs = require('fs');
var Twitter = new twit(config);

/* ________________________ Variables ________________________ */

var dm = [];

/* _______________________ Functions _______________________ */

//tweet text
var tweet = function(text){
	Twitter.post('statuses/update',{status: text}, function(err, data, response) {
		if (err!=null) {
			logThis("Error: "+err.message);
		} else {
			logThis("Nuevo mensaje publicado!")
		}
	})
}

//Metodo para los logs
var logThis = function(text){
	var today = new Date();
	var lg = "["+today.getDate()+"/"+(today.getMonth()+1)+" "+(today.getHours()+1) + ":" + today.getMinutes()+"] * "+text;
	console.log(lg);
}

var checkNewDMs = function(){
	var params = {
		count : 50,
	}
	var lastID = fs.readFileSync('./lastid.txt',{encoding:'utf8', flag:'r'});
	Twitter.get('direct_messages/events/list', params ,  function (err, data, response) {
		if (err) {
			console.log(err);
		} else {
			fs.writeFileSync('./lastid.txt', data.events[0].id);
			for (var i = 0; i <= data.events.length - 1; i++) {
				if (data.events[i].id != lastID) {
					tweet(data.events[i].message_create.message_data.text);
				} else {
					break;
				}
			}
		}
	})
}

/* ________________________ Main Program ________________________ */

logThis("Que empieze el show...");
console.log("");
setInterval(checkNewDMs, 120000);