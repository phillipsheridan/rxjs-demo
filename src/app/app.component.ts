import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fromEvent, Observable, Subject } from 'rxjs';
import {
  take,
  map,
  filter,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private http: HttpClient) {}
  searchSubject$ = new Subject<string>();
  searchString: string = '';
  results$ = new Observable<any>();

  ngOnInit() {
    this.results$ = this.searchSubject$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap((x) => console.log(x)),
      switchMap((searchString) => this.queryApi(searchString))
    );
  }

  queryApi(searchString) {
    console.log('queryApi', searchString);
    return this.http
      .get(`https://www.reddit.com/r/aww/search.json?q=${searchString}`)
      .pipe(map((result) => result['data']['children']));
  }

  inputChanged($event) {
    this.searchSubject$.next($event);
  }

  ngOnDestroy() {}
}
