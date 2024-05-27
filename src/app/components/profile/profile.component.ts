import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    showDiv: boolean = true;
    private routeSub: Subscription | null = null;

    constructor(private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        this.routeSub = this.router.events.subscribe(() => {
            const url = this.router.url;
            this.showDiv = !(
                url.includes('/profile/details') ||
                url.includes('/profile/favorites')
            );
        });
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
