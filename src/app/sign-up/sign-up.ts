import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Api } from '../services/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
  ) {}

  formVisible: boolean = true;
  confirmationVisible: boolean = false;
  firstName = '';
  lastName = '';
  age = 1;
  email = '';
  password = '';
  address = '';
  phone = '';
  zipcode = '';
  gender = 'MALE';
  avatar = 'https://api.dicebear.com/9.x/adventurer/svg?seed=Aiden';

  isPasswordVisible = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onCreateAccount() {
    const userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      age: this.age,
      email: this.email,
      password: this.password,
      address: this.address,
      phone: this.phone,
      zipcode: this.zipcode,
      avatar: this.avatar,
      gender: this.gender,
    };

    this.api.postAll(`auth/sign_up`, userData).subscribe({
      next: (res: any) => {
        if (res && res._id) {
          this.formVisible = false;
          this.confirmationVisible = true;
          this.cdr.detectChanges();
        }
      },
    });
  }
  sendConfirm() {
    console.log(this.email);

    this.api.postAll(`auth/verify_email`, { email: this.email }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.cdr.detectChanges();
      },
    });
  }

  ngOnInit() {
    console.log('Component Initialized');
  }
}



