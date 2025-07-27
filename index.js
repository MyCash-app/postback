const express = require('express');
const admin = require('firebase-admin');
const app = express();
const port = process.env.PORT || 3000;

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

app.get('/postback', async (req, res) => {
  const userId = req.query.user_id;
  const rewardAmount = parseInt(req.query.reward) || 0;

  if (!userId || rewardAmount <= 0) {
    return res.status(400).send('Invalid parameters');
  }

  try {
    const db = admin.database();
    const userRef = db.ref(`users/${userId}/points`);
    const snapshot = await userRef.once('value');
    const currentPoints = snapshot.val() || 0;

    await userRef.set(currentPoints + rewardAmount);
    res.status(200).send('OK');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', (req, res) => {
  res.send('Postback Server is Running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});