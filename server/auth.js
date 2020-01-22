const User = require("./User.js");
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = require("./keys.js");

const schema = Joi.object({
  email: Joi.string()
    .email()
    .min(3)
    .required(),
  password: Joi.string()
    .min(8)
    .required()
});

exports.socketFunctions = function(socket) {

  socket.on("login", async data => {
    const validation = schema.validate(data);
    if (validation.error) return socket.emit("login", { error: validation.error.details[0].message });

    const foundOne = await User.findOne({ email: data.email });
    if (!foundOne) return socket.emit("login", { error: "Email does not exist" });

    const valiPass = await bcrypt.compare(data.password, foundOne.password);
    if (!valiPass) return socket.emit("login", { error: "Password is incorrect" });

    socket.emit("login", { success: "True", token: foundOne.token, email: foundOne.email, _id: foundOne._id});
  });


  socket.on("registration", async data => {
    let validation = schema.validate(data);
    if (validation.error) return socket.emit("registration", { error: validation.error.details[0].message });
    if (await User.findOne({ email: data.email })) return socket.emit("registration", { error: "Email has already been registered" });

    const salt = await bcrypt.genSalt(10);
    const userId = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.password, salt);
    const token = jwt.sign({_id: userId, email: data.email}, key.TOKEN_SECRET)

    const user = new User({
      _id: userId,
      email: data.email,
      password: hashPassword,
      token: token
    });

    let userSaved = await user.save()
    socket.emit("registration", { success: "True" , _id: userId, token: userSaved.token, email: userSaved.email});
  });
};
