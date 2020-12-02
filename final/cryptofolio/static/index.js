document.addEventListener('DOMContentLoaded', function() {
    // search function
    document.querySelector('#submit_search').addEventListener('click', general_info);
   
    // register button
    document.querySelector('#register').addEventListener('click', register);

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

    // Select the submit button and input to be used later
    const submit_search = document.querySelector('#submit_search');
    const coin_name = document.querySelector('#search_value');
    // Disable submit button by default:
    submit_search.disabled = true;
    // Listen for input to be typed into the input field
    coin_name.onkeyup = () => {
        if (coin_name.value.length > 0) {
            submit_search.disabled = false;
        }
        else {
            submit_search.disabled = true;
        }
    }

    general_info("bitcoin");

});


function general_info(coin) {
    // get value from form
    let coin_name = document.querySelector('#search_value');
    if (coin_name.value !== ""){
        coin = coin_name.value;
    }
    
    // Create a list item
    let li = document.createElement('li');
    li.innerHTML = coin;

    // Add new element to our unordered list:
    document.querySelector('#coin_list').append(li);

    // Clear out input field:
    coin_name.value = '';

    // Disable the submit button again:
    submit_search.disabled = true;

   
    fetch("https://api.coingecko.com/api/v3/coins/" + coin + "?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false")
    .then(response => response.json())
    .then(data => {
        
        console.log(data)  // KANN WEG
        // Add data to elements
        
        document.getElementById("coin_info_name").innerHTML = "Name: " + data.name;
        document.getElementById("coin_info_ticker").innerHTML = "Ticker: $" + data.symbol;
        document.getElementById("coin_info_price").innerHTML = "Price: $" + data.market_data.current_price.usd;
        document.getElementById("coin_info_marketcap").innerHTML = "Market cap: $" + data.market_data.market_cap.usd;
        document.getElementById("coin_info_atl").innerHTML = "ATL: " + data.market_data.atl.usd + "   Date: " + data.market_data.atl_date.usd;
        document.getElementById("coin_info_ath").innerHTML = "ATH: " + data.market_data.ath.usd + "   Date: " + data.market_data.ath_date.usd;

    });
}

function login() {
    document.querySelector("#registerfield").style.display = "none";
    document.querySelector("#loginfield").style.display = "block";
}
function register() {
    document.querySelector("#loginfield").style.display = "none";
    document.querySelector("#registerfield").style.display = "block";
}

function close_field() {
    document.querySelector("#loginfield").style.display = "none";
    document.querySelector("#registerfield").style.display = "none";
}