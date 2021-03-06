const functions = require("firebase-functions");

const admin = require("firebase-admin");
const serviceAccount = require("./byoo-af7e5-firebase-adminsdk-mlvaz-bc044bbeb5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://byoo-af7e5-default-rtdb.firebaseio.com",
});

exports.verifyIdToken = functions.https.onCall(async (data) => {
  return admin.auth().verifyIdToken(data, true)
         .catch((error)=>{
          return (error);           
         })
});  

exports.revokeRefreshTokens = functions.https.onCall(async (data) => {
  return admin.auth().revokeRefreshTokens(data)
});  

exports.deleteUser = functions.https.onCall(async (data) => {
    return admin.auth().deleteUser(data)
});  

exports.getUserByPhoneNumber = functions.https.onCall(async (data) => {
  return admin.auth().getUserByPhoneNumber(data)
});

exports.updateUser = functions.https.onCall(async (data) => {
  return admin.auth().updateUser(data[0], data[1])
});

exports.getUserByEmail = functions.https.onCall(async (data) => {
  return admin.auth().getUserByEmail(data)
});

exports.getUsers = functions.https.onCall(async (data) => {
  return admin.auth().getUsers(data)
});

exports.setCustomUserClaims = functions.https.onCall(async (data) => {
  return admin.auth().setCustomUserClaims(data, { admin: true })
});

exports.getUser = functions.https.onCall(async (data) => {
  return admin.auth().getUser(data)
});

exports.sendMail = functions.https.onCall(async (data) => {
  return admin.firestore().collection("mail").add({from: data[0], to: data[1], template: data[2]})
});