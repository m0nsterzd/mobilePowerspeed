import { Component } from '@angular/core';
import { NavController, App, AlertController, MenuController, NavParams} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {PartialStkCodesPage} from '../../pages/partial-stocktake-codes/partial-stocktake-codes';
import {PartialStkTabsPage} from '../../pages/partial-stocktake-code-tabs/partial-stocktake-code-tabs';
import {PartialStkService} from './partial-stocktake.service';
import {AuthService} from '../../auth.service';
import {AppService} from '../../app.service';

@Component({
    templateUrl: 'build/pages/partial-stocktake/partial-stocktake.html',
    providers: [PartialStkService, AuthService, AppService]
})
export class PartialStkPage {
    title_name: String;
    counted_products = [];
    uncounted_products = [];
    stocktakes;
    stocktake_status: String;
    constructor(private nav: NavController, private app: App,
        public http: Http, private alertController: AlertController,
        public menuCtrl: MenuController,
        private navParams: NavParams,
        private partialStkService: PartialStkService,
        private authService: AuthService,
        private appService: AppService) {

        this.partialStkService = partialStkService;
        this.menuCtrl.enable(true, 'partial_stk_menu');
        this.menuCtrl.enable(false, 'main_menu');
        this.stocktake_status = navParams.data.status;
        this.push_stocktake_list();


    }

    push_stocktake_list() {
        let stocktakes = [];
        this.partialStkService.get_open_partial(this.stocktake_status).subscribe(
            data => {
                this.stocktakes = data;
            }
        );

        if (this.stocktake_status != 'completed') {
            this.title_name = 'Open Partial Stocktakes';
        } else {
            this.title_name = 'Completed Partial Stocktakes';
        }
    }


    get_stocktake_products(partial_stocktake_no) {
        this.partialStkService.list_change.subscribe(data => {
            data.uncounted_products = [];
            data.counted_products = [];
            this.nav.push(PartialStkTabsPage, data);
        });
        this.partialStkService.get_stocktake_products(partial_stocktake_no);
    }




}