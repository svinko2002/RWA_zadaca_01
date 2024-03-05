const crypto = require('crypto');

exports.kreirajSHA256 = function(tekst){
	const hash = crypto.createHash('sha256');
	hash.write(tekst);
	var izlaz = hash.digest('hex');
	hash.end();
	return izlaz;
}

exports.kreirajSHA256 = function(tekst,sol){
	const hash = crypto.createHash('sha256');
	hash.write(tekst+sol);
	var izlaz = hash.digest('hex');
	hash.end();
	return izlaz;
}
