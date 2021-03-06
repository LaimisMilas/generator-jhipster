import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { User } from './user.model';
import { UserModalService } from './user-modal.service';
import { UserService } from './user.service';
<%_ if (enableTranslation) { _%>
import { JhiLanguageHelper } from '../../shared';
<%_ }_%>

@Component({
    selector: '<%=jhiPrefix%>-user-mgmt-dialog',
    templateUrl: './user-management-dialog.component.html'
})
export class UserMgmtDialogComponent implements OnInit {

    user: User;
    languages: any[];
    authorities: any[];
    isSaving: Boolean;

    constructor (
        public activeModal: NgbActiveModal,
        <%_ if (enableTranslation) { _%>
        private languageHelper: JhiLanguageHelper,
        private jhiLanguageService: JhiLanguageService,
        <%_ } _%>
        private userService: UserService,
        private eventManager: EventManager,
        private router: Router
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        <%_ if (enableTranslation) { _%>
        this.languageHelper.getAll().then((languages) => {
            this.languages = languages;
        });
        this.jhiLanguageService.setLocations(['user-management']);
        <%_ } _%>
    }

    clear() {
        this.activeModal.dismiss('cancel');
        this.router.navigate([{ outlets: { popup: null }}]);
    }

    save() {
        this.isSaving = true;
        if (this.user.id !== null) {
            this.userService.update(this.user).subscribe(response => this.onSaveSuccess(response), () => this.onSaveError());
        } else {<% if (!enableTranslation) { %>
            this.user.langKey = 'en';<% } %>
            this.userService.create(this.user).subscribe(response => this.onSaveSuccess(response), () => this.onSaveError());
        }
    }

    private onSaveSuccess(result) {
        this.eventManager.broadcast({ name: 'userListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
        this.router.navigate([{ outlets: { popup: null }}]);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: '<%=jhiPrefix%>-user-dialog',
    template: ''
})
export class UserDialogComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private userModalService: UserModalService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['login'] ) {
                this.modalRef = this.userModalService.open(UserMgmtDialogComponent, params['login']);
            } else {
                this.modalRef = this.userModalService.open(UserMgmtDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
