import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Usuario } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = "http://localhost:5004/";

  constructor(private http: HttpClient) { }

  // Función para enviar la solicitud post de login
  public login(user: Usuario): Observable<HttpResponse<any>> {
    const data = {username: user.username, password: user.password }
    return this.http.post<any>(`${this.apiUrl}login`, data, { observe: 'response' })
    .pipe(
      tap((response: HttpResponse<any>) => {
        // generamos un token en el caso de que sea exitoso
        if (response.body && response.body.token) {
          const generatedToken = (Math.random() * (1000 - 0)).toString(); 
          localStorage.setItem('authToken',generatedToken);  
        }
      })
    );
  }

  // validamos si existe el token de autenticacion
  public isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken'); 
  }

  // eliminamos el token al cerrar sesion
  public logout(): void {
    localStorage.removeItem('authToken');  
  }
}
