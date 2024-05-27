import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Route } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { Error404Component } from './components/error404/error404.component';
import { DetailsComponent } from './components/details/details.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { AuthGuard } from './auth/auth.guard';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TokenInterceptor } from './auth/token.interceptor';

//AuthGuard non permette la visualizzazione dei contenuti se non si e' loggati

const rotte: Route[] = [
    {
        path: 'list',
        component: ListComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'view/:name',
        component: ViewComponent,
        canActivate: [AuthGuard],
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'details',
                component: DetailsComponent,
            },
            {
                path: 'favorites',
                component: FavoritesComponent,
            },
        ],
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: '**',
        component: Error404Component,
    },
];

@NgModule({
    declarations: [
        AppComponent,
        ProfileComponent,
        NavbarComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        DetailsComponent,
        FavoritesComponent,
        ListComponent,
        ViewComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        Ng2SearchPipeModule,
        RouterModule.forRoot(rotte, {
            scrollPositionRestoration: 'top',
        }),
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
