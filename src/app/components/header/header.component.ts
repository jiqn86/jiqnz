import { Component, OnInit } from '@angular/core';
import { Auth, user, getAuth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;

  constructor(private auth: Auth) { }

  ngOnInit(): void {
    user(this.auth).subscribe(
      (user) => {
        this.isLoggedIn = !!user;
      })
  }

  loginUser(): void {
    signInWithPopup(getAuth(), new GoogleAuthProvider());
  }

  logoutUser(): void {
    getAuth().signOut();
  }

}
