import { Router } from 'express';
import userContoller from "./users/users.controller";

const api = Router()
  .use('/messages/',userContoller)

export default Router().use('/api', api);