import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';

const SECRENT_KEY_TOKEN = ''; // generat for me

const app = express();

app.use(express.json());

const users = [];

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // mininum should at least 10
  users.push({ username, password: hashedPassword });
  res.status(201).send('User registered');
  console.log(users);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username == username);
  if (!user) {
    res.status(404).send('Wrong username');
  }
  
  // const token = jwt.sign({username: user.username}, SECRENT_KEY_TOKEN, {expiresIn: '1h'});
  var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
  console.log(token);
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    res.status(401).send('Wrong password');
  }
  res.status(200).send('Logged in');
  
})

app.listen(3000, () => {
  console.log('Server started on port 3000');
});