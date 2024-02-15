import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserData } from '../model/user-data';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserDataService implements OnInit {

  userData: UserData

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage, private router: Router) { }

  ngOnInit(): void {
    
  }

  uploadImage(selectedImage: any, employeeData: any, changeSymbol: any, id: any) {
    const filePath = `profile/${Date.now()}`;
  
    this.storage.upload(filePath, selectedImage).then(uploadTaskSnapshot => {
      console.log("Image Upload");
  
      uploadTaskSnapshot.ref.getDownloadURL().then(url => {
        employeeData.profile = url;
  
        if (!changeSymbol) {
          this.editData(id, employeeData);
        } else {
          this.uploadData(employeeData);
        }
      })
    })
  }
  

  uploadData(employeeData: any) {
    this.afs.collection('employee').add(employeeData).then(docRef => {
      console.log("Data Uploaded");
      
    })
  }


  loadData() {
    return this.afs.collection('employee').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data};
        })
      })
    )
  }

  loadImg(id: any) {
    return this.afs.collection('employee').doc(id).valueChanges();
  }

  deleteData(id: any) {
    this.afs.collection('employee').doc(id).delete().then(() => {
      console.log('data deleted');
      
    })
  }

  deleteImage(profile: any, id: any) {
    this.storage.storage.refFromURL(profile).delete().then(() => {
      this.deleteData(id);
      console.log("img deleted");
      
    })
  }

  editData(id: any, employeeData: any) {
    this.afs.collection('employee').doc(id).update(employeeData).then(() => {
      console.log("Data edited");
    })
  }

  loadOneData(id: any) {
    return this.afs.collection('employee').doc(id).valueChanges()
  }

}
