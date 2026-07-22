importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyADEqZXHbG9uNUowuYhNOlztU2Xai06Wr4", 
    authDomain: "modga1.firebaseapp.com",
    projectId: "modga1",
    storageBucket: "modga1.firebasestorage.app",
    messagingSenderId: "643764984083",
    appId: "1:643764984083:web:ef07fd1bc6b8b2cb2b62e6"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 1️⃣ 處理背景推播顯示 (加上按鈕與大圖)
messaging.onBackgroundMessage(function(payload) {
    console.log('[sw.js] 收到背景推播: ', payload);

    // 🚨 這裡已經改為讀取 payload.data，避免 undefined 錯誤！
    const data = payload.data || {};
    const notificationTitle = data.title || 'Hami Video 通知';
    
    const notificationOptions = {
        body: data.body || '您有新的專屬訊息，請點擊查看',
        icon: '/favicon.ico', 
        image: data.image, // 大圖
        requireInteraction: true,
        // 🔽 兩顆按鈕：觀賞與訂閱
        actions:[
            { action: 'watch', title: '▶️ 觀賞' },
            { action: 'download', title: '⬇️ 訂閱' }
        ],
        // 🔽 將後端傳來的網址資料塞進通知，供點擊時使用
        data: data 
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 2️⃣ 監聽使用者的點擊動作
self.addEventListener('notificationclick', function(event) {
    console.log('[sw.js] 通知被點擊，Action:', event.action);

    event.notification.close();

    const videoUrl = event.notification.data?.videoUrl || 'https://hamivideo.hinet.net/';
    const downloadUrl = event.notification.data?.downloadUrl || 'https://hamivideo.hinet.net/';

    if (event.action === 'watch') {
        event.waitUntil(clients.openWindow(videoUrl)); 
    } else if (event.action === 'download') {
        event.waitUntil(clients.openWindow(downloadUrl)); 
    } else {
        // 點擊卡片本體預設開啟觀看網址
        event.waitUntil(clients.openWindow(videoUrl)); 
    }
});