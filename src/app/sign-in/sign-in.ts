
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Api } from '../services/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.scss'], 
})
export class SignIn {
  mainResp: any = {};
  email = '';
  password = '';
  firstname = localStorage.getItem('firstName');
  isPasswordVisible = false; 

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  onClickSignIn() {
    const userData = {
      email: this.email,
      password: this.password,
    };

    this.api.postAll(`auth/sign_in`, userData).subscribe({
      next: (res: any) => {
        if (res.access_token && res.refresh_token) {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('refresh_token', res.refresh_token);

          this.api
            .getAllHeader(`auth`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')} `,
              },
            })
            .subscribe({
              next: (res1: any) => {
                alert(`Welcome back`);
                localStorage.setItem('userId', res1._id);
                localStorage.setItem('firstName', res1.firstName);
                localStorage.setItem(`avatar`, res1.avatar);
                window.location.href = '/profile';
                this.cdr.detectChanges();
              },
              error: (err: any) => {
                const status = err.status || err.error?.statusCode;

                if (status === 409) {
                  alert('Email not verified. Confirmation email sent to ' + this.email);

                  this.api.postAll(`auth/verify_email`, { email: this.email }).subscribe({
                    next: (res2: any) => console.log('Verification sent:', res2),
                    error: (errVerify: any) => {
                      alert('Failed to send confirmation email.');
                      console.error(errVerify);
                    },
                  });
                } else {
                  alert(`Failed to load user profile.`);
                }
                this.cdr.detectChanges();
              },
            });
        }
      },
      error: (err: any) => {
        const status = err.status || err.error?.statusCode;
        if (status === 400 || status === 401) {
          alert(`Wrong email or password`);
        }
        this.cdr.detectChanges();
      },
    });
  }
}
