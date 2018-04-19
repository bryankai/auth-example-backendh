const db = require('../../db')
const bcrypt = require('bcrypt-as-promised')

//////////////////////////////////////////////////////////////////////////////
// Basic CRUD Methods
//////////////////////////////////////////////////////////////////////////////

function getOneByUserName(username){
  return (
    db('users')
    .where({ username })
    .first()
  )
}

//////////////////////////////////////////////////////////////////////////////
// Create a user
//
// 1. Check to see if user already exists
//   a. if so, return a 400 with appropriate error message
// 2. Hash password
// 3. Insert record into database
// 4. strip hashed password away from object
// 5. "return/continue" promise
//////////////////////////////////////////////////////////////////////////////

function create(username, password){
  return getOneByUserName (username)
  .then(function(data) {
    if(data) throw{status: 400, message: 'Username already exists'}
    console.log('first then')
    return bcrypt.hash(password, 5)
  })
  .then(function(encryptedPassword) {
    console.log('second then')
    return db('users')
      .insert({username, password: encryptedPassword})
      .returning('*')
  })
  .then(function([data]) {
    console.log('third then')
    delete data.password
    console.log(data)
    return data
  })
}

module.exports = {
  getOneByUserName,
  create
}
