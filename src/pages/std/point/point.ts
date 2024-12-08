import { Component } from '@angular/core';
import {  LoadingController, AlertController,NavController, NavParams, Events, ToastController  } from 'ionic-angular';

//import { MainPage } from '../main/main';
import { AuthProvider } from '../../../providers/auth/auth';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

/**
 * Generated class for the PointPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-point',
  templateUrl: 'point.html',
})
export class PointPage {

  code : any;
  gifts : any;

  total_points : number;
  used_points : number;


  constructor(public loadingCtrl: LoadingController,public alertCtrl: AlertController,public toastCtrl: ToastController,public auth: AuthProvider,public navCtrl: NavController, public navParams: NavParams, 
    public events: Events,
    private barcodeScanner: BarcodeScanner) {
    this.events.publish('navtitle', 'نقاطي');

    this.events.subscribe('fetchData', (data) => {
      this.setFetchData(data);
    });
  }

  setFetchData(data: any){
    try{
      this.gifts = data.data.gifts;
      this.total_points = this.auth.data.data.total_points;
      this.used_points = this.auth.data.data.used_points;

      this.gifts.sort((g1, g2) => {
        if(g1.taken > g2.taken && g1.taken == 1)
          return 1;
        return 0;
      });
    }catch(err){

    }
  }

  ionViewDidLoad(){
    this.auth.getDataobj().then((data: any) => this.setFetchData(data));
  }

  addPoint(){
    let loading = this.loadingCtrl.create({
      content: '...'
    });
    loading.present();
    try {
      this.auth.setData('point',{"code": this.code}).subscribe((data: any) => {
        data = JSON.parse(data._body);
        if(data.data.valid){
          this.auth.addPoint({"point": data.data.point, "title": data.data.title, "us_name": data.data.us_name});
          this.code = ''
        }else{

        }
        let toast = this.toastCtrl.create({
          message: data.data.msg,
          duration: 3500,
          position: 'top'
        });
        toast.present();
        loading.dismiss();
      }, err => {
        this.auth.checkNet();
        loading.dismiss();
      });
    } catch (error) {
      loading.dismiss();
    }
  }

  selectGift(gift: number){
    let confirm = this.alertCtrl.create({
      title: 'تنبية',
      message: 'سيتم خصم قيمة الجائزة من رصيدك',
      buttons: [
        {
          text: 'نعم',
          handler: () => {
            this.auth.setData('gift',{"gift_id": gift}).subscribe((data: any) => {
              data = JSON.parse(data._body);
              let toast = this.toastCtrl.create({
                message: data.data.msg,
                duration: 3500,
                position: 'top'
              });
              if(data.data.valid){
                let itemIndex = this.auth.data.data.gifts.findIndex( item => item.id == gift);
                this.auth.data.data.gifts[itemIndex].taken = 0;
                this.auth.data.data.used_points += this.gifts[itemIndex].points;
                this.setFetchData(this.auth.data);
              }else{

              }
              toast.present();
            }, err => {
              this.auth.checkNet();
              console.log(err);
            });
          }
        },
        {
          text: 'لا',
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
  }

  readBarcode(){
    this.barcodeScanner.scan({showFlipCameraButton: true}).then(barcodeData => {
      console.log('Barcode data', barcodeData);
      if(!barcodeData.cancelled){
        this.code = barcodeData.text;
        if(this.code.substring(0, 1) == '0'){
          this.code = this.code.substring(1, this.code.length);
        }
        this.addPoint();
      }
      
     }).catch(err => {
         console.log('Error', err);
     });
  }

}
