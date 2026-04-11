import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../services/api';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  tab = 'details';
  arrOfProfile: any = {};

  constructor(private api: Api , private cdr: ChangeDetectorRef){}
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
    window.location.reload();
  }
  
}
