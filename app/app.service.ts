import {Network} from "ionic-native";



export class AppService {
    checkNetwork(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log(Network.connection);
            if (Network.connection != 'wifi') {
                resolve(true);
            } else {
                resolve(true);
            }

        });

    }


    find_index_by_key(arraytosearch, key, valuetosearch) {
        for (var x = 0; x < arraytosearch.length; x++) {
            if (arraytosearch[x][key] == valuetosearch) {
                return x;
            }
        }
        return null;
    }

}