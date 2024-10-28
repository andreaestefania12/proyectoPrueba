import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material-module/material.module';
import { Producto } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MaterialModule,
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{

  public listProducts: Producto[];
  public columns: string[] = ['Nombre', 'Descripcion', 'Precio', 'Unidades disponibles']
  constructor(
    private productsService: ProductsService,
  ){
    this.listProducts = [];
  }

  ngOnInit(): void {
    this.getProducts();
  }

  private getProducts(): void{
    this.productsService.getProducts().subscribe(
      (products: Producto[]) => {
        this.listProducts = [...products];
      },
      (error: Error) => {
        console.log('Error: ', error);
      }
    )
  }
}
