CREATE TABLE customers(
	id SERIAL PRIMARY KEY NOT NULL,
	user_name VARCHAR(50) NOT NULL,
	email VARCHAR(200) NOT NULL,
	contact_no VARCHAR(20),
	address VARCHAR(200),
	ecoScore VARCHAR(10) DEFAULT '0',
	password VARCHAR(200) NOT NULL,
	UNIQUE (email)
);


CREATE TABLE suppliers(
	id SERIAL PRIMARY KEY NOT NULL,
	email VARCHAR(200) NOT NULL,
	contact_no VARCHAR(20) NOT NULL,
	address VARCHAR(200) DEFAULT 'Online-Portal',
	ecoScore VARCHAR(10) DEFAULT '0',
	password VARCHAR(200) NOT NULL,
	user_name VARCHAR(50) NOT NULL,
	UNIQUE (email)
);

CREATE TABLE products(
	id SERIAL PRIMARY KEY NOT NULL,
	description TEXT,
	price VARCHAR(10) NOT NULL,
	ecoScore VARCHAR(10) DEFAULT '0',
	supp_id int DEFAULT 1,
	image BYTEA,
	FOREIGN KEY (supp_id) REFERENCES suppliers(id)
);

select p.description, p.ecoScore, p.image, s.ecoScore

CREATE TABLE orders(
	id SERIAL PRIMARY KEY NOT NULL,
	order_date DATE,
	ecoScoreGained VARCHAR(10) DEFAULT '0',
	totalCost VARCHAR(10) NOT NULL DEFAULT '0',
	ship_addr VARCHAR(200) NOT NULL DEFAULT 'Nepal',
	customer_id INT DEFAULT 1,
	FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE order_item(
	id SERIAL PRIMARY KEY NOT NULL,
	unit_price VARCHAR(10) NOT NULL,
	qty VARCHAR(10) NOT NULL,
	product_id INT,
	FOREIGN KEY(product_id) REFERENCES products(id),
	order_id INT,
	FOREIGN KEY(order_id) REFERENCES orders(id)
);

select oi.order_id oi.qty ,p.description, p.ecoScore, p.price
from order_item oi
join products p on oi.product_id = p.id
where oi.order_id = 14;




--test on orders
ALTER TABLE orders ALTER COLUMN totalCost SET DEFAULT '0';
ALTER TABLE orders ALTER COLUMN ship_addr SET DEFAULT 'Nepal';
ALTER TABLE orders ALTER COLUMN customer_id SET DEFAULT '1';
insert into orders(customer_id) values (1);
select * from customers;
insert into orders(id, totalCost, ship_addr, customer_id)
values(6 ,0,  'bhaktapur', 1 );

select * from orders  order by id desc limit 1;
select * from orders;

select * from order_item;

update 



select * from products;
select * from order_item oi
join products p on p.id = oi.product_id;
--Other tables such as category and variation of the item are placed on future expansion

------------------------------------------------TESTING------------------------------------------------------------


--to restart the sequence for testing
SELECT pg_get_serial_sequence('products', 'id');
ALTER SEQUENCE public.products_id_seq RESTART WITH 1;

--test data on products
truncate products;
select * from products;

INSERT INTO products(description, image, price)
values ('product', pg_read_binary_file('C:\\schoolwork\\Dbms_main\\upload\\product1.jpeg'), '10'),
		 ('product', pg_read_binary_file('C:\\schoolwork\\Dbms_main\\upload\\product2.jpeg'), '10'),
		 ('product', pg_read_binary_file('C:\\schoolwork\\Dbms_main\\upload\\product3.jpeg'), '10'),
		 ('product', pg_read_binary_file('C:\\schoolwork\\Dbms_main\\upload\\product4.jpeg'), '10'),
		 ('product', pg_read_binary_file('C:\\schoolwork\\Dbms_main\\upload\\product5.jpeg'), '10'),
		 ('product', pg_read_binary_file('C:\\schoolwork\\Dbms_main\\upload\\product6.jpeg'), '10'),
		 ('product', pg_read_binary_file('C:\\schoolwork\\Dbms_main\\upload\\product7.jpeg'), '10');

--superuser priviledge needed to access local files
SELECT pg_read_binary_file('C:\\schoolwork\\Dbms_main\\upload\\doggo.jpg');



--setting default supplier
INSERT INTO suppliers(email, contact_no, address, ecoScore, password)
VALUES ('ecoFashion@gmail.com',
		'+977 9812233448', 
		'Kathmandu, Nepal', 
		'80', 
		'$2a$10$Wb/FnDV1tXxhUEVay5HcfOOjYWVGcR8D5F2J5HX0rQXxwTy4rr48G'
);

