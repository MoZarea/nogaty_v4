import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { NavController, NavParams, Content, Events } from 'ionic-angular';

import { AuthProvider } from '../../../providers/auth/auth';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Keyboard } from '@ionic-native/keyboard';
/**
 * Generated class for the ChatboxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-sup-chatbox',
  templateUrl: 'sup-chatbox.html',
})
export class SupChatboxPage {
  @ViewChild(Content) content: Content;
  @ViewChild('input') myInput;

  counter : number = 1;

  messages: Array<{id: number, user_id: number, team_id: number, std_id: number, text: string, time: string, send: boolean, re_try: boolean}>;
  msg : string;

  msgs : any;
  key : string;

  chatBoxTitle = 'محادثة'
  team_id : number = 0;
  std_id: number = 0;
  selectedItem: any;
  element : any;
  user_id : number;

  others : any;

  constructor(private keyboard: Keyboard, private iab: InAppBrowser, public navCtrl: NavController, public auth: AuthProvider, public navParams: NavParams,public events: Events) {
    this.selectedItem = navParams.get('item');
    this.chatBoxTitle = this.selectedItem.title;
    this.team_id = this.selectedItem.team_id;
    this.std_id = this.selectedItem.std_id;
    this.others = this.selectedItem.others;
    this.element = document.getElementById('msg');
    this.user_id = this.auth.users.info.id;

    console.log(this.others);

    if(this.team_id != 0){
      this.key = 't'+this.team_id;
    }else{
      this.key = 's'+this.std_id;
    }
    try {
      if(this.auth.chats.countNew['c'+this.key] === undefined)
        this.auth.chats.countNew['c'+this.key] = [];
      this.msgs = this.auth.chats.chats['c'+this.key];
    } catch (error) {
      
    }

  }

  ionViewDidLoad() { 
  //  this.content.scrollToBottom();
  }

  ionViewDidEnter(){
    this.events.subscribe('chatBox', (chats) => {
      this.msgs = this.auth.chats.chats['c'+this.key];
      this.auth.chats.total -= this.auth.chats.countNew[this.key];
      this.auth.chats.countNew[this.key] = 0;
      this.events.publish('chatTotalCountNew');
      this.auth.saveChat();
    });
    try {
      if(this.msgs.length > 100){
        this.auth.chats.chats['c'+this.key] = this.auth.chats.chats['c'+this.key].slice(-100);
        this.msgs = this.auth.chats.chats['c'+this.key];
      }
    } catch (error) {
      
    }
    this.auth.saveChat();
  //  this.keyboard.disableScroll(true);
  }

  ionViewWillLeave(){
    this.events.unsubscribe('chatBox');
  }

  ngAfterViewInit(){
  //  this.content.scrollToBottom();
  }

  sendMessage(){
    if (this.msg.trim() == ''){
      return;
    }
    this.content.scrollToBottom();
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let daylight = 'ص';
    if(h == 0){
      h = 12;
    }else if(h >= 12){
      daylight = 'م';
      h -= 11;
    }
    this.counter++
  //  let dimensions = this.content.getContentDimensions();
 //   this.content.scrollTo(0, dimensions.contentHeight + dimensions.contentTop, 500);

    let send_msg = {
      id: 0,
      by_sup: this.user_id,
      team_id: this.team_id,
      std_id:this.std_id,
      msg: this.msg,
      time: ((h < 10)?'0':'')+h+':'+((m < 10)?'0':'')+m,
      daylight: daylight,
      send: false,
      re_try: false
    };

    this.msgs.push(send_msg);

    this.auth.setSupData('send_chat_msg',send_msg).subscribe((data: any) => {
        data = JSON.parse(data._body);
        if(data.data.valid){
          
            send_msg.id = data.data.id;
            send_msg.send = true;

            this.auth.saveChat();
            
        }else{
          send_msg.re_try = true;
        }
      }, err => {
        console.log(err);
        send_msg.re_try = true;
      });

      this.msg = '';
      this.myInput.setFocus();

    }

    openLink(link) {
      this.iab.create(link, '_system');
    }


}