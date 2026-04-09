import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Api } from '../services/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, FormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn {
  constructor(private api : Api) {}
  email = '';
  password = '';
  
  onClickSignIn(){
    const userData = {
      email: this.email,
      password: this.password,
    }

    this.api.postAll(`auth/sign_in`, userData)
    .subscribe((res: any) => {
      console.log(`Post Response:`, res);  
      if(res.access_token && res.refresh_token){
         localStorage.setItem('access_token', res.access_token);
         localStorage.setItem('refresh_token', res.refresh_token)
         alert(`Logged in successfully`)
      }
  })
  }
}
