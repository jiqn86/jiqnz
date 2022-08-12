import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  commentText = '';

  constructor(public modalRef: MdbModalRef<ModalComponent>) { }

  sendMessage(): void {
    this.commentText !== '' ? this.modalRef.close(this.commentText) : this.modalRef.close();
  }

}
