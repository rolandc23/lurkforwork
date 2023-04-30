import { updateFeed } from "./feed.js";
import { getPosts } from "./posts.js";
import { clearDiv } from './clearDiv.js';
import { MAX_NUM_POSTS } from "./config.js";

/*
Handles the searching of a job
*/
export function searchJob() {
    clearDiv("feed");
    document.getElementById('feed').name = (0).toString();
    let searchText = document.getElementById("searchjobtext").value.toLowerCase().replace(/\s/g, '');
    for (let query = 0; query < MAX_NUM_POSTS; query += 5) {
        updateFeed(query).then(response => {
            if (response.length != 0) getPosts(response, "feed", false, query, searchText);
        })
    }
    document.getElementById("feed").classList.add('searching');
    document.getElementById("homeBtn").disabled = false;
}

/*
Checks if a job post qualifies for a search
*/
export function checkIfString() {
    if (document.getElementById('searchjobtext').value) {
        document.getElementById('searchjobbtn').disabled = false;
    } else {
        document.getElementById('searchjobbtn').disabled = true;
    }
}
