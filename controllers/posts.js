import Post from '../models/Post.js';

function postFields(body) {
  return Object.fromEntries(Object.entries(body ?? {}).filter(([key]) => ['name', 'description', 'age'].includes(key)));
}

export async function create(req, res) {
  const post = await Post.create({ ...postFields(req.body), owner: req.user.id });
  res.status(201).json(post);
}

export async function list(req, res) {
  res.json(await Post.find({ owner: req.user.id }).sort({ createdAt: -1 }));
}

export async function update(req, res) {
  const fields = postFields(req.body);
  if (!Object.keys(fields).length) return res.status(400).json({ error: 'Supply name, description or age.' });
  const post = await Post.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, { $set: fields }, { new: true, runValidators: true });
  if (!post) return res.status(404).json({ error: 'Post not found.' });
  res.json(post);
}

export async function remove(req, res) {
  const post = await Post.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!post) return res.status(404).json({ error: 'Post not found.' });
  res.sendStatus(204);
}
