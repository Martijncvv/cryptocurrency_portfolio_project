document.addEventListener('DOMContentLoaded', function() {
    // search function
    document.querySelector('#submit_search').addEventListener('click', coin_info);
    // register button
    document.querySelector('#register').addEventListener('click', register);
    // add coin button
    document.querySelector('#add_trade').addEventListener('click', add_trade);

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
    const coin_name = document.querySelector('#search_value');
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
    coin_name.onkeyup = () => {
        if (coin_name.value.length > 0) {
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

    coin_info("bitcoin");
});


function coin_info(coin) {


    // GENERAL INFO FIELD
    // get value from searchbar if there is searchbar was used
    let coin_name = document.querySelector('#search_value');
    if (coin_name.value !== ""){
        coin = coin_name.value;
    }
    // Clear out input field:
    coin_name.value = "";
    // Disable the submit button again:
    submit_search.disabled = true;



    fetch("https://api.coingecko.com/api/v3/coins/" + coin + "?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false")
    .then(response => response.json())
    .then(data => {
        
    // PORTFOLIO










        // change "add portfolio" button if coin is in portfolio      
        let double_value = false;
        let portfolio_coin = document.querySelectorAll('.portfolio_coin');
        // loop over portfolio list
        portfolio_coin.forEach(function (coin_ticker_i) {
            if (coin_ticker_i.innerHTML == data.symbol) {
                double_value = true;

                




            }
        });
        // if coin found in list, change "add to portfolio button"  
        if (double_value) {
            document.getElementById("portfolio_button").innerHTML = "Delete from portfolio";

        }
        else {
            document.getElementById("portfolio_button").innerHTML = "Add to portfolio";
        }
        // set 'add portfolio' button value to currently opened coin
        document.getElementById("portfolio_button").setAttribute("value", data.symbol);
        // set 'add_note_button' value to currently opened coin
        document.getElementById("add_note_button").setAttribute("value", data.symbol);

        // set favicon image to currently opened coin
        document.getElementById("favicon").setAttribute("href", data.image.thumb);
        








        console.log(data)  // KANN WEG
        // Add data to elements
        document.title = data.name;
        document.getElementById("coin_info_name").innerHTML = data.name;
        document.getElementById("coin_info_ticker").innerHTML = data.symbol;
        document.getElementById("coin_info_price").innerHTML = data.market_data.current_price.usd;
        document.getElementById("coin_info_marketcap").innerHTML = data.market_data.market_cap.usd;
        document.getElementById("coin_info_atl").innerHTML = data.market_data.atl.usd + data.market_data.atl_date.usd;
        document.getElementById("coin_info_ath").innerHTML = data.market_data.ath.usd + data.market_data.ath_date.usd;
        document.getElementById("coin_info_description").innerHTML = data.description.en;

        // twitter_name = data.links.twitter_screen_name
        // // twitter_url = '<a href="https://twitter.com/intent/tweet?button_hashtag=' + twitter_name + '&ref_src=twsrc%5Etfw" class="twitter-hashtag-button" data-show-count="false">Tweet #' + twitter_name + '</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
        // twitter_url = '<a class="twitter-timeline" href="https://twitter.com/' + twitter_name + '?ref_src=twsrc%5Etfw">Tweets by ' + twitter_name + '</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
        // // TWITTER
        
        // document.getElementById("twitter_channel").innerHTML = twitter_url;
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
    // get coin name and set name in addcoin header
    coin_name = document.getElementById('coin_info_name').innerHTML;
    coin_ticker = document.getElementById('coin_info_ticker').innerHTML;
    coin_price = document.getElementById('coin_info_price').innerHTML;

    document.getElementById("addtrade_header").innerHTML = coin_name;
    document.getElementById("addtrade_input_ticker").value = coin_ticker;
    document.getElementById("addtrade_input_price").value = coin_price;

    // element.setAttribute(attributeName, attributeValue)
    document.querySelector("#addtrade_field").style.display = "block";
}