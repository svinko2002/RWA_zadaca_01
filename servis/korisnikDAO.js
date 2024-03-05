const Baza = require("./baza.js");

class KorisnikDAO {

	constructor() {
		this.baza = new Baza("RWA2023svinko21.sqlite");
	}

	daj = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik WHERE korime=?;"
		var podaci = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else
			return null;
	}

	dajSve = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik;"
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	}

	provjeriEmail = async function (email) {
		this.baza.spojiSeNaBazu();
		let sql = `SELECT * FROM korisnik WHERE email="${email}";`
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0]
		else
			return null;
	}

	provjeriKorime = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = `SELECT * FROM korisnik WHERE korime="${korime}";`
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0]
		else
			return null;
	}

	dodaj = async function (k) {
		this.baza.spojiSeNaBazu();
		console.log(k)
		let sql = `INSERT INTO korisnik
					('tipovi_korisnika_id', 'korime', 'lozinka',
					'email', 'ime', 'prezime','godina_rodjenja',
					'drzava','zupanija')
					VALUES (?,?,?,?,?,?,?,?,?)`;

		let podaci = [1, k.korime, k.lozinka,
						k.email, k.ime, k.prezime,
						k.godina_rodjenja, k.drzava, k.zupanija];

		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu();
		return true;
	}

	azuriraj = async function (korime, korisnik) {
		this.baza.spojiSeNaBazu();
		let sql = `UPDATE korisnik SET
					ime=?, prezime=?, lozinka=?,
					email=?, godina_rodjenja=?, drzava=?,
					zupanija=? WHERE korime=?`;

        let podaci = [korisnik.ime,korisnik.prezime,
                      korisnik.lozinka,korisnik.email,
					  korisnik.godina_rodjenja, korisnik.drzava, korisnik.zupanija,
					  korime];
		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu();
		return true;
	}

	obrisi = async function (korime) {
		let korisnik = await this.daj(korime)
		this.baza.spojiSeNaBazu();
		if(!korisnik){
			return true;
		}
		if(korisnik.tipovi_korisnika_id != 2){
			let sql = "DELETE FROM korisnik WHERE korime=?";
			await this.baza.izvrsiUpit(sql,[korime]);
			this.baza.zatvoriVezu();
			return true;
		}else{
			this.baza.zatvoriVezu();
			return false;
		}
	}
}

module.exports = KorisnikDAO;
