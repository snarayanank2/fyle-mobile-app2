import { Component, OnInit } from '@angular/core';
import { Observable, Subject, from, noop } from 'rxjs';
import { OfflineService } from 'src/app/core/services/offline.service';
import { AdvanceRequestService } from 'src/app/core/services/advance-request.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { concatMap, switchMap, finalize, map, scan, shareReplay, tap, take } from 'rxjs/operators';
import { ExtendedAdvanceRequest } from 'src/app/core/models/extended_advance_request.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-advance',
  templateUrl: './team-advance.page.html',
  styleUrls: ['./team-advance.page.scss'],
})
export class TeamAdvancePage implements OnInit {

  teamAdvancerequests$: Observable<any[]>;
  loadData$: Subject<{ pageNumber: number, state: string }> = new Subject();
  count$: Observable<number>;
  currentPageNumber = 1;
  isInfiniteScrollRequired$: Observable<boolean>;
  state = 'PENDING';
  acc: any[];

  constructor(
    private offlineService: OfflineService,
    private advanceRequestService: AdvanceRequestService,
    private loaderService: LoaderService,
    private router: Router
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.currentPageNumber = 1;
    const paginatedPipe = this.loadData$.pipe(
      concatMap(({ pageNumber, state }) => {
        const extraParams = state === 'PENDING' ? {
          areq_state: ['eq.APPROVAL_PENDING'],
          areq_trip_request_id: ['is.null'],
          or: ['(areq_is_sent_back.is.null,areq_is_sent_back.is.false)']

        } : {
          areq_trip_request_id: ['is.null'],
          areq_approval_state: ['ov.{APPROVAL_PENDING,APPROVAL_DONE}']
         };

        return from(this.loaderService.showLoader()).pipe(
          switchMap(() => {
            return this.advanceRequestService.getTeamadvanceRequests({
              offset: (pageNumber - 1) * 10,
              limit: 10,
              queryParams: {
                ...extraParams
              },
              filter: state
            });
          }),
          finalize(() => {
            return from(this.loaderService.hideLoader());
          })
        );
      }),
      shareReplay(1)
    );

    this.teamAdvancerequests$ = paginatedPipe.pipe(
      map(res => {
        if (this.currentPageNumber === 1) {
          this.acc = [];
        }
        this.acc = this.acc.concat(res.data);
        return this.acc;
      }),
      shareReplay(1)
    )

    this.count$ = paginatedPipe.pipe(
      map(res => res.count),
      shareReplay(1)
    );

    this.isInfiniteScrollRequired$ = this.teamAdvancerequests$.pipe(
      concatMap(teamAdvancerequests => {
        return this.count$.pipe(
          take(1),
          map(count => {
          return count > teamAdvancerequests.length;
        }));
      })
    );

    this.loadData$.subscribe(noop);
    this.teamAdvancerequests$.subscribe(noop);
    this.count$.subscribe(noop);
    this.isInfiniteScrollRequired$.subscribe(noop);
    this.loadData$.next({ pageNumber: this.currentPageNumber, state: this.state });
  }

  loadData(event) {
    this.currentPageNumber = this.currentPageNumber + 1;
    this.loadData$.next({ pageNumber: this.currentPageNumber, state: this.state });
    event.target.complete();
  }

  doRefresh(event) {
    this.currentPageNumber = 1;
    this.loadData$.next({ pageNumber: this.currentPageNumber, state: this.state });
    event.target.complete();
  }

  onAdvanceClick(areq: ExtendedAdvanceRequest) {
    this.router.navigate(['/', 'enterprise', 'view_team_advance', { id: areq.areq_id }]);
  }

  changeState(state) {
    this.currentPageNumber = 1;
    this.state = state;
    this.loadData$.next({ pageNumber: this.currentPageNumber, state: this.state });
  }

}
