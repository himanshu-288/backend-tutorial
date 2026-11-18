import { Router } from 'express';
import { register, login, logout, requireUser } from '../controllers/users.js';
import { create, list, update, remove } from '../controllers/posts.js';

const api = Router();
api.post('/users/register', register);
api.post('/users/login', login);
api.post('/users/logout', requireUser, logout);
api.use('/posts', requireUser);
api.post('/posts/create', create);
api.get('/posts/getPosts', list);
api.patch('/posts/update/:id', update);
api.delete('/posts/delete/:id', remove);
export default api;
