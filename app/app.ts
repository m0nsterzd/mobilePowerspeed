import {Component, ViewChild, enableProdMode} from '@angular/core';
import {Platform, ionicBootstrap, Nav, Storage, LocalStorage} from 'ionic-angular';
import {StatusBar,Splashscreen} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {LoginPage} from './pages/login/login';
import {StockInfoPage} from './pages/stock-info/stock-info';
import {PartialStkPage} from './pages/partial-stocktake/partial-stocktake';


@Component({
  templateUrl: 'build/app.html'
})
class MyApp {

  @ViewChild(Nav) nav: Nav;
  local: Storage = new Storage(LocalStorage);
  // rootPage: any = HomePage;
  rootPage: any = StockInfoPage;

  pages: Array<{ title: string, component: any, icon: any }>;
  stk_pages: Array<{ title: string, component: any, icon: any }>;
  constructor(private platform: Platform) {
    this.initializeApp();
    this.pages = [
      { title: 'Stock Info', component: StockInfoPage, icon: 'information-circle' },
      { title: 'Partial Stocktake', component: PartialStkPage, icon: 'hand' }
    ];
    this.stk_pages = [
      { title: 'Home', component: StockInfoPage, icon: 'home' },
      { title: 'Open StockTakes', component: PartialStkPage, icon: 'cart' },
      { title: 'Completed', component: PartialStkPage, icon: 'flag' }
    ];
  }
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      Splashscreen.hide();
      StatusBar.styleDefault();
    });
  }


  openPage(page) {
    console.log(page);
    console.log('page clicked');
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.title === 'Completed') {
      this.nav.setRoot(page.component,{status:'completed'});
    } else if (page.title === 'Open StockTakes') {
      this.nav.setRoot(page.component,{status:'open'});
    } else {
      this.nav.setRoot(page.component);
    }
  }

  logout() {
    this.local.remove('user_data');
    this.nav.setRoot(LoginPage);
  }
}

ionicBootstrap(MyApp);
