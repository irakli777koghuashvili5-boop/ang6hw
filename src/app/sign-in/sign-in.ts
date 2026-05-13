
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

  onClickSignIn(form : any) {

    this.api.postAll(`auth/sign_in`, form.value).subscribe({
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
                this.api.show(`Welcome back`);
                localStorage.setItem('userId', res1._id);
                localStorage.setItem('firstName', res1.firstName);
                localStorage.setItem(`avatar`, res1.avatar);
                this.router.navigateByUrl('/home');
                this.cdr.detectChanges();
              },
              error: (err: any) => {
                const status = err.status || err.error?.statusCode;

                if(status === 400){
                  this.api.show(`Wrong email or password`);
                  this.cdr.detectChanges()
                }

                if (status === 409) {
                  this.api.show('Email not verified. Confirmation email sent to ' + form.value.email);

                  this.api.postAll(`auth/verify_email`, { email:  form.value.email }).subscribe({
                    next: (res2: any) => console.log('Verification sent:', res2),
                    error: (errVerify: any) => {
                      this.api.show('Failed to send confirmation email.');
                      console.error(errVerify);
                    },
                  });
                } else {
                  this.api.show(`Failed to load user profile.`);
                }
                this.cdr.detectChanges();
              },
            });
        }
      },
      error: (err: any) => {
        const status = err.status || err.error?.statusCode;
        if (status === 400 || status === 401) {
          this.api.show(`Wrong email or password`);
        }
        this.cdr.detectChanges();
      },
    });
  }
}
