import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const digest = token => createHash('sha256').update(token).digest('hex');

export async function register(req, res) {
  const { username, email, password } = req.body ?? {};
  if (typeof username !== 'string' || typeof email !== 'string' ||
      typeof password !== 'string' || password.length < 6 || Buffer.byteLength(password) > 72) {
    return res.status(400).json({ error: 'Supply a username, email and password of at least 6 characters and at most 72 bytes.' });
  }
  const user = await User.create({ username, email, passwordHash: await bcrypt.hash(password, 10) });
  res.status(201).json({ id: user.id, username: user.username, email: user.email });
}

export async function login(req, res) {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  const token = randomBytes(32).toString('hex');
  user.sessionHash = digest(token);
  user.expiresAt = new Date(Date.now() + 3600000);
  await user.save();
  res.json({ token, expiresAt: user.expiresAt });
}

export async function requireUser(req, res, next) {
  const match = /^Bearer ([a-f0-9]{64})$/i.exec(req.get('authorization') ?? '');
  const user = match && await User.findOne({ sessionHash: digest(match[1]), expiresAt: { $gt: new Date() } });
  if (!user) return res.status(401).json({ error: 'Log in to continue.' });
  req.user = user;
  req.sessionHash = digest(match[1]);
  next();
}

export async function logout(req, res) {
  await User.updateOne({ _id: req.user.id, sessionHash: req.sessionHash }, { $unset: { sessionHash: 1, expiresAt: 1 } });
  res.sendStatus(204);
}
