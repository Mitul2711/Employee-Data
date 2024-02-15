"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserDataService = void 0;
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var UserDataService = /** @class */ (function () {
    function UserDataService(afs, storage, router) {
        this.afs = afs;
        this.storage = storage;
        this.router = router;
    }
    UserDataService.prototype.ngOnInit = function () {
    };
    UserDataService.prototype.uploadImage = function (selectedImage, employeeData, changeSymbol, id) {
        var _this = this;
        var filePath = "profile/" + Date.now();
        this.storage.upload(filePath, selectedImage).then(function (uploadTaskSnapshot) {
            console.log("Image Upload");
            uploadTaskSnapshot.ref.getDownloadURL().then(function (url) {
                employeeData.profile = url;
                if (!changeSymbol) {
                    _this.editData(id, employeeData);
                }
                else {
                    _this.uploadData(employeeData);
                }
            });
        });
    };
    UserDataService.prototype.uploadData = function (employeeData) {
        this.afs.collection('employee').add(employeeData).then(function (docRef) {
            console.log("Data Uploaded");
        });
    };
    UserDataService.prototype.loadData = function () {
        return this.afs.collection('employee').snapshotChanges().pipe(operators_1.map(function (actions) {
            return actions.map(function (a) {
                var data = a.payload.doc.data();
                var id = a.payload.doc.id;
                return { id: id, data: data };
            });
        }));
    };
    UserDataService.prototype.loadImg = function (id) {
        return this.afs.collection('employee').doc(id).valueChanges();
    };
    UserDataService.prototype.deleteData = function (id) {
        this.afs.collection('employee').doc(id)["delete"]().then(function () {
            console.log('data deleted');
        });
    };
    UserDataService.prototype.deleteImage = function (profile, id) {
        var _this = this;
        this.storage.storage.refFromURL(profile)["delete"]().then(function () {
            _this.deleteData(id);
            console.log("img deleted");
        });
    };
    UserDataService.prototype.editData = function (id, employeeData) {
        this.afs.collection('employee').doc(id).update(employeeData).then(function () {
            console.log("Data edited");
        });
    };
    UserDataService.prototype.loadOneData = function (id) {
        return this.afs.collection('employee').doc(id).valueChanges();
    };
    UserDataService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], UserDataService);
    return UserDataService;
}());
exports.UserDataService = UserDataService;
