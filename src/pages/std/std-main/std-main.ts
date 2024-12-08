import { Component } from '@angular/core';
import {  IonicPage, NavController, Events } from 'ionic-angular';

import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { SelectTaskPage } from '../select-task/select-task';
import { PointPage } from '../point/point';
import { DegreePage } from '../degree/degree';
import { ChatPage } from '../chat/chat';

import { AuthProvider } from '../../../providers/auth/auth';


 
/**
 * Generated class for the MainPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'std-main',
  templateUrl: 'std-main.html'
})
export class StdMainPage {


  homeRoot = HelloIonicPage 
  selectTaskRoot = SelectTaskPage
  pointRoot = PointPage
  degreeRoot = DegreePage

  public total :number = 0;


  constructor(
    public navCtrl: NavController, 
    public events: Events,
    public auth: AuthProvider
  ) {
    
    this.events.subscribe('navtitle', (title) => {
    });

    this.events.subscribe('chatTotalCountNew', () => {
      this.total = this.auth.chats.total;
    });

  }

  chatPage(){
    this.navCtrl.push(ChatPage);
  }


  ionViewDidLoad(){
    try {
      this.total = this.auth.chats.total;
    } catch (error) {
      
    }
  }

}
