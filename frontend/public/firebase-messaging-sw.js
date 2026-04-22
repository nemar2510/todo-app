importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAykCUndoC1imlNXhqf7adr1WgmQtI_nus",
  authDomain: "todo-app-9e1c6.firebaseapp.com",
  projectId: "todo-app-9e1c6",
  messagingSenderId: "461046385766",
  appId: "1:461046385766:web:e683210efd31ac5c0bb1a7"
});

const messaging = firebase.messaging();

// 🔔 BACKGROUND NOTIFICATION
messaging.onBackgroundMessage(function (payload) {
  console.log("📩 Background message:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});