document.addEventListener('DOMContentLoaded', function() {


// Select the submit button and input to be used later
const submit = document.querySelector('#submit');
const coin_name = document.querySelector('#search_value');

// Disable submit button by default:
submit.disabled = true;

// Listen for input to be typed into the input field
coin_name.onkeyup = () => {
    if (coin_name.value.length > 0) {
        submit.disabled = false;
    }
    else {
        submit.disabled = true;
    }
}

// Listen for submission of form
document.querySelector('form').onsubmit = () => {

    // Find the task the user just submitted
    const coin = coin_name.value;

    // Create a list item for the new task and add the task to it
    let li = document.createElement('li');
    li.innerHTML = coin;

    // Add new element to our unordered list:
    document.querySelector('#coin_list').append(li);

    // Clear out input field:
    coin_name.value = '';

    // Disable the submit button again:
    submit.disabled = true;

    // Stop form from submitting
   

    fetch("https://api.coingecko.com/api/v3/coins/" + coin + "?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false")
    .then(response => response.json())
    .then(data => {
        
        console.log(data)
      
        document.getElementById("coin_info_name").innerHTML = "Name: " + data.name;
        document.getElementById("coin_info_ticker").innerHTML = "Ticker: " + data.symbol;
        document.getElementById("coin_info_price").innerHTML = "Price: " + data.market_data.current_price.usd;
        document.getElementById("coin_info_marketcap").innerHTML = "Market cap: " + data.market_data.market_cap.usd;
        document.getElementById("coin_info_atl").innerHTML = "ATL: " + data.market_data.atl.usd + "   Date: " + data.market_data.atl_date.usd;
        document.getElementById("coin_info_ath").innerHTML = "ATH: " + data.market_data.ath.usd + "   Date: " + data.market_data.ath_date.usd;

        // ath_date
    });
    return false;

} });



// function search_coin() {
//     // get searchfield input
//     var coin_name = document.getElementById("coin-search-form");

//     // add new item in list
//     const li = document.createElement('li');
//     li.innerHTML = coin_name.elements[0].value;
//     document.querySelector('#coin-list').append(li);
// }