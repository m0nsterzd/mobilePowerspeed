import { Component } from '@angular/core';
import { NavController, App, AlertController, MenuController} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {StockDetailPage} from '../../pages/stock-detail/stock-detail';
import {BarcodeScanner} from 'ionic-native';
import {AuthService} from '../../auth.service';
import {StockInfoService} from './stock-info.service';
import {AppService} from '../../app.service';

@Component({
    templateUrl: 'build/pages/stock-info/stock-info.html',
    providers: [AuthService, StockInfoService, AppService]
})
export class StockInfoPage {
    st_prodcode = '';
    barcode = '';
    manual_value = '';
    manual_barcode = false;
    scan_barcode = '';
    reply = '';
    details = {};
    detail_url = '';
    auth_details;
    product_details = { st_prodcode: String, st_ldesc: String, st_soh: Number, st_list: Number, st_unit: String, ms: Number, locations: Array };
    constructor(private nav: NavController, private app: App, public http: Http,
        private alertController: AlertController,
        private menuCtrl: MenuController,
        authService: AuthService,
        private stockInfoService: StockInfoService) {
        this.menuCtrl.enable(false, 'partial_stk_menu');
        this.menuCtrl.enable(true, 'main_menu');
        authService.get_username().then((user_data) => {
            this.auth_details = user_data;
        });
    }

    click_scan() {
        BarcodeScanner.scan()
            .then((result) => {
                if (!result.cancelled) {
                    this.scan_barcode = result.text;
                    console.log(this.scan_barcode);
                    this.manual_barcode = true;
                    this.stockInfoService.get_details(this.manual_barcode, this.manual_value, this.scan_barcode).then((details) => {
                        let product_details = details['product_details'];
                        if (product_details.hasOwnProperty('st_prodcode')) {
                            this.push_details(product_details);
                        } else {
                            console.log('has not');
                            let alert = this.alertController.create({
                                title: 'No Data!',
                                subTitle: product_details['message'],
                                buttons: ['OK']
                            });
                            alert.present();
                        }

                    });
                }
            })
            .catch((err) => {
                alert(err);
            })
    }

    clear_inputs() {
        this.st_prodcode = '';
        this.barcode = '';
    }

    click_retrieve_manual() {
        if (this.barcode === '' && this.st_prodcode === '') {
            let alert = this.alertController.create({
                title: 'Missing Details!',
                subTitle: 'Fill in either Prodcode or Barcode',
                buttons: ['OK']
            });
            alert.present();

        } else {
            if (this.barcode.length > 0) {
                this.scan_barcode = this.barcode;
                this.manual_barcode = true;
            } else {
                this.manual_value = this.st_prodcode.toUpperCase();
            }

            this.stockInfoService.get_details(this.manual_barcode, this.manual_value, this.scan_barcode).then((details) => {
                let product_details = details['product_details'];
                if (product_details.hasOwnProperty('st_prodcode')) {
                    this.push_details(product_details);
                } else {
                    console.log('has not');
                    let alert = this.alertController.create({
                        title: 'No Data!',
                        subTitle: product_details['message'],
                        buttons: ['OK']
                    });
                    alert.present();
                }

            });

        }
    }

    push_details(product_details) {
        this.nav.push(StockDetailPage, product_details);
    }

}

export class BarcodeData {
    constructor(
        public text: String,
        public format: String
    ) {

    }



}