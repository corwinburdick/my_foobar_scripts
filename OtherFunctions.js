
var cuttedItems;
var cuttedItemsCount = 0;

function cut() {
	var activeList = plman.ActivePlaylist;
	cuttedItems = plman.GetPlaylistSelectedItems(activeList);
	cuttedItemsCount = cuttedItems.Count;
	plman.RemovePlaylistSelection(activeList);
}

function copy() {
	var activeList = plman.ActivePlaylist;
	cuttedItems = plman.GetPlaylistSelectedItems(activeList);
	cuttedItemsCount = cuttedItems.Count;
}

function paste() {
	var activeList = plman.ActivePlaylist;
	if (cuttedItemsCount) {
		if (plman.GetPlaylistSelectedItems(plman.ActivePlaylist).Count > 0) {
			plman.ClearPlaylistSelection(activeList);
			plman.InsertPlaylistItems(activeList, plman.GetPlaylistFocusItemIndex(activeList), cuttedItems, true);
		} else
			plman.InsertPlaylistItems(activeList, plman.PlaylistItemCount(activeList), cuttedItems, true);
		cuttedItemsCount = 0;
	}
}

function crop() {
	var activeList = plman.ActivePlaylist;
	var affectedItems = [];

	for (var i = 0; i < fb.PlaylistItemCount(activeList); i++) {
		if (!plman.IsPlaylistItemSelected(activeList, i)) {
			affectedItems.push(i);
		}
	}

	plman.ClearPlaylistSelection(activeList);
	plman.SetPlaylistSelection(activeList, affectedItems, true);
	plman.RemovePlaylistSelection(activeList);
}

//

var Shuffler = (function () {
	function fyshuffle(items) {
		for (var i = items.length - 1; i >= 1; --i) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = items[j];
			items[j] = items[i];
			items[i] = temp;
		}
	}

	function insert(spl, item, pos) {
		while (true) {
			while (pos >= spl.size) {
				pos = pos - spl.size;
			}
			if (spl.items[pos] === undefined) {
				spl.items[pos] = item;
				break;
			}
			pos = pos + 1;
		}
	}

	var Shuffler = function (size, spacing) {
		if (spacing === undefined) {
			spacing = 8;
		}

		this.size = size * spacing;
		this.items = new Array();
	}

	Shuffler.prototype.add = function (items) {
		var gap = this.size / items.length;
		var start = Math.floor(Math.random() * this.size);
		fyshuffle(items);
		for (var i = 0; i < items.length; ++i) {
			var pos = Math.floor(start + (i * gap) + Math.random() * Math.floor(gap * 2 / 3));
			insert(this, items[i], pos);
		}
	}

	Shuffler.prototype.finish = function () {
		var pl = new Array();
		for (var i = 0; i < this.size; ++i) {
			if (this.items[i] !== undefined) {
				pl.push(this.items[i]);
			}
		}
		this.items = new Array();
		return pl;
	}

	return Shuffler;
})();

function shuffleItems(items, groupFormat) {
	var tf = fb.TitleFormat(groupFormat);
	var groups = {};
	for (var i = 0; i < items.Count; ++i) {
		var item = items.Item(i);
		var groupKey = tf.EvalWithMetadb(item);
		if (groups[groupKey] === undefined) {
			groups[groupKey] = [];
		}
		groups[groupKey].push(item);
	}
	var spl = new Shuffler(items.Count);
	for (var groupKey in groups) {
		spl.add(groups[groupKey]);
	}
	var pl = spl.finish();
	for (var i = 0; i < items.Count; ++i) {
		items.Item(i) = pl[i];
	}
	tf.Dispose();
	return items;
}

function randOrd() {
	return (Math.round(Math.random()) - 0.5);
}


function selectAll() {
	var activeList = plman.ActivePlaylist;
	var playlistCount = plman.PlaylistCount;
	var playlistItemCount = plman.PlaylistItemCount(activeList);
	var selectedIndexes = [];

	for (var i = 0; i != playlistItemCount; i++) {
		selectedIndexes[i] = i;
	}
	plman.SetPlaylistSelection(fb.ActivePlaylist, selectedIndexes, true);
}

function invertSelection() {
	playlist = plman.ActivePlaylist;
	affectedItems = Array();

	for (var i = 0; i < fb.PlaylistItemCount(playlist); i++) {
		if (!plman.IsPlaylistItemSelected(playlist, i)) {
			affectedItems.push(i);
		}
	}

	plman.ClearPlaylistSelection(playlist);
	plman.SetPlaylistSelection(playlist, affectedItems, true);
}

