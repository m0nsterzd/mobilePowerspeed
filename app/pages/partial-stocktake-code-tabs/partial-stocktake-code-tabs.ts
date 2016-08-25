import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Tabs} from 'ionic-angular';
import {PartialStkCodesPage} from '../../pages/partial-stocktake-codes/partial-stocktake-codes';
import {PartialStkCountedCodesPage} from '../../pages/partial-stocktake-counted-codes/partial-stocktake-counted-codes';

@Component({
  templateUrl: 'build/pages/partial-stocktake-code-tabs/partial-stocktake-code-tabs.html'
})
export class PartialStkTabsPage {
  @ViewChild('count_tabs') tabs: Tabs;
  private tab1Root = PartialStkCodesPage;
  private tab2Root = PartialStkCountedCodesPage;
  private code_params: any;
  constructor(private nav: NavController, private navParams: NavParams) {
    this.code_params = navParams.data;
  }


}
