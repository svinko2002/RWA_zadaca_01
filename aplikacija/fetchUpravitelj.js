const SerijaPretrazivanje = require("./serijaPretrazivanje.js");
const Autentifikacija = require("./autentifikacija.js");
const RestSerije = require("../servis/restSerije.js");
const jwt = require("./moduli/jwt.js");

class FetchUpravitelj {
	constructor(tajniKljucJWT) {
		this.auth = new Autentifikacija();
		this.sp = new SerijaPretrazivanje();
		this.rs = new RestSerije()
		this.tajniKljucJWT = tajniKljucJWT;
	}

	getSESSION = async function (zahtjev, odgovor) {
		odgovor.type("json");
		if(zahtjev.session.korime == null){
			odgovor.status(401);
			odgovor.send({ opis: "potrebna prijava" });
			return;
		}
		console.log(zahtjev.session)
		let k = { korime: zahtjev.session.korime, uloga: zahtjev.session.uloga, id: zahtjev.session.korisnik_id };
		let noviToken = jwt.kreirajToken(k, this.tajniKljucJWT);
		let resurs = zahtjev.query.resurs;
		if(resurs == "korime"){
			odgovor.send({ korime: zahtjev.session.korime});
			return;
		}
		if(resurs == "uloga"){
			odgovor.send({ uloga: zahtjev.session.uloga});
			return;
		}
		if(resurs == "korisnik_id"){
			odgovor.send({ korisnik_id: zahtjev.session.korisnik_id});
			return;
		}
		odgovor.send({ ok: noviToken});
		return;
	};


	serijePretrazivanje = async function (zahtjev, odgovor) {
		let str = zahtjev.query.str;
		let filter = zahtjev.query.filter;
		odgovor.json(await this.sp.dohvatiSerije(str, filter));
	};

	dajDetaljeSerije = async function (zahtjev, odgovor) {
		let id = zahtjev.query.id;
		odgovor.json(await this.sp.dohvatiDetaljeSerije(id));
	};

	dajDetaljeFavoritSerije = async function (zahtjev, odgovor) {
		let serijaID = zahtjev.query.id;
		odgovor.json(await this.rs.getSezoneOdFavorita(serijaID));
	};

	//baza/favoriti
	dajFavorite = async function (zahtjev, odgovor) {
		console.log(zahtjev.session)
		if(zahtjev.session.korisnik_id != null){
			odgovor.status(200)
			odgovor.json(await this.rs.getFavoriti(zahtjev.session.korisnik_id));
		}
	};

	dodajSeriju = async function (zahtjev, odgovor) {
		if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
			odgovor.status(401);
			odgovor.json({ opis: "neaoutorizirani pristup" });
		} else {
			//odgovor.status(201)
			odgovor.json(await this.rs.postFavorit(zahtjev));
		}
	};

	putFavoriti = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		odgovor.status(501);
		let poruka = { opis: "metoda nije implementirana" };
		odgovor.send(JSON.stringify(poruka));
	};

	deleteFavoriti = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		odgovor.status(501);
		let poruka = { opis: "metoda nije implementirana" };
		odgovor.send(JSON.stringify(poruka));
	};


	//baza/favoriti/:id
	dajDetaljeFavoritSerijeID = async function (zahtjev, odgovor) {
		console.log(zahtjev.session)
		let serijaID = zahtjev.params.id;
		if(zahtjev.session.korisnik_id != null){
			let podaci = await this.rs.getSezoneOdFavorita(serijaID);
			if(podaci == null || podaci == "" || podaci == undefined){
				odgovor.status(417)
				odgovor.send({opis:"neočekivani podaci"})
			}else{
				odgovor.status(200)
				odgovor.send(podaci);
			}
		}
	};

	postFavoritID = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		odgovor.status(405);
		let poruka = { opis: "zabranjeno" };
		odgovor.send(JSON.stringify(poruka));
	};

	putFavoritID = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		odgovor.status(405);
		let poruka = { opis: "zabranjeno" };
		odgovor.send(JSON.stringify(poruka));
	};

	obrisiFavoritaOdKorisnika = async function (zahtjev, odgovor) {
		let serija_tmdb_id = zahtjev.params.id;
		let korisnik_id = zahtjev.session.korisnik_id
		console.log(serija_tmdb_id)
		console.log(zahtjev.session.korisnik_id)
		if(zahtjev.session.korisnik_id != null){
			odgovor.status(201)
			odgovor.json(await this.rs.obrisiFavoritaOdKorisnika(korisnik_id, serija_tmdb_id));
		}
	};

	getDNEVNIK = function (zahtjev, odgovor) {
		let metoda = zahtjev.method
		console.log(metoda)
		if(metoda == "GET" || metoda == "POST" || metoda == "PUT" || metoda == "DELETE"){
			odgovor.type("application/json");
			odgovor.status(501);
			let poruka = { opis: "metoda nije implementirana" };
			odgovor.send(JSON.stringify(poruka));
		}
	};
}

module.exports = FetchUpravitelj;
