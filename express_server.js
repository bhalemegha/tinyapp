const express = require("express");
const cookieParser = require("cookie-parser");
const { generateRandomString, getUser, addUser, isValid, authenticateUser, isLoggedIn, urlsForUser } = require("./helper/helperFunctions");
const { urlDatabase } = require("./data/tinyDB");
//const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); //Used for body parser
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls/new", (req, res) => {
  const user = getUser(req.cookies["user_id"]);
  //If we don't find User, means cookies not set . Hence user is not logged In. 
  if(isLoggedIn(user)) {
    return res.redirect("/register");
  }
  const templateVars = {
    email: user.email
  };
  return res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  const user = getUser(req.cookies["user_id"]);
  //Check if cookies exist to find if user is already loggedIn.
  if(isLoggedIn(user)) {
    return res.redirect("/register");
  }
  const shortStr = generateRandomString();
  const newUrlObj = {longUrl : req.body['longURL'], userId : user.id};
  urlDatabase[shortStr] = newUrlObj;
  res.redirect("/urls");
});


app.get("/urls", (req, res) => {
  const  user  = getUser(req.cookies["user_id"]);
  if(isLoggedIn(user)) {  //check if user is logged in, cookies will exist if already logged In.
    return res.send("Please log in or register first");
  }
  const urls = urlsForUser(user.id);
  const templateVars = {
    user: user.id,
    email:user.email,
    urls: urls
  };
  console.log("Set Vars for templates ", templateVars[urls]);
  res.render("urls_index", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params['shortURL'];
  const user = getUser(req.cookies["user_id"]);
  if(isLoggedIn(user)) {  //check if user is logged in, cookies will exist if already logged In.
    return res.send("Please log in or register first");
  }
  const templateVars = { email: user.email, shortURL: shortURL, longURL: `${urlDatabase[shortURL].longUrl}` };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params['shortURL'];
  const longURL = urlDatabase[shortURL].longUrl;
  res.redirect(longURL);
});

app.post("/urls/:shortURL", (req, res) => {
  const user = getUser(req.cookies["user_id"]);
  if(isLoggedIn(user)) {
    return res.redirect("/register");
  }
  const shortURL = req.params['shortURL'];
  console.log("Updating " + shortURL + " for " , urlDatabase[shortURL].longUrl);
  console.log("Setting short url----" , req.body.longURL);
  urlDatabase[shortURL].longUrl = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const user = getUser(req.cookies["user_id"]);
  if(isLoggedIn(user)) {
    return res.redirect("/register");
  }
  const shortURL = req.params['shortURL'];
  console.log("Deleting " + shortURL + " for " + urlDatabase[shortURL]);
  delete urlDatabase[shortURL];

  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const id = req.body;
  const user = getUser(id);
  const templateVars = { email:user.email };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const {email, password} = req.body; 
  console.log("login post Req " + email + " " + password)
  const { cUser, error } = authenticateUser(email , password);
  if (error) {
    console.log(error);
    return res.send("Not a Valid User");
  }
  res.cookie("user_id", cUser.id);
  return res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  console.log("in /logout---", req.body);
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  res.render("registration_form");
});

app.post("/register", (req, res) => {
  console.log(req.body);
	const { email, password } = req.body;
  if (!isValid(email,password)) {
    res.statusCode = 400;
    return res.send(res.statusCode + " Not a valid request!");
  }
  console.log({ email, password });

  const  data = addUser(email, password);
	res.cookie("user_id", data.id);
	return res.redirect("/urls");
});