import { Component } from '@angular/core';
import { NavController, App, AlertController, MenuController, NavParams, ViewController} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {PartialStkTabsPage} from '../../pages/partial-stocktake-code-tabs/partial-stocktake-code-tabs';
import {PartialStkService} from '../../pages/partial-stocktake/partial-stocktake.service';
import {AuthService} from '../../auth.service';
import {AppService} from '../../app.service';

@Component({
    templateUrl: 'build/pages/partial-stocktake-counted-codes/partial-stocktake-counted-codes.html',
    providers: [PartialStkService, AuthService, AppService]
})
export class PartialStkCountedCodesPage {
    title_name: String;
    products = [];
    counted_products = [];
    // uncounted_products = [];
    priv_refresher = {};
    soh_button_disabled = false;
    stocktake_icon_name = 'cart';
    prodcode_count = 0;
    subscription;
    constructor(private nav: NavController, private app: App, public http: Http,
        private alertController: AlertController,
        public menuCtrl: MenuController,
        navParams: NavParams, private viewCtrl: ViewController,
        private partialStkService: PartialStkService,
        private authService: AuthService,
        private appService: AppService) {
        this.title_name = navParams.data.partial_stocktake_no + ' Counted';
        // this.partialStkService.get_stocktake_products(this.title_name.split(' ')[0]).subscribe();

        // this.prodcode_count = this.products.length;
        if (navParams.data.stocktake_status === 'completed') {
            this.soh_button_disabled = true;
            this.stocktake_icon_name = 'stopwatch';
        }

    }

    ionViewWillEnter() {
        this.partialStkService.list_change.subscribe(data => {
            this.counted_products = data.counted_products;
            this.prodcode_count = this.counted_products.length;
        });
        this.partialStkService.get_stocktake_products(this.title_name.split(' ')[0]);
    }

    doRefresh(refresher) {
        this.priv_refresher = refresher;
        this.partialStkService.get_stocktake_products(this.title_name.split(' ')[0]);
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
}