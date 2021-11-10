const express = require("express");
const cookieParser = require("cookie-parser");

//const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080

// set the view engine to ejs
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Getting random string of length 6
function generateRandomString() {
  var str = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = 6;
  for (var i = 0; i < charactersLength; i++) {
    str += characters.charAt(Math.floor(Math.random() *
    characters.length));    
  }
  return str;
}

app.use(express.urlencoded({ extended: true })); //Used for body parser
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.get("/urls/new", (req, res) => {
  res.cookie("userName", req.body.username);
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  const shortStr = generateRandomString();
   urlDatabase[shortStr] = req.body['longURL'];
   res.redirect("/urls");
});


app.get("/urls", (req, res) => {
  console.log("In get url");
  let userName = req.cookies["userName"];
  console.log(userName);
  if(typeof userName == 'undefined' || userName === null){
    userName = null;
    console.log("In if to set username as null initially");
  }
  const templateVars = { userName : req.cookies["userName"], 
  urls: urlDatabase };
  console.log("Set Vars for templates ",  templateVars.userName);
  res.render("urls_index", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params['shortURL'];
  const templateVars = { userName : req.cookies["userName"], shortURL: shortURL, longURL: `${urlDatabase[shortURL]}` };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => { 
  const shortURL = req.params['shortURL'];
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL",(req,res) =>{
  const shortURL = req.params['shortURL'];
  console.log("Updating " + shortURL + " for " + urlDatabase[shortURL]);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete",(req,res) =>{
  const shortURL = req.params['shortURL'];
  console.log("Deleting " + shortURL + " for " + urlDatabase[shortURL]);
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/login",(req,res) => {
  console.log("in /login---" ,req.body);
  res.cookie("userName", req.body.userName);
  res.redirect("/urls");
});