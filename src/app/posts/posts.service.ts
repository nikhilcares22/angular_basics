import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated =
    new Subject<any /* { posts: Post[];postsCount: number } */>();

  constructor(private http: HttpClient, private router: Router) {}
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.http
      .get<{ message: string; posts: any[]; maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                image: post.image,
                user: post.user,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postsCount: transformedPostData.maxPosts,
        });
      });
  }
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  getPost(id: string | null) {
    return this.http.get<{ message: string; posts: any }>(
      'http://localhost:3000/api/posts/' + id
    );
  }
  addPost(title: string, content: string, image: File) {
    const post = {
      id: null,
      title,
      content,
    };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; data: any }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }
  updatePost(
    id: string | undefined | null,
    title: string,
    content: string,
    image: File | string
  ) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('title', title);
      postData.append('id', id + '');
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        image: image,
        title: title,
        content: content,
        user: null,
      };
    }
    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }
  deletePost(postId: string | null | undefined) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}
