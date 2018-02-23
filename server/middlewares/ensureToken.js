const ensureToken = async (ctx, next) => {
  const header = ctx.headers['x-authorization-token'];
  try {
    const bearer = header.split(' ');
    const bearerToken = bearer[1];
    ctx.request.body.token = bearerToken;
    await next();
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      authenticated: false,
      err: 'token is undefined',
    };
  }
};

export default ensureToken;
