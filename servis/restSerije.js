const SerijaDAO = require("./serijaDAO.js");
const FavoritDAO = require("./favoritDAO.js");
const kodovi = require("../aplikacija/moduli/kodovi.js");

class RestSerije {
	getFavoriti = async function(korisnik_id){
		console.log(korisnik_id)
		let fdao = new FavoritDAO();
		let favoriti = await fdao.dajSveFavoriteOdID_korisnika(korisnik_id).then((favoriti) => favoriti);
		return favoriti;
	}

	getSezoneOdFavorita = async function(serija_tmdb_id){
		console.log(serija_tmdb_id)
		let fdao = new FavoritDAO();
		let sezone = await fdao.dajSveSezoneSerije(serija_tmdb_id).then((sezone) => sezone);
		return sezone;
	}

	obrisiFavoritaOdKorisnika = async function(korisnik_id, serija_tmdb_id){
		console.log(korisnik_id)
		console.log(serija_tmdb_id)
		let fdao = new FavoritDAO();
		await fdao.obrisiFavoriteOd(korisnik_id, serija_tmdb_id).then((sezone) => sezone);
	}

	postFavorit = async function (zahtjev) {
		console.log(zahtjev.session)
		let podaci = zahtjev.body.serija;
		let sdao = new SerijaDAO();
		let fdao = new FavoritDAO();
		sdao.otvoriBazuPodataka();
		let dodaj = 1;
		//DODAVANJE SERIJE U BAZU
		await sdao.dajSveTMDB_ID().then((serije) => {
			for(let s of serije){
				if(podaci.id == s.tmdb_id){
					dodaj = 0;
					return;
				}
			}
		});
		if(dodaj == 1){
			sdao.dodaj(podaci).then((poruka) => {
				//odgovor.send(JSON.stringify(poruka));
			});
		}
		sdao.zatvoriBazuPodataka();

		//DODAVANJE SERIJA U FAVORITE
		dodaj = 1;
		let serije = await fdao.dajSveserija_tmdb_id(zahtjev.session.korisnik_id).then((serije) => serije)
		for(let s of serije){
			if(podaci.id == s.serija_tmdb_id){
				dodaj = 0;
				return;
			}
		}
		if(dodaj == 1){
			fdao.dodaj(zahtjev.session.korisnik_id, podaci.id).then((poruka) => {
				//odgovor.send(JSON.stringify(poruka));
			});
		}

		sdao.otvoriBazuPodataka();

		//DODAVANJE SEZONA SERIJA U BAZU
		for(let sezona of zahtjev.body.serija.seasons){
			dodaj = 1;
			let serije = await sdao.dajSveSezona_ID().then((serije) => serije);
			for(let s of serije){
				if(sezona.id == s.sezona_id){
					dodaj = 0;
					return;
				}
			}
			if(dodaj == 1){
				await sdao.dodajSezonu(sezona, zahtjev.body.serija.id)
			}
		}
		sdao.zatvoriBazuPodataka();
	};
}

module.exports = RestSerije
