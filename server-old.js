const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/message', (req, res) => {
    res.json({ message: "Welcome to App page!" });
});

app.get('/homePageMessage', (req, res) => {
    res.json({ message: "Welcome to Home page!" });
});

app.post('/api/stuff', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({ message: 'Congratulations! ' + req.body['firstParam'] + req.body['secondParam'] });
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});