document.addEventListener('DOMContentLoaded', function() {    
    // register button
    document.querySelector('#register').addEventListener('click', register);
    // add coin button
    document.querySelector('#add_trade').addEventListener('click', add_trade);
    // explore button
    document.querySelector('#explore').addEventListener('click', random_coin);
    // settings button
    document.querySelector('#settings').addEventListener('click', settings);

    // search function
    document.querySelector('#submit_search').addEventListener('click', function() {     
        // get value from searchbar
        let coin_name_search = document.querySelector('#search_value');
        if (coin_name_search.value !== ""){
            coin_info(coin_name_search.value);
            coin_name_search.value = ""
        }
        
    });

     // Add eventListeners to login classes
    let login_button = document.querySelectorAll('.login');
    login_button.forEach(function (i) {
        i.addEventListener('click',  login) 
      });

    // Add eventListeners to close_field classes
    let close_field_button =  document.querySelectorAll('.close_field');
    close_field_button.forEach(function (i) {
        i.addEventListener('click',  close_field) 
      });

    // Select the submit buttons and inputs to be used later
    // // search field
    // const submit_search = document.querySelector('#submit_search');
    // const coin_name_search = document.querySelector('#search_value');
    // login field
    const login_password_field = document.querySelector('#login_password_field');
    const login_field_button = document.querySelector('#login_field_button');
    // register field
    const register_password_field = document.querySelector('#register_password_field');
    const register_field_button = document.querySelector('#register_field_button');
    
    // disable submit buttons
    // submit_search.disabled = true; 
    login_field_button.disabled = true;
    register_field_button.disabled = true;

    // // listen for input to be typed into coinsearch input field
    // coin_name_search.onkeyup = () => {
    //     if (coin_name_search.value.length > 0) {
    //         submit_search.disabled = false;
    //     }
    //     else {
    //         submit_search.disabled = true;
    //     }
    // }
    // listen for input to be typed into login input field
    login_password_field.onkeyup = () => {
        if (login_password_field.value.length > 0) {
            login_field_button.disabled = false;
        }
        else {
            login_field_button.disabled = true;
        }
    }
     // listen for input to be typed into register input field
     register_password_field.onkeyup = () => {
        if (register_password_field.value.length > 0) {
            register_field_button.disabled = false;
        }
        else {
            register_field_button.disabled = true;
        }
    }
    
    // get portfolio info and show fields if user is signed in
    if (user_signed_in) {
        logged_in()
        // draw portfolio history chart
        portfolio_history_chart(7);
        // load trade history
        trade_history()
    }
    else {
        logged_out()
    }

    // search_bar settings
    search_bar();

    // set prefered language
    document.getElementById("current_language").innerHTML = "Current language: " + language_preference_data;

    // load all coin info
    coin_page_name = document.getElementById('coin_page_name').innerHTML;
    coin_info(coin_page_name);

    load_portfolio();
});






function load_portfolio() {
    console.log(user_portfolio_data);
}











function search_bar() {
    coin_names = []
    fetch("https://api.coingecko.com/api/v3/coins/list")
    .then(response => response.json())
    .then(coin_list => { 
        coin_list.forEach((coin) => {
            coin_names.push(coin.id)
        });
    });
     // search field
     const submit_search = document.querySelector('#submit_search');
     const coin_name_search = document.querySelector('#search_value');

    // listen for input to be typed into coinsearch input field
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


function coin_info(coin) {
    // display trending coins
    trending_coins();
    
    document.querySelector('#search_value').value = "";
    // disable the submit button:
    submit_search.disabled = true;
    // fetch coin data
    fetch("https://api.coingecko.com/api/v3/coins/"+ coin.toLowerCase() +"?localization=true&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false")
    .then(response => response.json())
    .then(data => {
        // check if coin exists
        if ("error" in data) {
            document.getElementById('search_error').innerHTML = data.error;
            return;
        }
        document.getElementById('search_error').innerHTML = "";
    // PORTFOLIO
        // change "add portfolio" button if coin is in portfolio      
        let coin_in_portfolio = false;
        let portfolio_coin = document.querySelectorAll('.portfolio_coin');
        // loop over portfolio list
        portfolio_coin.forEach(function (coin_name) {
            if (coin_name.innerHTML == data.id) {
                coin_in_portfolio = true;
            }
        });
        // if coin found in list, change "add to portfolio button"  
        if (coin_in_portfolio) {
            document.getElementById("portfolio_button").innerHTML = "Remove";
            document.getElementById("portfolio_button").setAttribute("class", "btn btn-sm btn-outline-info");
        }
        else {
            document.getElementById("portfolio_button").innerHTML = "Add to portfolio";
            document.getElementById("portfolio_button").setAttribute("class", "btn btn-sm btn-info");
        }

        // set 'add portfolio' button value to currently opened coin
        document.getElementById("portfolio_button").setAttribute("value", data.id);
        // set 'add_note_button' value attribute to currently opened coin
        document.getElementById("add_note_button").setAttribute("value", data.id);
        // set 'delete_note_button' value attribute to currently opened coin
        document.getElementById("delete_note_button").setAttribute("value", data.id);
        
        // set favicon image to currently opened coin
        document.getElementById("favicon").setAttribute("href", data.image.thumb);
        // set coin logo to currently opened coin       
        document.getElementById("coin_image").setAttribute("src", data.image.large );

        // Add data to General Info elements
        console.log(data.links.homepage[0])
        document.title = data.name;
        document.getElementById("coin_page_name").innerHTML = data.id;
        document.getElementById("coin_info_name").innerHTML = `<a href="` + data.links.homepage[0] + `" target="_blank">` + data.id + `</a>`;
        document.getElementById("coin_info_ticker").innerHTML = data.symbol;
        document.getElementById("coin_info_price").innerHTML = "$" + data.market_data.current_price.usd.toLocaleString();
        document.getElementById("coin_info_marketcap").innerHTML = "$" + data.market_data.market_cap.usd.toLocaleString();
        document.getElementById("coin_info_atl").innerHTML = "$" + data.market_data.atl.usd.toLocaleString();  
        document.getElementById("coin_info_ath").innerHTML = "$" + data.market_data.ath.usd.toLocaleString();
        document.getElementById("coin_info_atl_date").innerHTML = "(" + data.market_data.atl_date.usd.split('T')[0] + ")";
        document.getElementById("coin_info_ath_date").innerHTML = "(" + data.market_data.ath_date.usd.split('T')[0] + ")";
        
        
        // get prefered language from DB and check if description is available
        if (data.description[language_preference_data] != "") {
            document.getElementById("coin_info_description").innerHTML = data.description[language_preference_data];
        }
        else if (data.description.en != "") {
            document.getElementById("coin_info_description").innerHTML = data.description.en;
        }
        else {
            document.getElementById("coin_info_description").innerHTML = "No description available.";
        }

        // Add note to note field if note exists, else remove 'delete button'
        if (notes_data[data.id] == null) {
            document.getElementById("coin_note_field").innerHTML = "Write a note about " + data.name + ".";
            document.getElementById("delete_note_button").style.display = "none"; 
            
        }
        else {
            document.getElementById("coin_note_field").innerHTML = notes_data[data.id];
            document.getElementById("delete_note_button").style.display = "block"; 
        }

        // Get current coin prices
        // Add prices to portfolio overview table
        document.querySelector(".portfolio_price_list").innerHTML = "";
        let portfolio_coins = document.querySelectorAll('.portfolio_coin');

        // Create list with portfolio coins to use as API input
        let portfolio_coins_list = []
        portfolio_coins.forEach(function (coin_name) {
            portfolio_coins_list.push(coin_name.innerHTML);
        });
        portfolio_coins_string = portfolio_coins_list.join('%2C')

        fetch("https://api.coingecko.com/api/v3/simple/price?ids=" + portfolio_coins_string + "&vs_currencies=usd")
        .then(response => response.json())
        .then(data => {
            let counter = 0;
            // API doesn't return values in the same order as the given list; add the right coin value at the right line in portfolio overview
            document.querySelector(".portfolio_price_list").innerHTML = "";
            portfolio_coins.forEach(function (coin_name) {
                for (const [key, value] of Object.entries(data)) {
                    if (coin_name.innerHTML == key) {
                        let li_coin_price  = document.createElement('li');
                        li_coin_price.innerHTML = value.usd;
                        li_coin_price.setAttribute("class", "portfolio_coin_price");
                        document.querySelector('.portfolio_price_list').append(li_coin_price);
                    }
                }
                // if forEach loop finished, run total_coin_values function
                counter += 1;
                if (portfolio_coins.length == counter) {
                    total_coin_values()  
                } 
            });  
        })
        // Add Twitter Timeline
        twitter_feed(data.links.twitter_screen_name)

        // draw coin chart
        coin_chart(coin.toLowerCase(), 7);
    });
    
}

function logged_in() {
    document.getElementById("display_settings").style.display = "block";
    document.getElementById("display_logout").style.display = "block";
    document.getElementById("user_portfolio_overview").hidden = false;
    document.getElementById("display_login").style.display = "none"; 
    // enable buttons
    document.getElementById("add_trade").disabled = false;
    document.getElementById("portfolio_button").disabled = false;
    document.getElementById("add_note_button").disabled = false;
    document.getElementById("delete_note_button").disabled = false;
}

function logged_out() {
    document.getElementById("display_settings").style.display = "none"; 
    document.getElementById("display_logout").style.display = "none";
    document.getElementById("user_portfolio_overview").hidden = true;
    document.getElementById("display_login").style.display = "block";
    // disable buttons
    document.getElementById("add_trade").disabled = true;
    document.getElementById("portfolio_button").disabled = true;
    document.getElementById("add_note_button").disabled = true;
    document.getElementById("delete_note_button").disabled = true;
}

function login() {
    document.querySelector("#register_field").style.display = "none";
    document.querySelector("#login_field").style.display = "block";
}
function register() {
    document.querySelector("#login_field").style.display = "none";
    document.querySelector("#register_field").style.display = "block";
}

function settings() {
    document.querySelector("#settings_field").style.display = "block";
}

function close_field() {
    document.getElementById("login_field").style.display = "none";
    document.getElementById("register_field").style.display = "none";
    document.getElementById("addtrade_field").style.display = "none";
    document.getElementById("settings_field").style.display = "none";
    document.getElementById("trending_tweets_thread_display").style.display = "none";
}

function add_trade() {
    // get coin name and set name in "add trade field"
    coin_name = document.getElementById('coin_page_name').innerHTML;
    coin_price_LocaleString = document.getElementById('coin_info_price').innerHTML;
    // convert LocaleString price to decimal price
    coin_price = coin_price_LocaleString.replace(".","").replace(",", '.').replace("$", '');

    document.getElementById("addtrade_header").innerHTML = coin_name;
    document.getElementById("addtrade_input_name").value = coin_name;
    document.getElementById("addtrade_input_price").value = coin_price;

    // element.setAttribute(attributeName, attributeValue)
    document.querySelector("#addtrade_field").style.display = "block";
}


function trade_history() {
    // display number of trades in 'portfolio info'
    document.getElementById("total_nr_trades").innerHTML = "Number of trades: " + trade_history_data.length;

    document.getElementById("trade_history_delete_buttons").innerHTML = "";

    // loop over the trade history array in reversed order
    trade_history_data.slice().reverse().forEach(function (trade) {
        // add trade history coin name
        let li_coin_name  = document.createElement('li');
        li_coin_name.innerHTML = trade.coin_name;
        li_coin_name.setAttribute("class", "trade_history_overview_data");

        // check if 'buy' or 'sell' trade and change styling
        if (trade.tradetype == "BUY") {
            li_coin_name.setAttribute("style", "color: green;");
        }
        else {
            li_coin_name.setAttribute("style", "color: red;");
        }
        document.getElementById("trade_history_coin_name").append(li_coin_name);
     
        // add trade history price
         let li_price  = document.createElement('li');
         li_price.innerHTML = trade.price;
         li_price.setAttribute("class", "trade_history_overview_data");
         document.getElementById("trade_history_price").append(li_price);

        // add trade history amount
        let li_amount  = document.createElement('li');
        li_amount.innerHTML = trade.amount;
        li_amount.setAttribute("class", "trade_history_overview_data");
        document.getElementById("trade_history_amount").append(li_amount);

        // add trade history time
        let li_time  = document.createElement('li');
        li_time.innerHTML = new Date(trade.time).toLocaleDateString("en-US")
        li_time.setAttribute("class", "trade_history_overview_data");
        document.getElementById("trade_history_time").append(li_time);


        // add delete_trade button
        // get csrf token
        csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        // create form 
        let delete_trade_form = document.createElement('form');
        delete_trade_form.setAttribute("action", "/");
        delete_trade_form.setAttribute("method", "POST");
        delete_trade_form.setAttribute("class", "d-flex flex-column justify-content-center align-items-center delete_trade_form");
        delete_trade_form.setAttribute("id", "delete_trade_form_" + trade.id);
        document.getElementById("trade_history_delete_buttons").append(delete_trade_form);
        // add csrf token to form
        let csrf_token = document.createElement('input');
        csrf_token.type = 'hidden';
        csrf_token.name = 'csrfmiddlewaretoken';
        csrf_token.value = csrftoken;
        document.getElementById("delete_trade_form_" + trade.id).append(csrf_token);
        // add button to form
        let delete_trade_button = document.createElement('button');
        delete_trade_button.setAttribute("class", "btn btn-sm btn-outline-danger");
        delete_trade_button.setAttribute("id", "delete_trade_button_" + trade.id);
        delete_trade_button.setAttribute("name", "delete_trade_id");
        delete_trade_button.setAttribute("value", trade.id);
        document.getElementById("delete_trade_form_" + trade.id).append(delete_trade_button);
    })
}

function total_coin_values() {
    document.querySelector(".portfolio_total_value_list").innerHTML = "";

    // get values from portfolio
    portfolio_coin_prices = document.querySelectorAll('.portfolio_coin_price');
    portfolio_coin_amounts = document.querySelectorAll('.portfolio_coin_amount');
    total_value_list = []
    total_portfolio_value = 0;

    // add 'number of coins in portfolio' to portfolio info
    document.getElementById("portfolio_nr_coins").innerHTML = "Number of coins: " + portfolio_coin_prices.length;

    // calculate total values of specific coin
    for (i = 0; i < portfolio_coin_prices.length; i++) {
        total_value = parseFloat(portfolio_coin_prices[i].innerHTML) * parseFloat(portfolio_coin_amounts[i].innerHTML);
        total_value_list.push(total_value);

        // calculate total portfolio value
        total_portfolio_value = total_portfolio_value + total_value;
    }
    
    // add total coin values to html
    total_value_list.forEach(function (value) {
        let li_total_value  = document.createElement('li');
        li_total_value.innerHTML = value.toLocaleString();
        
        li_total_value.setAttribute("class", "portfolio_coin_total_value");
        document.querySelector('.portfolio_total_value_list').append(li_total_value);
    });
    // add total portfolio value to html
    document.getElementById("total_portfolio_value").innerHTML = "Total value: $" + total_portfolio_value.toLocaleString();
}

function trending_coins() {
    fetch("https://api.coingecko.com/api/v3/search/trending")
    .then(response => response.json())
    .then(trending_data => { 

        document.getElementById("trending_coins").innerHTML = "";
        trending_data.coins.forEach((coin) => {

            // add trending coin link
            let trending_coin_button = document.createElement('button');
            trending_coin_button.innerHTML = coin.item.id;
            trending_coin_button.setAttribute("class", "btn btn-sm btn-info trending_coin_button");
           
            trending_coin_button.setAttribute("onClick", "coin_info('" + coin.item.id + "')");
            document.getElementById("trending_coins").append(trending_coin_button);
        })
    });
}


function trending_tweet_thread_generator() {
    document.getElementById("trending_tweets_thread_display").style.display = "block";
    // get trending tweets
    fetch("https://api.coingecko.com/api/v3/search/trending")
    .then(response => response.json())
    .then(trending_data => { 
        
        let trending_coins_ticker = [];
        let trending_coins_twitter = [];
        document.getElementById('trending_tweets').innerHTML = "";

        // loop over each trending coin, get data and create element
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

                    // coin_data_div.setAttribute("class", "portfolio_coin_total_value");
                    document.getElementById('trending_tweets').append(coin_data_div);

                    if (trending_coins_twitter.length == Object.keys(trending_data.coins).length) 
                    {
                        resolve();
                    }
                });
            });
        });

        create_trending_coin_items.then(() => {
            let overview_tweet_div  = document.createElement('div');
            overview_tweet_div.setAttribute("class", "trending_coin_info");
            overview_tweet_div.setAttribute("id", "overview_tweet_div");
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
                overview_coin_tickers.innerHTML += `$` + trending_coins_ticker[i] + ` `
            };
        });
    });
    


}


function random_coin() {
    fetch("https://api.coingecko.com/api/v3/coins/list")
    .then(response => response.json())
    .then(coin_list => { 
        let random_coin = coin_list[Math.floor(Math.random() * coin_list.length)];
        coin_info(random_coin.id);
    })
}

function coin_chart(coin_name, time_frame) {
    // set coin value chart timeframe header
    if (time_frame == 1) {
        document.getElementById("coin_chart_timeframe_header").innerHTML = "Timeframe: " + time_frame + " day"
    }
    else if (time_frame == 365) {
        document.getElementById("coin_chart_timeframe_header").innerHTML = "Timeframe: 1 year";
    }
    else if (time_frame == "max") {
        document.getElementById("coin_chart_timeframe_header").innerHTML = "Timeframe: max available days";
    }
    else {
        document.getElementById("coin_chart_timeframe_header").innerHTML = "Timeframe: " + time_frame + " days"
    }

    // get chart data
    console.log(coin_name);
    fetch("https://api.coingecko.com/api/v3/coins/" + coin_name + "/market_chart?vs_currency=usd&days=" + time_frame)
        .then(response => response.json())
        .then(chart_data => {
            // create an empty array to store the paired data
            price_data_array = [];
         
            // create dictionaries with pairs and add to array
            chart_data.prices.forEach(function (price_data) {
                let price_data_dict = {};
                price_data_dict["time"] = price_data[0];
                price_data_dict["value"] = price_data[1];
                price_data_array.push(price_data_dict);
            });

            // create coin graph
            document.getElementById("coin_chart").innerHTML = "";
            // Morris Chart explanation source:
            // https://morrisjs.github.io/morris.js/
            new Morris.Area({
            // cariables of the chart
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
        
         // create coin chart timeframe buttons
        document.getElementById("coin_chart_timeframe_buttons").innerHTML = "";
        const timeframes = [1, 3, 7, 30, 365, "max"];
        timeframes.forEach((tf) => {
            let coin_chart_timeframe_button = document.createElement('button');
            coin_chart_timeframe_button.innerHTML = tf;
            coin_chart_timeframe_button.setAttribute("id", "coin_chart_timeframe_button_" + tf);
            coin_chart_timeframe_button.setAttribute("class", "btn btn-info coin_chart_timeframe_button");
            
            coin_chart_timeframe_button.setAttribute("onClick", "coin_chart('"+ coin_name + "'" +","+"'"+ tf +"')");
            document.getElementById("coin_chart_timeframe_buttons").append(coin_chart_timeframe_button);
        });
        // change active button design
        document.getElementById("coin_chart_timeframe_button_" + time_frame).setAttribute("class", "btn btn-info coin_chart_timeframe_button active");
}

function portfolio_history_chart(time_frame) {   
    // create array to store dictionaries with portfolio_value:timestamp data
    portfolio_total_value_timestamp_array = [];

    // get all unique coin names of all trades made by the user
    let unique_coins = [];
    trade_history_data.forEach(function (trade) {
        if (!unique_coins.includes(trade.coin_name)) {
            unique_coins.push(trade.coin_name);
        }
    });
    // hide chart field if no history available
    if (unique_coins.length == 0) {
        document.getElementById("portfolio_chart_data").hidden = true;
        return;
    } 
    else {
        document.getElementById("portfolio_chart_data").hidden = false;
    }

    // get historic chart data of all unique coins
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

    // wait for the forEach loop to finish fetching chart data
    get_chart_data.then(() => {
        // create array with timestamps of a fetched chart
        let chart_timestamp_array = [];
        (coins_chart_data_object[Object.keys(coins_chart_data_object)[0]].prices).forEach((timestamp) => {
            chart_timestamp_array.push(timestamp[0]);
        })

        // loop over timestamps
        timestamp_index = 0;
        chart_timestamp_array.forEach((timestamp) => { 
            
            
            // create dictionary; key/value = coin/amount
            coin_holdings_dict = {};
            unique_coins.forEach((coin) => {
                coin_holdings_dict[[coin]] = 0;
            })

            // loop over trade history data and change holdings if trade was added before timestamp
            trade_history_data.forEach(function (trade) {
                // if trade_timestamp < chart_timestamp, change 'coin holding value'
                if (trade.time < timestamp) {
                    // check if buy or sell order and change 'coin holdings value'
                    if (trade.tradetype == "BUY") {
                        coin_holdings_dict[trade.coin_name] += trade.amount;    
                    }
                    else {
                        coin_holdings_dict[trade.coin_name] -= trade.amount;
                    }
                }
            });
            // loop over every unique coin, get price at timestamp and add to portfolio
            portolio_value_at_timestamp = 0;
            for (let i = 0; i < unique_coins.length; i += 1 ) {

                // get coin price at timestamp if timestamp exists in 'chart history object'
                if (coins_chart_data_object[unique_coins[i]].prices[timestamp_index] != null)
                {
                    // get coin price at timestamp
                    coin_price_at_timestamp = coins_chart_data_object[unique_coins[i]].prices[timestamp_index][1];
                
                    // add 'coin price at timestamp * the amount in portfolio at timestamp' to 'total portfolio value'
                    portolio_value_at_timestamp += (coin_price_at_timestamp * coin_holdings_dict[unique_coins[i]])  
                }
            }
             // create dictionaries with time/portfolio_value pairs and add to portfolio_timestamp array
            let price_data_dict = {};
            
            price_data_dict["time"] = timestamp;
            price_data_dict["value"] = portolio_value_at_timestamp;
            portfolio_total_value_timestamp_array.push(price_data_dict);
            timestamp_index += 1;
        });

        // draw graph on website
        document.getElementById("portfolio_chart").innerHTML = "";
      
        new Morris.Area({
        // settings of the chart
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
      // create portfolio chart timeframe buttons
    document.getElementById("portfolio_chart_timeframe_buttons").innerHTML = "";
    const timeframes = [1, 3, 7, 30, 365];
    timeframes.forEach((tf) => {
        let coin_chart_timeframe_button = document.createElement('button');
        coin_chart_timeframe_button.innerHTML = tf;
        coin_chart_timeframe_button.setAttribute("id", "portfolio_chart_timeframe_button_" + tf);
        coin_chart_timeframe_button.setAttribute("class", "btn btn-sm btn-info portfolio_chart_timeframe_button");
        
        coin_chart_timeframe_button.setAttribute("onClick", "portfolio_history_chart('" + tf +"')");
        document.getElementById("portfolio_chart_timeframe_buttons").append(coin_chart_timeframe_button);
    });
    // change active button design
    document.getElementById("portfolio_chart_timeframe_button_" + time_frame).setAttribute("class", "btn btn-info portfolio_chart_timeframe_button active");
}


///////////////////
// Code based on:
// https://www.codevoila.com/post/30/export-json-data-to-downloadable-file-using-javascript
function download_trade_data() {

    // get all keys of object
    let keys = Object.keys(trade_history_data[0]);
    
    // create string to store csv data
    let csv_headers = keys.join(",");
    let trade_csv_file = csv_headers + "\n";

    // loop over all items and values and add to trade_csv_file with a "," in between values.
    // add "\n" between items
    trade_history_data.forEach(item => {
        keys.forEach((key, index) => {
            if( (index > 0) && (index < keys.length-1) ) {
                trade_csv_file += ",";
            }
            trade_csv_file += item[key];
        });
        trade_csv_file += "\n";
    });

    // transform string to URI data: utf-8 encoding
    // time,coin_name,amount,tradetype -> time%2Ccoin_name%2Camount%2Ctradetype%0A
    trade_csv_file = encodeURIComponent(trade_csv_file);
    
    // create element to download csv data
    let download_link = document.createElement('a');
    download_link.innerHTML = "Download trade data";
    download_link.setAttribute('href', 'data:text/csv;charset=utf-8,'+ trade_csv_file);
    download_link.setAttribute('download', 'trade_data.csv');

    document.getElementById("settings_download_data").append(download_link);
}
//////////////////

function twitter_feed(twitter_handle) {
    // TWITTER WIDGET SCRIPT OPEN
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
   

    // add twitter timeline to HTML
    twitter_channel = '<a class="twitter-timeline" href="https://twitter.com/' + twitter_handle + '?ref_src=twsrc%5Etfw">Tweets by ' + twitter_handle + '</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
    document.getElementById("twitter_channel").innerHTML = twitter_channel;

    // refresh widget to get new coin data
    twttr.ready(
        function (twttr) {
            twttr.events.bind(
                'loaded',
                function (event) {
                  event.widgets.forEach(function () {
                  });
                    twttr.widgets.load(
                        document.getElementById("twitter_channel")
                    );
                }
              );
        }
      );
}
 // TWITTER WIDGET SCRIPT CLOSE



 