const express = require("express");
const app = express();
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const multer = require("multer");
const axios = require("axios");
const path = require("path");

const storage = multer.memoryStorage(); //Not storing the images and hanlding them directly in the database
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."));
    }
  },
});

const initializePassport = require("./passportConfig");
const { Query } = require("pg");
initializePassport(passport);

const PORT = process.env.PORT || 4000;

//middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views")); // Ensure correct path

app.use(express.static(path.join(__dirname, "../frontend/public"))); //make public/deliver to user as is,the static files such as css
app.use(express.urlencoded({ extended: false })); //fetch the data from the post url
app.use(
  session({
    secret: "topsecretstrawhat",
    resave: false,
    saveUninitialized: false,
  })
);
//Using the sessions deserializer we can access all the users data via req.user at any time. the session data can also be accessed through here
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Routing The webpage Requests
app.get("/session-status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, role: req.user.role });
  } else {
    res.json({ loggedIn: false, role: null });
  }
});

app.get("/", async (req, res) => {
  const session_role = req.user ? req.user.role : null;
  //const session_role = req.session ? req.session.passport.user.role : null;
  const authenticated_user = req.isAuthenticated();
  const ecoScore = req.user ? req.user.ecoscore : 0;
  //query the database and send the data to index on a object and display using ejs
  const query =
    "SELECT id, description, price , image , ecoScore from products";

  pool.query(query, (err, result) => {
    if (err) {
      console.log("error fetching images: ", err);
      return res.status(500).send("Error retrieving image");
    }

    if (result.rows.length > 0) {
      //Mapping all rows to new users array
      const users = result.rows.map((user) => {
        const imageBuffer = user.image;
        let imageUrl = null;
        if (imageBuffer) {
          const base64Image = imageBuffer.toString("base64");
          imageUrl = `data:image/jpeg;base64,${base64Image}`;
        }
        return {
          id: user.id,
          desc: user.description,
          price: user.price,
          ecoScore: user.ecoscore,
          imageUrl,
        };
      });
      console.log("session role: ", session_role);
      res.render("index", {
        users,
        authenticated_user,
        session_role,
        ecoScore,
      });
    } else {
      res.render("index", {
        users: [],
        authenticated_user,
        session_role,
        ecoScore,
      });
    }
  });
});

app.get("/users/dashboard", checkNotAuthenticated, async (req, res) => {
  const customer_id = req.user.id;
  console.log("USER PROFILE");
  const query = `select sum(p.ecoScore::integer) as total_eco, sum(oi.qty::integer) as total_items
                  from orders o 
                  join order_item oi on o.id = oi.order_id
                  join products p on oi.product_id = p.id
                  where o.customer_id = $1;`;

  const results = await pool.query(query, [customer_id]);
  const summary = results.rows[0];
  // console.log(summary);
  // console.log(req.user);
  const ecoScore = req.user.ecoScore;
  res.render("customer_profile", { user: req.user, summary, ecoScore });
});

// app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
//   //console.log(req.session);
//   console.log("user data: ");
//   console.log(req.user); //froms session i think// is it deserializing?
//   const ecoScore = req.user.ecoscore;
//   const query = `SELECT p.id, p.description, p.price, p.ecoscore, p.image, s.ecoscore as s_ecoscore
//                 FROM products p
//                 INNER JOIN suppliers s ON p.supp_id = s.id`;
//   pool.query(query, (err, result) => {
//     if (err) {
//       console.log("error fetching images: ", err);
//       return res.status(500).send("Error retrieving image");
//     }
//     if (result.rows.length > 0) {
//       //Mapping all rows to new users array
//       const users = result.rows.map((user) => {
//         const imageBuffer = user.image;
//         let imageUrl = null;
//         if (imageBuffer) {
//           const base64Image = imageBuffer.toString("base64");
//           imageUrl = `data:image/jpeg;base64,${base64Image}`;
//         }
//         //console.log(user);
//         return {
//           id: user.id,
//           desc: user.description,
//           price: user.price,
//           ecoScore: user.ecoscore, // product is user
//           s_ecoScore: user.s_ecoscore,
//           imageUrl,
//         };
//       });
//       console.log("eco: ", ecoScore);
//       res.render("dashboard", { users, ecoScore });
//       console.log("eco: ", ecoScore);
//     } else {
//       console.log("eco: ", ecoScore);
//       res.render("dashboard", { users: [], ecoScore });
//     }
//   });
// });

app.get(
  "/users/suppliers/dashboard",
  checkNotAuthenticated,
  async (req, res) => {
    console.log("user data");
    console.log(req.user);
    const ecoScore = req.user.ecoscore;
    const performance_query = `select supp_id, extract(hour FROM time) as hour, sum(clicks::integer) as totalclicks,
                            sum(sales::integer) as totalsales 
                            from supp_performance
                            group by supp_id, hour having supp_id = $1;`;
    const supp_id = req.user.id;
    const results = await pool.query(performance_query, [supp_id]);
    supplier = results.rows; //results object has the entire data structure and we want only the data stored on rows
    console.log(supplier);
    res.render("supplier_dashboard", { ecoScore, supplier });
  }
);

app.get("/users/login", checkAuthenticated, (req, res) => {
  //const is_supplier = false;
  res.render("login");
});

app.get("/users/register", checkAuthenticated, (req, res) => {
  res.render("register");
});

app.get("/users/product/:id", async (req, res) => {
  console.log("Inside product route");
  const rawID = req.params.id;
  const ecoScore = req.user ? req.user.ecoscore : 0;
  console.log(ecoScore);
  const order_id = req.user ? req.user.order_id : 4;
  //const order_id = req.user.order_id;

  if (!rawID) {
    console.log("Error: req.params.id is undefined or null");
    return res.status(400).send("Invalid product ID");
  }

  const id = rawID;
  console.log("Decoded ID:", id);

  // Safe query using parameterized SQL to prevent SQL injection
  const query = `select p.id, p.image, p.description, p.price, p.ecoScore, p.supp_id, s.ecoScore as s_ecoScore
                 from products p
                 join suppliers s on s.id = p.supp_id
                 where p.id = $1`;
  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.redirect("/");
    }

    //console.log("Query Result:", result);

    if (result.rows.length > 0) {
      const product = result.rows[0];
      console.log("product details: ");
      console.log(product);
      //console.log(user);
      const imageBuffer = product.image;
      let imageUrl = null;

      if (imageBuffer) {
        const base64Image = imageBuffer.toString("base64");
        imageUrl = `data:image/jpeg;base64,${base64Image}`;
      }

      return res.render("product", { product, imageUrl, ecoScore, order_id });
    } else {
      console.log("No product found");
      return res.status(404).send("Product not found");
    }
  });
});

async function update(req, res, next) {
  const order_id = req.params.order_id;

  const totalCostQuery = `
    SELECT COALESCE(SUM(oi.unit_price::INTEGER * oi.qty::INTEGER), 0) AS total_cost
    FROM order_item oi
    WHERE oi.order_id = $1;
  `;

  const ecoScoreQuery = `
    SELECT COALESCE(SUM(p.ecoScore::INTEGER * oi.qty::INTEGER), 0) AS eco_score_gained
    FROM order_item oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = $1;
  `;

  try {
    const totalCostResult = await pool.query(totalCostQuery, [order_id]);
    const totalCost = totalCostResult.rows[0].total_cost;

    const ecoScoreResult = await pool.query(ecoScoreQuery, [order_id]);
    const ecoScoreGained = ecoScoreResult.rows[0].eco_score_gained;

    console.log(
      `Updating order ${order_id}: totalCost=${totalCost}, ecoScoreGained=${ecoScoreGained}`
    );

    const updateOrderQuery = `
      UPDATE orders
      SET ecoScoreGained = $1, totalCost = $2
      WHERE id = $3;
    `;
    await pool.query(updateOrderQuery, [ecoScoreGained, totalCost, order_id]);

    console.log("Order successfully updated at checkout.");

    req.flash("success", "Order updated successfully!");

    // Redirecting to the checkout page for that specific order after update
    next();
  } catch (err) {
    console.error("Error during checkout:", err);
    req.flash("error", "Error checking out, please try again.");
    return res.redirect("/users/cart");
  }
}

// Checkout route
app.get(
  "/users/checkout/:order_id",
  checkNotAuthenticated,
  async (req, res) => {
    const order_id = req.params.order_id;
    await update(order_id);
    try {
      // Fetch the updated order after the update function
      const result = await pool.query(`SELECT * FROM orders WHERE id = $1`, [
        order_id,
      ]);

      if (result.rows.length === 0) {
        req.flash("error_msg", "Order not found.");
        return res.redirect("/users/dashboard"); // Or any other relevant route
      }

      const check = result.rows[0];
      console.log(check);

      const order_details_result = await pool.query(
        `SELECT oi.order_id, oi.qty, p.description, p.ecoScore, p.price
       FROM order_item oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
        [order_id]
      );
      const order_details = order_details_result.rows; // Ensure it's an array

      // Render the checkout page with updated order details
      res.render("checkout", { check, order_details });
    } catch (err) {
      console.error("Error during checkout:", err);
      req.flash("error", "Error checking out, please try again.");
      res.redirect(`/users/checkout/${order_id}`);
    }
  }
);

app.get("/users/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      console.log(err);
      return next(err); // Pass error to the next middleware
    }
    req.flash("success_msg", "You have logged out.");
    console.log("Successfully logged out");
    res.redirect("/users/login");
  });
});

app.get("/users/add-outlet", (req, res) => {
  req.logOut((err) => {
    if (err) {
      console.log(err);
      return next(err); // Pass error to the next middleware
    }
    res.redirect("/users/register");
  });
});

app.get("/users/cart", checkNotAuthenticated, isCustomer, (req, res) => {
  console.log("inside cart");
  const cart_query = `select * from orders where customer_id = $1  order by id asc`;
  const customer_id = req.user.id;
  pool.query(cart_query, [customer_id], (err, results) => {
    if (err) {
      console.log("ERROR QUERING THE ORDERS DATABASE: ", err);
      res.redirect("/users/dashboard");
    }
    if (results.rows.length > 0) {
      const orders = results.rows.map((order) => {
        console.log(order);
        update(order.id);
        return order;
      });
      res.render("cart", { orders });
    } else {
      console.log("No Orders placed.");
      res.render("cart", { orders: [] });
    }
  });
});

app.get(
  "/users/cart-items/:id",
  checkNotAuthenticated,
  isCustomer,
  async (req, res) => {
    console.log("inside cart-items");

    try {
      const cart_query = `
        SELECT oi.id, oi.unit_price, oi.qty, oi.order_id, oi.product_id
        FROM orders o
        JOIN order_item oi ON oi.order_id = o.id
        WHERE o.id = $1
      `;
      const order_id = req.params.id;
      const customer_id = req.user.id;

      // Fetch order details (cart items)
      const cartResults = await pool.query(cart_query, [order_id]);
      let order_details = cartResults.rows; // Store cart items in order_details

      if (order_details.length === 0) {
        console.log("No order items found.");
        return res.render("cart-items", { order_details: [], order_id });
      }

      // Fetch product images for each cart item in parallel
      await Promise.all(
        order_details.map(async (order_detail) => {
          const fetch_product_image = `
            SELECT p.image FROM products p 
            WHERE p.id = $1
          `;
          const imageResult = await pool.query(fetch_product_image, [
            order_detail.product_id,
          ]);
          const imageBuffer = imageResult.rows[0].image;
          let imageUrl = null;
          if (imageBuffer) {
            const base64Image = imageBuffer.toString("base64");
            imageUrl = `data:image/jpeg;base64,${base64Image}`;
          }
          order_detail.imageUrl = imageUrl; // Attach image to order_detail
        })
      );

      res.render("cart-items", { order_details, order_id });
    } catch (err) {
      console.error("ERROR QUERYING THE ORDERS DATABASE: ", err);
      return res.redirect("/users/dashboard");
    }
  }
);

app.get("/users/cart-update/:order_id", async (req, res) => {
  const order_id = req.params.order_id;
  await update(order_id);
  res.redirect("/users/cart");
});

app.get(
  "/simulate-pay/:order_id",
  checkNotAuthenticated,
  isCustomer,
  async (req, res) => {
    const order_id = req.params.order_id;

    const update_orders = `UPDATE orders SET payment_status = 'completed' WHERE id = $1`;
    const update_cus_ecoScore = `
      UPDATE customers c
      SET ecoScore = COALESCE(NULLIF(c.ecoScore, '')::INTEGER, 0) 
                    + COALESCE(NULLIF(o.ecoScoreGained, '')::INTEGER, 0)
      FROM orders o
      WHERE c.id = o.customer_id AND o.id = $1 AND o.payment_status = 'completed'`;

    const update_supp_ecoScore = `
      UPDATE suppliers s
      SET ecoScore = COALESCE(CAST(s.ecoScore AS INTEGER), 0) + COALESCE(CAST(p.ecoScore AS INTEGER), 0) * $1
      FROM products p
      WHERE s.id = p.supp_id AND p.id = $2;`;

    const select_supplier = `SELECT qty, product_id FROM order_item WHERE order_id = $1`;

    const client = await pool.connect(); // Get a connection from the pool

    try {
      await client.query("BEGIN"); // 🔹 Start transaction

      // Update order status to completed
      const status = await client.query(
        `select payment_status from orders where id = $1 and payment_status = $2`,
        [order_id, "completed"]
      );
      if (status.rows.length > 0) {
        await client.query("ROLLBACK");
        // client.release();
        return res.redirect(`/users/checkout/${order_id}`);
      }
      await client.query(update_orders, [order_id]);

      // Fetch supplier-related data
      const results = await client.query(select_supplier, [order_id]);

      if (results.rows.length > 0) {
        for (const supp of results.rows) {
          const qty = supp.qty;
          const product_id = supp.product_id;

          await client.query(update_supp_ecoScore, [qty, product_id]);
        }
      }

      // Update customer ecoScore after all supplier updates
      await client.query(update_cus_ecoScore, [order_id]);

      await client.query("COMMIT"); // 🔹 Commit transaction (save changes)
      res.redirect(`/users/checkout/${order_id}`);
    } catch (err) {
      await client.query("ROLLBACK"); // 🔹 Rollback if anything fails
      console.error("Transaction failed: ", err);
      res.status(500).send("An error occurred, transaction rolled back");
    } finally {
      client.release(); // Release client back to pool
    }
  }
);

app.post("/users/register", async (req, res) => {
  let {
    username,
    email,
    contact,
    address,
    password,
    confirm_password: password2,
    options,
  } = req.body;
  console.log(username, email, contact, address, password, password2, options);
  console.log(req.body);
  let errors = [];

  if (!username || !email || !password || !password2) {
    errors.push({ message: "please enter all fields" });
  }
  if (password.length < 6) {
    errors.push({ message: "at least 6 chars." });
  }

  if (password != password2) {
    errors.push({ message: "Passwords do not match" });
  }

  console.log(errors);

  if (errors.length > 0) {
    console.log("inside error push ");
    res.render("register", { errors });
  } else {
    //Form validation has passed
    console.log("Form validation passed");
    let hashedPassword = await bcrypt.hash(password, 10);

    pool.query(
      `select * from ${options} where email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }
        if (results.rows.length > 0) {
          console.log("User already exits.");
          errors.push({ message: "Email already registered" });
          res.render("register", { errors });
        } else {
          pool.query(
            `insert into ${options} (user_name, email, contact_no, address, password) 
                 values($1, $2, $3, $4, $5)
                 returning id, password`,
            [username, email, contact, address, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log("User registration completed. ");
              console.log(results.rows);
              req.flash("success_msg", "you are registered. Please login.");
              res.redirect("/users/login");
            }
          );
        }
      }
    );
  }
});

app.post("/users/login", (req, res, next) => {
  req.body.role = req.body.options; // Assign role from options

  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", info?.message || "Invalid credentials"); // Store error message
      return res.redirect("/users/login");
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      if (req.body.role == "suppliers") {
        return res.redirect("/users/suppliers/dashboard");
      }
      return res.redirect("/users/dashboard");
    });
  })(req, res, next); //to execute the middleware function
});

app.post("/upload", upload.single("image"), (req, res) => {
  const ecoScore = req.user.ecoscore;
  //check if file has been uploaded
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  //acess file buffer from req.file.buffer
  console.log(req.body);
  const imageBuffer = req.file.buffer; //file is created by mutler whereas body is created by the url_encoded static that we invited as a middlware
  console.log("Uploader and upload credentials: ", req.body);
  let { name, desc, price, ecoScore: p_ecoScore, supp_id } = req.body;
  supp_id = supp_id ? supp_id : req.users.id;
  const query = `insert into products (name, description, ecoScore, price, image, supp_id) values ($1, $2, $3, $4, $5, $6)`;

  pool.query(
    query,
    [name, desc, p_ecoScore, price, imageBuffer, supp_id],
    (err, result) => {
      if (err) {
        console.error("error saving imaeg: ", err);
        return res.status(500).send("error saving");
      }
      req.flash("success_msg", "The image has been uploaded");
      res.status(200).render("supplier_dashboard", { ecoScore });
    }
  );
});

app.post("/search", (req, res) => {
  // const authenticated_user = req.isAuthenticated();
  // console.log("inside search");
  // console.log(req.body);
  // console.log(req.user);
  //We will now use the dashboard.ejs to render our searched query
  //I am not passing the query to /users/dashboard and handling it there because
  //it has high chance of error introduction as i move on

  //dashboard requires authenticaiton whereas for normal search to be avaioaboe we will now be using
  //product.ejs to render all the items that match, ensure each prodcut have unique name, append something like supplier name and remove it when dispalying on the page
  //create a new view for search
  //const ecoScore = req.user.ecoScore;
  //const authenticated = req.user ? 1 : null;
  const ecoScore = req.user ? req.user.ecoscore : 0;
  const product = req.body.search;
  const query = `select p.id, p.description,p.price, p.ecoScore, p.image, s.ecoScore as s_ecoScore
                from products p
                inner join suppliers s on s.id = p.supp_id
                where p.name ILIKE '%${product}%' or p.description ILIKE '%${product}%';`;

  pool.query(query, (err, result) => {
    if (err) {
      console.log("error fetching images: ", err);
      return res.status(500).send("Error retrieving image");
    }

    if (result.rows.length > 0) {
      //Mapping all rows to new users array
      const users = result.rows.map((user) => {
        console.log(
          "USERS FOUND: userid: ",
          user.id,
          user.description,
          user.price,
          user.ecoscore
        );
        const imageBuffer = user.image;
        let imageUrl = null;
        if (imageBuffer) {
          const base64Image = imageBuffer.toString("base64");
          imageUrl = `data:image/jpeg;base64,${base64Image}`;
        }
        //console.log(user);

        return {
          id: user.id,
          desc: user.description,
          price: user.price,
          ecoScore: user.ecoscore,
          s_ecoScore: user.s_ecoscore,
          imageUrl,
        };
      });
      res.render("search", { users, ecoScore });
      //console.log("eco: ", ecoScore);
    } else {
      //console.log("eco: ", ecoScore);
      console.log("No users found.");
      res.render("search", { users: [], ecoScore });
    }
  });
});

//receive order items from product page and process the order
app.post(
  "/users/order/:id",
  checkNotAuthenticated,
  isCustomer,
  async (req, res) => {
    const id = req.params.id;
    const quant = parseInt(req.body.quantity, 10);

    // if (req.user.role !== "customers") {
    //   req.flash("error", "Please log in as a customer.");
    //   return res.redirect("/users/logout");
    // }

    const product_query = `SELECT * FROM products WHERE id = $1`;
    const orderItem_query = `INSERT INTO order_item (unit_price, qty, product_id, order_id)
                           VALUES ($1, $2, $3, $4)`;
    const create_order_query = `INSERT INTO orders (id, customer_id) VALUES ($1, $2)`;

    try {
      // Fetch product
      const result = await pool.query(product_query, [id]);

      if (result.rows.length === 0) {
        req.flash("error", "Product not found.");
        return res.redirect(`/users/product/${id}`);
      }

      const product = result.rows[0]; // Get product details
      const unit_price = product.price; // Assuming 'price' exists in 'products'
      const order_id = req.user.order_id; // Order ID from session
      const customer_id = req.user.id;

      // Ensure order exists
      const checkOrder = await pool.query(
        `SELECT id FROM orders WHERE id = $1 LIMIT 1`,
        [order_id]
      );

      if (checkOrder.rowCount === 0) {
        console.log("Order ID not found, creating a new order...");
        await pool.query(create_order_query, [order_id, customer_id]);
      } else {
        console.log("Order already exists:", order_id);
      }

      // Insert into order_item
      await pool.query(orderItem_query, [unit_price, quant, id, order_id]);
      console.log("Insertion into order_item completed.");

      req.flash("success_msg", "Order placed successfully!");
      return res.redirect(`/users/product/${id}`);
    } catch (err) {
      console.error("Database error:", err);
      req.flash("error", "Error placing order, please try again.");
      return res.redirect(`/users/product/${id}`);
    }
  }
);

//

app.post("/payment-success", async (req, res) => {
  try {
    const { token, amount, productIdentity, productName } = req.body;

    // Make the verification request to Khalti API
    const response = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      {
        token: token,
        amount: amount,
      },
      {
        headers: {
          Authorization: `83e2bbf373a343239eea8c58eda9edd0`, // Use your test secret key here
        },
      }
    );

    // If the payment is successfully verified
    if (response.data && response.data.status === "OK") {
      // Payment is verified, proceed to update your database
      console.log("Payment verified:", response.data);

      // Here, you would update your database (e.g., mark the payment as completed)
      // Example:
      // await pool.query("UPDATE orders SET status = 'completed' WHERE product_identity = ?", [productIdentity]);

      // Respond to the front end that the payment was successful
      res.json({
        status: "success",
        message: "Payment successfully verified.",
      });
    } else {
      // Payment verification failed
      res.json({ status: "failed", message: "Payment verification failed." });
    }
  } catch (err) {
    console.error("Error during payment verification:", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong with the payment verification.",
    });
  }
});

//Update function to update the Default orderid created at beginning of session with new data
async function update(order_id) {
  const totalCostQuery = `
    SELECT COALESCE(SUM(oi.unit_price::INTEGER * oi.qty::INTEGER), 0) AS total_cost
    FROM order_item oi
    WHERE oi.order_id = $1;
  `;

  const ecoScoreQuery = `
    SELECT COALESCE(SUM(p.ecoScore::INTEGER * oi.qty::INTEGER), 0) AS eco_score_gained
    FROM order_item oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = $1;
  `;

  try {
    const totalCostResult = await pool.query(totalCostQuery, [order_id]);
    const totalCost = totalCostResult.rows[0].total_cost;

    const ecoScoreResult = await pool.query(ecoScoreQuery, [order_id]);
    const ecoScoreGained = ecoScoreResult.rows[0].eco_score_gained;

    console.log(
      `Updating order ${order_id}: totalCost=${totalCost}, ecoScoreGained=${ecoScoreGained}`
    );

    const updateOrderQuery = `
      UPDATE orders
      SET ecoScoreGained = $1, totalCost = $2
      WHERE id = $3;
    `;

    await pool.query(updateOrderQuery, [ecoScoreGained, totalCost, order_id]);

    console.log("Order successfully updated.");
  } catch (err) {
    console.error("Error updating order:", err);
  }
}

app.delete("/users/cart-item/:id", async (req, res, next) => {
  const id = req.params.id;
  console.log("Deleting order item with ID:", id);

  // First, retrieve the order_id before deleting the item
  const getOrderQuery = `SELECT order_id FROM order_item WHERE id = $1`;

  try {
    const orderResult = await pool.query(getOrderQuery, [id]);

    if (orderResult.rowCount === 0) {
      return res.status(404).json({ message: "Item not found." });
    }

    const order_id = orderResult.rows[0].order_id;

    const deleteQuery = `DELETE FROM order_item WHERE id = $1`;
    await pool.query(deleteQuery, [id]);

    console.log(`Item with ID ${id} deleted.`);

    // Call the update function with order_id
    await update(order_id);

    res.json({
      message: `Item with ID ${id} has been deleted.`,
      redirect: `/users/cart-items/${order_id}`,
    });
  } catch (err) {
    console.error("Error deleting item:", err);
    return res.status(500).json({ message: "Failed to delete item." });
  }
});

app.delete("/users/cart/:id", async (req, res) => {
  const id = req.params.id;
  console.log("id: in delete cart: ", id);
  const delete_query = `DELETE FROM orders WHERE id = $1`;
  const delete_items_query = `DELETE FROM order_item WHERE order_id = $1`;

  const client = await pool.connect();
  console.log("inside the deletion.");

  try {
    await client.query("BEGIN");

    await client.query(delete_items_query, [id]);

    await client.query(delete_query, [id]);

    await client.query("COMMIT");
    console.log("deletion commited");

    res.json({
      message: `Entire Cart with Cart ID ${id} has been deleted.`,
      redirect: "/users/cart",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.log("error deleting cart: ", err);
    res.status(500).json({ message: "ERROR deleting cart, please try again." });
  } finally {
    client.release();
  }
});

//To verify role of the user(Must be a customer to purchase and access customer dashboard)
function isCustomer(req, res, next) {
  console.log("isCustomer checking.");
  const customer_check = req.user.role;
  if (customer_check != "customers") {
    console.log("Not a valid customer.");
    req.logOut((err) => {
      if (err) {
        console.log("ERROR: ", err);
        return next(err); // Pass error to the next middleware
      }
      console.log("redirect to login after logout");
      req.flash("error", "Please log in as a customer.");
      return res.redirect("/users/login");
    });
  } else {
    next();
  }
}

//If authenticated redirect from login and register
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

//If not authenticated then redirect to login portal
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
