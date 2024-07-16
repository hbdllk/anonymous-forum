const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('database.db');

// Создаем таблицу, если ее нет
db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT
)`);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Получение всех постов
app.get('/api/posts', (req, res) => {
    db.all('SELECT * FROM posts', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ posts: rows });
    });
});

// Создание нового поста
app.post('/api/posts', (req, res) => {
    const { content } = req.body;
    db.run('INSERT INTO posts (content) VALUES (?)', [content], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
