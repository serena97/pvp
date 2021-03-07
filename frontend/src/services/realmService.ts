import { Realm } from "../models/realm";

class RealmService {
    private realms: Realm[]
    readonly limit = 10;

    constructor() {
        this.initializeRealms();
    }

    async initializeRealms() {
        const response = await fetch(`http://localhost:8080/api/v1/realms`);
        if(!response.ok) {
            console.error('error');
        }
        const realms: Realm[] = await response.json();
        this.realms = realms;
    }


    public getRealms(): Realm[] {
        return this.realms;
    }
    
    getMatchingRealms(typedRealm: string): Realm[] {
        const matchingRealms = []
        for(const realm of this.realms) {
            if(realm.name.substr(0, typedRealm.length).toUpperCase() === typedRealm.toUpperCase()) {
                matchingRealms.push(realm);
                if(matchingRealms.length > 9){
                    break;
                }
            }
        }
        return matchingRealms
    }
    
    getDefaultRealms(endIndex = this.limit - 1): Realm[] {
        return this.realms.slice(0, endIndex);
    }
}

export const RealmServiceSingleton = new RealmService();