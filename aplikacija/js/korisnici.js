let url = "http://localhost:12000/api";
// let url = "http://spider.foi.hr:12490/api";
let poruka = document.getElementById("poruka");

window.addEventListener("load", async () => {
	poruka = document.getElementById("poruka");
    // let odgovor = await fetch("/getSESSION?resurs=uloga");
    let odgovor = await fetch("/getSESSION?resurs=uloga");
    let podaci = await odgovor.text();
    let korisnik = JSON.parse(podaci);
    console.log(korisnik)
    if(korisnik.uloga == 2){
        prikaziPolja()
    }else if(korisnik.uloga == 1){
        makniPoljaObican()
    }else{
        makniPoljaGost()
	}
});

async function dohvatiKorisnike(){
    // let odgovor = await fetch("/baza/korisnici");
    let odgovor = await fetch("/baza/korisnici");
    let podaci = await odgovor.text();
    let korisnici = JSON.parse(podaci);
    return korisnici
}

async function prikaziPolja(){
    let korisnici = await dohvatiKorisnike()
    let glavna = document.getElementById("sadrzaj");
	let tablica = "<table border=1>";
	let gumbi = [];
	tablica +=
		"<tr>"+
		 	"<th>ID KORISNIKA</th>" +
		 	"<th>ID tipa korisnika</th>" +
		 	"<th>Korisničko ime</th>" +
		 	//"<th>Lozinka</th>" +
			"<th>Email</th>" +
			"<th>Ime</th>" +
			"<th>Prezime</th>" +
			"<th>Godina rođenja</th>" +
			"<th>Država</th>" +
			"<th>Županija</th>" +
		"</tr>";
	for (let k of korisnici) {
		tablica += "<tr>";
		//ID KORISNIKA
		tablica += "<td>" + k.id + "</td>";
		//ID tipa korisnika
		tablica += "<td>" + k.tipovi_korisnika_id + "</td>";
		//Korisničko ime
		tablica += "<td>" + k.korime + "</td>";
		//Lozinka
		//tablica += "<td>" + k.lozinka + "</td>";
		//Email
		tablica += "<td>" + k.email  + "</td>";
		//Ime
		tablica += "<td>" + k.ime  + "</td>";
		//Prezime
		tablica += "<td>" + k.prezime  + "</td>";
		//Godina rođenja
		tablica += "<td>" + k.godina_rodjenja + "</td>";
		//Država
		tablica += "<td>" + k.drzava + "</td>";
		//Županija
		tablica += "<td>" + k.zupanija + "</td>";
		//gumb makni korisnika
		tablica +=
			"<td><button id=\"" +
				k.korime +
			"\">Izbriši korisnika</button></td>";
		tablica += "</tr>";
		gumbi.push(k.korime);
	}
	tablica += "</table>";

	glavna.innerHTML = tablica;

	for (let i = 0; i < gumbi.length; i++) {
		document.getElementById(gumbi[i]).addEventListener('click', function() {
			makniKorisnika(gumbi[i]);
		});
	  }

    document.getElementById("korisnici").hidden = false
    document.getElementById("vratiMe").hidden = true
}

async function makniKorisnika(korime) {
    console.log("maknut cu korisnika sa korime " + korime);
    parametri = {method: "DELETE"};
    // await fetch("/baza/korisnici/" + korime, parametri);
    await fetch("/baza/korisnici/" + korime, parametri);
    prikaziPolja();
}

function makniPoljaObican(){
    document.getElementById("korisnici").hidden = true
    document.getElementById("vratiMe").hidden = false
}

function makniPoljaGost(){
    document.getElementById("korisnici").hidden = true
    document.getElementById("vratiMe").hidden = false
}