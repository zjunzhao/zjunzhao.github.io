(function () {
	"use strict";

	const posts = Array.isArray(window.BLOG_POSTS) ? window.BLOG_POSTS.slice() : [];
	const params = new URLSearchParams(window.location.search);
	const showHidden = params.get("show") === "hidden";
	const postList = document.getElementById("post-list");
	const searchInput = document.getElementById("post-search");

	const visiblePosts = posts
		.filter((post) => showHidden || !post.hidden)
		.sort((a, b) => b.date.localeCompare(a.date));

	function matchesSearch(post, query) {
		if (!query) {
			return true;
		}
		const haystack = [
			post.title,
			post.category,
			post.summary,
			...(post.tags || [])
		].join(" ").toLowerCase();
		return haystack.includes(query.toLowerCase());
	}

	function createPostItem(post) {
		const item = document.createElement("article");
		item.className = "post-item";

		const metaTags = (post.tags || [])
			.map((tag) => `<span class="tag">${tag}</span>`)
			.join("");
		const hiddenMarker = post.hidden ? '<span class="tag hidden-marker">Hidden</span>' : "";

		item.innerHTML = `
			<div class="post-date">${post.date}</div>
			<div>
				<h3 class="post-title"><a href="${post.href}">${post.title}</a></h3>
				<p class="post-summary">${post.summary}</p>
				<div class="post-meta">
					<span class="tag">${post.category}</span>
					${metaTags}
					${hiddenMarker}
				</div>
			</div>
		`;
		return item;
	}

	function renderPosts() {
		const query = searchInput.value.trim();
		const filteredPosts = visiblePosts.filter((post) => matchesSearch(post, query));

		postList.innerHTML = "";
		if (!filteredPosts.length) {
			const empty = document.createElement("p");
			empty.className = "empty-state";
			empty.textContent = "No posts match the current search.";
			postList.appendChild(empty);
			return;
		}

		filteredPosts.forEach((post) => {
			postList.appendChild(createPostItem(post));
		});
	}

	searchInput.addEventListener("input", renderPosts);
	renderPosts();
})();

