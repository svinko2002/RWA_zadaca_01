port=12000
server="localhost"
echo "GET"
curl -X GET "http://$server:$port/api/korisnici/"
echo ""
echo "POST"
curl -X POST "http://$server:$port/api/korisnici/" -H 'Content-Type: application/json' -d '{"ime":"Test", "prezime":"Test", "lozinka":"123456", "email":"test3@foi.unizg.hr", "korime":"pkos"}'
echo ""
echo "DELETE"
curl -X DELETE "http://$server:$port/api/korisnici/"
echo ""
echo "PUT"
curl -X PUT "http://$server:$port/api/korisnici/"
echo ""
echo "GET"
curl -X GET "http://$server:$port/api/korisnici/pkos"
echo ""
echo "GET prijava tocna"
curl -X POST "http://$server:$port/baza/korisnici/pkos/prijava" -H 'Content-Type: application/json' -d '{"lozinka":"123456"}'
echo ""
echo "GET prijava kriva"
curl -X POST "http://$server:$port/api/korisnici/pkos/prijava" -H 'Content-Type: application/json' -d '{"lozinka":"12345"}'
echo ""
echo "PUT"
curl -X PUT "http://$server:$port/api/korisnici/pkos" -H 'Content-Type: application/json' -d '{"ime":"Test2", "prezime":"Test", "lozinka":"123456", "email":"test2@foi.unizg.hr"}'
echo ""
echo "DELETE"
curl -X DELETE "http://$server:$port/api/korisnici/test"
echo ""
echo "POST"
curl -X POST "http://$server:$port/api/korisnici/test"
echo ""

curl -X POST "http://localhost:12000/baza/korisnici/obican/prijava" -H 'Content-Type: application/json' -d '{"lozinka":"rwa"}'