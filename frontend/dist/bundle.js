/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/services/realmService.ts":
/*!**************************************!*\
  !*** ./src/services/realmService.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RealmServiceSingleton": () => (/* binding */ RealmServiceSingleton)
/* harmony export */ });
class RealmService {
    constructor() {
        this.limit = 10;
        this.initializeRealms();
    }
    async initializeRealms() {
        const response = await fetch(`http://localhost:8080/api/v1/realms`);
        if (!response.ok) {
            console.error('error');
        }
        const realms = await response.json();
        this.realms = realms;
    }
    getRealms() {
        return this.realms;
    }
    getMatchingRealms(typedRealm) {
        const matchingRealms = [];
        for (const realm of this.realms) {
            if (realm.name.substr(0, typedRealm.length).toUpperCase() === typedRealm.toUpperCase()) {
                matchingRealms.push(realm);
                if (matchingRealms.length > 9) {
                    break;
                }
            }
        }
        return matchingRealms;
    }
    getDefaultRealms() {
        return this.realms.slice(0, this.limit - 1);
    }
}
const RealmServiceSingleton = new RealmService();


/***/ }),

/***/ "./src/services/searchService.ts":
/*!***************************************!*\
  !*** ./src/services/searchService.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ autocomplete)
/* harmony export */ });
/* harmony import */ var _userService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./userService */ "./src/services/userService.ts");
/* harmony import */ var _realmService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./realmService */ "./src/services/realmService.ts");


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
            (0,_userService__WEBPACK_IMPORTED_MODULE_0__.default)(e.target.dataset.profile, e.target.dataset.realm, e.target.dataset.region);
        }
        closeAllLists();
    });
}
function displayDefaultRealms(typedValue, list) {
    typedValue = typedValue.charAt(0).toUpperCase() + typedValue.slice(1);
    const matchedRealm = typedValue.split('-')[1];
    const typedProfile = typedValue.split('-')[0];
    if (matchedRealm === null || matchedRealm === void 0 ? void 0 : matchedRealm.length) {
        const matchingRealms = _realmService__WEBPACK_IMPORTED_MODULE_1__.RealmServiceSingleton.getMatchingRealms(matchedRealm);
        matchingRealms.forEach(realm => {
            const matchingRealm = matchedRealm.charAt(0).toUpperCase() + matchedRealm.slice(1);
            const profile = typedProfile + ' - ';
            const item = document.createElement("div");
            item.innerHTML = "<strong>" + profile + matchingRealm + "</strong>";
            item.innerHTML += realm.name.substr(matchingRealm.length);
            addItem(list, item, typedProfile, realm.slug, realm.region);
        });
    }
    else {
        _realmService__WEBPACK_IMPORTED_MODULE_1__.RealmServiceSingleton.getDefaultRealms().forEach(realm => {
            const item = document.createElement("div");
            item.innerHTML = "<strong>" + typedProfile + "</strong>";
            item.innerHTML += typedValue.includes('-') ? realm.name : ' - ' + realm.name;
            addItem(list, item, typedProfile, realm.slug, realm.region);
        });
    }
}
async function autocomplete(input) {
    input.addEventListener("input", async function (e) {
        closeAllLists();
        const typedValue = this.value.replace(/ /g, '');
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
                displayDefaultRealms(typedValue, list);
            }
        }
    });
    document.addEventListener('click', function (e) {
        closeAllLists();
    });
}


/***/ }),

/***/ "./src/services/userService.ts":
/*!*************************************!*\
  !*** ./src/services/userService.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getUser)
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
    const response = await fetch(`http://localhost:8080/api/v1/character/${region}/${realmSlug}/${profileName}`);
    const avatar = document.getElementById('avatar');
    const name = document.getElementById('name');
    const itemLvl = document.getElementById('item-lvl');
    const profileTitle = document.getElementById('character-title');
    [avatar, name, itemLvl, profileTitle].forEach(node => removeChildren(node));
    if (!response.ok) {
        console.error('Profile not found');
        displayUserNotFound(name, profileName);
        return;
    }
    const user = await response.json();
    setBackground(user.media.main);
    setProfileName(name, user.name, user.class, user.faction);
    setAvatar(avatar, user.media.avatar);
    setItemLevel(itemLvl, user.item_level);
    setProfileTitle(profileTitle, user);
    setPvpStatistics(user.pvp_statistcs);
    setCardVisibility();
}
function displayUserNotFound(message, profileName) {
    message.textContent = `${profileName} Not Found`;
    message.style.color = "white";
    const cards = document.getElementsByClassName('card');
    cards[0].style.visibility = 'visible';
    cards[1].style.visibility = 'hidden';
}
function setBackground(url) {
    const background = document.getElementsByClassName('background')[0];
    background.style['background-image'] = `url(${url})`;
}
function setProfileName(name, username, userClass, faction) {
    var _a;
    name.textContent = username;
    name.style.color = (_a = classColors.get(userClass)) !== null && _a !== void 0 ? _a : '#FFFFFF';
    const logo = document.createElement('img');
    logo.src = faction === 'Alliance' ? 'assets/Logo-alliance.png' : 'assets/Logo-horde.png';
    name.appendChild(logo);
}
function setAvatar(avatar, avatarUrl) {
    const img = document.createElement('img');
    img.src = avatarUrl;
    avatar.appendChild(img);
}
function setItemLevel(itemLvl, level) {
    itemLvl.textContent = `${level} ILVL`;
}
function setProfileTitle(profileTitle, user) {
    const guild = user.guild ? `<${user.guild}>` : '';
    profileTitle.textContent = `${user.level} ${user.race} ${user.spec} ${user.class} ${guild} ${user.realm}`;
}
function removeChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }
}
function setPvpStatistics(pvpstats) {
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
function setCardVisibility() {
    const cards = document.getElementsByClassName('card');
    for (const card of cards) {
        card.style.visibility = 'visible';
    }
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
/* harmony import */ var _services_searchService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./services/searchService */ "./src/services/searchService.ts");

(async () => {
    try {
        await (0,_services_searchService__WEBPACK_IMPORTED_MODULE_0__.default)(document.getElementById("input"));
    }
    catch (e) {
        console.error(e);
    }
})();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wdnAvLi9zcmMvc2VydmljZXMvcmVhbG1TZXJ2aWNlLnRzIiwid2VicGFjazovL3B2cC8uL3NyYy9zZXJ2aWNlcy9zZWFyY2hTZXJ2aWNlLnRzIiwid2VicGFjazovL3B2cC8uL3NyYy9zZXJ2aWNlcy91c2VyU2VydmljZS50cyIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHZwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wdnAvLi9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUVBLE1BQU0sWUFBWTtJQUlkO1FBRlMsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUdoQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsS0FBSyxDQUFDLGdCQUFnQjtRQUNsQixNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBQ3BFLElBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUMxQjtRQUNELE1BQU0sTUFBTSxHQUFZLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzlDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFHTSxTQUFTO1FBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxVQUFrQjtRQUNoQyxNQUFNLGNBQWMsR0FBRyxFQUFFO1FBQ3pCLEtBQUksTUFBTSxLQUFLLElB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O1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7O0FDTm9EO0FBRXBELENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDUixJQUFJO1FBQ0EsTUFBTSxnRUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFxQixDQUFDLENBQUM7S0FDNUU7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNSLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEI7QUFDTCxDQUFDLENBQUMsRUFBRSxDQUFDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlYWxtIH0gZnJvbSBcIi4uL21vZGVscy9yZWFsbVwiO1xuXG5jbGFzcyBSZWFsbVNlcnZpY2Uge1xuICAgIHJlYWxtczogUmVhbG1bXVxuICAgIHJlYWRvbmx5IGxpbWl0ID0gMTA7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUmVhbG1zKCk7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdGlhbGl6ZVJlYWxtcygpIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaS92MS9yZWFsbXNgKTtcbiAgICAgICAgaWYoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvcicpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlYWxtczogUmVhbG1bXSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgdGhpcy5yZWFsbXMgPSByZWFsbXM7XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgZ2V0UmVhbG1zKCk6IFJlYWxtW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWFsbXM7XG4gICAgfVxuICAgIFxuICAgIGdldE1hdGNoaW5nUmVhbG1zKHR5cGVkUmVhbG06IHN0cmluZyk6IFJlYWxtW10ge1xuICAgICAgICBjb25zdCBtYXRjaGluZ1JlYWxtcyA9IFtdXG4gICAgICAgIGZvcihjb25zdCByZWFsbSBvZiB0aGlzLnJlYWxtcykge1xuICAgICAgICAgICAgaWYocmVhbG0ubmFtZS5zdWJzdHIoMCwgdHlwZWRSZWFsbS5sZW5ndGgpLnRvVXBwZXJDYXNlKCkgPT09IHR5cGVkUmVhbG0udG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgIG1hdGNoaW5nUmVhbG1zLnB1c2gocmVhbG0pO1xuICAgICAgICAgICAgICAgIGlmKG1hdGNoaW5nUmVhbG1zLmxlbmd0aCA+IDkpe1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hdGNoaW5nUmVhbG1zXG4gICAgfVxuICAgIFxuICAgIGdldERlZmF1bHRSZWFsbXMoKTogUmVhbG1bXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlYWxtcy5zbGljZSgwLCB0aGlzLmxpbWl0IC0gMSk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgUmVhbG1TZXJ2aWNlU2luZ2xldG9uID0gbmV3IFJlYWxtU2VydmljZSgpOyIsImltcG9ydCBnZXRVc2VyIGZyb20gJy4vdXNlclNlcnZpY2UnO1xuaW1wb3J0IHsgUmVhbG1TZXJ2aWNlU2luZ2xldG9uIGFzIFJlYWxtU2VydmljZX0gZnJvbSAnLi9yZWFsbVNlcnZpY2UnXG5cbmZ1bmN0aW9uIGNsb3NlQWxsTGlzdHMoKSB7XG4gICAgY29uc3QgaXRlbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhdXRvY29tcGxldGUtaXRlbXMnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZW1zW2ldLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaXRlbXNbaV0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYWRkSXRlbShsaXN0LCBpdGVtLCBwcm9maWxlLCByZWFsbSwgcmVnaW9uKSB7XG4gICAgaXRlbS5kYXRhc2V0LnByb2ZpbGUgPSBwcm9maWxlO1xuICAgIGl0ZW0uZGF0YXNldC5yZWFsbSA9IHJlYWxtO1xuICAgIGl0ZW0uZGF0YXNldC5yZWdpb24gPSByZWdpb247XG4gICAgbGlzdC5hcHBlbmRDaGlsZChpdGVtKTtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBpZihlLnRhcmdldC5kYXRhc2V0KXtcbiAgICAgICAgICAgIGdldFVzZXIoZS50YXJnZXQuZGF0YXNldC5wcm9maWxlLCBlLnRhcmdldC5kYXRhc2V0LnJlYWxtLCBlLnRhcmdldC5kYXRhc2V0LnJlZ2lvbik7XG4gICAgICAgIH1cbiAgICAgICAgY2xvc2VBbGxMaXN0cygpO1xuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlEZWZhdWx0UmVhbG1zKHR5cGVkVmFsdWUsIGxpc3QpIHtcbiAgICB0eXBlZFZhbHVlID0gdHlwZWRWYWx1ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR5cGVkVmFsdWUuc2xpY2UoMSk7XG4gICAgY29uc3QgbWF0Y2hlZFJlYWxtID0gdHlwZWRWYWx1ZS5zcGxpdCgnLScpWzFdO1xuICAgIGNvbnN0IHR5cGVkUHJvZmlsZSA9IHR5cGVkVmFsdWUuc3BsaXQoJy0nKVswXTtcbiAgICBpZihtYXRjaGVkUmVhbG0/Lmxlbmd0aCkge1xuICAgICAgICBjb25zdCBtYXRjaGluZ1JlYWxtcyA9IFJlYWxtU2VydmljZS5nZXRNYXRjaGluZ1JlYWxtcyhtYXRjaGVkUmVhbG0pO1xuICAgICAgICBtYXRjaGluZ1JlYWxtcy5mb3JFYWNoKHJlYWxtID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoaW5nUmVhbG0gPSBtYXRjaGVkUmVhbG0uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBtYXRjaGVkUmVhbG0uc2xpY2UoMSk7XG4gICAgICAgICAgICBjb25zdCBwcm9maWxlID0gdHlwZWRQcm9maWxlICsgJyAtICc7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGl0ZW0uaW5uZXJIVE1MID0gXCI8c3Ryb25nPlwiICsgcHJvZmlsZSArIG1hdGNoaW5nUmVhbG0gKyBcIjwvc3Ryb25nPlwiO1xuICAgICAgICAgICAgaXRlbS5pbm5lckhUTUwgKz0gcmVhbG0ubmFtZS5zdWJzdHIobWF0Y2hpbmdSZWFsbS5sZW5ndGgpO1xuICAgICAgICAgICAgYWRkSXRlbShsaXN0LCBpdGVtLCB0eXBlZFByb2ZpbGUsIHJlYWxtLnNsdWcsIHJlYWxtLnJlZ2lvbik7XG4gICAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgICAgUmVhbG1TZXJ2aWNlLmdldERlZmF1bHRSZWFsbXMoKS5mb3JFYWNoKHJlYWxtID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgaXRlbS5pbm5lckhUTUwgPSBcIjxzdHJvbmc+XCIgKyB0eXBlZFByb2ZpbGUgKyBcIjwvc3Ryb25nPlwiO1xuICAgICAgICAgICAgaXRlbS5pbm5lckhUTUwgKz0gdHlwZWRWYWx1ZS5pbmNsdWRlcygnLScpID8gIHJlYWxtLm5hbWUgOiAnIC0gJyArIHJlYWxtLm5hbWU7XG4gICAgICAgICAgICBhZGRJdGVtKGxpc3QsIGl0ZW0sIHR5cGVkUHJvZmlsZSwgcmVhbG0uc2x1ZywgcmVhbG0ucmVnaW9uKTtcbiAgICAgICAgfSlcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGF1dG9jb21wbGV0ZShpbnB1dDogSFRNTElucHV0RWxlbWVudCkge1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBhc3luYyBmdW5jdGlvbihlKSB7XG4gICAgICAgIGNsb3NlQWxsTGlzdHMoKTtcblxuICAgICAgICBjb25zdCB0eXBlZFZhbHVlID0gdGhpcy52YWx1ZS5yZXBsYWNlKC8gL2csJycpO1xuICAgICAgICBpZighdHlwZWRWYWx1ZSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGlzdC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmlkICsgXCJhdXRvY29tcGxldGUtbGlzdFwiKTtcbiAgICAgICAgbGlzdC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImF1dG9jb21wbGV0ZS1pdGVtc1wiKTtcbiAgICAgICAgdGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGxpc3QpO1xuXG4gICAgICAgIGlmKHR5cGVkVmFsdWUubGVuZ3RoID4gMil7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjgwODAvYXBpL3YxL2NoYXJhY3Rlci9zZWFyY2g/cT0ke3R5cGVkVmFsdWV9YCk7XG4gICAgICAgICAgICBjb25zdCBjaGFyYWN0ZXJzID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgaWYoY2hhcmFjdGVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjaGFyYWN0ZXJzLmZvckVhY2goY2hhcmFjdGVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaW5uZXJIVE1MID0gY2hhcmFjdGVyLm5hbWUgKyAnLScgKyBjaGFyYWN0ZXIucmVhbG07XG4gICAgICAgICAgICAgICAgICAgIGFkZEl0ZW0obGlzdCwgaXRlbSwgY2hhcmFjdGVyLm5hbWUsIGNoYXJhY3Rlci5yZWFsbV9zbHVnLCBjaGFyYWN0ZXIucmVnaW9uKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5RGVmYXVsdFJlYWxtcyh0eXBlZFZhbHVlLCBsaXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNsb3NlQWxsTGlzdHMoKVxuICAgIH0pXG59XG5cbiIsImltcG9ydCB7IFBWUFN0YXRpY3MgfSBmcm9tIFwiLi4vbW9kZWxzL3N0YXRpc3RpY3NcIjtcbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi4vbW9kZWxzL3VzZXJcIjtcblxuY29uc3QgY2xhc3NDb2xvcnMgPSBuZXcgTWFwKFtcbiAgICBbJ0RlYXRoIEtuaWdodCcsICcjQzQxRTNBJ10sXG4gICAgWydEZW1vbiBIdW50ZXInLCAnI0EzMzBDOSddLFxuICAgIFsnRHJ1aWQnLCAnI0ZGN0MwQSddLFxuICAgIFsnSHVudGVyJywgJyNBQUQzNzInXSxcbiAgICBbJ01hZ2UnLCAnIzNGQzdFQiddLFxuICAgIFsnTW9uaycsICcjMDBGRjk4J10sXG4gICAgWydQYWxhZGluJywgJyNGNDhDQkEnXSxcbiAgICBbJ1ByaWVzdCcsICcjRkZGRkZGJ10sXG4gICAgWydSb2d1ZScsICcjRkZGNDY4J10sXG4gICAgWydTaGFtYW4nLCAnIzAwNzBERCddLFxuICAgIFsnV2FybG9jaycsICcjODc4OEVFJ10sXG4gICAgWydXYXJyaW9yJywgJyNDNjlCNkQnXSxcbl0pXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGdldFVzZXIocHJvZmlsZU5hbWU6IHN0cmluZywgcmVhbG1TbHVnOiBzdHJpbmcsIHJlZ2lvbjogc3RyaW5nKSB7IFxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvdjEvY2hhcmFjdGVyLyR7cmVnaW9ufS8ke3JlYWxtU2x1Z30vJHtwcm9maWxlTmFtZX1gKTtcbiAgICBcbiAgICBjb25zdCBhdmF0YXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXZhdGFyJyk7XG4gICAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYW1lJyk7XG4gICAgY29uc3QgaXRlbUx2bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtLWx2bCcpO1xuICAgIGNvbnN0IHByb2ZpbGVUaXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFyYWN0ZXItdGl0bGUnKTtcblxuICAgIFthdmF0YXIsIG5hbWUsIGl0ZW1MdmwsIHByb2ZpbGVUaXRsZV0uZm9yRWFjaChub2RlID0+IHJlbW92ZUNoaWxkcmVuKG5vZGUpKTtcblxuICAgIGlmKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdQcm9maWxlIG5vdCBmb3VuZCcpO1xuICAgICAgICBkaXNwbGF5VXNlck5vdEZvdW5kKG5hbWUsIHByb2ZpbGVOYW1lKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHVzZXI6IFVzZXIgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgXG4gICAgc2V0QmFja2dyb3VuZCh1c2VyLm1lZGlhLm1haW4pO1xuICAgIHNldFByb2ZpbGVOYW1lKG5hbWUsIHVzZXIubmFtZSwgdXNlci5jbGFzcywgdXNlci5mYWN0aW9uKTtcbiAgICBzZXRBdmF0YXIoYXZhdGFyLCB1c2VyLm1lZGlhLmF2YXRhcik7XG4gICAgc2V0SXRlbUxldmVsKGl0ZW1MdmwsIHVzZXIuaXRlbV9sZXZlbCk7XG4gICAgc2V0UHJvZmlsZVRpdGxlKHByb2ZpbGVUaXRsZSwgdXNlcik7XG5cbiAgICBzZXRQdnBTdGF0aXN0aWNzKHVzZXIucHZwX3N0YXRpc3Rjcyk7XG5cbiAgICBzZXRDYXJkVmlzaWJpbGl0eSgpXG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlVc2VyTm90Rm91bmQobWVzc2FnZTogSFRNTEVsZW1lbnQsIHByb2ZpbGVOYW1lOiBzdHJpbmcpIHtcbiAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gYCR7cHJvZmlsZU5hbWV9IE5vdCBGb3VuZGA7XG4gICAgbWVzc2FnZS5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICBjb25zdCBjYXJkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NhcmQnKSBhcyBIVE1MQ29sbGVjdGlvbk9mPEhUTUxFbGVtZW50PjtcbiAgICBjYXJkc1swXS5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnIFxuICAgIGNhcmRzWzFdLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJyBcbn1cblxuZnVuY3Rpb24gc2V0QmFja2dyb3VuZCh1cmw6IHN0cmluZykge1xuICAgIGNvbnN0IGJhY2tncm91bmQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdiYWNrZ3JvdW5kJylbMF0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgYmFja2dyb3VuZC5zdHlsZVsnYmFja2dyb3VuZC1pbWFnZSddID0gYHVybCgke3VybH0pYFxufVxuXG5mdW5jdGlvbiBzZXRQcm9maWxlTmFtZShuYW1lOiBIVE1MRWxlbWVudCwgdXNlcm5hbWU6IHN0cmluZywgdXNlckNsYXNzOiBzdHJpbmcsIGZhY3Rpb246IHN0cmluZykge1xuICAgIG5hbWUudGV4dENvbnRlbnQgPSB1c2VybmFtZTtcbiAgICBuYW1lLnN0eWxlLmNvbG9yID0gY2xhc3NDb2xvcnMuZ2V0KHVzZXJDbGFzcykgPz8gJyNGRkZGRkYnO1xuXG4gICAgY29uc3QgbG9nbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGxvZ28uc3JjID0gZmFjdGlvbiA9PT0gJ0FsbGlhbmNlJyA/ICdhc3NldHMvTG9nby1hbGxpYW5jZS5wbmcnIDogJ2Fzc2V0cy9Mb2dvLWhvcmRlLnBuZyc7XG4gICAgbmFtZS5hcHBlbmRDaGlsZChsb2dvKVxufVxuXG5mdW5jdGlvbiBzZXRBdmF0YXIoYXZhdGFyOiBIVE1MRWxlbWVudCwgYXZhdGFyVXJsOiBzdHJpbmcpIHtcbiAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBpbWcuc3JjID0gYXZhdGFyVXJsO1xuICAgIGF2YXRhci5hcHBlbmRDaGlsZChpbWcpO1xufVxuXG5mdW5jdGlvbiBzZXRJdGVtTGV2ZWwoaXRlbUx2bDogSFRNTEVsZW1lbnQsIGxldmVsOiBudW1iZXIpIHtcbiAgICBpdGVtTHZsLnRleHRDb250ZW50ID0gYCR7bGV2ZWx9IElMVkxgXG59XG5cbmZ1bmN0aW9uIHNldFByb2ZpbGVUaXRsZShwcm9maWxlVGl0bGU6IEhUTUxFbGVtZW50LCB1c2VyOiBVc2VyKSB7XG4gICAgY29uc3QgZ3VpbGQgPSB1c2VyLmd1aWxkID8gYDwke3VzZXIuZ3VpbGR9PmAgOiAnJ1xuICAgIHByb2ZpbGVUaXRsZS50ZXh0Q29udGVudCA9IGAke3VzZXIubGV2ZWx9ICR7dXNlci5yYWNlfSAke3VzZXIuc3BlY30gJHt1c2VyLmNsYXNzfSAke2d1aWxkfSAke3VzZXIucmVhbG19YFxufVxuXG5mdW5jdGlvbiByZW1vdmVDaGlsZHJlbihub2RlOiBIVE1MRWxlbWVudCkge1xuICAgIHdoaWxlIChub2RlLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChub2RlLmxhc3RDaGlsZCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzZXRQdnBTdGF0aXN0aWNzKHB2cHN0YXRzOiBQVlBTdGF0aWNzKSB7XG4gICAgY29uc3QgdGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGFibGVcIik7XG4gICAgcmVtb3ZlQ2hpbGRyZW4odGFibGUpO1xuICAgIGNvbnN0IHRoZWFkID0gdGFibGUuY3JlYXRlVEhlYWQoKTtcbiAgICBjb25zdCBjb2xzID0gWycnLCAnQ3VycmVudCBSYXRpbmcnLCAnU2Vhc29uIEhpZ2gnLCAnSGlnaGVzdCBSYXRpbmcnXVxuICAgIGNvbnN0IGhlYWRlclJvdyA9IHRoZWFkLmluc2VydFJvdygpO1xuICAgIGNvbHMuZm9yRWFjaChjb2wgPT4ge1xuICAgICAgICBjb25zdCB0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RoJyk7XG4gICAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjb2wpO1xuICAgICAgICB0aC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgaGVhZGVyUm93LmFwcGVuZENoaWxkKHRoKTtcbiAgICB9KVxuXG4gICAgT2JqZWN0LmVudHJpZXMocHZwc3RhdHMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBjb25zdCByb3cgPSB0YWJsZS5pbnNlcnRSb3coKTtcbiAgICAgICAgaW5zZXJ0Q2VsbChyb3csIGtleSk7XG4gICAgICAgIGluc2VydENlbGwocm93LCB2YWx1ZS5jdXJyZW50X3JhdGluZyk7XG4gICAgICAgIGluc2VydENlbGwocm93LCB2YWx1ZS5zZWFzb25faGlnaGVzdF9yYXRpbmcpO1xuICAgICAgICBpbnNlcnRDZWxsKHJvdywgdmFsdWUuaGlnaGVzdF9yYXRpbmcpO1xuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGluc2VydENlbGwocm93OiBIVE1MVGFibGVSb3dFbGVtZW50LCBzdGF0OiBhbnkpIHtcbiAgICBjb25zdCBjZWxsID0gcm93Lmluc2VydENlbGwoKTtcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc3RhdCk7XG4gICAgY2VsbC5hcHBlbmRDaGlsZCh0ZXh0KVxufVxuXG5mdW5jdGlvbiBzZXRDYXJkVmlzaWJpbGl0eSgpOiB2b2lkIHtcbiAgICBjb25zdCBjYXJkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NhcmQnKTtcbiAgICBmb3IoY29uc3QgY2FyZCBvZiBjYXJkcykge1xuICAgICAgICAoY2FyZCBhcyBIVE1MRWxlbWVudCkuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJyBcbiAgICB9XG59XG5cblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGF1dG9jb21wbGV0ZSBmcm9tIFwiLi9zZXJ2aWNlcy9zZWFyY2hTZXJ2aWNlXCI7XG5cbihhc3luYyAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgYXV0b2NvbXBsZXRlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5wdXRcIikgYXMgSFRNTElucHV0RWxlbWVudCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgIH1cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6IiJ9