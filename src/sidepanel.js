// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Search the bookmarks when entering the search keyword.
// Get the bookmarks and display them in the popup
chrome.bookmarks.getTree((tree) => {
  const bookmarkList = document.getElementById('bookmarkList');
  console.log(JSON.stringify(tree[0]));
  displayBookmarks(tree[0].children, bookmarkList, true);
});

// Recursively display the bookmarks
function displayBookmarks(nodes, parentNode, isTop) {
  for (const node of nodes) {
    // If the node is a bookmark, create a list item and append it to the parent node
    if (node.url) {
		const aItem = document.createElement('a');
		aItem.textContent = node.title;
		aItem.href = node.url;
		aItem.target = "_blank";
		
		const listItem = document.createElement('li');
		listItem.appendChild(aItem);
		parentNode.appendChild(listItem);
    } else {
		const spanItem = document.createElement('span');
		spanItem.textContent = node.title;
		const iconItem = document.createElement('span');
		iconItem.classList.add('icon');
		iconItem.classList.add('icon-minus');
		const divItem = document.createElement('div');
		divItem.appendChild(spanItem);
		divItem.appendChild(iconItem);
		divItem.classList.add('item-title');
		
		if (isTop) {
			divItem.addEventListener('click', expandOrRetract);
		}
		
		const listItem = document.createElement('li');
		listItem.appendChild(divItem);
		parentNode.appendChild(listItem);
		
		// If the node has children, recursively display them
		if (node.children) {
		  const sublist = document.createElement('ol');
		  listItem.appendChild(sublist);
		  displayBookmarks(node.children, sublist, false);
		}
	}
  }
}

function expandOrRetract(e) {
	var divItem = e.target;
	var spanItem = e.target.getElementsByClassName('icon')[0];

	if (!spanItem) {
		divItem = e.target.parentNode;
		spanItem = e.target.parentNode.getElementsByClassName('icon')[0];
	}
	
	console.log("spanItem===" + spanItem);
	if (spanItem.classList.contains('icon-plus')) {
		spanItem.classList.remove('icon-plus');
		spanItem.classList.add('icon-minus');
		divItem.nextElementSibling.style.display = "block";
	} else {
		spanItem.classList.remove('icon-minus');
		spanItem.classList.add('icon-plus');
		divItem.nextElementSibling.style.display = "none";
	}
}

// Add a bookmark for www.google.com
function addBookmark() {
  chrome.bookmarks.create(
    {
      parentId: '1',
      title: 'Google',
      url: 'https://www.google.com'
    },
    () => {
      console.log('Bookmark added');
      location.reload(); // Refresh the popup
    }
  );
}

// Remove the bookmark for www.google.com
function removeBookmark() {
  chrome.bookmarks.search({ url: 'https://www.google.com/' }, (results) => {
    for (const result of results) {
      if (result.url === 'https://www.google.com/') {
        chrome.bookmarks.remove(result.id, () => {});
      }
    }
    location.reload();
  });
}

// Add click event listeners to the buttons
//document.getElementById('addButton').addEventListener('click', addBookmark);
//document.getElementById('removeButton').addEventListener('click', removeBookmark);