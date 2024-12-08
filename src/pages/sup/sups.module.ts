import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { PipesModule } from '../../pipes/pipes.module';

import { AttendPage } from './attend/attend';
import { SupDegreePage } from './sup-degree/sup-degree';
import { SupPointsPage } from './sup-points/sup-points';
import { AddPointPage } from './add-point/add-point';
import { CheckTasksPage } from './check-tasks/check-tasks';
import { SupChatPage } from './sup-chat/sup-chat';
import { SupChatboxPage } from './sup-chatbox/sup-chatbox';
import { GiftsPage } from './gifts/gifts';
import { AddTaskPage } from './add-task/add-task';

@NgModule({
  declarations: [
    AttendPage,
    SupDegreePage,
    SupPointsPage,
    AddPointPage,
    CheckTasksPage,
    SupChatPage,
    SupChatboxPage,
    GiftsPage,
    AddTaskPage
  ],
  imports: [
    IonicModule,
    PipesModule
  //  IonicApp
  ],
  exports: [
    AttendPage,
    SupDegreePage,
    SupPointsPage,
    AddPointPage,
    CheckTasksPage,
    SupChatPage,
    SupChatboxPage,
    GiftsPage,
    AddTaskPage
  ],
  entryComponents: [
    AttendPage,
    SupDegreePage,
    SupPointsPage,
    AddPointPage,
    CheckTasksPage,
    SupChatPage,
    SupChatboxPage,
    GiftsPage,
    AddTaskPage
  ]
})
export class SupsModule {}
