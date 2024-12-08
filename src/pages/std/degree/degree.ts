import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, Events } from 'ionic-angular';

import { AuthProvider } from '../../../providers/auth/auth';


/**
 * Generated class for the DegreePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-degree',
  templateUrl: 'degree.html',
})
export class DegreePage {

  total: number = 0;

  points: any;
  degrees: any;
  tasks: any;
  committees: any;

  weeks: any;

  constructor(public alertCtrl: AlertController, public auth: AuthProvider,public navCtrl: NavController, public navParams: NavParams, public events: Events) {
    this.events.publish('navtitle', 'درجاتي');
  

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

ionViewDidLoad(){
  this.auth.getDataobj().then((data: any) => this.setFetchData(data));
}

setFetchData(data: any){
  
  try{
    this.total = 0;
    this.weeks = new Array();
    this.points = data.data.points;
    this.degrees = data.data.degrees;
    this.committees = data.data.committees;
    this.tasks = data.data.myTasks.reduce((prev_items, curItem) => {
      if(curItem.active == 0){
        (prev_items[curItem.week] = prev_items[curItem.week] || []).push(curItem);
        this.total += curItem.stdegree;
      }
      return prev_items;
    }, []);
    
  //  this.degrees = data.data.degrees;
    
  //  let tmp = new Array();
    for(let i in this.degrees){
      this.weeks.push(this.degrees[i][0].week);
      
    //  console.log(this.degrees[i]);
      for (let item of this.degrees[i])
        this.total += item.total;
      
    //  tmp.push(this.degrees[i]);
    }
  //  this.degrees = tmp;

    for(let i in this.tasks){
      let w = this.weeks.findIndex(v => v == this.tasks[i][0].week);
      if(w == -1)
        this.weeks.push(this.tasks[i][0].week);
    }

    this.points.forEach(item => this.total += item.point);

    this.total = parseFloat(this.total.toFixed(2));
  
    /*
    tmp = new Array();
    for(let i in this.tasks){
      tmp.push(this.tasks[i]);
    }
    this.tasks = tmp;
    */

  //  console.log(this.degrees);
  }catch(err) {
  }
}

weekDeg(d: any){
  
  try {
    console.log(this.auth.data);
    let committee = this.committees.find( item => item.com_num == d['cnum']);
    console.log(committee);
    let tmpText : string;
    if(committee.com_val1.length > 0)
      tmpText = committee.com_val1 + ': ' + d['v1'] + '<br/>';
    if(committee.com_val2.length > 0)
      tmpText += committee.com_val2 + ': ' + d['v2'] + '<br/>';
    if(committee.com_val3.length > 0)
      tmpText += committee.com_val3 + ': ' + d['v3'] + '<br/>';
    if(committee.com_val4.length > 0)
      tmpText += committee.com_val4 + ': ' + d['v4'] + '<br/>';
    if(committee.com_val5.length > 0)
      tmpText += committee.com_val5 + ': ' + d['v5'] + '<br/>';


    const alert = this.alertCtrl.create({
      title: 'الدرجات',
      subTitle: tmpText,
      buttons: ['OK']
    });
    alert.present();
  } catch (error) {
    
  }
}

}
