import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"danotes-6f43f","appId":"1:301948997095:web:5ab50cf05573b8456a8142","storageBucket":"danotes-6f43f.firebasestorage.app","apiKey":"AIzaSyBZbLKpjrLfApAlNAmioIYudqQvMKWkQTY","authDomain":"danotes-6f43f.firebaseapp.com","messagingSenderId":"301948997095"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
