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
    const li = document.createElement('li');
    li.innerHTML = coin;

    // Add new element to our unordered list:
    document.querySelector('#coin_list').append(li);

    // Clear out input field:
    coin_name.value = '';

    // Disable the submit button again:
    submit.disabled = true;

    // Stop form from submitting
   

    fetch("https://api.coingecko.com/api/v3/coins/" + coin + "?localization=false&tickers=true&market_data=false&community_data=false&developer_data=false&sparkline=false")
    .then(response => response.json())
    .then(data => console.log(data));

    const li = document.createElement('li');
    li.innerHTML = data.;

    // Add new element to our unordered list:
    document.querySelector('#coin_list').append(li);


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