import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Api } from '../services/api';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  constructor(private api : Api) {}
  postResp = {}
  firstName = '';
  lastName = '';
  age = 1;
  email = '';
  password = '';
  address = '';
  phone = '';
  zipcode = '';
  avatar = "https://api.dicebear.com/9.x/adventurer/svg?seed=Valentina";
  gender = '';

  onCreateAccount() {
    const userData ={
      "firstName": this.firstName,
      "lastName": this.lastName,
      "age": this.age,
      "email": this.email,
      "password": this.password,
      "address": this.address,
      "phone": this.phone,
      "zipcode": this.zipcode,
      "avatar": this.avatar,
      "gender": this.gender
    }   
    this.api.postAll(`auth/sign_up`, userData)
    .subscribe((res: any) => {
      console.log(`Post Response:`, res);
      this.postResp = res;
      if(res._id){
        alert(`Account created successfully`)
        window.location.href = '/sign-in';
      }
      
    });
    
  }
  ngOnInIt() {
    console.log(this.firstName);
    console.log(this.lastName);
    console.log(this.age);  
    console.log(this.email);
    console.log(this.password);
    console.log(this.address);
    console.log(this.phone);
    console.log(this.zipcode);
    console.log(this.avatar);
    console.log(this.gender);
  }
}



