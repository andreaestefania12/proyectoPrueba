import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from 'src/app/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  // función para obtener listado de productos
  public getProducts(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`/products`);
  }

  // Agregar producto
  public createProduct(producto: Producto): Observable<HttpResponse<any>>{
    return this.http.post<any>(`/products`, producto, { observe: 'response' });
  }

  // Actualizar product
  public updateProduct(producto: Producto): Observable<HttpResponse<any>>{
    return this.http.put<any>(`/products/${producto.id}`, producto, { observe: 'response' });
  }

  // Eliminar producto
  public deleteProduct(id: any): Observable<HttpResponse<any>>{
    return this.http.delete<any>(`/products/${id}`, { observe: 'response' });
  } 
}
