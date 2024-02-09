import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserData } from '../model/user-data';

@Injectable({
  providedIn: 'root'
})
export class UserDataService implements OnInit {

  userData: UserData

  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    
  }
}
