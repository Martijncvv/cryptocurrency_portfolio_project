# Process Book
## Week 1
### Monday 30-11-2020
Project start
- Made Design document.
- Added all needed basic files; folders, templates, settings, urls.py, views.py.
- Set up everything the same way as we did in previous assignments.

### Tuesday 01-12-2020
- Restarted with the document because there was something wrong with the migrations; after 1 hour of trying to fix it I decided to just restart since it costs only 10 minutes to recreate the basic folders.
- Created models file.
- Created basic front-end with the General information connected to the CoinGecko API. 
- Added JS login pop-up screen. Currently trying to connect it with Django views. Error message still not working. 

### Wednesday 02-12-2020
- Finished basic login, logout and register functionality
- Added basic dynamic user feedback; disabled login/register button if no input was given.
- Added basic front-end (html/js) for "add coin to portfolio" pop-up screen.
- Changed UML to be able to see portfolio trade history.
- Added dynamic favicon

### Thursday 03-12-2020
- Added "add trade" frontend button and django back-end
- Changed "add coin to portfolio" screen to "add portfolio button"
- Added "delete from portfolio" button if coin is already in portfolio. 
- Added "create a note" input field.

- Decided to change database from 'storing 'coin_tickers' to storing 'coin_names' for an easier commmunication with the API.
- Fixed refresh bug; when adding a coin to your portfolio, coin changed to the homepage instead of the same coin page.
- Added basic recent prices in portfolio overview

### Friday 04-12-2020
- Added coin logos
- Added note functionality. Show note if there is one for the specific coin.
- Added "delete note" functionality.
- Changed DB variable name for name consistency; coinName -> coin_name

### Saturday 05-12-2020
- Added portfolio holdings amount back-end and front-end
- Added total coin value
- Added total portfolio value

### Sunday 06-12-2020
- Added a more effiecient way for fetching of price data; 1 request instead of a request for each coin.
- Found out API doesn't return values in the same order as asked for.
- Added "total current portfolio" value.
- Added Twitter timelines; took some to find out how because the page doesn't refresh when a new coin is clicked.
- Added basic coin graph

### Monday 07-12-2020
- Fixed bug in twitter timeline
- Added function to send trade_data from Django to Javascript

- Had problems with calculating charting data due to problems with asynchronous functions and was trying to figure out a way how to display historical portfolio data in a graph.
- Finished basic set-up of portfolio graph

### Tuesday 08-12-2020
- The portfolio graph was based on trade timestamps. Decided to change it to base the x-axis on timestamps of the past 90 days to give better insights in the portfolio.
- Fixed bug in portfolio history graph; API data was ms, DB data was sec
- Improved way to pass Django DB data to JS; used JSON data dump 

- Seems I'm not able to embed Google Trends chart on website; keeps loading

- Added 'trending coins' info
- Added 'explore button'; go to random coin page
- Added "settings view"
- Added "download trade data" functionality
- Added portfolio value chart timeframe options
- Added coin value chart timeframe options

### Wednesday 09-12-2020
- Added timeframes; 365 days and max timeframe
- Added timeframes to portfolio graph
- Added basic CSS
- Changed layout; removed Google Trends and added 'Coin notes' at its place.

- Had a bug with login in/ loging out. Pulled latest commit version.

### Thursday 10-12-2020
- Finished CSS left, middle and right column
- Fixed multiple errors if user is not logged in; JS data load errors.
- Removes 'delete note' button if no note available 
- Added Coingecko API referral

### Friday 11-12-2020
- Added language settings functionality
- Fixed general info overview; long coin name
- Fixed portfolio overview; long coin name
- Added 'delete trade' button

### Saturday 12-12-2020
- Added chart transparency
- Added coin logo shadow
- Trending tweet thread generator
- Added dynamic search bar

### Sunday 13-12-2020
- Improved code clarity and effiency; e.g. send portfolio data directly from Django to JS instead of fetching from HTML.
- Cleaned JS code

### Monday 14-12-2020
- Reordered JS functions, cleaned python and html code.
- Added function descriptions 
- Added 'initial investment value' at 'portfolio info'.
- Added 'portfolio ROI' at 'portfolio info'.
- Added confirmation prompt if user deletes trade or note.





