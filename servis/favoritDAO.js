const Baza = require("./baza.js");

class FavoritDao {

	constructor() {
		this.baza = new Baza("RWA2023svinko21.sqlite");
	}

	dajSveserija_tmdb_id = async function (korisnik_id) {
		await this.baza.spojiSeNaBazu();
		let sql = `SELECT serija_tmdb_id FROM favoriti WHERE korisnik_id == ${korisnik_id};`
		var podaci = await this.baza.izvrsiUpit(sql, []);
		await this.baza.zatvoriVezu();
		return podaci;
	}

	dajSveFavoriteOdID_korisnika = async function (korisnik_id) {
		await this.baza.spojiSeNaBazu();
		let sql = `SELECT * FROM favoriti as f, serija as s WHERE f.korisnik_id == ${korisnik_id} AND f.serija_tmdb_id == s.tmdb_id`
		var podaci = await this.baza.izvrsiUpit(sql, []);
		await this.baza.zatvoriVezu();
		return podaci;
	}

	dajSveSezoneSerije = async function (serija_tmdb_id) {
		await this.baza.spojiSeNaBazu();
		let sql = `SELECT * FROM sezona_serije WHERE serija_tmdb_id == ${serija_tmdb_id}`
		var podaci = await this.baza.izvrsiUpit(sql, []);
		await this.baza.zatvoriVezu();
		return podaci;
	}

	dodaj = async function (korisnik_id, serija_tmdb_id) {
		await this.baza.spojiSeNaBazu();
		let sql = `INSERT INTO favoriti ('korisnik_id', 'serija_tmdb_id') VALUES (?,?)`;

		let podaci =[
			korisnik_id,
			serija_tmdb_id,
		];

		await this.baza.izvrsiUpit(sql,podaci);
		await this.baza.zatvoriVezu();
		return true;
	}

	obrisiFavoriteOd = async function (korisnik_id, serija_tmdb_id) {
		await this.baza.spojiSeNaBazu();
		let sql = `DELETE FROM favoriti WHERE korisnik_id=${korisnik_id} AND serija_tmdb_id=${serija_tmdb_id}`
		var podaci = await this.baza.izvrsiUpit(sql, []);
		await this.baza.zatvoriVezu();
		return podaci;
	}

	obrisiSveFavoriteOd = async function (korisnik_id) {
		await this.baza.spojiSeNaBazu();
		let sql = `DELETE FROM favoriti WHERE korisnik_id=${korisnik_id}`
		var podaci = await this.baza.izvrsiUpit(sql, []);
		await this.baza.zatvoriVezu();
		return podaci;
	}
}

module.exports = FavoritDao;
