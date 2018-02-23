import Router from 'koa-router';
import userRouter from './users.controler';


const configurePublic = () => {
  const publicRouter = Router();
  publicRouter.use(userRouter());
  return publicRouter.routes();
};

export default configurePublic;
