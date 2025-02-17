import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Final170225';
  
  getUsername(): string {
    //obtengo el name por parametro de la url
    let url = window.location.href;
    let name = url.split('name=')[1];
    let savedName = localStorage.getItem('username');
    
    if (name){
      localStorage.setItem('username', decodeURIComponent(name));
      return  decodeURIComponent(name);
    }
    
    if (savedName){
      return savedName;
    }
    
    return '';
  }
}
