/*

	ULEbot Informer Funcs Script

	AlbertoMGV & AlbertoFDR

*/

/* _____________________ Required imports ____________________ */

var twit = require('twit');
var config = require('./config.js');
var utils = require('./utils.js'); 
var fs = require('fs');
var Twitter = new twit(config);

/* ________________________ Funciones ________________________ */



//random de un array (pasas array devuelve elemento ran del array)
var rnd = function random (arr) {
	var index = Math.floor(Math.random()*arr.length);
	return arr[index];
};

//get lista de ids de los followers
var getIds = function(){
	var params1 = {
		screen_name: 'ULEbot',
	}
	Twitter.get('followers/ids', params1 ,  function (err, data1, response) {
		var ids1 = data1.ids;
		for (var i = 0; i < ids1.length; i++) { 
			Twitter.get('users/show', { user_id: ids1[i] } ,  function (err, data, response) {
				logThis(data.screen_name);
			})
		}	
	})
}

//comprueba si es una hora concreta
var check = function(){
	var today = new Date();
	var time = today.getHours()+1 + ":" + today.getMinutes();
	if (time=="10:30"||time=="12:30"||time=="14:30"||time=="16:30"||time=="19:30"||time=="22:30") {
		if (ultimaH!=time) {
			logThis("Es la hora man ["+time+"]");
			ultimaH = time;
		}
	}
}

// Bloqueo a la peñita
var block = function(aquien){
	var params1 = {
		user_id: aquien,
	}
	Twitter.post('blocks/create', params1 ,  function (err, data1, response) {
		if (err) {
			logThis("Algo salio mal..." + err)
		} {
			logThis("User Blocked: "+data1.user_id)
		}
	})
}

//hola holita de nuevo
var unBlock = function(aquien){
	var params1 = {
		user_id: aquien,
	}
	Twitter.post('blocks/destroy', params1 ,  function (err, data1, response) {
		if (err) {
			logThis("Algo salio mal..." + err)
		} {
			logThis("User un-Blocked: "+data1.user_id)
		}
	})
}

//eMetodo para los logs
var logThis = function(text){
	var today = new Date();
	var lg = "["+today.getDate()+"/"+(today.getMonth()+1)+" "+(today.getHours()+1) + ":" + today.getMinutes()+"] * "+text;
	console.log(lg);
}

module.exports = { rnd, getIds, check, block, unBlock };