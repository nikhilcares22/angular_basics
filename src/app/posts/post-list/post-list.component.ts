import { Component,Input } from "@angular/core"

@Component({
  selector:"app-post-list",
  templateUrl:"./post-list.component.html",
  styleUrls:["./post-list.component.css"]
})
export class PostListComponent {
  @Input() posts:any = [];
  // posts:Array<any>=[
  //   // {title:"First Post",content:"This is the first post."},
  //   // {title:"Angular Course",content:"This Course will cover the basics of angular and the instructor is Maxmillan."},
  //   {title:"Third Post.",content:"The third post is this"},
  // ]
}
