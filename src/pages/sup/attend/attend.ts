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
  public checked : boolean;
  public show : boolean;
  constructor(id, name, isActive, checked){
    this.id = id;
    this.name = name;
    this.isActive = isActive;
    this.checked = checked;
    this.show = true;
  }
 }

 class Team{
   public id: number;
   public name : string;
   public stds : Array<Student>;
   constructor(id, name){
    this.id = id;
    this.name = name;
    this.stds = Array<Student>();
  }

  addStudent(std){
    this.stds.push(std);
  }
 }

 class Checked {
   public id: number = 0; 
   public name1: string = ''; 
   public name2: string = ''; 
   public name4: string = ''; 
   public checked: boolean = false;
  }

@Component({
  selector: 'page-attend',
  templateUrl: 'attend.html',
})
export class AttendPage {

  teams : Array<Team>;

  private submitAtend : boolean = false;
  private isAttend: number;
  private attendID : number;
  public selectWeek: string;
  public attendWeeks2: any;
  public attend_periods : any;
  stds : any;
  stds_attend : Array<Checked>;
  filterTeam = -1;
  searchFilter : string;

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
      this.submitAtend = false;
      this.isAttend = this.auth.data.data.attend;
      this.attendID = this.auth.data.data.attendID;
      if(this.isAttend == 1){
        this.attendWeeks2 = this.auth.data.data.attend_week;
        this.attend_periods = data.data.attend_periods;
        
        this.stds = this.auth.data.data.stds;
      //  if(this.attendWeeks.length > 0)
        //  this.selectWeek = this.attendWeeks[0];
      }

      this.teams = Array<Team>();
      let teams_tmp = this.auth.data.data.teams;
      let stds_tmp = this.auth.data.data.stds;

      this.teams.push(new Team(0, 'غير محدد'));
      teams_tmp.forEach(item => {
        this.teams.push(new Team(item.id, item.name));
      });

      stds_tmp.forEach(item => {
        this.teams.forEach(team => {
          if(team.id == item.team_id){
            team.addStudent(new Student(item.id, item.name1 + ' ' + item.name2 + ' ' + item.name4, false, false));
          }
        });
      });
    }catch(err){

    }
  }

  ionViewDidLoad() {
    this.auth.getDataobj().then((data: any) => this.setFetchData(data));
  }


  getAttend(){
    let week;
    try {
      week = this.selectWeek.split(',');
    } catch (error) {
      return;
    }

    let loading = this.loadingCtrl.create({
      content: ''
    });
  
    loading.present();

    this.auth.setSupData('get_attend',{"week": week[0], "period": week[1], "committee_id": this.attendID}).subscribe((data: any) => {
      data = JSON.parse(data._body);
      if(data.data.valid){
        
        this.submitAtend = true;
        let stds_id = data.data.stds_id;
        this.stds_attend = new Array<Checked>();

        this.teams.forEach(team => {
          team.stds.forEach(std => {
            let tmp = stds_id.find(id => id == std.id);
            if(tmp){
              std.isActive = true;
              std.checked = false;
              std.show = true;
            }else{
              std.isActive = false;
              std.checked = false;
            }
          });
        });
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
    this.teams.forEach(team => {
      if(this.filterTeam == team.id ||this.filterTeam == -1){
        team.stds.forEach(std => {
          if(std.isActive)
            std.checked = !std.checked;
          });
      }
    });
  }

  postAttend(type: number){
    let week;
    try {
      week = this.selectWeek.split(',');
    } catch (error) {
      return;
    }
    
    let loading = this.loadingCtrl.create({
      content: ''
    });
    loading.present();

    let tmp_stds_id = new Array<number>();
    this.teams.forEach(team => {
      team.stds.forEach(std => {
      if(std.isActive && std.checked)
        tmp_stds_id.push(std.id);
      });
    });
    

    this.auth.setSupData('post_attend',{"week": week[0], "period": week[1], "committee_id": this.attendID, "type": type, "stds_id": tmp_stds_id}).subscribe((data: any) => {
      data = JSON.parse(data._body);
      if(data.data.valid){
        this.submitAtend = true;

        let counter = 0;
        this.teams.forEach(team => {
          team.stds.forEach(std => {
            if(std.isActive && std.checked){
              std.isActive = false;
              std.checked = false;
            }else if(std.isActive){
              counter++;
            }
          });
        });

        
        if(counter <= 0){
          let toast = this.toastCtrl.create({
            message: 'تم تحضير جميع الطلاب لهذا الأسبوع',
            duration: 3500,
            position: 'top'
          });
          toast.present();
         this.submitAtend = false;

         console.log(this.attendWeeks2[week[0] - 1]);
        let i = this.attendWeeks2[week[0] - 1].findIndex(val => val == week[1]);
        console.log("index");
        console.log(i);
        this.attendWeeks2[week[0] - 1].splice(i, 1);

        /*
         if(this.attendWeeks.length > 0)
          this.selectWeek = this.attendWeeks[0];
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


  showFilter() {
    let alert = this.alertCtrl.create();
    alert.setTitle('تصفية الطلاب');

    alert.addInput({
      type: 'radio',
      label: 'الكل',
      value: '-1',
      checked: this.filterTeam === -1
    });


    this.teams.forEach(team => {
      alert.addInput({
        type: 'radio',
        label: team.name,
        value: ''+team.id+'',
        checked: this.filterTeam === team.id
      });
    });


    alert.addButton('اغلاق');
    alert.addButton({
      text: 'تصفية',
      handler: data => {
        this.filterTeam = parseInt(data);
      }
    });
    alert.present();
  }

  onCancel(ev : any){
    console.log('cancel');
    this.teams.forEach(team => {
      team.stds.forEach(std => {
            std.show = true;
      });
    });
  }

  onInput(ev : any){
    if (this.searchFilter.trim() == ''){
      this.onCancel('');
      return;
    }
    console.log('input');
    this.teams.forEach(team => {
      team.stds.forEach(std => {
        if(std.isActive){
          if(std.name.indexOf(this.searchFilter) > -1){
            std.show = true;
          }else{
            std.checked = false;
            std.show = false;
          }
        }
      });
    });
  }

}
