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
async function getUser(profileName) {
    var _a;
    const response = await fetch(`http://localhost:8080/api/v1/eu/silvermoon/${profileName}`);
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
function autocomplete(input, arr) {
    input.addEventListener("input", function (e) {
        closeAllLists();
        const typedValue = this.value;
        if (!typedValue)
            return false;
        const list = document.createElement('div');
        list.setAttribute("id", this.id + "autocomplete-list");
        list.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(list);
        // if eli send me nothing, then UI display typed - realm
        // limit to 10 
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, typedValue.length).toUpperCase() === typedValue.toUpperCase()) {
                const item = document.createElement("div");
                item.innerHTML = "<strong>" + arr[i].substr(0, typedValue.length) + "</strong>";
                item.innerHTML += arr[i].substr(typedValue.length);
                item.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                list.appendChild(item);
                item.addEventListener('click', function (e) {
                    input.value = (this.getElementsByTagName("input"))[0].value;
                    (0,_user__WEBPACK_IMPORTED_MODULE_0__.getUser)(input.value);
                    closeAllLists();
                });
            }
        }
    });
    document.addEventListener('click', function (e) {
        closeAllLists();
    });
}
async function getRealms() {
    const response = await fetch(`https://a4cd39176248.ngrok.io/api/v1/realms`);
    if (!response.ok) {
        console.error('error');
    }
    const realms = await response.json();
    return realms.realms.map(realm => {
        return realm.name;
    });
}
(async () => {
    try {
        var profiles = await getRealms();
        autocomplete(document.getElementById("input"), profiles);
    }
    catch (e) {
        // Deal with the fact the chain failed
    }
})();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wdnAvLi9zcmMvdXNlci50cyIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHZwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wdnAvLi9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQXVDQSxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQztJQUN4QixDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUM7SUFDM0IsQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDO0lBQzNCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztJQUNwQixDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUM7SUFDckIsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDO0lBQ25CLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQztJQUNuQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7SUFDdEIsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDO0lBQ3JCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztJQUNwQixDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUM7SUFDckIsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDO0lBQ3RCLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQztDQUN6QixDQUFDO0FBRUssS0FBSyxVQUFVLE9BQU8sQ0FBQyxXQUFtQjs7SUFDN0MsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsOENBQThDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFFMUYsSUFBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUU7UUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLE9B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LFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO1FBQzFDLGFBQWEsRUFBRTtJQUNuQixDQUFDLENBQUM7QUFDTixDQUFDO0FBWUQsS0FBSyxVQUFVLFNBQVM7SUFDcEIsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsNkNBQTZDLENBQUMsQ0FBQztJQUM1RSxJQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRTtRQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDMUI7SUFFRCxNQUFNLE1BQU0sR0FBVyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUU3QyxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQzdCLE9BQU8sS0FBSyxDQUFDLElBQUk7SUFDckIsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUVELENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDUixJQUFJO1FBQ0EsSUFBSSxRQUFRLEdBQUcsTUFBTSxTQUFTLEVBQUUsQ0FBQztRQUNqQyxZQUFZLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQXFCLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDaEY7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNSLHNDQUFzQztLQUN6QztBQUNMLENBQUMsQ0FBQyxFQUFFLENBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW50ZXJmYWNlIFVzZXIge1xuICAgIGlkOiBudW1iZXI7XG4gICAgcmVub3duX2xldmVsOiBudW1iZXI7XG4gICAgaXRlbV9sZXZlbDogc3RyaW5nO1xuICAgIGxldmVsOiBudW1iZXI7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHJlYWxtOiBzdHJpbmc7XG4gICAgZmFjdGlvbjogc3RyaW5nO1xuICAgIGNsYXNzOiBzdHJpbmc7XG4gICAgY292ZW5hbnQ6IHN0cmluZztcbiAgICBnZW5kZXI6IHN0cmluZztcbiAgICByYWNlOiBzdHJpbmc7XG4gICAgc3BlYzogc3RyaW5nO1xuICAgIGd1aWxkOiBzdHJpbmc7XG4gICAgbWVkaWE6IHtcbiAgICAgICAgYXZhdGFyOiBzdHJpbmc7XG4gICAgICAgIG1haW46IHN0cmluZztcbiAgICB9XG4gICAgcHZwX3N0YXRpc3RjczogUFZQU3RhdGljc1xufVxuXG5pbnRlcmZhY2UgUFZQU3RhdGljcyB7XG4gICAgXCIydjJcIjoge1xuICAgICAgICBoaWdoZXN0X3JhdGluZzogbnVtYmVyO1xuICAgICAgICBjdXJyZW50X3JhdGluZzogbnVtYmVyO1xuICAgICAgICBzZWFzb25faGlnaGVzdF9yYXRpbmc6IG51bWJlcjtcbiAgICB9XG4gICAgXCIzdjNcIjoge1xuICAgICAgICBoaWdoZXN0X3JhdGluZzogbnVtYmVyO1xuICAgICAgICBjdXJyZW50X3JhdGluZzogbnVtYmVyO1xuICAgICAgICBzZWFzb25faGlnaGVzdF9yYXRpbmc6IG51bWJlcjtcbiAgICB9XG4gICAgXCJyYmdcIjoge1xuICAgICAgICBoaWdoZXN0X3JhdGluZzogbnVtYmVyO1xuICAgICAgICBjdXJyZW50X3JhdGluZzogbnVtYmVyO1xuICAgICAgICBzZWFzb25faGlnaGVzdF9yYXRpbmc6IG51bWJlcjtcbiAgICB9XG59XG5cbmNvbnN0IGNsYXNzQ29sb3JzID0gbmV3IE1hcChbXG4gICAgWydEZWF0aCBLbmlnaHQnLCAnI0M0MUUzQSddLFxuICAgIFsnRGVtb24gSHVudGVyJywgJyNBMzMwQzknXSxcbiAgICBbJ0RydWlkJywgJyNGRjdDMEEnXSxcbiAgICBbJ0h1bnRlcicsICcjQUFEMzcyJ10sXG4gICAgWydNYWdlJywgJyMzRkM3RUInXSxcbiAgICBbJ01vbmsnLCAnIzAwRkY5OCddLFxuICAgIFsnUGFsYWRpbicsICcjRjQ4Q0JBJ10sXG4gICAgWydQcmllc3QnLCAnI0ZGRkZGRiddLFxuICAgIFsnUm9ndWUnLCAnI0ZGRjQ2OCddLFxuICAgIFsnU2hhbWFuJywgJyMwMDcwREQnXSxcbiAgICBbJ1dhcmxvY2snLCAnIzg3ODhFRSddLFxuICAgIFsnV2FycmlvcicsICcjQzY5QjZEJ10sXG5dKVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VXNlcihwcm9maWxlTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaS92MS9ldS9zaWx2ZXJtb29uLyR7cHJvZmlsZU5hbWV9YCk7XG5cbiAgICBpZighcmVzcG9uc2Uub2spIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3InKTtcbiAgICB9XG5cbiAgICBjb25zdCB1c2VyOiBVc2VyID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIGNvbnN0IGNvbG9yID0gY2xhc3NDb2xvcnMuZ2V0KHVzZXIuY2xhc3MpID8/ICcjRkZGRkZGJztcbiAgICBcbiAgICBjb25zdCBiYWNrZ3JvdW5kID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYmFja2dyb3VuZCcpWzBdIGFzIEhUTUxFbGVtZW50O1xuICAgIGJhY2tncm91bmQuc3R5bGVbJ2JhY2tncm91bmQtaW1hZ2UnXSA9IGB1cmwoJHt1c2VyLm1lZGlhLm1haW59KWBcblxuICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmFtZScpO1xuICAgIHJlbW92ZUNoaWxkcmVuKG5hbWUpO1xuXG4gICAgbmFtZS50ZXh0Q29udGVudCA9IHVzZXIubmFtZTtcbiAgICBuYW1lLnN0eWxlLmNvbG9yID0gY29sb3I7XG4gICAgY29uc3QgbG9nbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGxvZ28uc3JjID0gdXNlci5mYWN0aW9uID09PSAnQWxsaWFuY2UnID8gJ2Fzc2V0cy9Mb2dvLWFsbGlhbmNlLnBuZycgOiAnYXNzZXRzL0xvZ28taG9yZGUucG5nJztcbiAgICBuYW1lLmFwcGVuZENoaWxkKGxvZ28pXG5cbiAgICBjb25zdCBhdmF0YXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXZhdGFyJyk7XG4gICAgcmVtb3ZlQ2hpbGRyZW4oYXZhdGFyKTtcbiAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBpbWcuc3JjID0gdXNlci5tZWRpYS5hdmF0YXI7XG4gICAgYXZhdGFyLmFwcGVuZENoaWxkKGltZyk7XG5cbiAgICBjb25zdCBpdGVtTHZsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW0tbHZsJyk7XG4gICAgaXRlbUx2bC50ZXh0Q29udGVudCA9IGAke3VzZXIuaXRlbV9sZXZlbH0gSUxWTGBcblxuICAgIGNvbnN0IGNoYXJhY3RlclRpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXJhY3Rlci10aXRsZScpO1xuICAgIGNvbnN0IGd1aWxkID0gdXNlci5ndWlsZCA/IGA8JHt1c2VyLmd1aWxkfT5gIDogJydcbiAgICBjaGFyYWN0ZXJUaXRsZS50ZXh0Q29udGVudCA9IGAke3VzZXIubGV2ZWx9ICR7dXNlci5yYWNlfSAke3VzZXIuc3BlY30gJHt1c2VyLmNsYXNzfSAke2d1aWxkfSAke3VzZXIucmVhbG19YFxuXG4gICAgZ2V0UHZwU3RhdGlzdGljcyh1c2VyLnB2cF9zdGF0aXN0Y3MpO1xuXG4gICAgY29uc3QgY2FyZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYXJkJyk7XG4gICAgZm9yKGNvbnN0IGNhcmQgb2YgY2FyZHMpIHtcbiAgICAgICAgKGNhcmQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZScgXG4gICAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVDaGlsZHJlbihub2RlOiBIVE1MRWxlbWVudCkge1xuICAgIHdoaWxlIChub2RlLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChub2RlLmxhc3RDaGlsZCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRQdnBTdGF0aXN0aWNzKHB2cHN0YXRzOiBQVlBTdGF0aWNzKSB7XG4gICAgY29uc3QgdGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGFibGVcIik7XG4gICAgcmVtb3ZlQ2hpbGRyZW4odGFibGUpO1xuICAgIGNvbnN0IHRoZWFkID0gdGFibGUuY3JlYXRlVEhlYWQoKTtcbiAgICBjb25zdCBjb2xzID0gWycnLCAnQ3VycmVudCBSYXRpbmcnLCAnU2Vhc29uIEhpZ2gnLCAnSGlnaGVzdCBSYXRpbmcnXVxuICAgIGNvbnN0IGhlYWRlclJvdyA9IHRoZWFkLmluc2VydFJvdygpO1xuICAgIGNvbHMuZm9yRWFjaChjb2wgPT4ge1xuICAgICAgICBjb25zdCB0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RoJyk7XG4gICAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjb2wpO1xuICAgICAgICB0aC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgaGVhZGVyUm93LmFwcGVuZENoaWxkKHRoKTtcbiAgICB9KVxuXG4gICAgT2JqZWN0LmVudHJpZXMocHZwc3RhdHMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBjb25zdCByb3cgPSB0YWJsZS5pbnNlcnRSb3coKTtcbiAgICAgICAgaW5zZXJ0Q2VsbChyb3csIGtleSk7XG4gICAgICAgIGluc2VydENlbGwocm93LCB2YWx1ZS5jdXJyZW50X3JhdGluZyk7XG4gICAgICAgIGluc2VydENlbGwocm93LCB2YWx1ZS5zZWFzb25faGlnaGVzdF9yYXRpbmcpO1xuICAgICAgICBpbnNlcnRDZWxsKHJvdywgdmFsdWUuaGlnaGVzdF9yYXRpbmcpO1xuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGluc2VydENlbGwocm93OiBIVE1MVGFibGVSb3dFbGVtZW50LCBzdGF0OiBhbnkpIHtcbiAgICBjb25zdCBjZWxsID0gcm93Lmluc2VydENlbGwoKTtcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc3RhdCk7XG4gICAgY2VsbC5hcHBlbmRDaGlsZCh0ZXh0KVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHtnZXRVc2VyfSBmcm9tICcuL3VzZXInO1xuXG5mdW5jdGlvbiBjbG9zZUFsbExpc3RzKCkge1xuICAgIGNvbnN0IGl0ZW1zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYXV0b2NvbXBsZXRlLWl0ZW1zJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVtc1tpXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGl0ZW1zW2ldKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGF1dG9jb21wbGV0ZShpbnB1dDogSFRNTElucHV0RWxlbWVudCwgYXJyOiBzdHJpbmdbXSkge1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGNsb3NlQWxsTGlzdHMoKTtcblxuICAgICAgICBjb25zdCB0eXBlZFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgICAgaWYoIXR5cGVkVmFsdWUpIHJldHVybiBmYWxzZTtcblxuICAgICAgICBjb25zdCBsaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGxpc3Quc2V0QXR0cmlidXRlKFwiaWRcIiwgdGhpcy5pZCArIFwiYXV0b2NvbXBsZXRlLWxpc3RcIik7XG4gICAgICAgIGxpc3Quc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJhdXRvY29tcGxldGUtaXRlbXNcIik7XG4gICAgICAgIHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChsaXN0KTtcblxuICAgICAgICAvLyBpZiBlbGkgc2VuZCBtZSBub3RoaW5nLCB0aGVuIFVJIGRpc3BsYXkgdHlwZWQgLSByZWFsbVxuICAgICAgICAvLyBsaW1pdCB0byAxMCBcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYoYXJyW2ldLnN1YnN0cigwLCB0eXBlZFZhbHVlLmxlbmd0aCkudG9VcHBlckNhc2UoKSA9PT0gdHlwZWRWYWx1ZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgaXRlbS5pbm5lckhUTUwgPSBcIjxzdHJvbmc+XCIgKyBhcnJbaV0uc3Vic3RyKDAsIHR5cGVkVmFsdWUubGVuZ3RoKSArIFwiPC9zdHJvbmc+XCI7XG4gICAgICAgICAgICAgICAgaXRlbS5pbm5lckhUTUwgKz0gYXJyW2ldLnN1YnN0cih0eXBlZFZhbHVlLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgaXRlbS5pbm5lckhUTUwgKz0gXCI8aW5wdXQgdHlwZT0naGlkZGVuJyB2YWx1ZT0nXCIgKyBhcnJbaV0gKyBcIic+XCI7XG4gICAgICAgICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChpdGVtKTtcblxuICAgICAgICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LnZhbHVlID0gKHRoaXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKSlbMF0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGdldFVzZXIoaW5wdXQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBjbG9zZUFsbExpc3RzKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNsb3NlQWxsTGlzdHMoKVxuICAgIH0pXG59XG5cbmludGVyZmFjZSBSZWFsbSB7XG4gICAgbmFtZTogc3RyaW5nXG4gICAgc2x1Zzogc3RyaW5nXG4gICAgcmVnaW9uOiBzdHJpbmdcbn1cblxuaW50ZXJmYWNlIFJlYWxtcyB7XG4gICAgcmVhbG1zOiBBcnJheTxSZWFsbT5cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0UmVhbG1zKCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2E0Y2QzOTE3NjI0OC5uZ3Jvay5pby9hcGkvdjEvcmVhbG1zYCk7XG4gICAgaWYoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVhbG1zOiBSZWFsbXMgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgXG4gICAgcmV0dXJuIHJlYWxtcy5yZWFsbXMubWFwKHJlYWxtID0+IHtcbiAgICAgICAgcmV0dXJuIHJlYWxtLm5hbWVcbiAgICB9KVxufVxuXG4oYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIHZhciBwcm9maWxlcyA9IGF3YWl0IGdldFJlYWxtcygpO1xuICAgICAgICBhdXRvY29tcGxldGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnB1dFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50LCBwcm9maWxlcyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBEZWFsIHdpdGggdGhlIGZhY3QgdGhlIGNoYWluIGZhaWxlZFxuICAgIH1cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6IiJ9