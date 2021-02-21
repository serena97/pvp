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
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function getUser(profileName) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:8080/api/v1/eu/silvermoon/${profileName}`);
        if (!response.ok) {
            console.error('error');
        }
        const user = yield response.json();
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
    });
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
const profiles = ["Sudon", "Devzx", "Punchcanada", "Spookerino"];
autocomplete(document.getElementById("input"), profiles);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wdnAvLi9zcmMvdXNlci50cyIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHZwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wdnAvLi9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVDQSxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQztJQUN4QixDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUM7SUFDM0IsQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDO0lBQzNCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztJQUNwQixDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUM7SUFDckIsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDO0lBQ25CLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQztJQUNuQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7SUFDdEIsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDO0lBQ3JCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztJQUNwQixDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUM7SUFDckIsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDO0lBQ3RCLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQztDQUN6QixDQUFDO0FBRUssU0FBZSxPQUFPLENBQUMsV0FBbUI7OztRQUM3QyxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyw4Q0FBOEMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUUxRixJQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRTtZQUNiLE9BQU8sQ0FBQyxLQUFLLENB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LE9BQU8sRUFBRSxVQUFVLENBQUM7UUFDMUMsYUFBYSxFQUFFO0lBQ25CLENBQUMsQ0FBQztBQUNOLENBQUM7QUFFRCxNQUFNLFFBQVEsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ2pFLFlBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBcUIsRUFBRSxRQUFRLENBQUMsQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbnRlcmZhY2UgVXNlciB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICByZW5vd25fbGV2ZWw6IG51bWJlcjtcbiAgICBpdGVtX2xldmVsOiBzdHJpbmc7XG4gICAgbGV2ZWw6IG51bWJlcjtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgcmVhbG06IHN0cmluZztcbiAgICBmYWN0aW9uOiBzdHJpbmc7XG4gICAgY2xhc3M6IHN0cmluZztcbiAgICBjb3ZlbmFudDogc3RyaW5nO1xuICAgIGdlbmRlcjogc3RyaW5nO1xuICAgIHJhY2U6IHN0cmluZztcbiAgICBzcGVjOiBzdHJpbmc7XG4gICAgZ3VpbGQ6IHN0cmluZztcbiAgICBtZWRpYToge1xuICAgICAgICBhdmF0YXI6IHN0cmluZztcbiAgICAgICAgbWFpbjogc3RyaW5nO1xuICAgIH1cbiAgICBwdnBfc3RhdGlzdGNzOiBQVlBTdGF0aWNzXG59XG5cbmludGVyZmFjZSBQVlBTdGF0aWNzIHtcbiAgICBcIjJ2MlwiOiB7XG4gICAgICAgIGhpZ2hlc3RfcmF0aW5nOiBudW1iZXI7XG4gICAgICAgIGN1cnJlbnRfcmF0aW5nOiBudW1iZXI7XG4gICAgICAgIHNlYXNvbl9oaWdoZXN0X3JhdGluZzogbnVtYmVyO1xuICAgIH1cbiAgICBcIjN2M1wiOiB7XG4gICAgICAgIGhpZ2hlc3RfcmF0aW5nOiBudW1iZXI7XG4gICAgICAgIGN1cnJlbnRfcmF0aW5nOiBudW1iZXI7XG4gICAgICAgIHNlYXNvbl9oaWdoZXN0X3JhdGluZzogbnVtYmVyO1xuICAgIH1cbiAgICBcInJiZ1wiOiB7XG4gICAgICAgIGhpZ2hlc3RfcmF0aW5nOiBudW1iZXI7XG4gICAgICAgIGN1cnJlbnRfcmF0aW5nOiBudW1iZXI7XG4gICAgICAgIHNlYXNvbl9oaWdoZXN0X3JhdGluZzogbnVtYmVyO1xuICAgIH1cbn1cblxuY29uc3QgY2xhc3NDb2xvcnMgPSBuZXcgTWFwKFtcbiAgICBbJ0RlYXRoIEtuaWdodCcsICcjQzQxRTNBJ10sXG4gICAgWydEZW1vbiBIdW50ZXInLCAnI0EzMzBDOSddLFxuICAgIFsnRHJ1aWQnLCAnI0ZGN0MwQSddLFxuICAgIFsnSHVudGVyJywgJyNBQUQzNzInXSxcbiAgICBbJ01hZ2UnLCAnIzNGQzdFQiddLFxuICAgIFsnTW9uaycsICcjMDBGRjk4J10sXG4gICAgWydQYWxhZGluJywgJyNGNDhDQkEnXSxcbiAgICBbJ1ByaWVzdCcsICcjRkZGRkZGJ10sXG4gICAgWydSb2d1ZScsICcjRkZGNDY4J10sXG4gICAgWydTaGFtYW4nLCAnIzAwNzBERCddLFxuICAgIFsnV2FybG9jaycsICcjODc4OEVFJ10sXG4gICAgWydXYXJyaW9yJywgJyNDNjlCNkQnXSxcbl0pXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRVc2VyKHByb2ZpbGVOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjgwODAvYXBpL3YxL2V1L3NpbHZlcm1vb24vJHtwcm9maWxlTmFtZX1gKTtcblxuICAgIGlmKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvcicpO1xuICAgIH1cblxuICAgIGNvbnN0IHVzZXI6IFVzZXIgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgY29uc3QgY29sb3IgPSBjbGFzc0NvbG9ycy5nZXQodXNlci5jbGFzcykgPz8gJyNGRkZGRkYnO1xuICAgIFxuICAgIGNvbnN0IGJhY2tncm91bmQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdiYWNrZ3JvdW5kJylbMF0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgYmFja2dyb3VuZC5zdHlsZVsnYmFja2dyb3VuZC1pbWFnZSddID0gYHVybCgke3VzZXIubWVkaWEubWFpbn0pYFxuXG4gICAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYW1lJyk7XG4gICAgcmVtb3ZlQ2hpbGRyZW4obmFtZSk7XG5cbiAgICBuYW1lLnRleHRDb250ZW50ID0gdXNlci5uYW1lO1xuICAgIG5hbWUuc3R5bGUuY29sb3IgPSBjb2xvcjtcbiAgICBjb25zdCBsb2dvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgbG9nby5zcmMgPSB1c2VyLmZhY3Rpb24gPT09ICdBbGxpYW5jZScgPyAnYXNzZXRzL0xvZ28tYWxsaWFuY2UucG5nJyA6ICdhc3NldHMvTG9nby1ob3JkZS5wbmcnO1xuICAgIG5hbWUuYXBwZW5kQ2hpbGQobG9nbylcblxuICAgIGNvbnN0IGF2YXRhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdmF0YXInKTtcbiAgICByZW1vdmVDaGlsZHJlbihhdmF0YXIpO1xuICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGltZy5zcmMgPSB1c2VyLm1lZGlhLmF2YXRhcjtcbiAgICBhdmF0YXIuYXBwZW5kQ2hpbGQoaW1nKTtcblxuICAgIGNvbnN0IGl0ZW1MdmwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbS1sdmwnKTtcbiAgICBpdGVtTHZsLnRleHRDb250ZW50ID0gYCR7dXNlci5pdGVtX2xldmVsfSBJTFZMYFxuXG4gICAgY29uc3QgY2hhcmFjdGVyVGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhcmFjdGVyLXRpdGxlJyk7XG4gICAgY29uc3QgZ3VpbGQgPSB1c2VyLmd1aWxkID8gYDwke3VzZXIuZ3VpbGR9PmAgOiAnJ1xuICAgIGNoYXJhY3RlclRpdGxlLnRleHRDb250ZW50ID0gYCR7dXNlci5sZXZlbH0gJHt1c2VyLnJhY2V9ICR7dXNlci5zcGVjfSAke3VzZXIuY2xhc3N9ICR7Z3VpbGR9ICR7dXNlci5yZWFsbX1gXG5cbiAgICBnZXRQdnBTdGF0aXN0aWNzKHVzZXIucHZwX3N0YXRpc3Rjcyk7XG5cbiAgICBjb25zdCBjYXJkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NhcmQnKTtcbiAgICBmb3IoY29uc3QgY2FyZCBvZiBjYXJkcykge1xuICAgICAgICAoY2FyZCBhcyBIVE1MRWxlbWVudCkuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJyBcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNoaWxkcmVuKG5vZGU6IEhUTUxFbGVtZW50KSB7XG4gICAgd2hpbGUgKG5vZGUuZmlyc3RDaGlsZCkge1xuICAgICAgICBub2RlLnJlbW92ZUNoaWxkKG5vZGUubGFzdENoaWxkKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldFB2cFN0YXRpc3RpY3MocHZwc3RhdHM6IFBWUFN0YXRpY3MpIHtcbiAgICBjb25zdCB0YWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZVwiKTtcbiAgICByZW1vdmVDaGlsZHJlbih0YWJsZSk7XG4gICAgY29uc3QgdGhlYWQgPSB0YWJsZS5jcmVhdGVUSGVhZCgpO1xuICAgIGNvbnN0IGNvbHMgPSBbJycsICdDdXJyZW50IFJhdGluZycsICdTZWFzb24gSGlnaCcsICdIaWdoZXN0IFJhdGluZyddXG4gICAgY29uc3QgaGVhZGVyUm93ID0gdGhlYWQuaW5zZXJ0Um93KCk7XG4gICAgY29scy5mb3JFYWNoKGNvbCA9PiB7XG4gICAgICAgIGNvbnN0IHRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGgnKTtcbiAgICAgICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNvbCk7XG4gICAgICAgIHRoLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICBoZWFkZXJSb3cuYXBwZW5kQ2hpbGQodGgpO1xuICAgIH0pXG5cbiAgICBPYmplY3QuZW50cmllcyhwdnBzdGF0cykuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIGNvbnN0IHJvdyA9IHRhYmxlLmluc2VydFJvdygpO1xuICAgICAgICBpbnNlcnRDZWxsKHJvdywga2V5KTtcbiAgICAgICAgaW5zZXJ0Q2VsbChyb3csIHZhbHVlLmN1cnJlbnRfcmF0aW5nKTtcbiAgICAgICAgaW5zZXJ0Q2VsbChyb3csIHZhbHVlLnNlYXNvbl9oaWdoZXN0X3JhdGluZyk7XG4gICAgICAgIGluc2VydENlbGwocm93LCB2YWx1ZS5oaWdoZXN0X3JhdGluZyk7XG4gICAgfSlcbn1cblxuZnVuY3Rpb24gaW5zZXJ0Q2VsbChyb3c6IEhUTUxUYWJsZVJvd0VsZW1lbnQsIHN0YXQ6IGFueSkge1xuICAgIGNvbnN0IGNlbGwgPSByb3cuaW5zZXJ0Q2VsbCgpO1xuICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdGF0KTtcbiAgICBjZWxsLmFwcGVuZENoaWxkKHRleHQpXG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQge2dldFVzZXJ9IGZyb20gJy4vdXNlcic7XG5cbmZ1bmN0aW9uIGNsb3NlQWxsTGlzdHMoKSB7XG4gICAgY29uc3QgaXRlbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhdXRvY29tcGxldGUtaXRlbXMnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZW1zW2ldLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaXRlbXNbaV0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYXV0b2NvbXBsZXRlKGlucHV0OiBIVE1MSW5wdXRFbGVtZW50LCBhcnI6IHN0cmluZ1tdKSB7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgY2xvc2VBbGxMaXN0cygpO1xuXG4gICAgICAgIGNvbnN0IHR5cGVkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICBpZighdHlwZWRWYWx1ZSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGlzdC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmlkICsgXCJhdXRvY29tcGxldGUtbGlzdFwiKTtcbiAgICAgICAgbGlzdC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImF1dG9jb21wbGV0ZS1pdGVtc1wiKTtcbiAgICAgICAgdGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGxpc3QpO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmKGFycltpXS5zdWJzdHIoMCwgdHlwZWRWYWx1ZS5sZW5ndGgpLnRvVXBwZXJDYXNlKCkgPT09IHR5cGVkVmFsdWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGl0ZW0uaW5uZXJIVE1MID0gXCI8c3Ryb25nPlwiICsgYXJyW2ldLnN1YnN0cigwLCB0eXBlZFZhbHVlLmxlbmd0aCkgKyBcIjwvc3Ryb25nPlwiO1xuICAgICAgICAgICAgICAgIGl0ZW0uaW5uZXJIVE1MICs9IGFycltpXS5zdWJzdHIodHlwZWRWYWx1ZS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGl0ZW0uaW5uZXJIVE1MICs9IFwiPGlucHV0IHR5cGU9J2hpZGRlbicgdmFsdWU9J1wiICsgYXJyW2ldICsgXCInPlwiO1xuICAgICAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaXRlbSk7XG5cbiAgICAgICAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9ICh0aGlzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIikpWzBdLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBnZXRVc2VyKGlucHV0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VBbGxMaXN0cygpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjbG9zZUFsbExpc3RzKClcbiAgICB9KVxufVxuXG5jb25zdCBwcm9maWxlcyA9IFtcIlN1ZG9uXCIsIFwiRGV2enhcIiwgXCJQdW5jaGNhbmFkYVwiLCBcIlNwb29rZXJpbm9cIl07XG5hdXRvY29tcGxldGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnB1dFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50LCBwcm9maWxlcyk7XG4iXSwic291cmNlUm9vdCI6IiJ9