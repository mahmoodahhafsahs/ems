const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5000;


// MySQL connection setup
const db = mysql.createConnection({
  host: 'bzbz8rqcrmgxvqnuxe9e-mysql.services.clever-cloud.com',
  user: 'uckbcv6lahxyd8mk',
  password: 'BD2VNUBL6hLVua8HK2JV',
  database: 'bzbz8rqcrmgxvqnuxe9e',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle GET requests at the root
app.get('/', (req, res) => {
  res.send('Hello, this is the IRIS COMPANY server!');
});

// API to handle POST requests for adding employee data
app.post('/api/addEmployee', (req, res) => {
  const { name, salary, dob, age, currentAddress, permanentAddress, department, designation } = req.body;

  console.log('Received data:', req.body);

  const insertQuery = `INSERT INTO employees (name, salary, dob, age, currentAddress, permanentAddress, department, designation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    insertQuery,
    [name, salary, dob, age, currentAddress, permanentAddress, department, designation],
    (err, result) => {
      if (err) {
        console.error('Error inserting employee:', err);
        console.error('MySQL Error Code:', err.code);
        res.status(500).json({ success: false, error: err.message });
      } else {
        console.log('Employee added successfully');
        res.json({ success: true });
      }
    }
  );
});

// Add this code to check if the database is selected correctly
db.query('SELECT DATABASE()', (err, result) => {
  if (err) {
    console.error('Error selecting database:', err);
  } else {
    console.log('Selected database:', result[0]['DATABASE()']);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
