-- Creator:       MySQL Workbench 8.0.34/ExportSQLite Plugin 0.1.0
-- Author:        notpe
-- Caption:       New Model
-- Project:       Name of the project
-- Changed:       2023-11-24 23:10
-- Created:       2023-10-19 19:26

-- Schema: mydb
BEGIN;
CREATE TABLE "tipovi_korisnika"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "naziv" VARCHAR(45) NOT NULL
);
CREATE TABLE "serija"(
  "tmdb_id" INTEGER PRIMARY KEY NOT NULL,
  "naziv" VARCHAR(200) NOT NULL,
  "opis" TEXT NOT NULL,
  "broj_sezona" INTEGER NOT NULL,
  "broj_epizoda" INTEGER NOT NULL,
  "popularnost" DECIMAL NOT NULL,
  "slika" TEXT NOT NULL,
  "stranica" TEXT NOT NULL,
  "ocjena_serije" DECIMAL NOT NULL,
  "broj_glasova" INTEGER NOT NULL,
  CONSTRAINT "tmdb_id_UNIQUE"
    UNIQUE("tmdb_id")
);
CREATE TABLE "sezona_serije"(
  "sezona_id" INTEGER NOT NULL,
  "naziv" VARCHAR(200) NOT NULL,
  "opis" TEXT NOT NULL,
  "slika" TEXT NOT NULL,
  "broj_sezone" INTEGER NOT NULL,
  "broj_epizoda_u_sezoni" INTEGER NOT NULL,
  "ocjena_sezone" DECIMAL NOT NULL,
  "serija_tmdb_id" INTEGER NOT NULL,
  PRIMARY KEY("sezona_id","serija_tmdb_id"),
  CONSTRAINT "sezona_id_UNIQUE"
    UNIQUE("sezona_id"),
  CONSTRAINT "fk_sezona_serije_serija1"
    FOREIGN KEY("serija_tmdb_id")
    REFERENCES "serija"("tmdb_id")
);
CREATE INDEX "sezona_serije.fk_sezona_serije_serija1_idx" ON "sezona_serije" ("serija_tmdb_id");
CREATE TABLE "vrsta_zahtjeva"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "naziv" VARCHAR(45) NOT NULL,
  CONSTRAINT "naziv_UNIQUE"
    UNIQUE("naziv")
);
CREATE TABLE "korisnik"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "tipovi_korisnika_id" INTEGER NOT NULL,
  "korime" VARCHAR(45) NOT NULL,
  "lozinka" VARCHAR(45) NOT NULL,
  "email" VARCHAR(45) NOT NULL,
  "ime" VARCHAR(45),
  "prezime" VARCHAR(45),
  "godina_rodjenja" VARCHAR(45),
  "drzava" VARCHAR(100),
  "zupanija" VARCHAR(100),
  CONSTRAINT "korisnicko_ime_UNIQUE"
    UNIQUE("korime"),
  CONSTRAINT "e-mail_UNIQUE"
    UNIQUE("email"),
  CONSTRAINT "fk_korisnik_tipovi_korisnika"
    FOREIGN KEY("tipovi_korisnika_id")
    REFERENCES "tipovi_korisnika"("id")
);
CREATE INDEX "korisnik.fk_korisnik_tipovi_korisnika_idx" ON "korisnik" ("tipovi_korisnika_id");
CREATE TABLE "dnevnik"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "vrsta_zahtjeva_id" INTEGER NOT NULL,
  "korisnik_id" INTEGER NOT NULL,
  "datum" DATE NOT NULL,
  "vrijeme" TIME NOT NULL,
  "trazeni_resurs" TEXT NOT NULL,
  "tijelo" TEXT,
  CONSTRAINT "fk_dnevnik_korisnik1"
    FOREIGN KEY("korisnik_id")
    REFERENCES "korisnik"("id"),
  CONSTRAINT "fk_dnevnik_vrste_zahtjeva1"
    FOREIGN KEY("vrsta_zahtjeva_id")
    REFERENCES "vrsta_zahtjeva"("id")
);
CREATE INDEX "dnevnik.fk_dnevnik_korisnik1_idx" ON "dnevnik" ("korisnik_id");
CREATE INDEX "dnevnik.fk_dnevnik_vrste_zahtjeva1_idx" ON "dnevnik" ("vrsta_zahtjeva_id");
CREATE TABLE "favoriti"(
  "korisnik_id" INTEGER NOT NULL,
  "serija_tmdb_id" INTEGER NOT NULL,
  PRIMARY KEY("korisnik_id","serija_tmdb_id"),
  CONSTRAINT "fk_korisnik_has_serija_korisnik2"
    FOREIGN KEY("korisnik_id")
    REFERENCES "korisnik"("id"),
  CONSTRAINT "fk_korisnik_has_serija_serija1"
    FOREIGN KEY("serija_tmdb_id")
    REFERENCES "serija"("tmdb_id")
);
CREATE INDEX "favoriti.fk_korisnik_has_serija_serija1_idx" ON "favoriti" ("serija_tmdb_id");
CREATE INDEX "favoriti.fk_korisnik_has_serija_korisnik2_idx" ON "favoriti" ("korisnik_id");
COMMIT;