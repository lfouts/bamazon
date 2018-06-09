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
  if (err) throw err;

  //TESTING connection

  console.log("connected as ID " + connection.threadID)
  afterConnection();
});

function afterConnection() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;

    console.log("bamazon store");
    console.log("============================================================================")

    for (let i = 0; i < results.length; i++) {
      console.log("ID: " + results[i].item_id + " | " + "Product: " + results[i].product_name + " | " + "Department: " + results[i].department_name + " | " + "Price: " + "$" + results[i].price + " | ");
      console.log("===========================================================================")
    }
  });
}
