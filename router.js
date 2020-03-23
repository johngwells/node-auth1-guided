const bcrypt = require('bcryptjs')

const router = require('express').Router();

const Users = require('./users/users-model');

router.post('/register', (req, res) => {
  // const { username, password } = req.body;
  const userInfo = req.body;

  // the password will be hashed & re-hashed 2 ^ 8 times
  const ROUNDS = process.env.HASHING_ROUNDS || 8
  const hash = bcrypt.hashSync(userInfo.password, ROUNDS);

  userInfo.password = hash;

  Users.add(userInfo)
    .then(users => res.json(users))
    .catch(err => res.send(err));
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .then(([user]) => {
      console.log('user', user)
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = {
          id: user.id,
          username: user.username
        };
  
        res.status(200).json(user)
      } else {
        res.status(401).json({ message: 'invalid credentials' })
      }
    })
    .catch(err => res.status(500).json(err));

})

router.get('/logout', (req, res) => {
  req.session ?
    req.session.destroy(error => {
      error
        ? res.status(500).json({ message: 'try again'})
        : res.status(200).json({ message: 'logged out successfully'})
    }) :
    res.status(200).json({message: 'already logged out' })
});

module.exports = router;