import { AfterViewInit, Component, Directive, ElementRef, HostListener, NgModule, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MaterialModule } from '../../module/material.module';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserData } from 'src/app/model/user-data';
import { UserDataService } from 'src/app/services/user-data.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig, CurrencyMaskModule } from 'ng2-currency-mask';
import { LiveAnnouncer } from '@angular/cdk/a11y';



export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "left",
  allowNegative: true,
  decimal: ".",
  precision: 2,
  prefix: "₹ ",
  suffix: "",
  thousands: ","
};


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
    FormsModule,
    MatDatepickerModule,
    CurrencyMaskModule,
    
  ],
  providers: [
    MatSortModule,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ]

})


export class TableComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'srNo',
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
  editForm: FormGroup;

  dataSource: MatTableDataSource<any>;
  selectedImage: any;
  formVisible: boolean = false;
  changeSymbol: boolean = true;
  editingRowId: string = '';
  dateFormCtrl = new FormControl(new Date());
  maxDate = new Date();
  minDate = new Date();
  selectedLanguagesString: string = '';


  toppings = new FormControl('');

  languageList: string[] = ['English', 'Hindi', 'Gujarati', 'French', 'German'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  imageUrl: string = './assets/placeholder-img.png';
  selectedLanguages: string[] = [];
  imgSrc: any = './assets/placeholder-img.png';
  userDataArray: any;
  docId: any;
  post: any;
  editingRowData: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserDataService,
    private route: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer,
    private el: ElementRef
  ) {

    this.maxDate = new Date();
    this.minDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear() - 100);


    this.route.queryParams.subscribe(val => { 
      this.docId = val['id'];
      if (this.docId) {
        this.userService.loadOneData(this.docId).subscribe(post => {
          this.post = post;

          this.employeeForm = fb.group({
            firstName: [this.post.firstName, Validators.required],
            lastName: [this.post.lastName, Validators.required,],
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
        this.employeeForm = fb.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          phone: ['', Validators.required ],
          gender: ['', Validators.required],
          language: ['', Validators.required],
          dob: ['', Validators.required],
          salary: ['', Validators.required],
          profile: ['']
        })
      }
    })

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    if (filterValue == "") {
      this.displayData();
    } else {
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return item.data.firstName.toLowerCase().includes(filterValue) ||
          item.data.lastName.toLowerCase().includes(filterValue);
      });
    }
  }

  ngOnInit(): void {
    this.displayData();
  }

  
  // @HostListener('keydown', ['$event'])
  // onKeyDown(event: KeyboardEvent) {
  //   const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End', '+'];
  //   if (!allowedKeys.includes(event.key) && isNaN(Number(event.key))) {
  //     event.preventDefault();
  //   }
  // }
  

  // not able to enter number

  // @HostListener('input', ['$event']) onInputChange(event: { target: { value: any; }; stopPropagation: () => void; }) {
  //   const initialValue = event.target.value;
  //   event.target.value = initialValue.replace(/[^a-zA-Z]/g, '');
  //   if (initialValue !== event.target.value) {
  //     event.stopPropagation();
  //   }
  // }

  // onKeyPress(event: KeyboardEvent) {
  //   const inputValue = event.key;
  //   const alphabeticRegex = /^[a-zA-Z]*$/;
  //   if (!alphabeticRegex.test(inputValue)) {
  //     event.preventDefault(); // Prevent the input of non-alphabetic characters
  //   }
  // }

  announceSortChange(sortState: Sort, data: any[]) {
    if (sortState.direction) {
      data.sort((a: any, b: any) => {
        if (sortState.active === 'srNo') {
          return sortState.direction === 'asc' ? a.data.srNo - b.data.srNo : b.data.srNo - a.data.srNo;
        } else if (sortState.active === 'firstName') {
          return sortState.direction === 'asc' ? a.data.firstName.localeCompare(b.data.firstName) : b.data.firstName.localeCompare(a.data.firstName);
        } else if (sortState.active === 'lastName') {
          return sortState.direction === 'asc' ? a.data.lastName.localeCompare(b.data.lastName) : b.data.lastName.localeCompare(a.data.lastName);
        } else if (sortState.active === 'email') {
          return sortState.direction === 'asc' ? a.data.email.localeCompare(b.data.email) : b.data.email.localeCompare(a.data.email);
        } else if (sortState.active === 'phone') {
          return sortState.direction === 'asc' ? a.data.phone - b.data.phone : b.data.phone - a.data.phone;
        } else if (sortState.active === 'gender') {
          return sortState.direction === 'asc' ? a.data.gender.localeCompare(b.data.gender) : b.data.gender.localeCompare(a.data.gender);
        } else if (sortState.active === 'language') {
          return sortState.direction === 'asc' ? a.data.language.localeCompare(b.data.language) : b.data.language.localeCompare(a.data.language);
        } else if (sortState.active === 'dob') {
          return sortState.direction === 'asc' ? a.data.dob - b.data.dob : b.data.dob - a.data.dob;
        } else if (sortState.active === 'salary') {
          return sortState.direction === 'asc' ? a.data.salary - b.data.salary : b.data.salary - a.data.salary;
        } else {
          return 0;
        }
      });
  
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending by ${sortState.active}`);
      console.log('sort');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
      console.log("esort");
    }
  }
  
  

  displayData() {
    this.userService.loadData().subscribe(val => {
      console.log(val);
      
      this.userDataArray = val;
      this.dataSource = new MatTableDataSource(
        this.userDataArray.map((item: { id: any; data: any; }) => ({ id: item.id, data: item.data }))
      );
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // console.log(this.dataSource.data)
    });
  }
  
  
  
  get fc() {
    return this.employeeForm.controls;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSelectionChange(event: any) {
    this.selectedLanguages = event.value;
    this.selectedLanguagesString = event.value.join(',');
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
      srNo: 0,
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
    this.userService.uploadImage(this.selectedImage, employeeData, this.changeSymbol, this.docId, this.selectedLanguagesString);

    this.imgSrc = './assets/placeholder-img.png';
  }



  deleteData(profile: any, docId: any) {

    if (confirm("want to delete this data..")) {
      this.userService.deleteImage(profile, docId);
    }
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
    } else {

      this.imageUrl = './assets/placeholder-img.png';

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

  loadEditingRowData(id: any) {
    this.userService.loadOneData(id).subscribe((data: any) => {
      this.editingRowData = data;
    });
  }

  onEdit(id: any) {
    this.changeSymbol = false;
    this.editingRowId = id;

    this.loadEditingRowData(id);
  }

  afterEdit() {
    this.userService.uploadImage(this.selectedImage, this.editingRowData, this.changeSymbol, this.editingRowId, this.selectedLanguagesString);
    this.editingRowId = '';
    this.changeSymbol = true;
  }

}
