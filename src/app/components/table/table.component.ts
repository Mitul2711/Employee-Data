import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MaterialModule } from '../../module/material.module';
import { CommonModule } from '@angular/common';
import { FloatLabelType } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserData } from 'src/app/model/user-data';
import { UserDataService } from 'src/app/services/user-data.service';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  standalone: true,
  imports: [CommonModule, MaterialModule, MatNativeDateModule, MatCheckboxModule, ReactiveFormsModule],
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

  dataSource: any = new MatTableDataSource();
  selectedImage: any;
  formVisible: boolean = false;

  toppings = new FormControl('');

  languageList: string[] = ['English', 'Hindi', 'Gujarati', 'French', 'German'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  imageUrl: string | ArrayBuffer | null = null;
  selectedLanguages: string[] = [];
  imgSrc: any = './assets/placeholder-img.png';
  userDataArray: any;
  docId: any;
  post: any;

  constructor(private fb: FormBuilder, private userService: UserDataService, private route: ActivatedRoute) {
    this.dataSource = new MatTableDataSource<UserData>();

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
  

    this.route.queryParams.subscribe(val => {
      this.docId =  val['id'];

      this.userService.loadImg(this.docId).subscribe(val => {
        this.post = val;
        this.imgSrc = this.post.profile
      })
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
    this.userService.loadData().subscribe(val => {
      this.userDataArray = val[0];
      
      this.dataSource = Object.values(this.userDataArray);
          
    })
  }

  onSelectionChange(event: any) {
    this.selectedLanguages = event.value;
    let lang = this.selectedLanguages.join(',');
  }

  getControl(fieldName: string) {
    return this.employeeForm.get(fieldName);
  }


  openForm() {
    this.formVisible = true;
  }

  closeForm() {
    this.formVisible = false;  
  }

  onSubmit() {
    const employeeData: UserData = {
      firstName: this.employeeForm.value.firstName,
      lastName: this.employeeForm.value.lastName,
      email: this.employeeForm.value.email,
      phone: this.employeeForm.value.phone,
      gender: this.employeeForm.value.gender,
      language: this.employeeForm.value.language,
      dob: this.employeeForm.value.dob,
      salary: this.employeeForm.value.salary,
      profile: ''
    }
    this.userService.uploadImage(this.selectedImage, employeeData);
    console.log(employeeData);
    
    this.imgSrc = './assets/placeholder-img.png';
    
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
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imgSrc = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      this.selectedImage = file;
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
