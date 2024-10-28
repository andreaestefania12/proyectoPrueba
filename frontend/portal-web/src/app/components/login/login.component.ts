import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material-module/material.module';
import { Usuario } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  //Variable para mostrar si existe un error en el login
  public loginError: string = '';
  public usuario: Usuario;

  constructor(
    private loginService: LoginService,
    private router: Router
  ){
    this.usuario = {
      username: '',
      email: '',
      password: ''
    };
  }

  // Funcion para llamar el service de login enviando los parametros user y password
  public onLogin(): void {
    this.loginService.login(this.usuario).subscribe({
      next: (response) => {
        if(response.status === 200){
          console.log('Login successful:', response);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loginError =  error.error.message;
      },
      complete: () => {
        this.loginError = '';
        console.log('Login process completed');
      }
    });
    
  }

  public onRegister(): void{
    this.router.navigate(['/registro']);
  }
}
