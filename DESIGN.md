# Design Document
## Main Features
- User accounts; Sign in and register option for users.
- Search and add cryptocurrencies to a portfolio.
- Delete cryptocurrencies from portfolio.
- For each coin in portfolio: display number of coins user holds and total value of the holding.
- Display general portfolio information; total value, invested amount, profit/loss, number of different coins.
+ Display historical graph of portfolio.

- Display general coin information; price, market cap, trading volume and description.
- Display latest social media updates; Twitter.
- Display Google trends results.
- Write a comment for yourself at a coinpage; e.g. reason you bought.
+ Display community chat; Telegram
+ Display coin price graph.

+ Explorer option: get information about  a random coin.
+ Settings option: language and base currency

- MVP
+ Optional

## User interface
### General overview
![Website UI](doc/CF_BTC_logged-in.png)

### UI explanation
![Website UI with information](doc/CF_overview_info.png)

### Login and register screen
![Log-in view](doc/CF_sign-in.png)
![register view](doc/CF_register.png)

### Add and edit coins to portfolio
![Add coin to portfolio view](doc/CF_BTC_add-btc.png)
![Edit portfolio coin view](doc/CF_BTC_edit-btc.png)

## Database
![CryptoFolio UML](doc/cryptofolio_UML.png)

## Lists
### API's
- Cryptocurrency data; API
Need data to display real-time price and description.
https://www.coingecko.com/api/documentations/v3#/simple/get_simple_price 
- Twitter account data; API
Account data of specific coins to display latest coin updates.
https://developer.twitter.com/en/docs/twitter-api/users/lookup/introduction 
- Telegram channel; API
Channel data to display latest messages of the community.
https://core.telegram.org/widgets/post 
- Google trends search data; Embedded script
Data to show Google Trends graph of the specific coin.
https://trends.google.com/trends/explore?q={coin}&geo=US 

### External source for cryptocurrency data; API
Request URL:
https://api.coingecko.com/api/v3/coins/bitcoin?tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true
- Coin ticker ($BTC, $ETH)
- Coin name
- Coin price
- Coin description
- Coin image


### External components
- Bootstrap; layout functionaliteit voor dynamische indeling van de website



