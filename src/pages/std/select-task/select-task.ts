import { Component } from '@angular/core';
import { NavController, NavParams, Events, AlertController, ToastController } from 'ionic-angular';

import { AuthProvider } from '../../../providers/auth/auth';

/**
 * Generated class for the SelectTaskPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-select-task',
  templateUrl: 'select-task.html',
})
export class SelectTaskPage {

  tasks: any;

  constructor(public toastCtrl: ToastController,public auth: AuthProvider,public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public events: Events) {
    this.events.publish('navtitle', 'اختيار مهمه');

    this.events.subscribe('fetchData', (data) => {
      this.setFetchData(data);
    });
  }

  doRefresh(refresher) {
    this.auth.getInfo({});
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  setFetchData(data: any){
    try{
      //  this.tasks = data.data.tasks.filter(item => item.active != 4 && item.active != 3);
        
        this.tasks = data.data.tasks.reduce((prev_items, curItem) => {
            (prev_items[curItem.cnum] = prev_items[curItem.cnum] || []).push(curItem);
          return prev_items;
        }, {});
        let tmp = new Array();
        for(let task in this.tasks){
          tmp.push(this.tasks[task]);
        }
        this.tasks = tmp;

      
    }catch(err) {
    }
  }

  ionViewDidLoad() {
    this.auth.getDataobj().then((data: any) => this.setFetchData(data));
  }

  selectTask(task: number){
    let confirm = this.alertCtrl.create({
      title: 'اختيار مهمه',
      message: 'هل تود الإستمرار؟',
      buttons: [
        {
          text: 'نعم',
          handler: () => {
            this.auth.setData('task',{"task_id": task}).subscribe((data: any) => {
              data = JSON.parse(data._body);
              let toast = this.toastCtrl.create({
                message: data.data.msg,
                duration: 3500,
                position: 'top'
              });
              if(data.data.valid){
                this.auth.addTask(task);
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

}
