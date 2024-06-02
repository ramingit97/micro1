import 'dotenv/config';
import 'reflect-metadata';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './modules';
import { NextFunction, Request, Response } from "express";

export const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(getLanguage);
app.use(morgan('combined'));

app.use('/', routes);

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('errorHandler here')
}
app.use(errorHandler);

const port =  9003;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

