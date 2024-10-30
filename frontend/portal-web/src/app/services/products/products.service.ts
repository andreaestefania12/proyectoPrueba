import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from 'src/app/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = "http://localhost:5001/";

  constructor(private http: HttpClient) { }

  // función para obtener listado de productos
  public getProducts(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}products`);
  }

  public deleteProduct(id: any): Observable<HttpResponse<any>>{
    return this.http.delete<any>(`${this.apiUrl}products/${id}`, { observe: 'response' });
  } 
}
