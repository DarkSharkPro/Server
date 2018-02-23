import jwt from 'jsonwebtoken';
import Router from 'koa-router';

import config from '../config/index';
import db from '../models/index';
import ensureToken from '../middlewares/ensureToken';

const userSignupControler = async (ctx) => {
  const { username, email, password } = ctx.request.body;
  const user = new db.User({
    username,
    email,
    password,
  });

  // create token
  try {
    const newUser = await user.save();
    ctx.status = 200;
    ctx.body = {
      success: true,
      message: `You signed up as ${newUser.username} and now you sould to login`,
    };
  } catch (err) {
    ctx.status = 403;
    const { username: userErr, email: emailErr } = err.errors;
    const message = userErr ? userErr.message : emailErr.message;
    ctx.body = {
      message,
    };
  }
};

const userLoginControler = async (ctx) => {
  const { username, password } = ctx.request.body;
  try {
    const user = await db.User.findOne({ username })
    if (user.checkPassword(password)) {
      ctx.status = 200;
      const token = jwt.sign({ _id: user._id }, config.secret);
      ctx.body = {
        authenticated: true,
        username: user.username,
        token,
      };
    } else {
      ctx.status = 401;
      ctx.body = {
        authenticated: false,
        message: 'Invalid password',
      };
    }
  } catch (e) {
    ctx.status = 401;
    ctx.body = {
      authenticated: false,
      message: 'Invalid user name',
    };
  }
};

const getUserData = async (ctx) => {
  const { token } = ctx.request.body;
  try {
    const { _id } = await jwt.verify(token, config.secret);
    const { username } = await db.User.findOne({ _id });
    ctx.status = 200;
    ctx.body = {
      authenticated: true,
      username,
    };
  } catch (e) {
    ctx.status = 401;
    ctx.body = {
      authenticated: false,
      err: `cannot veryfy ${token}`,
    };
  }
};

export default function userRouter() {
  const router = Router();
  router.post('/signup', userSignupControler);
  router.post('/login', userLoginControler);
  router.get('/getuserdata', ensureToken, getUserData);
  return router.routes();
}

