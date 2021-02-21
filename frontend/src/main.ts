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

const profiles = ["Sudon", "Devzx", "Punchcanada", "Spookerino"];
autocomplete(document.getElementById("input") as HTMLInputElement, profiles);
