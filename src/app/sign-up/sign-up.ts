import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Api } from '../services/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

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
  email = '';
  avatar = 'https://api.dicebear.com/9.x/adventurer/svg?seed=Aiden';

  isPasswordVisible = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onCreateAccount(form : any) {

    this.api.postAll(`auth/sign_up`, {
      ...form.value,
      avatar: this.avatar,
    }).subscribe({
      next: (res: any) => {
        if (res && res._id) {
          this.formVisible = false;
          this.api.show('Account created successfully.');
          this.confirmationVisible = true;
          this.cdr.detectChanges();
        }
        },
      error: (err: any) => {
        this.api.show('Failed to create account.');
        this.cdr.detectChanges();
      },
    });
  }
  sendConfirm() {
    console.log(this.email);

    this.api.postAll(`auth/verify_email`, { email: this.email }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.api.show('Confirmation email sent to ' + this.email);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.api.show('Failed to send confirmation email.');
        this.cdr.detectChanges();
      },
    });
  }

  ngOnInit() {
    console.log('Component Initialized');
  }
}
