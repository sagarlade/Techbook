import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PostData } from '../post-feed/post-feed.component';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() postData!: PostData;
  creatorName: string = '';
  creatorDescription: string = '';
  numberOfLikes: number = 0;
  firestore = new FirebaseTSFirestore();
  isLiked: boolean = false;
  @Output() likeChanged: EventEmitter<number> = new EventEmitter<number>();
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getCreatorInfo();
    if (this.postData && this.postData.likes) {
      this.numberOfLikes = this.postData.likes;
    }
  }

  getCreatorInfo() {
    this.firestore.getDocument({
      path: ['Users', this.postData.creatorId],
      onComplete: (result) => {
        const userDocument = result.data() as any;
        if (userDocument) {
          this.creatorName = userDocument.publicName;
          this.creatorDescription = userDocument.description;
        }
      },
    });
  }
  likeButtonClick() {
    if (!this.isLiked) {
      
    }
    this.isLiked = true;
      this.numberOfLikes++;
    this.likeChanged.emit(this.numberOfLikes);
  }
}
