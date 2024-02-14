import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MaterialModule } from '../../module/material.module';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserData } from 'src/app/model/user-data';
import { UserDataService } from 'src/app/services/user-data.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';




@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MatNativeDateModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule
  ],
  providers: [MatSortModule]
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

  dataSource: MatTableDataSource<any>;
  selectedImage: any;
  formVisible: boolean = false;
  editData: boolean = true;
  editingRowId: string = '';

  toppings = new FormControl('');

  languageList: string[] = ['English', 'Hindi', 'Gujarati', 'French', 'German'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  imageUrl: string | ArrayBuffer | null = null;
  selectedLanguages: string[] = [];
  imgSrc: any = './assets/placeholder-img.png';
  userDataArray: any;
  dataArray: any[] = [];
  docId: any;
  post: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserDataService,
    private route: ActivatedRoute,
  ) {

   


    this.route.queryParams.subscribe(val => {
      this.docId = val['id'];
      if(this.docId) {
        this.userService.loadOneData(this.docId).subscribe(post => {
          this.post = post;

          this.employeeForm = this.fb.group({
            id: [],
            firstName: [this.post.firstName, Validators.required],
            lastName: [this.post.lastName, Validators.required],
            email: [this.post.email, [Validators.required, Validators.email]],
            phone: [this.post.phone, Validators.required],
            gender: [this.post.gender, Validators.required],
            language: [this.post.language, Validators.required],
            dob: [this.post.dob, Validators.required],
            salary: [this.post.salary, Validators.required],
            profile: ['']
          })

        })
      }
      else {
        this.employeeForm = this.fb.group({
          id: [],
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          phone: ['', Validators.required],
          gender: ['', Validators.required],
          language: ['', Validators.required],
          dob: ['', Validators.required],
          salary: ['', Validators.required],
          profile: ['']
        })
      }
    })

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.displayData();   
  }

  displayData() {
    this.userService.loadData().subscribe(val => {
      this.dataArray = val;
      
      this.userDataArray = val;
      console.log(this.dataArray);


      this.dataSource = new MatTableDataSource
        (this.userDataArray.map((item: { id: any; data: any; }) => ({ id: item.id, data: item.data })));

      this.dataSource.paginator = this.paginator;
      // console.log(this.dataSource.data);

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
    this.employeeForm.reset();
  }

  onSubmit() {
    const employeeData: UserData = {
      id: this.employeeForm.value.id,
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

  }

  deleteData(profile: any, docId: any) {
    this.userService.deleteImage(profile, docId);
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
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imgSrc = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      this.selectedImage = file;
    }else {
      
      this.imgSrc = './assets/placeholder-img.png';
      
      this.selectedImage = null;
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

  // edit Data

  onEdit(id: any) {
    this.editData = false;
    this.editingRowId = id
  }

}
