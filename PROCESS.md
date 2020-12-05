# Process Book
## Week 1
### Monday 30-11-2020
Project start
- Made Design document.
- Added all needed basic files; folders, templates, settings, urls.py, views.py.
- Set up everything the same way as we did in previous assignments.

### Tuesday 01-12-2020
- Restarted with the document because there was something wrong with the migrations; after 1 hour of trying to fix it I decided to just restart since it costs only 15 minutes to recreate the basic folders.
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
- Mental breakdown confirmed
- Fixed refresh bug; when adding a coin to your portfolio, coin changed to the homepage instead of the same coin page.
- Added basic recent prices in portfolio overview

### Friday 04-12-2020
- Added coin logos
- Added note functionality. Show note if there is one for the specific coin.
- Added "delete note" functionality.
- Changed DB variable name for name consistency; coinName -> coin_name

### Saturday 05-12-2020
- Added portfolio holdings amount back-end and front-end






In your process book, you chronicle your big decisions. When faced with a decision during the day, document it like this:

The choice you’ve made
What you expect to happen as a result of that choice (at this moment in time)
Why you expect things to pan out that way
