const express = require('express');
const path = require('path');
const app = express();

// Sert tous les fichiers statiques (html, css, js, vidéos, images)
app.use(express.static(path.join(__dirname)));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Ho putain ca part en direct sur http://localhost:${PORT}`);
});

// Ajoute ceci dans server.js pour le streaming vidéo
app.get('/video/:name', (req, res) => {
  const filePath = path.join(__dirname, 'assets', req.params.name);
  res.sendFile(filePath);
});