import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupsModule } from '../sups.module';


import { SupMainPage } from './sup-main';


@NgModule({
  declarations: [
    SupMainPage
  ],
  imports: [
    SupsModule,
    IonicPageModule.forChild(SupMainPage),
  ]
})
export class StdPageModule {}
