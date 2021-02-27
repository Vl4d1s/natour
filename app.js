const express = require('express');
const fs = require('fs');
const app = express();

// express.json() is a middleware
app.use(express.json());

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     // automatically set the content-type header to 'application/json'
//     .json({ message: 'Hello from the server side!', app: 'Nature' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint');
// });

// converting json to js array of objects
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      // ES6 syntax = tours:tours
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);

  // trick to convert string to number
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // if (id > tours.length || id < 0) {
  if (!tour) {
    return res.status(404).json({ status: 'fail', massage: 'Invalid Id' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);

  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  const newId = { id: tours[tours.length - 1].id + 1 };
  const newTour = { ...newId, ...req.body };

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({ status: 'fail', massage: 'Invalid Id' });
  }
  const updatedTour = { ...tour, ...req.body };
  res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour,
    },
  });
});

app.delete('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({ status: 'fail', massage: 'Invalid Id' });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const port = 3000;
app.listen(port, () => console.log(`App running on port ${port}`));
