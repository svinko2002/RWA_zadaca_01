window.addEventListener("load",async ()=>{
    ucitajPodatke()
});

async function ucitajPodatke(){
    // let odgovor = await fetch("/getSESSION?resurs=uloga");
    let odgovor = await fetch("/getSESSION?resurs=uloga");
    let podaci = await odgovor.text();
    let korisnik = JSON.parse(podaci);
    console.log(korisnik)
    if(korisnik.uloga == 2){
        navigacijaAdmin()
    }else if(korisnik.uloga == 1){
        navigacijaKorisnik()
    }else{
        navigacijaGost()
    }
}

function navigacijaAdmin(){
    document.getElementById("prijava").hidden = true
    document.getElementById("odjava").hidden = false
    document.getElementById("registracija").hidden = false
    document.getElementById("profil").hidden = false
    document.getElementById("favoriti").hidden = false
    document.getElementById("korisnici").hidden = false
    document.getElementById("dnevnik").hidden = false
}

function navigacijaKorisnik(){
    document.getElementById("prijava").hidden = true
    document.getElementById("odjava").hidden = false
    document.getElementById("registracija").hidden = true
    document.getElementById("profil").hidden = false
    document.getElementById("favoriti").hidden = false
    document.getElementById("korisnici").hidden = true
    document.getElementById("dnevnik").hidden = true
}

function navigacijaGost(){
    document.getElementById("prijava").hidden = false
    document.getElementById("odjava").hidden = true
    document.getElementById("registracija").hidden = true
    document.getElementById("profil").hidden = true
    document.getElementById("favoriti").hidden = true
    document.getElementById("korisnici").hidden = true
    document.getElementById("dnevnik").hidden = true
}