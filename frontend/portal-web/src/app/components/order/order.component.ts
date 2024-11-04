import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material-module/material.module';
import { TableComponent } from '../shared/table/table.component';
import { Orden } from 'src/app/models/order';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogOrderComponent } from './dialog-order/dialog-order.component';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    MaterialModule,
    TableComponent
  ],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  public listOrders: Orden[];
  public tableColumns = 
  [
    { name: 'Orden', label: 'Número de orden', property: 'id' },
    { name: 'Producto', label: 'Producto', property: 'product_name' },
    { name: 'Cantidad', label: 'Cantidad', property: 'quantity' },
    { name: 'Total', label: 'Precio total', property: 'total_price' },
    { name: 'Estado', label: 'Estado', property: 'status' },
  ];

  constructor(
    private ordersService: OrdersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar){
    this.listOrders = [];
  }

  ngOnInit(): void {
    this.getOrders();
  }

  private getOrders(): void{
    this.ordersService.getOrders().subscribe(
      (orders: Orden[]) => {
        this.listOrders = [...orders];
      },
      (error: Error) => {
        console.log('Error', error);
      }
    )
  }

  // Agregar nueva orden
  onCreateOrder(): void {
    const dialogRef = this.dialog.open(DialogOrderComponent, {
      width: '30%',
      data: { title:'Agregar nueva orden', quantity: '', total_price: '', status: '' , product_id: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ordersService.createOrder(result).subscribe({
          next: 
          (response) => {
            if(response.status === 201){
              this.getOrders(); 
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
    });
  }


  // Actualizar orden
  onUpdateOrder(element: any): void {
    const dialogRef = this.dialog.open(DialogOrderComponent, {
      width: '30%',
      data: { title:'Editar orden', id: element.id, quantity: element.quantity, total_price: element.total_price, status: element.status , product_id: element.product_id  }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ordersService.updateOrder(result).subscribe({
          next: 
          (response) => {
            if(response.status === 200){
              this.getOrders  (); 
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
    });
  }

  // Eliminar orden
  onDeleteOrder(id: any): void{
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: 'Eliminar orden', message: 'Seguro que desea eliminar la orden?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.onConfirmedAction(id);
      }
    });
  }

  onConfirmedAction(id: any){
    this.ordersService.deleteOrder(id).subscribe({
      next: 
      (response) => {
        if(response.status === 200){
          this.listOrders = this.listOrders.filter(order => order.id !== id);
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
