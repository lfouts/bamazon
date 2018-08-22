CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(75),
  department_name VARCHAR(75),
  price INT(11),
  stock_quantity INT(11),
  PRIMARY KEY (item_id)
);

SELECT* FROM products;

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Furby', 'toys', 13, 400);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Snitch', 'sports', 1000 , 1);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('protein', 'foods', 9, 35);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('kettlebell', 'fitness', 14 , 250);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('cookbook', 'books', 23, 570);

INSERT INTO products(product_name, department_name, price, stock_quantity)
