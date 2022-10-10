import express from 'express';
import nunjucks from 'nunjucks';
import { handleIndexGetRequest } from './endpoints/get/index';
import { handleUserPostRequest } from './endpoints/post/user';
import { handleHomeGetRequest } from './endpoints/get/home';

const app = express();

nunjucks.configure('src/pages', {
  autoescape: true,
  express: app
});

app.get('/home', handleHomeGetRequest);
app.post('/user', handleUserPostRequest);
app.get('/', handleIndexGetRequest);

app.listen(process.env.PORT ?? 3000, () => {
  console.log('Running...');
});