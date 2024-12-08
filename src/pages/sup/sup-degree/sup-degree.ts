import { Component } from '@angular/core';
import { NavController, NavParams, Events, ToastController, LoadingController, AlertController } from 'ionic-angular';

import { AuthProvider } from '../../../providers/auth/auth';
/**
 * Generated class for the SupDegreePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

class Student{
  public id : number;
  public name : string;
  public isActive : boolean;
  public show : boolean;
  public degree : number;
  constructor(id, name, isActive, degree){
    this.id = id;
    this.name = name;
    this.isActive = isActive;
    this.show = true;
    this.degree = degree;
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

class Mark{
  public id : number;
  public name1 : string;
  public name2 : string;
  public name4 : string;
  public show: boolean;
  public degree : number;
}

@Component({
  selector: 'page-sup-degree',
  templateUrl: 'sup-degree.html',
})
export class SupDegreePage {

  teams : Array<Team>;
  filterTeam : number;

  private stds : any;
  private committees: any;
  private weeks : any;
  private select: any;
  private submit : boolean;
  private week : number;
  private degreeForAll : number = 0;

  private stdsMarks : Array<Mark>;

  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public events: Events,
    public auth: AuthProvider,
    public navCtrl: NavController, 
    public navParams: NavParams) {
    this.events.subscribe('fetchSupData', (data) => {
      this.setFetchData(data);
    });
    this.weeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
  }

  setFetchData(data: any){
    try{
      this.submit = false;
      this.committees = this.auth.data.data.committees.filter(item => item.hidden == 0);
      this.stds = this.auth.data.data.stds;

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
            team.addStudent(new Student(item.id, item.name1 + ' ' + item.name2 + ' ' + item.name4, true, 0));
          }
        });
      });

    }catch(err){

    }
  }

  getDegree(){
    let selected :any;
    try {
      selected = this.select.split(',');
    } catch (error) {
      return;
    }
    
    
    let loading = this.loadingCtrl.create({
      content: ''
    });
  
    loading.present();

    this.auth.setSupData('get_degree',{"week": this.week, "committee_id": selected[0], "type": selected[1]}).subscribe((data: any) => {
      data = JSON.parse(data._body);
      if(data.data.valid){
        
        this.submit = true;
        let stds_degrees = data.data.degrees;
        this.stdsMarks = new Array<Mark>();

        this.stds.forEach(std => {
          let item = new Mark();
          item.id = std.id;
          item.name1 = std.name1;
          item.name2 = std.name2;
          item.name4 = std.name4;
          item.show = true; 
          let tmp = stds_degrees.find(std => std.id == item.id);
          item.degree = tmp?tmp.degree:0;
          this.stdsMarks.push(item);
        });

        this.teams.forEach(team => {
          team.stds.forEach(std => {
            let tmp = stds_degrees.find(std_deg => std_deg.id == std.id);
            std.degree = tmp?tmp.degree:0;
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


  postDegree(type: number){
    let selected = this.select.split(',');
    let loading = this.loadingCtrl.create({
      content: ''
    });
    loading.present();

    let tmp_stds_id = new Array();
    this.teams.forEach(team => {
      team.stds.forEach(std => {
        if(std.show){
          tmp_stds_id.push([std.id, std.degree]);
        }
      });
    });
    /*
    this.stdsMarks.forEach(std => {
      tmp_stds_id.push([std.id, std.degree]);
    });
    */

    this.auth.setSupData('post_degree',{"week": this.week, "committee_id": selected[0], "type": selected[1], "stds_id": tmp_stds_id}).subscribe((data: any) => {
      data = JSON.parse(data._body);
      if(data.data.valid){
        this.submit= true;
        
      }else{
        let toast = this.toastCtrl.create({
          message: 'حدث خطأ لم يتم حفظ الدرجات',
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

  setDegreeforAll(){
    this.teams.forEach(team => {
      team.stds.forEach(std => {
        if(std.show){
          std.degree = this.degreeForAll;
        }
      });
    });
    /*
    this.stdsMarks.forEach(std => {
      std.degree = this.degreeForAll;
    });
    */
  }

  ionViewDidLoad() {
    this.auth.getDataobj().then((data: any) => this.setFetchData(data));
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
        this.teams.forEach(team => {
          team.stds.forEach(std => {
              if(this.filterTeam == team.id || this.filterTeam == -1)
                std.show = true;
              else
                std.show = false;
          });
        });
      }
    });
    alert.present();
  }

}
