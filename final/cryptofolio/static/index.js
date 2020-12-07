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
    
    // disable submit buttons
    submit_search.disabled = true;
    login_field_button.disabled = true;
    register_field_button.disabled = true;

    // listen for input to be typed into coinsearch input field
    coin_name_search.onkeyup = () => {
        if (coin_name_search.value.length > 0) {
            submit_search.disabled = false;
        }
        else {
            submit_search.disabled = true;
        }
    }
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

    // load all coin info
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
    // clear out input field:
    coin_name_search.value = "";
    // disable the submit button again:
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


       /// console.log(data)  // KANN WEG

        // Add data to General Info elements
        document.title = data.name;
        document.getElementById("coin_info_name").innerHTML = data.id;
        document.getElementById("coin_info_ticker").innerHTML = data.symbol;
        document.getElementById("coin_info_price").innerHTML = data.market_data.current_price.usd;
        document.getElementById("coin_info_marketcap").innerHTML = data.market_data.market_cap.usd;
        document.getElementById("coin_info_atl").innerHTML = data.market_data.atl.usd + data.market_data.atl_date.usd;
        document.getElementById("coin_info_ath").innerHTML = data.market_data.ath.usd + data.market_data.ath_date.usd;
        document.getElementById("coin_info_description").innerHTML = data.description.en;
        
        // Add note to note field if note exists
        let check = document.getElementById("data.id")
        if (check){ 
            let coin_note = document.getElementById(data.id).innerHTML;
            document.getElementById("coin_note_field").innerHTML = coin_note;
        }
      

        // Get current coin prices
        // Add prices to portfolio overview table
        document.querySelector(".portfolio_price_list").innerHTML = "";
        let portfolio_coins = document.querySelectorAll('.portfolio_coin');

        // Add Twitter Timeline
        twitter_feed(data.links.twitter_screen_name)

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
        
    });
    // Draw coin chart
    coin_chart(coin.toLowerCase());


    // create portfolio history chart
    portfolio_history_chart();
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
    // Twitter widget script OPEN
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
    // Twitter script CLOSe

    // add twitter timeline to HTML
    twitter_channel = '<a class="twitter-timeline" href="https://twitter.com/' + twitter_handle + '?ref_src=twsrc%5Etfw">Tweets by ' + twitter_handle + '</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
    document.getElementById("twitter_channel").innerHTML = twitter_channel;

    // refresh widget to get new coin data
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
    document.getElementById("total_portfolio_value").innerHTML = total_portfolio_value

    total_value_list.forEach(function (value) {
        let li_total_value  = document.createElement('li');
        li_total_value.innerHTML = value;
        
        li_total_value.setAttribute("class", "portfolio_coin_total_value");
        document.querySelector('.portfolio_total_value_list').append(li_total_value);

    });
}

function coin_chart(coin_name) {
    // get chart data
    fetch("https://api.coingecko.com/api/v3/coins/" + coin_name + "/market_chart?vs_currency=usd&days=30")
        .then(response => response.json())
        .then(chart_data => {
            // create an empty array to store the paired data
            price_data_array = [];
            // console.log("chart_data")
            // console.log(chart_data.prices)
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
            hideHover: "auto",
            pointSize: "0",
            lineWidth: "2"
            });
        
        });   
}


function portfolio_history_chart() {
    

    // get all unique coin names of trades
    let unique_coins = [];
    trade_history_data.forEach(function (trade) {
        if (!unique_coins.includes(trade.coin_name)) {
            unique_coins.push(trade.coin_name);
        }
    });
    
    
    let coins_chart_data_object = {};
    // get history charts of all unique coins (91 days)
    var get_chart_data = new Promise((resolve, reject) => {
        unique_coins.forEach((coin) => {
            fetch("https://api.coingecko.com/api/v3/coins/" + coin + "/market_chart?vs_currency=usd&days=91")
            .then(response => response.json())
            .then(coin_chart_data => { //object
                // console.log(coin_chart_data.prices[0])
                coins_chart_data_object[coin] = coin_chart_data;          
                
                
                // console.log(coins_chart_data_object);
                // console.log(coins_chart_data_object[Object.keys(coins_chart_data_object)[0]].prices[0]);

                // console.log(unique_coins.length);
                // console.log(Object.keys(coins_chart_data_object).length);
                if (unique_coins.length == Object.keys(coins_chart_data_object).length) 
                {
                    resolve();
                }
            });
        });
    }); 
    
    // https://stackoverflow.com/questions/38406920/best-way-to-wait-for-foreach-to-complete
    // wait for the forEach loop to finish
    get_chart_data.then(() => {
        
        // create coin variables with holding amounts set to 0
        for (let i = 0; i < unique_coins.length; i += 1 ){
            window[unique_coins[i]] = 0;
            console.log(unique_coins[i])
        }
        
        console.log(trade_history_data)
        

        // // loop over every trade in trade_history_data, calculate total portfolio value at timestamp and create dictionary with time/portfolio total value pair
        let portfolio_total_value_timestamp_array = [];
        trade_history_data.forEach(function (trade) {
            let total_portolio_value_timestamp = 0;   
            unique_coins.forEach(function (coin) {
                if (coin == trade.coin_name) {
                    // check if buy or sell order
                    if (trade.tradetype == "BUY") {
                        window[coin] += trade.amount;
                        // console.log("BUY " + coin + " " + window[coin])
                    }
                    else {
                        window[coin] -= trade.amount;
                        // console.log("SELL " + coin + " " + window[coin])
                    }
                }
            })

            // find coin price at timestamp of the trade: trade.time
            
            // create array with all timestamps of coin historic chart
            trade_history_timestamps_array = [];
            (coins_chart_data_object[Object.keys(coins_chart_data_object)[0]].prices).forEach((price) => {
                trade_history_timestamps_array.push(price[0])
            })

            // find closest coin historic chart timestamp
            // source: https://www.gavsblog.com/blog/find-closest-number-in-array-javascript#:~:text=Find%20the%20closest%20value%20in%20array%20using%20reduce()&text=The%20easiest%20way%20to%20do,()%2C%20so%20lets%20use%20that.&text=With%20this%20function%20we%20check,and%20then%20return%20the%20winner.
            timestamp = trade.time;
            const closest_timestamp = trade_history_timestamps_array.reduce((a, b) => {
                return Math.abs(b - timestamp) < Math.abs(a - timestamp) ? b : a;
            });
            // console.log("Closest: " + closest_timestamp)

            index_closest_timestamp = trade_history_timestamps_array.indexOf(closest_timestamp);
            // console.log("Index of closest: " + index_closest_timestamp);

            
            // get price of every coin at closest timestamp and add to object
            // get coinprice of coin at timestamp
            unique_coins.forEach(function (coin) {
                coin_price_at_timestamp = coins_chart_data_object[coin].prices[index_closest_timestamp][1]
                
                // multiple coin holdings by historic price and add to historic portfolio data
                console.log(coin)
                console.log(window[coin])
                console.log("$ " + coin_price_at_timestamp)

                total_portolio_value_timestamp += (coin_price_at_timestamp * window[coin])
                console.log(total_portolio_value_timestamp)


                // create dictionaries with time/value pairs and add to portfolio/timestamp array
        
                    let price_data_dict = {};
                    price_data_dict["time"] = closest_timestamp;
                    price_data_dict["value"] = total_portolio_value_timestamp;
                    portfolio_total_value_timestamp_array.push(price_data_dict);

           })
          console.log(portfolio_total_value_timestamp_array);

          document.getElementById("portfolio_chart").innerHTML = "";
          // Morris Chart explanation source:
          // https://morrisjs.github.io/morris.js/
          new Morris.Area({
          // cariables of the chart
          element: "portfolio_chart",
          data: portfolio_total_value_timestamp_array,
          xkey: "time",
          ykeys: ["value"],
          labels: ["$"],
          hideHover: "auto",
          pointSize: "0",
          lineWidth: "2"
          });
      
           
            
        })
            // console.log(coins_chart_data_object[Object.keys(coins_chart_data_object)[0]].prices[0]);
            // console.log(coins_chart_data_object.vechain);
            //console.log(coins_chart_data_object[Object.keys(coins_chart_data_object)[0]].prices);
           


        // unique_coins.forEach((coin_name) => {
        //     console.log(window[coin_name]);
        // })
          //  get price of coin on trade.time

    });
            

    // coins_chart_data_array.forEach(function (coin_name) {
    //     console.log(coin_name["bitcoin"])
};
    
/////////////////////////////////////////////////////////////////////////

  // // creates list with dicts: coins and holding amount (set to 0)
        // let coin_holding_dict = [];
        // unique_coins.forEach((coin) => {
        //     coin_amount = {[coin]: 0};
        //     coin_holding_dict.push(coin_amount)
        // });
        // console.log(coin_holding_dict);




    // // loop over every trade in trade_history_data, calculate total portfolio value add that moment and create dictionary with time/total value pair
    // trade_history_data.forEach(function (trade) {
    //     let coin_total_value_time_dict = [];

    //     unique_coins.forEach(function (coin) {
    //         if (coin == trade.coin_name) {
    //             // check if buy or sell order
    //             if (trade.tradetype == "BUY") {
    //                 window[coin] += trade.amount;
    //                 console.log("BUY " + coin + " " + window[coin])
    //             }
    //             else {
    //                 window[coin] -= trade.amount;
    //                 console.log("SELL " + coin + " " + window[coin])
    //             }
    //         }
    //     })
    // })
        // get price of coin on trade.time
        

    // });
    // console.log("TESTESTETs");
    // console.log(coins_chart_data_array);
 
/////////////////////////////////////////////////////////////////////////////
    // console.log(coins_chart_data_array);
    // coins_chart_data_array.forEach(function (trade_history) {
    //     console.log(trade_history.prices)
    // });

    // chart_data.prices.forEach(function (price_data) {
    //     let price_data_dict = {};
    //     price_data_dict["time"] = price_data[0];
    //     price_data_dict["value"] = price_data[1];
    //     price_data_array.push(price_data_dict);
    // });


        
         // Create list with portfolio coins to use as API input
        //  let portfolio_coins_list = []
        //  portfolio_coins.forEach(function (coin_name) {
        //      portfolio_coins_list.push(coin_name.innerHTML);
        //  });
        //  portfolio_coins_string = portfolio_coins_list.join('%2C')
 
        //  fetch("https://api.coingecko.com/api/v3/simple/price?ids=" + portfolio_coins_string + "&vs_currencies=usd")
        //  .then(response => response.json())
        //  .then(data => {
 
        //      // API doesn't return values in the same order as the given list; add the right coin value at the right line in portfolio overview
        //      document.querySelector(".portfolio_price_list").innerHTML = "";
        //      portfolio_coins.forEach(function (coin_name) {
        //          for (const [key, value] of Object.entries(data)) {
        //              if (coin_name.innerHTML == key) {
        //                  let li_coin_price  = document.createElement('li');
        //                  li_coin_price.innerHTML = value.usd;
        //                  li_coin_price.setAttribute("class", "portfolio_coin_price");
        //                  document.querySelector('.portfolio_price_list').append(li_coin_price);
        //              }
        //          }
        //      });  

          // creates list with dicts: coins and holding amount (set to 0)
    // let coin_holding_dict = [];
    // unique_coins.forEach(function (coin) {
    //     coin_amount = {[coin]: 0};
    //     coin_holding_dict.push(coin_amount)
    // });
    // console.log(coin_holding_dict);




    
    // console.log(coin_holding_dict)


//////// coins_chart_data_array
// 0: {uniswap: {…}}
// 1: {vechain: {…}}
// 2: {bitcoin: {…}}
// 3: {ethereum: {…}}

// uniswap:
// market_caps: (83) [Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2)]
// prices: (83) [Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2)]
// total_volumes: (83) [Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2)]

// prices: Array(83)
// 0: (2) [1600300800000, 3.443832391414463]
// 1: (2) [1600387200000, 3.443832391414463]
// 2: (2) [1600473600000, 7.097694014200204]
// 3: (2) [1600560000000, 5.702060553834949]
// 4: (2) [1600646400000, 5.2565793825170735]
// 5: (2) [1600732800000, 4.294819485815088]
   
//////// trade_history_data
// 0: {time: 1607261047.87063, coin_name: "bitcoin", amount: 10, tradetype: "BUY"}
// 1: {time: 1607261058.929534, coin_name: "uniswap", amount: 100, tradetype: "BUY"}
// 2: {time: 1607261132.143845, coin_name: "uniswap", amount: 100, tradetype: "BUY"}
// 3: {time: 1607261165.148184, coin_name: "uniswap", amount: 100, tradetype: "BUY"}
// 4: {time: 1607261175.311559, coin_name: "ethereum", amount: 110, tradetype: "BUY"}






    // var timestamp = trade_history_data[0].time; 
    // var date = new Date(timestamp * 1000);
    // var formattedDate = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
    
    
    // console.log(formattedDate);

    
    // for (i = 0; i < 5; i++) {

    // 