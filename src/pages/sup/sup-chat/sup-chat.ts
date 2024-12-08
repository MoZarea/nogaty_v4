import { Component } from '@angular/core';
import {  NavController, NavParams, Events, ToastController, AlertController } from 'ionic-angular';
import { SupChatboxPage } from '../sup-chatbox/sup-chatbox';


import { AuthProvider } from '../../../providers/auth/auth';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-sup-chat',
  templateUrl: 'sup-chat.html'
})
export class SupChatPage {


  teams: any;
  filterTeam : number = -1;
  stds : any;
  countNew : any;
  others = {};
  orderBy : boolean = false;
  search : string = '';

  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public auth: AuthProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events) {

    this.events.subscribe('fetchData', (data) => {
      this.setFetchData(data);
    });

    this.events.subscribe('fetchSupChats', (chats) => {
      this.setFetchData(this.auth.data);
    });
  }

  setFetchData(data: any){
    try{
        this.teams = data.data.teams;
        this.stds = data.data.stds;
        this.countNew = this.auth.chats.countNew;
        data.data.supervisors.forEach(val => {
          this.others[val.id] = val.name;
        });
        this.orderBy = !this.orderBy;
    }catch(err) {
    }
  }

  ionViewDidLoad() {
    this.auth.getDataobj().then((data: any) => this.setFetchData(data));
    console.log("hello chat ");
  }

  chatBox(team){
    /*
    let alert = this.alertCtrl.create({
      title: 'المحادثات',
      subTitle: 'نأسف جدا, المحادثات لم تفعل',
      buttons: [{
        text: 'لابأس',
        handler: data => {
          this.navCtrl.pop();
        }
      }],
      enableBackdropDismiss: false
    });
    */
    try {
      this.auth.chats.total -= this.countNew['t'+team.id];
      this.countNew['t'+team.id] = 0;
      this.events.publish('chatTotalCountNew');
    } catch (error) {
      
    }


    
    this.navCtrl.push(SupChatboxPage,{ item: {team_id: team.id, std_id: 0 ,title: team.name, note: '', icon: '', others : this.others}});
  //  alert.present();
    
  }

  chatStdBox(std){
    try {
      this.auth.chats.total -= this.countNew['s'+std.id];
      this.countNew['s'+std.id] = 0;
      this.events.publish('chatTotalCountNew');
    } catch (error) {
      
    }
    this.navCtrl.push(SupChatboxPage,{ item: {team_id: 0, std_id: std.id ,title: std.name1 + ' ' + std.name2 + ' ' + std.name4 , note: '', icon: '', others : this.others}});
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


  doRefresh(refresher) {
    this.auth.get_last_sup_chats();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

}
