import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  grid : object[][];
  dimX : number = 30;
  dimY : number = 15;
  minesCount : number = 45;
  @Output() gameOver = new EventEmitter<boolean>();;

  constructor() {}

  ngOnInit(): void {
    this.prepareBoard(this.dimX, this.dimY, this.minesCount);
  }

  neighbours(x: number, y: number) {
    const neighbours : Array<object> = [];
    const dimY = this.grid.length;
    const dimX = this.grid[0].length;

    if (x > 0 && y > 0) {
      neighbours.push({y: y - 1, x: x - 1, diag: true});
    }
    if (x > 0) {
      neighbours.push({y: y, x: x - 1, diag: false});
    }
    if (y > 0) {
      neighbours.push({y: y - 1, x: x, diag: false});
    }
    if (x > 0 && y < dimY - 1) {
      neighbours.push({y: y + 1, x: x - 1, diag: true});
    }
    if (y > 0 && x < dimX - 1) {
      neighbours.push({y: y - 1, x: x + 1, diag: true});
    }
    if (y < dimY - 1) {
      neighbours.push({y: y + 1, x: x, diag: false});
    }
    if (x < dimX - 1) {
      neighbours.push({y: y, x: x + 1, diag: false});
    }
    if (y < dimY - 1 && x < dimX - 1) {
      neighbours.push({y: y + 1, x: x + 1, diag: true});
    }

    return neighbours;
  }

  prepareBoard(dimX : number, dimY : number, minesCount : number) {
    this.grid = [];

    for (let y = 0; y < dimY; y++) {
      this.grid[y] = [];
      for (let x = 0; x < dimX; x++) {  
        this.grid[y][x] = { 
          state: 'unrevealed', 
          value: 0,
          mine: false
        };
      }
    }

    for (let i = 0; i < minesCount + 1; i++) {
      let x = Math.floor(Math.random() * dimX);
      let y = Math.floor(Math.random() * dimY);

      if (!this.grid[y][x]['mine']) {
        this.grid[y][x]['mine'] = true;

        const neighbours = this.neighbours(x, y);
        for (let nb of neighbours) {
          this.grid[nb['y']][nb['x']]['value'] ++;
        }
      } else {
        i--;
      }
    }
  }

  unrevealAll() : void {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {  
        this.unreveal(x, y);
      }
    }
  }

  isEmpty(x: number, y: number) : boolean {
    return !this.grid[y][x]['mine'] && this.grid[y][x]['value'] === 0;
  }

  isUnrevealed(x: number, y: number) {
    return this.grid[y][x]['state'] === 'unrevealed' || this.grid[y][x]['state'] === 'flag';
  }

  mark(x: number, y: number) : void {
    if (this.grid[y][x]['state'] === 'unrevealed') {
      this.grid[y][x]['state'] = 'flag';
    } else if (this.grid[y][x]['state'] === 'flag') {
      this.grid[y][x]['state'] = 'unrevealed';
    }
  }

  unrevealChain(x: number, y: number) : void {
    if (this.isEmpty(x, y)) {
      const stack: object[] = [{x, y}];
      while (stack.length > 0) {
        const t = stack.pop();
        const neighbours = this.neighbours(t['x'], t['y']);
        if (this.isEmpty(t['x'], t['y'])) {
          this.unreveal(t['x'], t['y']);

          for (let nb of neighbours) {
            if (this.isUnrevealed(nb['x'], nb['y']) && stack.every(crd => !(crd['x'] === nb['x'] && crd['y'] === nb['y']))) {
              stack.push(nb);
            }
          }
        } else if (this.grid[t['y']][t['x']]['value'] > 0) {
          this.unreveal(t['x'], t['y']);
        }
      }
    } else {
      this.checkGameOver(this.unreveal(x, y, true));
    }
  }

  checkGameOver(newState = null) {
    // TODO: fix game over check
    if (newState === 'blown-mine') {
      this.gameOver.emit(false); // game lost
    } else {
      let reveledCount = 0;
      for (let y = 0; y < this.grid.length; y++) {
        for (let x = 0; x < this.grid[y].length; x++) {  
          if (this.grid[y][x]['mine'] && (this.grid[y][x]['state'] === 'unrevealed' || this.grid[y][x]['state'] === 'flag')) {
            reveledCount++;
          }
        }
      }
      if (reveledCount === this.minesCount) {
        this.gameOver.emit(true); // game win
      }
    }
  }

  unreveal(x: number, y: number, isManual: boolean = false) : string {
    if (this.grid[y][x]['state'] !== 'unrevealed') {
      return '';
    }
    if (this.grid[y][x]['mine']) {
      if (isManual) {
        this.grid[y][x]['state'] = 'blown-mine';
      } else{
        this.grid[y][x]['state'] = 'mine';
      }
    } else if (this.grid[y][x]['value'] > 0) {
      this.grid[y][x]['state'] = 'number';
    } else {
      this.grid[y][x]['state'] = 'empty';
    }

    return this.grid[y][x]['state'];
  }

  onFieldClick($event) {
    this.unrevealChain($event['x'], $event['y']);
  }

  onFieldRBClick($event) {
    this.mark($event['x'], $event['y']);
  }
}
