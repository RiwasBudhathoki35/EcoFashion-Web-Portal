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
	totalclicks INT DEFAULT 0;
	FOREIGN KEY (supp_id) REFERENCES suppliers(id)
);


CREATE TABLE orders(
	id SERIAL PRIMARY KEY NOT NULL,
	order_date DATE,
	ecoScoreGained VARCHAR(10) DEFAULT '0',
	totalCost VARCHAR(10) NOT NULL DEFAULT '0',
	ship_addr VARCHAR(200) NOT NULL DEFAULT 'Nepal',
	payment_status VARCHAR(20) DEFAULT 'Pending',
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

--collects the data from website on day to day--
CREATE TABLE supp_performance(
	id SERIAL PRIMARY KEY,
	supp_id INT NOT NULL,
	FOREIGN KEY(supp_id) REFERENCES suppliers(id),
	clicks VARCHAR(200) DEFAULT '0',
	sales VARCHAR(200) DEFAULT '0',
	time TIMESTAMP DEFAULT NOW()
);



--tests while configuring tables --

--perfomance of website
select extract(MINUTE FROM time) as minute, sum(clicks::integer) as totalclicks,
sum(sales::integer) as totalsales 
from supp_performance


drop table supp_performance;
INSERT INTO supp_performance (supp_id) values (1), (2);

select * from supp_performance;
truncate table supp_performance;

select * from products;
delete from products where id = 8;

INSERT INTO supp_performance (supp_id) values (1), (2);

--perfomance of website
select extract(MINUTE FROM time) as minute, sum(clicks::integer) as totalclicks,
sum(sales::integer) as totalsales 
from supp_performance

--total sales and clicks of supplier id
select supp_id, extract(hour FROM time) as hour, sum(clicks::integer) as totalclicks,
sum(sales::integer) as totalsales 
from supp_performance
group by supp_id, hour
having supp_id = 1;


--test on joins --
select p.name, p.description, p.ecoScore, o.id, oi.id, p.id, oi.qty
from orders o 
join order_item oi on o.id = oi.order_id
join products p on oi.product_id = p.id
where o.customer_id = 4;

--we are perfoming updates on day to day basis on large scale --
update supp_performance
set clicks = (clicks::integer + 1)::varchar
where supp_id = $1 and date(time) = current_date ;

--creata a supp_id on login==

--get sales

select sum((oi.unit_price::integer)*(oi.qty::integer)) as total_sales
from orders o
join order_item oi on o.id = oi.order_id
join products p on oi.product_id = p.id
where p.supp_id = 1;

--update sales with
update supp_performance
set sales = 3000
where supp_id = 1 and date(time) = current_date;

select * from supp_performance;
insert into supp_performance (supp_id) values (1)






select oi.order_id oi.qty ,p.description, p.ecoScore, p.price
from order_item oi
join products p on oi.product_id = p.id
where oi.order_id = 14;




--test on orders
ALTER TABLE orders ALTER COLUMN totalCost SET DEFAULT '0';
ALTER TABLE products ADD COLUMN totalclicks INT DEFAULT 0;
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
--manual insertion for testing
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

