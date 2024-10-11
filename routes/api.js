const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post('/api/votes', async (req, res) => {
  try {
    const { upvoteCount, downvoteCount, index, username } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (index < 0 || index >= user.secret.length) {
      return res.status(400).json({ error: 'Invalid secret index' });
    }

    user.secret[index].upvote = upvoteCount;
    user.secret[index].downvote = downvoteCount;

    await user.save();

    res.json({ message: 'Vote updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
