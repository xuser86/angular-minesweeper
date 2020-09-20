import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  grid : object[][];

  constructor() { 
    this.prepareBoard(30, 60);
  }

  neighbours(x: number, y: number) {
    const neighbours : Array<object> = [];
    const dim = this.grid.length;

    if (x > 0 && y > 0) {
      neighbours.push({y: y - 1, x: x - 1, diag: true});
    }
    if (x > 0) {
      neighbours.push({y: y, x: x - 1, diag: false});
    }
    if (y > 0) {
      neighbours.push({y: y - 1, x: x, diag: false});
    }
    if (x > 0 && y < dim - 1) {
      neighbours.push({y: y + 1, x: x - 1, diag: true});
    }
    if (y > 0 && x < dim - 1) {
      neighbours.push({y: y - 1, x: x + 1, diag: true});
    }
    if (y < dim - 1) {
      neighbours.push({y: y + 1, x: x, diag: false});
    }
    if (x < dim - 1) {
      neighbours.push({y: y, x: x + 1, diag: false});
    }
    if (y < dim - 1 && x < dim - 1) {
      neighbours.push({y: y + 1, x: x + 1, diag: true});
    }

    return neighbours;
  }

  prepareBoard(dim : number, minesCount : number) {
    this.grid = [];

    for (let y = 0; y < dim; y++) {
      this.grid[y] = [];
      for (let x = 0; x < dim; x++) {  
        this.grid[y][x] = { 
          state: 'unrevealed', 
          value: 0,
          mine: false
        };
      }
    }

    for (let i = 0; i < minesCount + 1; i++) {
      let x = Math.floor(Math.random() * dim);
      let y = Math.floor(Math.random() * dim);

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
    return this.grid[y][x]['state'] === 'unrevealed';
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
            if (this.isUnrevealed(nb['x'], nb['y']) && stack.find(coord => coord['x'] === nb['x'] && coord['y'] === nb['y']) === undefined) {
              stack.push(nb);
            }
          }
        } else if (this.grid[t['y']][t['x']]['value'] > 0) {
          this.unreveal(t['x'], t['y']);
        }
      }
    } else {
      this.unreveal(x, y, true);
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

  ngOnInit(): void {
  }

  onFieldClick($event) {
    this.unrevealChain($event['x'], $event['y']);
  }
}
