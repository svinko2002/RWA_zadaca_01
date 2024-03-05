let url = "http://localhost:12000/api";
// let url = "http://spider.foi.hr:12490/api";
let poruka = document.getElementById("poruka");

window.addEventListener("load",async ()=>{
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

function prikaziPolja(){
    document.getElementById("forma").hidden = false
    document.getElementById("vratiMe").hidden = true
}

function makniPoljaObican(){
    document.getElementById("korisnici").hidden = true
    document.getElementById("forma").hidden = true
    document.getElementById("vratiMe").hidden = false
}

function makniPoljaGost(){
    document.getElementById("korisnici").hidden = true
    document.getElementById("forma").hidden = true
    document.getElementById("vratiMe").hidden = false
}
