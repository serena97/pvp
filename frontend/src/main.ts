import {getUser} from './user';


function closeAllLists() {
    const items = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < items.length; i++) {
        items[i].parentNode.removeChild(items[i]);
    }
}

function autocomplete(input: HTMLInputElement, defaultRealms: string[]) {
    input.addEventListener("input", function(e) {
        closeAllLists();

        const typedValue = this.value;
        if(!typedValue) return false;

        const list = document.createElement('div');
        list.setAttribute("id", this.id + "autocomplete-list");
        list.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(list);

        // if eli send me nothing, then UI display typed - realm
        // limit to 10 
        const matchedRealm = typedValue.split('-')[1];
        if(matchedRealm?.length) {
            const matchingRealms = getMatchingRealms(defaultRealms, matchedRealm);
            matchingRealms.forEach(realm => {
                const matchingRealm = matchedRealm.charAt(0).toUpperCase() + matchedRealm.slice(1);
                const profile = typedValue.split('-')[0] + '-';
                const item = document.createElement("div");

                item.innerHTML = "<strong>" + profile + matchingRealm + "</strong>";
                item.innerHTML += realm.substr(matchingRealm.length);
                list.appendChild(item);
                item.addEventListener('click', function(e) {
                    input.value = (this.getElementsByTagName("input"))[0].value;
                    getUser(input.value);
                    closeAllLists();
                })
            })
        } else {
            defaultRealms.slice(0, 9).forEach(realm => {
                const item = document.createElement("div");

                item.innerHTML = "<strong>" + typedValue + "</strong>";
                item.innerHTML += realm
                list.appendChild(item);
                item.addEventListener('click', function(e) {
                    input.value = (this.getElementsByTagName("input"))[0].value;
                    getUser(input.value);
                    closeAllLists();
                })
            })
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

function getMatchingRealms(realms: string[], typedRealm: string): string[] {
    const matchingRealms = []
    for(const realm of realms) {
        if(realm.toUpperCase().includes(typedRealm?.toUpperCase())) {
            matchingRealms.push(realm);
            if(matchingRealms.length > 9){
                break;
            }
        }
    }
    return matchingRealms
}

async function getRealms(): Promise<string[]> {
    const response = await fetch(`http://localhost:8080/api/v1/realms`);
    if(!response.ok) {
        console.error('error');
    }

    const realms: Realm[] = await response.json();
    
    return realms.map(realm => {
        return realm.name
    })
}

(async () => {
    try {
        var defaultRealms = await getRealms();
        autocomplete(document.getElementById("input") as HTMLInputElement, defaultRealms);
    } catch (e) {
        // Deal with the fact the chain failed
    }
})();
