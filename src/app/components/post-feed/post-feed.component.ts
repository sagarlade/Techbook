import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import {
  FirebaseTSFirestore,
  Limit,
  OrderBy,
  Where,
} from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.css'],
})
export class PostFeedComponent implements OnInit {
  firestore = new FirebaseTSFirestore();
  posts: PostData[] = [];
  selectedImageFile: File | null = null;
  auth = new FirebaseTSAuth();
  storage = new FirebaseTSStorage();
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.firestore.getCollection({
      path: ['Posts'],
      where: [new OrderBy('timestamp', 'desc'), new Limit(1)],
      onComplete: (result) => {
        result.docs.forEach((doc) => {
          let post = <PostData>doc.data();
          post.postId = doc.id;
          this.posts.push(post);
        });
      },
      onFail: (err) => {},
    });
 
  }

  onPostClick(commentInput: HTMLTextAreaElement) {
    let comment = commentInput.value;
    if (comment.length <= 0) return;
    if (this.selectedImageFile) {
      this.uploadImagePost(comment);
    } else {
      this.uploadPost(comment);
    }
  }

  uploadImagePost(comment: string) {
    let postId = this.firestore.genDocId();
    if (this.auth.getAuth().currentUser) {
      this.storage.upload({
        uploadName: 'upload Image Post',
        path: ['Posts', postId, 'image'],
        data: {
          data: this.selectedImageFile!,
        },
        onComplete: (downloadUrl) => {
          this.firestore.create({
            path: ['Posts', postId],
            data: {
              comment: comment,
              creatorId: this.auth.getAuth().currentUser!.uid,
              imageUrl: downloadUrl,
              timestamp: FirebaseTSApp.getFirestoreTimestamp(),
            },
          });
        },
      });
    }
  }

  uploadPost(comment: string) {
    if (this.auth.getAuth().currentUser) {
      this.firestore.create({
        path: ['Posts'],
        data: {
          comment: comment,
          creatorId: this.auth.getAuth().currentUser!.uid,
          timestamp: FirebaseTSApp.getFirestoreTimestamp(),
        },
      });
    }
  }

  onPhotoSelected(photoSelector: HTMLInputElement) {
    const files = photoSelector.files;
    if (files && files.length > 0) {
      this.selectedImageFile = files[0];
      let fileReader = new FileReader();
      fileReader.readAsDataURL(this.selectedImageFile);
      fileReader.onloadend = (ev) => {
        let readableString = fileReader.result as string;
        let postPreviewImage = document.getElementById(
          'post-preview-image'
        ) as HTMLImageElement;
        if (postPreviewImage) {
          postPreviewImage.src = readableString;
        }
      };
    }
  }

}

export interface PostData {
  comment: string;
  creatorId: string;
  imageUrl?: string;
  postId: string;
  likes:number;
}
