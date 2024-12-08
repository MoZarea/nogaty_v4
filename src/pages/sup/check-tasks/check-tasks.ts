import { Component } from '@angular/core';
import { App, NavController, NavParams, LoadingController, ToastController, AlertController, Events } from 'ionic-angular';

import { AuthProvider } from '../../../providers/auth/auth';

import { AddTaskPage } from '../add-task/add-task';

/**
 * Generated class for the CheckTasksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-check-tasks',
  templateUrl: 'check-tasks.html',
})
export class CheckTasksPage {

  private stds_tasks: any;
  private tasks: any;
  private stds : any;
  private checkStds : boolean = false;
  private filterTask : number = -1;

  constructor(
    public app: App,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl : AlertController,
    public events: Events,
    public auth: AuthProvider,
    public navCtrl: NavController, public navParams: NavParams) {
      this.events.subscribe('fetchSupData', (data) => {
        this.setFetchData(data);
      });
    }
  
    setFetchData(data: any){
      try{
        this.stds_tasks = data.data.std_tasks;
        this.tasks = data.data.tasks;
      //  this.stds = data.data.stds;
      }catch(err){
  
      }
    }

  ionViewDidLoad() {
    this.auth.getDataobj().then((data: any) => this.setFetchData(data));
  }

  goToAddTaskPage(){
    let nav = this.app.getRootNav();
    
   nav.push(AddTaskPage);
   //this.navCtrl.push(AddTaskPage);
  }

  post_stask(item: any, type: number){
    let loading = this.loadingCtrl.create({
      content: ''
    });
    loading.present();

    this.auth.setSupData('post_std_task',{"stask_id": item.stask_id, "type": type}).subscribe((data: any) => {
      data = JSON.parse(data._body);
      if(data.data.valid){

          let toast = this.toastCtrl.create({
            message: data.data.msg,
            duration: 3500,
            position: 'top'
          });
          toast.present();

          let i = this.stds_tasks.indexOf(item);
          this.stds_tasks.splice(i, 1);
        
      }else{

      }
      loading.dismiss();
    }, err => {
      this.auth.checkNet();
      loading.dismiss();
      console.log(err);
    });
  }

  remove(item: any){
    let loading = this.loadingCtrl.create({
      content: ''
    });
    loading.present();

    this.auth.setSupData('remove_std_task',{"stask_id": item.stask_id}).subscribe((data: any) => {
      data = JSON.parse(data._body);
      if(data.data.valid){

          let toast = this.toastCtrl.create({
            message: data.data.msg,
            duration: 3500,
            position: 'top'
          });
          toast.present();

          let i = this.stds_tasks.indexOf(item);
          this.stds_tasks.splice(i, 1);
        
      }else{

      }
      loading.dismiss();
    }, err => {
      this.auth.checkNet();
      loading.dismiss();
      console.log(err);
    });
  }

  openCheckStds(){
    this.checkStds = true;
  }
  closeCheckStds(){
    this.checkStds = false;
    this.stds_tasks.forEach(std => {
      std.checked = false;
    });
  }

  showMsgInput() {
    let prompt = this.alertCtrl.create({
      title: 'انشاء رسالة',
      message: "",
      cssClass : "rtlClass",
      inputs: [
        {
          name: 'msg',
          placeholder: 'نص الرسالة'
        },
      ],
      buttons: [
        {
          text: 'اغلاق',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'ارسال',
          handler: data => {

              let std_ids = '';
              let count = 0
              this.stds_tasks.forEach(std => {
                if(std.checked){
                  if(count == 0)
                    std_ids += std.std_id;
                  else
                    std_ids += ',' + std.std_id;
                  count++;
                }
              });
            
              let loading = this.loadingCtrl.create({
                content: ''
              });
              loading.present();



              if (data.msg.trim() == '' || count == 0){
                loading.dismiss();
                return;
              }

              let d = new Date();
          
              let send_msg = {
                id: 0,
                by_sup: this.auth.users.info.id,
                team_id: 0,
                std_id: std_ids,
                msg: data.msg,
                time: d.getHours()+':'+d.getMinutes()
              };
          
          
              this.auth.setSupData('send_chat_msg',send_msg).subscribe((data: any) => {
                  data = JSON.parse(data._body);
                  if(data.data.valid){
                    this.stds_tasks.forEach(std => {
                      std.checked = false;
                    });
                    this.checkStds = false;
                    this.showToast('تم ارسال الرسالة بنجاح');
                  }else{
                    this.showToast('حدث خطأ');
                  }
                  loading.dismiss();
                }, err => {
                  this.showToast('حدث خطأ');
                  console.log(err);
                  loading.dismiss();
                });
                
          
          }
        }
      ]
    });
    prompt.present();
  }

  allCheckStds(){
    this.stds_tasks.forEach(std => {
      if(this.filterTask == std.task_id || this.filterTask == -1)
        std.checked = !std.checked;
    });
  }

  showFilter() {
    let alert = this.alertCtrl.create();
    alert.setTitle('تصفية الطلاب');

    alert.addInput({
      type: 'radio',
      label: 'الكل',
      value: '-1',
      checked: this.filterTask === -1
    });


    this.tasks.forEach(task => {
      alert.addInput({
        type: 'radio',
        label: task.name,
        value: ''+task.id+'',
        checked: this.filterTask === task.id
      });
    });


    alert.addButton('اغلاق');
    alert.addButton({
      text: 'تصفية',
      handler: data => {
        this.filterTask = parseInt(data);
        this.stds_tasks.forEach(std => {
          std.checked = false;
        });
      }
    });
    alert.present();
  }

  showToast(text){
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3500,
      position: 'top'
    });
    toast.present();
  }

  doRefresh(refresher) {
    this.auth.getInfoSup({});
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

}
