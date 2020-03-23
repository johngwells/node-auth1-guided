module.exports = (req, res, next) => {
  // check that we remember the client
  // that the client logged in already
  console.log('session', req.session);
  req.session && req.session.user
  ? next()
  : res.status(401).json({ you: 'shall not pass' });
};
