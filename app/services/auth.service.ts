import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../interfaces/User';
import { map } from 'rxjs/operators'
import * as firebase from 'firebase';
import { $ } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: User = {};
  public itens: any;
  private UsersCollection: AngularFirestoreCollection<User>;
  constructor(
    private afa: AngularFireAuth,
    private afs: AngularFirestore,
  ) {
    this.UsersCollection = this.afs.collection<User>('Users');
  }
  login(user: User) {
    return this.afa.signInWithEmailAndPassword(user.email, user.password);
  }
  register(user: User) {
    return this.afa.createUserWithEmailAndPassword(user.email, user.password);
  }

  logout() {
    return this.afa.signOut();
  }

  getAuth() {
    return this.afa;
  }
  getUsers() {
    return this.UsersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        });
      })
    )
  }


  async getUser(id) {
    let user = this.afa.currentUser;
    const uid = (await user).uid;
    console.log('uid?',uid)
    return this.afs.collection('Users').doc(uid).valueChanges();
    
  }
  updateUser(id: string, user: User) {
    return this.UsersCollection.doc<User>(id).update(user);
  }
 
}
