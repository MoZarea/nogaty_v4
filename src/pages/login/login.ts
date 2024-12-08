import { Component } from '@angular/core';
import { App, Events, Platform, Nav, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

//import { MainPage } from '../std/main/main';

import {
  Loading,
  LoadingController, 
  AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
//import { HelloIonicPage } from '../../pages/hello-ionic/hello-ionic';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

import { FormControl } from '@angular/forms';

export class EmailValidator {

  static isValid(control: FormControl){
    const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
    .test(control.value);

    if (re){
      return null;
    }

    return {
      "invalidEmail": true
    };
  }
}

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: FormGroup;
  public loading: Loading;

  public submitAttempt: boolean;

  public loginAs = 'std';


  constructor(
    private iab: InAppBrowser,
    public app: App,
    public platform: Platform,
    public toastCtrl: ToastController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, 
    public auth: AuthProvider, 
    public events: Events,
    public formBuilder: FormBuilder) {

      this.loginForm = new FormGroup({
        username: new FormControl('',Validators.compose([Validators.minLength(3), Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9_\u0600-\u06FF ]*'), Validators.required])),
        password: new FormControl('',Validators.compose([Validators.minLength(4), Validators.maxLength(35), Validators.pattern('.*'), Validators.required])),
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  loginUser(){
    let loading = this.loadingCtrl.create({
      content: '...'
    });
  
    loading.present();

    let device = 2;
    if(this.platform.is('android')){
      device = 1;
    }

    this.auth.setData('login', {loginAs: this.loginAs,username: this.loginForm.controls.username.value, password: this.loginForm.controls.password.value, pushToken: this.auth.getPushToken(), version: this.auth.version, device: device}).subscribe((data: any) => {
      data = JSON.parse(data._body);
      this.auth.buildAlertSound();
      if(data.data.valid){
        this.auth.setUser(data.data.user);
        if(this.auth.is('std')){
          this.app.getRootNav().setRoot('StdMainPage').then(val => {
            this.auth.getInfo({});
            this.auth.resumeStd();
         //   this.auth.get_last_std_chats();
          //  this.auth.sendPushToken();
          });
        }else{
          this.app.getRootNav().setRoot('SupMainPage').then(val => {
            this.auth.getInfoSup({});
            this.auth.resumeSup();
        //    this.auth.get_last_sup_chats();
          //  this.auth.sendPushToken();
          });
        }
        
        loading.dismiss();
      }else{
        let toast = this.toastCtrl.create({
          message: data.data.msg,
          duration: 3500,
          position: 'top'
        });
        toast.present();
        loading.dismiss();
      }
      
     // console.log(data);
    }, err => {
      this.auth.checkNet();
      loading.dismiss();
    });
    console.log('lllll');
  }

  openWhatApp(){
    this.iab.create("https://nogaty.com/", '_system');
  }

  openRegister(){
    this.navCtrl.push('RegisterPage');
  }

}
