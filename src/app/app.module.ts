import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import {HttpClientModule} from '@angular/common/http';

import { StdsModule } from '../pages/std/stds.module';//students Module
import { SupsModule } from '../pages/sup/sups.module';//supervisors Module

//import { SortingPipe } from '../pipes/sorting/sorting';
//import { PipesModule } from '../pipes/pipes.module';

import { Push } from '@ionic-native/push';
import { Badge } from '@ionic-native/badge';
import { HTTP } from '@ionic-native/http';
import { HttpModule } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NativeAudio } from '@ionic-native/native-audio';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Keyboard } from '@ionic-native/keyboard';



import { MyApp } from './app.component';

//import { MainPage } from '../pages/std/main/main';
//import { HelloIonicPage } from '../pages/std/hello-ionic/hello-ionic';
//import { LoginPage } from '../pages/login/login';
//import { SelectTaskPage } from '../pages/std/select-task/select-task';
//import { PointPage } from '../pages/std/point/point';
//import { DegreePage } from '../pages/std/degree/degree';
//import { ChatPage } from '../pages/std/chat/chat';
//import { ChatboxPage } from '../pages/std/chatbox/chatbox';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';


@NgModule({
  declarations: [
    MyApp
//    HelloIonicPage,
//    SelectTaskPage,
 //   PointPage,
 //   DegreePage,
 //   MainPage,
 //   ChatPage,
 //   ChatboxPage
  ],
  imports: [
    StdsModule,
    SupsModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
  //  PipesModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  //  HelloIonicPage,
  //  SelectTaskPage,
  //  PointPage,
  //  DegreePage,
  //  MainPage,
  //  ChatPage,
  //  ChatboxPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    Push,
    Badge,
    HTTP,
    InAppBrowser,
    NativeAudio,
    BarcodeScanner,
    Keyboard
  ]
})
export class AppModule {}
