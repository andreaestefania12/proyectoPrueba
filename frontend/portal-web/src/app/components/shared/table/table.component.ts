import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from 'src/app/material-module/material.module';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit{

  public tableDataSource = new MatTableDataSource<any>([]);
  public length = 0;
  public pageSize = 5;
  public pageIndex = 0;
  public pageSizeOptions = [5, 10, 20];
  public displayedColumns: string[] = [];

  @Input() tableColumns: { name: string, label: string, property: string}[] = [];

  @Input() set tableData(data: any[]) {
    this.setTableDataSource(data);
    this.length = data.length;
  }

  @Output() update = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.displayedColumns = [...this.tableColumns.map(col => col.name), 'actions'];
  }

  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.paginator;
  }

  setTableDataSource(data: any[]) {
    this.tableDataSource.data = data;
    if (this.paginator) {
      this.paginator.firstPage(); 
    }
  }

  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  onUpdate(id: any): void {
    this.update.emit(id);
  }

  onDelete(id: any): void {
    this.delete.emit(id);
  }
}
