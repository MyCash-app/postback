const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Route to handle postback
app.get('/postback', (req, res) => {
    const userId = req.query.user_id;
    const reward = req.query.reward;

    if (!userId || !reward) {
        return res.status(400).send('Missing parameters');
    }

    console.log(`Received postback for user ${userId} with reward ${reward}`);

    res.send('Postback received');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
