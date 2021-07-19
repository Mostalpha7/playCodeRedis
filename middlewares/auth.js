const { UserSchema } = require("../models");
const Auth = async(req, res, next) => {
    const email = req.body.email;
    const user = await UserSchema.findOne({ email });
    if (user) {
        req.user = user;
       return next();
    }

    return res.send("User not found!");
};

module.exports = {
    Auth,
};