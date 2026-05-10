import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Alert } from './alert/alert';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Header,Footer, Alert],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ang6hw');
}
