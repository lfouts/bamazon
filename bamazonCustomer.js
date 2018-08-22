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


// Creates the connection with the server and database
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  showProducts();
});

// loads product table
function showProducts() {
  // Selects all of the data from the MySQL products table
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    // Draw the table in the terminal using the response
    console.table(res);

    // Then prompt the customer for their choice of product, pass all the products to promptCustomerForItem
    askCustomerForItem(res);
  });
}

// Prompt the customer for a product ID
function askCustomerForItem(inventory) {
  // Prompts user for what they would like to purchase
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

      // If there is a product with the id the user chose, prompt the customer for a desired quantity
      if (product) {
        // Pass the chosen product to promptCustomerForQuantity
        howMuch(product);
      }
      else {
        // Otherwise let them know the item is not in the inventory, re-run loadProducts
        console.log("\nThat item is not in the inventory.");
        showProducts();
      }
    });
}

// Prompt the customer for a product quantity
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
      // Check if the user wants to quit the program
      doYouNeedToQuit(val.quantity);
      var quantity = parseInt(val.quantity);

      // If there isn't enough,  re-run showProducts
      if (quantity > product.stock_quantity) {
        console.log("\nInsufficient quantity!");
        showProducts();
      }
      else {
        // Otherwise run buyThings, give it the product info and desired amount to buy
        buyThings(product, quantity);
      }
    });
}


function buyThings(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, product.item_id],
    function(err, res) {
      // Let the user know the purchase was successful, re-run loadProducts
      console.log("\nSuccessfully bought " + quantity + " " + product.product_name + "'s!");
      showProducts();
    }
  );
}


function checkInventory(choiceId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === choiceId) {
      // If a matching product is found, return the product
      return inventory[i];
    }
  }
  // else return null
  return null;
}

// Check to see if the user wants to quit the program
function doYouNeedToQuit(choice) {
  if (choice.toLowerCase() === "q") {
    // send a message and exit
    console.log("See ya later, alligator!");
    process.exit(0);
  }
}
