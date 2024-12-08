import { Component } from '@angular/core';
import { NavController, NavParams, Events, ToastController, LoadingController, AlertController } from 'ionic-angular';

import { AuthProvider } from '../../../providers/auth/auth';


/**
 * Generated class for the AttendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

class Student{
  public id : number;
  public name : string;
  public isActive : boolean;
  public show : boolean;
  public taken : number;
  public relation_id : number;
  constructor(id, name, isActive){
    this.id = id;
    this.name = name;
    this.isActive = isActive;
    this.show = true;
    this.relation_id = 0;
    this.taken = 0;
  }
 }


 

@Component({
  selector: 'page-gifts',
  templateUrl: 'gifts.html',
})
export class GiftsPage {

  students : Array<Student>;

  private submit : boolean = false;
  private isAttend: number;
  private attendID : number;
  public selectGift: number;
  stds : any;

  gifts : any;
  allWaitings : any;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public events: Events,
    public auth: AuthProvider,
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {

    this.events.subscribe('fetchSupData', (data) => {
      this.setFetchData(data);
    });
  }

  setFetchData(data: any){
    try{
      this.submit = false;
      this.isAttend = this.auth.data.data.attend;
      this.attendID = this.auth.data.data.attendID;
    //  if(this.isAttend == 1){
        
        this.stds = this.auth.data.data.stds;
        this.gifts = this.auth.data.data.gifts;
        
    //    this.gifts.unshift({id: 0, name: "كل قائمة الإنتظار", des: "", count: 3});
     //   console.log(this.gifts);
        
      //  if(this.attendWeeks.length > 0)
        //  this.selectWeek = this.attendWeeks[0];
    //  }

      let stds_tmp = this.auth.data.data.stds;


      console.log(this.gifts);

      this.students = Array<Student>();
      stds_tmp.forEach(item => {
        this.students.push(new Student(item.id, item.name1 + ' ' + item.name2 + ' ' + item.name4, false));
      });

    }catch(err){

    }
  }

  ionViewDidLoad() {
    this.auth.getDataobj().then((data: any) => this.setFetchData(data));
  }


  getGift(){
    let id = this.selectGift;

    let loading = this.loadingCtrl.create({
      content: ''
    });
  
    loading.present();

    this.auth.setSupData('get_gift',{"gift_id": id}).subscribe((data: any) => {
      data = JSON.parse(data._body);
      if(data.data.valid){
        console.log(data);
        
        this.submit = true;
        let stds = data.data.stds;
        console.log(stds);

        if(id == 0){
          this.allWaitings = data.data.stds;
          this.students.forEach(s => {
            s.isActive = false;
          });
        }else{
          this.allWaitings = Array<any>();
        

          this.students.forEach(s => {
            let tmp = stds.find(item => item.std_id == s.id);
            if(tmp){
              s.isActive = true;
              s.relation_id = tmp.id;
              s.taken = tmp.taken;
            }else{
              s.isActive = false;
              s.relation_id = 0;
              s.taken = 0;
            }
          });

          this.students.sort((s1, s2) => {
            if(s1.taken < s2.taken)
              return -1;
            return 0;
          });
        }

      }else{

      }
      loading.dismiss();
    }, err => {
      this.auth.checkNet();
      loading.dismiss();
      console.log(err);
    });
  }


  allCheckStds(){
  }

  postGift(sg_id: number){
    let id = sg_id;
    
    let loading = this.loadingCtrl.create({
      content: ''
    });
    loading.present();

    

    this.auth.setSupData('post_gift',{'sg_id': id}).subscribe((data: any) => {
      data = JSON.parse(data._body);
      if(data.data.valid){
        this.submit = true;


        if(data.data.valid){
          this.students.forEach(s => {
            if(s.isActive && s.taken == 0 && s.relation_id == id){
              s.taken = 1;
            }
          });
          let toast = this.toastCtrl.create({
            message: data.data.msg,
            duration: 3500,
            position: 'top'
          });
          toast.present();
        }


        
        
        
      }else{

      }
      loading.dismiss();
    }, err => {
      this.auth.checkNet();
      loading.dismiss();
      console.log(err);
    });
  }

  removeGift(sg_id: number){
    let id = sg_id;
    
    let loading = this.loadingCtrl.create({
      content: ''
    });
    loading.present();

    

    this.auth.setSupData('remove_gift',{'sg_id': id}).subscribe((data: any) => {
      data = JSON.parse(data._body);
      let index = 0;
      if(data.data.valid){
        this.submit = true;

        if(data.data.valid){
          console.log(data);
          index = this.allWaitings.findIndex((item) => item.id == id);
          this.allWaitings.splice(index,1);
          /*
          this.students.forEach(s => {
            if(s.isActive && s.taken == 0 && s.relation_id == id){
              s.taken = 1;
            }
          });
          let toast = this.toastCtrl.create({
            message: data.data.msg,
            duration: 3500,
            position: 'top'
          });
          toast.present();
          */
        }

      }else{

      }
      loading.dismiss();
    }, err => {
      this.auth.checkNet();
      loading.dismiss();
      console.log(err);
    });
  }

  doRefresh(refresher) {
    this.auth.getInfoSup({});
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }


 


 

}
