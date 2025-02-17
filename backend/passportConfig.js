const LocalStrategy = require("passport-local").Strategy;
const { authenticate } = require("passport"); //
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { query } = require("express");

// this function is used by passport to query our local database and validate user
//the authenticateUser is triggered when 'local' is called by passport.authenticate()
function initialize(passport) {
  const authenticateUser = (req, email, password, done) => {
    const table = req.body.role; //doubtful on the const use check that out
    console.log("INSIDE AUTH, table: ", table);

    pool.query(
      `select * from ${table} where email = $1`,
      [email],
      (err, results) => {
        if (err) {
          console.error("Database querry error: ");
          return done(null, false, {
            message: "The role has not been selected.",
          }); // pass err to passport instead of crashing the server
        }
        //console.log(results.rows);
        if (results.rows.length > 0) {
          console.log("Authentication ongoing.");
          const user = results.rows[0];
          console.log(user);
          user.role = table;
          //add order_id for the session
          pool
            .query(`SELECT id FROM orders ORDER BY id DESC LIMIT 1`)
            .then((result) => {
              const lastId = result.rows.length > 0 ? result.rows[0].id : 0;
              user.order_id = lastId + 1;
              console.log("New Order ID:", user.order_id);
            })
            .catch((err) =>
              console.error("Error fetching last order ID:", err)
            );

          //HERE WE ARE ADDING user.role
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              throw err;
            }
            if (isMatch) {
              console.log("Authentication success!");
              return done(null, user); //return session cookie
            } else {
              console.log("Authentication failed, inncorrect password.");
              return done(null, false, { message: "incorrect password" });
            }
          });
        } else {
          console.log("Invalid email!");
          return done(null, false, { message: "Email is not registerd." });
        }
      }
    );
  };
  //the flash messages are automatically req.flash() by passport
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      authenticateUser
    )
  );
  console.log("inside passport config.");
  //Then we save the user id and password as a session in the server or database
  //idk where this is used tbh, there is a bit issue with this file but the authenticate user works so i guess
  passport.serializeUser((user, done) =>
    done(null, { id: user.id, role: user.role, order_id: user.order_id })
  );
  passport.deserializeUser((sessionData, done) => {
    console.log("session data from deserializeUser");
    console.log(sessionData);
    const table = sessionData.role;
    pool.query(
      `select * from ${table} where id = $1`,
      [sessionData.id],
      (err, results) => {
        if (err) {
          throw err;
        } else {
          let user = results.rows[0];
          user.role = sessionData.role;
          user.order_id = sessionData.order_id; // finally saved to the session data for retrieval
          return done(null, user);
        }
      }
    );
  });
}

module.exports = initialize;
