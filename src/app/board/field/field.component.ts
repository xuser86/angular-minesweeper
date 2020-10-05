import { Component, EventEmitter, Input, OnInit, Output, ElementRef } from '@angular/core';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {
  @Input() state : string;
  @Input() value : number;
  @Input() x : number;
  @Input() y : number;
  @Output() clickEvent = new EventEmitter<object>();
  @Output() rbClickEvent = new EventEmitter<object>();

  colours: Array<string> = [
    'blue', 'green', 'red',
    'purple', 'maroon', 'turquoise', 
    'black', 'gray'
  ];

  textColor : string;

  ngOnInit(): void {
    // rainbow
    // this.textColor = `hsl(${(this.value-1)*45},100%,50%)`;
    // classic
    this.textColor = this.colours[this.value-1];
  }

  onClick($event) {
    this.clickEvent.emit({ x: this.x, y: this.y });
    return false;
  }

  onRBClick($event) {
    this.rbClickEvent.emit({ x: this.x, y: this.y });
    return false;
  }  
}
