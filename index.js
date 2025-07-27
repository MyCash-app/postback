const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get, update } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyAOUtJECbGrjuF1VnEebZWPfoE0iUGDOO0",
  authDomain: "tapy-9914d.firebaseapp.com",
  databaseURL: "https://tapy-9914d-default-rtdb.firebaseio.com",
  projectId: "tapy-9914d",
  storageBucket: "tapy-9914d.appspot.com",
  messagingSenderId: "334256084172",
  appId: "1:334256084172:web:fee43356d76a985f539e69"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

app.get('/postback', async (req, res) => {
    const userId = req.query.user_id;
    const reward = parseInt(req.query.reward);

    if (!userId || !reward) {
        return res.status(400).send('Missing parameters');
    }

    console.log(`Received postback for user ${userId} with reward ${reward}`);

    try {
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const currentPoints = snapshot.val().points || 0;
            const newPoints = currentPoints + reward;

            await update(userRef, { points: newPoints });

            console.log(`Updated user ${userId} points to ${newPoints}`);
            res.send(`User ${userId} rewarded with ${reward} points`);
        } else {
            console.log(`User ${userId} not found`);
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error updating user points:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
