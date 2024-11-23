const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

// Koneksi Database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pertanianais',
  timezone: 'JST', // Ubah zona waktu menjadi JST untuk menggunakan waktu Indonesia
});

db.connect((err) => {
  if (err) throw err;
  console.log('Database Connected!');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public')); // Ubah direktori statis menjadi 'public' untuk mengakses template Bootstrap
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  const sql = 'SELECT * FROM data_pertanian';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('index', { data: results });
  });
});

app.get('/add', (req, res) => res.render('add'));

app.post('/add', (req, res) => {
  const { nama, jenis, jumlah, tanggal } = req.body;
  const sql = 'INSERT INTO data_pertanian SET ?';
  const data = { nama, jenis, jumlah, tanggal };
  db.query(sql, data, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.get('/edit/:id', (req, res) => {
  const sql = `SELECT * FROM data_pertanian WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.render('edit', { item: result[0] });
    } else {
      res.status(404).send('Data not found');
    }
  });
});

app.post('/edit/:id', (req, res) => {
  const { nama, jenis, jumlah, tanggal } = req.body;
  const sql = `UPDATE data_pertanian SET ? WHERE id = ${req.params.id}`;
  const data = { nama, jenis, jumlah, tanggal };
  db.query(sql, data, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.get('/delete/:id', (req, res) => {
  const sql = `DELETE FROM data_pertanian WHERE id = ${req.params.id}`;
  db.query(sql, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Jalankan Server
app.listen(3000, () => console.log('Server running at http://localhost:3000'));

// Tambahkan header untuk setiap request
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});
