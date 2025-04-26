// server.js
const express = require('express');
const db = require('./db');
const app = express();
const port = 3000;

app.use(express.json());

// Crear nuevo estudiante
app.post('/students', (req, res) => {
  const { name, age, email } = req.body;
  db.run(
    'INSERT INTO students (name, age, email) VALUES (?, ?, ?)',
    [name, age, email],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, age, email });
    }
  );
});

// Leer todos los estudiantes
app.get('/students', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Leer un estudiante por ID
app.get('/students/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Estudiante no encontrado' });
    res.json(row);
  });
});

// Modificar un estudiante
app.put('/students/:id', (req, res) => {
  const id = req.params.id;
  const { name, age, email } = req.body;
  db.run(
    'UPDATE students SET name = ?, age = ?, email = ? WHERE id = ?',
    [name, age, email, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Estudiante no encontrado' });
      res.json({ id, name, age, email });
    }
  );
});

// Eliminar un estudiante
app.delete('/students/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM students WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Estudiante no encontrado' });
    res.status(204).send();
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
