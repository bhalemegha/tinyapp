const express = require("express");
const cookieParser = require("cookie-parser");
const { generateRandomString, isUser, addUser } = require("./helper/helperFunctions");

//const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080

// set the view engine to ejs
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let users = {};

app.use(express.urlencoded({ extended: true })); //Used for body parser
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls/new", (req, res) => {
  //res.cookie("user", req.cookies["user"]);
  const { user, error } = isUser(req.cookies["user"]);
  const templateVars = {
    user: user
  };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  const shortStr = generateRandomString();
  urlDatabase[shortStr] = req.body['longURL'];
  res.redirect("/urls");
});


app.get("/urls", (req, res) => {
  const { user, error } = isUser(req.cookies["user"]);
  const templateVars = {
    user: user,
    urls: urlDatabase
  };
  console.log("Set Vars for templates ", templateVars.user);
  res.render("urls_index", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params['shortURL'];
  const templateVars = { user: req.cookies["user"], shortURL: shortURL, longURL: `${urlDatabase[shortURL]}` };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params['shortURL'];
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params['shortURL'];
  console.log("Updating " + shortURL + " for " + urlDatabase[shortURL]);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params['shortURL'];
  console.log("Deleting " + shortURL + " for " + urlDatabase[shortURL]);
  delete urlDatabase[shortURL];

  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  console.log("in /login---", req.body);
  res.cookie("userName", req.body.userName);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  console.log("in /logout---", req.body);
  res.clearCookie("user");
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  res.render("registration_form");
});

app.post("/register", (req, res) => {
  const { usr, password } = req.body;
  const newUser = addUser(usr, password);
  users[newUser.id] = newUser;
  console.log("User Added: ", newUser);
  res.cookie("user", users[newUser.id]);
  res.redirect("/urls");
});