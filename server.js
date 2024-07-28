const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// ຕັ້ງຄ່າ MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'shounote'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database.');
});

// API ສຳຫລັບເພີ່ມຜູ້ໃຊ້
app.post('/users', (req, res) => {
  const { name, password } = req.body;
  const query = 'INSERT INTO users (name, password) VALUES (?, ?)';

  connection.query(query, [name, password], (err, results) => {
    if (err) throw err;
    res.send({ id: results.insertId, name, password });
  });
});

// API ສຳຫລັບກວດຜູ້ໃຊ້
app.post('/login', (req, res) => {
  const { name, password } = req.body;
  const query = 'SELECT * FROM users WHERE name = ? AND password = ?';

  connection.query(query, [name, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.send({ success: true, user: results[0] });
    } else {
      res.send({ success: false, message: 'Invalid credentials' });
    }
  });
});

// API ດືງຂໍ້ມູນຜູ້ໃຊ້
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';

  connection.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// ເຊີບເວີ
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
