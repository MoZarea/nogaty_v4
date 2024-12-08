import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { Injectable, NgZone } from '@angular/core';

//import { HTTP } from '@ionic-native/http';
import { App, Platform, AlertController, Events, ToastController} from 'ionic-angular';

import { Storage } from '@ionic/storage';


import { NativeAudio } from '@ionic-native/native-audio';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  public version = 1.10;
  public resumeEvent : any;

  public users: any;
  public chats: any;
  public chats_request_active : boolean = false;

  public isLogin : any;
  public data: any;
  public updated_at: any; 

  hasPushToken = false;
  public pushTokenData: any;

  public countFailed = 0;
//13615832411
//  url = "https://host383.hostmonster.com/~innzervc/";
 // url = "https://nogaty.com";
  url = "http://192.168.1.103:8080";

  constructor(
    public app: App,
    public platform: Platform,
    public zone: NgZone,
    public toastCtrl: ToastController,
    public events: Events,
    public alertCtrl: AlertController, 
    private storage: Storage,
    public http1: HttpClient, 
    private nativeAudio: NativeAudio,
  //  private http2: HTTP, 
    private http: Http) {
    this.isLogin = false;
    console.log('Hello AuthProvider Provider');
   // this.url = "http://192.168.8.104:8080";


  }

  

  is(isThis){
    if(isThis == 'std'){
    //  console.log(this.users.loginAs);
      if(this.users.loginAs == 'std') return true;
    }
    if(isThis == 'supervisor'){
      if(this.users.loginAs == 'supervisor') return true;
    }
    return false;
  }

  build(){
    this.buildAlertSound();
    return new Promise((resolve, reject) => {
      this.storage.get('users').then(val1 => {
        console.log('Build The App Data');
        this.users = val1;
        if(this.isset(val1)){
          this.isLogin = true;
        }

        this.storage.get('data').then(val2 => {
          this.data = val2;

          this.storage.get('chats').then(val3 => {
            this.chats = val3;
            resolve(this.data);
          }, err =>  reject(Error("error build chats")) );
          
        }, err => reject(Error("error build data")) );
        
      }, err => reject(Error("error build user")) );
    });
  }

  buildAlertSound(){
    try {
      this.nativeAudio.preloadSimple('alert', 'assets/sound/stairs.mp3');
    } catch (error) {
      
    }
  }

  playAlertSound(){
    this.nativeAudio.play('alert', () => console.log('uniqueId1 is done playing'));
  }

  saveData(){
    this.storage.set('data', this.data);
  }

  setLogout(){
    this.countFailed = 0;
    this.isLogin = false;
    this.users = null;
    this.data = null; 
    this.chats = null;
    this.storage.remove('users');
    this.storage.remove('data');
    this.storage.remove('chats');
    this.resumeEvent.unsubscribe();
  }

  setUser(user: any){
    this.isLogin = true;
    this.users = user;
    this.storage.set('users', this.users);
    //console.log('set user: '+this.users);
  }

  setChat(obj: any){
    //  this.isLogin = true;
    //  this.chats= obj;
      this.storage.set('chats', this.chats);
      //console.log('set user: '+this.users);
    }

    saveChat(){
      this.setChat(this.chats);
    }

  setData2(data: any){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.post("http://192.168.1.22/save.php",JSON.stringify(data),{ headers: headers }).subscribe(data => {

      
      
          //console.log(data);
      
        });
  }

  setData(request: string,data: any){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if(request != "login" && request != "register")
      headers.append('Authorization', 'Basic '+this.users.loginAs+':'+this.users.app.selector+':'+this.users.app.token);
    
    return this.http.post(this.url+"/api/std/"+request,JSON.stringify(data),{ headers: headers });
  }

  setSupData(request: string,data: any){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if(request != "login")
      headers.append('Authorization', 'Basic '+this.users.loginAs+':'+this.users.app.selector+':'+this.users.app.token);
    
    return this.http.post(this.url+"/api/sup/"+request,JSON.stringify(data),{ headers: headers });
  }



  getInfo(type: any){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Basic '+this.users.loginAs+':'+this.users.app.selector+':'+this.users.app.token);
    
    //.map(res => res.json())
    try {
      this.http.post(this.url+"/api/std",{},{ headers: headers }).subscribe((data: any) => {
        
        
        this.data = JSON.parse(data._body);
        if(this.data.valid){
          this.data = this.data;
          this.updated_at = "";
          //this.storage.set('data', this.data);

          if(this.version < this.data.v){
            this.show_msg("يوجد تحديث جديد: v"+ this.data.v);
          }
            
          this.publish();
          this.get_last_std_chats();
        }else{
        // this.setLogout();
        this.setRootToLoginPage();
         console.log('should be logout');
        }
        
      }, err => {
        this.countFailed++;
        if(this.countFailed <= 2)
          this.publish();
      //  this.checkNet();
      });
    } catch (error) {
      let toast = this.toastCtrl.create({
        message: 'لم يتم تحديث البيانات',
        duration: 5000,
        position: 'middle'
      });
      toast.present();
    }
  }

  getDataobj(){
    return new Promise((resolve, reject) => {  
      resolve(this.data);
    });
  }

  sendPushToken(){
    if(this.hasPushToken){
    //  this.setData('token',{"registrationId":"dAYqZnxexl8:APA91bGkpi_GA4iQjVbDezPLxVKtlWNTSvONe0-O4xlBWIMnq6YCR3rrShj_SQKMUs2RpwGmAdBCxhRWlOdMbFCSkEVIhMxCqNqZ6S31otqph61-BcJKnJWt5GrLXgVQKHz2weg5Rlqp","registrationType":"FCM"}).subscribe(val => console.log(val));
    //this.pushTokenData.registrationId
      this.setData('token', this.pushTokenData).subscribe(val => console.log(val));
      
    }

  }

  savePushToken(data: any){
    this.hasPushToken = true;
    this.pushTokenData = data;
  }

  getPushToken(){
    try {
      if(this.hasPushToken){
        return this.pushTokenData.registrationId;
      }
    } catch (error) {
      
    }

    return '0';
    
  }


  addTask(task : any){
  //  let item = this.data.data.tasks.find( item => item.id == task);
    let itemIndex = this.data.data.tasks.findIndex( item => item.id == task);
    let item = this.data.data.tasks[itemIndex];
    item.active = 1;
  //  console.log(item);
    this.data.data.myTasks.push(item);

    this.data.data.tasks.splice(itemIndex,1);
    this.publish();
  }

  addPoint(item: any){
    this.data.data.points.push(item);
    this.saveData();
  }

  publish(){
    this.saveData();
    this.events.publish('fetchData', this.data);
  }

  publishSup(){
    this.saveData();
    this.events.publish('fetchSupData', this.data);
  }

  getInfoSup(type: any){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Basic '+this.users.loginAs+':'+this.users.app.selector+':'+this.users.app.token);
    
    let chat_id = 0;
    try {
      chat_id = this.data.data.chats
    } catch (error) {
      
    }
    //.map(res => res.json())
    try {
      this.http.post(this.url+"/api/sup",{last_chat_id: chat_id},{ headers: headers }).subscribe((data: any) => {
      //  console.log(data);
        
        this.data = JSON.parse(data._body);
        if(this.data.valid){
          this.data = this.data;
          this.updated_at = "";
        //  console.log(this.data);
          //this.storage.set('data', this.data);
          
          if(this.version < this.data.v){
            this.show_msg("يوجد تحديث جديد: v"+ this.data.v);
          }
            
          this.publishSup();
          this.get_last_sup_chats();
        }else{
      //  this.setLogout();
        this.setRootToLoginPage();
         console.log('should be logout');
        }
        
      }, err => {
        this.countFailed++;
        if(this.countFailed <= 2)
          this.publishSup();
      //  this.publish();
      //  this.checkNet();
      });
    } catch (error) {
      let toast = this.toastCtrl.create({
        message: 'لم يتم تحديث البيانات',
        duration: 5000,
        position: 'middle'
      });
      toast.present();
    }
  }

  get_last_sup_chats(){
    if(this.chats_request_active)
      return;
    
    this.chats_request_active = true;

    let login_id = this.users.info.id;
    let last_id = 0;
    let self_last_id = 0;
    try {
      for(let key in this.chats.chats){
        this.chats.chats[key].forEach(chat => {
          if(chat.id > last_id && chat.by_sup != login_id)
            last_id = chat.id;
          else if(chat.id > self_last_id && chat.by_sup == login_id)
            self_last_id = chat.id;
        });
      }
    } catch (error) {
      
    }
  //  console.log(last_id + ' '+ self_last_id);
    
    this.setSupData('get_chats',{"last_id": last_id, "self_last_id": self_last_id}).subscribe((data: any) => {
      this.chats_request_active = false;
      data = JSON.parse(data._body);
      

    //  this.chats = data.data;
      let tmp_total = 0;
      let chat_last_id = data.data.chat_last_id;

      if(last_id == 0){
        this.chats = {};
        this.chats.chats = {};
        this.chats.countNew = {};
        this.chats.total = 0;
      }
      this.data.data.teams.forEach(team => {
        if(this.chats.countNew["t"+team.id] === undefined)
          this.chats.countNew["t"+team.id] = 0;
        if(this.chats.chats["ct"+team.id] === undefined)
          this.chats.chats["ct"+team.id] = [];
      });

      this.data.data.stds.forEach(std => {
        if(this.chats.countNew["s"+std.id] === undefined)
          this.chats.countNew["s"+std.id] = 0;
        if(this.chats.chats["cs"+std.id] === undefined)
          this.chats.chats["cs"+std.id] = []
      });

      data.data.team_chats.forEach(val => {
        let tmp_array = this.chats.chats['ct'+val.team_id];
        try {
          let size = tmp_array.length;
          for(let i = size - 1; i >= 0 && i > size - 100 ; i--){
            if(val.id == tmp_array[i].id)
              return;
          }
          if(val.by_sup != login_id && chat_last_id < val.id){
            this.chats.countNew["t"+val.team_id]++;
            tmp_total++;
          }
          this.chats.chats['ct'+val.team_id].push(val);
        } catch (error) {
          
        }
        
      });

      data.data.std_chats.forEach(val => {
        let std_id = val.by_std;
        if(val.by_std == 0){
          std_id = val.to_std;
        }
        let tmp_array = this.chats.chats['cs'+std_id];
        try {
          let size = tmp_array.length;
          for(let i = size - 1; i >= 0 && i > size - 100; i--){
            if(val.id == tmp_array[i].id)
              return;
          }
          
          if(val.by_std != 0 && chat_last_id < val.id){
            this.chats.countNew["s"+val.by_std]++;
            tmp_total++;
          }
          this.chats.chats['cs'+std_id].push(val);
        } catch (error) {
          
        }
      });
 


      this.chats.total += tmp_total;


      this.setChat(this.chats);

      if(tmp_total > 0)
        this.playAlertSound();

      this.events.publish('chatTotalCountNew');
      this.events.publish('fetchSupChats', this.chats);
      this.events.publish('chatBox', this.chats);

     //   console.log(data.data);
    }, err => {
      this.chats_request_active = false;
    });
  }

  get_last_std_chats(){
    if(this.chats_request_active)
      return;
  
    this.chats_request_active = true;

    let login_id = this.users.info.id;
    let last_id = 0;
    let team_id = this.data.data.team.id;
    let self_last_id = 0;
    try {
      for(let key in this.chats.chats){
        this.chats.chats[key].forEach(chat => {
          if(chat.id > last_id && chat.by_std != login_id)
            last_id = chat.id;
          else if(chat.id > self_last_id && chat.by_std == login_id)
            self_last_id = chat.id;
        });
      }
    } catch (error) {
      
    }
  //  console.log(last_id + ' '+ self_last_id);
    
    this.setData('get_chats',{"last_id": last_id, "self_last_id": self_last_id}).subscribe((data: any) => {
      this.chats_request_active = false;
      data = JSON.parse(data._body);

    //  this.chats = data.data;
      let tmp_total = 0;
      let chat_last_id = data.data.chat_last_id;

      if(last_id == 0){
        this.chats = {};
        this.chats.chats = {};
        this.chats.countNew = {};
        this.chats.total = 0;
      }
      

      if(this.chats.countNew["t"+team_id] === undefined)
        this.chats.countNew["t"+team_id] = 0;
      if(this.chats.chats["ct"+team_id] === undefined)
          this.chats.chats["ct"+team_id] = [];

      this.data.data.supervisors.forEach(sup => {
        if(this.chats.countNew["s"+sup.id] === undefined)
          this.chats.countNew["s"+sup.id] = 0;
        if(this.chats.chats["cs"+sup.id] === undefined)
          this.chats.chats["cs"+sup.id] = []
      });


      data.data.team_chats.forEach(val => {
        let tmp_array = this.chats.chats['ct'+val.team_id];
        for(let i = 0; i < tmp_array.length; i++){
          if(val.id == tmp_array[i].id)
            return;
        }
        if(chat_last_id < val.id){
          this.chats.countNew["t"+val.team_id]++;
          tmp_total++;
        }
        this.chats.chats['ct'+val.team_id].push(val);
        
      });

      data.data.std_chats.forEach(val => {
        let sup_id = val.by_sup;
        if(val.by_sup == 0){
          sup_id = val.to_sup;
        }
        let tmp_array = this.chats.chats['cs'+sup_id];
        for(let i = 0; i < tmp_array.length; i++){
          if(val.id == tmp_array[i].id)
            return;
        }

        if(val.by_sup != 0 && chat_last_id < val.id){
          this.chats.countNew["s"+val.by_sup]++;
          tmp_total++;
        }
        this.chats.chats['cs'+sup_id].push(val);
      });
 


      this.chats.total += tmp_total;


      this.setChat(this.chats);

      if(tmp_total > 0)
        this.playAlertSound();

      this.events.publish('chatTotalCountNew');
      this.events.publish('fetchStdChats', this.chats);
      this.events.publish('chatBox', this.chats);

     //   console.log(data.data);
    }, err => {
      this.chats_request_active = false;
    });
  }

  receiveChatNotification(chat : any){
    this.zone.run(() => {
      if(this.is('std')){
        this.get_last_std_chats();
      }else{
        this.get_last_sup_chats();
      }
    });
    /*
    let tmp_total = 0;
    let login_id = this.users.info.id;
    let team_id = chat.team_id;
    let key = "";
    
    if(team_id == "0"){//to_from_std
      if(this.is('std')){
        if(chat.by_sup == "0"){
          key = "s"+chat.to_sup;
        }else{
          key = "s"+chat.by_sup;
          chat.to_std = login_id;
          tmp_total++;
        }
      }else{
        if(chat.by_std == "0")
          key = "s"+chat.to_std;
        else{
          key = "s"+chat.by_std;
          tmp_total++;
        }
      }
    }else{//to_team
      key = "t"+team_id;
      tmp_total++;
    }
  
    let chat_msg = {
      id: chat.id,
      by_sup: chat.by_sup,
      by_std: chat.by_std,
      team_id: team_id,
      to_std: chat.to_std,
      to_sup: chat.to_sup,
      msg: chat.msg,
      time: chat.time
    };

    if(this.chats.countNew[key] === undefined)
      this.chats.countNew[key] = 1;
    else
      this.chats.countNew[key]++;

    if(this.chats.chats["c"+key] === undefined)
      this.chats.chats["c"+key] = [];

    if(this.chats.total === undefined)
      this.chats.total = 0;

    this.chats.chats["c"+key].push(chat_msg);
    this.chats.total += tmp_total;

    this.zone.run(() => {
      this.events.publish('chatTotalCountNew');
      if(this.is('std')){
        this.events.publish('fetchStdChats', this.chats);
      }else{
        this.events.publish('fetchSupChats', this.chats);
      }
      this.events.publish('chatBox', this.chats);
    });
    
    this.setChat(this.chats);
    */
  }

  receiveChatNotificationBackgroud(chat : any){
    this.zone.run(() => {
      if(this.is('std')){
      }else{
      }
    });
  }

  resumeStd(){
    this.resumeEvent = this.platform.resume.subscribe((e) => {
      this.get_last_std_chats();
    });
  }

  resumeSup(){
    this.resumeEvent = this.platform.resume.subscribe((e) => {
      this.get_last_sup_chats();
    });
  }
  


  isEmpty(obj) {
      for(var key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
  }

  isset(val: any) {
    if(typeof val == "undefined" || val == null)
        return false;
    return true;
  }

  checkNet(){
    let toast = this.toastCtrl.create({
      message: 'تأكد من اتصالك بمزود خدمة الانترنت',
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  show_msg(msg : string){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  setRootToLoginPage(){
    this.setLogout();
    this.app.getRootNav().setRoot('LoginPage').then(val => {
    });
    
  }

}
