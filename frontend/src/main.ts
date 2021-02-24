import {getUser} from './user';

function closeAllLists() {
    const items = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < items.length; i++) {
        items[i].parentNode.removeChild(items[i]);
    }
}

function autocomplete(input: HTMLInputElement, arr: string[]) {
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
        for(let i = 0; i < arr.length; i++) {
            if(arr[i].substr(0, typedValue.length).toUpperCase() === typedValue.toUpperCase()) {
                const item = document.createElement("div");
                item.innerHTML = "<strong>" + arr[i].substr(0, typedValue.length) + "</strong>";
                item.innerHTML += arr[i].substr(typedValue.length);
                item.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                list.appendChild(item);

                item.addEventListener('click', function(e) {
                    input.value = (this.getElementsByTagName("input"))[0].value;
                    getUser(input.value);
                    closeAllLists();
                })
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

interface Realms {
    realms: Array<Realm>
}

async function getRealms(): Promise<string[]> {
    const response = await fetch(`https://a4cd39176248.ngrok.io/api/v1/realms`);
    if(!response.ok) {
        console.error('error');
    }

    const realms: Realms = await response.json();
    
    return realms.realms.map(realm => {
        return realm.name
    })
}

(async () => {
    try {
        var profiles = await getRealms();
        autocomplete(document.getElementById("input") as HTMLInputElement, profiles);
    } catch (e) {
        // Deal with the fact the chain failed
    }
})();
