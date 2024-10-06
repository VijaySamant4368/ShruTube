// console.log("Content script loaded.");
var saved_values = {
    "shorts": "No",
    "channels": "No",
    "playlists": "No",
    "videos": "No",
    "shelfs": "No"
};




browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "Checkbox values") {
        // console.log("Received message: ", request.message);

        // Select all top-level ytd-shelf-renderer elements
        const topLevelShelves = document.querySelectorAll('ytd-shelf-renderer:not(ytd-shelf-renderer ytd-shelf-renderer)');
        // Log the results
        let shelfDictionary = {};
        topLevelShelves.forEach((shelf, index) => {
            // // console.log(`Top-Level Shelf ${index + 1}:`, shelf);
            shelfName = shelf.children[0].children[0].children[0].children[0].children[1].innerHTML;
            // // console.log(`Top-Level Shelf's child ${index + 1}:`, shelfName);
            shelfDictionary[shelfName] = shelf;
        });
        // // console.log(shelfDictionary);

        saved_values = request;
        // console.log(request)

        shrink(saved_values);

        // console.log("Hide shelfs: ", request.shelfs);
        // Select all shelf elements
        const shelfs = topLevelShelves;
        if (request.shelfs === "Yes")
        {
            // Hide each element
            shelfs.forEach(shelfs_elem => {
                shelfs_elem.style.display = 'none';
            });
        }
        else if (request.shelfs == "No")
        {
            // Show each element
            shelfs.forEach(shelfs_elem => {
                shelfs_elem.style.display = '';
            });
    
        }


        // Prepare a response
        // Convert the dictionary to JSON
        const jsonResponse = JSON.stringify(shelfDictionary);
        const response = {
            status: "Success",
            received: {
                last_values: saved_values
            }
        };

        // Send the response back to the popup
        sendResponse(response);
    }
});

function shrink(saved_values)
{
    // console.log("Hide shorts: ", saved_values.shorts);
    const shorts = document.querySelectorAll("ytd-reel-shelf-renderer");
    if (saved_values.shorts === "Yes")
        {
            // Hide each element
            shorts.forEach(short => {
                // // console.log(short)
                short.style.display = 'none';
            });
        }
        else if (saved_values.shorts == "No")
        {
            // Show each element
            shorts.forEach(short => {
                short.style.display = '';
            });

        }

    // console.log("Hide channels: ", saved_values.channels);
    // Select all channel elements
    const channels = document.querySelectorAll('[id="content-section"]');
    if (saved_values.channels === "Yes")
    {
        // Hide each element
        channels.forEach(channel => {
            channel.style.display = 'none';
        });
    }
    else if (saved_values.channels == "No")
    {
        // Show each element
        channels.forEach(channel => {
            channel.style.display = '';
        });

    }

    // console.log("Hide playlists: ", saved_values.playlists);
    // Select all channel elements
    const playlists = document.querySelectorAll("ytd-playlist-renderer");
    if (saved_values.playlists === "Yes")
    {
        // Hide each element
        playlists.forEach(playlist => {
            playlist.style.display = 'none';
        });
    }
    else if (saved_values.playlists == "No")
    {
        // Show each element
        playlists.forEach(playlist => {
            playlist.style.display = '';
        });

    }

    // console.log("Hide videos: ", saved_values.videos);
    // Select all channel elements
    const videos = document.querySelectorAll("ytd-video-renderer");
    if (saved_values.videos === "Yes")
    {
        // Hide each element
        videos.forEach(video => {
            video.style.display = 'none';
        });
    }
    else if (saved_values.videos == "No")
    {
        // Show each element
        videos.forEach(video => {
            video.style.display = '';
        });

    }

    // // console.log("Hide shelfs: ", request.shelfs);
    // // Select all shelf elements
    // const shelfs = document.querySelectorAll('ytd-shelf-renderer:not(ytd-shelf-renderer ytd-shelf-renderer)');
    // if (request.shelfs === "Yes")
    // {
    //     // Hide each element
    //     shelfs.forEach(shelfs_elem => {
    //         shelfs_elem.style.display = 'none';
    //     });
    // }
    // else if (request.shelfs == "No")
    // {
    //     // Show each element
    //     shelfs.forEach(shelfs_elem => {
    //         shelfs_elem.style.display = '';
    //     });

    // }

}



// Function to be called when changes are detected
function onChangeDetected() {
    // console.log("Changes detected in the ytd-two-column-search-results-renderer class.");
    // console.log(saved_values);

            shrink(saved_values);;

    
    // console.log("Changed")
}

// Store the last known state

// Function to check for changes
function checkForChanges() {
    const targetNode = document.getElementById('contents');

    if (targetNode) {
        const current_total_children = targetNode.innerHTML;
        let last_total_children = "";

        // console.log(last_total_children)
        // console.log(targetNode.childNodes[current_total_children - 1].childNodes[2].id === "ghost-cards")

        // Compare with the last known state
        if (current_total_children !== last_total_children) {
            // // console.log("Last total children: ", last_total_children)
            // console.log("Current children: ", current_total_children)
            last_total_children = current_total_children; // Update the last known state
            onChangeDetected(); // Call the function on change
        }
    } else {
        // console.log("Target node not found.");
    }
}

// Check every .5 seconds (500 milliseconds)
setInterval(checkForChanges, 500);
