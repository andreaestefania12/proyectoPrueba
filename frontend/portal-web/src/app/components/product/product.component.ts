import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material-module/material.module';
import { Producto } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products/products.service';
import { TableComponent } from "../shared/table/table.component";
import { DialogComponent } from '../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MaterialModule,
    TableComponent
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{

  public listProducts: Producto[];
  public tableColumns = 
  [
    { name: 'Nombre', label: 'Nombre', property: 'name' },
    { name: 'Descripcion', label: 'Descripcion', property: 'description' },
    { name: 'Precio', label: 'Precio', property: 'price' },
    { name: 'UnidadesDispo', label: 'Unidades disponibles', property: 'stock' },
  ];

  constructor(
    private productsService: ProductsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar){
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

  onUpdateProduct(id: any): void {
    console.log('Updating product with id:', id);

   
    // this.productsService.updateProduct(id).subscribe(
    //   (response) => {
    //     console.log('Product updated:', response);
    //     this.getProducts(); // Refresh the product list after update
    //   },
    //   (error) => console.error('Error updating product:', error)
    // );
  }

  onDeleteProduct(id: any): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: 'Eliminar producto', message: 'Seguro que desea eliminar el producto?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.onConfirmedAction(id);
      }
    });
  }

  onConfirmedAction(id: any){
    this.productsService.deleteProduct(id).subscribe({
      next: 
      (response) => {
        if(response.status === 200){
          this.getProducts(); 
        }
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, 'X', {
          duration: 6000,  
          horizontalPosition: 'center',  
          verticalPosition: 'top'
        });
      }
    });
  }
}
