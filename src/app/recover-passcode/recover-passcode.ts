import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Api } from '../services/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recover-passcode',
  imports: [RouterLink,FormsModule],
  templateUrl: './recover-passcode.html',
  styleUrl: './recover-passcode.scss',
})
export class RecoverPasscode {
  email: string = '';

  constructor(private api: Api, private cdr: ChangeDetectorRef){}
  resetPassword(){
    this.api.postAll(`auth/recovery`,{
      email: this.email
    }).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.api.show(res.message)
        } 
      }
    }
  )}
}
