import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material-module/material.module';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MaterialModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  
  public title: string = '';
  public message: string = '';

  @Output() confirm = new EventEmitter<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string },
    private dialogRef: MatDialogRef<DialogComponent>) {
    this.title = data.title;
    this.message = data.message;
  }

  onConfirm(): void {
    this.confirm.emit();
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
