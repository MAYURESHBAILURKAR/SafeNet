// server/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../users/users.schema');
const bcrypt = require('bcryptjs'); // For encrypting passwords
const jwt = require('jsonwebtoken'); // For creating the token

// 1. REGISTER USER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
// console.log(name, email, password);

  try {
    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. Create new user
    user = new User({ username:name, email, password });
console.log(user);
    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. Save to DB
    await user.save();

    // 5. Return Token (Auto-Login)
    const payload = { user: { id: user.id } };
    jwt.sign(payload, 'secret', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 2. LOGIN USER
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // console.log(user);
    // console.log(await bcrypt.decodeBase64.user.password);
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate Token (The "Passport" for the app)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretKey123', { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;