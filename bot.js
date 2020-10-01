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

/**
 * @desc Método para publicar el tweet con un texto recibido.
 * @param string $text - Recibe un string el cual será el tweet a publicar.
*/
var tweet = function(text){
	Twitter.post('statuses/update',{status: text}, function(err, data, response) {
		if (err!=null) {
			logThis("Error: "+err.message);
		} else {
			logThis("Nuevo mensaje publicado!")
		}
	})
}
/**
 * @desc Método para que los logs incluyan parámetros de tiempo por defecto.
 * @param String $text - El mensaje que queremos loguear. 
*/
var logThis = function(text){
	var today = new Date();
	var lg = "["+today.getDate()+"/"+(today.getMonth()+1)+" "+(today.getHours()+1) + ":" + today.getMinutes()+"] * "+text;
	console.log(lg);
}

/**
 * @desc Método que comprueba haber si hay DMs nuevos gracias al ID y en caso de haberlos
 * los publica. Se hace uso de un txt para que en caso de que dejé de funcionar en algún
 * momento, se pueda levantar de forma más sencilla sin perder el último publicado.
 * 
*/
var checkNewDMs = function(){
	var params = {
		count : 50,
	}
    //Leemos el ID del último DM publicado.
    var lastID = fs.readFileSync('./lastid.txt',{encoding:'utf8', flag:'r'});
	Twitter.get('direct_messages/events/list', params ,  function (err, data, response) {
		if (err) {
			console.log(err);
		} else {
            //Escribimos el ID del último que nos devuelve la API de Twitter y publicamos los que no estén ya publicados
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

//Log inicial
logThis("Que empieze el show...");
console.log("");

// Cada 2 minutos checkea si han llegado nuevos correos y los publica en ese caso. 
setInterval(checkNewDMs, 120000);
