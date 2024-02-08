import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserDataService implements OnInit {

  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    
  }
}
