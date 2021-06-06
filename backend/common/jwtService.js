const jwt = require("jsonwebtoken");
module.exports = {
  sign: function (data) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          userId: data.id,
          email: data.email,
        },
        process.env.JWTSECRET,
        { expiresIn: "1h" },
        function (err, token) {
          if (err) return reject(err);
          return resolve(token);
        }
      );
    });
  },
};
