# ASSESSMENT
## Personal Milestones
- Portfolio History Chart 

Hoewel de portfolio grafiek visueel maar een klein onderdeel is van de website is dit wel het onderdeel waar ikzelf het meest trots op ben vanwege de tijd dat het heeft gekost om de data te verkrijgen en het op een nette manier te weergeven. Dit komt o.a. vanwege de onervarenheid met Asynchronous functions (API) en hoe dit precies werkt. Ook heb ik deze chart op 2 verschillende manieren opgebouwd, dit zal ik beschrijven bij 'Biggest Decisions'.
- Trending Tweet Thread Generator

Zelf ben ik erg actief op Twitter. Vandaar dat ik besloot een tool te maken die ervoor kan zorgen dat een normaal gesproken tijdsintensieve taak relatief weinig tijd kost. Ik gebruik de 'Thread Generator' nu dagelijks om over de daily top trending coins te tweeten. Hoewel dit niet voor de algemene gebruiker toepasbaar is vind ik dit toch een geslaagd element van de website. Omdat dit geen algemene functie is heb ik het ook bij settings gezet.
- Trade History Overview/ CSV file

De Trade historie vind ik zelf een interessant element omdat het ook even tijd kostte om erachter te komen hoe ik ervoor kon zorgen dat elke trade een eigen 'delete button' krijgt welke ook gelinkt is aan de juiste trade in de database. Ook vind ik de mogelijkheid om een CSV bestand te downloaden erg handig zodat gebruikers zelf hun data kunnen bewerken of delen (bijv. voor belasting zaken). 
- Search functionality

Tijdens het gebruiken van de website merkte ik zelf dat de searchbar soms onhandig was als je niet de exacte naam van de coin wist waardoor je regelmatig als terugekoppeling kreeg dat de coin niet bestond (sommige namen zijn nogal complex). Ik wilde om die reden een searchfield implementeren welke alle potentiële coins weergeeft wanneer de gebruiker begint met typen zonder dat de gebruiker eerst op 'Search' moet klikken of dat je van een pagina moet wisselen. Door de "Trending coins" te vervangen met de zoekresultaten zodra de gebruiker typt is het gelukt om op een relatief rustig ogende manier de gebruiker te voorzien van zoekresultaten zonder pop-up screens of pagina reloads. 
Ook is de normale zoekfunctie nog aanwezig; de naam intypen en de search knop gebruiken.

## Biggest decisions / Process book notes
### Wednesday 02-12-2020
- Added trade history in UML

Ik heb besloten een variabele in de database Portfolio-class dat bijhoud hoeveel coins de gebruiker bezit te vervangen voor een nieuwe class met Trade informatie. Op deze manier heb ik namelijk inzicht in hoeveel coins de gebruiker op welk moment heeft door te kijken naar de trade timestamp en trade type. Op de initiele manier zou ik alleen een vaste variabele hebben die werd geupdate.

### Thursday 03-12-2020
- Changed coin_tickers to coin_names for an easier commmunication with the API.

De API maakt gebruik van coin namen (Bitcoin) in plaats van coin tickers ($BTC). Door dit te veranderen in de database is er makkelijkere communicatie mogelijk omdat de ticker niet hoeft te worden geconverteerd.

### Sunday 06-12-2020
- Added a more effiecient way for fetching of price data; 1 request instead of a request for each coin.

Door gebruik te maken van een andere API request was het mogelijk om 1 API request te sturen waarbij er de huidige prijs van elke coin in een array wordt opgehaald in plaats van te loopen over een array en per coin een request te sturen.

### Monday 07-12-2020 
- The portfolio graph was based on trade timestamps. Decided to change it to base the x-axis on timestamps of the past 30 days to give better insights in the portfolio.

De eerste portfolio grafiek had geen timeframe opties en baseerde de Tijds/x-as op de trade-data timestamps van de Database. Ook werd er alleen berekend wat de portfolio waarde was op een trade timestamp. Dit zorgde ervoor dat de grafiek rechte lijnen tekende terwijl de portfolio waarde misschien wel 30% was gezakt en 40% was gestegen tussen 2 trades. Zulke events waren hierdoor dus niet zichtbaar en de grafiek gaf dus een irreël beeld.
Ik heb dit veranderd door timeframe opties toe te voegen. Wanneer de gebruiker '30 dagen' kiest wordt de portfolio waarde van de afgelopen 30 dagen weergeven. Hierbij wordt een timestamp stapgrootte gebruikt van 1 uur voor de timeframes 1, 3, 7 en 30 dagen. Een timestamp stapgrootte van 1 dag wordt gebruikt voor timeframes groter dan 90 dagen. De functie kijkt op deze manier dus wat de portfolio waarde is op elke timestamp en geeft dit weer in de grafiek waardoor je wel een reël beeld krijgt van de portfolio waarde gedurende de tijd.

### Sunday 13-12-2020
- Improved code clarity and effiency; e.g. send portfolio data directly from Django to JS instead of fetching from HTML.

Om ervoor te zorgen dat Javascript data van de server kon gebruiken had ik een onzichtbaar HTML element met Django Template Tags. Hierdoor werd de user data via Django dus geplaatst in de HTML code en kon Javascript deze data vervolgens ophalen voor eventuele bewerkingen. Aangezien dit een erg omslachtige en inefficiente manier is heb ik dit veranderd door gebruik te maken van de Python JSON module. Deze module maakt het mogelijk om Python objects te converteren naar een JSON file (JavaScript object notation) wat vervolgens Javascript weer kan gebruiken voor bepaalde calculaties of HTML bewerkingen.

### Monday 14-12-2020
- Reordered JS functions, cleaned python and HTML code.

Door de Javascript functions op een andere manier in te delen wordt niet elke keer dat een gebruiker een nieuwe coin bekijkt de chart van de historische portfolio data vernieuwd. Dit element heeft namelijk meerdere asynchrone functies waardoor er een lichte vertraging zichtbaar was voor de gebruiker.