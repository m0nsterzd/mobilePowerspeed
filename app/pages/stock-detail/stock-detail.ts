import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/stock-detail/stock-detail.html',
})
export class StockDetailPage {
  manual_value :any;
  manual_barcode: boolean;
  constructor(private nav: NavController, navParams: NavParams) { 
    this.manual_value = navParams.data;

  }
  
 
}
