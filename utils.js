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


/**
 * @desc Método para obtener los seguidores de una cuenta, en este caso nuestro bot. 
*/
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

/**
 * @desc Método para bloquear a un usuario. 
 * @param String $aquien - ID de la persona a bloquear
*/
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

/**
 * @desc Método para desbloquear a un usuario. 
 * @param String $aquien - ID de la persona a desbloquear
*/
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

/**
 * @desc Método para loguear información de una forma más descriptiva. 
 * @param String $text - Texto a loguear.
*/
var logThis = function(text){
	var today = new Date();
	var lg = "["+today.getDate()+"/"+(today.getMonth()+1)+" "+(today.getHours()+1) + ":" + today.getMinutes()+"] * "+text;
	console.log(lg);
}

module.exports = { rnd, getIds, check, block, unBlock };
