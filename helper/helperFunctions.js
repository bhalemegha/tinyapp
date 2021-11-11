const users = {
  dsdsd:{
    'id': 'dsdsd',
    'email':'a@b.com',
    'password' : 'test123'
  }
};
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

const getUser = function (userId) {
  const currentUser = users[userId];
  if (!currentUser) {
    return {};
  }
  return currentUser;
};

const addUser = function (usr, password) {
  const id = generateRandomString();
  const newUser = { "id": id, "email": usr, "password": password };
  users[id] = newUser;
  console.log(JSON.stringify(users));
  return newUser;
};

const authenticateUser = function(email, password) {
  for (let usr in users) {
    if ((users[usr].email === email) && users[usr].password === password) {
      return {cUser : users[usr], error : null};
    }
  }
  return {cUser : null, error : "User not exist"};
}

const isValid = function (email, password) {
  for (let usr in users) {
    console.log((users[usr].email === email));
    if (((users[usr].email === email))
      || email === "" || password === "") {
      return false;
    }
    return true;
  }
}

module.exports = { generateRandomString, getUser, addUser, isValid, authenticateUser };