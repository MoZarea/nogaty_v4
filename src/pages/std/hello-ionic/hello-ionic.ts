import { Component } from '@angular/core';
import {  Events } from 'ionic-angular';

import { AuthProvider } from '../../../providers/auth/auth';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  title: string;
  team_name : string;
  cur_tasks: any;

  notes: any;
  
  constructor(
    public events: Events,
    public auth: AuthProvider
  ) {
    this.events.publish('navtitle', 'صفحتي');
    console.log('test chat page');

    

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
      this.title = this.auth.users.info.name;
      this.team_name = this.auth.data.data.team.name;
      this.cur_tasks = data.data.myTasks.filter(item => item.active == 1);
    }catch(err){

    }
  }

}
