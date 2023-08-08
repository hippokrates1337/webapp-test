const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Test app successfully deployed!');
});

app.listen(port, () => {
  console.log('App is listening on port ${PORT}');
});
