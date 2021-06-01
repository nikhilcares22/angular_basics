import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: any;
  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }
  onDelete(postId:string|null){
    this.postsService.deletePost(postId);
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
