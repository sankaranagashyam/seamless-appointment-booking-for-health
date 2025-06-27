import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { AdminComponent } from './components/admin/admin.component';
import { DoctorComponent } from './components/doctor/doctor.component';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'user', component: UserComponent},
  {path:'admin', component: AdminComponent},
  {path:'doctor', component: DoctorComponent},
  {path:'authenticate', component: AuthenticateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
