import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MaterialModule } from 'src/module/material.module';


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
    NgxSpinnerModule
  ],
  providers: [
    MatSortModule,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ]
})



export class TableComponent implements OnInit {

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
  arrayLang: any;


  toppings = new FormControl('');

  languageList: string[] = ['English', 'Hindi', 'Gujarati'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  imageUrl: string = './assets/placeholder-img.png';
  selectedLanguages: string[] = [];
  imgSrc: any = './assets/placeholder-img.png';
  userDataArray: any;
  docId: any;
  post: any;
  editingRowData: any;
  isLoading: boolean;
  base64Image: SafeResourceUrl | undefined;
  data: any;
  range: FormGroup
  startDate: any;
  endDate: any;



  constructor(
    private fb: FormBuilder,
    private userService: UserDataService,
    private route: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer
  ) {

    this.range = fb.group({
      start: [''],
      end: ['']
    })

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
            dob: [this.post.dob, [Validators.required, this.dateValidator.bind(this)]],
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
          phone: ['', Validators.required],
          gender: ['', Validators.required],
          language: ['', Validators.required],
          dob: ['', [Validators.required, this.dateValidator.bind(this)]],
          salary: ['', Validators.required],
          profile: ['']
        })
      }
    })
  }

  searchByDateRange() {
    
    this.startDate = this.range.value.start;
    this.endDate = this.range.value.end;

    if (this.startDate == null || this.endDate == null) {
      this.displayData();
    } else {
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        const dobTimestamp = item.data.dob;
        const dobDate = dobTimestamp.toDate();
        
        return dobDate >= this.startDate && dobDate <= this.endDate;
      });
    }
  }

  dateValidator(control: AbstractControl) {
    const selectedDate = new Date(control.value);
    const today = new Date();

    if (selectedDate > today) {
      return { invalidDate: true };
    }
    return null;
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    if (filterValue == "") {
      this.displayData();
    } else {
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return item.data.firstName.toLowerCase().includes(filterValue) ||
          item.data.lastName.toLowerCase().includes(filterValue) ||
          item.data.email.toLowerCase().includes(filterValue) ||
          item.data.phone.toLowerCase().includes(filterValue) ||
          item.data.gender.toLowerCase().includes(filterValue) ||
          item.data.language.toLowerCase().includes(filterValue)
      });
    }
  }

  ngOnInit(): void {
    this.displayData();
  }

  onKeyPress(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!allowedKeys.includes(event.key) && isNaN(Number(event.key))) {
      event.preventDefault();
    } else {
      const input = event.target as HTMLInputElement;
      let cursorStart = input.selectionStart ?? 0; // Default to 0 if null
      const cursorEnd = input.selectionEnd ?? 0; // Default to 0 if null
      let inputValue = input.value;


      // Remove non-numeric characters
      inputValue = inputValue.replace(/\D/g, '');

      // Apply mask
      let maskedValue = '';
      let i = 0;
      if (inputValue.length >= 2) {
        maskedValue += `(+${inputValue.substring(0, 2)}) `;
        i = 2;
      }
      if (inputValue.length >= 7) {
        maskedValue += `${inputValue.substring(2, 7)} `;
        i = 7;
      }
      if (inputValue.length >= 12) {
        maskedValue += `${inputValue.substring(7, 12)}`;
        i = 12;
      }
      // Append remaining digits without mask
      if (inputValue.length > i) {
        maskedValue += inputValue.substring(i);
      }

      // Update input value and cursor position
      input.value = maskedValue;
      // Adjust cursor position to account for added mask characters
      let newCursorPosition = cursorStart + (maskedValue.length - inputValue.length);

      // Handle special case when removing characters
      if ((event.key === 'Backspace' || event.key === 'Delete') && cursorStart === cursorEnd && cursorStart > 0) {
        if (inputValue.length === 7 || inputValue.length === 2) {
          newCursorPosition = 3; // Adjust cursor when deleting a group of characters
        }
      }

      // Set new cursor position
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    }
  }



  // not able to enter number

  // @HostListener('input', ['$event']) onInputChange(event: { target: { value: any; }; stopPropagation: () => void; }) {
  //   const initialValue = event.target.value;
  //   event.target.value = initialValue.replace(/[^a-zA-Z]/g, '');
  //   if (initialValue !== event.target.value) {
  //     event.stopPropagation();
  //   }
  // }

  onKey(event: KeyboardEvent) {
    const inputValue = event.key;
    const alphabeticRegex = /^[a-zA-Z]*$/;
    if (!alphabeticRegex.test(inputValue)) {
      event.preventDefault();
    }
  }

  onDate(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;
    const key = event.key;

    if (!allowedKeys.includes(key) && isNaN(Number(key))) {
      event.preventDefault();
    } else {
      if (key === 'Backspace' || key === 'Delete') {
        return;
      } else if (key === 'ArrowLeft' || key === 'ArrowRight') {
        // Allow arrow keys for navigation
        return;
      }

      if (inputValue.length === 2 || inputValue.length === 5) {
        input.value += '/';
      }

      if (inputValue.length >= 10) {
        event.preventDefault();
      }
    }
  }


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
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }



  displayData() {

    this.spinner.show();
    this.userService.loadData().subscribe(val => {

      this.userDataArray = val;
      this.dataSource = new MatTableDataSource(
        this.userDataArray.map((item: { id: any; data: any; }) => ({ id: item.id, data: item.data }))
      );
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.spinner.hide();
    });

  }



  get fc() {
    return this.employeeForm.controls;
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
    this.employeeForm.reset();
    this.imageUrl = './assets/placeholder-img.png'
  }

  onSubmit() {

    const userData: UserData = {
      srNo: 0,
      firstName: this.employeeForm.value.firstName,
      lastName: this.employeeForm.value.lastName,
      email: this.employeeForm.value.email,
      phone: this.employeeForm.value.phone,
      gender: this.employeeForm.value.gender,
      language: this.employeeForm.value.language.join(','),
      dob: this.employeeForm.value.dob,
      salary: this.employeeForm.value.salary,
      profile: ''
    }
    this.spinner.show()
    // this.selectedLanguagesString = this.selectedLanguages.join(',');
    this.userService.uploadImage(this.selectedImage, userData, this.changeSymbol, this.docId);

    this.imgSrc = './assets/placeholder-img.png';
    this.imageUrl = './assets/placeholder-img.png';

    this.closeForm();

  }



  deleteData(profile: any, docId: any) {

    this.spinner.show();

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
    } else {
      this.imageUrl = './assets/placeholder-img.png';
      this.selectedImage = null;
    }
  }

  private handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      this.imageUrl = base64String;
      this.selectedImage = file;
    };
    reader.readAsDataURL(file);
  }

  openImageInCard(event: MouseEvent) {
    const input = document.getElementById('fileInput');
    if (input) {
      input.click(); // Trigger click event of file input
    }
    event.preventDefault();
  }

  // edit Data

  loadEditingRowData(id: any) {
    this.userService.loadOneData(id).subscribe((data: any) => {
      this.editingRowData = data;
      this.arrayLang = this.editingRowData.language.split(',');
    });
  }

  onEdit(id: any) {
    this.imageUrl = './assets/placeholder-img.png'
    this.changeSymbol = false;
    this.editingRowId = id;

    this.loadEditingRowData(id);
  }

  afterEdit() {
    this.spinner.show();
    this.editingRowData.language = this.arrayLang.join(',');
    // this.selectedLanguagesString = this.arrayLang.join(', ');
    this.userService.uploadImage(this.selectedImage, this.editingRowData, this.changeSymbol, this.editingRowId);
    this.editingRowId = '';
    this.changeSymbol = true;
  }

}
