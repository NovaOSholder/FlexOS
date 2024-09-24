var batteryLevel, winds = {}, rp, flwint = true, memory, _nowapp, fulsapp = false, nowappdo, appsHistory = [], nowwindow, appicns = {}, dev = true, appfound = 'files', fileslist = [], qsetscache = {};
var really = false, initmenuload = true, fileTypeAssociations = {}, Gtodo, notifLog = {}, initialization = false, onstartup = [];
var novaFeaturedImage = `Dev.png`;

document.getElementById("bgimage").src = novaFeaturedImage;
var defAppsList = [
	"camera",
	"clock",
	"media",
	"gallery",
	"browser",
	"studio",
	"calculator",
	"text",
	"store",
	"files",
	"settings",
];

gid("nowrunninapps").style.display = "none";

const rllog = console.log;
console.log = function (...args) {
	const stack = new Error().stack;
	const caller = stack.split('\n')[2].trim();
	const match = caller.match(/at (\S+)/);
	const source = match ? (match[1].startsWith('http') ? 'system' : match[1]) : 'anonymous';
	const style = 'font-size: 0.8em; color:grey;';
	rllog(`%c${source}\n`, style, ...args);
};

async function qsetsRefresh() {
	return await updateMemoryData();
}

gid('seprw-openb').onclick = function () {
	gid('searchside').style.flexGrow = 1;
}

Object.defineProperty(window, 'nowapp', {
	get() {
		return _nowapp;
	},
	set(value) {
		_nowapp = value;
		dewallblur()
	}
});

function loginscreenbackbtn() {
	document.getElementsByClassName("backbtnscont")[0].style.display = "none";
	document.getElementsByClassName("userselect")[0].style.flex = "1";
	document.getElementsByClassName("logincard")[0].style.flex = "0";
}

async function showloginmod() {
	closeElementedis();
	document.getElementsByClassName("backbtnscont")[0].style.display = "none";

	function createUserDivs(users) {
		const usersChooser = document.getElementById('userschooser');
		usersChooser.innerHTML = '';
		const defaultIcon = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="66" height="61" viewBox="0,0,66.9,61.3"><g transform="translate(-206.80919,-152.00164)"><g fill="#ffffff" stroke="none" stroke-miterlimit="10"><path d="M206.80919,213.33676c0,0 3.22013,-18.32949 21.37703,-24.2487c3.5206,-1.14773 5.89388,2.28939 12.33195,2.29893c6.51034,0.00899 8.33976,-3.45507 11.71219,-2.35934c18.01675,5.85379 21.54426,24.30912 21.54426,24.30912z" stroke-width="none"/><path d="M222.47948,169.52215c0,-9.67631 7.8442,-17.52052 17.52052,-17.52052c9.67631,0 17.52052,7.8442 17.52052,17.52052c0,9.67631 -7.8442,17.52052 -17.52052,17.52052c-9.67631,0 -17.52052,-7.8442 -17.52052,-17.52052z" stroke-width="0"/></g></g></svg>`

		users.forEach(async (cacusername) => {
			const userDiv = document.createElement('div');
			userDiv.className = 'user';
			userDiv.tabIndex = 0;
			const selectUser = async function () {

				try {
					navigator.registerProtocolHandler(
					'web+nova',
					`${location.origin}/?path=%s`,
					'NovaOS'
				);
			
				await cleanupram();
				CurrentUsername = cacusername;
				let isdefaultpass = false;

				try {
					isdefaultpass = await checkPassword('nova');
				} catch (err) {
					console.error("Password check failed:", err);
				}

				if (isdefaultpass) {
					console.log("Password check: good: ", password, isdefaultpass);
					gid('loginmod').close();
					gid('edison').showModal();

					startup();
				} else {
					console.log("Password check: bad: ", password, isdefaultpass);
					document.getElementsByClassName("backbtnscont")[0].style.display = "flex";
					document.getElementsByClassName("userselect")[0].style.flex = "0";
					document.getElementsByClassName("logincard")[0].style.flex = "1";
					gid("loginform1").focus();
					gid('loginmod').showModal()
				}
			} catch (err) {

			}
			};

			userDiv.addEventListener("click", selectUser);
			userDiv.addEventListener("touchstart", selectUser);

			userDiv.addEventListener("keydown", function (event) {
				if (event.key === "Enter") {
					selectUser();
				}
			});

			const img = document.createElement('span');
			img.className = 'icon';
			img.innerHTML = defaultIcon;

			const nameDiv = document.createElement('div');
			nameDiv.className = 'name';
			nameDiv.textContent = cacusername;

			userDiv.appendChild(img);
			userDiv.appendChild(nameDiv);
			usersChooser.appendChild(userDiv);
		});
	}

	let users = await getallusers();
	createUserDivs(users);

	if (users.length > 0) {
		document.querySelector('.user').focus();
	}
	const now = new Date();
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	document.getElementById('loginusselctime').textContent = `${hours}:${minutes}`;

	gid('loginmod').showModal();
	gid('loginform1').addEventListener("keydown", async function (event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			await checkifpassright();
		}
	});
}

function setsrtpprgbr(val) {
	let progressBar = document.getElementById('progress-bar');
	let width = val;
	progressBar.style.width = width + '%';
}

async function startup() {
	gid("edison").showModal();
	rllog(
		'You are using \n\n%cNovaOS%c\nNovaOS is the free, source-available, powerful and the cutest Web Operating system on the internet.',
		'color: white; background-color: #101010; font-size: 2rem; padding: 0.7rem 1rem; border-radius: 1rem;',
		'color: lightgrey; padding:0.5rem;'
	);

	setsrtpprgbr(50);
	const start = performance.now();
	await updateMemoryData().then(async () => {
		try {
			gid('startupterms').innerHTML = "Initialising...";
			updateTime();
			await checkdmode();
			setsrtpprgbr(100)
			gid('startupterms').innerHTML = "Startup completed";

		

		closeElementedis();
		async function fetchDataAndUpdate() {
			let localupdatedataver = localStorage.getItem("updver");
			let fetchupdatedata = await fetch("versions.json");

			if (fetchupdatedata.ok) {
				let fetchupdatedataver = (await fetchupdatedata.json()).osver;

				if (localupdatedataver !== fetchupdatedataver) {
					if (await justConfirm("Update default apps?", "Your default apps are old. Update them to access new features and fixes.")) {
						await installdefaultapps();
						startup();
					} else {
						say("You can always update app on settings app/Preferances")
					}
				}
			} else {
				console.error("Failed to fetch data from the server.");
			}
		}

		fetchDataAndUpdate();
		await genTaskBar();
		await dod();
		removeInvalidMagicStrings();
		setInterval(updateTime, 1000);

		// Initialize the associations from settings
		async function loadFileTypeAssociations() {
			const associations = await getSetting('fileTypeAssociations');
			fileTypeAssociations = associations || {};
			cleanupInvalidAssociations();
		}

		await loadFileTypeAssociations();

		try {
			function runScriptsSequentially(scripts, delay) {
				scripts.forEach((script, index) => {
					setTimeout(script, index * delay);
				});
			}
			runScriptsSequentially(onstartup, 1000)
		} catch (e) { }
		
		const end = performance.now();
		console.log(`Startup took ${(end - start).toFixed(2)}ms`);
	} catch (err) { console.error("startup error:", err); }
	})

}

document.addEventListener("DOMContentLoaded", async function () {
	console.log("DOMCL");
		
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('novaCrypt.js')
        .then(reg => console.log('Service Worker registered:', reg))
        .catch(err => console.error('Service Worker registration failed:', err));
}

	async function waitForNonNull() {
		const startTime = Date.now();
		const maxWaitTime = 3000;

		while (Date.now() - startTime < maxWaitTime) {
			const result = await updateMemoryData();

			if (result !== null) {
				return result;
			}
			console.log("No data: retrying")
			await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms before trying again
		}

		return null; // Return null if no non-null value is found within 3 seconds
	}

	waitForNonNull().then(async (result) => {
		console.log("Saved:", result);
		checkAndRunFromURL();
		gid('startupterms').innerHTML = "<span>Checking database...</span>";

		try {
			if (result || result == 3) {
				await showloginmod();
			} else {
				await say(`
                    <h2>Terms of service and License</h2>
                    <p>By using Nova OS, you agree to the <a href="https://github.com/adthoughtsglobal/Nova-OS/blob/main/Adthoughtsglobal%20Nova%20Terms%20of%20use">Adthoughtsglobal Nova Terms of Use</a>. 
                    <br><small>We do not store your personal information. <br>Read the terms before use.</small></p>
                `);
				initialiseOS();
			}
		} catch (error) {
			console.error('Error in database operations:', error);
		}
	})
		.catch(async (error) => {
			console.error('Error retrieving data from the database:', error);
			await showloginmod(); // Await in case `showloginmod` is async
		});
	var bgImage = document.getElementById("bgimage");

	bgImage.addEventListener("click", function () {
		nowapp = '';
		dewallblur();
	});
});

let timeFormat;
var condition = true;
try {
	qsetsRefresh()
	condition = getSetting("timefrmt") == '24 Hour' ? false : true;
} catch { }

function updateTime() {
	const now = new Date();
	let hours = now.getHours();
	if (condition) {
		// 12-hour format
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = (hours % 12) || 12;
		timeFormat = `${hours}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} ${ampm}`;
	} else {
		// 24-hour format
		timeFormat = `${hours.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
	}

	const date = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;

	gid('time-display').innerText = timeFormat;
	gid('date-display').innerText = date;
}
const jsonToDataURI = json => `data:application/json,${encodeURIComponent(JSON.stringify(json))}`;

async function openn() {
	const start = performance.now();
	gid("appsindeck").innerHTML = ``
	gid("strtsear").value = ""
	gid("strtappsugs").style.display = "none";

	let x = await getFileNamesByFolder("Apps");
	x.sort((a, b) => a.name.localeCompare(b.name));
	if (x.length == 0 && initmenuload) {
		initmenuload = false
		gid("appdmod").close()
		let choicetoreinst = await justConfirm(`Re-initialize OS?`, `Did the OS initialization fail? if yes, we can re-initialize your OS and install all the default apps. \n\nNovaOS did not find any apps while initial load of Nova Menu. \n\nre-initializing your OS may delete your data.`)
		if (choicetoreinst) {
			initialiseOS()
		}
		return;
	}

	initmenuload = false;
	Promise.all(x.map(async (app) => {
		// Create a div element for the app shortcut
		var appShortcutDiv = document.createElement("div");
		appShortcutDiv.className = "app-shortcut tooltip sizableuielement";
		appShortcutDiv.setAttribute("onclick", "openfile('" + app.id + "')");

		// Create a span element for the app icon
		var iconSpan = document.createElement("span");

		if (!appicns[app.id]) {
			// Fetch the content asynchronously using getFileById
			const content = await getFileById(app.id);

			// Unshrink the content
			const unshrunkContent = unshrinkbsf(content.content);

			// Use the getAppIcon function to fetch the icon
			const icon = await getAppIcon(unshrunkContent, app.id);

			if (icon) {
				iconSpan.innerHTML = icon;
			} else {
				iconSpan.innerHTML = defaultAppIcon;
			}
		} else {
			iconSpan.innerHTML = appicns[app.id];
		}

		function getapnme(x) {
			return x.split('.')[0];
		}

		// Create a span element for the app name
		var nameSpan = document.createElement("span");
		nameSpan.className = "appname";
		nameSpan.textContent = getapnme(app.name);

		var tooltisp = document.createElement("span");
		tooltisp.className = "tooltiptext";
		tooltisp.textContent = getapnme(app.name);

		// Append both spans to the app shortcut container
		appShortcutDiv.appendChild(iconSpan);
		appShortcutDiv.appendChild(nameSpan);
		appShortcutDiv.appendChild(tooltisp);

		gid("appsindeck").appendChild(appShortcutDiv);
	})).then(() => {
		const end = performance.now();

		console.log(`App Menu took ${(end - start).toFixed(2)}ms`);
	}).catch((error) => {
		console.error('An error occurred:', error);
	});
	if (gid("closeallwinsbtn").checked) {
		gid("closeallwinsbtn").checked = false;
	}
	if (!Object.keys(winds).length) {

		gid("closeallwinsbtn").checked = true;
		gid("closeallwinsbtn").setAttribute("disabled", true)
	} else {

		gid("closeallwinsbtn").setAttribute("disabled", false)
	}
	gid('appdmod').showModal()

	scaleUIElements(await getSetting("UISizing"))
}

async function loadrecentapps() {
	gid("serrecentapps").innerHTML = ``
	if (appsHistory.length < 1) {
		gid("partrecentapps").style.display = "none";
		gid("serrecentapps").innerHTML = `No recent apps`
		return;
	} else {
		gid("partrecentapps").style.display = "block";
	}
	let x = await getFileNamesByFolder("Apps");
	x.reverse();
	Promise.all(x.map(async (app) => {
		if (!appsHistory.includes(app.name)) {
			return
		}
		var appShortcutDiv = document.createElement("div");
		appShortcutDiv.className = "app-shortcut tooltip sizableuielement";
		appShortcutDiv.setAttribute("onclick", "openapp('" + app.name + "', '" + app.id + "')");
		var iconSpan = document.createElement("span");
		if (!appicns[app.id]) {
			const content = await getFileById(app.id);
			const unshrunkContent = unshrinkbsf(content.content);
			const tempElement = document.createElement('div');
			tempElement.innerHTML = unshrunkContent;
			const metaTags = tempElement.getElementsByTagName('meta');
			let metaTagData = null;
			Array.from(metaTags).forEach(tag => {
				const tagName = tag.getAttribute('name');
				const tagContent = tag.getAttribute('content');
				if (tagName === 'nova-icon' && tagContent) {
					metaTagData = tagContent;
				}
			});

			if (typeof metaTagData === "string") {
				if (containsSmallSVGElement(metaTagData)) {
					iconSpan.innerHTML = metaTagData;
				} else {

					iconSpan.innerHTML = defaultAppIcon;
				}
			} else {
				iconSpan.innerHTML = defaultAppIcon;
			}
			appicns[app.id] = iconSpan.innerHTML

		} else {
			iconSpan.innerHTML = appicns[app.id]
		}

		var nameSpan = document.createElement("span");
		nameSpan.className = "appname";
		nameSpan.textContent = basename(app.name);

		var tooltisp = document.createElement("span");
		tooltisp.className = "tooltiptext";
		tooltisp.textContent = basename(app.name);

		// Append both spans to the app shortcut container
		appShortcutDiv.appendChild(iconSpan);
		appShortcutDiv.appendChild(nameSpan);
		appShortcutDiv.appendChild(tooltisp);

		gid("serrecentapps").appendChild(appShortcutDiv);
	})).then(async () => {
		scaleUIElements(await getSetting("UISizing"))
	}).catch((error) => {
		console.error('An error occurred:', error);
	});
}

function focusFirstElement() {
	var firstElement = document.querySelector('#appsindeck :first-child');
	if (firstElement) {
		firstElement.focus();
	}
}

function makedefic(str) {
	const vowelPattern = /[aeiouAEIOU\s]+/g;
	const consonantPattern = /[^aeiouAEIOU\s]+/g;

	const vowelMatches = str.match(vowelPattern);
	const consonantMatches = str.match(consonantPattern);

	if (consonantMatches && consonantMatches.length >= 2) {
		const firstTwoConsonants = consonantMatches.slice(0, 2);
		const capitalized = firstTwoConsonants.map((letter, index) => index === 0 ? letter.toUpperCase() : letter.toLowerCase());
		const result = capitalized.join('');
		return result.length > 2 ? result.slice(0, 2) : result;
	} else {
		const firstLetter = str.charAt(0).toUpperCase();
		const firstConsonantIndex = str.search(consonantPattern);
		if (firstConsonantIndex !== -1) {
			const firstConsonant = str.charAt(firstConsonantIndex).toLowerCase();
			const result = firstLetter + firstConsonant;
			return result.length > 2 ? result.slice(0, 2) : result;
		} else {
			return firstLetter;
		}
	}
}
function updateBattery() {
	var batteryPromise;

	// Check if the battery API is supported
	if ('getBattery' in navigator) {
		batteryPromise = navigator.getBattery();
	} else if ('battery' in navigator) {
		batteryPromise = Promise.resolve(navigator.battery);
	} else {
		console.log('No Battery API');
		gid("batterydisdiv").style.display = "none";
		return;
	}

	batteryPromise.then(function (battery) {
		// Get the battery level
		var batteryLevel = Math.floor(battery.level * 100);
		var isCharging = battery.charging;

		// Display or hide the battery info based on conditions
		if ((batteryLevel === 100 && isCharging) || (batteryLevel === 0 && isCharging)) {
			document.getElementById("batterydisdiv").style.display = "none";
		} else {
			document.getElementById("batterydisdiv").style.display = "block";
		}

		// Determine the appropriate icon based on battery level
		let iconClass;
		if (batteryLevel >= 75) {
			iconClass = 'battery_full';
		} else if (batteryLevel >= 25) {
			iconClass = 'battery_5_bar';
		} else if (batteryLevel >= 15) {
			iconClass = 'battery_2_bar';
		} else {
			iconClass = 'battery_alert';
		}

		// Check if the value has changed
		var batteryDisplayElement = document.getElementById('battery-display');
		var batteryPDisplayElement = document.getElementById('battery-p-display');
		if (batteryDisplayElement && batteryPDisplayElement) {
			if (iconClass !== batteryDisplayElement.innerText) {
				// Update the display only if the value changes
				batteryDisplayElement.innerHTML = iconClass;
				batteryPDisplayElement.innerHTML = batteryLevel + "%";
			}
		}
	}).catch(function (error) {
		console.log("Battery Error: " + error);

	});
}
updateBattery();

navigator.getBattery().then(function (battery) {
	battery.addEventListener('levelchange', updateBattery);
});
async function dod() {
	let x;
	try {
		gid("desktop").innerHTML = ``;
		let y = await getFileNamesByFolder("Desktop");
		let dropZone = document.getElementById("desktop");
		dropZone.addEventListener('dragover', (event) => {
			event.preventDefault();
		});

		dropZone.addEventListener('drop', async (event) => {
			event.preventDefault();

			const unid = event.dataTransfer.getData("Text");
			await moveFileToFolder(unid, "Desktop/");
			//dod()
		});
		dropZone.addEventListener('dragend', (event) => {
			event.preventDefault();
		});
		y.forEach(async function (app) {
			// Create a div element for the app shortcut
			var appShortcutDiv = document.createElement("div");
			appShortcutDiv.className = "app-shortcut sizableuielement";
			appShortcutDiv.setAttribute("onclick", "openfile('" + app.id + "')");
			appShortcutDiv.setAttribute("unid", app.id);

			appShortcutDiv.setAttribute("draggable", true);
			appShortcutDiv.setAttribute("ondragstart", "dragfl(event, this)");

			// Create a span element for the app icon
			var iconSpan = document.createElement("span");

			// Fetch the content asynchronously using getFileById
			const content = await getFileById(app.id);

			// Unshrink the content
			const unshrunkContent = unshrinkbsf(content.content);

			// Create a temporary div to parse the content
			const tempElement = document.createElement('div');
			tempElement.innerHTML = unshrunkContent;

			// Get all meta tags
			const metaTags = tempElement.getElementsByTagName('meta');

			// Create an object to store meta tag data
			let metaTagData = null;

			// Iterate through meta tags and extract data
			Array.from(metaTags).forEach(tag => {
				const tagName = tag.getAttribute('name');
				const tagContent = tag.getAttribute('content');
				if (tagName === 'nova-icon' && tagContent) {
					metaTagData = tagContent;
				}
			});
			if (typeof metaTagData === "string") {
				if (containsSmallSVGElement(metaTagData)) {
					iconSpan.innerHTML = metaTagData;
				} else {

					iconSpan.innerHTML = `<span class="app-icon">` + makedefic(app.name) + `</span>`;
				}
			} else {
				iconSpan.innerHTML = `<span class="app-icon">` + makedefic(app.name) + `</span>`;
			}

			// Create a span element for the app name
			var nameSpan = document.createElement("span");
			nameSpan.className = "appname";
			nameSpan.textContent = app.name;

			// Append both spans to the app shortcut container
			appShortcutDiv.appendChild(iconSpan);
			appShortcutDiv.appendChild(nameSpan);

			gid("desktop").appendChild(appShortcutDiv);

		});
		x = await getFileById(await getSetting("wall"));
	} catch (error) {
		console.error(error)
		remSetting("wall");
	}

	if (x != undefined) {
		console.log("Setting custom wallpaper", x)
		let unshrinkbsfX = unshrinkbsf(x.content);
		document.getElementById('bgimage').src = unshrinkbsfX;
	}
	document.getElementById("bgimage").onerror = async function () {
		console.log("wallpaper error")
		document.getElementById("bgimage").src = novaFeaturedImage;
		if (await getSetting("wall")) {
			remSetting("wall");
		}
	};

	if (await getSetting("copilot")) {
		gid("copilotbtn").style.display = "";
	} else {
		gid("copilotbtn").style.display = "none";
	}

	scaleUIElements(await getSetting("UISizing"))
}

function closeElementedis() {
	var element = document.getElementById("edison");
	element.classList.add("closeEffect");

	setTimeout(function () {
		element.close()
		element.classList.remove("closeEffect");
	}, 500);
}

function isElement(element) {
	return element instanceof Element || element instanceof HTMLDocument;
}

function clwin(x) {

	if (isElement(x)) {
		delete winds[x.getAttribute("data-winds")];
		x.remove();
		return;
	}
	document.getElementById(x).classList.add("transp3")

	setTimeout(() => {
		document.getElementById(x).classList.remove("transp3")
		document.getElementById(x).remove();
		nowapp = '';
	}, 700);
}

function getMetaTagContent(unshrunkContent, metaName, decode = false) {
	const content = decode ? decodeBase64Content(unshrunkContent) : unshrunkContent;
	const tempElement = document.createElement('div');
	tempElement.innerHTML = content;
	const metaTag = Array.from(tempElement.getElementsByTagName('meta')).find(tag =>
		tag.getAttribute('name') === metaName && tag.getAttribute('content')
	);
	return metaTag ? metaTag.getAttribute('content') : null;
}

function getAppTheme(unshrunkContent) {
	return getMetaTagContent(unshrunkContent, 'theme-color');
}

function getAppAspectRatio(unshrunkContent) {
	return unshrunkContent.includes("aspect-ratio") ? getMetaTagContent(unshrunkContent, 'aspect-ratio') : null;
}

async function getAppIcon(unshrunkContent, appid, jff) {
    if (!appicns[appid] && appid && jff === "must") {
        const file = await getFileById(appid);
        return getAppIcon(file.content, appid);
    }
    if (jff && jff !== "must") return appicns[appid] || defaultAppIcon;
    if (appicns[appid]) return appicns[appid];

    const iconContent = getMetaTagContent(unshrunkContent, 'nova-icon', true);
    if (iconContent && containsSmallSVGElement(iconContent)) {
        appicns[appid] = iconContent;
        return iconContent;
    }

    return null;
}


function decodeBase64Content(str) {
	// Check if the string starts with a data URL prefix
	const base64Prefix = ';base64,';
	const prefixIndex = str.indexOf(base64Prefix);

	if (prefixIndex !== -1) {
		// Strip the prefix
		str = str.substring(prefixIndex + base64Prefix.length);
	}

	// Decode only if the string is a valid Base64
	return isBase64(str) ? atob(str) : str;
}

async function fetchData(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const data = await response.text();
		return data;
	} catch (error) {
		console.error("Error fetching data:", error.message);
		const data = "App Launcher: CRITICAL ERROR<br><br><sup>" + error.message + "</sup>";
		return data;
	}
}
var content;

function putwinontop(x) {
	if (Object.keys(winds).length > 1) {
		// Convert the values of winds into an array of numbers
		const windValues = Object.values(winds).map(Number);

		// Calculate the maximum value from the array
		const maxWindValue = Math.max(...windValues);

		// Set the zIndex
		document.getElementById(x).style.zIndex = maxWindValue + 1;
	} else {
		document.getElementById(x).style.zIndex = 0;
	}
}

function toTitleCase(str) {
	rp = str
	return str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
		return match.toUpperCase();
	});
}

function requestLocalFile() {
	var requestID = genUID()
	x = {
		"appname": "files",
		"type": "open",
		"identifier": requestID
	}
	localStorage.setItem("todo", JSON.stringify(x))
	openapp("files", 1)
}

function getMaxZIndex() {
	// Get the maximum z-index of all elements
	const elements = document.querySelectorAll('.window');
	let maxZIndex = 0;

	elements.forEach(element => {
		const zIndex = parseInt(window.getComputedStyle(element).zIndex);
		if (zIndex > maxZIndex) {
			maxZIndex = zIndex;
		}
	});
}

function genUID() {
	const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let randomString = '';
	for (let i = 0; i < 6; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		randomString += characters.charAt(randomIndex);
	}
	return randomString;
}

async function createFolder(folderNames, folderData) {
	try {
		await updateMemoryData();

		if (typeof folderNames === 'string') {
			folderNames = [folderNames];
		} else if (!(folderNames instanceof Set)) {
			throw new Error('folderNames should be a Set or a string');
		}

		// Convert Set to array if necessary
		folderNames = Array.isArray(folderNames) ? folderNames : [...folderNames];

		folderNames.forEach(folderName => {
			let parts = folderName.replace(/\/$/, '').split('/');
			let current = memory;

			parts.forEach(part => {
				part += '/';
				current[part] = current[part] || {};
				current = current[part];
			});
		});

		(function insertData(target, data) {
			for (let key in data) {
				if (typeof data[key] === 'object' && !data[key].id) {
					insertData(target[key + '/'] = target[key + '/'] || {}, data[key]);
				} else {
					target[key] = data[key];
				}
			}
		})(memory, folderData);

		await setdb(memory);
		console.log('Folders created successfully.');
	} catch (error) {
		console.error("Error creating folders and data:", error);
	}
}

function folderExists(folderName) {
	let parts = folderName.replace(/\/$/, '').split('/');
	let current = memory;

	for (let part of parts) {
		part += '/';
		if (!current[part]) {
			return false;
		}
		current = current[part];
	}

	return true;
}

function isBase64(str) {
	try {
		// Function to validate Base64 string
		function validateBase64(data) {
			// Ensure the string has the correct Base64 character set
			const base64Pattern = /^[A-Za-z0-9+/=]+$/;
			if (!base64Pattern.test(data)) {
				return false;
			}

			// Add padding if necessary
			const padding = data.length % 4;
			if (padding > 0) {
				data += '='.repeat(4 - padding);
			}

			// Attempt to decode the Base64 string
			atob(data);
			return true;
		}

		// Check without MIME type prefix
		if (validateBase64(str)) {
			return true;
		}

		// Check if the string starts with a MIME type prefix
		const base64Prefix = 'data:';
		const base64Delimiter = ';base64,';
		if (str.startsWith(base64Prefix)) {
			const delimiterIndex = str.indexOf(base64Delimiter);
			if (delimiterIndex !== -1) {
				const base64Data = str.substring(delimiterIndex + base64Delimiter.length);
				return validateBase64(base64Data);
			}
		}

		return false;
	} catch (err) {
		return false;
	}
}

async function createFile(folderName2, fileName, type, content, metadata = {}) {
	const folderName = folderName2.replace(/\/$/, '');
	const fileName2 = type ? `${fileName}.${type}` : fileName;

	if (!fileName2) {
		console.log("Cannot find file name. Can't create file.");
		return null;
	}

	await updateMemoryData();

	if (!folderExists(folderName)) {
		await createFolder(folderName);
	}

	const folder = createFolderStructure(folderName);

	try {
		let base64data = isBase64(content) ? content : '';

		if (!base64data) {
			// Create a Blob from the content
			const mimeType = type ? `application/${type}` : 'application/octet-stream';
			const blob = new Blob([content], { type: mimeType });

			// Create a URL for the Blob and convert to Base64
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = async function () {
				base64data = reader.result; // Use the full Data URL with prefix

				await handleFile(folder, folderName, fileName2, base64data, type, metadata);
			};
		} else {
			await handleFile(folder, folderName, fileName2, base64data, type, metadata);
		}
	} catch (error) {
		console.error("Error creating file:", error);
		return null;
	}

	// Helper function to handle file creation or update
	async function handleFile(folder, folderName, fileName2, base64data, type, metadata) {
		if (type === "app" && fileName2.endsWith(".app")) {
			console.log("Installing NovaOS Application");
			const appData = await getFileByPath(`Apps/${fileName2}`);
			if (appData) {
				await updateFile("Apps", appData.id, { metadata, content: base64data, fileName: fileName2, type });
				extractAndRegisterCapabilities(appData.id, base64data);
				return appData.id || null;
			}
		}

		const existingFile = Object.values(folder).find(file => file.fileName === fileName2);
		if (existingFile) {
			console.log(`Updating "${folderName}/${fileName2}"`);
			await updateFile(folderName, existingFile.id, { metadata, content: base64data, fileName: fileName2, type });
			return existingFile.id;
		} else {
			const uid = genUID();
			metadata.datetime = getfourthdimension();
			folder[fileName2] = { id: uid, type, content: base64data, metadata: JSON.stringify(metadata) };
			console.log(`Created "${folderName}/${fileName2}"`);
			if (type === "app" && fileName2.endsWith(".app")) {
				extractAndRegisterCapabilities(uid, base64data);
			}
			await setdb(memory);
			return uid;
		}
	}
}

async function extractAndRegisterCapabilities(appId, content) {
	try {
		if (!content) {
			content = await window.parent.getFileById(appId);
			content = content.content;
		}

		if (isBase64(content)) {
			content = decodeBase64Content(content);
		}

		let parser = new DOMParser();
		let doc = parser.parseFromString(content, "text/html");
		let metaTag = doc.querySelector('meta[name="capabilities"]');

		if (metaTag) {
			let capabilities = metaTag.getAttribute("content").split(',');
			await registerApp(appId, capabilities);
			console.log(`Registered capabilities: ${appId}`);
		} else {
			console.log(`No capabilities: ${appId}`);
		}
	} catch (error) {
		console.error("Error extracting and registering capabilities:", error);
	}
}

async function registerApp(appId, capabilities) {
	for (let fileType of capabilities) {
		if (!fileTypeAssociations[fileType]) {
			fileTypeAssociations[fileType] = [];
		}
		if (!fileTypeAssociations[fileType].includes(appId)) {
			fileTypeAssociations[fileType].push(appId);
		}
	}
	await setSetting('fileTypeAssociations', fileTypeAssociations);
}

async function cleanupInvalidAssociations() {
	const validAppIds = await getAllValidAppIds();

	for (let fileType in fileTypeAssociations) {
		fileTypeAssociations[fileType] = fileTypeAssociations[fileType].filter(appId => validAppIds.includes(appId));
		if (fileTypeAssociations[fileType].length === 0) {
			delete fileTypeAssociations[fileType];
		}
	}

	await setSetting('fileTypeAssociations', fileTypeAssociations);
	console.log('AFA cleanup completed');
}

async function getAllValidAppIds() {
	const appsFolder = await getFileNamesByFolder('Apps/');
	return Object.keys(appsFolder || {}).map(appFileName => appsFolder[appFileName].id);
}

function makedialogclosable(ok) {
	const myDialog = gid(ok);

	document.addEventListener('click', (event) => {
		if (event.target === myDialog) {
			myDialog.close();
		}
	});
}

makedialogclosable('appdmod');

function openModal(type, { title = '', message, options = null, status = null, preset = '' } = {}) {
	return new Promise((resolve) => {
		const modal = document.querySelector("#NaviconfDia");
		const h1 = modal.querySelector('h1');
		const p = modal.querySelector('p');
		const dropdown = modal.querySelector('.dropdown');
		const inputField = modal.querySelector('.input-field');
		const yesButton = modal.querySelector('.yes-button');
		const noButton = modal.querySelector('.notbn');

		// Reset modal
		h1.textContent = title;
		p.innerHTML = message;
		dropdown.style.display = 'none';
		inputField.style.display = 'none';
		noButton.style.display = 'none';
		yesButton.textContent = 'OK';

		// Customize based on type
		if (type === 'confirm') {
			noButton.style.display = 'inline-block';
			yesButton.textContent = 'Yes';
		} else if (type === 'dropdown') {
			dropdown.innerHTML = options.map(option => `<option value="${option}">${option}</option>`).join('');
			dropdown.style.display = 'block';
			noButton.style.display = 'inline-block';
		} else if (type === 'say' && status) {
			let ic = "warning";
			if (status === "success") ic = "check_circle";
			else if (status === "failed") ic = "dangerous";
			p.innerHTML = `<span class="material-symbols-rounded">${ic}</span> ${message}`;
		} else if (type === 'ask') {
			inputField.value = preset;
			inputField.style.display = 'block';
		}

		// Button actions
		yesButton.onclick = () => {
			modal.close();
			resolve(type === 'dropdown' ? dropdown.value : type === 'ask' ? inputField.value : true);
		};

		noButton.onclick = () => {
			modal.close();
			resolve(false);
		};

		modal.showModal();
	});
}

function justConfirm(title, message) {
	return openModal('confirm', { title, message });
}

function showDropdownModal(title, message, options) {
	return openModal('dropdown', { title, message, options });
}

function say(message, status = null) {
	return openModal('say', { message, status });
}

function ask(question, preset = '') {
	return openModal('ask', { message: question, preset });
}

async function loadtaskspanel() {
	let appbarelement = gid("nowrunninapps");
	appbarelement.innerHTML = "";

	if (Object.keys(winds).length == 0) {
		appbarelement.style.display = "none";
		return;
	}

	// Filter out keys for existing windows
	let validKeys = Object.keys(winds).filter(key => gid("window" + key.slice(-6)) !== null);
	let x = validKeys.map(key => key.slice(0, -6));
	let wid = validKeys.map(key => key.slice(-6));

	if (x.length === 0) {
		appbarelement.style.display = "none";
	} else {
		appbarelement.style.display = "flex";
	}

	x.forEach(async (app, index) => {
		let appShortcutDiv = document.createElement("biv");
		appShortcutDiv.className = "app-shortcut tooltip adock sizableuielement";

		appShortcutDiv.addEventListener("click", function () {
			putwinontop('window' + wid[index]);
			winds[app + wid[index]] = Number(gid("window" + wid[index]).style.zIndex);
			gid('window' + wid[index]).style.display = "flex";
		});

		let iconSpan = document.createElement("span");
		iconSpan.innerHTML = appicns[app] || defaultAppIcon;

		let tooltisp = document.createElement("span");
		tooltisp.className = "tooltiptext";
		tooltisp.innerText = basename(app);

		appShortcutDiv.appendChild(iconSpan);
		appShortcutDiv.appendChild(tooltisp);

		appbarelement.appendChild(appShortcutDiv);
	});
}
var dev;

function shrinkbsf(str) {
	return str;
}

function unshrinkbsf(compressedStr) {
	return compressedStr;
}

async function makewall(deid) {
	console.log("Wallpaper: " + deid)
	let x = await getFileById(deid);
	x = x.content
	x = unshrinkbsf(x)
	setSetting("wall", deid);
	document.getElementById('bgimage').style.backgroundImage = `url("` + x + `")`;
}

async function initialiseOS() {
	console.log("Setting Up NovaOS\n\nUsername: " + CurrentUsername + "\nWith: Sample preset\nUsing host: " + location.href)
	initialization = true
	const memory = {
		"Downloads/": {
			"Welcome.txt": {
				"id": "sibq81",
				"content": "Welcome to Nova OS! kindly reach us https://adthoughtsglobal.github.io and connect via the available options, we will respond you back! Enjoy!"
			},
			"Subfolder/": {
				"Subfile.txt": {
					"id": "1283jh",
					"content": "This is a file inside a subfolder."
				}
			}
		},
		"Apps/": {}
	};

	setdb(memory).then(async function () {
		await saveMagicStringInLocalStorage(password);
		await ensurePreferencesFileExists()
			.then(async () => await installdefaultapps())
			.then(async () => getFileNamesByFolder("Apps"))
			.then(async (fileNames) => {
				if (defAppsList.length !== fileNames.length) {
					setTimeout(installdefaultapps(), 3000);
					gid('startupterms').innerText = "Fixing problems..."
					return;
				}
			})
			.catch(error => {
				console.error("Error during initialization:", error);
			})
			.then(async () => {
				await startup();
				notify("Welcome to NovaOS, " + CurrentUsername + "!", "We really hope you would enjoy your NovaOS", "NovaOS")
				initialization = false;
			})
	})

}

async function installdefaultapps() {
	gid("edison").showModal()

	const maxRetries = 2;

	async function updateApp(appName, attempt = 1) {
		try {

			const filePath = "appdata/" + appName + ".html";
			const response = await fetch(filePath);
			if (!response.ok) {
				throw new Error("Failed to fetch file for " + appName);
			}
			const fileContent = await response.text();

			createFile("Apps", toTitleCase(appName), "app", fileContent);
		} catch (error) {
			console.error("Error updating " + appName + ":", error.message);
			if (attempt < maxRetries) {
				await updateApp(appName, attempt + 1);
			} else {
				console.error("Max retries reached for " + appName + ". Skipping update.");
			}
		}

	}

	async function waitForNonNull() {
		let result = null;
		while (result === null) {
			result = await updateMemoryData();
			if (result === null) {
				gid('startupterms').innerText = "Waiting for DB to open..."
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
		}
		return result;
	}

	await waitForNonNull().then(async (memory) => {
		// Update each app sequentially
		for (let i = 0; i < defAppsList.length; i++) {
			await updateApp(defAppsList[i]);
			if (gid('startupterms')) {
				gid('startupterms').innerText = "Installing Apps"
			}
			setsrtpprgbr(Math.round((i + 1) / defAppsList.length * 100));
		}
		let fetchupdatedata = await fetch("versions.json");

		if (fetchupdatedata.ok) {
			let fetchupdatedataver = (await fetchupdatedata.json()).osver;
			localStorage.setItem("updver", fetchupdatedataver);
		} else {
			console.error("Failed to fetch data from the server.");
		}

		if (!initialization) {
			closeElementedis();
		}
	})
}

function getfourthdimension() {
	const currentDate = new Date();
	return {
		year: currentDate.getFullYear(),
		month: currentDate.getMonth() + 1,
		day: currentDate.getDate(),
		hour: currentDate.getHours(),
		minute: currentDate.getMinutes(),
		second: currentDate.getSeconds()
	};
}

async function prepareArrayToSearch() {
	let arrayToSearch = [];

	function scanFolder(folderPath, folderContents) {
		for (let name in folderContents) {
			let fullPath = `${folderPath}${name}`;
			let item = folderContents[name];

			if (item.id) {
				if (mtpetxt(name) == "app") {
					name = basename(name)
				}
				arrayToSearch.push({ name, id: item.id, type: "file", path: folderPath });
			} else {
				arrayToSearch.push({ name: name, type: "folder", path: folderPath });
				scanFolder(fullPath, item);
			}
		}
	}

	for (const folder in memory) {
		scanFolder(folder, memory[folder]);
	}

	fileslist = arrayToSearch;
}

async function strtappse(event) {
	if (fileslist.length === 0) {
		await prepareArrayToSearch();
	}

	const searchValue = gid("strtsear").value.toLowerCase().trim();
	if (searchValue === "") return;

	const abracadra = await getSetting("smartsearch");

	let maxSimilarity = 0.5;
	let appToOpen = null;
	let mostRelevantItem = null;
	const itemsWithSimilarity = [];

	fileslist.forEach(item => {
		const itemName = item.name.toLowerCase();
		if (item.type !== "folder") {
			let similarity = abracadra ? calculateSimilarity(itemName, searchValue) : 0;
			if (!abracadra && itemName.startsWith(searchValue)) {
				similarity = 1;
			}

			if (similarity > maxSimilarity) {
				maxSimilarity = similarity;
				appToOpen = item;
			}

			if (similarity >= 0.2) {
				itemsWithSimilarity.push({ item, similarity });
			}
		}
	});

	if (event.key === "Enter") {
		event.preventDefault();

		if (searchValue === "i love nova") {
			gid("searchwindow").close();
			notify("hmm", "you're really goofy...", "Nova just replied you:");
			really = true;
			return;
		}

		if (appToOpen) {
			console.log(appToOpen);
			openfile(appToOpen.id);
		}
		return;
	}

	itemsWithSimilarity.sort((a, b) => b.similarity - a.similarity);

	// Group results by path
	const groupedResults = itemsWithSimilarity.reduce((acc, { item }) => {
		const path = item.path || '';
		if (!acc[path]) acc[path] = [];
		acc[path].push(item);
		return acc;
	}, {});

	// Clear previous search suggestions
	gid("strtappsugs").innerHTML = "";

	let elements = 0;

	Object.keys(groupedResults).forEach(path => {
		const items = groupedResults[path];
		const pathElement = document.createElement("div");
		pathElement.innerHTML = `<strong>${path}</strong>`;
		gid("strtappsugs").appendChild(pathElement);

		items.forEach(item => {
			if (!mostRelevantItem) mostRelevantItem = item;

			const newElement = document.createElement("div");
			newElement.innerHTML = `<div>${appicns[item.id] != undefined ? appicns[item.id] : defaultAppIcon} ${item.name}</div><span class="material-icons" onclick="openfile('${item.id}')">arrow_outward</span>`;
			gid("strtappsugs").appendChild(newElement);
			elements++;
		});
	});

	if (mostRelevantItem) {
		gid("partrecentapps").style.display = "none";
		document.getElementsByClassName("previewsside")[0].style.display = "flex";
		gid("seapppreview").style.display = "block";

		gid('seprw-icon').innerHTML = appicns[mostRelevantItem.id] != undefined ? appicns[mostRelevantItem.id] : defaultAppIcon;
		gid('seprw-appname').innerText = mostRelevantItem.name;
		gid('seprw-openb').onclick = function () {
			openfile(mostRelevantItem.id);
		};
	} else {
		gid("partrecentapps").style.display = "block";
		gid("seapppreview").style.display = "none";
	}

	gid("strtappsugs").style.display = elements > 0 ? "block" : "none";
}
function calculateSimilarity(string1, string2) {
	const m = string1.length;
	const n = string2.length;
	const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));

	for (let i = 0; i <= m; i++) {
		for (let j = 0; j <= n; j++) {
			if (i === 0) dp[i][j] = j;
			else if (j === 0) dp[i][j] = i;
			else if (string1[i - 1] === string2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
			else {
				const penalty = (i + j) / (m + n);
				dp[i][j] = 1 + Math.min(dp[i][j - 1], dp[i - 1][j], dp[i - 1][j - 1] + penalty);
			}
		}
	}

	return 1 - dp[m][n] / Math.max(m, n);
}

function containsSmallSVGElement(str) {
	var svgRegex = /^<svg\s*[^>]*>[\s\S]*<\/svg>$/i;
	return svgRegex.test(str) && str.length <= 5000;
}

document.onclick = hideMenu;
document.oncontextmenu = rightClick;

function hideMenu() {
	gid("contextMenu").style.display = "none"
}

function rightClick(e) {
	e.preventDefault();

	let menu = document.getElementById("contextMenu");

	if (menu.style.display === "block") {
		hideMenu();
	} else {
		menu.style.display = 'block';

		// Get the computed width and height of the context menu
		let menuWidth = menu.offsetWidth;
		let menuHeight = menu.offsetHeight;

		// Calculate the positions considering the viewport boundaries
		let posX = e.pageX;
		let posY = e.pageY;

		if ((posX + menuWidth) > window.innerWidth) {
			posX = window.innerWidth - menuWidth;
		}

		if ((posY + menuHeight) > window.innerHeight) {
			posY = window.innerHeight - menuHeight;
		}

		menu.style.left = posX + "px";
		menu.style.top = posY + "px";
	}
}

var dash = gid("dashboard");

function dashtoggle() {

	if (dash.open) {
		dash.close();
	} else {
		dash.showModal();
	}
}

document.addEventListener('click', (event) => {
	if (event.target === dash) {
		dash.close();
	}
});

async function dewallblur() {
	if (!await getSetting("focusMode")) {
		gid("bgimage").style.filter = "blur(0px)";
		return;
	}
	if (nowapp != "" && nowapp != undefined) {
		gid("bgimage").style.filter = "blur(5px)";
	} else {
		gid("bgimage").style.filter = "blur(0px)";
	}
}

let countdown, countdown2;

function startTimer(minutes) {
	document.getElementById("sleepbtns").style.display = "none";
	clearInterval(countdown);
	const now = Date.now();
	const then = now + minutes * 60 * 1000;
	displayTimeLeft(minutes * 60);
	countdown = setInterval(() => {
		const secondsLeft = Math.round((then - Date.now()) / 1000);
		if (secondsLeft <= 0) {
			clearInterval(countdown);
			document.getElementById('sleeptimer').textContent = '00:00';
			playBeeps();
			document.getElementById('sleepwindow').close()
			return;
		}

		displayTimeLeft(secondsLeft);
	}, 1000);
}

function playBeeps() {
	const context = new (window.AudioContext || window.webkitAudioContext)();
	const now = context.currentTime;
	const duration = 0.1; // Extended duration of each "bop" in seconds
	const fadeDuration = 0.02; // Fade in and out duration
	const gap = 0.1; // Gap between bops
	const pitch = 700; // Higher frequency (A5)
	const rhythm = [
		[0, 0.2, 0.4, 0.6],
		[1.2, 1.4, 1.6, 1.8],
		[2.4, 2.6, 2.8, 3.0]
	];
	
	const getOffsetTime = (index, time) => now + time + index * (4 * (duration + gap));
	
	rhythm.forEach((set, index) => {
		set.forEach(time => {
			const offsetTime = getOffsetTime(index, time);
			
			const oscillator = context.createOscillator();
			const gainNode = context.createGain();
	
			oscillator.type = 'triangle';
			oscillator.frequency.setValueAtTime(pitch, offsetTime);
			
			gainNode.gain.setValueAtTime(0, offsetTime);
			gainNode.gain.linearRampToValueAtTime(1, offsetTime + fadeDuration); // Fade in
			gainNode.gain.linearRampToValueAtTime(0, offsetTime + duration - fadeDuration); // Fade out
			
			oscillator.connect(gainNode);
			gainNode.connect(context.destination);
	
			oscillator.start(offsetTime);
			oscillator.stop(offsetTime + duration);
		});
	});
}

async function setMessage() {
	const message = await ask('What should be the message?', 'Do not disturb...');
	document.getElementById('sleepmessage').innerHTML = message;
}

function displayTimeLeft(seconds) {
	const minutes = Math.floor(seconds / 60);
	const remainderSeconds = seconds % 60;
	const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
	document.getElementById('sleeptimer').textContent = display;
}
function notify(title, description, appname) {
	if (document.getElementById("notification").style.display == "block") {
		document.getElementById("notification").style.display = "none";
		setTimeout(notify(title, description, appname), 500)
	}

	var appnameb = document.getElementById('notifappName');
	var descb = document.getElementById('notifappDesc');
	var titleb = document.getElementById('notifTitle');

	if (appnameb && descb && titleb) {
		appnameb.innerText = appname;
		descb.innerText = description;
		titleb.innerText = title;
		const windValues = Object.values(winds).map(Number);

		// Calculate the maximum value from the array
		const maxWindValue = Math.max(...windValues);

		// Set the zIndex
		document.getElementById("notification").style.zIndex = maxWindValue + 1;
		document.getElementById("notification").style.display = "block";
		setTimeout(function () {
			document.getElementById("notification").style.display = "none";
		}, 5000);
	} else {
		console.error("One or more DOM elements not found.");
	}
	const notificationID = genUID();
	notifLog[notificationID] = { title, description, appname };
}

function displayNotifications(x) {
	if (x == "clear") {
		notifLog = {};
	}
	const notifList = document.getElementById("notiflist");
	notifList.innerHTML = "";

	if (Object.values(notifLog).length == 0) {
		document.querySelector(".notiflist").style.display = "none";
	} else {
		document.querySelector(".notiflist").style.display = "block";
	}

	Object.values(notifLog).forEach(({ title, description, appname }) => {
		const notifDiv = document.createElement("div");
		notifDiv.className = "notification";

		const titleDiv = document.createElement("div");
		titleDiv.className = "notifTitle";
		titleDiv.innerText = title;

		const descDiv = document.createElement("div");
		descDiv.className = "notifDesc";
		descDiv.innerText = description;

		const appNameDiv = document.createElement("div");
		appNameDiv.className = "notifAppName";
		appNameDiv.innerText = appname;

		notifDiv.appendChild(appNameDiv);
		notifDiv.appendChild(titleDiv);
		notifDiv.appendChild(descDiv);
		notifList.appendChild(notifDiv);
	});
}

function runAsOSL(content) {
	const encodedContent = encodeURIComponent(content).replace(/'/g, "%27").replace(/"/g, "%22");
	const cont = `<iframe class="oslframe" src="https://origin.mistium.com/Versions/originv4.9.2.html?embed=${encodedContent}"></iframe>
	<style>
		.oslframe {
			width: 100%;
			height: 100%;
			border: none;
		}
	</style>`;
	openwindow("Nova OSL Runner", cont);
}
function runAsWasm(content) {
	const wasmBytes = new Uint8Array(content);

	const div = document.createElement('div');
	const script = document.createElement('script');
	script.innerHTML = `
		function greenflag() {
			const memory = new WebAssembly.Memory({ initial: 1 });
			const imports = { env: { memory: memory } };
			const wasmCode = new Uint8Array([${Array.from(wasmBytes)}]);

			WebAssembly.instantiate(wasmCode, imports)
				.then(obj => {
					console.log(obj.instance.exports.memory);
					// Additional code to execute the WebAssembly module as needed
				})
				.catch(err => console.error(err));
		}
	`;
	div.appendChild(script);
	openwindow("Nova Wasm Runner", div.innerHTML);
}
// hotkeys
document.addEventListener('keydown', function (event) {
	if (event.ctrlKey && (event.key === 'f' || event.keyCode === 70)) {
		event.preventDefault();
		openapp('files', 1);
	}
	if (event.ctrlKey && (event.key === 's')) {
		event.preventDefault();
		openapp('settings', 1);
	}
});
document.addEventListener('keydown', function (event) {
	if (event.key === 'Escape') {
		var appdmod = document.getElementById('appdmod');
		if (appdmod && appdmod.open) {
			appdmod.close();
		}
	}
});

document.addEventListener('keydown', function (event) {
	if (event.ctrlKey && event.key === '/') {
		event.preventDefault();
		opensearchpanel();
	}
});

document.addEventListener('keydown', function (event) {
	if (event.ctrlKey && event.key === ' ') {
		event.preventDefault();
		openn();
	}
});
async function genTaskBar() {
	var appbarelement = document.getElementById("dock")
	appbarelement.innerHTML = "<span id='taskbarloader'></span>";
	if (appbarelement) {
		/*if (!await getSetting("aiFeatures")) {
			gid("copilotbtn").style.display = "none";
		} else {
			gid("copilotbtn").style.display = "auto";
		}*/
		let dropZone = appbarelement;
		dropZone.addEventListener('dragover', (event) => {
			event.preventDefault();
		});

		dropZone.addEventListener('drop', async (event) => {
			event.preventDefault();

			const unid = event.dataTransfer.getData("Text");
			await moveFileToFolder(unid, "Dock/");
			genTaskBar();
		});

		dropZone.addEventListener('dragend', (event) => {
			event.preventDefault();
		});

		let x = await getFileNamesByFolder("Dock");
		if (Array.isArray(x) && x.length === 0) {
			const y = await getFileNamesByFolder("Apps");
			
			x = (await Promise.all(
				y.filter(item => 
					item.name === "Files.app" || 
					item.name === "Settings.app" || 
					item.name === "Store.app"
				)
			)).filter(Boolean);
		}
		
		x.forEach(async function (app, index) {
			index++
			var islnk = false;
			var appShortcutDiv = document.createElement("biv");

			appShortcutDiv.setAttribute("draggable", true);
			appShortcutDiv.setAttribute("ondragstart", "dragfl(event, this)");
			appShortcutDiv.setAttribute("unid", app.id || '');
			appShortcutDiv.className = "app-shortcut tooltip adock sizableuielement";
			app = await getFileById(app.id)

			if (app.type == "lnk") {
				let z = JSON.parse(app.content);
				app = await getFileById(z.open)
				islnk = true;
			}

			appShortcutDiv.setAttribute("onclick", "openfile('" + app.id + "')");
			var iconSpan = document.createElement("span");
			iconSpan.innerHTML = await getAppIcon(0, app.id, "must");

			var tooltisp = document.createElement("span");
			tooltisp.className = "tooltiptext";
			tooltisp.innerHTML = islnk ? basename(app.fileName) + `*` : basename(app.fileName);

			appShortcutDiv.appendChild(iconSpan);
			appShortcutDiv.appendChild(tooltisp);

			appbarelement.appendChild(appShortcutDiv);
		})
		gid('taskbarloader').remove()
	}
}

makedialogclosable('searchwindow');
prepareArrayToSearch()
async function opensearchpanel() {
	gid("seapppreview").style.display = "none";

	if (appsHistory.length > 0) {
		gid("partrecentapps").style.display = "block";
	} else {
		gid("partrecentapps").style.display = "none";
		document.querySelector(".previewsside").style.display = "none";
	}
	if (await getSetting("smartsearch")) {
		gid('searchiconthingy').style = `background: linear-gradient(-34deg, #79afff, #f66eff);opacity: 1; color: white;padding: 0.1rem 0.3rem; margin: 0.3rem; border-radius: 0.5rem;aspect-ratio: 1 / 1;display: grid;cursor: default; margin-right: 0.5rem;box-shadow: 0 0 6px inset #ffffff6b;`
	} else {
		gid('searchiconthingy').style = ``;
	}
	if (window.innerWidth > 500) {
		gid("strtsear").focus()
	}
	gid("strtsear").value = "";
	loadrecentapps();
	displayNotifications();
	gid('searchwindow').showModal();
	prepareArrayToSearch()
}

function mtpetxt(str) {
	if (!str) {
		return;
	}
	try {
		const parts = str.split('.');
		return parts.length > 1 ? parts.pop() : '';
	} catch (err) {
		console.error(err)
	}
}

function ptypext(str) {
	try {
		const parts = str.split('.');
		return parts.length > 1 ? parts.pop() : '';
	} catch { }
}

function getbaseflty(ext) {
	if (mtpetxt(ext) != '') {
		ext = mtpetxt(ext);
	}
	switch (ext) {
		case 'mp3':
		case 'mpeg':
		case 'wav':
		case 'flac':
			return 'music';

		case 'mp4':
		case 'avi':
		case 'mov':
		case 'mkv':
			return 'video';

		case 'jpg':
		case 'jpeg':
		case 'png':
		case 'gif':
		case 'bmp':
		case 'webp':
			return 'image';

		case 'txt':
		case 'doc':
		case 'docx':
		case 'pdf':
		case 'html':
			return 'document';

		case 'app':
			return 'app';

		case 'cpp':
		case 'py':
		case 'css':
		case 'js':
		case 'json':
			return 'code'

		case 'html':
			return 'webpage'

		default:
			return ext;
	}
}

function basename(str) {
	try {
		const parts = str.split('.');
		if (parts.length > 1) {
			parts.pop(); // Remove the extension
			return parts.join('.'); // Rejoin the remaining parts
		}
		return str; // No extension present
	} catch { }
}

function closeallwindows() {
	Object.keys(winds).forEach(key => {
		const taskId = key.slice(-6); // Extract the last 6 characters as the task ID

		const taskName = key.slice(0, -6); // Remove the last 6 characters from the key
		clwin("window" + taskId);
		delete winds[taskName + taskId];
	});
	gid("closeallwinsbtn").checked = true;
}

async function checkifpassright() {
	lethalpasswordtimes = true;
	var trypass = gid("loginform1").value;
	if (await checkPassword(trypass)) {
		gid('loginmod').close();
		password = trypass;
		lethalpasswordtimes = false;
		startup();
	} else {
		gid("loginform1").classList.add("thatsnotrightcls");
		gid("loginform1").value = '';
		setTimeout(function () {
			gid("loginform1").classList.remove("thatsnotrightcls");
		}, 1000)
	}
}

var chat;
function resetchat() {
	chat = [{ "role": "system", "content": "You are NovaOS Copilot Assistant. NovaOS is a web OS that lets your run html apps and manage a local filesystem. You cannot use newlines (\n)" }];
}
resetchat()

const nvacopilot = {
	message: function (content, role) {
		const messagesContainer = document.getElementById("nvacoplt-messages");

		const messageDiv = document.createElement("div");
		messageDiv.classList.add("usermsg");

		if (role === "bot") {
			messageDiv.classList.add("bot");
		}

		const navDiv = document.createElement("div");
		navDiv.classList.add("usermsg-nav");
		const icon = document.createElement("i");
		icon.classList.add("material-icons");
		icon.textContent = role === "bot" ? "auto_awesome" : "account_circle";
		navDiv.appendChild(icon);

		const contentDiv = document.createElement("div");
		contentDiv.classList.add("usermsg-content");
		contentDiv.innerHTML = markdownToHTML(content);

		messageDiv.appendChild(navDiv);
		messageDiv.appendChild(contentDiv);

		messagesContainer.appendChild(messageDiv);
		messagesContainer.scrollTop = messagesContainer.scrollHeight;
	}
};

nvacopilot.message("Hi there!", "user");
nvacopilot.message("Hello! How can I help you today?", "bot");

const sendMessage = () => {
	const messageInput = document.getElementById("nvacoplt-msginput");
	const messageContent = messageInput.value.trim();

	if (!messageContent) return;

	chat.push({ "role": "user", "content": messageContent });
	nvacopilot.message(messageContent, "user");
	messageInput.value = "";

	const payload = {
		messages: chat,
		model: 'novaOS'
	};

	fetch('https://api.milosantos.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			"Authorization": "Bearer ml_rulKTOnMNP5dT4ieX4CqyWhS"
		},
		body: JSON.stringify(payload),
	})
		.then(response => response.json())
		.then(data => {
			console.log(data);
			const responseMessage = data.choices[0].message.content;

			chat.push({ "role": "assistant", "content": responseMessage });
			nvacopilot.message(responseMessage, "bot");
			if (responseMessage.includes("simply") || (responseMessage.includes("can") && (responseMessage.includes("by")))) {

				nvacopilot.message("<small>Be aware following my instructions, i may make mistakes.</small>", "bot");
			}
		})
		.catch(error => {
			console.error('Error:', error);
			const errorMessage = 'Sorry, we are unable to provide this service at the moment.';

			chat.push({ "role": "assistant", "content": errorMessage });
			nvacopilot.message(errorMessage, "bot");
		});
};

document.getElementById("nvacoplt-msginput").addEventListener("keypress", e => {
	if (e.key === "Enter") sendMessage();
});
document.querySelector(".nvacoplt-sndbtn").addEventListener("click", sendMessage);

function markdownToHTML(markdown) {
	let html = markdown;

	html = html.replace(/(\*\*)(.*?)\1/g, '<strong>$2</strong>');

	html = html.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');

	html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
	html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
	html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

	html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

	html = html.replace(/^\s*[-+*] (.*$)/gim, '<li>$1</li>');

	html = html.replace(/```([^`]+)```/g, '<codeblock>$1</codeblock>');

	html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

	html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');

	html = html.replace(/  \n/g, '<br>');

	html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');

	return html.trim();
}

async function logoutofnova() {
	memory = null;
	password = 'nova';
	closeallwindows();
	await showloginmod();
	lethalpasswordtimes = true;
	loginscreenbackbtn();
	console.clear();
	console.log("logged out of " + CurrentUsername);
	CurrentUsername = null;
}

async function cleanupram() {
	closeallwindows();
	document.querySelectorAll('dialog[open].onramcloseable').forEach(dialog => dialog.close());
	memory = null;
	CurrentUsername = null;
	password = 'nova';
	MemoryTimeCache = null;
	lethalpasswordtimes = true;
}
async function setandinitnewuser() {
	gid("edison").showModal()
	await cleanupram();
	CurrentUsername = await ask("Enter a username:", "");
	await initialiseOS();
	gid('loginmod').close();
}

// MEMORY MANAGEMENT FUNCTIONS

async function getFileNamesByFolder(folderName) {
	try {
		const filesInFolder = [];

		for (const key in memory) {
			if (key === folderName || key.startsWith(folderName)) {
				const isFolder = key.endsWith('/');
				if (isFolder) {
					const folder = memory[key];
					for (const fileName in folder) {
						if (!fileName.endsWith('/')) {
							const file = folder[fileName];
							filesInFolder.push({ id: file.id, name: fileName });
						}
					}
				}
			}
		}

		return filesInFolder;
	} catch (error) {
		console.error("Error fetching data:", error);
		return null;
	}
}

async function getFileByPath(path) {
	await updateMemoryData();
	const segments = path.split('/');
	let current = memory;

	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];
		const isLastSegment = i === segments.length - 1;

		if (segment + '/' in current && !isLastSegment) {
			current = current[segment + '/'];
		} else if (segment in current && isLastSegment) {
			return current[segment];
		} else {
			return null;
		}
	}

	return current;
}

var idMap = {};

async function getFileById(id) {
	if (!id) return undefined;
	await updateMemoryData();

	if (idMap[id]) {
		return {
			path: idMap[id],
			...findFileDetails(id, memory)
		};
	}

	function findFileDetails(id, folder, currentPath = '') {
		for (let key in folder) {
			const item = folder[key];
			if (item && typeof item === 'object') {
				if (item.id === id) {
					idMap[id] = currentPath;
					return {
						fileName: key,
						id: item.id,
						content: item.content,
						metadata: item.metadata,
						path: currentPath
					};
				} else if (key.endsWith('/')) {
					const result = findFileDetails(id, item, currentPath + key);
					if (result) return result;
				}
			}
		}
		return null;
	}

	return findFileDetails(id, memory);
}

async function getFolderNames() {
	try {
		await updateMemoryData()
		const folderNames = [];

		for (const key in memory) {
			if (key.endsWith('/')) {
				folderNames.push(key);
			}
		}

		return folderNames;
	} catch (error) {
		console.error("Error fetching data:", error);
		return null;
	}
}

async function moveFileToFolder(flid, dest) {
	console.log("Moving file: " + flid + " to: " + dest);

	let fileToMove = await getFileById(flid);

	await createFile(dest, fileToMove.fileName, fileToMove.type, fileToMove.content, fileToMove.metadata);

	await remfile(flid);
}

async function remfile(ID) {
	try {
		await updateMemoryData();

		function removeFileFromFolder(folder) {
			for (const [name, content] of Object.entries(folder)) {
				if (name.endsWith('/')) {
					if (removeFileFromFolder(content)) return true;
				} else if (content.id === ID) {
					delete folder[name];
					console.log("File eliminated.");
					return true;
				}
			}
			return false;
		}

		let fileRemoved = removeFileFromFolder(memory);

		if (!fileRemoved) {
			console.error(`File with ID "${ID}" not found.`);
		} else {
			await setdb(memory);
		}
	} catch (error) {
		console.error("Error fetching or updating data:", error);
	}
}

async function remfolder(folderPath) {
	try {
		await updateMemoryData()

		// Split the folderPath into parts
		let parts = folderPath.split('/').filter(part => part);
		let current = memory;
		let parent = null;
		let key = null;

		// Traverse the path to find the folder
		for (let i = 0; i < parts.length; i++) {
			let part = parts[i] + '/';
			if (current.hasOwnProperty(part)) {
				parent = current;
				key = part;
				current = current[part];
			} else {
				console.error(`Folder "${folderPath}" not found.`);
				return;
			}
		}

		// Remove only the specified subfolder and its contents
		if (parent && key) {
			delete parent[key];
			console.log(`Folder Eliminated: "${folderPath}"`);
		} else {
			console.error(`Unable to delete folder "${folderPath}".`);
			return;
		}

		// Update the memory database
		await setdb(memory);
	} catch (error) {
		console.error("Error removing folder:", error);
	}
}
async function updateFile(folderName, fileId, newData) {
	function findFile(folder, fileId) {
		for (let key in folder) {
			if (typeof folder[key] === 'object' && folder[key] !== null) {
				if (folder[key].id === fileId) {
					return { parent: folder, key: key };
				} else if (key.endsWith('/') && typeof folder[key] === 'object') {
					let result = findFile(folder[key], fileId);
					if (result) {
						return result;
					}
				}
			}
		}
		return null;
	}

	try {
		// Locate the target folder
		let targetFolder = memory;
		let folderNames = folderName.split('/');
		for (let name of folderNames) {
			if (name) {
				targetFolder = targetFolder[name + '/'];
				if (!targetFolder) {
					throw new Error(`Folder "${name}" not found.`);
				}
			}
		}

		// Find the file within the folder structure
		let fileLocation = findFile(targetFolder, fileId);

		if (fileLocation) {
			let fileToUpdate = fileLocation.parent[fileLocation.key];
			fileToUpdate.metadata = newData.metadata !== undefined ? JSON.stringify(newData.metadata) : fileToUpdate.metadata;
			fileToUpdate.content = newData.content !== undefined ? newData.content : fileToUpdate.content;
			fileToUpdate.fileName = newData.fileName !== undefined ? newData.fileName : fileLocation.key;
			fileToUpdate.type = newData.type !== undefined ? newData.type : fileToUpdate.type;

			// If the file name has changed, update the key in the folder
			if (newData.fileName !== undefined && newData.fileName !== fileLocation.key) {
				fileLocation.parent[newData.fileName] = fileToUpdate;
				delete fileLocation.parent[fileLocation.key];
			}

			await setdb(memory);
			console.log(`Modified: "${fileToUpdate.fileName}"`);
		} else {
			console.log(`Creating New: "${fileId}"`);
			targetFolder[newData.fileName || `NewFile_${fileId}`] = {
				id: fileId,
				metadata: newData.metadata ? JSON.stringify(newData.metadata) : '',
				content: newData.content || '',
				type: newData.type || ''
			};
			await setdb(memory);
		}
	} catch (error) {
		console.error("Error updating file:", error);
	}
}

// Simulate creating a folder
function createFolderStructure(folderName) {
	let parts = folderName.split('/');
	let current = memory;
	for (let part of parts) {
		part += '/';
		if (!current[part]) {
			current[part] = {};
		}
		current = current[part];
	}
	return current;
}

function dragfl(ev, obj) {
	ev.dataTransfer.setData("Text", obj.getAttribute('unid'));
}
