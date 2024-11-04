import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material-module/material.module';
import { Producto } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-dialog-order',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './dialog-order.component.html',
  styleUrls: ['./dialog-order.component.css']
})
export class DialogOrderComponent implements OnInit {

  public orderForm: FormGroup;
  public isEditMode: boolean;
  public products: Producto[] = [];
  public selectedProduct: Producto | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductsService
  ) {
    this.isEditMode = !!data.id;

    this.orderForm = this.fb.group({
      product_id: [data.product_id || null, Validators.required],
      quantity: [data.quantity || 0, [Validators.required, Validators.min(1)]],
      total_price: [{ value: data.total_price || 0, disabled: true }],
      status: [data.status || 'Pendiente', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.orderForm.get('product_id')?.valueChanges.subscribe((productId) => {
      this.onProductSelected(productId);
    });

    this.orderForm.get('quantity')?.valueChanges.subscribe((quantity) => {
      this.updateTotalPrice(quantity);
    });
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products.filter(product => product.stock > 0);
    });
  }

  private onProductSelected(productId: number): void {
    this.selectedProduct = this.products.find(product => product.id === productId) || null;
    this.orderForm.get('quantity')?.setValue(1);
    this.updateTotalPrice(1);
  }

  private updateTotalPrice(quantity: number): void {
    if (this.selectedProduct) {
      const totalPrice = this.selectedProduct.price * quantity;
      this.orderForm.get('total_price')?.setValue(totalPrice);
    }
  }

  save(): void {
    if (this.orderForm.valid) {
      const result = {
        ...this.orderForm.value,
        id: this.isEditMode ? this.data.id : null,
        total_price: this.orderForm.get('total_price')?.value
      };
      this.dialogRef.close(result);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
