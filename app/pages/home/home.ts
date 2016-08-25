import {Component} from "@angular/core";
import {NavController,NavParams} from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';
import {ScanPage} from '../scan/scan';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  lotHeader : string;
  constructor(private nav: NavController,private navParams: NavParams) {
   
    this.lotHeader = navParams.get('lotTitle');
  }

click() {
    BarcodeScanner.scan()
      .then((result) => {
        if (!result.cancelled) {
          const barcodeData = new BarcodeData(result.text, result.format);
          this.scanDetails(barcodeData);
        }
      })
      .catch((err) => {
        alert(err);
      })
  }

  scanDetails(details) {
    this.nav.push(ScanPage, {details: details});
  }

  fakeScan() {
    this.scanDetails(new BarcodeData('FAKE SCAN', 'FAKE_FORMAT'));
  }
}

export class BarcodeData {
  constructor(
    public text: String,
    public format: String
  ) {

  }



}
