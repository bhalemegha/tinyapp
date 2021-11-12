const bcrypt = require('bcryptjs');

function generateRandomString() {
  var str = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = 6;
  //Generating indexes to pick char from char string
  for (var i = 0; i < charactersLength; i++) {
    str += characters.charAt(Math.floor(Math.random() *
      characters.length));
  }
  return str;
};


const getUser = function(userId, users) {
  const currentUser = users[userId];
  if (!currentUser) {
    return {};
  }
  return currentUser;
};

const addUser = function(usr, password, users) {
  const id = generateRandomString();
  const newUser = { "id": id, "email": usr, "password": password };
  users[id] = newUser;
  return newUser;
};

const getUserByEmail = function(email, users) {
  const values = Object.values(users);
  for (let user of values) {
    if (user.email === email) {
      return user;
    }
  }
  return;
}

const authenticateUser = function(email, password, users) {
  const user = getUserByEmail(email, users);
  if (!user) {
    return { cUser: null, error: "User not exist" };
  }

  if (!(bcrypt.compareSync(password, user.password))) {
    return { cUser: null, error: "User not exist" };
  }

  return { cUser: user, error: null };
}



const isValid = function(email, password, users) {

  for (let usr in users) {
    console.log((users[usr].email === email));
    if (((users[usr].email === email))
      || email === "" || password === "") {
      return false;
    }
  }
  return true;
}

function isLoggedIn(user) {
  return Object.keys(user).length === 0;
}

const urlsForUser = function (id, urlDatabase) {//This function will filter the urls by user Id.
  urlObj = {};
  for (let url in urlDatabase) {
    console.log(urlDatabase[url].longUrl)
    if (urlDatabase[url].userId === id) {
      urlObj[url] = urlDatabase[url].longUrl;
    }
  }
  console.log("before return---", urlObj)
  return urlObj;
}


module.exports = { generateRandomString, getUser, addUser, isValid, authenticateUser, isLoggedIn, urlsForUser , getUserByEmail, getUserByEmail};