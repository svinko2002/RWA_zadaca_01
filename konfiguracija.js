const ds = require("fs/promises");

class Konfiguracija {
	constructor() {
		this.konf = {};
	}

	dajKonf() {
		return this.konf;
	}

	async ucitajKonfiguraciju() {
		console.log(this.konf);
		let podaci = await ds.readFile(process.argv[2], "UTF-8");
        var podatakNiz = podaci.split(":");
        let previseDvotocaka = false
        if(podatakNiz[8] !== undefined){
            previseDvotocaka = true
        }
        this.konf = pretvoriJSONkonfig(podaci);
        if(previseDvotocaka){
            console.log("Vrijednost ne može imati znak dvotočka")
            throw "Nisu valjani podaci u konfiguracijskoj datoteci"
        }
        if(provjeriParametre(this.konf)){
            throw "Nisu valjani podaci u konfiguracijskoj datoteci"
        }else{
            console.log(this.konf)
        }
	}
}

function provjeriParametre(konf){
    var podaci = JSON.stringify(konf)

    if(Object.keys(konf).length < 6 || Object.keys(konf).length > 6){
        console.log("U konfiguraciji nema 6 redova")
        return true
    }

    if(!podaci.includes("\"jwtValjanost\"")){
        console.log("U konfiguraciji ne postoji jwtValjanost")
        return true
    }

    if(konf.jwtValjanost < 15 || konf.jwtValjanost > 3600){
        console.log("jwtValjanost nema broj između 15 i 3600")
        return true
    }

    if(!podaci.includes("\"jwtTajniKljuc\"")){
        console.log("U konfiguraciji ne postoji jwtTajniKljuc")
        return true
    }

    if(konf.jwtTajniKljuc.length < 50 || konf.jwtTajniKljuc.length > 100){
        console.log("jwtTajniKljuc nema broj između 50 i 100")
        return true
    }

    if(!podaci.includes("\"tajniKljucSesija\"")){
        console.log("U konfiguraciji ne postoji tajniKljucSesija")
        return true
    }

    if(konf.tajniKljucSesija.length < 50 || konf.tajniKljucSesija.length > 100){
        console.log("tajniKljucSesija nema broj između 50 i 100")
        return true
    }

    if(!podaci.includes("\"appStranicenje\"")){
        console.log("U konfiguraciji ne postoji appStranicenje")
        return true
    }

    if(konf.appStranicenje < 5 || konf.appStranicenje > 100){
        console.log("appStranicenje nema broj između 5 i 100")
        return true
    }

    if(!podaci.includes("\"tmdbApiKeyV3\"")){
        console.log("U konfiguraciji ne postoji tmdbApiKeyV3")
        return true
    }

    if(!podaci.includes("\"tmdbApiKeyV4\"")){
        console.log("U konfiguraciji ne postoji tmdbApiKeyV4")
        return true
    }
}

function pretvoriJSONkonfig(podaci) {
	console.log(podaci);
	let konf = {};
	var nizPodataka = podaci.split("\n");
    for (let podatak of nizPodataka) {
        var podatakNiz = podatak.split(":");
        var naziv = podatakNiz[0];
        var vrijednost = podatakNiz[1];
        konf[naziv] = vrijednost;
    }
    return konf;
}

module.exports = Konfiguracija;
