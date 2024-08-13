import { Component, inject } from '@angular/core';
import { GithubService } from '../github.service';
import {
  combineLatest,
  debounce,
  debounceTime,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AsyncPipe, JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, AsyncPipe, JsonPipe, UserComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  githubService = inject(GithubService);
  activeRoute = inject(ActivatedRoute);
  router = inject(Router);

  users$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    switchMap(() => this.activeRoute.queryParams),
    switchMap(({ search }) => {
      return this.githubService.getUsers().pipe(
        // Due to Github free API limitations we are doing filtering on Frontend
        map((users) => this.githubService.filterUserByQuery(search, users))
      );
    })
  );
}
