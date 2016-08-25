import {Component, Input, Output} from "@angular/core";
import {NavController, Storage, LocalStorage, AlertController} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import {HomePage} from '../home/home';
import {StockInfoPage} from '../stock-info/stock-info';
import {Network} from "ionic-native";
import {AuthService} from '../../auth.service';
import {AppService} from '../../app.service';
import {LoginService} from './login.service';

@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [AuthService, AppService,LoginService]
})
export class LoginPage {
  local: Storage = new Storage(LocalStorage);

  username = '';
  password = '';
  reply = '';
  login_details;

  constructor(private nav: NavController, public http: Http,
    private alertController: AlertController,
    private authService: AuthService,
    private appService: AppService,
    private loginService: LoginService) { }

  click() {
    this.appService.checkNetwork().then((has_network) => {
      if (has_network) {
        if (this.loginService.authenticate(this.username)) {
          this.nav.setRoot(StockInfoPage);
        }
      } else {
        this.network_error();
      }
    });
  }

  network_error() {
      let alert = this.alertController.create({
        title: "No Wifi Connection!",
        subTitle: 'Cannot use app without Wifi connection',
        buttons: ["OK"]
      });
      alert.present(alert);
  }
  
}