
import {Storage, LocalStorage} from 'ionic-angular';

export class AuthService {
  local = new Storage(LocalStorage);

  constructor() {

  }

  get_username() {
      return this.local.get('user_data');
  }

  set_username(user_data) {
    this.local.set('user_data', JSON.stringify(user_data));

  }

}
