import { Injectable } from '@angular/core';
import {CanActivate, Router} from "@angular/router";
import {LoginService} from "./login.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor() { }

  canActivate(): boolean{
    const user=localStorage.getItem('currentUser');
    if (user && JSON.parse(user).role === 'ADMIN') return true;
    else if (user && JSON.parse(user).role === 'USER') return true;
    return false;
  }
}
