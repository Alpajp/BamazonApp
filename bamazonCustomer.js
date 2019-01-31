var mysql = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon_db'
});

connection.connect();

connection.query(function (error) {
    if (error) throw error;
    dbFunction();

});

function dbFuntion() {
    var inquirer = require('inquirer');
    inquirer
        .prompt({
            name: 'POSTOrBUY',
            type: 'checkbox',
            message: "Would you like to [POST] an item or [BUY] an item?",
            choices: ["POST", "BUY", "EXIT"]
        })
        .then(answers => {

            switch (answers) {
                case "POST":
                    dbPost();
                    break;

                case "BUY":
                    dbBuy();
                    break;

                case "EXIT":
                    connection.end();
            }
        });
};

function dbPost() {
    var inquirer = require('inquirer');
    inquirer
        .prompt([{
                name: 'itemName',
                type: 'input',
                message: "What item you like to submit?"
            },
            {
                name: 'itemCatagory',
                type: 'input',
                message: "What catagory?"
            },
            {
                name: 'startingPrice',
                type: 'input',
                message: "what is the starting price?"
            }

        ])
        .then(post => {


            var query = connection.query('INSERT INTO posts SET ?', 
            
            {
                item_name:post.itemName,
                catagory: post.itemCatagory,
                starting_price: post.startingBid
            }, 
            function(error) {
              if (error) throw error;
              console.log("your post was created succesfully!"); 
              start();
            });
})};
function dbPost() {
    connection.query("SELECT * FROM ITEM", function(err, results) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "choice",
                type: "raelist",
                choices: function() {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].item_name);
                    }
                    return choiceArray;
                    },
                    message: "What item woud you like to purchase?"
                },
                {
                    name: "buy",
                    type: "input",
                    message: "How much would you like to pay?"
                }
            ])
            .then(function(answer) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_name === answer.choice) {
                        chosenItem = results[i];
                    }
                }
                if (chosenItem.highest_price < parseInt(answer.bid)) {

                    connection.query(
                        "UPDATE purchase PRICE ? WHERE ?"
                        [
                          {highest_price: answer.price},
                          {id: chosenItem.id
                        }  
                        ],
                        function(err) {
                            if (err)throw err;
                            console.log("price placed successfully!");
                            start();
                        }
                    );
                }
                else {
                    console.log("Your price was too high. Will try again....");
                    start();
                }
            })
            },
        )};
    
