import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';


import {
  Loading,
  LoadingController, 
  AlertController } from 'ionic-angular';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  public loginForm: FormGroup;
  public loading: Loading;

  public focusName : boolean = false;
  

  constructor(
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public auth: AuthProvider, 
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {

    this.loginForm = new FormGroup({
        name: new FormControl('',Validators.compose([Validators.minLength(3), Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9_\u0600-\u06FF ]*'), Validators.required])),
        p_name: new FormControl('',Validators.compose([Validators.minLength(3), Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9_\u0600-\u06FF ]*'), Validators.required])),
        mobile: new FormControl('',Validators.compose([Validators.minLength(3), Validators.maxLength(30), Validators.pattern('(05){1}[0-9]{8}'), Validators.required])),
        username: new FormControl('',Validators.compose([Validators.minLength(3), Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9_]*'), Validators.required])),
        password: new FormControl('',Validators.compose([Validators.minLength(4), Validators.maxLength(35), Validators.pattern('.*'), Validators.required])),
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  registerUser(){
    let loading = this.loadingCtrl.create({
      content: '...'
    });
  
    loading.present();

    let name = this.loginForm.controls.name.value;
    let p_name = this.loginForm.controls.p_name.value;
    let mobile = this.loginForm.controls.mobile.value;


    this.auth.setData('register', {name: name, p_name: p_name, mobile: mobile, username: this.loginForm.controls.username.value, password: this.loginForm.controls.password.value, version: this.auth.version}).subscribe((data: any) => {
      data = JSON.parse(data._body);
      this.auth.buildAlertSound();
      if(data.data.valid){
        this.navCtrl.pop();
      }else{
        
      }

      let toast = this.toastCtrl.create({
        message: data.data.msg,
        duration: 3500,
        position: 'top'
      });
      toast.present();
      loading.dismiss();
      
      console.log(data);
    }, err => {
      this.auth.checkNet();
      loading.dismiss();
    });
  }


}
