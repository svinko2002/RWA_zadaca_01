const Autentifikacija = require("./autentifikacija.js");
const jwt = require("./moduli/jwt.js");
const ds = require("fs/promises");

class HtmlUpravitelj {
	constructor(tajniKljucJWT) {
		this.tajniKljucJWT = tajniKljucJWT;
		this.auth = new Autentifikacija();
	}

	pocetna = async function (zahtjev, odgovor) {
		let pocetna = await ucitajStranicu("pocetna");
		odgovor.send(pocetna);
	};

	dokumentacija = async function (zahtjev, odgovor) {
		let dokumentacija = await ucitajStranicu("dokumentacija");
		odgovor.send(dokumentacija);
	};

	profil = async function (zahtjev, odgovor) {
		let profil = await ucitajStranicu("profil");
		odgovor.send(profil);
	};

	favoriti = async function (zahtjev, odgovor) {
		let favoriti = await ucitajStranicu("favoriti");
		odgovor.send(favoriti);
	};

	korisnici = async function (zahtjev, odgovor) {
		let korisnici = await ucitajStranicu("korisnici");
		odgovor.send(korisnici);
	};

	serijePretrazivanje = async function (zahtjev, odgovor) {
		let stranica = await ucitajStranicu("pocetna");
		odgovor.send(stranica);
	};

	detaljiSerije = async function (zahtjev, odgovor) {
		let detaljiSerije = await ucitajStranicu("detaljiSerije");
		odgovor.send(detaljiSerije);
	};

	detaljiFavoritSerije = async function (zahtjev, odgovor) {
		let detaljiFavoritSerije = await ucitajStranicu("favoritDetalji");
		odgovor.send(detaljiFavoritSerije);
	};

	prijava = async function (zahtjev, odgovor) {
		let opis = "";
		if (zahtjev.method == "POST") {
			var korime = zahtjev.body.korime;
			var lozinka = zahtjev.body.lozinka;
			var korisnik = await this.auth.prijaviKorisnika(korime, lozinka);
			if (korisnik) {
				console.log(korisnik)
				zahtjev.session.jwt = jwt.kreirajToken(korisnik, this.tajniKljucJWT);
				korisnik = JSON.parse(korisnik);
				zahtjev.session.korisnik = korisnik.ime + " " + korisnik.prezime;
				zahtjev.session.korime = korime;
				zahtjev.session.korisnik_id = korisnik.id;
				zahtjev.session.uloga = korisnik.tipovi_korisnika_id;
				console.log("korisnik id = "+ korisnik.id)
				console.log(zahtjev.session);
				odgovor.redirect("/");
				return;
			} else {
				opis = "Netocni podaci!";
			}
		}

		let stranica = await ucitajStranicu("prijava", opis);
		odgovor.send(stranica);
	};

	registracija = async function (zahtjev, odgovor) {
		console.log(zahtjev.body);
		let opis = "";
		if (zahtjev.method == "POST") {
			let uspjeh = await this.auth.dodajKorisnika(zahtjev.body);
			if (uspjeh) {
				odgovor.redirect("/prijava");
				return;
			} else {
				opis = "Dodavanje nije uspjelo provjerite podatke!";
			}
		}
		let stranica = await ucitajStranicu("registracija", opis);
		odgovor.send(stranica);
	};

	odjava = async function (zahtjev, odgovor) {
		zahtjev.session.korime = null;
		zahtjev.session.jwt = null;
		zahtjev.session.korisnik = null;
		zahtjev.session.uloga = null;
		zahtjev.session.korisnik_id = null;
		odgovor.redirect("/");
	};
}

module.exports = HtmlUpravitelj;

async function ucitajStranicu(nazivStranice, poruka = "") {
	let stranice
	if(nazivStranice != "dokumentacija"){
		stranice = [ucitajHTML(nazivStranice), ucitajHTML("navigacija")];
	}else{
		stranice = [ucitajHTMLDokumentacija(nazivStranice), ucitajHTML("navigacija")];
	}

	let [stranica, nav] = await Promise.all(stranice);
	stranica = stranica.replace("#navigacija#", nav);
	stranica = stranica.replace("#poruka#", poruka);
	return stranica;
}

function ucitajHTML(htmlStranica) {
	return ds.readFile(__dirname + "/html/" + htmlStranica + ".html", "UTF-8");
}

function ucitajHTMLDokumentacija() {
	return ds.readFile(__dirname + "/../dokumentacija/dokumentacija.html", "UTF-8");
}