import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileMainComponent } from './pages/profile-main/profile-main.component';
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ButtonModule } from "primeng/button";


@NgModule({
  declarations: [
    ProfileMainComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    CardModule,
    DividerModule,
    ProgressSpinnerModule,
    ButtonModule
]
})
export class ProfileModule { }
