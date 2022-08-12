import { Component, Input } from '@angular/core';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  @Input() user!: User;

  constructor() { }
}
