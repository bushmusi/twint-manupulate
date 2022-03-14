const express = require('express');
const cors = require('cors');

const app = express();

const db = require('./app/models/index.js');

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database success!'); // eslint-disable-line
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err); // eslint-disable-line
    process.exit();
  });

const corsOptions = {
  origin: 'http://localhost:8081',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to twint application.' });
});

app.use('/api/arsenal', require('./app/routes/arsenal.routes.js'));
app.use('/api', require('./app/routes/analyse.routes.js'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`); // eslint-disable-line
});
