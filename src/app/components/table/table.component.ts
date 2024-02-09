import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort } from '@angular/material/sort';
import { MaterialModule } from '../../module/material.module';
import { CommonModule } from '@angular/common';
import { FloatLabelType } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ImageUploadComponent } from '../image-upload/image-upload.component';



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  standalone: true,
  imports: [CommonModule, MaterialModule, MatNativeDateModule, MatCheckboxModule, ReactiveFormsModule, ImageUploadComponent ],
})


export class TableComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'id',
     'firstName', 
     'lastName',
     'email', 
     'phone', 
     'gender', 
     'language', 
     'dob', 
     'salary', 
     'profile',
     'action'
    ];

   employeeForm: FormGroup;
    
  dataSource: any;
  formVisible: boolean = false;

  toppings = new FormControl('');

  toppingList: string[] = ['English', 'Hindi', 'Gujarati', 'French', 'German'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  imageUrl: string | ArrayBuffer | null = null;  
  selectedLanguages: string[] = [];
  
  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      gender: ['', Validators.required], 
      language: ['', Validators.required],
      dob: ['', Validators.required], 
      salary: ['', Validators.required],
      profile: ['', Validators.required]
    })
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.search = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  

  ngOnInit(): void {

  }

  onSelectionChange(event: any) {
    this.selectedLanguages = event.value;
  }

  getControl(fieldName: string) {
    return this.employeeForm.get(fieldName);
  }

  
  openForm() {
    this.formVisible = true;
  }

  closeForm() {
    this.formVisible = false;
    console.log(this.employeeForm.value);
  }

  

  // image-input

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.handleFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.handleFile(file);
      
    }
  }

  private handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

 
  openImageInCard(event: MouseEvent) {
    event.preventDefault();
  }

}
