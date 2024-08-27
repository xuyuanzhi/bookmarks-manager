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
  //console.log(JSON.stringify(tree[0]));
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
		
		const spanItem = document.createElement('span');
		spanItem.textContent = node.url;
		spanItem.classList.add('url');
		
		const titleInp = document.createElement('input');
		titleInp.setAttribute('name','title');
		titleInp.setAttribute('value',node.title);
		titleInp.setAttribute('class','bm-input');
		
		const urlInp = document.createElement('input');
		urlInp.setAttribute('name','url');
		urlInp.setAttribute('value',node.url);
		urlInp.setAttribute('class','bm-input');
		
		const textItems = document.createElement('div');
		textItems.appendChild(aItem);
		textItems.appendChild(spanItem);
		textItems.appendChild(titleInp);
		textItems.appendChild(urlInp);
		textItems.setAttribute('class', 'link-text');
		
		const moveItem = document.createElement('button');
		moveItem.classList.add('btn');
		moveItem.classList.add('btn-move');
		moveItem.addEventListener('mousedown', startMoveBookmark);
		moveItem.addEventListener('mousemove', moveBookmark);
		moveItem.addEventListener('mouseup', endMoveBookmark);
		
		const editItem = document.createElement('button');
		editItem.classList.add('btn');
		editItem.classList.add('btn-edit');
		editItem.addEventListener('click', editBookmark);
		
		const delItem = document.createElement('button');
		delItem.classList.add('btn');
		delItem.classList.add('btn-delete');
		delItem.addEventListener('click', removeBookmark);
		
		const saveItem = document.createElement('button');
		saveItem.classList.add('btn');
		saveItem.classList.add('btn-save');
		saveItem.addEventListener('click', saveBookmark);
		
		const cancelItem = document.createElement('button');
		cancelItem.classList.add('btn');
		cancelItem.classList.add('btn-cancel');
		cancelItem.addEventListener('click', cancelEdit);
		
		const btns = document.createElement('div');
		btns.appendChild(moveItem);
		btns.appendChild(editItem);
		btns.appendChild(delItem);
		btns.appendChild(saveItem);
		btns.appendChild(cancelItem);
		btns.setAttribute('id', node.id);
		btns.setAttribute('class', 'link-btns');
		
		const divItem = document.createElement('div');
		divItem.appendChild(textItems);
		divItem.appendChild(btns);
		divItem.classList.add('link-div');
		//divItem.setAttribute('draggable', 'true');
		divItem.addEventListener('dragstart', function(event) {
			console.log("dragstart======" + event.target.id)
			event.dataTransfer.setData('text/plain', null); // You can use setData to set drag data if needed
		});
		divItem.addEventListener('dragend', function(event) {
			// Handle the dragend event if needed
			console.log('dragend===' + event.target.id);
			if (event.target.parentNode.classList.contains('border-line')) {
				event.target.parentNode.classList.remove('border-line');
			}
		});
		divItem.addEventListener('dragenter', function(event) {
			// Handle the dragend event if needed
			console.log('dragenter===' + event.target);
			if (!event.target.parentNode.classList.contains('border-line')) {
				event.target.parentNode.classList.add('border-line');
			}
		});
		divItem.addEventListener('dragleave', function(event) {
			// Handle the dragend event if needed
			console.log('dragleave===' + event.target);
			if (event.target.parentNode.classList.contains('border-line')) {
				event.target.parentNode.classList.remove('border-line');
			}
		});
		
		const listItem = document.createElement('li');
		listItem.appendChild(divItem);
		parentNode.appendChild(listItem);
    } else {
		const spanItem = document.createElement('span');
		spanItem.textContent = node.title;
		
		const divItem = document.createElement('div');
		divItem.appendChild(spanItem);
		
		if (isTop) {
			const iconItem = document.createElement('span');
			iconItem.classList.add('icon');
			iconItem.classList.add('icon-minus');
			divItem.appendChild(iconItem);
		
			divItem.classList.add('item-title');
			divItem.addEventListener('click', expandOrRetract);
		} else {
			divItem.classList.add('folder-div');
			
			const titleInp = document.createElement('input');
			titleInp.setAttribute('name','title');
			titleInp.setAttribute('value',node.title);
			titleInp.setAttribute('class','bm-input');
			
			const moveItem = document.createElement('button');
			moveItem.classList.add('btn');
			moveItem.classList.add('btn-move');
			
			const editItem = document.createElement('button');
			editItem.classList.add('btn');
			editItem.classList.add('btn-edit');
			editItem.addEventListener('click', editBookmark);
			
			const delItem = document.createElement('button');
			delItem.classList.add('btn');
			delItem.classList.add('btn-delete');
			delItem.addEventListener('click', removeBookmark);
			
			const saveItem = document.createElement('button');
			saveItem.classList.add('btn');
			saveItem.classList.add('btn-save');
			saveItem.addEventListener('click', saveBookmark);
			
			const cancelItem = document.createElement('button');
			cancelItem.classList.add('btn');
			cancelItem.classList.add('btn-cancel');
			cancelItem.addEventListener('click', cancelEdit);
			
			const btns = document.createElement('div');
			btns.appendChild(moveItem);
			btns.appendChild(editItem);
			btns.appendChild(delItem);
			btns.appendChild(saveItem);
			btns.appendChild(cancelItem);
			btns.setAttribute('id', node.id);
			btns.setAttribute('class', 'link-btns');
			
			divItem.appendChild(titleInp);
			divItem.appendChild(btns);
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

// Edit the bookmark
function editBookmark(e) {
	const id = e.target.parentNode.id;
	const textItem = e.target.parentNode.previousElementSibling;
	const divItem = textItem.parentNode;
	console.log('id====' + id);

	chrome.bookmarks.get(id, function(list) {
		let node = list[0];
		if (node) {
			if (!divItem.classList.contains('link-edit')) {
				divItem.classList.add('link-edit');
			}
		}
	});
}

function cancelEdit(e) {
	const divItem = e.target.parentNode.parentNode;
	if (divItem && divItem.classList.contains('link-edit')) {
		divItem.classList.remove('link-edit');
	}
}

function saveBookmark(e) {
	const id = e.target.parentNode.id;
	const textItem = e.target.parentNode.previousElementSibling;
	const newTitle = textItem.querySelectorAll('input[name="title"]')[0].value;
	const newUrl = textItem.querySelectorAll('input[name="url"]')[0].value;
	
	chrome.bookmarks.update(id, {title:newTitle, url:newUrl}, () => {
		location.reload(); // Refresh the popup
    });
}

// Remove the bookmark
function removeBookmark(e) {
	const id = e.target.parentNode.id;
	console.log('id====' + id);

	chrome.bookmarks.get(id, function(list) {
		let node = list[0];
		chrome.bookmarks.getChildren(id, (results) => {
			if (results && results.length > 0) {
				alert("Can't remove non-empty folder");
			} else if (node && confirm('Confirm to remove "' + node.title + '"?')) {
				chrome.bookmarks.remove(id, (results) => {
					location.reload();
				});
			}
		});
		
	});
}

function searchBookmarks(e) {
	const value = e.target.value;
	console.log('value===' + value);
	if (value === '') {
		location.reload();
	} else {
		chrome.bookmarks.search(value, (results) => {
			const bookmarkList = document.getElementById('bookmarkList');
			bookmarkList.innerHTML = '';
			
			const spanItem = document.createElement('span');
			spanItem.textContent = 'Search Results';
			
			const divItem = document.createElement('div');
			divItem.appendChild(spanItem);
			
			const iconItem = document.createElement('span');
			iconItem.classList.add('icon');
			iconItem.classList.add('icon-minus');
			divItem.appendChild(iconItem);
		
			divItem.classList.add('item-title');
			divItem.addEventListener('click', expandOrRetract);
			
			const liItem = document.createElement('li');
			liItem.appendChild(divItem);
			
			bookmarkList.appendChild(liItem);
			//console.log(JSON.stringify(tree[0]));
			
			if (results.length > 0) {
				const olItem = document.createElement('ol');
				liItem.appendChild(olItem);
				displayBookmarks(results, olItem, false);
			} else {
				const msgItem = document.createElement('p');
				msgItem.textContent = 'No Results';
				msgItem.setAttribute('class', 'error');
				liItem.appendChild(msgItem);
			}
		});
	}
}

var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;
var dragItem;

function startMoveBookmark(e) {
	initialX = e.clientX - xOffset;
  	initialY = e.clientY - yOffset;
 
 	console.log(e.target);
 	console.log("clientX===" + e.clientX);
 	console.log("clientY===" + e.clientY);
 	
	active = true;
	dragItem = e.target.parentNode.parentNode.parentNode;
	
	var rect = dragItem.getBoundingClientRect();
	
	
	console.log("left===" + rect.left);
 	console.log("top===" + rect.top);
	
	dragItem.style.position = 'absolute';
    dragItem.style.width = '100%';
    dragItem.style.left = (rect.left + window.scrollX) + 'px';
    dragItem.style.top = (rect.top + window.scrollY) + 'px';
}

function moveBookmark(e) {
	if (active) {
	    e.preventDefault();
	    
	    currentX = e.clientX - initialX;
	    currentY = e.clientY - initialY;
	    
	    dragItem.style.left = currentX + 'px';
	    dragItem.style.top = currentY + 'px';
  	}
}

function endMoveBookmark(e) {
	initialX = currentX;
  initialY = currentY;
  
  active = false;
}

// Add click event listeners to the buttons
//document.getElementById('addButton').addEventListener('click', addBookmark);
//document.getElementById('removeButton').addEventListener('click', removeBookmark);
//document.querySelectorAll('.btn-delete').forEach(function(item) {
//	item.addEventListener('click', removeBookmark);
//});
document.addEventListener('dragover', function(event) {
    event.preventDefault(); // Prevent default behavior to allow dropping
});
  
document.getElementById('keyword').addEventListener('input', searchBookmarks);

