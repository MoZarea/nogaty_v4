import { Component, ViewChild, Input } from '@angular/core';
import { NavController, NavParams, Content, Events } from 'ionic-angular';

import { Keyboard } from '@ionic-native/keyboard';

import { AuthProvider } from '../../../providers/auth/auth';

/**
 * Generated class for the ChatboxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-chatbox',
  templateUrl: 'chatbox.html',
})
export class ChatboxPage {
  @ViewChild(Content) content: Content;
  @ViewChild('input') myInput;

  counter : number = 1;

  messages: Array<{id: number, text: string, time: string, send: boolean}>;
  msg : string;
  msgs : any;
  key : string;

  chatBoxTitle = 'محادثة'
  selectedItem: any;
  element : any;
  others : any;

  user_id : number;
  team_id : number = 0;
  supervisor_id: number = 0;

  keyboardSubscriptionShow : any;
  keyboardSubscriptionHide : any;

  constructor(private keyboard: Keyboard,public events: Events,public auth: AuthProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.selectedItem = navParams.get('item');
    this.chatBoxTitle = this.selectedItem.title;
    this.supervisor_id = this.selectedItem.supervisor_id;
    this.team_id = this.selectedItem.team_id;
    this.others = this.selectedItem.others;
    this.user_id = this.auth.users.info.id;

    this.element = document.getElementById('msg');

    if(this.team_id != 0){
      this.key = 't'+this.team_id;
    }else{
      this.key = 's'+this.supervisor_id;
    }
    try {
      if(this.auth.chats.countNew['c'+this.key] === undefined)
        this.auth.chats.countNew['c'+this.key] = [];
      this.msgs = this.auth.chats.chats['c'+this.key];
    } catch (error) {
      
    }
    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatboxPage');
  }

  ngAfterViewInit(){
  }

  ionViewDidEnter(){
    this.events.subscribe('chatBox', (chats) => {
      this.msgs = this.auth.chats.chats['c'+this.key];
      this.auth.chats.total -= this.auth.chats.countNew[this.key];
      this.auth.chats.countNew[this.key] = 0;
      this.events.publish('chatTotalCountNew');
      /*
      setTimeout(() => {
        this.content.scrollToBottom();
      },300);
      */
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
    //this.keyboard.disableScroll(true);

    this.keyboardSubscriptionShow = this.keyboard.onKeyboardShow().subscribe(() => {
    //  this.content.resize();
      this.content.scrollToBottom();
    //  console.log("+++++++++++++++++keyboard is howing ++++++++++++++++++++++");
    });

    this.keyboardSubscriptionHide = this.keyboard.onKeyboardHide().subscribe(() => {
    //  this.content.resize();
    });
  }

  ionViewWillLeave(){
    this.events.unsubscribe('chatBox');
    this.keyboardSubscriptionShow.unsubscribe();
    this.keyboardSubscriptionHide.unsubscribe();
  }

  sendMessage(){
    if(this.team_id != 0)
      return;
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
      if(h != 12)
        h -= 12;
    }
    this.counter++
  //  let dimensions = this.content.getContentDimensions();
 //   this.content.scrollTo(0, dimensions.contentHeight + dimensions.contentTop, 500);

    let send_msg = {
      id: 0,
      to_sup: this.supervisor_id,
      team_id: this.team_id,
      by_std: this.user_id,
      msg: this.msg,
      time: ((h < 10)?'0':'')+h+':'+((m < 10)?'0':'')+m,
      daylight: daylight,
      send: false,
      re_try: false
    };

    this.msgs.push(send_msg);

    this.auth.setData('send_chat_msg',send_msg).subscribe((data: any) => {
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
    //  this.content.resize();
    }
}
