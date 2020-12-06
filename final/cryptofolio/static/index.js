document.addEventListener('DOMContentLoaded', function() {
    // search function
    document.querySelector('#submit_search').addEventListener('click', coin_info);
    // register button
    document.querySelector('#register').addEventListener('click', register);
    // add coin button
    document.querySelector('#add_trade').addEventListener('click', add_trade);
    // portfolio list
    
    
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
    // search field
    const submit_search = document.querySelector('#submit_search');
    const coin_name_search = document.querySelector('#search_value');
    // login field
    const login_password_field = document.querySelector('#login_password_field');
    const login_field_button = document.querySelector('#login_field_button');
    // register field
    const register_password_field = document.querySelector('#register_password_field');
    const register_field_button = document.querySelector('#register_field_button');
    
    // Disable submit buttons
    submit_search.disabled = true;
    login_field_button.disabled = true;
    register_field_button.disabled = true;

    // Listen for input to be typed into coinsearch input field
    coin_name_search.onkeyup = () => {
        if (coin_name_search.value.length > 0) {
            submit_search.disabled = false;
        }
        else {
            submit_search.disabled = true;
        }
    }
    // Listen for input to be typed into login input field
    login_password_field.onkeyup = () => {
        if (login_password_field.value.length > 0) {
            login_field_button.disabled = false;
        }
        else {
            login_field_button.disabled = true;
        }
    }
     // Listen for input to be typed into register input field
     register_password_field.onkeyup = () => {
        if (register_password_field.value.length > 0) {
            register_field_button.disabled = false;
        }
        else {
            register_field_button.disabled = true;
        }
    }


    coin_page_name = document.getElementById('coin_page_name').innerHTML;
    coin_info(coin_page_name);
    // location.reload();
});

function coin_info(coin) {
    // GENERAL INFO FIELD
    // get value from searchbar if the searchbar was used
    let coin_name_search = document.querySelector('#search_value');
    if (coin_name_search.value !== ""){
        coin = coin_name_search.value;
    }
    // Clear out input field:
    coin_name_search.value = "";
    // Disable the submit button again:
    submit_search.disabled = true;


    fetch("https://api.coingecko.com/api/v3/coins/"+ coin.toLowerCase() +"?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false")
    .then(response => response.json())
    .then(data => {
    // PORTFOLIO
        // change "add portfolio" button if coin is in portfolio      
        let coin_in_portfolio = false;
        let portfolio_coin = document.querySelectorAll('.portfolio_coin');
        // loop over portfolio list
        portfolio_coin.forEach(function (coin_name_i) {
            if (coin_name_i.innerHTML == data.id) {
                coin_in_portfolio = true;
            }
        });
        // if coin found in list, change "add to portfolio button"  
        if (coin_in_portfolio) {
            document.getElementById("portfolio_button").innerHTML = "Delete from portfolio";

        }
        else {
            document.getElementById("portfolio_button").innerHTML = "Add to portfolio";
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
        document.getElementById("coin_image").setAttribute("src", data.image.small );


        console.log(data)  // KANN WEG

        // Add data to General Info elements
        document.title = data.name;
        document.getElementById("coin_info_name").innerHTML = data.id;
        document.getElementById("coin_info_ticker").innerHTML = data.symbol;
        document.getElementById("coin_info_price").innerHTML = data.market_data.current_price.usd;
        document.getElementById("coin_info_marketcap").innerHTML = data.market_data.market_cap.usd;
        document.getElementById("coin_info_atl").innerHTML = data.market_data.atl.usd + data.market_data.atl_date.usd;
        document.getElementById("coin_info_ath").innerHTML = data.market_data.ath.usd + data.market_data.ath_date.usd;
        document.getElementById("coin_info_description").innerHTML = data.description.en;
        
        // Add note to note field
        let coin_note = document.getElementById(data.id).innerHTML;
        document.getElementById("coin_note_field").innerHTML = coin_note;

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

            // API doesn't return values in the same order as the given list; add the right coin value at the right line in portfolio overview
            document.querySelector(".portfolio_price_list").innerHTML = "";
            portfolio_coins.forEach(function (coin_name) {
                for (const [key, value] of Object.entries(data)) {
                    console.log(coin_name.innerHTML);
                    console.log(value);

                    if (coin_name.innerHTML == key) {
                        let li_coin_price  = document.createElement('li');
                        li_coin_price.innerHTML = value.usd;
                        li_coin_price.setAttribute("class", "portfolio_coin_price");
                        document.querySelector('.portfolio_price_list').append(li_coin_price);
                    }
                }
            });  
            total_coin_values()  
        })
        // Add Twitter Timeline
        twitter_handle = data.links.twitter_screen_name;
        twitter_feed(twitter_handle)
    });
}


function login() {
    document.querySelector("#register_field").style.display = "none";
    document.querySelector("#login_field").style.display = "block";
}
function register() {
    document.querySelector("#login_field").style.display = "none";
    document.querySelector("#register_field").style.display = "block";
}

function close_field() {
    document.querySelector("#login_field").style.display = "none";
    document.querySelector("#register_field").style.display = "none";
    document.querySelector("#addtrade_field").style.display = "none";
}

function add_trade() {
    // get coin name and set name in "add trade field"
    coin_name = document.getElementById('coin_info_name').innerHTML;
    coin_price = document.getElementById('coin_info_price').innerHTML;

    document.getElementById("addtrade_header").innerHTML = coin_name;
    document.getElementById("addtrade_input_name").value = coin_name;
    document.getElementById("addtrade_input_price").value = coin_price;

    // element.setAttribute(attributeName, attributeValue)
    document.querySelector("#addtrade_field").style.display = "block";
}


function twitter_feed(twitter_handle) {
    twitter_channel = '<a class="twitter-timeline" href="https://twitter.com/' + twitter_handle + '?ref_src=twsrc%5Etfw">Tweets by ' + twitter_handle + '</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
    document.getElementById("twitter_channel").innerHTML = twitter_channel;

    twttr.widgets.load(
        document.getElementById("twitter_channel")
    );
}


function total_coin_values() {
    document.querySelector(".portfolio_total_value_list").innerHTML = "";

    // get values from portfolio
    portfolio_coin_prices = document.querySelectorAll('.portfolio_coin_price');
    portfolio_coin_amounts = document.querySelectorAll('.portfolio_coin_amount');
    total_value_list = []
    total_portfolio_value = 0;

    // calculate total values of specific coin
    for (i = 0; i < portfolio_coin_prices.length; i++) {
        total_value = parseFloat(portfolio_coin_prices[i].innerHTML) * parseFloat(portfolio_coin_amounts[i].innerHTML);
        total_value_list.push(total_value);

        // calculate total portfolio value
        total_portfolio_value = total_portfolio_value + total_value;
    }
    document.getElementById("test33").innerHTML = total_portfolio_value

    total_value_list.forEach(function (value) {
        let li_total_value  = document.createElement('li');
        li_total_value.innerHTML = value;
        
        li_total_value.setAttribute("class", "portfolio_coin_total_value");
        document.querySelector('.portfolio_total_value_list').append(li_total_value);

    });
}

