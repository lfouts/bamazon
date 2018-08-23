require("dotenv").config()

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.password,
  database: "bamazon_DB"
});



connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  showProducts();
});


function showProducts() {

  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;


    console.table(res);


    askCustomerForItem(res);
  });
}

// Prompt the customer for a product ID
function askCustomerForItem(inventory) {

  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "What is the ID of the item you would you like to purchase? [Quit with Q]",
        validate: function(val) {
          return !isNaN(val) || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {
      // Check if the user wants to quit the program
      doYouNeedToQuit(val.choice);
      var choiceId = parseInt(val.choice);
      var product = checkInventory(choiceId, inventory);


      if (product) {

        howMuch(product);
      }
      else {

        console.log("\nThat item is not in the inventory.");
        showProducts();
      }
    });
}


function howMuch(product) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many would you like to purchase? [quit with q]",
        validate: function(val) {
          return val > 0 || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {

      doYouNeedToQuit(val.quantity);
      var quantity = parseInt(val.quantity);


      if (quantity > product.stock_quantity) {
        console.log("\nInsufficient quantity!");
        showProducts();
      }
      else {

        buyThings(product, quantity);
      }
    });
}


function buyThings(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, product.item_id],
    function(err, res) {

      console.log("\nSuccessfully bought " + quantity + " " + product.product_name + "'s!");
      showProducts();
    }
  );
}


function checkInventory(choiceId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === choiceId) {

      return inventory[i];
    }
  }

  return null;
}


function doYouNeedToQuit(choice) {
  if (choice.toLowerCase() === "q") {
    
    console.log("See ya later, alligator!");
    process.exit(0);
  }
}
