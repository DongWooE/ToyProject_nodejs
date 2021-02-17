import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RSA_NO_PADDING } from 'constants';
import { Subscription, of } from 'rxjs';
import {map} from 'rxjs/operators'

@Component({
  selector: 'ne-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  
  public subscription : Subscription;
  number = 10;
  title = 'web';
  url = 'http://localhost:5001/v1/posts/602c0ccc6f07ed2eb0f88c03';
  JsonData : string[] = [];
  config : Config;
  result : Config;

  constructor(private http: HttpClient) {

  }
  ngOnInit(): void {
    //of({ name : '이동우'}).subscribe(res => console.log(res));
    this.subscription = this.http.get<any[]>(this.url, { observe : 'body', responseType: 'json'})
    .subscribe(
      res =>{
        console.log(res);
        this.JsonData = res.map( u => u.data);
      }


      //(data : Config)=> this.config ={
       //id : (data as any).id,
      //title : (data as any).title,
      //content : (data as any).content,
    //}
    );

  }


}
export interface Config {
  id : string;
  title : string;
  content : string;
}