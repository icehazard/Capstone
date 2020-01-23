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

exports.socketFunctions = async socket => {
  async function auth(data) {
    if (!socket.handshake.query.token) return socket.emit("account", { error: "You must be Logged in" });
    const decoded = jwt.verify(socket.handshake.query.token, key.TOKEN_SECRET);
    return await User.findOne({ _id: decoded._id });
  }

  socket.on("apiMan", async data => {
    const user = await auth(data);
    if (!data.apiKey ) return socket.emit("apiMan", { email: user.email, _id: user._id, date: user.date, apiKey: user.apiKey, apiKeySecret: user.apiKeySecret });

    user.apiKey = data.apiKey;
    user.apiKeySecret = data.apiKeySecret;
    let updated = await user.save();
    console.log("i hit")
    socket.emit("apiMan", {  apiKey: user.apiKey, apiKeySecret: user.apiKeySecret  });
  });

  socket.on("account", async data => {
    const user = await auth(data);

    socket.emit("account", { email: user.email, _id: user._id, date: user.date });
  });

  socket.on("login", async data => {
    const validation = schema.validate(data);
    if (validation.error) return socket.emit("login", { error: validation.error.details[0].message });

    const foundOne = await User.findOne({ email: data.email });
    if (!foundOne) return socket.emit("login", { error: "Email does not exist" });

    const valiPass = await bcrypt.compare(data.password, foundOne.password);
    if (!valiPass) return socket.emit("login", { error: "Password is incorrect" });

    socket.emit("login", { success: "True", token: foundOne.token, email: foundOne.email, _id: foundOne._id });
  });

  socket.on("registration", async data => {
    let validation = schema.validate(data);
    if (validation.error) return socket.emit("registration", { error: validation.error.details[0].message });
    if (await User.findOne({ email: data.email })) return socket.emit("registration", { error: "Email has already been registered" });

    const salt = await bcrypt.genSalt(10);
    const userId = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.password, salt);
    const token = jwt.sign({ _id: userId, email: data.email }, key.TOKEN_SECRET);

    const user = new User({
      _id: userId,
      email: data.email,
      password: hashPassword,
      token: token
    });

    let userSaved = await user.save();
    socket.emit("registration", { success: "True", _id: userId, token: userSaved.token, email: userSaved.email });
  });
};
