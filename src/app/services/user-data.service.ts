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

  uploadImage(selectedImage: any, employeeData: any, changeSymbol: any, id: any, selectedLanguagesString: any) {

    if (!selectedImage) {
      employeeData.profile = './assets/placeholder-img.png';
      if (!changeSymbol) {
        this.editData(id, employeeData, selectedLanguagesString);
      } else {
        this.uploadData(employeeData, selectedLanguagesString);
      }
    } else {
      const filePath = `profile/${Date.now()}`;

      this.storage.upload(filePath, selectedImage).then(uploadTaskSnapshot => {
        console.log("Image Upload");

        uploadTaskSnapshot.ref.getDownloadURL().then(url => {
          employeeData.profile = url;

          if (!changeSymbol) {
            this.editData(id, employeeData, selectedLanguagesString);
          } else {
            this.uploadData(employeeData, selectedLanguagesString);
          }
        })
      })
    }
  }

  uploadData(employeeData: any, selectedLanguagesString: any) {
    employeeData.language = selectedLanguagesString;

    this.afs.collection('employee').get().toPromise().then(querySnapshot => {
      if (querySnapshot) {
        const srNo = querySnapshot.size + 1; 
        employeeData.srNo = srNo; 
        this.afs.collection('employee').add(employeeData).then(docRef => {
          console.log("Data Uploaded");
        });
      } else {
        console.error("No documents found in the collection");
      }
    })
  }

  

  loadData() {
    return this.afs.collection('employee', ref => ref.orderBy('srNo')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        })
      })
    )
  }

  loadImg(id: any) {
    return this.afs.collection('employee').doc(id).valueChanges();
  }


  deleteData(id: any) {

    this.afs.collection('employee').doc(id).ref.get().then(doc => {

      const deletedSrNo = (doc.data() as UserData).srNo;

      this.afs.collection('employee', ref => ref.where('srNo', '>', deletedSrNo)).get().subscribe(querySnapshot => {
        querySnapshot.forEach(doc => {

          const updatedSrNo = (doc.data() as UserData).srNo - 1;

          this.afs.collection('employee').doc(doc.id).update({ srNo: updatedSrNo }).then(() => {

              console.log("srNo updated");
            })
        });
      });
      
      this.afs.collection('employee').doc(id).delete().then(() => {
        console.log('Data deleted');
      })
    });
  }


  deleteImage(profile: any, id: any) {
    if (profile.startsWith('./assets/placeholder-img.png')) {
      this.deleteData(id);
      return
    } else {
      this.storage.storage.refFromURL(profile).delete().then(() => {
        this.deleteData(id);
        console.log("img deleted");
      })
    }
  }
  editData(id: any, employeeData: any, selectedLanguagesString: string) {
    // Add the 'language' field to the employeeData object
    employeeData.language = selectedLanguagesString;
  
    this.afs.collection('employee').doc(id).update(employeeData).then(() => {
      console.log("Data edited");
    }).catch(error => {
      console.error("Error editing data:", error);
    });
  }
  

  loadOneData(id: any) {
    return this.afs.collection('employee').doc(id).valueChanges()
  }

}
