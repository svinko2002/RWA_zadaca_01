import express, { json } from 'express';
import sesija from "express-session";
import kolacici from "cookie-parser";
import Konfiguracija from "./konfiguracija.js";
import restKorisnik from "./servis/restKorisnik.js";
import RestTMDB from "./servis/restTMDB.js";
import FetchUpravitelj from "./aplikacija/fetchUpravitelj.js"
import HtmlUpravitelj from "./aplikacija/htmlUpravitelj.js";

const port = 12000;

const server = express();
let konf = new Konfiguracija();
konf
    .ucitajKonfiguraciju()
    .then(pokreniServer)
    .catch((opis)=>{
        console.log(opis);
        if(process.argv.length == 2){
            console.error("Niste naveli naziv konfiguracijske datoteke!");
        }else{
            console.error("Datoteka ne postoji: " + opis.path);
        }
    });

function pokreniServer(){
    server.use(express.urlencoded({ extended: true }));
	server.use(express.json());

    pripremiPutanjeKorisnik()
	pripremiPutanjeDnevnika()
    pripremiPutanjePocetna()
    pripremiPutanjeAutentifikacija()
	pripremiPutanjeTMDB()
	pripremiPutanjePretrazivanjeSerija()

    server.use((zahtjev, odgovor) => {;
        odgovor.type('json');
		odgovor.status(404)
		odgovor.send({opis:"nema resursa"})
    });

    server.listen(port, () => {
        console.log(`Server pokrenut na portu: ${port}`);
    });
}

function pripremiPutanjePocetna() {
	let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
	server.get("/", htmlUpravitelj.pocetna.bind(htmlUpravitelj));

	server.get("/dokumentacija", htmlUpravitelj.dokumentacija.bind(htmlUpravitelj));
	server.get("/korisnici", htmlUpravitelj.korisnici.bind(htmlUpravitelj));

	server.use("/js", express.static("./aplikacija/js"));
	server.use("/slike", express.static("./slike"));
	server.use("/dokumentacija", express.static("./dokumentacija"));

	server.use(kolacici());
	server.use(
		sesija({
			secret: konf.dajKonf().tajniKljucSesija,
			saveUninitialized: true,
			cookie: { maxAge: 1000 * 60 * 60 * 3 },
			resave: false,
		})
	);
}

function pripremiPutanjeKorisnik() {
	let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
	let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf().jwtTajniKljuc);

	server.get("/baza/korisnici",  restKorisnik.getKorisnici);
	server.post("/baza/korisnici", restKorisnik.postKorisnici);
	server.delete("/baza/korisnici", restKorisnik.deleteKorisnici);
	server.put("/baza/korisnici", restKorisnik.putKorisnici);

	server.get("/baza/korisnici/:korime", restKorisnik.getKorisnik);
	server.post("/baza/korisnici/:korime", restKorisnik.postKorisnik);
	server.put("/baza/korisnici/:korime", restKorisnik.putKorisnik);
	server.delete("/baza/korisnici/:korime", restKorisnik.deleteKorisnik);

	server.get("/baza/korisnici/:korime/prijava", restKorisnik.getKorisnikPrijava);
	server.post("/baza/korisnici/:korime/prijava", restKorisnik.getKorisnikPrijava);
	server.put("/baza/korisnici/:korime/prijava", (zahjtev, odgovor) =>{
		odgovor.type('json');
		odgovor.status(501)
		odgovor.send({"opis":"metoda nije implementirana"})
	});
	server.delete("/baza/korisnici/:korime/prijava", (zahjtev, odgovor) =>{
		odgovor.type('json');
		odgovor.status(501)
		odgovor.send({"opis":"metoda nije implementirana"})
	});
}

function pripremiPutanjePretrazivanjeSerija() {
	let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
	let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf().jwtTajniKljuc);

	server.get(
		"/serijePretrazivanje",
		htmlUpravitelj.serijePretrazivanje.bind(htmlUpravitelj)
	);
	server.post(
		"/serijePretrazivanje",
		fetchUpravitelj.serijePretrazivanje.bind(fetchUpravitelj)
	);

	server.get("/prikaziDetaljeSerije", htmlUpravitelj.detaljiSerije.bind(htmlUpravitelj));
	server.post("/dajDetaljeSerije", fetchUpravitelj.dajDetaljeSerije.bind(fetchUpravitelj));

	server.get("/prikaziDetaljeFavoritSerije", htmlUpravitelj.detaljiFavoritSerije.bind(htmlUpravitelj));
	server.post("/dajDetaljeFavoritSerije", fetchUpravitelj.dajDetaljeFavoritSerije.bind(fetchUpravitelj));

	server.get("/baza/favoriti", fetchUpravitelj.dajFavorite.bind(fetchUpravitelj));
	server.post("/baza/favoriti", fetchUpravitelj.dodajSeriju.bind(fetchUpravitelj));
	server.put("/baza/favoriti", fetchUpravitelj.putFavoriti.bind(fetchUpravitelj));
	server.delete("/baza/favoriti", fetchUpravitelj.deleteFavoriti.bind(fetchUpravitelj));

	server.get("/baza/favoriti/:id", fetchUpravitelj.dajDetaljeFavoritSerijeID.bind(fetchUpravitelj));
	server.post("/baza/favoriti/:id", (zahjtev, odgovor) =>{
		odgovor.type('json');
		odgovor.status(405)
		odgovor.send({opis:"zabranjeno"})
	});
	server.put("/baza/favoriti/:id", (zahjtev, odgovor) =>{
		odgovor.type('json');
		odgovor.status(405)
		odgovor.send({opis:"zabranjeno"})
	});
	server.delete("/baza/favoriti/:id", fetchUpravitelj.obrisiFavoritaOdKorisnika.bind(fetchUpravitelj));
}

function pripremiPutanjeAutentifikacija() {
	let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
	let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf().jwtTajniKljuc);
	server.get("/odjava", htmlUpravitelj.odjava.bind(htmlUpravitelj));

	server.get("/prijava", htmlUpravitelj.prijava.bind(htmlUpravitelj));
	server.post("/prijava", htmlUpravitelj.prijava.bind(htmlUpravitelj));

	server.get("/registracija", htmlUpravitelj.registracija.bind(htmlUpravitelj));
	server.post("/registracija", htmlUpravitelj.registracija.bind(htmlUpravitelj));

	server.get("/profil", htmlUpravitelj.profil.bind(htmlUpravitelj));
	server.get("/favoriti", htmlUpravitelj.favoriti.bind(htmlUpravitelj));

	server.get("/getSESSION", fetchUpravitelj.getSESSION.bind(fetchUpravitelj));
}

function pripremiPutanjeDnevnika(){
	server.get("/baza/dnevnik", (zahjtev, odgovor) =>{
		odgovor.type('json');
		odgovor.status(501)
		odgovor.send({opis:"metoda nije implementirana"})
	});

	server.post("/baza/dnevnik", (zahjtev, odgovor) =>{
		odgovor.type('json');
		odgovor.status(501)
		odgovor.send({opis:"metoda nije implementirana"})
	});

	server.put("/baza/dnevnik", (zahjtev, odgovor) =>{
		odgovor.type('json');
		odgovor.status(501)
		odgovor.send({opis:"metoda nije implementirana"})
	});

	server.delete("/baza/dnevnik", (zahjtev, odgovor) =>{
		odgovor.type('json');
		odgovor.status(501)
		odgovor.send({opis:"metoda nije implementirana"})
	});
}

function pripremiPutanjeTMDB() {
	let restTMDB = new RestTMDB(konf.dajKonf()["tmdbApiKeyV3"]);
	server.get("/api/tmdb/serije", restTMDB.getSerije.bind(restTMDB));
	server.get("/api/tmdb/serija", restTMDB.getSerija.bind(restTMDB));
}
