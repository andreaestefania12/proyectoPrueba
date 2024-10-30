import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Orden } from 'src/app/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiUrl = "http://localhost:5001/";

  constructor(private http: HttpClient) { }

  // Función para obtener el listado de ordenes
  public getOrders(): Observable<Orden[]>{
    return this.http.get<Orden[]>(`${this.apiUrl}orders`);
  }

  // Eliminar una orden
  public deleteOrder(id: any): Observable<HttpResponse<any>>{
    return this.http.delete<any>(`${this.apiUrl}orders/${id}`, { observe: 'response' });
  }
}
