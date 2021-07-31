const { sessionStore } = require("../app");

const sessionMiddleware = (req, res, next) => {
  if (req.session) {
    sessionStore.get(req.session.id, (err, session) => {
      if (!err) {
        if (session) {
          if (req.body.username === session.user.username) {
            console.log("sessionMiddleware", session.user);
            return res.json({ ...session.user });
          }
        }
      }
    });
  }
  console.log("no session");
  next();
};

module.exports = sessionMiddleware;
