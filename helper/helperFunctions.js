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

const isUser = function(user) {
  if (!user) {
    return { error : "User not found", user : null}
  }
  return {user : user, error : null}
};

const addUser = function(usr,password) {
  const id = generateRandomString();
  const newUser = {"id" : id, "email" : usr, "password" : password};
  return newUser;
};

module.exports = { generateRandomString, isUser, addUser};