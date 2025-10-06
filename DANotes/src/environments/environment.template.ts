// TEMPLATE FILE: Kopiere diese Datei als 'environment.ts' und trage deine Firebase-Konfiguration ein

export const environment = {
  production: false,
  firebase: {
    projectId: "your-project-id",
    appId: "your-app-id",
    storageBucket: "your-storage-bucket",
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    messagingSenderId: "your-messaging-sender-id"
  }
};

// Anweisungen:
// 1. Kopiere diese Datei und benenne sie in 'environment.ts' um
// 2. Ersetze alle "your-..." Werte mit deinen echten Firebase-Konfigurationsdaten
// 3. Die echte environment.ts Datei wird automatisch von Git ignoriert