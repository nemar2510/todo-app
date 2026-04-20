const webpush = require('web-push');

// 🔑 YOUR VAPID KEYS
const publicVapidKey = "BB_3RpNVIryPfLWB-edTxwgHQCyLCgslcJhhT-vrlIQf9qN23qD7-mIU1fxDB7uw-m8tCGjTCqUjn7oor0XecJA";
const privateVapidKey = "U3jUt7K2RmmW5w7ePp1zgNJDT_7OBkRfujkKg-jpEmk";

// setup push
webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);

// send notification function
const sendNotification = (subscription, data) => {
  return webpush.sendNotification(
    subscription,
    JSON.stringify(data)
  );
};

module.exports = {
  sendNotification,
  publicVapidKey
};