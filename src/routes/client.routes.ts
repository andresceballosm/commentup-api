import express from 'express';
//import controllers
import { register } from '../controllers/client.controller';
const router = express.Router();

//routes
router.route('/register').post(register);

module.exports = router;
