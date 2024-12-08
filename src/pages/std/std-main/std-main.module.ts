import { NgModule } from '@angular/core';
import { IonicModule, IonicPageModule, IonicApp } from 'ionic-angular';
import { StdsModule } from '../stds.module';




import { StdMainPage } from './std-main';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { SelectTaskPage } from '../select-task/select-task';
import { PointPage } from '../point/point';
import { DegreePage } from '../degree/degree';
import { ChatPage } from '../chat/chat';
import { ChatboxPage } from '../chatbox/chatbox';


@NgModule({
  declarations: [
    StdMainPage
  ],
  imports: [
    StdsModule,
    IonicPageModule.forChild(StdMainPage),
  ]
})
export class StdPageModule {}
