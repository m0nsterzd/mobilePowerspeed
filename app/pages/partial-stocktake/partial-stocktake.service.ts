import { Component, Injectable, Input, Output, EventEmitter } from '@angular/core';
import {Storage, LocalStorage} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import {Network} from "ionic-native";
import {AuthService} from '../../auth.service';
import {AppService} from '../../app.service';
import {Observable} from 'rxjs/Observable';

@Component({
    providers: [AuthService, AppService]
})
@Injectable()
export class PartialStkService {
    local: Storage = new Storage(LocalStorage);
    login_details;
    uncounted_products = [];
    counted_products = [];
    @Output() list_change: EventEmitter<any> = new EventEmitter();

    constructor(public http: Http,
        private authService: AuthService,
        private appService: AppService) {
    }



    get_open_partial(stocktake_status) {
        let detail_url = '';
        if (stocktake_status != 'completed') {
            detail_url = 'http://192.168.8.104:5984/cirrus/_design/stocktake/_view/get_partial_stocktake_not_complete';
        } else {
            detail_url = 'http://192.168.8.104:5984/cirrus/_design/stocktake/_view/get_partial_stocktake_complete';
        }

        return this.http.get(detail_url)
            .map(res => res.json())
            .map(result => {
                let stocktakes = [];
                result.rows.forEach(element => {
                    stocktakes.push(element.value);
                });
                return stocktakes;
            })
    }

    get_stocktake_products(partial_stocktake_no) {
        let detail_url = 'http://192.168.8.104:5984/cirrus/_design/stocktake/_view/get_partial_stocktake_by_no?key="' + partial_stocktake_no + '"&include_docs=true';
        
            this.http.get(detail_url)
                .map(res => res.json())
                .subscribe( data2 => {
                    let data = this.prepare_list_products(data2.rows[0].doc.products, partial_stocktake_no, data2.rows[0].doc._id);
                    this.list_change.emit(data);
                });
    
    }


    prepare_list_products(stk_products, partial_stocktake_no, partial_stocktake_id) {
        this.uncounted_products = [];
        this.counted_products = [];
        stk_products.forEach(element => {
            var key = '';
            for (key in element.locations) break;
            element.locations = key;
            if (!element.first_count) {
                this.uncounted_products.push(element);
            } else {
                this.counted_products.push(element);
            }
        });
        let data = {
            uncounted_products: this.uncounted_products,
            counted_products: this.counted_products,
            partial_stocktake_no: partial_stocktake_no,
            partial_stocktake_id: partial_stocktake_id,
        };
        return data;
    }

}