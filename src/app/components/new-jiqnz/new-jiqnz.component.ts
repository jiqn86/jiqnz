import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formatISO } from 'date-fns';
import { User } from '@angular/fire/auth';
import { Jiqnz } from 'src/app/models/jiqnz.interface';

@Component({
  selector: 'app-new-jiqnz',
  templateUrl: './new-jiqnz.component.html',
  styleUrls: ['./new-jiqnz.component.scss']
})
export class NewJiqnzComponent {

  @Output() newJiqnz = new EventEmitter<Omit<Jiqnz, 'id'>>();
  @Input() user!: User;

  jiqnzMessage = '';

  constructor() { }

  get isJiqnzEmpty() {
    return this.jiqnzMessage.trim().length === 0;
  }

  onSubmit($event: Event) {
    $event.preventDefault();
    if (this.isJiqnzEmpty) {
      return;
    }
    this.newJiqnz.emit({
      content: this.jiqnzMessage,
      likedBy: [],
      commentedBy: [],
      createdAt: formatISO(new Date()),
      by: {
        id: this.user.uid,
        name: this.user.displayName || this.user.email || '',
        username: '',
        profileURL: this.user.photoURL || '',
      },
    });
    this.jiqnzMessage = '';
  }

}
