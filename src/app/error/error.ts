import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [RouterLink],
  templateUrl: './error.html',
  styleUrl: './error.scss',
})
export class Error {
  constructor(private x: Router){
    console.log(this.x);
  }
  user =`user`
  id = 1;

  goToHome(){
    this.x.navigateByUrl(`/home?id=${this.id}`);
  }

}
