async function dodajToken(parametri = {}) {
	let zaglavlje = new Headers();

	if (parametri.headers != null) zaglavlje = parametri.headers;

	let token = await dajToken();
	zaglavlje.set("Authorization", token);
	parametri.headers = zaglavlje;
	//console.log(parametri);
	return parametri;
}

async function dajToken() {
	// let odgovor = await fetch("http://localhost:12000/getSESSION");
	let odgovor = await fetch("/getSESSION");
	let tekst = JSON.parse(await odgovor.text());
	if (tekst.ok != null) return tekst.ok;
	else return "0000";
}

function prikaziStranicenje(str, ukupno, funkcijaZaDohvat) {
	let prikaz = document.getElementById("stranicenje");
	html = "";
	str = parseInt(str);
	if (str > 1) {
		html = '<button onclick="' + funkcijaZaDohvat + '(1)"><<</button>';
		html +=
			'<button onClick="' +
			funkcijaZaDohvat +
			"(" +
			(str - 1) +
			')"><</button>';
	}
	html +=
		'<button onClick="' +
		funkcijaZaDohvat +
		"(" +
		str +
		')">' +
		str +
		"/" +
		ukupno +
		"</button>";
	if (str < ukupno) {
		html +=
			'<button onClick="' +
			funkcijaZaDohvat +
			"(" +
			(str + 1) +
			')">></button>';
		html +=
			'<button onClick="' + funkcijaZaDohvat + "(" + ukupno + ')">>></button>';
	}
	prikaz.innerHTML = html;
}
