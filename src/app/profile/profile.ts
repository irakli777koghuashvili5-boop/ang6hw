import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../services/api';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  tab = 'details';
  arrOfProfile: any = {};
  oldPassword = '';
  newPassword = '';
  showPopup = false;
  showEditPopup = false;
  

  constructor(private api: Api , private cdr: ChangeDetectorRef,private x:Router){}
  ngOnInit(){
    this.api.getAllHeader(`auth`, {
       headers : {
          "Authorization" : `Bearer ${localStorage.getItem('access_token')} `
     }
    }).subscribe(res => {
      console.log(res)
      this.arrOfProfile = res;
      this.cdr.detectChanges();
    }
    )
  }

  logOutFn(){
    localStorage.removeItem(`access_token`)
    localStorage.removeItem(`firstName`)
    localStorage.removeItem(`userId`)
    localStorage.removeItem(`refresh_token`)
    window.location.href = '/sign-in'
  }
 changePass() {

  const token = localStorage.getItem('access_token');
  if (!token) {
    console.error('No token found. User is not logged in.');
    return; 
  }
  const apiUrl = 'auth/change_password';
  this.api.patchData(apiUrl, {
    oldPassword: this.oldPassword,
    newPassword: this.newPassword
  }).subscribe({
    next: (res) => {
      console.log('Password changed successfully:', res);
      this.oldPassword = '';
      this.newPassword = '';
      this.showPopup = false;
      this.cdr.detectChanges();

    },
    error: (err) => {
      console.error('Failed to change password:', err);
    }
  });
}

 updateProfile() {
  const apiurl = `auth/update`
    this.api.patchData(apiurl, this.arrOfProfile).subscribe({
      next: (res) => {
        alert('Profile updated successfully');
        this.showEditPopup = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Failed to update profile');
      }
    });
  }
  
}
