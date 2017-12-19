const functions = require('firebase-functions');
const Firestore = require('@google-cloud/firestore');

// Since this code will be running in the Cloud Functions enviornment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
const firestore = new Firestore();

// Create a new function which is triggered on changes to /status/{uid}
// Note: This is a Realtime Database trigger, *not* Cloud Firestore.
exports.onUserStatusChanged = functions.database
    .ref("/users/{uid}").onUpdate((event) => {
        // Get the data written to Realtime Database
        const eventStatus = event.data.val(); // contain the data
        const userStatusFirestoreRef = firestore.doc(`users/${event.params.uid}`);
        return event.data.ref.once("value").then((statusSnapshot) => {
            return statusSnapshot.val();
        }).then((status) => {
            return userStatusFirestoreRef.update({
                isOnline: false
            });
        });
    });