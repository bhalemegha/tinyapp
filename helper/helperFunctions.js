const bcrypt = require('bcryptjs');

//This method is usedd t ogenerate user Id and Short URl for long URLS
const generateRandomString = function() {
  let str = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = 6;
  //Generating indexes to pick char from char string
  for (let i = 0; i < charactersLength; i++) {
    str += characters.charAt(Math.floor(Math.random() *
      characters.length));
  }
  return str;
};

//Finds User by Id
const getUser = function(userId, users) {
  const currentUser = users[userId];
  if (!currentUser) {
    return {};
  }
  return currentUser;
};

//Adds user to Users object with autogenerated Id
const addUser = function(usr, password, users) {
  const id = generateRandomString();
  const newUser = { "id": id, "email": usr, "password": password };
  users[id] = newUser;
  return newUser;
};

//Returns User if his email exist
const getUserByEmail = function(email, users) {
  const values = Object.values(users);
  for (let user of values) {
    if (user.email === email) {
      return user;
    }
  }
  return;
};

//checks if user with email exist, checks for password, if matches returns User otherwise sends error message
const authenticateUser = function(email, password, users) {
  const user = getUserByEmail(email, users);
  if (!user) {
    return { cUser: null, error: "User not exist" };
  }

  if (!(bcrypt.compareSync(password, user.password))) {
    return { cUser: null, error: "User not exist" };
  }

  return { cUser: user, error: null };
};

//checks if user id exists in cookie, if it set in cookie, object.keys should have atleast one key
const isLoggedIn = function(user) {
  return Object.keys(user).length === 0;
};

const urlsForUser = function(id, urlDatabase) {//This function will filter the urls by user Id.
  let urlObj = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userId === id) {
      urlObj[url] = urlDatabase[url].longUrl;
    }
  }
  return urlObj;
};

//To filter URLs on the basis of user id and show url matched having short url
const getLongUrlForUser = function(userId, urlDatabase, shortUrl) {
  const urls = urlsForUser(userId, urlDatabase);
  if (!urls) {
    return {};
  }
  return urls[shortUrl];
};

//Adds http to long URL if not exist already so that it will redirected to the page properly
const getNewUrl = function(url) {
  if (!(url.includes("http"))) {
    return "http://" + url;
  }
  return url;
};

module.exports = { generateRandomString, getUser, addUser, authenticateUser, isLoggedIn, urlsForUser, getUserByEmail, getLongUrlForUser, getNewUrl };