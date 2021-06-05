import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type-validator';

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
  imagePreview: string;
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
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
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
            image: postData.posts.image,
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image:this.post.image,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  get getControl() {
    return this.form.controls;
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files?.item(0);
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file as Blob);
  }
  onSavePost() {
    if (this.form.invalid) return;
    this.isLoading = true;
    if (this.mode === 'create')
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    if (this.mode === 'edit')
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
      );
    this.form.reset();
  }
}
