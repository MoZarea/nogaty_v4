import { Component } from '@angular/core';
import { IonicApp,App, NavController, NavParams, Events, ToastController, LoadingController, AlertController } from 'ionic-angular';

import { AddPointPage } from '../add-point/add-point';
import { AuthProvider } from '../../../providers/auth/auth';

import { GiftsPage } from '../gifts/gifts';
/**
 * Generated class for the SupPointsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 class Student{
  public id : number;
  public name : string;
  public isActive : boolean;
  public show : boolean;
  public total : number;
  constructor(id, name, isActive, total){
    this.id = id;
    this.name = name;
    this.isActive = isActive;
    this.show = true;
    this.total = total;
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

@Component({
  selector: 'page-sup-points',
  templateUrl: 'sup-points.html',
})
export class SupPointsPage {

 // students : Array<Student>;
  teams : Array<Team>;

  private submit : boolean;
  private points : any;
  private selectedPoint : any;

  filterTeam = -1;
  searchFilter : string;

  constructor(
    public app: App,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public events: Events,
    public auth: AuthProvider,
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {

   // this.selectedPoint = 0;

  //  this.students = Array<Student>();

    this.events.subscribe('fetchSupData', (data) => {
      this.setFetchData(data);
    });
  }

  setFetchData(data: any){
    try{
      this.submit = false;
      this.points = this.auth.data.data.points;
      if(this.points.length > 0)
        this.selectedPoint = this.points[0].id;

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
            team.addStudent(new Student(item.id, item.name1 + ' ' + item.name2 + ' ' + item.name4, false, 0));
          }
        });
      });

    }catch(err){

    }
  }

  getPoint(){
    
    let loading = this.loadingCtrl.create({
      content: ''
    });
  
    loading.present();

    this.auth.setSupData('get_point',{"id": this.selectedPoint}).subscribe((data: any) => {
      data = JSON.parse(data._body);
      if(data.data.valid){
        let tmp_std_ids = data.data.std_ids;
        this.teams.forEach(team => {
          team.stds.forEach(std => {
            let tmp = tmp_std_ids.find(item => item.id == std.id);
            if(tmp){
              std.isActive = true;
              std.total = tmp.total;
              std.show = true;
            }else{
              std.isActive = false;
              std.total = 0;
            }
          });
        });
        this.submit = true;
        
      }else{

      }
      loading.dismiss();
    }, err => {
      this.auth.checkNet();
      loading.dismiss();
      console.log(err);
    });
  }


  postPoint(std: Student,type: number){
    let loading = this.loadingCtrl.create({
      content: ''
    });
    loading.present();

    let tmp_stds_id = new Array();

    this.auth.setSupData('post_point',{"id": this.selectedPoint, "std_id": std.id, "type": type}).subscribe((data: any) => {
      data = JSON.parse(data._body);
      if(data.data.valid){
        this.submit= true;
        switch(type){
          case 0:
            if(std.total > 1){
              std.total--;
            }else{
              std.isActive = false;
              std.total = 0;
            }
            break;
          case 1:
            std.total++;
            std.isActive = true;
            break;
        }
        
      }else{
        let toast = this.toastCtrl.create({
          message: 'حدث خطأ',
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


  goToAddPointPage(){
    let nav = this.app.getRootNav();
    
    nav.push(AddPointPage,{ item: {title: '', note: '', icon: ''}});
  }

  goToGiftsPage(){
    let nav = this.app.getRootNav();
    
    nav.push(GiftsPage,{ item: {title: '', note: '', icon: ''}});
  }


  ionViewDidLoad() {
    this.auth.getDataobj().then((data: any) => this.setFetchData(data));
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
          if(std.name.indexOf(this.searchFilter) > -1){
            std.show = true;
          }else{
            std.show = false;
          }
        
      });
    });
  }

}
