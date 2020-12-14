// Functions TOC
// - main
// - searchbar
// - load_portfolio_data
// - total_coin_values
// - trade_history
// - portfolio_history_chart

// - coin_info
// - coin_chart
// - add_trade
// - random_coin
// - trending_coins
// - trending_tweet_thread_generator

// - logged_in
// - logged_out
// - login
// - register
// - settings
// - close_field

// - download_trade_data
// - twitter_feed

document.addEventListener('DOMContentLoaded', function() {  
// *
// * Load page items and functionality after html is loaded.
// *  
    // register button
    document.querySelector('#register').addEventListener('click', register);
    // add coin button
    document.querySelector('#add_trade').addEventListener('click', add_trade);
    // explore button
    document.querySelector('#explore').addEventListener('click', random_coin);
    // settings button
    document.querySelector('#settings').addEventListener('click', settings);

    // sets search bar settings
    search_bar();

    // adds eventListeners to login classes
    let login_button = document.querySelectorAll('.login');
    login_button.forEach(function (i) {
        i.addEventListener('click',  login) 
    });

    // adds eventListeners to close_field classes
    let close_field_button =  document.querySelectorAll('.close_field');
    close_field_button.forEach(function (i) {
        i.addEventListener('click',  close_field) 
    });

    // selects login form
    const login_password_field = document.querySelector('#login_password_field');
    const login_field_button = document.querySelector('#login_field_button');
    // selects register form
    const register_password_field = document.querySelector('#register_password_field');
    const register_field_button = document.querySelector('#register_field_button');
    
    // listens for input to be typed into 'login input' field
    login_password_field.onkeyup = () => {
        if (login_password_field.value.length > 0) {
            login_field_button.disabled = false;
        }
        else {
            login_field_button.disabled = true;
        }
    }
    // listens for input to be typed into 'register input' field
    register_password_field.onkeyup = () => {
        if (register_password_field.value.length > 0) {
            register_field_button.disabled = false;
        }
        else {
            register_field_button.disabled = true;
        }
    }
    // disables login/register submit buttons
    login_field_button.disabled = true;
    register_field_button.disabled = true;
    
    // gets portfolio info and shows fields if user is signed in
    if (user_signed_in) {
        logged_in()
        load_portfolio_data();
        // set user's prefered language
        document.getElementById("current_language").innerHTML = "Current language: " + language_preference_data;
    }
    else {
        logged_out()
    }
   
    // displays coin info
    coin_page_name = document.getElementById('coin_page_name').innerHTML;
    coin_info(coin_page_name);
});


function search_bar() {
// *
// * Listens for user input and creates list with clickable search results when user types.
// * 
    document.querySelector('#submit_search').addEventListener('click', function() {     
        // gets value from searchbar
        let coin_name_search = document.querySelector('#search_value');
        if (coin_name_search.value !== ""){
            coin_info(coin_name_search.value);
            coin_name_search.value = ""
        }
    });

    // list to store all existing coins
    coin_names = []
    // gets coins
    fetch("https://api.coingecko.com/api/v3/coins/list")
    .then(response => response.json())
    .then(coin_list => { 
        coin_list.forEach((coin) => {
            coin_names.push(coin.id)
        });
    });
    // selects search form
    const submit_search = document.querySelector('#submit_search');
    const coin_name_search = document.querySelector('#search_value');

    // listens for input to be typed into 'coinsearch input' field
    // changes header if user types and shows clickable searchresults
    coin_name_search.onkeyup = () => {
        if (coin_name_search.value.length > 0) {
            submit_search.disabled = false;
            document.getElementById("search_header").innerHTML = "Search ";
        }
        else {
            submit_search.disabled = true;
            document.getElementById("trending_header").innerHTML = "Trending (24h)";
            trending_coins();
        }
        coin_suggestion = coin_names.filter(coin => coin.includes(coin_name_search.value));
       
        document.getElementById("trending_coins").innerHTML = "";
        coin_suggestion.forEach((coin_filter) => {
            let trending_coin_button = document.createElement('button');
            trending_coin_button.innerHTML = coin_filter;
            trending_coin_button.setAttribute("class", "btn btn-sm btn-info trending_coin_button");
            trending_coin_button.setAttribute("autocomplete", "off");
            trending_coin_button.setAttribute("onClick", "coin_info('" + coin_filter + "')");
            document.getElementById("trending_coins").append(trending_coin_button);
            document.getElementById("trending_header").innerHTML = "Search results";
        })
    }
}


function load_portfolio_data() {
// *
// * Loads user's portfolio data; portfolio coins, amounts, current values, portfolio-history-chart and general portfolio statistics in the 'portfolio info' field.
// *
    // loads and displays header and user portfolio coin names 
    document.getElementById("portfolio_overview_names").innerHTML = "";
    let portfolio_overview_name_header  = document.createElement('div');
    portfolio_overview_name_header.innerHTML = 
    `<p id="portfolio_overview_table_header">Coin</p>`;
    document.getElementById("portfolio_overview_names").append(portfolio_overview_name_header);

    portfolio_coin_name_data.forEach((coin_name) => {
        let portfolio_overview_name  = document.createElement('div');
        portfolio_overview_name.innerHTML = 
        `<button class="btn btn-sm btn-info portfolio_coin" onClick="coin_info('` + coin_name + `')">` + coin_name + `</button>`
        document.getElementById("portfolio_overview_names").append(portfolio_overview_name);
    });

    // loads header and coin holding amounts
    document.getElementById("portfolio_coin_amount_list").innerHTML = "";
    let portfolio_overview_amount_header  = document.createElement('div');
    portfolio_overview_amount_header.innerHTML = 
    `<p id="portfolio_overview_table_header">Amount</p>`;
    document.getElementById("portfolio_coin_amount_list").append(portfolio_overview_amount_header);

    portfolio_coin_amount_data.forEach((coin_amount) => {
        let portfolio_overview_amount  = document.createElement('li');
        portfolio_overview_amount.innerHTML = coin_amount;
        portfolio_overview_amount.setAttribute("class","portfolio_coin_amount");
        document.getElementById("portfolio_coin_amount_list").append(portfolio_overview_amount);
    });

    // gets current portfolio coin prices     
    let portfolio_coins_list = []
    // creates list with portfolio coins to use as API input
    portfolio_coin_name_data.forEach(function (coin_name) {
        portfolio_coins_list.push(coin_name);
    });
    portfolio_coins_string = portfolio_coins_list.join('%2C')

    // gets price data of portfolio coins
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=" + portfolio_coins_string + "&vs_currencies=usd")
    .then(response => response.json())
    .then(data => {
        // API doesn't return values in the same order as the given list; adds the right coin value at the right name in 'portfolio holdings' overview
        document.querySelector(".portfolio_price_list").innerHTML = "";
        portfolio_coin_name_data.forEach(function (coin_name) {
            for (let [key, value] of Object.entries(data)) {
                if (coin_name == key) {
                    let li_coin_price  = document.createElement('li');
                    li_coin_price.innerHTML = parseFloat(value.usd.toFixed(6));
                    li_coin_price.setAttribute("class", "portfolio_coin_price");
                    document.querySelector(".portfolio_price_list").append(li_coin_price);
                }
            }
        });  
        // loads total values
        total_coin_values()
    })

    // calculates and displays user's initial investment
    let initial_investment_value = 0;
    // loops over trade history data and changes 'initial_investment_values' according to the trade type
    trade_history_data.forEach(function (trade) {
        if (trade.tradetype == "BUY") {
            initial_investment_value += trade.amount * trade.price;
        }
        else {
            initial_investment_value -= trade.amount * trade.price;
        }
    });
    document.getElementById("initial_investment").innerHTML = "Initial investment: $" + `<span id="initial_investment_value">` + initial_investment_value.toFixed(2) + `</span>`;

    // draws portfolio history chart; default = timeframe of 7 days
    portfolio_history_chart(7);
    // loads trade history
    trade_history()
};


function total_coin_values() {
// *
// * Calculates the total current value of the every coin the user currently holds and adds to 'portfolio holdings' field and 'portfolio info' field.
// * 
    // clears current coin values list
    document.querySelector(".portfolio_total_value_list").innerHTML = "";

    // gets values from portfolio
    portfolio_coin_prices = document.querySelectorAll('.portfolio_coin_price');
    // creates array to store total coin values
    total_value_list = [];
    total_portfolio_value = 0;
    
    // adds 'number of coins in portfolio' to 'portfolio info' field
    document.getElementById("portfolio_nr_coins").innerHTML = "Number of coins: " + portfolio_coin_prices.length;

    // calculates total value of specific coin
    for (i = 0; i < portfolio_coin_prices.length; i++) {
        total_value = parseFloat(portfolio_coin_prices[i].innerHTML) * portfolio_coin_amount_data[i];
        total_value_list.push(total_value);
        // calculate total portfolio value
        total_portfolio_value = total_portfolio_value + total_value;
    }
    
    // adds total coin values to html
    total_value_list.forEach(function (value) {
        let li_total_value  = document.createElement('li');
        li_total_value.innerHTML = value.toFixed(2);
        
        li_total_value.setAttribute("class", "portfolio_coin_total_value");
        document.querySelector('.portfolio_total_value_list').append(li_total_value);
    });
    // adds 'total portfolio value' to 'portfolio info' field
    document.getElementById("total_portfolio_value").innerHTML = "Total value: $" + total_portfolio_value.toFixed(2);

    // calculates ROI (profit/loss) and displays right style in 'portfolio info' field
    let portfolio_roi = total_portfolio_value - document.getElementById("initial_investment_value").innerHTML;
    if (portfolio_roi > 0) {
        document.getElementById("portfolio_roi").innerHTML = "Portfolio ROI: " + `<span id="portfolio_roi_profit">$` + portfolio_roi.toFixed(2) + `</span>`;
    }
    else {
        document.getElementById("portfolio_roi").innerHTML = "Portfolio ROI: " + `<span id="portfolio_roi_loss">$` + portfolio_roi.toFixed(2) + `</span>`;
    }
    
}


function trade_history() {
// *
// * Creates and displays 'trade history' field and creates buttons to delete a trade.
// *
    // displays number of trades in 'portfolio info' field
    document.getElementById("total_nr_trades").innerHTML = "Number of trades: " + trade_history_data.length;
    // clears trade history buttons
    document.getElementById("trade_history_delete_buttons").innerHTML = "";

    // loops over the trade history array in reversed order
    trade_history_data.slice().reverse().forEach(function (trade) {
        // adds trade history coin name
        let li_coin_name  = document.createElement('li');
        li_coin_name.innerHTML = trade.coin_name;
        li_coin_name.setAttribute("class", "trade_history_overview_data");

        // checks if 'buy' or 'sell' trade and changes styling
        if (trade.tradetype == "BUY") {
            li_coin_name.setAttribute("style", "color: green;");
        }
        else {
            li_coin_name.setAttribute("style", "color: red;");
        }
        document.getElementById("trade_history_coin_name").append(li_coin_name);
     
        // adds trade history price
         let li_price  = document.createElement('li');
         li_price.innerHTML = trade.price;
         li_price.setAttribute("class", "trade_history_overview_data");
         document.getElementById("trade_history_price").append(li_price);

        // adds trade history amount
        let li_amount  = document.createElement('li');
        li_amount.innerHTML = trade.amount;
        li_amount.setAttribute("class", "trade_history_overview_data");
        document.getElementById("trade_history_amount").append(li_amount);

        // adds trade history time
        let li_time  = document.createElement('li');
        li_time.innerHTML = new Date(trade.time).toLocaleDateString("en-US");
        li_time.setAttribute("class", "trade_history_overview_data");
        document.getElementById("trade_history_time").append(li_time);

        // adds 'remove trade' button
        // gets csrf token
        csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        // creates form 
        let delete_trade_form = document.createElement('form');
        delete_trade_form.setAttribute("action", "/");
        delete_trade_form.setAttribute("method", "POST");
        delete_trade_form.setAttribute("class", "d-flex flex-column justify-content-center align-items-center delete_trade_form");
        delete_trade_form.setAttribute("id", "delete_trade_form_" + trade.id);
        document.getElementById("trade_history_delete_buttons").append(delete_trade_form);
        // adds csrf token to form
        let csrf_token = document.createElement('input');
        csrf_token.type = 'hidden';
        csrf_token.name = 'csrfmiddlewaretoken';
        csrf_token.value = csrftoken;
        document.getElementById("delete_trade_form_" + trade.id).append(csrf_token);
        // adds button to form
        let delete_trade_button = document.createElement('button');
        delete_trade_button.setAttribute("class", "btn btn-sm btn-outline-danger");
        delete_trade_button.setAttribute("id", "delete_trade_button_" + trade.id);
        delete_trade_button.setAttribute("name", "delete_trade_id");
        delete_trade_button.setAttribute("value", trade.id);
        document.getElementById("delete_trade_form_" + trade.id).append(delete_trade_button);
    })
}


function portfolio_history_chart(time_frame) {
// *
// * Generates value chart of the user's portfolio with the chosen timeframe.
// *   
    // creates array to store dictionaries with portfolio_value:timestamp data
    portfolio_total_value_timestamp_array = [];

    // gets all unique coin names of all trades made by the user
    let unique_coins = [];
    trade_history_data.forEach(function (trade) {
        if (!unique_coins.includes(trade.coin_name)) {
            unique_coins.push(trade.coin_name);
        }
    });
    // hides chart field if no history available and exits the function
    if (unique_coins.length == 0) {
        document.getElementById("portfolio_chart_data").hidden = true;
        return;
    } 
    document.getElementById("portfolio_chart_data").hidden = false;
    
    // gets historic chart data of all unique coins
    let coins_chart_data_object = {};
    var get_chart_data = new Promise((resolve, reject) => {
        unique_coins.forEach((coin) => {
            fetch("https://api.coingecko.com/api/v3/coins/" + coin + "/market_chart?vs_currency=usd&days=" + time_frame)
            .then(response => response.json())
            .then(coin_chart_data => { //object
                coins_chart_data_object[coin] = coin_chart_data;         
                
                if (unique_coins.length == Object.keys(coins_chart_data_object).length) 
                {
                    resolve();
                }
            });
        });
    }); 

    // waits for the forEach loop to finish fetching chart data
    get_chart_data.then(() => {
        // creates array with timestamps of a fetched chart
        let chart_timestamp_array = [];
        (coins_chart_data_object[Object.keys(coins_chart_data_object)[0]].prices).forEach((timestamp) => {
            chart_timestamp_array.push(timestamp[0]);
        });

        // loops over timestamps
        timestamp_index = 0;
        chart_timestamp_array.forEach((timestamp) => { 
            // creates dictionary; key:value = coin:amount
            coin_holdings_dict = {};
            unique_coins.forEach((coin) => {
                coin_holdings_dict[[coin]] = 0;
            });

            // loops over trade history data and changes holdings if trade was added before timestamp
            trade_history_data.forEach(function (trade) {
                // if trade executed before timestamp changes 'coin holding value'
                if (trade.time < timestamp) {
                    // check if buy or sell order and changes 'coin holdings value'
                    if (trade.tradetype == "BUY") {
                        coin_holdings_dict[trade.coin_name] += trade.amount;    
                    }
                    else {
                        coin_holdings_dict[trade.coin_name] -= trade.amount;
                    }
                }
            });

            // loops over every unique coin, gets price at timestamp and adds to portfolio
            portfolio_value_at_timestamp = 0;
            for (let i = 0; i < unique_coins.length; i += 1 ) {
                // gets coin price at timestamp if timestamp exists in 'chart history object'
                if (coins_chart_data_object[unique_coins[i]].prices[timestamp_index] != null)
                {
                    // gets coin price at timestamp
                    coin_price_at_timestamp = coins_chart_data_object[unique_coins[i]].prices[timestamp_index][1];
                    // adds 'coin price at timestamp * the amount in portfolio at timestamp' to 'total portfolio value'
                    portfolio_value_at_timestamp += (coin_price_at_timestamp * coin_holdings_dict[unique_coins[i]])  
                }
            }
                // creates dictionaries with time/portfolio_value pairs and adds to portfolio_timestamp array
            let price_data_dict = {};
            price_data_dict["time"] = timestamp;
            price_data_dict["value"] = portfolio_value_at_timestamp;
            portfolio_total_value_timestamp_array.push(price_data_dict);
            timestamp_index += 1;
        });

        // Morris Chart explanation source:
        // https://morrisjs.github.io/morris.js/
        // creates portfolio value chart
        document.getElementById("portfolio_chart").innerHTML = "";
        new Morris.Area({
            element: "portfolio_chart",
            data: portfolio_total_value_timestamp_array,
            xkey: "time",
            ykeys: ["value"],
            labels: ["$"],
            preUnits: "$",
            hideHover: "always",
            pointSize: "0",
            lineWidth: "0",
            lineColors: ["#35a9b4"],
            fillOpacity: "0.8"
        });
    });
    // creates portfolio chart timeframe buttons
    document.getElementById("portfolio_chart_timeframe_buttons").innerHTML = "";
    const timeframes = [1, 3, 7, 30, 365];
    timeframes.forEach((timeframe_button) => {
        let coin_chart_timeframe_button = document.createElement('button');
        coin_chart_timeframe_button.innerHTML = timeframe_button;
        coin_chart_timeframe_button.setAttribute("id", "portfolio_chart_timeframe_button_" + timeframe_button);
        coin_chart_timeframe_button.setAttribute("class", "btn btn-sm btn-info portfolio_chart_timeframe_button");
        coin_chart_timeframe_button.setAttribute("onClick", "portfolio_history_chart('" + timeframe_button +"')");
        document.getElementById("portfolio_chart_timeframe_buttons").append(coin_chart_timeframe_button);
    });
    // changes active button design
    document.getElementById("portfolio_chart_timeframe_button_" + time_frame).setAttribute("class", "btn btn-info portfolio_chart_timeframe_button active");
}


function coin_info(coin) {
// *
// * Fetches coin info via API and displays it.
// *
    // clears search input field
    document.querySelector('#search_value').value = "";
    // disables the search submit button:
    submit_search.disabled = true;

    // fetches coin data
    fetch("https://api.coingecko.com/api/v3/coins/"+ coin.toLowerCase() +"?localization=true&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false")
    .then(response => response.json())
    .then(data => {
        // checks if coin exists
        if ("error" in data) {
            document.getElementById('search_error').innerHTML = data.error;
            return;
        }
        document.getElementById('search_error').innerHTML = "";

        // if coin found in portfolio list, changes "add to portfolio button" to "remove" and changes style
        if (portfolio_coin_name_data.includes(data.id)) {
            document.getElementById("portfolio_button").innerHTML = "Remove";
            document.getElementById("portfolio_button").setAttribute("class", "btn btn-sm btn-outline-info");
        }
        else {
            document.getElementById("portfolio_button").innerHTML = "Add to portfolio";
            document.getElementById("portfolio_button").setAttribute("class", "btn btn-sm btn-info");
        }

        // sets different values and attributes to currently opened coin
        // 'add portfolio' button
        document.getElementById("portfolio_button").setAttribute("value", data.id);
        // 'add_note_button' value 
        document.getElementById("add_note_button").setAttribute("value", data.id);
        // 'delete_note_button' value 
        document.getElementById("delete_note_button").setAttribute("value", data.id);
        // favicon image
        document.getElementById("favicon").setAttribute("href", data.image.thumb);
        // coin logo      
        document.getElementById("coin_image").setAttribute("src", data.image.large );

        // adds coin data to 'General Info' elements
        document.title = data.name;
        document.getElementById("coin_page_name").innerHTML = data.id;
        document.getElementById("coin_info_name").innerHTML = `<a href="` + data.links.homepage[0] + `" target="_blank">` + data.id + `</a>`;
        document.getElementById("coin_info_ticker").innerHTML = data.symbol;
        document.getElementById("coin_info_price").innerHTML = "$" + data.market_data.current_price.usd;
        document.getElementById("coin_info_marketcap").innerHTML = "$" + data.market_data.market_cap.usd.toFixed(2);
        document.getElementById("coin_info_atl").innerHTML = "$" + data.market_data.atl.usd.toLocaleString();  
        document.getElementById("coin_info_ath").innerHTML = "$" + data.market_data.ath.usd.toLocaleString();
        document.getElementById("coin_info_atl_date").innerHTML = "(" + data.market_data.atl_date.usd.split('T')[0] + ")";
        document.getElementById("coin_info_ath_date").innerHTML = "(" + data.market_data.ath_date.usd.split('T')[0] + ")";
        
        // gets and sets prefered language if description language is available, else sets 'english'
        if (data.description[language_preference_data] != "") {
            document.getElementById("coin_info_description").innerHTML = data.description[language_preference_data];
        }
        else if (data.description.en != "") {
            document.getElementById("coin_info_description").innerHTML = data.description.en;
        }
        else {
            document.getElementById("coin_info_description").innerHTML = "No description available.";
        }

        // adds note to 'note field' if note exists, else removes 'delete button'
        if (notes_data[data.id] == null) {
            document.getElementById("coin_note_field").innerHTML = "Write a note about " + data.name + ".";
            document.getElementById("delete_note_button").style.display = "none"; 
        }
        else {
            document.getElementById("coin_note_field").innerHTML = notes_data[data.id];
            document.getElementById("delete_note_button").style.display = "block"; 
        }

        // adds Twitter Timeline
        twitter_feed(data.links.twitter_screen_name);

        // draws coin chart, default timeframe: 7 days
        coin_chart(coin.toLowerCase(), 7);
    });
    // displays trending coins
    trending_coins();
}


function coin_chart(coin_name, time_frame) {
// *
// * Displays price chart of coin with the chosen timeframe.
// *
    // sets coin-value-chart timeframe header
    switch(time_frame) {
        case 1:
            document.getElementById("coin_chart_timeframe_header").innerHTML = "Timeframe: " + time_frame + " day";
            break;
        case 365:
            document.getElementById("coin_chart_timeframe_header").innerHTML = "Timeframe: 1 year";
            break;
        case "max":
            document.getElementById("coin_chart_timeframe_header").innerHTML = "Timeframe: max available days";
            break;
        default:
            document.getElementById("coin_chart_timeframe_header").innerHTML = "Timeframe: " + time_frame + " days";
    }

    // gets chart data
    fetch("https://api.coingecko.com/api/v3/coins/" + coin_name + "/market_chart?vs_currency=usd&days=" + time_frame)
    .then(response => response.json())
    .then(chart_data => {
        // creates an empty array to store the paired data
        price_data_array = [];
        // creates dictionaries with pairs and adds to array
        chart_data.prices.forEach(function (price_data) {
            let price_data_dict = {};
            price_data_dict["time"] = price_data[0];
            price_data_dict["value"] = price_data[1];
            price_data_array.push(price_data_dict);
        });          

        // Morris Chart explanation source:
        // https://morrisjs.github.io/morris.js/
        // creates price chart
        document.getElementById("coin_chart").innerHTML = "";
        new Morris.Area({
            element: "coin_chart",
            data: price_data_array,
            xkey: "time",
            ykeys: ["value"],
            labels: ["$"],
            preUnits: "$",
            hideHover: "auto",
            pointSize: "0",
            lineWidth: "0",
            resize: "true",
            redraw: "true",
            lineColors: ["#35a9b4"],
            fillOpacity: "0.8"
        });
    }); 
    
    // creates coin chart timeframe buttons
    document.getElementById("coin_chart_timeframe_buttons").innerHTML = "";
    const timeframes = [1, 3, 7, 30, 365, "max"];
    timeframes.forEach((timeframe_button) => {
        let coin_chart_timeframe_button = document.createElement('button');
        coin_chart_timeframe_button.innerHTML = timeframe_button;
        coin_chart_timeframe_button.setAttribute("id", "coin_chart_timeframe_button_" + timeframe_button);
        coin_chart_timeframe_button.setAttribute("class", "btn btn-info coin_chart_timeframe_button");
        coin_chart_timeframe_button.setAttribute("onClick", "coin_chart('"+ coin_name + "'" +","+"'"+ timeframe_button +"')");
        document.getElementById("coin_chart_timeframe_buttons").append(coin_chart_timeframe_button);
    });
    // changes active button design
    document.getElementById("coin_chart_timeframe_button_" + time_frame).setAttribute("class", "btn btn-info coin_chart_timeframe_button active");
}


function add_trade() {
// *
// * Displays pop-up field and pre-sets values in input-fields for user to add a trade.
// *
    // gets coin name and sets name in 'add trade' field
    coin_name = document.getElementById('coin_page_name').innerHTML;
    coin_price_LocaleString = document.getElementById('coin_info_price').innerHTML;
    // converts LocaleString price to decimal price and sets price in 'add trade' field
    coin_price = coin_price_LocaleString.replace("$", '');

    // sets form input field values
    document.getElementById("addtrade_input_name").value = coin_name;
    document.getElementById("addtrade_input_price").value = coin_price;
    // displays 'add trade' field
    document.querySelector("#addtrade_field").style.display = "block";
}


function random_coin() {
// *
// * Gets random coin from all available coins and displays information. 
// *
    // gets coin list
    fetch("https://api.coingecko.com/api/v3/coins/list")
    .then(response => response.json())
    .then(coin_list => { 
        // picks random coin from list of available coins
        let random_coin = coin_list[Math.floor(Math.random() * coin_list.length)];
        // displays random coin
        coin_info(random_coin.id);
    })
}


function trending_coins() {
// *
// * Fetches top 24 hour trending coins at CoinGecko and displays it in 'trending coin' field.
// *
    // fetches trending coin data
    fetch("https://api.coingecko.com/api/v3/search/trending")
    .then(response => response.json())
    .then(trending_data => { 
        document.getElementById("trending_header").innerHTML = "Trending (24h)";
        document.getElementById("trending_coins").innerHTML = "";
        trending_data.coins.forEach((coin) => {
            // creates list with trending coins
            let trending_coin_button = document.createElement('button');
            trending_coin_button.innerHTML = coin.item.id;
            trending_coin_button.setAttribute("class", "btn btn-sm btn-info trending_coin_button");
            trending_coin_button.setAttribute("onClick", "coin_info('" + coin.item.id + "')");
            document.getElementById("trending_coins").append(trending_coin_button);
        })
    });
}


function trending_tweet_thread_generator() {
// *
// * Generates a pop-up field with information about the top trending coins in a specific layout to use for a Twitter thread.
// *
    // displays pop-up field
    document.getElementById("trending_tweets_thread_display").style.display = "block";
    // gets trending tweets
    fetch("https://api.coingecko.com/api/v3/search/trending")
    .then(response => response.json())
    .then(trending_data => { 
        let trending_coins_ticker = [];
        let trending_coins_twitter = [];
        document.getElementById('trending_tweets').innerHTML = "";

        // loops over each trending coin, gets data and creates element with the right layout
        var create_trending_coin_items = new Promise((resolve, reject) => {
            trending_data.coins.forEach((coin) => {
                fetch("https://api.coingecko.com/api/v3/coins/"+ coin.item.id +"?localization=true&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false")
                .then(response => response.json())
                .then(coin_data => {
                    trending_coins_ticker.push(coin_data.symbol);
                    trending_coins_twitter.push(coin_data.links.twitter_screen_name);

                    let coin_data_div  = document.createElement('div');
                    coin_data_div.setAttribute("class", "trending_coin_info");
                
                    coin_data_div.innerHTML = 
                    `<img class="trending_coins_image" src="`+ coin_data.image.large +`" ></img>
                    <h3 class="trending_coins_title"> #`+ coin_data.id.replace("-", "_") +`</h3>  
                    <p class="trending_coin_description">` + coin_data.description.en + `</p>
                    <p class="trending_coin_twitter">@` + coin_data.links.twitter_screen_name + `</p>
                    <p class="trending_coin_ticker">$` + coin_data.symbol + `</p>`
                    
                    // adds element to html
                    document.getElementById('trending_tweets').append(coin_data_div);

                    if (trending_coins_twitter.length == Object.keys(trending_data.coins).length) 
                    {
                        resolve();
                    }
                });
            });
        });
        // creates and adds 'trending coins overview' tweet
        create_trending_coin_items.then(() => {
            let overview_tweet_div  = document.createElement('div');
            overview_tweet_div.setAttribute("class", "trending_coin_info");
            overview_tweet_div.setAttribute("id", "overview_tweet_div");
            // creates element
            overview_tweet_div.innerHTML =
            `<img class="trending_coins_image" src="/static/images/CoinGecko_Logo.png" >
            <p>#CG_24h_Trending X Top 5 Trending at @CoinGecko</p>
            <p>Date: `+ new Date().toLocaleDateString() + `</p>
            <p id="overview_coin_names"> </p>
            <p id="overview_coin_tickers"> </p>`
            document.getElementById('trending_tweets').prepend(overview_tweet_div);
    
            let overview_coins_info = document.getElementById('overview_coin_names')
            for (i = 0; i < 7; i++) {
                overview_coins_info.innerHTML += 
                `- @` + trending_coins_twitter[i] + `<br>`
            };
            overview_coins_info.innerHTML += `1/6 <br>`;
            
            let overview_coin_tickers = document.getElementById('overview_coin_tickers')
            for (i = 0; i < 7; i++){
                overview_coin_tickers.innerHTML += `$` + trending_coins_ticker[i].toUpperCase()  + ` `
            };
        });
    });
}


function logged_in() {
// *
// * Sets fields to display and button settings if user is logged in.
// *
    // changes field display settings
    document.getElementById("display_settings").style.display = "block";
    document.getElementById("display_logout").style.display = "block";
    document.getElementById("display_login").style.display = "none"; 
    document.getElementById("user_portfolio_overview").hidden = false;
    // enables buttons
    buttons = document.querySelectorAll('.disabled_setting');
    buttons.forEach(function (i) {
        i.disabled = false;
    });
}


function logged_out() {
// *
// * Sets fields to display and button settings if user is logged out.
// *
    // changes field display settings
    document.getElementById("display_settings").style.display = "none"; 
    document.getElementById("display_logout").style.display = "none";
    document.getElementById("display_login").style.display = "block";
    document.getElementById("user_portfolio_overview").hidden = true;
    // disables buttons
    buttons = document.querySelectorAll('.disabled_setting');
    buttons.forEach(function (i) {
        i.disabled = true;
    });
}

function login() {
// *
// * Displays login field with form for the user to login.
// *
    // displays login field
    document.querySelector("#register_field").style.display = "none";
    document.querySelector("#login_field").style.display = "block";
}

function register() {
// *
// * Displays Register field with form for the user to register.
// *
    // displays register field
    document.querySelector("#login_field").style.display = "none";
    document.querySelector("#register_field").style.display = "block";
}

function settings() {
// *
// * Displays settings field with form for the user to change settings.
// *
    // displays settings field
    document.querySelector("#settings_field").style.display = "block";
}

function close_field() {
// *
// * Closes all opened pop-up fields.
// *
    // close all pop-up fields
    document.getElementById("login_field").style.display = "none";
    document.getElementById("register_field").style.display = "none";
    document.getElementById("addtrade_field").style.display = "none";
    document.getElementById("settings_field").style.display = "none";
    document.getElementById("trending_tweets_thread_display").style.display = "none";
}



// Code below based on:
// https://www.codevoila.com/post/30/export-json-data-to-downloadable-file-using-javascript
function download_trade_data() {
// *
// * Converts the user's trade data to CSV file to download.
// *
    // gets all keys of object
    let keys = Object.keys(trade_history_data[0]);

    // creates a string with all the keys; csv style
    let csv_headers = keys.join(",");
    
    // creates string to store csv data and adds headerstring
    let trade_csv_file = csv_headers + "\n";

    // loops over all items and values and adds to trade_csv_file; csv style.
    // add "\n" between items. 
    trade_history_data.forEach(item => {
        keys.forEach((key, index) => {
            if( (index > 0) && (index < keys.length-1) ) {
                trade_csv_file += ",";
            }
            trade_csv_file += item[key];
        });
        trade_csv_file += "\n";
    });

    // transforms string to URI data: utf-8 encoding
    // time,coin_name,amount,tradetype -> time%2Ccoin_name%2Camount%2Ctradetype%0A
    trade_csv_file = encodeURIComponent(trade_csv_file);
    
    // creates element for user to click to download csv data
    let download_link = document.createElement('a');
    download_link.innerHTML = "Download trade data";
    download_link.setAttribute('href', 'data:text/csv;charset=utf-8,'+ trade_csv_file);
    download_link.setAttribute('download', 'trade_data.csv');
    document.getElementById("settings_download_data").append(download_link);
}


function twitter_feed(twitter_handle) {
// *
// * Displays Twitter timeline of given twitter handle.
// *
// Embedded Twitter widget 
// source: https://developer.twitter.com/en/docs/twitter-for-websites/timelines/overview
    window.twttr = (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
          t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);
        t._e = [];
        t.ready = function(f) {
          t._e.push(f);
        };
        return t;
    }(document, "script", "twitter-wjs"));
   
    // adds twitter timeline to HTML
    twitter_channel = '<a class="twitter-timeline" href="https://twitter.com/' + twitter_handle + '?ref_src=twsrc%5Etfw">Tweets by ' + twitter_handle + '</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
    document.getElementById("twitter_channel").innerHTML = twitter_channel;

    // refreshes widget to get new coin data
    twttr.ready(
        function (twttr) {
            twttr.events.bind(
                'loaded',
                function () {
                    twttr.widgets.load (
                        document.getElementById("twitter_channel")
                    );
                }
            );
        }
    );
}




 