/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/user.ts":
/*!*********************!*\
  !*** ./src/user.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getUser": () => (/* binding */ getUser)
/* harmony export */ });
const classColors = new Map([
    ['Death Knight', '#C41E3A'],
    ['Demon Hunter', '#A330C9'],
    ['Druid', '#FF7C0A'],
    ['Hunter', '#AAD372'],
    ['Mage', '#3FC7EB'],
    ['Monk', '#00FF98'],
    ['Paladin', '#F48CBA'],
    ['Priest', '#FFFFFF'],
    ['Rogue', '#FFF468'],
    ['Shaman', '#0070DD'],
    ['Warlock', '#8788EE'],
    ['Warrior', '#C69B6D'],
]);
async function getUser(profileName, realmSlug, region) {
    var _a;
    const response = await fetch(`http://localhost:8080/api/v1/character/${region}/${realmSlug}/${profileName}`);
    if (!response.ok) {
        console.error('error');
    }
    const user = await response.json();
    const color = (_a = classColors.get(user.class)) !== null && _a !== void 0 ? _a : '#FFFFFF';
    const background = document.getElementsByClassName('background')[0];
    background.style['background-image'] = `url(${user.media.main})`;
    const name = document.getElementById('name');
    removeChildren(name);
    name.textContent = user.name;
    name.style.color = color;
    const logo = document.createElement('img');
    logo.src = user.faction === 'Alliance' ? 'assets/Logo-alliance.png' : 'assets/Logo-horde.png';
    name.appendChild(logo);
    const avatar = document.getElementById('avatar');
    removeChildren(avatar);
    const img = document.createElement('img');
    img.src = user.media.avatar;
    avatar.appendChild(img);
    const itemLvl = document.getElementById('item-lvl');
    itemLvl.textContent = `${user.item_level} ILVL`;
    const characterTitle = document.getElementById('character-title');
    const guild = user.guild ? `<${user.guild}>` : '';
    characterTitle.textContent = `${user.level} ${user.race} ${user.spec} ${user.class} ${guild} ${user.realm}`;
    getPvpStatistics(user.pvp_statistcs);
    const cards = document.getElementsByClassName('card');
    for (const card of cards) {
        card.style.visibility = 'visible';
    }
}
function removeChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }
}
function getPvpStatistics(pvpstats) {
    const table = document.querySelector("table");
    removeChildren(table);
    const thead = table.createTHead();
    const cols = ['', 'Current Rating', 'Season High', 'Highest Rating'];
    const headerRow = thead.insertRow();
    cols.forEach(col => {
        const th = document.createElement('th');
        const text = document.createTextNode(col);
        th.appendChild(text);
        headerRow.appendChild(th);
    });
    Object.entries(pvpstats).forEach(([key, value]) => {
        const row = table.insertRow();
        insertCell(row, key);
        insertCell(row, value.current_rating);
        insertCell(row, value.season_highest_rating);
        insertCell(row, value.highest_rating);
    });
}
function insertCell(row, stat) {
    const cell = row.insertCell();
    const text = document.createTextNode(stat);
    cell.appendChild(text);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user */ "./src/user.ts");

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
    item.addEventListener('click', function (e) {
        if (e.target.dataset) {
            (0,_user__WEBPACK_IMPORTED_MODULE_0__.getUser)(e.target.dataset.profile, e.target.dataset.realm, e.target.dataset.region);
        }
        closeAllLists();
    });
}
function displayDefaultRealms(typedValue, defaultRealms, list, input) {
    const matchedRealm = typedValue.split('-')[1];
    if (matchedRealm === null || matchedRealm === void 0 ? void 0 : matchedRealm.length) {
        const matchingRealms = getMatchingRealms(defaultRealms, matchedRealm);
        matchingRealms.forEach(realm => {
            const matchingRealm = matchedRealm.charAt(0).toUpperCase() + matchedRealm.slice(1);
            const profile = typedValue.split('-')[0] + '-';
            const item = document.createElement("div");
            item.innerHTML = "<strong>" + profile + matchingRealm + "</strong>";
            item.innerHTML += realm.name.substr(matchingRealm.length);
            addItem(list, item, typedValue.split('-')[0], realm.slug, realm.region);
        });
    }
    else {
        defaultRealms.slice(0, 9).forEach(realm => {
            const item = document.createElement("div");
            item.innerHTML = "<strong>" + typedValue + "</strong>";
            item.innerHTML += realm.name;
            addItem(list, item, typedValue, realm.slug, realm.region);
        });
    }
}
async function autocomplete(input, defaultRealms) {
    input.addEventListener("input", async function (e) {
        closeAllLists();
        const typedValue = this.value;
        if (!typedValue)
            return false;
        const list = document.createElement('div');
        list.setAttribute("id", this.id + "autocomplete-list");
        list.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(list);
        if (typedValue.length > 2) {
            const response = await fetch(`http://localhost:8080/api/v1/character/search?q=${typedValue}`);
            const characters = await response.json();
            if (characters.length) {
                characters.forEach(character => {
                    const item = document.createElement("div");
                    item.innerHTML = character.name + '-' + character.realm;
                    addItem(list, item, character.name, character.realm_slug, character.region);
                });
            }
            else {
                displayDefaultRealms(typedValue, defaultRealms, list, input);
            }
        }
    });
    document.addEventListener('click', function (e) {
        closeAllLists();
    });
}
function getMatchingRealms(realms, typedRealm) {
    const matchingRealms = [];
    for (const realm of realms) {
        if (realm.name.toUpperCase().includes(typedRealm === null || typedRealm === void 0 ? void 0 : typedRealm.toUpperCase())) {
            matchingRealms.push(realm);
            if (matchingRealms.length > 9) {
                break;
            }
        }
    }
    return matchingRealms;
}
async function getRealms() {
    const response = await fetch(`http://localhost:8080/api/v1/realms`);
    if (!response.ok) {
        console.error('error');
    }
    const realms = await response.json();
    return realms;
}
(async () => {
    try {
        var defaultRealms = await getRealms();
        await autocomplete(document.getElementById("input"), defaultRealms);
    }
    catch (e) {
        // Deal with the fact the chain failed
    }
})();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wdnAvLi9zcmMvdXNlci50cyIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHZwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wdnAvLi9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQXVDQSxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQztJQUN4QixDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUM7SUFDM0IsQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDO0lBQzNCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztJQUNwQixDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUM7SUFDckIsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDO0lBQ25CLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQztJQUNuQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7SUFDdEIsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDO0lBQ3JCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztJQUNwQixDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUM7SUFDckIsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDO0lBQ3RCLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQztDQUN6QixDQUFDO0FBRUssS0FBSyxVQUFVLE9BQU8sQ0FBQyxXQUFtQixFQUFFLFNBQWlCLEVBQUUsTUFBYzs7SUFDaEYsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsMENBQTBDLE1BQU0sSUFBSSxTQUFTLElBQUksV0FBVyxFQUFFLENBQUMsQ0FBQztJQUU3RyxJQUFHLENBQUMsUUFBUSxD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QyxDQUFDO1lBQzNCLElBQUcsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUM7Z0JBQ3pCLE1BQU07YUFDVDtTQUNKO0tBQ0o7SUFDRCxPQUFPLGNBQWM7QUFDekIsQ0FBQztBQUVELEtBQUssVUFBVSxTQUFTO0lBQ3BCLE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7SUFDcEUsSUFBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUU7UUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzFCO0lBRUQsTUFBTSxNQUFNLEdBQVksTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFOUMsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQztBQUVELENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDUixJQUFJO1FBQ0EsSUFBSSxhQUFhLEdBQUcsTUFBTSxTQUFTLEVBQUUsQ0FBQztRQUN0QyxNQUFNLFlBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBcUIsRUFBRSxhQUFhLENBQUMsQ0FBQztLQUMzRjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1Isc0NBQXNDO0tBQ3pDO0FBQ0wsQ0FBQyxDQUFDLEVBQUUsQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbnRlcmZhY2UgVXNlciB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICByZW5vd25fbGV2ZWw6IG51bWJlcjtcbiAgICBpdGVtX2xldmVsOiBzdHJpbmc7XG4gICAgbGV2ZWw6IG51bWJlcjtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgcmVhbG06IHN0cmluZztcbiAgICBmYWN0aW9uOiBzdHJpbmc7XG4gICAgY2xhc3M6IHN0cmluZztcbiAgICBjb3ZlbmFudDogc3RyaW5nO1xuICAgIGdlbmRlcjogc3RyaW5nO1xuICAgIHJhY2U6IHN0cmluZztcbiAgICBzcGVjOiBzdHJpbmc7XG4gICAgZ3VpbGQ6IHN0cmluZztcbiAgICBtZWRpYToge1xuICAgICAgICBhdmF0YXI6IHN0cmluZztcbiAgICAgICAgbWFpbjogc3RyaW5nO1xuICAgIH1cbiAgICBwdnBfc3RhdGlzdGNzOiBQVlBTdGF0aWNzXG59XG5cbmludGVyZmFjZSBQVlBTdGF0aWNzIHtcbiAgICBcIjJ2MlwiOiB7XG4gICAgICAgIGhpZ2hlc3RfcmF0aW5nOiBudW1iZXI7XG4gICAgICAgIGN1cnJlbnRfcmF0aW5nOiBudW1iZXI7XG4gICAgICAgIHNlYXNvbl9oaWdoZXN0X3JhdGluZzogbnVtYmVyO1xuICAgIH1cbiAgICBcIjN2M1wiOiB7XG4gICAgICAgIGhpZ2hlc3RfcmF0aW5nOiBudW1iZXI7XG4gICAgICAgIGN1cnJlbnRfcmF0aW5nOiBudW1iZXI7XG4gICAgICAgIHNlYXNvbl9oaWdoZXN0X3JhdGluZzogbnVtYmVyO1xuICAgIH1cbiAgICBcInJiZ1wiOiB7XG4gICAgICAgIGhpZ2hlc3RfcmF0aW5nOiBudW1iZXI7XG4gICAgICAgIGN1cnJlbnRfcmF0aW5nOiBudW1iZXI7XG4gICAgICAgIHNlYXNvbl9oaWdoZXN0X3JhdGluZzogbnVtYmVyO1xuICAgIH1cbn1cblxuY29uc3QgY2xhc3NDb2xvcnMgPSBuZXcgTWFwKFtcbiAgICBbJ0RlYXRoIEtuaWdodCcsICcjQzQxRTNBJ10sXG4gICAgWydEZW1vbiBIdW50ZXInLCAnI0EzMzBDOSddLFxuICAgIFsnRHJ1aWQnLCAnI0ZGN0MwQSddLFxuICAgIFsnSHVudGVyJywgJyNBQUQzNzInXSxcbiAgICBbJ01hZ2UnLCAnIzNGQzdFQiddLFxuICAgIFsnTW9uaycsICcjMDBGRjk4J10sXG4gICAgWydQYWxhZGluJywgJyNGNDhDQkEnXSxcbiAgICBbJ1ByaWVzdCcsICcjRkZGRkZGJ10sXG4gICAgWydSb2d1ZScsICcjRkZGNDY4J10sXG4gICAgWydTaGFtYW4nLCAnIzAwNzBERCddLFxuICAgIFsnV2FybG9jaycsICcjODc4OEVFJ10sXG4gICAgWydXYXJyaW9yJywgJyNDNjlCNkQnXSxcbl0pXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRVc2VyKHByb2ZpbGVOYW1lOiBzdHJpbmcsIHJlYWxtU2x1Zzogc3RyaW5nLCByZWdpb246IHN0cmluZykgeyBcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjgwODAvYXBpL3YxL2NoYXJhY3Rlci8ke3JlZ2lvbn0vJHtyZWFsbVNsdWd9LyR7cHJvZmlsZU5hbWV9YCk7XG5cbiAgICBpZighcmVzcG9uc2Uub2spIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3InKTtcbiAgICB9XG5cbiAgICBjb25zdCB1c2VyOiBVc2VyID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIGNvbnN0IGNvbG9yID0gY2xhc3NDb2xvcnMuZ2V0KHVzZXIuY2xhc3MpID8/ICcjRkZGRkZGJztcbiAgICBcbiAgICBjb25zdCBiYWNrZ3JvdW5kID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYmFja2dyb3VuZCcpWzBdIGFzIEhUTUxFbGVtZW50O1xuICAgIGJhY2tncm91bmQuc3R5bGVbJ2JhY2tncm91bmQtaW1hZ2UnXSA9IGB1cmwoJHt1c2VyLm1lZGlhLm1haW59KWBcblxuICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmFtZScpO1xuICAgIHJlbW92ZUNoaWxkcmVuKG5hbWUpO1xuXG4gICAgbmFtZS50ZXh0Q29udGVudCA9IHVzZXIubmFtZTtcbiAgICBuYW1lLnN0eWxlLmNvbG9yID0gY29sb3I7XG4gICAgY29uc3QgbG9nbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGxvZ28uc3JjID0gdXNlci5mYWN0aW9uID09PSAnQWxsaWFuY2UnID8gJ2Fzc2V0cy9Mb2dvLWFsbGlhbmNlLnBuZycgOiAnYXNzZXRzL0xvZ28taG9yZGUucG5nJztcbiAgICBuYW1lLmFwcGVuZENoaWxkKGxvZ28pXG5cbiAgICBjb25zdCBhdmF0YXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXZhdGFyJyk7XG4gICAgcmVtb3ZlQ2hpbGRyZW4oYXZhdGFyKTtcbiAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBpbWcuc3JjID0gdXNlci5tZWRpYS5hdmF0YXI7XG4gICAgYXZhdGFyLmFwcGVuZENoaWxkKGltZyk7XG5cbiAgICBjb25zdCBpdGVtTHZsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW0tbHZsJyk7XG4gICAgaXRlbUx2bC50ZXh0Q29udGVudCA9IGAke3VzZXIuaXRlbV9sZXZlbH0gSUxWTGBcblxuICAgIGNvbnN0IGNoYXJhY3RlclRpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXJhY3Rlci10aXRsZScpO1xuICAgIGNvbnN0IGd1aWxkID0gdXNlci5ndWlsZCA/IGA8JHt1c2VyLmd1aWxkfT5gIDogJydcbiAgICBjaGFyYWN0ZXJUaXRsZS50ZXh0Q29udGVudCA9IGAke3VzZXIubGV2ZWx9ICR7dXNlci5yYWNlfSAke3VzZXIuc3BlY30gJHt1c2VyLmNsYXNzfSAke2d1aWxkfSAke3VzZXIucmVhbG19YFxuXG4gICAgZ2V0UHZwU3RhdGlzdGljcyh1c2VyLnB2cF9zdGF0aXN0Y3MpO1xuXG4gICAgY29uc3QgY2FyZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYXJkJyk7XG4gICAgZm9yKGNvbnN0IGNhcmQgb2YgY2FyZHMpIHtcbiAgICAgICAgKGNhcmQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZScgXG4gICAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVDaGlsZHJlbihub2RlOiBIVE1MRWxlbWVudCkge1xuICAgIHdoaWxlIChub2RlLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChub2RlLmxhc3RDaGlsZCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRQdnBTdGF0aXN0aWNzKHB2cHN0YXRzOiBQVlBTdGF0aWNzKSB7XG4gICAgY29uc3QgdGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGFibGVcIik7XG4gICAgcmVtb3ZlQ2hpbGRyZW4odGFibGUpO1xuICAgIGNvbnN0IHRoZWFkID0gdGFibGUuY3JlYXRlVEhlYWQoKTtcbiAgICBjb25zdCBjb2xzID0gWycnLCAnQ3VycmVudCBSYXRpbmcnLCAnU2Vhc29uIEhpZ2gnLCAnSGlnaGVzdCBSYXRpbmcnXVxuICAgIGNvbnN0IGhlYWRlclJvdyA9IHRoZWFkLmluc2VydFJvdygpO1xuICAgIGNvbHMuZm9yRWFjaChjb2wgPT4ge1xuICAgICAgICBjb25zdCB0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RoJyk7XG4gICAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjb2wpO1xuICAgICAgICB0aC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgaGVhZGVyUm93LmFwcGVuZENoaWxkKHRoKTtcbiAgICB9KVxuXG4gICAgT2JqZWN0LmVudHJpZXMocHZwc3RhdHMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBjb25zdCByb3cgPSB0YWJsZS5pbnNlcnRSb3coKTtcbiAgICAgICAgaW5zZXJ0Q2VsbChyb3csIGtleSk7XG4gICAgICAgIGluc2VydENlbGwocm93LCB2YWx1ZS5jdXJyZW50X3JhdGluZyk7XG4gICAgICAgIGluc2VydENlbGwocm93LCB2YWx1ZS5zZWFzb25faGlnaGVzdF9yYXRpbmcpO1xuICAgICAgICBpbnNlcnRDZWxsKHJvdywgdmFsdWUuaGlnaGVzdF9yYXRpbmcpO1xuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGluc2VydENlbGwocm93OiBIVE1MVGFibGVSb3dFbGVtZW50LCBzdGF0OiBhbnkpIHtcbiAgICBjb25zdCBjZWxsID0gcm93Lmluc2VydENlbGwoKTtcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc3RhdCk7XG4gICAgY2VsbC5hcHBlbmRDaGlsZCh0ZXh0KVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHtnZXRVc2VyfSBmcm9tICcuL3VzZXInO1xuXG5cbmZ1bmN0aW9uIGNsb3NlQWxsTGlzdHMoKSB7XG4gICAgY29uc3QgaXRlbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhdXRvY29tcGxldGUtaXRlbXMnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZW1zW2ldLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaXRlbXNbaV0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYWRkSXRlbShsaXN0LCBpdGVtLCBwcm9maWxlLCByZWFsbSwgcmVnaW9uKSB7XG4gICAgaXRlbS5kYXRhc2V0LnByb2ZpbGUgPSBwcm9maWxlO1xuICAgIGl0ZW0uZGF0YXNldC5yZWFsbSA9IHJlYWxtO1xuICAgIGl0ZW0uZGF0YXNldC5yZWdpb24gPSByZWdpb247XG4gICAgbGlzdC5hcHBlbmRDaGlsZChpdGVtKTtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBpZihlLnRhcmdldC5kYXRhc2V0KXtcbiAgICAgICAgICAgIGdldFVzZXIoZS50YXJnZXQuZGF0YXNldC5wcm9maWxlLCBlLnRhcmdldC5kYXRhc2V0LnJlYWxtLCBlLnRhcmdldC5kYXRhc2V0LnJlZ2lvbik7XG4gICAgICAgIH1cbiAgICAgICAgY2xvc2VBbGxMaXN0cygpO1xuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlEZWZhdWx0UmVhbG1zKHR5cGVkVmFsdWUsIGRlZmF1bHRSZWFsbXMsIGxpc3QsIGlucHV0KSB7XG4gICAgY29uc3QgbWF0Y2hlZFJlYWxtID0gdHlwZWRWYWx1ZS5zcGxpdCgnLScpWzFdO1xuICAgIGlmKG1hdGNoZWRSZWFsbT8ubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoaW5nUmVhbG1zID0gZ2V0TWF0Y2hpbmdSZWFsbXMoZGVmYXVsdFJlYWxtcywgbWF0Y2hlZFJlYWxtKTtcbiAgICAgICAgbWF0Y2hpbmdSZWFsbXMuZm9yRWFjaChyZWFsbSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtYXRjaGluZ1JlYWxtID0gbWF0Y2hlZFJlYWxtLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbWF0Y2hlZFJlYWxtLnNsaWNlKDEpO1xuICAgICAgICAgICAgY29uc3QgcHJvZmlsZSA9IHR5cGVkVmFsdWUuc3BsaXQoJy0nKVswXSArICctJztcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgaXRlbS5pbm5lckhUTUwgPSBcIjxzdHJvbmc+XCIgKyBwcm9maWxlICsgbWF0Y2hpbmdSZWFsbSArIFwiPC9zdHJvbmc+XCI7XG4gICAgICAgICAgICBpdGVtLmlubmVySFRNTCArPSByZWFsbS5uYW1lLnN1YnN0cihtYXRjaGluZ1JlYWxtLmxlbmd0aCk7XG4gICAgICAgICAgICBhZGRJdGVtKGxpc3QsIGl0ZW0sIHR5cGVkVmFsdWUuc3BsaXQoJy0nKVswXSwgcmVhbG0uc2x1ZywgcmVhbG0ucmVnaW9uKTtcbiAgICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgICBkZWZhdWx0UmVhbG1zLnNsaWNlKDAsIDkpLmZvckVhY2gocmVhbG0gPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBpdGVtLmlubmVySFRNTCA9IFwiPHN0cm9uZz5cIiArIHR5cGVkVmFsdWUgKyBcIjwvc3Ryb25nPlwiO1xuICAgICAgICAgICAgaXRlbS5pbm5lckhUTUwgKz0gcmVhbG0ubmFtZVxuICAgICAgICAgICAgYWRkSXRlbShsaXN0LCBpdGVtLCB0eXBlZFZhbHVlLCByZWFsbS5zbHVnLCByZWFsbS5yZWdpb24pO1xuICAgICAgICB9KVxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gYXV0b2NvbXBsZXRlKGlucHV0OiBIVE1MSW5wdXRFbGVtZW50LCBkZWZhdWx0UmVhbG1zOiBSZWFsbVtdKSB7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGFzeW5jIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgY2xvc2VBbGxMaXN0cygpO1xuXG4gICAgICAgIGNvbnN0IHR5cGVkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICBpZighdHlwZWRWYWx1ZSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGlzdC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmlkICsgXCJhdXRvY29tcGxldGUtbGlzdFwiKTtcbiAgICAgICAgbGlzdC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImF1dG9jb21wbGV0ZS1pdGVtc1wiKTtcbiAgICAgICAgdGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGxpc3QpO1xuXG4gICAgICAgIGlmKHR5cGVkVmFsdWUubGVuZ3RoID4gMil7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjgwODAvYXBpL3YxL2NoYXJhY3Rlci9zZWFyY2g/cT0ke3R5cGVkVmFsdWV9YCk7XG4gICAgICAgICAgICBjb25zdCBjaGFyYWN0ZXJzID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgaWYoY2hhcmFjdGVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjaGFyYWN0ZXJzLmZvckVhY2goY2hhcmFjdGVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaW5uZXJIVE1MID0gY2hhcmFjdGVyLm5hbWUgKyAnLScgKyBjaGFyYWN0ZXIucmVhbG07XG4gICAgICAgICAgICAgICAgICAgIGFkZEl0ZW0obGlzdCwgaXRlbSwgY2hhcmFjdGVyLm5hbWUsIGNoYXJhY3Rlci5yZWFsbV9zbHVnLCBjaGFyYWN0ZXIucmVnaW9uKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5RGVmYXVsdFJlYWxtcyh0eXBlZFZhbHVlLCBkZWZhdWx0UmVhbG1zLCBsaXN0LCBpbnB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjbG9zZUFsbExpc3RzKClcbiAgICB9KVxufVxuXG5pbnRlcmZhY2UgUmVhbG0ge1xuICAgIG5hbWU6IHN0cmluZ1xuICAgIHNsdWc6IHN0cmluZ1xuICAgIHJlZ2lvbjogc3RyaW5nXG59XG5cbmZ1bmN0aW9uIGdldE1hdGNoaW5nUmVhbG1zKHJlYWxtczogUmVhbG1bXSwgdHlwZWRSZWFsbTogc3RyaW5nKTogUmVhbG1bXSB7XG4gICAgY29uc3QgbWF0Y2hpbmdSZWFsbXMgPSBbXVxuICAgIGZvcihjb25zdCByZWFsbSBvZiByZWFsbXMpIHtcbiAgICAgICAgaWYocmVhbG0ubmFtZS50b1VwcGVyQ2FzZSgpLmluY2x1ZGVzKHR5cGVkUmVhbG0/LnRvVXBwZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICBtYXRjaGluZ1JlYWxtcy5wdXNoKHJlYWxtKTtcbiAgICAgICAgICAgIGlmKG1hdGNoaW5nUmVhbG1zLmxlbmd0aCA+IDkpe1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXRjaGluZ1JlYWxtc1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRSZWFsbXMoKTogUHJvbWlzZTxSZWFsbVtdPiB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaS92MS9yZWFsbXNgKTtcbiAgICBpZighcmVzcG9uc2Uub2spIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3InKTtcbiAgICB9XG5cbiAgICBjb25zdCByZWFsbXM6IFJlYWxtW10gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgXG4gICAgcmV0dXJuIHJlYWxtcztcbn1cblxuKGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgICB2YXIgZGVmYXVsdFJlYWxtcyA9IGF3YWl0IGdldFJlYWxtcygpO1xuICAgICAgICBhd2FpdCBhdXRvY29tcGxldGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnB1dFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50LCBkZWZhdWx0UmVhbG1zKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIERlYWwgd2l0aCB0aGUgZmFjdCB0aGUgY2hhaW4gZmFpbGVkXG4gICAgfVxufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=