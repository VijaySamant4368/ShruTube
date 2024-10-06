// Save default values (No to all)
// var state = {
//     "shorts": "No",
//     "channels": "No",
//     "playlists": "No",
//     "videos": "No",
//     "shelfs": "No"
// };

const shorts = document.getElementById('shorts');
const channels = document.getElementById('channels');
const playlists = document.getElementById('playlists');
const videos = document.getElementById('videos');
const shelfs = document.getElementById('shelfs');

loadState().then(loadedState => {
    console.log("State after loading:", loadedState);
    for (const [key, value] of Object.entries(loadedState)) {
        console.log(key, ": ", value)
        if (key !== "message") {
            document.getElementById(key).checked = process(value);
        }
    }
}).catch(error => {
    console.error("Failed to load state:", error);
});



document.getElementById('submitBtn').addEventListener('click', () => {



    // Convert checkbox states to "Yes" or "No"
    const value1 = shorts.checked ? "Yes" : "No";
    const value2 = channels.checked ? "Yes" : "No";
    const value3 = playlists.checked ? "Yes" : "No";
    const value4 = videos.checked ? "Yes" : "No";
    const value5 = shelfs.checked ? "Yes" : "No";

    // Send a message to the active tab
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs.length > 0) {
            browser.tabs.sendMessage(tabs[0].id, { 
                message: "Checkbox values",
                shorts: value1,
                channels: value2,
                playlists: value3,
                videos: value4,
                shelfs: value5
            }).then(response => {
                console.log("Response from content script:", response.received.last_values);
                saveState(response.received.last_values)
            }).catch(error => {
                console.log("Error")
                console.error("Error receiving response:", error);
            });
        }
    });
});




function saveState(state) {
    // Save state to browser.storage
    browser.storage.sync.set({ extensionState: state })
        .then(() => {
            console.log("State saved.");
        })
        .catch((error) => {
            console.error("Error saving state:", error);
        });
}

function loadState() {
    console.log("Loading state...");
    // Load state from browser.storage
    return browser.storage.sync.get('extensionState')
        .then((result) => {
            console.log("State loaded...");
            if (result.extensionState) {
                console.log("Loaded state:", result.extensionState);
                return result.extensionState; // Return the loaded state
            } else {
                console.log("No saved state found.");
                return {
                    "shorts": "No",
                    "channels": "No",
                    "playlists": "No",
                    "videos": "No",
                    "shelfs": "No"
                };
            }
        })
        .catch((error) => {
            console.error("Error loading state:", error);
            // Return a default state in case of error
            return {
                "shorts": "No",
                "channels": "No",
                "playlists": "No",
                "videos": "No",
                "shelfs": "No"
            };
        });
}

function process(str)
{
    if (str === "Yes")
    {
        return true;
    }
    if (str === "No")
    {
        return false;
    }
}