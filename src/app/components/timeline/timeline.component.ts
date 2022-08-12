import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { formatDistance, parseISO } from 'date-fns';
import { faHeart, faComment } from '@fortawesome/free-solid-svg-icons';
import {
  collection,
  collectionChanges,
  getFirestore,
  orderBy,
  query,
  CollectionReference,
} from '@angular/fire/firestore';
import { Jiqnz } from 'src/app/models/jiqnz.interface';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  @Input() jiqnz!: Jiqnz;
  @Output() jiqnzLiked = new EventEmitter<Jiqnz>();
  @Output() jiqnzCommented = new EventEmitter<Jiqnz>();

  heart = faHeart;
  commentIcon = faComment;
  commentMessage = '';
  comments: any = [];
  commentId = '';

  constructor() {
  }

  get jiqnzCreatedAt(): string {
    if (!this.jiqnz) {
      return '';
    }
    return formatDistance(parseISO(this.jiqnz?.createdAt), new Date());
  }

  ngOnInit(): void {
    this.getComments();
  }

  async getComments() {
    collectionChanges<any>(
      query<any>(
        collection(getFirestore(), `jiqnz/${this.jiqnz.id}/comments`) as CollectionReference<Jiqnz>,
        orderBy('createdAt', 'desc')
      )
    ).subscribe((jiqnz) => {
      jiqnz.map((snapshot) => {
        const data = snapshot.doc.data();
        data.createdFormat = data.createdAt ? formatDistance(parseISO(data.createdAt), new Date()) : ''
        this.comments.push(data);
      });
    });
  }

}
