🐾 DogBook
Ett socialt nätverk för hundar på hunddagis

📘 Om projektet
DogBook är en webbaserad applikation som gör det enklare för personal på hunddagis att hålla koll på vilka hundar som är på plats och hur de relaterar till varandra. Varje hund får en egen profil med information, bild och en vänlista – likt ett Facebook för hundar.





🧰 Använda tekniker
Område	Tekniker
Frontend	React, React Router, Axios
Backend	Node.js, Express, MongoDB
Testning	Jest, React Testing Library






📦 Installation
✅ Förutsättningar
Node.js installerat
MongoDB installerat och tillgängligt lokalt






🚀 Backend – Kom igång
Navigera till backend-mappen:

bash
Kopiera
Redigera
cd path/to/DogBook/backend
Installera nödvändiga beroenden:

bash
Kopiera
Redigera
npm install
Starta MongoDB (byt ut /din/datamapp till korrekt sökväg):

bash
Kopiera
Redigera
mongod --dbpath=/din/datamapp
Starta backend-servern:

bash
Kopiera
Redigera
node server.js
📍 Servern körs på: http://localhost:5001










💻 Frontend – Kom igång
Gå till frontend-mappen:

bash
Kopiera
Redigera
cd path/to/DogBook/frontend
Installera beroenden:

bash
Kopiera
Redigera
npm install
Starta utvecklingsservern:

bash
Kopiera
Redigera
npm run dev
📍 Frontend nås via: http://localhost:5173






🧪 Testa applikationen
Funktionell genomgång:
Skapa en hund – exempelvis Dog1

Ändra ålder på Dog1 och kontrollera uppdateringen på profilsidan

Lägg till Wolverine som vän till Dog1

Bekräfta att Dog1 och Wolverine är vänner

Lägg till Lassie som vän till Dog1

Bekräfta att Lassie är vän med Dog1, men inte med Wolverine

Bekräfta att Dog1 är vän med både Wolverine och Lassie

Radera Wolverine

Verifiera att Dog1 endast har Lassie kvar som vän





🧪 Testning
För att köra tester (i frontend-mappen):

bash
Kopiera
Redigera
npm test
🗂 Funktioner i korthet
✅ Startsida – Lista alla hundar med färgstatus (grön = närvarande, röd = frånvarande)

✅ Skapa-sida – Lägg till en ny hund med info och bild

✅ Profil-sida – Visa detaljerad information + vänskapsförbindelser

✅ Redigera-sida – Ändra hundens information och vänlista
