import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'minesweeper';

  gameOver($event) : void {
    alert('game win? = ' + $event);
  }
}
