const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

const users = [];

app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }
  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(409).json({ message: 'User already exists with this email' });
  }
  const newUser = { id: users.length + 1, username, email, password, createdAt: new Date() };
  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, username: newUser.username, email: newUser.email } });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
});

app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json(users.map(u => ({ id: u.id, username: u.username, email: u.email })));
  }
  const results = users.filter(u =>
    u.username.toLowerCase().includes(q.toLowerCase()) ||
    u.email.toLowerCase().includes(q.toLowerCase())
  );
  res.json(results.map(u => ({ id: u.id, username: u.username, email: u.email })));
});

app.put('/api/profile/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  const user = users.find(u => u.id === parseInt(id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (username) user.username = username;
  if (email) user.email = email;
  if (password) user.password = password;
  res.json({ message: 'Profile updated successfully', user: { id: user.id, username: user.username, email: user.email } });
});

app.delete('/api/user/:id', (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  users.splice(index, 1);
  res.json({ message: 'User deleted successfully' });
});

app.get('/', (req, res) => {
  res.send('NodeJS Express Server is running!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
