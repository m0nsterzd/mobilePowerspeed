import { Component } from '@angular/core';
import {Storage, LocalStorage} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import {Network} from "ionic-native";
import {AuthService} from '../../auth.service';
import {AppService} from '../../app.service';

@Component({
  providers: [AuthService, AppService]
})
export class LoginService {
  local: Storage = new Storage(LocalStorage);
  login_details;
  constructor(public http: Http,
    private authService: AuthService,
    private appService: AppService) { }

  authenticate(username) {
    return new Promise((resolve, reject) => {
      let url = 'http://192.168.8.104:5984/cirrus/_design/administration/_view/get_user_by_username?key="' + username + '"';
      console.log(url);
      this.http.get(url)
        .map(res => res.json())
        .subscribe(
        data => {
          if (data.rows.length > 0) {
            this.authService.set_username(data.rows[0].value);
            resolve(true);
          } else {
            resolve(false);
          }
        },
        err => {
          console.log(err);
        },
        () => console.log()
        );
    });
  }

}