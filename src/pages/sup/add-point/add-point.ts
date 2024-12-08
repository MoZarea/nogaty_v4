import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, Events, ToastController, LoadingController } from 'ionic-angular';

import { AuthProvider } from '../../../providers/auth/auth';

/**
 * Generated class for the AddPointPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 class Point{
   public name : string;
   public point : number;
   public quantity : number;
   public dateEnd : Date
 }

@Component({
  selector: 'page-add-point',
  templateUrl: 'add-point.html',
})
export class AddPointPage {
  selectedItem :any;
  private newPoint : Point = new Point();

  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public events: Events,
    public auth: AuthProvider,
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    this.selectedItem = navParams.get('item');
  }

  postAddPoint(type: number){
    let loading = this.loadingCtrl.create({
      content: ''
    });
    loading.present();

    this.auth.setSupData('post_add_point',{"name": this.newPoint.name, "point": this.newPoint.point, "quantity": this.newPoint.quantity, "dateEnd": this.newPoint.dateEnd}).subscribe((data: any) => {
      data = JSON.parse(data._body);
      if(data.data.valid){
        this.auth.data.data.points.push({id : data.data.id, title: this.newPoint.name});


        let alert = this.alertCtrl.create({
          title: 'اضافة عنوان',
          subTitle: data.data.msg,
          buttons: [{
            text: 'نعم',
            handler: data => {
              this.navCtrl.pop();
            }
          }],
          enableBackdropDismiss: false
        });
        
        alert.present();
        
      }else{
        let toast = this.toastCtrl.create({
          message: data.data.msg,
          duration: 3500,
          position: 'top'
        });
        toast.present();

      }
      loading.dismiss();
    }, err => {
      this.auth.checkNet();
      loading.dismiss();
      console.log(err);
    });
  }

  ionViewDidLoad() {
  }

}
