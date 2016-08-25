import { Component } from '@angular/core';
import { NavController, App, AlertController, MenuController, NavParams, ViewController, ToastController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {PartialStkTabsPage} from '../../pages/partial-stocktake-code-tabs/partial-stocktake-code-tabs';
import {PartialStkService} from '../../pages/partial-stocktake/partial-stocktake.service';
import {PartialStkCodesService} from './partial-stocktake-codes.service';
import {AuthService} from '../../auth.service';
import {AppService} from '../../app.service';

@Component({
    templateUrl: 'build/pages/partial-stocktake-codes/partial-stocktake-codes.html',
    providers: [PartialStkService, PartialStkCodesService, AuthService, AppService]
})

export class PartialStkCodesPage {
    title_name: String;
    partial_stocktake_id: String;
    // @Input() uncounted_products = [];
    // counted_products = [];
    uncounted_products = [];
    soh_button_disabled = false;
    stocktake_icon_name = 'cart';
    prodcode_count = 0;
    subscription;
    constructor(private nav: NavController, private app: App, public http: Http,
        private alertController: AlertController, public menuCtrl: MenuController,
        navParams: NavParams, private viewCtrl: ViewController,
        private toastController: ToastController,
        private partialStkService: PartialStkService,
        private partialStkCodesService: PartialStkCodesService,
        private authService: AuthService,
        private appService: AppService) {

        this.partial_stocktake_id = navParams.data.partial_stocktake_id;
        this.title_name = navParams.data.partial_stocktake_no + ' UnCounted';
        // this.uncounted_products =
        if (navParams.data.stocktake_status === 'completed') {
            this.soh_button_disabled = true;
            this.stocktake_icon_name = 'stopwatch';
        }
    }

    ionViewWillEnter() {
        this.partialStkService.list_change.subscribe(data => {
            this.uncounted_products = data.uncounted_products;
            this.prodcode_count = this.uncounted_products.length;
        });
        this.partialStkService.get_stocktake_products(this.title_name.split(' ')[0]);
    }


    first_count_soh(prodcode, partial_stocktake_no, locations) {
        let prompt = this.alertController.create({
            title: prodcode,
            message: "Add the value that was counted",
            inputs: [
                {
                    name: 'soh',
                    type: 'numeric',
                    placeholder: 'SOH'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        if (this.soh_validate(data.soh)) {
                            this.confirm_soh(data.soh, prodcode, partial_stocktake_no, locations);

                        } else {
                            this.soh_error();
                        }

                    }
                }
            ]
        });
        prompt.present();
    }

    soh_validate(soh) {
        if (isNaN(parseFloat(soh))) {
            return false;
        } else {
            return true;
        }
    }

    soh_error() {
        setTimeout(() => {
            let error = this.alertController.create({
                title: 'Invalid SOH',
                buttons: [
                    {
                        text: 'OK!',
                        handler: () => {
                            console.log('Disagree clicked');
                        }
                    }
                ]
            });
            error.present();
        }, 700);
    }

    confirm_soh(soh, prodcode, partial_stocktake_no, locations) {
        setTimeout(() => {
            let confirm = this.alertController.create({
                title: 'Confirm SOH',
                message: prodcode + ' SOH ' + soh,
                buttons: [
                    {
                        text: 'Wrong',
                        handler: () => {
                            console.log('Disagree clicked');
                        }
                    },
                    {
                        text: 'Correct',
                        handler: () => {
                            this.partialStkCodesService.get_stk_doc(soh, prodcode, partial_stocktake_no,
                                locations, this.partial_stocktake_id).then((data) => {
                                    if (data != 'error') {
                                        this.saved_notification(data);
                                    } else {
                                        this.failed_notification();
                                    }
                                });
                        }
                    }
                ]
            });
            confirm.present();
        }, 700);
    }

    failed_notification() {
        setTimeout(() => {
            let toast = this.toastController.create({
                message: 'ERROR SAVING SOH',
                dismissOnPageChange: true,
                // duration: 3000,
                position: 'bottom',
                cssClass: 'toast_error',
                showCloseButton: true
            });
            toast.present();
        }, 700);
    }
    saved_notification(data) {

        if (data.ok) {

            setTimeout(() => {
                let toast = this.toastController.create({
                    message: 'SOH Captured Successfully',
                    duration: 1500,
                    position: 'bottom',
                    cssClass: 'toast_success'
                });

                toast.onDidDismiss(() => {
                    this.partialStkService.get_stocktake_products(this.title_name.split(' ')[0]);
                });
                toast.present();
            }, 700);

        } else {

            setTimeout(() => {
                let toast = this.toastController.create({
                    message: 'ERROR SAVING SOH',
                    dismissOnPageChange: true,
                    // duration: 3000,
                    position: 'bottom',
                    cssClass: 'toast_error',
                    showCloseButton: true
                });
                toast.present();
            }, 700);
        }
    }

}