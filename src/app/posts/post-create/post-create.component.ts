import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  form: FormGroup;
  enteredTitle = '';
  enteredContent = '';
  isLoading = false;
  post: Post | any;
  private mode = 'create';
  private postId: string | undefined | null;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData.posts._id,
            title: postData.posts.title,
            content: postData.posts.content,
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  get getControl(){
    return this.form.controls;
  }
  onSavePost() {
    if (this.form.invalid) return;
    this.isLoading = true;
    if (this.mode === 'create')
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    if (this.mode === 'edit')
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    this.form.reset();
  }
}
