import { Component } from '@angular/core';
import {  NavController, NavParams, Events, ToastController, AlertController } from 'ionic-angular';
import { ChatboxPage } from '../chatbox/chatbox';

import { AuthProvider } from '../../../providers/auth/auth';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  team : any;
  supervisors: any;
  countNew : any;
  others = {};

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
    
    this.events.subscribe('fetchStdChats', (chats) => {
      try{
        this.setFetchData(this.auth.data);
    }catch(err) {
    }
    });
    
  }

  setFetchData(data: any){
    
    try{
        this.team = data.data.team;
        this.supervisors = data.data.supervisors;
        this.countNew = this.auth.chats.countNew;

        data.data.supervisors.forEach(val => {
          this.others[val.id] = val.name;
        });

      
    }catch(err) {
    }
    
  }

  ionViewDidLoad() {
    this.auth.getDataobj().then((data: any) => this.setFetchData(data));
  }

  refreshCountNew(key : string){
    try {
      this.auth.chats.total -= this.countNew[key];
      this.countNew[key] = 0;
      this.events.publish('chatTotalCountNew');
    } catch (error) {
      
    }
  }

  chatTeamBox(team){
    this.refreshCountNew('t'+team.id);
    this.navCtrl.push(ChatboxPage,{ item: {title: team.name, team_id: this.team.id,supervisor_id: 0, others : this.others, note: '', icon: ''}});

  }

  chatBox(supervisor){
    this.refreshCountNew('s'+supervisor.id);
    this.navCtrl.push(ChatboxPage,{ item: {title: supervisor.name,team_id: 0, supervisor_id : supervisor.id, others : this.others, note: '', icon: ''}});
    
  }


  doRefresh(refresher) {
    this.auth.get_last_std_chats();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

}
