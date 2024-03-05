let url = "http://localhost:12000/api";
// let url = "http://spider.foi.hr:12490/api";

window.addEventListener("load",async ()=>{
    prikaziPodatke()
    document.getElementById("azuriraj").addEventListener("click" ,function(event) {
        event.preventDefault();
        azurirajPodatke()
    });

});

async function azurirajPodatke(){
    let forma = document.getElementById("forma");
    let formpodaci = new FormData(forma);

    let zaglavlje = new Headers();
    formPodaciObjekt = {}
    for (var pair of formpodaci.entries()) {
        formPodaciObjekt[pair[0]] = pair[1];
    }
    let tijelo = {
        korisnik: formPodaciObjekt
    };
    zaglavlje.set("Content-Type", "application/json");

    let parametri = {
        method: "PUT",
        body: JSON.stringify(tijelo),
        headers: zaglavlje,
    };
    console.log(formPodaciObjekt)
    console.log("/baza/korisnici/" + formPodaciObjekt.korime)
    // await fetch("/baza/korisnici/" + formPodaciObjekt.korime, parametri)
    await fetch("/baza/korisnici/" + formPodaciObjekt.korime, parametri)
}

async function prikaziPodatke(){
    // let odgovor = await fetch("/getSESSION?resurs=korime");
    let odgovor = await fetch("/getSESSION?resurs=korime");
    let podaci = await odgovor.text();
    let korime = JSON.parse(podaci).korime;

    if(korime != null){
        // let odgovor = await fetch("/baza/korisnici/" + korime);
        let odgovor = await fetch("/baza/korisnici/" + korime);
        let podaci = await odgovor.text();
        let korisnik = JSON.parse(podaci);
        popuniPolja(korisnik)
    }else{
        makniPolja()
    }
}

function popuniPolja(korisnik){
    document.getElementById("korime").value = korisnik.korime
    document.getElementById("korime").readOnly = true
    document.getElementById("lozinka").value = korisnik.lozinka
    document.getElementById("lozinka").readOnly = true
    document.getElementById("ime").value = korisnik.ime
    document.getElementById("prezime").value = korisnik.prezime
    document.getElementById("email").value = korisnik.email
    document.getElementById("email").readOnly = true
    document.getElementById("godina_rodjenja").value = korisnik.godina_rodjenja
    document.getElementById("drzava").value = korisnik.drzava
    document.getElementById("zupanija").value = korisnik.zupanija
    document.getElementById("vratiMe").hidden = true
}

function makniPolja(){
    document.getElementById("forma").hidden = true
    document.getElementById("azuriraj").hidden = true
    document.getElementById("vratiMe").hidden = false
}