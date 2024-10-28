import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material-module/material.module';
import { Usuario } from 'src/app/models/user';
import { RegisterService } from 'src/app/services/register/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  //Variable para mostrar si existe un error al registrar nuevo usaurio
  public registerError: string = '';
  public usuario: Usuario;

  constructor(
    private router: Router,
    private registerService: RegisterService,
    private snackBar: MatSnackBar 
  ){
    this.usuario = {
      username: '',
      email: '',
      password: ''
    };
  }

  public onRegister(): void{
    this.registerService.register(this.usuario).subscribe({
      next: (response) => {
        if(response.status === 201){
          this.snackBar.open('Se ha creado correctamente el usuario', 'X', {
            duration: 4000,  
            horizontalPosition: 'center',  
            verticalPosition: 'top'
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        this.registerError =  error.error.message;
      },
      complete: () => {
        this.registerError = '';
      }
    });
  }

  public onLogin(): void{
    this.router.navigate(['/login']);
  }
}
