const jwt = require("jsonwebtoken");
const Model = require("../models");
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
  verify:
    (...args) =>
    async (req, res, next) => {
      try {
        const roles = [].concat(args).map((role) => role.toLowerCase());
        const token = String(req.headers.authorization || "")
          .replace(/bearer|jwt/i, "")
          .replace(/^\s+|\s$/i, "");
        const decoded = jwt.verify(token, process.env.JWTSECRET)
        let doc;
        let role;
        if (roles.includes("user")) {
          role = "user";
          doc = await Model.User.findOne({
            _id: decoded.userId,
            email: decoded.email,
          });
        }
        if (!doc) throw new Error("You are not authenticated!");
        req[role] = doc;
        next();
      } catch (error) {
        console.log(error);
        return res
          .status(401)
          .json({ message:  "You are not authenticated!" });
      }
    },
};
