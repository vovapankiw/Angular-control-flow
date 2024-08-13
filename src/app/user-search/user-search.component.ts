import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.scss',
})
export class UserSearchComponent implements OnInit {
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

  form = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.populateInputFromQuery();
    this.listenToSearchChange();
  }

  private populateInputFromQuery() {
    this.activeRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ search }) => {
        this.form.controls['search'].setValue(search);
      });
  }

  private listenToSearchChange() {
    this.form.controls.search.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((query) => {
        const queryParams = { search: query };

        this.router.navigate([], {
          relativeTo: this.activeRoute,
          queryParamsHandling: 'merge',
          replaceUrl: true,
          queryParams,
        });
      });
  }
}
