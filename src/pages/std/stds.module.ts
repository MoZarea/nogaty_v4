import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { PipesModule } from '../../pipes/pipes.module';

//import { StdMainPage } from './std-main/std-main';
import { HelloIonicPage } from './hello-ionic/hello-ionic';
import { SelectTaskPage } from './select-task/select-task';
import { PointPage } from './point/point';
import { DegreePage } from './degree/degree';
import { ChatPage } from './chat/chat';
import { ChatboxPage } from './chatbox/chatbox';

@NgModule({
  declarations: [
    HelloIonicPage,
    SelectTaskPage,
    PointPage,
    DegreePage,
    ChatPage,
    ChatboxPage
  ],
  imports: [
    IonicModule,
    PipesModule
  //  IonicApp
  ],
  exports: [
    HelloIonicPage,
    SelectTaskPage,
    PointPage,
    DegreePage,
    ChatPage,
    ChatboxPage
  ],
  entryComponents: [
    HelloIonicPage,
    SelectTaskPage,
    PointPage,
    DegreePage,
    ChatPage,
    ChatboxPage
  ]
})
export class StdsModule {}
