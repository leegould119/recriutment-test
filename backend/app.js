const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
require('./dbconfig/database');
const cors = require('cors');


// CORS - cross origin resource sharing
let whitelist = ['http://localhost:8080', 'http://localhost:8081'];
let corsOptionsDelegate = (req, cb) => {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  cb(null, corsOptions);
};
const corsMethod = {
  // origin: '*',
  methods: 'GET,HEAD,POST,PUT,PATCH, DELETE',
  credentials: true
};
// use cors
app.use(cors(corsOptionsDelegate));
// pre flight requests
app.options('*', cors(corsOptionsDelegate));

// FORM data
app.use(express.urlencoded({ extended: false }));
// JSON data
app.use(express.json());

app.get('/', (req, res) => {
  res.json('this is the api endpoint');
});

app.use('/auth', require('./routes/login-routes'));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
