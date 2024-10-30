import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductComponent } from './components/product/product.component';
import { OrderComponent } from './components/order/order.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'registro', component: RegisterComponent},
  { path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'productos', pathMatch: 'full'},
      { path: 'productos', component: ProductComponent},
      { path: 'ordenes', component: OrderComponent}
  ]}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
