const kodovi = require("./moduli/kodovi.js");
const mail = require("./moduli/mail.js");
const portRest = 12000;
// const portRest = 12490;

class Autentifikacija {
	async dodajKorisnika(korisnik) {
		let tijelo = {
			korime: korisnik.korime,
			pocetna_lozinka: korisnik.lozinka,
			lozinka: kodovi.kreirajSHA256(korisnik.lozinka, "Sebastijan Vinko"),
			email: korisnik.email,
			ime: korisnik.ime,
			prezime : korisnik.prezime,
			godina_rodjenja : korisnik.godina_rodjenja,
			drzava : korisnik.drzava,
			zupanija : korisnik.zupanija,
		};

		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "POST",
			body: JSON.stringify(tijelo),
			headers: zaglavlje,
		};

		let odgovor = await fetch(
			"http://localhost:" + portRest + "/baza/korisnici",
			parametri
		);

		// let odgovor = await fetch(
		// 	"http://spider.foi.hr:" + portRest + "/baza/korisnici",
		// 	parametri
		// );


		if (odgovor.status == 201) {
			console.log("Korisnik ubačen u bazu podataka");

			let mailPoruka =
				"Vaš račun je kreiran!\n\n" +
				"Vaše korisničko ime je " +
				korisnik.korime +
				", a lozinka je " +
				korisnik.lozinka;

			try{
				await mail.posaljiMail(
					"svinko21@foi.hr",
					korisnik.email,
					"Kreiran novi račun",
					mailPoruka
				)
			}catch{
				console.log("Nije moguće poslati email")
			}

			return true;
		} else if(odgovor.status == 417){
			console.log("Neispravni podaci");
			return false;
		}
	}

	async prijaviKorisnika(korime, lozinka) {
		let tijelo = {
			lozinka: lozinka
		};
		//console.log(lozinka);
		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "POST",
			body: JSON.stringify(tijelo),
			headers: zaglavlje,
		};

		let odgovor = await fetch(
			"http://localhost:" + portRest + "/baza/korisnici/" + korime + "/prijava",
			parametri
		);

		// let odgovor = await fetch(
		// 	"http://spider.foi.hr:" + portRest + "/baza/korisnici/" + korime + "/prijava",
		// 	parametri
		// );
		
		if (odgovor.status == 201) {
			return await odgovor.text();
		} else {
			return false;
		}
	}
}

module.exports = Autentifikacija;
