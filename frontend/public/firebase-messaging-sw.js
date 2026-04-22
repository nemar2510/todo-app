importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAykCUndoC1imlNXhqf7adr1WgmQtI_nus",
  authDomain: "todo-app-9e1c6.firebaseapp.com",
  projectId: "todo-app-9e1c6",
  storageBucket: "todo-app-9e1c6.firebasestorage.app", // 🔥 ADD THIS
  messagingSenderId: "461046385766",
  appId: "1:461046385766:web:e683210efd31ac5c0bb1a7"
});

const messaging = firebase.messaging();

// 🔔 background notifications
messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});