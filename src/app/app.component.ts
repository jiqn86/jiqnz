import { Component } from '@angular/core';
import { User, Auth, user } from '@angular/fire/auth';
import { Observable } from 'rxjs/internal/Observable';
import { take } from 'rxjs/operators';
import {
  collection,
  collectionChanges,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  getFirestore,
  orderBy,
  query,
  CollectionReference,
  DocumentChange,
} from '@angular/fire/firestore';
import { formatISO } from 'date-fns';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalComponent } from './components/modal/modal.component';
import { Jiqnz } from './models/jiqnz.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jiqnz-tweet';
  modalRef: MdbModalRef<ModalComponent> | null = null;

  user$: Observable<User | null>;

  jiqnz: Jiqnz[] = [];

  constructor(public auth: Auth, private modalService: MdbModalService) {
    this.user$ = user(auth);
    this.getJiqnz();
  }

  addNewJiqnz(newJiqnz: Omit<Jiqnz, 'id'>) {
    addDoc(collection(getFirestore(), 'jiqnz'), newJiqnz);
  }

  async onJiqnzLike(jiqnz: Jiqnz) {
    const user = await this.getUser();
    if (!user) {
      return;
    }
    const likeDocRef = doc(
      getFirestore(),
      `jiqnz/${jiqnz.id}/likes/${user.uid}`
    );
    const document = await getDoc(likeDocRef);
    const docExists = document.exists();
    if (docExists) {
      jiqnz.likedBy = jiqnz.likedBy.filter((id: string) => id !== user.uid);
      jiqnz.liked = false;
      await deleteDoc(likeDocRef);
    } else {
      jiqnz.likedBy.push(user.uid);
      jiqnz.liked = true;
      await setDoc(likeDocRef, {
        id: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    }
    const docRef = doc(getFirestore(), `jiqnz/${jiqnz.id}`);
    const {liked, commented, ...updatedJiqnz} = jiqnz;
    updateDoc(docRef, {
      ...updatedJiqnz,
    });
  }

  async setComment(jiqnz: Jiqnz, message: string) {
    const user = await this.getUser();
    if (!user) {
      return;
    }
    jiqnz.commentedBy.push(user.uid);

    const docRef = doc(
      getFirestore(),
      `jiqnz/${jiqnz.id}/comments/${user.uid}${formatISO(new Date())}`
    );

    await setDoc(docRef, {
      id: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      comment: message,
      createdAt: formatISO(new Date())
    });

    const jiqnzDocRef = doc(getFirestore(), `jiqnz/${jiqnz.id}`);
    updateDoc(jiqnzDocRef, {
      ...jiqnz,
    });
  }

  async onJiqnzComment(event: Jiqnz) {
    this.modalRef = this.modalService.open(ModalComponent);
    this.modalRef.onClose.subscribe((message: any) => {
      if (!message) {
        return;
      }
      this.setComment(event, message);
    });
  }

  async getUser(): Promise<User | null> {
    const user = await this.user$.pipe(take(1)).toPromise();
    return user || null;
  }

  async getJiqnz() {
    const user = await this.getUser();
    collectionChanges<any>(
      query<any>(
        collection(getFirestore(), 'jiqnz') as CollectionReference<Jiqnz>,
        orderBy('createdAt', 'desc')
      )
    ).subscribe((jiqnz) => {
      jiqnz.map((snapshot) => {
        this.onJiqnzSnapshot(snapshot, user);
      });
    });
  }

  onJiqnzSnapshot(change: DocumentChange<Jiqnz>, user: User | null) {
    const data = change.doc.data() as any;
    switch (change.type) {
      case 'added':
        const jiqnz = {
          ...data,
          id: change.doc.id,
          liked: !!user && !!data.likedBy.includes(user.uid),
        };
        this.jiqnz.splice(change.newIndex, 0, jiqnz);
        break;
      case 'removed':
        this.jiqnz.splice(change.oldIndex, 1);
        break;
      case 'modified':
        if (change.newIndex === change.oldIndex) {
          this.jiqnz[change.oldIndex] = {
            ...data,
            id: change.doc.id,
            liked: !!user && !!data.likedBy.includes(user.uid),
          };
        } else {
          this.jiqnz.splice(change.oldIndex, 1);
          this.jiqnz.splice(change.newIndex, 0, {
            ...data,
            id: change.doc.id,
            liked: !!user && !!data.likedBy.includes(user.uid),
          });
        }
        break;
    }
  }

}
