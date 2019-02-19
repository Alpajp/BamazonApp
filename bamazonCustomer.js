var mysql = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon_db'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id: ", connection.threadId);
    dbFx();
});

function dbFx() {
    let DBquery = "SELECT * FROM products";

    connection.query(DBquery, function (err, result) {
        console.table(result);
    });
    setTimeout(() => {purchase()}, 1000);
};

function purchase() {
    var inquirer = require('inquirer');
    inquirer
        .prompt([{
                name: 'itemName',
                type: 'input',
                message: "What item ID would you like to purchase?"
            },
            {
                name: 'amount',
                type: 'input',
                message: "How many?"
            }

        ])
        .then(answers => {

            let DBquery = 'SELECT * FROM products WHERE item_id = ?';

            connection.query(DBquery, answers.itemName, function (err, result) {
                
                const item = answers.itemName;
                const CustAmount = answers.amount;
                const dbAmount = result[0].stock_quantity;

                if(!result.length) {
                    console.log("\r\n");
                    console.log("Sorry, we do not have that item.  Please try again. ");
                    console.log("\r\n");
                    purchase();
                }
                else if (CustAmount > dbAmount) {
                    console.log("\r\n");
                    console.log("Sorry, we do not have that amount.  Please try again. ");
                    console.log("\r\n");
                    purchase();
                } else {
                    let DBquery = "UPDATE product SET stock_quantity = ? WHERE item_id = ?"
                    
                    // var newDbAmount = dbAmount - CustAmount;
                    
                    // connection.query(DBquery, newDbAmount, item, function (err, result) {
                    //     // if (err) throw err;
                    //     console.log("\r\n");
                        console.log(`Thank you for purchasing ${CustAmount} of ${result.product_name}.  Come again soon!`);
                    // })
                    connection.end();
                }

                // }
                }

            )
        });
};
// {
//     item_name:post.itemName,
//     catagory: post.itemCatagory,
//     starting_price: post.startingBid
// }, 
// function(error) {
//   if (error) throw error;
//   console.log("your post was created succesfully!"); 
//   start();
// });

function dbPost() {
    connection.query("SELECT * FROM ITEM", function (err, results) {
        if (err) throw err;

        inquirer.prompt([{
                    name: "choice",
                    type: "raelist",
                    choices: function () {
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
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_name === answer.choice) {
                        chosenItem = results[i];
                    }
                }
                if (chosenItem.highest_price < parseInt(answer.bid)) {

                    connection.query(
                        "UPDATE purchase PRICE ? WHERE ?" [{
                                highest_price: answer.price
                            },
                            {
                                id: chosenItem.id
                            }
                        ],
                        function (err) {
                            if (err) throw err;
                            console.log("price placed successfully!");
                            start();
                        }
                    );
                } else {
                    console.log("Your price was too high. Will try again....");
                    start();
                }
            })
    }, )
    
};
