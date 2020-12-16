# Cryptofolio Review
## Reviewer: Hattum Smit
- Eerste indruk: veel code omdat het allemaal op 1 page zit. Eerste instantie is het moeilijk voor te stellen hoe de website er precies uit ziet aan de hand van de code. Uiteindelijk wel duidelijker omdat de website layout (HTML) en daadwerkelijke content/informatie (JS) gescheiden zijn en er 'comment koppen' per codeblock aanwezig zijn. Wel is het goed om de website ernaast te hebben om een beeld te krijgen van waar elk onderdeel precies staat en je dus de kopjes kan volgen.

- Verbeterpunten / opmerkingen
    - Maak een mooiere confirmation pop-up voor 'delete trade/ delete note'.
    - Veel terugkomende onderdelen in code; 'setAttribute', document.querySelector'/ 'document.getElementById', weet zelf niet of dit efficienter kan.
    - Een chart-teken function toevoegen waar je variabele kunt invoeren ipv 2 losse chart-teken code blokken voor portfolio en coin charts.
    - Aangezien het een one-pager is kan de index.html en layout.html page worden samengevoegd.
    - 'portfolio_history_chart' functie heeft meerdere forEach loops in elkaar en is veel code waardoor het onoverzichtelijk is wat het precies doet. 

## Eigen review
- Eigen opmerkingen
    - Om de 'portfolio_history_chart' functie te verduidelijken zou ik in de functie-documentation uitgebreider uitleggen wat er precies gebeurt tussen welke code blocken als toevoeging op de comments bij losse code lines E.g.: 
    L 360-390: Fetches price data of all portfolio coins. 
    L 390-440: For each coin in portfolio; Loops over every timestamp and checks user's coin-holding-amount, coin price and adds multiplication of this to total portfolio value at timestamp. 
    L 440-460: Creates chart based on array with timestamp:portfolio_value dictionary.  
    - Om te voorkomen dat het 2 grote files met code zijn zou ik Javascript en eventueel HTML in 3 losse files scheiden zodat 'algemene elementen', 'portfolio elementen' en 'coin elementen' makkelijker terug te vinden zijn.
    - Als ik de website opnieuw zou maken zou ik de layout anders op bouwen. Bij de 'portfolio informatie' zou ik bijvoorbeeld een table plaatsen met data in plaats van losse collumn-divs waarin lists met de data staan.
    - De schaalbaarheid van de webpage voor verschillende window afmetingen werkt nog niet optimaal; de onderdelen schuiven wel onder elkaar bij verkleining van het scherm maar vult vervolgens niet de volledige breedte van de window.
    - Ik denk dat de CSS stylesheet efficienter kan door classes toe te voegen aan bepaalde vergelijkbare elementen of door gebruik te maken van inheritance.
    
- Functionaliteit toevoegingen
    - Meer info opties toevoegen; huidige profit per trade, trading volumes van coins vergelijken.
    - Trade historie connecten met een API van een exchange zodat trades automatisch worden toegevoegd.
    - Optie toevoegen om een custom timeframe in de grafiek te selecteren door met je muis een gebied te selecteren in de grafiek.
    - Algemene news website feed toevoegen.
    - Een vorm van Google Trends.

