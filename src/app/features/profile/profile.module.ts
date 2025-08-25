import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileMainComponent } from './pages/profile-main/profile-main.component';
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from "primeng/dropdown";
import { SharedModule } from "../../shared/shared.module";
import { FormsModule } from '@angular/forms';


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
    ButtonModule,
    TooltipModule,
    FormsModule,
    DropdownModule,
    SharedModule
]
})
export class ProfileModule { }
