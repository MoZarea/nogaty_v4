import { Component } from '@angular/core';
import {  IonicPage, NavController, Events, AlertController } from 'ionic-angular';

import { AttendPage } from '../attend/attend';
import { SupDegreePage } from '../sup-degree/sup-degree';
import { SupPointsPage } from '../sup-points/sup-points';
//import { AddPointPage } from '../add-point/add-point';
import { CheckTasksPage } from '../check-tasks/check-tasks';
import { SupChatPage } from '../sup-chat/sup-chat';

import { AuthProvider } from '../../../providers/auth/auth';


 
/**
 * Generated class for the MainPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sub-main',
  templateUrl: 'sup-main.html'
})
export class SupMainPage {


  root1 = AttendPage;
  root2 = CheckTasksPage;
  root3 = SupDegreePage;
  root4 = SupPointsPage;

  public total : number = 0;


  constructor(
    public navCtrl: NavController, 
    public alertCtrl: AlertController,
    public events: Events,
    public auth: AuthProvider
  ) {
    
    this.events.subscribe('navtitle', (title) => {
    });

    
    this.events.subscribe('chatTotalCountNew', () => {
      if(this.auth.chats.total < 0)
        this.auth.chats.total = 0;
      this.total = this.auth.chats.total;
      console.log("total "+ this.total);
    });

  }

  chatPage(){
    this.navCtrl.push(SupChatPage);
  }

  ionViewWillLeave() {
    
  }

  ionViewDidLoad(){
  }

  

}
