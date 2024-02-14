"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TableComponent = void 0;
var core_1 = require("@angular/core");
var paginator_1 = require("@angular/material/paginator");
var sort_1 = require("@angular/material/sort");
var material_module_1 = require("../../module/material.module");
var common_1 = require("@angular/common");
var form_field_1 = require("@angular/material/form-field");
var forms_1 = require("@angular/forms");
var core_2 = require("@angular/material/core");
var checkbox_1 = require("@angular/material/checkbox");
var table_1 = require("@angular/material/table");
var input_1 = require("@angular/material/input");
var TableComponent = /** @class */ (function () {
    function TableComponent(fb, userService, route) {
        var _this = this;
        this.fb = fb;
        this.userService = userService;
        this.route = route;
        this.displayedColumns = [
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
        this.formVisible = false;
        this.editData = true;
        this.editingRowId = '';
        this.toppings = new forms_1.FormControl('');
        this.languageList = ['English', 'Hindi', 'Gujarati', 'French', 'German'];
        this.imageUrl = null;
        this.selectedLanguages = [];
        this.imgSrc = './assets/placeholder-img.png';
        this.dataArray = [];
        this.route.queryParams.subscribe(function (val) {
            _this.docId = val['id'];
            if (_this.docId) {
                _this.userService.loadOneData(_this.docId).subscribe(function (post) {
                    _this.post = post;
                    _this.employeeForm = _this.fb.group({
                        id: [],
                        firstName: [_this.post.firstName, forms_1.Validators.required],
                        lastName: [_this.post.lastName, forms_1.Validators.required],
                        email: [_this.post.email, [forms_1.Validators.required, forms_1.Validators.email]],
                        phone: [_this.post.phone, forms_1.Validators.required],
                        gender: [_this.post.gender, forms_1.Validators.required],
                        language: [_this.post.language, forms_1.Validators.required],
                        dob: [_this.post.dob, forms_1.Validators.required],
                        salary: [_this.post.salary, forms_1.Validators.required],
                        profile: ['']
                    });
                });
            }
            else {
                _this.employeeForm = _this.fb.group({
                    id: [],
                    firstName: ['', forms_1.Validators.required],
                    lastName: ['', forms_1.Validators.required],
                    email: ['', [forms_1.Validators.required, forms_1.Validators.email]],
                    phone: ['', forms_1.Validators.required],
                    gender: ['', forms_1.Validators.required],
                    language: ['', forms_1.Validators.required],
                    dob: ['', forms_1.Validators.required],
                    salary: ['', forms_1.Validators.required],
                    profile: ['']
                });
            }
        });
    }
    TableComponent.prototype.ngAfterViewInit = function () {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    };
    TableComponent.prototype.applyFilter = function (event) {
        var filterValue = event.target.value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    };
    TableComponent.prototype.ngOnInit = function () {
        this.displayData();
    };
    TableComponent.prototype.displayData = function () {
        var _this = this;
        this.userService.loadData().subscribe(function (val) {
            _this.dataArray = val;
            _this.userDataArray = val;
            console.log(_this.dataArray);
            _this.dataSource = new table_1.MatTableDataSource(_this.userDataArray.map(function (item) { return ({ id: item.id, data: item.data }); }));
            _this.dataSource.paginator = _this.paginator;
            // console.log(this.dataSource.data);
        });
    };
    TableComponent.prototype.onSelectionChange = function (event) {
        this.selectedLanguages = event.value;
        var lang = this.selectedLanguages.join(',');
    };
    TableComponent.prototype.getControl = function (fieldName) {
        return this.employeeForm.get(fieldName);
    };
    TableComponent.prototype.openForm = function () {
        this.formVisible = true;
    };
    TableComponent.prototype.closeForm = function () {
        this.formVisible = false;
        this.employeeForm.reset();
    };
    TableComponent.prototype.onSubmit = function () {
        var employeeData = {
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
        };
        this.userService.uploadImage(this.selectedImage, employeeData);
    };
    TableComponent.prototype.deleteData = function (profile, docId) {
        this.userService.deleteImage(profile, docId);
    };
    // image-input
    TableComponent.prototype.onDrop = function (event) {
        var _a;
        event.preventDefault();
        var files = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.files;
        if (files && files.length > 0) {
            var file = files[0];
            this.handleFile(file);
        }
    };
    TableComponent.prototype.onDragOver = function (event) {
        event.preventDefault();
    };
    TableComponent.prototype.onFileSelected = function (event) {
        var _this = this;
        var input = event.target;
        if (input.files && input.files.length > 0) {
            var file = input.files[0];
            this.handleFile(file);
            var reader = new FileReader();
            reader.onload = function (e) {
                var _a;
                _this.imgSrc = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            };
            reader.readAsDataURL(file);
            this.selectedImage = file;
        }
        else {
            this.imgSrc = './assets/placeholder-img.png';
            this.selectedImage = null;
        }
    };
    TableComponent.prototype.handleFile = function (file) {
        var _this = this;
        var reader = new FileReader();
        reader.onload = function () {
            _this.imageUrl = reader.result;
        };
        reader.readAsDataURL(file);
    };
    TableComponent.prototype.openImageInCard = function (event) {
        event.preventDefault();
    };
    // edit Data
    TableComponent.prototype.onEdit = function (id) {
        this.editData = false;
        this.editingRowId = id;
    };
    __decorate([
        core_1.ViewChild(paginator_1.MatPaginator)
    ], TableComponent.prototype, "paginator");
    __decorate([
        core_1.ViewChild(sort_1.MatSort)
    ], TableComponent.prototype, "sort");
    TableComponent = __decorate([
        core_1.Component({
            selector: 'app-table',
            templateUrl: './table.component.html',
            styleUrls: ['./table.component.css'],
            standalone: true,
            imports: [
                common_1.CommonModule,
                material_module_1.MaterialModule,
                core_2.MatNativeDateModule,
                checkbox_1.MatCheckboxModule,
                forms_1.ReactiveFormsModule,
                form_field_1.MatFormFieldModule,
                input_1.MatInputModule,
                table_1.MatTableModule,
                sort_1.MatSortModule,
                paginator_1.MatPaginatorModule,
                forms_1.FormsModule
            ],
            providers: [sort_1.MatSortModule]
        })
    ], TableComponent);
    return TableComponent;
}());
exports.TableComponent = TableComponent;
