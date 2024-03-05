const Baza = require("./baza.js");

class SerijaDAO {

	constructor() {
		this.baza = new Baza("RWA2023svinko21.sqlite");
	}

	otvoriBazuPodataka = async function(){
		await this.baza.spojiSeNaBazu();
	}

	zatvoriBazuPodataka = async function(){
		await this.baza.zatvoriVezu();
	}

	dajSve = async function () {
		let sql = "SELECT * FROM serija;"
		var podaci = await this.baza.izvrsiUpit(sql, []);
		return podaci;
	}

	dajSveTMDB_ID = async function (){
		let sql = "SELECT tmdb_id FROM serija;"
		var podaci = await this.baza.izvrsiUpit(sql, []);
		if(podaci.length >= 1) return podaci
		else return null;
	}

	dajSveSezona_ID = async function () {
		let sql = "SELECT sezona_id FROM sezona_serije;"
		var podaci = await this.baza.izvrsiUpit(sql, []);
		if(podaci.length >= 1) return podaci
		else return null;
	}

	dodaj = async function (s) {
		let sql = `INSERT INTO serija
					('tmdb_id', 'naziv', 'opis',
					'broj_sezona', 'broj_epizoda',
					'popularnost','slika','stranica',
					'ocjena_serije','broj_glasova')
					VALUES (?,?,?,?,?,?,?,?,?,?)`;

		let podaci = [
			s.id,
			s.name ?? "nema naziv",
			s.overview ?? "nema opis",
			s.number_of_seasons ?? "nema broj sezona",
			s.number_of_episodes ?? "nema broj epizoda",
			s.popularity ?? "nema popularnost",
			s.poster_path ?? "nema sliku",
			s.homepage ?? "nema putanju do svoje stranice",
			s.vote_average ?? "nema ocjenu",
			s.vote_count ?? "nema broj glasova"
		];

		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}

	dodajSezonu = async function (s, serija_tmdb_id) {
		let sql = `INSERT INTO sezona_serije
					('sezona_id', 'naziv', 'opis',
					'slika', 'broj_sezone',
					'broj_epizoda_u_sezoni',
					'ocjena_sezone','serija_tmdb_id')
					VALUES (?,?,?,?,?,?,?,?)`;

		let podaci = [
			s.id,
			s.name ?? "nema naziva",
			s.overview ?? "nema opisa",
			s.poster_path ?? "nema slike",
			s.season_number ?? "nema broj sezone",
			s.episode_count ?? "nema broj epizoda",
			s.vote_average ?? "nema ocjenu",
			serija_tmdb_id,
		];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}
}

module.exports = SerijaDAO;
