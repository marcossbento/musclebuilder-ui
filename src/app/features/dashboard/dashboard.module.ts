import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardMainComponent } from './pages/dashboard-main/dashboard-main.component';
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    DashboardMainComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ButtonModule,
    DividerModule,
    SharedModule
]
})
export class DashboardModule { }
