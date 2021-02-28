import {getUser} from './user';


function closeAllLists() {
    const items = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < items.length; i++) {
        items[i].parentNode.removeChild(items[i]);
    }
}

function addItem(list, item, profile, realm, region) {
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

function displayDefaultRealms(typedValue, defaultRealms, list, input) {
    const matchedRealm = typedValue.split('-')[1];
    if(matchedRealm?.length) {
        const matchingRealms = getMatchingRealms(defaultRealms, matchedRealm);
        matchingRealms.forEach(realm => {
            const matchingRealm = matchedRealm.charAt(0).toUpperCase() + matchedRealm.slice(1);
            const profile = typedValue.split('-')[0] + '-';
            const item = document.createElement("div");
            item.innerHTML = "<strong>" + profile + matchingRealm + "</strong>";
            item.innerHTML += realm.name.substr(matchingRealm.length);
            addItem(list, item, typedValue.split('-')[0], realm.slug, realm.region);
        })
    } else {
        defaultRealms.slice(0, 9).forEach(realm => {
            const item = document.createElement("div");
            item.innerHTML = "<strong>" + typedValue + "</strong>";
            item.innerHTML += realm.name
            addItem(list, item, typedValue, realm.slug, realm.region);
        })
    }
}

async function autocomplete(input: HTMLInputElement, defaultRealms: Realm[]) {
    input.addEventListener("input", async function(e) {
        closeAllLists();

        const typedValue = this.value;
        if(!typedValue) return false;

        const list = document.createElement('div');
        list.setAttribute("id", this.id + "autocomplete-list");
        list.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(list);

        if(typedValue.length > 2){
            const response = await fetch(`http://localhost:8080/api/v1/character/search?q=${typedValue}`);
            const characters = await response.json();
            if(characters.length) {
                characters.forEach(character => {
                    const item = document.createElement("div");
                    item.innerHTML = character.name + '-' + character.realm;
                    addItem(list, item, character.name, character.realm_slug, character.region);
                })
            } else {
                displayDefaultRealms(typedValue, defaultRealms, list, input);
            }
        }
    })

    document.addEventListener('click', function (e) {
        closeAllLists()
    })
}

interface Realm {
    name: string
    slug: string
    region: string
}

function getMatchingRealms(realms: Realm[], typedRealm: string): Realm[] {
    const matchingRealms = []
    for(const realm of realms) {
        if(realm.name.toUpperCase().includes(typedRealm?.toUpperCase())) {
            matchingRealms.push(realm);
            if(matchingRealms.length > 9){
                break;
            }
        }
    }
    return matchingRealms
}

async function getRealms(): Promise<Realm[]> {
    const response = await fetch(`http://localhost:8080/api/v1/realms`);
    if(!response.ok) {
        console.error('error');
    }

    const realms: Realm[] = await response.json();
    
    return realms;
}

(async () => {
    try {
        var defaultRealms = await getRealms();
        await autocomplete(document.getElementById("input") as HTMLInputElement, defaultRealms);
    } catch (e) {
        // Deal with the fact the chain failed
    }
})();
