import { Component } from '@angular/core';

localStorage.setItem('balance', '25000');
localStorage.setItem('watchList', '[]');
localStorage.setItem('portfolio', '[]');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front';

  public isMenuCollapsed = true;
}
