import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {NetworkService} from './network.service';
import {StorageService} from './storage.service';
import {concatMap, map, reduce, shareReplay, switchMap, tap} from 'rxjs/operators';
import {from, Observable, of, range, Subject} from 'rxjs';
import {AuthService} from './auth.service';
import {ApiV2Service} from './api-v2.service';
import {DateService} from './date.service';
import {OfflineService} from 'src/app/core/services/offline.service';
import {isEqual} from 'lodash';
import {DataTransformService} from './data-transform.service';
import {Cacheable, CacheBuster} from 'ts-cacheable';
import {TransactionService} from './transaction.service';
import { Expense } from '../models/expense.model';
import { StatusPayload } from '../models/V1/status-payload.model';
import { ExtendedReport as ExtendedReportV1, Report, ExtendedReportInput, ExtendedReportStats, ReportApproval, ReportParams, ReportActions} from '../models/V1/extended-report.model';
import { ExtendedReport as ExtendedReportV2, ExtendedReportQueryParams } from '../models/V2/extended-report.model';
import { Count } from '../models/V1/count.model';
import { PdfExport } from '../models/V1/pdf-export.model';

const reportsCacheBuster$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private networkService: NetworkService,
    private storageService: StorageService,
    private apiService: ApiService,
    private authService: AuthService,
    private apiv2Service: ApiV2Service,
    private dateService: DateService,
    private offlineService: OfflineService,
    private dataTransformService: DataTransformService,
    private transactionService: TransactionService,
  ) { }

  @CacheBuster({
    cacheBusterNotifier: reportsCacheBuster$
  })
  clearCache() {
    return of(null);
  }

  @CacheBuster({
    cacheBusterNotifier: reportsCacheBuster$
  })
  clearTransactionCache() {
    return this.transactionService.clearCache();
  }

  fixDatesV2(extendedReportV2: ExtendedReportV2) {
    if (extendedReportV2.rp_created_at) {
      extendedReportV2.rp_created_at = new Date(extendedReportV2.rp_created_at);
    }

    if (extendedReportV2.rp_approved_at) {
      extendedReportV2.rp_approved_at = new Date(extendedReportV2.rp_approved_at);
    }

    if (extendedReportV2.rp_from_dt) {
      extendedReportV2.rp_from_dt = new Date(extendedReportV2.rp_from_dt);
    }

    if (extendedReportV2.rp_to_dt) {
      extendedReportV2.rp_to_dt = new Date(extendedReportV2.rp_to_dt);
    }

    if (extendedReportV2.rp_physical_bill_at) {
      extendedReportV2.rp_physical_bill_at = new Date(extendedReportV2.rp_physical_bill_at);
    }

    if (extendedReportV2.rp_reimbursed_at) {
      extendedReportV2.rp_reimbursed_at = new Date(extendedReportV2.rp_reimbursed_at);
    }

    if (extendedReportV2.rp_submitted_at) {
      extendedReportV2.rp_submitted_at = new Date(extendedReportV2.rp_submitted_at);
    }

    return extendedReportV2;
  }

  getUserReportParams(state: string): ReportParams {
    const stateMap = {
      draft: {
        state: ['DRAFT', 'DRAFT_INQUIRY']
      },
      pending: {
        state: ['APPROVER_PENDING']
      },
      inquiry: {
        state: ['APPROVER_INQUIRY']
      },
      approved: {
        state: ['APPROVED']
      },
      payment_queue: {
        state: ['PAYMENT_PENDING']
      },
      paid: {
        state: ['PAID']
      },
      edit: {
        state: ['DRAFT', 'APPROVER_PENDING']
      },
      all: {
        state: ['DRAFT', 'DRAFT_INQUIRY', 'COMPLETE', 'APPROVED', 'APPROVER_PENDING', 'APPROVER_INQUIRY', 'PAYMENT_PENDING', 'PAYMENT_PROCESSING', 'PAID', 'REJECTED']
      }
    };

    return stateMap[state];
  }

  getPaginatedERptcStats(params: ReportParams): Observable<ExtendedReportStats> {
    return this.apiService.get('/erpts/stats', { params });
  }

  getPaginatedERptcCount(params: ReportParams): Observable<Count>{
    return this.networkService.isOnline().pipe(
      switchMap(
        isOnline => {
          if (isOnline) {
            return this.apiService.get('/erpts/count', { params }).pipe(
              tap((res) => {
                this.storageService.set('erpts-count' + JSON.stringify(params), res);
              })
            );
          } else {
            return from(this.storageService.get('erpts-count' + JSON.stringify(params)));
          }
        }
      )
    );
  }

  @Cacheable({
    cacheBusterObserver: reportsCacheBuster$
  })
  getMyReportsCount(queryParams: ExtendedReportQueryParams): Observable<number> {
    return this.getMyReports({
      offset: 0,
      limit: 1,
      queryParams
    }).pipe(
      map(res => res.count)
    );
  }

  getMyReports(config: Partial<{ offset: number, limit: number, order: string, queryParams: ExtendedReportQueryParams }> = {
    offset: 0,
    limit: 10,
    queryParams: {}
  }) :Observable<{ data: ExtendedReportV2[]; count: number; limit: number; offset: number; url: string;}>
  {
    return from(this.authService.getEou()).pipe(
      switchMap(eou => {
        return this.apiv2Service.get('/reports', {
          params: {
            offset: config.offset,
            limit: config.limit,
            order: `${config.order || 'rp_created_at.desc'},rp_id.desc`,
            rp_org_user_id: 'eq.' + eou.ou.id,
            ...config.queryParams
          }
        });
      }),
      map(res => res as {
        count: number,
        data: ExtendedReportV2[],
        limit: number,
        offset: number,
        url: string
      }),
      map(res => ({
        ...res,
        data: res.data.map(datum => this.fixDatesV2(datum))
      }))
    );
  }

  getTeamReportsCount(queryParams = {}) {
    return this.getTeamReports({
      offset: 0,
      limit: 1,
      queryParams
    }).pipe(
      map(res => res.count)
    );
  }

  getTeamReports(config: Partial<{ offset: number, limit: number, order: string, queryParams: any }> = {
    offset: 0,
    limit: 10,
    queryParams: {}
  }) {

    return from(this.authService.getEou()).pipe(
      switchMap(eou => {
        return this.apiv2Service.get('/reports', {
          params: {
            offset: config.offset,
            limit: config.limit,
            approved_by: 'cs.{' + eou.ou.id + '}',
            order: `${config.order || 'rp_created_at.desc'},rp_id.desc`,
            ...config.queryParams
          }
        });
      }),
      map(res => res as {
        count: number,
        data: ExtendedReportV2[],
        limit: number,
        offset: number,
        url: string
      }),
      map(res => ({
        ...res,
        data: res.data.map(datum => this.dateService.fixDates(datum))
      }))
    );
  }

  getReport(id: string): Observable<ExtendedReportV2> {
    return this.getMyReports({
      offset: 0,
      limit: 1,
      queryParams: {
        rp_id: `eq.${id}`
      }
    }).pipe(
      map(
        res => res.data[0]
      )
    );
  }

  getTeamReport(id: string) {
    return this.getTeamReports({
      offset: 0,
      limit: 1,
      queryParams: {
        rp_id: `eq.${id}`
      }
    }).pipe(
      map(
        res => res.data[0]
      )
    );
  }

  actions(rptId: string): Observable<ReportActions> {
    return this.apiService.get('/reports/' + rptId + '/actions');
  }

  getExports(rptId: string): Observable<{results: PdfExport[]}> {
    return this.apiService.get('/reports/' + rptId + '/exports');
  }

  getApproversByReportId(rptId: string): Observable<ReportApproval[]> {
    return this.apiService.get('/reports/' + rptId + '/approvers');
  }

  delete(rptId) {
    return this.apiService.delete('/reports/' + rptId).pipe(
     switchMap((res) => {
       return this.clearTransactionCache().pipe(
         map(() => {
           return res;
         })
       );
     })
    );
  }

  downloadSummaryPdfUrl(data: { report_ids: string[], email: string }) {
    return this.apiService.post('/reports/summary/download', data);
  }


  getAllExtendedReports(config: Partial<{ order: string, queryParams: any }>) {
    return this.getMyReportsCount(config.queryParams).pipe(
      switchMap(count => {
        count = count > 50 ? count / 50 : 1;
        return range(0, count);
      }),
      concatMap(page => {
        return this.getMyReports({ offset: 50 * page, limit: 50, queryParams: config.queryParams, order: config.order });
      }),
      map(res => res.data),
      reduce((acc, curr) => {
        return acc.concat(curr);
      }, [] as ExtendedReportV2[])
    );
  }

  getAllOpenReportsCount() {
    return this.getMyReportsCount({
      rp_state: 'in.(DRAFT,APPROVER_PENDING)'
    }).pipe(
      shareReplay(1)
    );
  }

  getAllTeamExtendedReports(config: Partial<{ order: string, queryParams: any }> = {
    order: '',
    queryParams: {}
  }) {
    return this.getTeamReportsCount().pipe(
      switchMap(count => {
        count = count > 50 ? count / 50 : 1;
        return range(0, count);
      }),
      concatMap(page => {
        return this.getTeamReports({ offset: 50 * page, limit: 50, ...config.queryParams, order: config.order });
      }),
      map(res => res.data),
      reduce((acc, curr) => {
        return acc.concat(curr);
      }, [] as ExtendedReportV2[])
    );
  }

  addOrderByParams(params, sortOrder?) {
    if (sortOrder) {
      return Object.assign(params, { order_by: sortOrder });
    } else {
      return params;
    }
  }

  searchParamsGenerator(search, sortOrder?) {
    let params = {};

    params = this.userReportsSearchParamsGenerator(params, search);
    params = this.addOrderByParams(params, sortOrder);

    return params;
  }

  userReportsSearchParamsGenerator(params, search) {

    const searchParams = this.getUserReportParams(search.state);

    let dateParams = null;
    // Filter expenses by date range
    // dateRange.from and dateRange.to needs to a valid date string (if present)
    // Example: dateRange.from = 'Jan 1, 2015', dateRange.to = 'Dec 31, 2017'

    if (search.dateRange && !isEqual(search.dateRange, {})) {
      // TODO: Fix before 2025
      let fromDate = new Date('Jan 1, 1970');
      let toDate = new Date('Dec 31, 2025');

      // Set fromDate to Jan 1, 1970 if none specified
      if (search.dateRange.from) {
        fromDate = new Date(search.dateRange.from);
      }

      // Set toDate to Dec 31, 2025 if none specified
      if (search.dateRange.to) {
        // Setting time to the end of the day
        toDate = new Date(new Date(search.dateRange.to).setHours(23, 59, 59, 999));
      }

      dateParams = {
        created_at: ['gte:' + (new Date(fromDate)).toISOString(), 'lte:' + (new Date(toDate)).toISOString()]
      };
    }

    return Object.assign({}, params, searchParams, dateParams);
  }

  @Cacheable({
    cacheBusterObserver: reportsCacheBuster$
  })
  // todo decide parmas datatype
  getPaginatedERptc(offset: number, limit: number, params): Observable<ExtendedReportV1[]> {
    const data = {
      params: {
        offset,
        limit
      }
    };

    Object.keys(params).forEach((param) => {
      data.params[param] = params[param];
    });

    return this.apiService.get('/erpts', data).pipe(
      map((erptcs) => {
        return erptcs.map(erptc => this.dataTransformService.unflatten(erptc));
      })
    );
  }

  getReportPurpose(reportPurpose: {ids: string[]}): Observable<string> {
    return this.apiService.post('/reports/purpose', reportPurpose).pipe(
      map((res: Report) => {
        return res.purpose;
      })
    );
  }

  @Cacheable({
    cacheBusterObserver: reportsCacheBuster$
  })
  // This method is only used in deep-links we should deprecate this method and start using v2 method
  getERpt(rptId) {
    return this.apiService.get('/erpts/' + rptId).pipe(
      map(data => {
        const erpt = this.dataTransformService.unflatten(data);
        this.dateService.fixDates(erpt.rp);
        if (erpt && erpt.rp && erpt.rp.created_at) {
          erpt.rp.created_at = this.dateService.getLocalDate(erpt.rp.created_at);
        }
        return erpt;
      })
    );
  }

  getApproversInBulk(rptIds: string[]): Observable<ReportApproval[]> {
    if (!rptIds || rptIds.length === 0) {
      return of([]);
    }
    const count = rptIds.length > 50 ? rptIds.length / 50 : 1;
    return range(0,  count).pipe(
      map(page => {
        return rptIds.slice((page) * 50, (page + 1) * 50);
      }),
      concatMap(rptIds => {
        return this.apiService.get('/reports/approvers', { params: {report_ids: rptIds} });
      }),
      reduce((acc, curr) => {
        return acc.concat(curr);
      }, [])
    );
  }

  addApprovers(erpts: ExtendedReportV1[] , approvers: ReportApproval[]): ExtendedReportV1[] {
    const reportApprovalsMap = {};

    approvers.forEach((approver) => {
      if (reportApprovalsMap[approver.report_id]) {
        reportApprovalsMap[approver.report_id].push(approver);
      } else {
        reportApprovalsMap[approver.report_id] = [approver];
      }
    });

    return erpts.map((erpt) => {
      erpt.rp.approvals = reportApprovalsMap[erpt.rp.id];
      return erpt;
    });
  }

  getFilteredPendingReports(searchParams) {
    const params = this.searchParamsGenerator(searchParams);

    return this.getPaginatedERptcCount(params).pipe(
      switchMap((results) => {
        // getting all results -> offset = 0, limit = count
        return this.getPaginatedERptc(0, results.count, params);
      }),
      switchMap((erpts) => {
        const rptIds = erpts.map((erpt) => {
          return erpt.rp.id;
        });

        return this.getApproversInBulk(rptIds).pipe(
          map(approvals => {
            return this.addApprovers(erpts, approvals).filter(erpt => {
              return !erpt.rp.approvals || (erpt.rp.approvals && !erpt.rp.approvals.some((approval) => {
                return approval.state === 'APPROVAL_DONE';
              }));
            });
          })
        );
      }),
    );
  }

  @CacheBuster({
    cacheBusterNotifier: reportsCacheBuster$
  })
  addTransactions(rptId: string, txnIds: string[]): Observable<null> {
    return this.apiService.post('/reports/' + rptId + '/txns', {
      ids: txnIds
    }).pipe(
      tap(() => {
        this.clearTransactionCache();
      })
    );
  }

  @CacheBuster({
    cacheBusterNotifier: reportsCacheBuster$
  })
  createDraft(report: ExtendedReportInput): Observable<Report> {
    return this.apiService.post('/reports', report).pipe(
      switchMap((res: Report) => {
        return this.clearTransactionCache().pipe(
          map(() => {
            return res;
          })
        );
      })
    )
  }

  @CacheBuster({
    cacheBusterNotifier: reportsCacheBuster$
  })
  create(report: ExtendedReportInput, txnIds: string[]): Observable<null> {
    return this.createDraft(report).pipe(
      switchMap(newReport => {
        return this.apiService.post('/reports/' + newReport.id + '/txns', { ids: txnIds }).pipe( // Can we replace this line with this.addTransactions() method ?
          switchMap(res => {
            return this.submit(newReport.id);
          })
        );
      })
    );
  }

  @CacheBuster({
    cacheBusterNotifier: reportsCacheBuster$
  })
  removeTransaction(rptId: string, txnId: string, comment?: string): Observable<null> {
    const aspy = {
      status: {
        comment
      }
    };
    return this.apiService.post('/reports/' + rptId + '/txns/' + txnId + '/remove', aspy).pipe(
      switchMap((res) => {
        return this.clearTransactionCache().pipe(
          map(() => {
            return res;
          })
        );
      })
    );
  }

  @CacheBuster({
    cacheBusterNotifier: reportsCacheBuster$
  })

  submit(rptId: string): Observable<null> {
    return this.apiService.post('/reports/' + rptId + '/submit').pipe(
      switchMap((res) => {
        return this.clearTransactionCache().pipe(
          map(() => {
            return res;
          })
        );
      })
    )
  }

  @CacheBuster({
    cacheBusterNotifier: reportsCacheBuster$
  })
  resubmit(rptId: string): Observable<null> {
    return this.apiService.post('/reports/' + rptId + '/resubmit');
  }

  @CacheBuster({
    cacheBusterNotifier: reportsCacheBuster$
  })
  inquire(rptId: string, addStatusPayload: StatusPayload): Observable<null> {
    return this.apiService.post('/reports/' + rptId + '/inquire', addStatusPayload);
  }

  @CacheBuster({
    cacheBusterNotifier: reportsCacheBuster$
  })
  approve(rptId: string): Observable<null> {
    return this.apiService.post('/reports/' + rptId + '/approve');
  }

  @CacheBuster({
    cacheBusterNotifier: reportsCacheBuster$
  })
  addApprover(rptId: string, approverEmail: string, comment: string): Observable<null> {
    const data = {
      approver_email: approverEmail,
      comment
    };
    return this.apiService.post('/reports/' + rptId + '/approvals', data);
  }

  @CacheBuster({
    cacheBusterNotifier: reportsCacheBuster$
  })
  removeApprover(rptId, approvalId) {
    return this.apiService.post('/reports/' + rptId + '/approvals/' + approvalId + '/disable');
  }

  getReportETxnc(rptId: string, orgUserId: string): Observable<Expense[]> {
    const data: any = {
      params: {}
    };

    if (orgUserId) {
      data.params.approver_id = orgUserId;
    }

    return this.apiService.get('/erpts/' + rptId + '/etxns', data);
  }
}
