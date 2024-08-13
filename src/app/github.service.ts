import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly apiURL = 'https://api.github.com/users';
  private readonly http = inject(HttpClient);

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}?/per_page=10`);
  }

  getSingleUser(username: string) {
    return this.http.get(`${this.apiURL}/${username}`);
  }

  filterUserByQuery(query: string, users: any[]) {
    if (!query) return users;

    return users.filter((u) =>
      u.login.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    );
  }
}
