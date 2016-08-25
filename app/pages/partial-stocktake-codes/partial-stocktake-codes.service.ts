import { Component } from '@angular/core';
import {Storage, LocalStorage} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {AuthService} from '../../auth.service';
import {AppService} from '../../app.service';

@Component({
    providers: [AuthService, AppService]
})
export class PartialStkCodesService {
    local: Storage = new Storage(LocalStorage);
    login_details;
    constructor(public http: Http,
        private authService: AuthService,
        private appService: AppService) { }


    get_stk_doc(soh, prodcode, partial_stocktake_no, locations, partial_stocktake_id) {
        return new Promise((resolve, reject) => {
            let detail_url = 'http://192.168.8.104:5984/cirrus/' + partial_stocktake_id;
            this.http.get(detail_url)
                .map(res => res.json())
                .subscribe(
                data => {
                    this.save_soh(data, soh, prodcode, locations).then((data) => {
                        resolve(data);
                    });
                },
                () => console.log()
                );
        });

    }

    save_soh(stk_doc, soh, prodcode, locations) {

        return new Promise((resolve, reject) => {
            let index = this.appService.find_index_by_key(stk_doc.products, 'st_prodcode', prodcode);
            stk_doc.products[index].locations[locations].first_count = soh;
            stk_doc.products[index].first_count = soh;
            stk_doc.products[index].locations[locations].captured_by = 'mobile app';
            let id = stk_doc._id;
            delete stk_doc._id;

            console.log(stk_doc);
            let headers = new Headers({ 'Content-Type': 'application/json' });
            let options = new RequestOptions({ headers: headers });
            let body = JSON.stringify(stk_doc);
            this.http.put('http://192.168.8.104:5984/cirrus/' + id, body, options)
                // .map(res => res.json())
                .map(res => res.json())
                .subscribe(
                // data => this.saved_notification(data),
                data => {
                    resolve(data)
                },
                error => resolve('error')
                );
        });

    }

}