import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material-module/material.module';

@Component({
  selector: 'app-dialog-porduct',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './dialog-porduct.component.html',
  styleUrls: ['./dialog-porduct.component.css']
})
export class DialogPorductComponent {

  public productForm: FormGroup;
  public isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogPorductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data.id;

    this.productForm = this.fb.group({
      name: [data.name || '', Validators.required],
      description: [data.description || '', Validators.required],
      price: [data.price || 0 , Validators.required],
      stock: [data.stock || 0, [Validators.required]]
    });
  }

  save(): void {
    if (this.productForm.valid) {
      const result = {
        ...this.productForm.value,
        id: this.isEditMode ? this.data.id : null
      };
      this.dialogRef.close(result);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
