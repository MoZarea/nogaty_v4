import { Component, ViewChild } from '@angular/core';

import { App, Platform, MenuController, Nav, AlertController, Events } from 'ionic-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
//import { Badge } from '@ionic-native/badge';
import { InAppBrowser } from '@ionic-native/in-app-browser';


//import { HelloIonicPage } from '../pages/std/hello-ionic/hello-ionic';
//import { MainPage } from '../pages/std/main/main';
//import { LoginPage } from '../pages/login/login';
//import { SelectTaskPage } from '../pages/std/select-task/select-task';
import { SupChatPage } from '../pages/sup/sup-chat/sup-chat';
import { ChatPage } from '../pages/std/chat/chat';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthProvider } from '../providers/auth/auth';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  users: any;
  firstLoad = true;

  // make HelloIonicPage the root (or first) page
  rootPage = null;
  stdPages: Array<{title: string, component: any, icon: any, color: any, link: any}>;
  pages: Array<{title: string, component: any, icon: any, color: any, link: any}>;

  constructor(
    public app : App,
    private iab: InAppBrowser,
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public auth: AuthProvider,
    public push: Push,
    public alertCtrl: AlertController,
  //  private badge: Badge,
    public events: Events
  ) {
    this.initializeApp();

    this.events.subscribe('fetchData', (data) => {
      this.setFetchData(data);
    });
    this.events.subscribe('fetchSupData', (data) => {
      this.setFetchData(data);
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.auth.build().then((val:any) => {
        this.initPushNotification();
        if(this.auth.isLogin){
        //  this.initPushNotification();
        //  this.auth.setData('token',{"registrationId":"dAYqZnxexl8:APA91bGkpi_GA4iQjVbDezPLxVKtlWNTSvONe0-O4xlBWIMnq6YCR3rrShj_SQKMUs2RpwGmAdBCxhRWlOdMbFCSkEVIhMxCqNqZ6S31otqph61-BcJKnJWt5GrLXgVQKHz2weg5Rlqp","registrationType":"FCM"}).subscribe(val => console.log(val)); 
        this.setFetchData('');
        if(this.auth.is('std')){
          this.auth.getInfo({});
          this.firstLood('StdMainPage');
        //  this.auth.get_last_std_chats();
          this.auth.resumeStd();
        }else{
          this.auth.getInfoSup({});
          this.firstLood('SupMainPage');
        //  this.auth.get_last_sup_chats();
          this.auth.resumeSup();
        }

        }else{
          this.firstLood('LoginPage');
        }
    //    this.badge.set(10);
        
      });
     }, (err:any) => {
        this.firstLood('LoginPage');
      });

  }

  firstLood(page: any){
    this.nav.setRoot(page);
    this.statusBar.styleDefault();
    this.splashScreen.hide();
  }

  loadPages(){
    // set our app's pages
  //  let asso_id = this.users[0].info.asso_id;
    let twitter = this.users[0].info.twitter;
    let instagram = this.users[0].info.instagram;


    this.pages = [
      { title: 'الموقع', component: '', icon: 'globe', color: 'dark',link: "http://"+this.users[0].info.asso_id+".nogaty.com/" }
    ];
    
    if(twitter.length > 0)
      this.pages.push({ title: 'تويتر', component: '', icon: 'logo-twitter', color: 'primary', link: "https://twitter.com/"+this.users[0].info.twitter });
    
    if(instagram.length > 0)
      this.pages.push({ title: 'انستجرام', component: '', icon: 'logo-instagram', color: 'warning', link: "https://www.instagram.com/"+this.users[0].info.instagram });
  
    if(!this.auth.is('std'))
      this.pages.push({ title: 'لوحة التحكم', component: '', icon: 'globe', color: 'dark', link: "http://admin.nogaty.com/" });


    
    this.stdPages = [
      { title: 'ترتيب الطلاب', component: '', icon: 'globe', color: 'primary', link: "http://"+this.users[0].info.asso_id+".nogaty.com/orders" },
      { title: 'درجات الطلاب', component: '', icon: 'globe', color: 'primary', link: "http://"+this.users[0].info.asso_id+".nogaty.com/degrees" },
      { title: 'درجات المجموعات', component: '', icon: 'globe', color: 'primary', link: "http://"+this.users[0].info.asso_id+".nogaty.com/teams" },
      { title: 'البرنامج الإسبوعي', component: '', icon: 'globe', color: 'primary', link: "http://"+this.users[0].info.asso_id+".nogaty.com/weekly" },
      { title: 'عن الموقع', component: '', icon: 'globe', color: 'primary', link: "http://"+this.users[0].info.asso_id+".nogaty.com/vision" }
    ];
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
  //  this.nav.setRoot(page.component);
  /*
    if(this.auth.is('std'))
      this.nav.setRoot('StdMainPage');
    else
      this.nav.setRoot('SupMainPage');
      */
  }

  openSocail(link) {
    // close the menu when clicking a link from the menu
    this.menu.close();

    this.iab.create(link, '_system');
//  browser.close();
    
  //  window.open(link, '_system');
  }

  logout(){
    this.auth.setLogout();
    this.firstLoad = true;
    this.nav.setRoot('LoginPage').then(val => {
    //  this.firstLoad = true;
      this.menu.close();
      console.log('logout');
      this.auth.isLogin = false;
    });
  }

  setFetchData(data: any){
    try{
      this.users = new Array(this.auth.users);
      if(this.firstLoad){
        this.loadPages();
      }
    }catch(err) {
    }
    this.firstLoad = false;
  }

  ionViewDidLoad() {
    this.auth.getDataobj().then((data: any) => this.setFetchData(data));
  }


  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }
    const options: PushOptions = {
      android: {
      //  senderID: '764212065038'
      },
      ios: {
        alert: 'true',
        badge: false,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      
    //  console.log('device token -> ' + data.registrationId);
    //  this.auth.setData('token',{info: data});
      this.auth.savePushToken(data);
      //TODO - send device token to server
    });

    
    pushObject.on('notification').subscribe((data: any) => {
    //  console.log('message -> ' + JSON.stringify(data));
      //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        let tmp = data.additionalData;
        if(tmp.type == "1"){//chat notification
          this.auth.receiveChatNotification(data.additionalData);
        }
        
      } else {
        
        let tmp = data.additionalData;
        if(tmp.type == "1" && this.auth.isLogin){
        //  this.auth.receiveChatNotificationBackgroud(data.additionalData);
          let confirmAlert = this.alertCtrl.create({
            title: data.title,
            message: data.message + '',
            buttons: [{
              text: 'اغلاق',
              role: 'cancel'
            }, {
              text: 'عرض المحادثات',
              handler: () => { 
                  this.viewChatPage();
              }
            }]
          });
          confirmAlert.present();
        }
        
        
        
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
      //  this.nav.push(DetailsPage, { message: data.message });
      //  console.log('Push notification clicked');
      }

  });//close register_notification event


    pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  }

  viewChatPage(){
      if(this.auth.is('std')){
        this.nav.push(ChatPage);
      }else{
        this.nav.push(SupChatPage);
      }
    
  }
}
