import getUser from './userService';
import { RealmServiceSingleton as RealmService} from './realmService'

function closeAllLists() {
    const items = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < items.length; i++) {
        items[i].parentNode.removeChild(items[i]);
    }
}

function addItem(list, item, profile, realm, region) {
    item.innerHTML += `<span><img class="region" src="assets/${region}.svg"></span>`
    item.dataset.profile = profile;
    item.dataset.realm = realm;
    item.dataset.region = region;
    list.appendChild(item);
    item.addEventListener('click', function(e) {
        if(e.target.dataset){
            getUser(e.target.dataset.profile, e.target.dataset.realm, e.target.dataset.region);
        }
        closeAllLists();
    })
}

function displayDefaultRealms(realms, typedProfile, list) {
    realms.forEach(realm => {
        const item = document.createElement("div");
        item.innerHTML = "<strong>" + typedProfile + "</strong>";
        item.innerHTML += ' - ' + realm.name;
        addItem(list, item, typedProfile, realm.slug, realm.region);
    })
}

function displayRealms(typedValue, list) {
    const matchedRealm = typedValue.split('-')[1];
    const typedProfile = typedValue.split('-')[0];
    if(matchedRealm?.length) {
        const matchingRealms = RealmService.getMatchingRealms(matchedRealm);
        matchingRealms.forEach(realm => {
            const matchingRealm = matchedRealm.charAt(0).toUpperCase() + matchedRealm.slice(1);
            const profile = typedProfile + ' - ';
            const item = document.createElement("div");
            item.innerHTML = "<strong>" + profile + matchingRealm + "</strong>";
            item.innerHTML += realm.name.substr(matchingRealm.length);
            addItem(list, item, typedProfile, realm.slug, realm.region);
        })
    } else {
        const realms = RealmService.getDefaultRealms();
        displayDefaultRealms(realms, typedProfile, list);
    }
}

export default async function autocomplete(input: HTMLInputElement) {
    input.addEventListener("input", async function(e) {
        closeAllLists();

        let typedValue = this.value.replace(/ /g,'');
        typedValue = typedValue.charAt(0).toUpperCase() + typedValue.slice(1);
        if(!typedValue) return false;

        const list = document.createElement('div');
        list.setAttribute("id", this.id + "autocomplete-list");
        list.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(list);

        const typedRealm = typedValue.split('-')[1];
        const typedProfile = typedValue.split('-')[0];

        if(typedValue.length > 2){
            const response = await fetch(`http://localhost:8080/api/v1/character/search?q=${typedProfile}`);
            const characters = await response.json();
            if(characters.length) {
                characters.forEach(character => {
                    if(typedRealm && character.realm.toUpperCase().substring(0, typedRealm.length) !== typedRealm.toUpperCase()) {
                        return;
                    }
                    const item = document.createElement("div");
                    item.innerHTML = "<strong>" + character.name + ' - ' + character.realm + "</strong>";
                    addItem(list, item, character.name, character.realm_slug, character.region);
                })
            }
            displayRealms(typedValue, list);
        }
    })

    document.addEventListener('click', function (e) {
        closeAllLists()
    })
}

