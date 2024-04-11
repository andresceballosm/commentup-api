import 'reflect-metadata';
import dotenv from 'dotenv';
import Server from './src/models/server.model';

dotenv.config();

const server = new Server();

server.listen();