import { Component } from '@angular/core';
import {Storage, LocalStorage} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import {Network} from "ionic-native";
import {AuthService} from '../../auth.service';
import {AppService} from '../../app.service';

@Component({
    providers: [AuthService, AppService]
})
export class StockInfoService {
    local: Storage = new Storage(LocalStorage);
    login_details;
    constructor(public http: Http,
        private authService: AuthService,
        private appService: AppService) { }

    get_details(manual_barcode, manual_value, scan_barcode) {
        return new Promise((resolve, reject) => {
            let detail_url = '';
            if (!manual_barcode) {
                detail_url = 'http://192.168.8.104:5984/cirrus/_design/products/_view/get_products?key="' + manual_value + '"';
            } else {
                detail_url = 'http://192.168.8.104:5984/cirrus/_design/barcodes/_view/get_product_by_barcode?key="' + scan_barcode + '"';
            }
            this.http.get(detail_url)
                .map(res => res.json())
                .subscribe(
                data => this.get_cirrus_doc(manual_barcode, data.rows).then((product_details) => {
                    resolve(product_details)
                }),
                () => console.log()
                );
        });
    }

    get_cirrus_doc(manual_barcode, product) {
        return new Promise((resolve, reject) => {
            let product_details = <any>{};
            let message = '';

            if (product.length === 0) {
                if (manual_barcode) {
                    message = 'Barcode Entered Not Found';
                } else {
                    message = 'Prodcode Entered Not Found';
                }
                resolve({ product_details: product_details, message: message });
                return;
            } else {
                if (!manual_barcode) {
                    product = product[0].value;
                } else {
                    product = product[0].value.location;
                }
            }
            product_details.st_prodcode = product.st_prodcode;
            product_details.st_ldesc = product.st_sdesc;
            product_details.st_unit = product.st_unit;
            product_details.st_list = product.st_branch_selling_price;
            product_details.ms = product.ms;

            let detail_url = 'http://192.168.8.104:5984/cirrus/' + product.product_cirrus_id;
            this.http.get(detail_url)
                .map(res => res.json())
                .subscribe(
                data => {
                    product_details.st_soh = data.st_soh;
                    if (data.hasOwnProperty('stock_location')) {
                        product_details.locations = data.stock_location;
                    } else {
                        product_details.locations = [];
                    }
                    resolve({ product_details: product_details, message: message });
                },
                () => console.log()
                );

        });
    }

}