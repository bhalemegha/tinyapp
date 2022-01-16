const express = require("express");
const { generateRandomString, getUser, addUser, authenticateUser, isLoggedIn, urlsForUser, getUserByEmail, getLongUrlForUser, getNewUrl } = require("./helper/helperFunctions");
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const { urlDatabase, users } = require("./data/tinyDB");
const app = express();
const PORT = 8080; // default port 8080

// set middleware functions
app.set('view engine', 'ejs');  //for ejs templates
app.use(express.urlencoded({ extended: true })); //Used for body parser
app.use(cookieSession({ //used for session cookies
  name: 'session',
  keys: ['key1', 'key2']
}));

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/urls/new", (req, res) => {
  const user = getUser(req.session.user_id, users);
  //If we don't find User, means cookies not set . Hence user is not logged In.
  if (isLoggedIn(user)) { //If user is not exist, redirect to register
    return res.redirect("/login");
  }
  const templateVars = {
    email: user.email
  };
  return res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  const user = getUser(req.session.user_id, users);
  //Check if cookies exist to find if user is already loggedIn, if not, send to register page.
  if (isLoggedIn(user)) {
    return res.redirect("/login");
  }
  const shortStr = generateRandomString();  //generating short URl for Long URL
  const url = req.body['longURL'];
  const longUrl = getNewUrl(url);//Add http only if not added to url earlier
  const newUrlObj = { longUrl: longUrl, userId: user.id };
  urlDatabase[shortStr] = newUrlObj;
  return res.redirect("/urls");
});


app.get("/urls", (req, res) => {

  const user = getUser(req.session.user_id, users);
  if (isLoggedIn(user)) {  //check if user is logged in, cookies will exist if already logged In.
    return res.send("Please log in or register first");
  }
  const urls = urlsForUser(user.id, urlDatabase);//to Show filtered urls that belonged to logged In user
  const templateVars = {
    user: user.id,
    email: user.email,
    urls: urls
  };
  res.render("urls_index", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params['shortURL'];
  const user = getUser(req.session.user_id, users);
  if (isLoggedIn(user)) {  //check if user is logged in, cookies will exist if already logged In.
    return res.send("Please log in or register first");
  }
  const longUrl = getLongUrlForUser(user.id, urlDatabase, shortURL);
  if (!longUrl) {
    return res.send("Bad request");
  }
  const templateVars = { email: user.email, shortURL: shortURL, longURL: longUrl };
  res.render("urls_show", templateVars);
});

//To redirect users to long URl if they click shortURl
app.get("/u/:shortURL", (req, res) => {
  const user = getUser(req.session.user_id, users);
  if (isLoggedIn(user)) {
    return res.redirect("/login");
  }
  const shortURL = req.params['shortURL'];
  const longURL = urlDatabase[shortURL].longUrl;
  res.redirect(longURL);
});

//to update longURl
app.post("/urls/:shortURL", (req, res) => {
  const user = getUser(req.session.user_id, users);
  if (isLoggedIn(user)) {
    return res.redirect("/login");
  }
  const shortURL = req.params['shortURL'];
  const longUrl = getNewUrl(req.body.longURL);//Add http only if not added to url earlier
  urlDatabase[shortURL].longUrl = longUrl; //updated longUrl
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const user = getUser(req.session.user_id, users);
  if (isLoggedIn(user)) {
    return res.redirect("/login");
  }
  const shortURL = req.params['shortURL'];
  console.log("Deleting " + shortURL + " for " + urlDatabase[shortURL]);
  delete urlDatabase[shortURL]; //Delete the short url data with id = shortURl

  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const id = req.body;
  const user = getUser(id, users);
  const templateVars = { email: user.email };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.send("Username or password fields are blank. Please fill in.");
  }
  const { cUser, error } = authenticateUser(email, password, users);
  if (error) {
    console.log(error);
    return res.send("Not a Valid User ");
  }
  req.session.user_id = cUser.id;
  return res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  return res.redirect("/urls");
});

app.get("/register", (req, res) => {
  res.render("registration_form");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.send("Username or password fields are blank. Please fill in.");
  }
  const cUser = getUserByEmail(email, users);
  if (cUser) {
    res.statusCode = 400;
    return res.send(res.statusCode + " Not a valid request!");
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = addUser(email, hashedPassword, users);
  req.session.user_id = user.id;
  return res.redirect("/urls");
});

app.get("*", (req, res) => res.redirect("/login"));

app.listen(PORT, () => {
  console.log(`Server started....Tiny app listening on port ${PORT}!`);
});