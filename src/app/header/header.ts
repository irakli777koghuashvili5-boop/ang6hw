import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Api } from '../services/api';

@Component({
  selector: 'app-header',
  imports: [RouterModule , CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(private api: Api, private cdr: ChangeDetectorRef){}
  seeSign: boolean = true;
  isMenuOpen = false;
  isScrolled = false;
  firstName = localStorage.getItem(`firstName`)
  ngOnInit() {
    this.checkAuthentication();
  }

  checkAuthentication() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.seeSign = false;
    }
    else {
      this.seeSign = true;
    }
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
