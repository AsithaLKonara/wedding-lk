// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  showInstallButton();
});

function showInstallButton() {
  // Show install button or banner
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.style.display = 'block';
    installButton.addEventListener('click', installApp);
  }
}

function installApp() {
  if (deferredPrompt) {
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  }
}

// PWA Update Available
window.addEventListener('sw-update-available', () => {
  // Show update notification
  const updateButton = document.getElementById('update-button');
  if (updateButton) {
    updateButton.style.display = 'block';
    updateButton.addEventListener('click', () => {
      window.location.reload();
    });
  }
});

// PWA Offline Detection
window.addEventListener('online', () => {
  console.log('App is online');
  // Hide offline indicator
  const offlineIndicator = document.getElementById('offline-indicator');
  if (offlineIndicator) {
    offlineIndicator.style.display = 'none';
  }
});

window.addEventListener('offline', () => {
  console.log('App is offline');
  // Show offline indicator
  const offlineIndicator = document.getElementById('offline-indicator');
  if (offlineIndicator) {
    offlineIndicator.style.display = 'block';
  }
});

// PWA Background Sync
if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
  // Register background sync
  navigator.serviceWorker.ready.then((registration) => {
    return registration.sync.register('background-sync');
  });
}

// PWA Push Notifications
function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted');
        // Subscribe to push notifications
        subscribeToPush();
      } else {
        console.log('Notification permission denied');
      }
    });
  }
}

function subscribeToPush() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then((registration) => {
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY
      });
    }).then((subscription) => {
      console.log('Push subscription:', subscription);
      // Send subscription to server
      fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });
    });
  }
}

// Initialize PWA features
document.addEventListener('DOMContentLoaded', () => {
  // Request notification permission on user interaction
  const enableNotificationsButton = document.getElementById('enable-notifications');
  if (enableNotificationsButton) {
    enableNotificationsButton.addEventListener('click', requestNotificationPermission);
  }
});

// PWA Analytics
function trackPWAEvent(eventName, data = {}) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      event_category: 'PWA',
      ...data
    });
  }
}

// Track PWA install
window.addEventListener('appinstalled', () => {
  trackPWAEvent('pwa_installed');
});

// Track PWA engagement
window.addEventListener('beforeunload', () => {
  trackPWAEvent('pwa_engagement', {
    time_on_site: Date.now() - window.performance.timing.navigationStart
  });
});