const express = require('express');
const mongoose = require('mongoose');

// Connect to MongoDB
const uri = "mongodb+srv://hts-nodejs:hts-nodejs@cluster0.mpvjwr4.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Create a schema for the user
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String
});

// Create a user model
const User = mongoose.model('User', userSchema);

// Create the Express app
const app = express();
app.use(express.json());

// Sign-up API
app.post('/api/signup', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    // Create a new user
    if(email === undefined || first_name === undefined || last_name === undefined || password === undefined) {
        throw "Empty values passed";
    }

    const user = new User({ first_name, last_name, email, password });
    await user.save();

    res.json({ message: 'User signed up successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'An error occurred while signing up' });
  }
});

// Sign-in API
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user with the provided email and password
    const user = await User.findOne({ email, password });

    if (user) {
      res.json({ message: 'Sign-in successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ error: 'An error occurred while signing in' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
 