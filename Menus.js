
// Menus
function add_menu(x, y, metadb, flags) {
	var send = window.CreatePopupMenu();
	var list = window.CreatePopupMenu();
	var activeList = plman.ActivePlaylist;
	var isAutoPlaylist = fb.IsAutoPlaylist(activeList);
	var playlistCount = plman.PlaylistCount;
	var playlistId = 100;

	var sendToPlaylistId = playlistId + playlistCount + 1;
	send.AppendMenuItem(MF_STRING, sendToPlaylistId - 1, "Add to playback queue");
	send.AppendMenuItem(MF_STRING, sendToPlaylistId - 2, "Add to new playlist");
	var showPLL = false;
	for (var i = 0; i != playlistCount; i++) {
		if (!(fb.IsAutoPlaylist(i) || i == activeList || plman.GetPlaylistName(i).substr(0, 20) == "Playlist Selection [")) {
			!showPLL && send.AppendMenuSeparator();
			PlaylistItemCount = fb.PlaylistItemCount(i);
			send.AppendMenuItem(MF_STRING, sendToPlaylistId + i, "Add to " + fb.GetPlaylistName(i) + "\t" + (PlaylistItemCount == 0 ? "(empty)" : PlaylistItemCount > 1 ? "(" + PlaylistItemCount + " songs)" : "(" + PlaylistItemCount + " song)"));
			showPLL = true;
		}
	}
	//showPLL && list.AppendTo(send, MF_STRING | MF_POPUP, "Add to playlist");

	id = send.TrackPopupMenu(x, y, flags);
	switch (id) {
	case (sendToPlaylistId - 1):
		fb.RunContextCommandWithMetadb("Add to playback queue", metadb);
		break;
	case (sendToPlaylistId - 2):
		npl_type = 1;
		npl_files = metadb;
		g_dragR = false;
		g_dragR_metadb = null;
		NewPlaylistDialog = true;
		g_newPlaylist.inputbox.dblclk = false;
		g_newPlaylist.inputbox.edit = true;
		g_newPlaylist.inputbox.Cpos = g_newPlaylist.inputbox.GetCPos(x);
		g_newPlaylist.inputbox.anchor = g_newPlaylist.inputbox.Cpos;
		g_newPlaylist.inputbox.SelBegin = g_newPlaylist.inputbox.Cpos;
		g_newPlaylist.inputbox.SelEnd = g_newPlaylist.inputbox.Cpos;
		g_newPlaylist.inputbox.resetCursorTimer();
		window.Repaint();
		break;
	}

	for (var i = 0; i < plman.PlaylistCount; i++) {
		if (id == (sendToPlaylistId + i)) {
			plman.ClearPlaylistSelection(i);
			plman.InsertPlaylistItems(i, plman.PlaylistItemCount(i), metadb, select = true);
		}
	}

	send.Dispose();
	list.Dispose();
	return true;
}

function browser_menu(x, y) {
	var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

	var _menu = window.CreatePopupMenu();
	var Context = fb.CreateContextMenuManager();
	var playlistCount = fb.PlaylistCount;
	var activeList = plman.ActivePlaylist;
	var isAutoPlaylist = fb.IsAutoPlaylist(activeList);
	var selected = plman.GetPlaylistSelectedItems(plman.ActivePlaylist).Count;
	var selection = (selected > 1);

	var idx;

	var a = window.CreatePopupMenu();
	var nm_str = Array("Title", "Album Artist", "Album", "Date", "Genre", "Style", "Artist", "Composer", "Publisher", "Directory");
	var tf_str = Array("%title%", "%album artist%", "%album%", "%date%", "%genre%", "%style%", "%artist%", "%composer%", "%publisher%", "%directory%");
	var np_tag = [];

	var w = window.CreatePopupMenu();
	var lastfm = window.CreatePopupMenu();
	var google = window.CreatePopupMenu();
	var discogs = window.CreatePopupMenu();
	var allmusic = window.CreatePopupMenu();
	var other = window.CreatePopupMenu();
	var thisMetadb;

	// Context
	var check__ = g_browser.activeIndex;
	var showContextMenu = false;
	if (check__ > -1) {
		showContextMenu = true;

		ShiftKeyPressed && _menu.AppendMenuItem(MF_STRING, 1, "Refresh this image cache");
		//ShiftKeyPressed && _menu.AppendMenuSeparator();
		ShiftKeyPressed && lGroup != "Genres" && _menu.AppendMenuItem(ActiveX ? MF_STRING : MF_GRAYED | MF_DISABLED, 60, lGroup == "Artists" ? "Download artist artwork" : "Download album artwork");
		ShiftKeyPressed && _menu.AppendMenuSeparator();

		_menu.AppendMenuItem(isAutoPlaylist ? MF_DISABLED | MF_GRAYED : MF_STRING, 4, "Remove \tDelete");
		_menu.AppendMenuItem(!isAutoPlaylist ? MF_STRING : MF_GRAYED, 3, "Crop");
		_menu.AppendMenuSeparator();
		_menu.AppendMenuItem(!isAutoPlaylist ? MF_STRING : MF_GRAYED, 6, "Cut \tCtrl+X");
		_menu.AppendMenuItem(MF_STRING, 2, "Copy \tCtrl+C");
		_menu.AppendMenuItem(cuttedItemsCount && !isAutoPlaylist ? MF_STRING : MF_GRAYED, 7, "Paste \tCtrl+V");
		_menu.AppendMenuSeparator();

		Context.InitContext((utils.IsKeyPressed(VK_CONTROL) || utils.IsKeyPressed(VK_SHIFT)) ? plman.GetPlaylistSelectedItems(plman.ActivePlaylist) : g_browser.albums_draw[check__].pl);
		Context.BuildMenu(_menu, 100, -1);
		var temp_001 = window.SetTimeout(function () {
				on_mouse_move(x, y);
				window.ClearTimeout(temp_001);
			}, 10);
	} else {
		// check showList Tracks
		if (g_showlist.idx > -1) {
			if (g_showlist.columns[0]) {
				for (var r = 0; r < g_showlist.columns[0].rows.length; r++) {
					if (g_showlist.columns[0].rows[r].check("right", x, y)) {
						showContextMenu = true;

						_menu.AppendMenuItem(isAutoPlaylist ? MF_DISABLED | MF_GRAYED : MF_STRING, 5, "Remove \tDelete");
						_menu.AppendMenuItem((plman.GetPlaylistSelectedItems(activeList).Count > 0) && !isAutoPlaylist ? MF_STRING : MF_GRAYED, 3, "Crop");
						_menu.AppendMenuSeparator();
						_menu.AppendMenuItem((plman.GetPlaylistSelectedItems(activeList).Count > 0) && !isAutoPlaylist ? MF_STRING : MF_GRAYED, 6, "Cut \tCtrl+X");
						_menu.AppendMenuItem((plman.GetPlaylistSelectedItems(activeList).Count > 0) ? MF_STRING : MF_GRAYED, 2, "Copy \tCtrl+C");
						_menu.AppendMenuItem(cuttedItemsCount && !isAutoPlaylist ? MF_STRING : MF_GRAYED, 7, "Paste \tCtrl+V");
						_menu.AppendMenuSeparator();

						a.AppendTo(_menu, selection ? MF_DISABLED | MF_GRAYED : MF_STRING, "Autoplaylist");
						for (i = 0; i < nm_str.length; i++) {
							try {
								np_tag[i] = fb.TitleFormat(tf_str[i]).EvalWithMetadb(g_showlist.columns[0].rows[r].metadb);
								a.AppendMenuItem(np_tag[i] != "?" ? MF_STRING : MF_GRAYED | MF_DISABLED, 8 + i, "   " + nm_str[i] + ": " + (np_tag[i] != "?" ? np_tag[i] : "Unknown"));
							} catch (e) {
								fb.trace(e + ": Popup Menu Autoplaylist");
							}
						}

						thisMetadb = g_showlist.columns[0].rows[r].metadb;

						w.AppendTo(_menu, !selection && ActiveX ? MF_STRING : MF_DISABLED | MF_GRAYED, "Weblinks");
						lastfm.AppendTo(w, MF_STRING, "Lastfm");
						lastfm.AppendMenuItem(MF_STRING, 20, "Song");
						lastfm.AppendMenuItem(MF_STRING, 21, "Album");
						lastfm.AppendMenuItem(MF_STRING, 22, "Artist");
						lastfm.AppendMenuItem(MF_STRING, 23, "Group");
						lastfm.AppendMenuItem(MF_STRING, 24, "Images");
						lastfm.AppendMenuItem(MF_STRING, 25, "Events");
						lastfm.AppendMenuItem(MF_STRING, 26, "Search");
						google.AppendTo(w, MF_STRING, "Google");
						google.AppendMenuItem(MF_STRING, 30, "Artist");
						google.AppendMenuItem(MF_STRING, 31, "Album");
						google.AppendMenuItem(MF_STRING, 32, "Title");
						discogs.AppendTo(w, MF_STRING, "Discogs");
						discogs.AppendMenuItem(MF_STRING, 35, "Artist");
						discogs.AppendMenuItem(MF_STRING, 36, "Album");
						discogs.AppendMenuItem(MF_STRING, 37, "All");
						allmusic.AppendTo(w, MF_STRING, "Allmusic");
						allmusic.AppendMenuItem(MF_STRING, 40, "Artist");
						allmusic.AppendMenuItem(MF_STRING, 41, "Album");
						allmusic.AppendMenuItem(MF_STRING, 42, "Title");
						other.AppendTo(w, MF_STRING, "Other");
						other.AppendMenuItem(MF_STRING, 48, "eCover Album");
						other.AppendMenuItem(MF_STRING, 46, "MusicBrainz Artist");
						other.AppendMenuItem(MF_STRING, 45, "Wikipedia Artist");
						other.AppendMenuItem(MF_STRING, 47, "YouTube Artist");
						_menu.AppendMenuSeparator();

						Context.InitContext(plman.GetPlaylistSelectedItems(activeList));
						Context.BuildMenu(_menu, 100, -1);
						var temp_001 = window.SetTimeout(function () {
								on_mouse_move(x, y);
								window.ClearTimeout(temp_001);
							}, 10);
					}
				}
			}

		}

		if (!showContextMenu && cuttedItemsCount)
			_menu.AppendMenuItem(!isAutoPlaylist ? MF_STRING : MF_GRAYED, 7, "Paste \tCtrl+V");

	}

	//if (!showContextMenu) {
	//MenuFull(x, y);
	//return true;
	//}

	var ret = 0;
	ret = _menu.TrackPopupMenu(x, y);

	for (i = 0; i < nm_str.length; i++) {
		if (ret == 8 + i) {
			//np_tag[i] = fb.TitleFormat(tf_str[i]).EvalWithMetadb(g_metadb);
			fb.CreateAutoPlaylist(playlistCount, np_tag[i], tf_str[i] + " HAS " + np_tag[i], "", 0);
			fb.ActivePlaylist = playlistCount;
			fb.trace("Create autoplaylist for: " + np_tag[i]);
		}
	}

	switch (true) {
	case ret == 1:
		if (check__ > -1) {
			if (g_browser.albums_draw[check__].cover_img)
				g_browser.albums_draw[check__].cover_img.Dispose(); // = null;
			if (artistDisplay_v2) {
				if (lGroup == "Artists") {
					art_id = AlbumArtId.artist;
					utils.GetAlbumArtAsync(window.ID, g_browser.albums_draw[check__].metadb, art_id, true, false, false);
				} else if (lGroup == "Genres") {
					getGenreArt(metadb);
				} else if (lGroup == "Albums") {
					art_id = AlbumArtId.front;
					utils.GetAlbumArtAsync(window.ID, g_browser.albums_draw[check__].metadb, art_id, true, false, false);
				}
			} else {
				art_id = AlbumArtId.front;
				utils.GetAlbumArtAsync(window.ID, g_browser.albums_draw[check__].metadb, art_id, true, false, false);
			}
			g_browser.repaint();
		}
		break;
	case ret == 60:
		if (check__ > -1) {
			if (g_browser.albums_draw[check__].metadb) {
				if (artistDisplay_v2) {
					if (lGroup == "Albums") {
						downloadAlbum(fb.TitleFormat("%album artist%").EvalWithMetadb(g_browser.albums_draw[check__].metadb), fb.TitleFormat("%album%").EvalWithMetadb(g_browser.albums_draw[check__].metadb));
					} else if (lGroup == "Artists") {
						download(fb.TitleFormat("%album artist%").EvalWithMetadb(g_browser.albums_draw[check__].metadb));
					}
				} else {
					downloadAlbum(fb.TitleFormat("%album artist%").EvalWithMetadb(g_browser.albums_draw[check__].metadb), fb.TitleFormat("%album%").EvalWithMetadb(g_browser.albums_draw[check__].metadb));
				}
			}
			g_browser.repaint();
		}
		break;
	case ret == 2:
		if (check__ > -1) {
			// Select Tracks
			if (utils.IsKeyPressed(VK_CONTROL) || utils.IsKeyPressed(VK_SHIFT)) {}
			else {
				var playlist = g_browser.albums_draw[check__].pl;
				var selectedIndexes = [];
				plman.ClearPlaylistSelection(activeList);
				plman.SetPlaylistFocusItemByHandle(activeList, playlist.Item(0));
				for (var id = plman.GetPlaylistFocusItemIndex(activeList); id < (plman.GetPlaylistFocusItemIndex(activeList) + playlist.Count); id++) {
					selectedIndexes.push(id);
				}
				plman.SetPlaylistSelection(activeList, selectedIndexes, true);
				plman.SetPlaylistFocusItemByHandle(activeList, playlist.Item(0));
			}
			copy();
		} else
			copy();
		break;
	case ret == 3:
		if (check__ > -1) {
			// Select Tracks
			if (utils.IsKeyPressed(VK_CONTROL) || utils.IsKeyPressed(VK_SHIFT)) {}
			else {
				var playlist = g_browser.albums_draw[check__].pl;
				var selectedIndexes = [];
				plman.ClearPlaylistSelection(activeList);
				plman.SetPlaylistFocusItemByHandle(activeList, playlist.Item(0));
				for (var id = plman.GetPlaylistFocusItemIndex(activeList); id < (plman.GetPlaylistFocusItemIndex(activeList) + playlist.Count); id++) {
					selectedIndexes.push(id);
				}
				plman.SetPlaylistSelection(activeList, selectedIndexes, true);
				plman.SetPlaylistFocusItemByHandle(activeList, playlist.Item(0));
			}
			crop();
		} else
			crop();
		break;
	case ret == 4:
		// Select Tracks
		if (utils.IsKeyPressed(VK_CONTROL) || utils.IsKeyPressed(VK_SHIFT)) {}
		else {
			var playlist = g_browser.albums_draw[check__].pl;
			var selectedIndexes = [];
			plman.ClearPlaylistSelection(activeList);
			plman.SetPlaylistFocusItemByHandle(activeList, playlist.Item(0));
			for (var id = plman.GetPlaylistFocusItemIndex(activeList); id < (plman.GetPlaylistFocusItemIndex(activeList) + playlist.Count); id++) {
				selectedIndexes.push(id);
			}
			plman.SetPlaylistSelection(activeList, selectedIndexes, true);
			plman.SetPlaylistFocusItemByHandle(activeList, playlist.Item(0));
		}
		plman.RemovePlaylistSelection(activeList, false);
		plman.SetPlaylistSelectionSingle(activeList, plman.GetPlaylistFocusItemIndex(activeList), true);
		break;
	case ret == 5:
		if (!fb.IsAutoPlaylist(activeList)) {
			plman.RemovePlaylistSelection(activeList, false);
			plman.SetPlaylistSelectionSingle(activeList, plman.GetPlaylistFocusItemIndex(activeList), true);
		}
		break;
	case ret == 6:
		if (check__ > -1) {
			// Select Tracks
			var playlist = g_browser.albums_draw[check__].pl;
			var selectedIndexes = [];
			plman.ClearPlaylistSelection(activeList);
			plman.SetPlaylistFocusItemByHandle(activeList, playlist.Item(0));
			for (var id = plman.GetPlaylistFocusItemIndex(activeList); id < (plman.GetPlaylistFocusItemIndex(activeList) + playlist.Count); id++) {
				selectedIndexes.push(id);
			}
			plman.SetPlaylistSelection(activeList, selectedIndexes, true);
			plman.SetPlaylistFocusItemByHandle(activeList, playlist.Item(0));
			cut();
		} else
			cut();
		break;
	case ret == 7:
		paste();
		break;
	case ret == 20:
		try {
			WshShell.run("http://last.fm/music/" + encodeURIComponent(encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(thisMetadb)).replace(/%20/g, '+')) + "/_/" + encodeURIComponent(encodeURIComponent(fb.TitleFormat("%title%").EvalWithMetadb(thisMetadb)).replace(/%20/g, '+')));
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 21:
		try {
			WshShell.run("http://last.fm/music/" + encodeURIComponent(encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(thisMetadb)).replace(/%20/g, '+')) + "/" + encodeURIComponent(encodeURIComponent(fb.TitleFormat("%album%").EvalWithMetadb(thisMetadb)).replace(/%20/g, '+')));
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 22:
		try {
			WshShell.run("http://last.fm/music/" + encodeURIComponent(encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(thisMetadb))).replace(/%20/g, '+'));
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 23:
		try {
			WshShell.run("http://www.last.fm/community/groups/search?q=" + encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(thisMetadb)).replace(/%20/g, '+'));
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 24:
		try {
			WshShell.run("http://last.fm/music/" + encodeURIComponent(encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(thisMetadb)).replace(/%20/g, '+')) + "/+images");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 25:
		try {
			WshShell.run("http://www.last.fm/events/search?q=" + encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(thisMetadb)).replace(/%20/g, '+'));
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 26:
		try {
			WshShell.run("http://www.last.fm/search?q=" + encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(thisMetadb)).replace(/%20/g, '+') + "&type=all");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 30:
		try {
			WshShell.run("http://www.google.com/search?q=" + encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(thisMetadb)).replace(/%20/g, '+') + "&ie=utf-8");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 31:
		try {
			WshShell.run("http://www.google.com/search?q=" + encodeURIComponent(fb.TitleFormat("%artist% %album%").EvalWithMetadb(thisMetadb)).replace(/%20/g, '+') + "&ie=utf-8");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 32:
		try {
			WshShell.run("http://www.google.com/search?q=" + encodeURIComponent(fb.TitleFormat("%artist% %title%").EvalWithMetadb(thisMetadb)).replace(/%20/g, '+') + "&ie=utf-8");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 35:
		try {
			WshShell.run("http://www.discogs.com/search?q=" + encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(thisMetadb)).replace(/%20/g, '+') + "&type=artist");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 36:
		try {
			WshShell.run("http://www.discogs.com/search?q=" + encodeURIComponent(fb.TitleFormat("%album%").EvalWithMetadb(thisMetadb)).replace(/%20/g, '+') + "&type=release");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 37:
		try {
			WshShell.run("http://www.discogs.com/search?q=" + encodeURIComponent(fb.TitleFormat("%artist% %album%").EvalWithMetadb(thisMetadb)).replace(/%20/g, '+') + "&type=all");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 40:
		try {
			WshShell.run("http://www.allmusic.com/search/artist/" + encodeURIComponent(fb.TitleFormat("$ascii(%artist%)").EvalWithMetadb(thisMetadb)));
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 41:
		try {
			WshShell.run("http://www.allmusic.com/search/album/" + encodeURIComponent(fb.TitleFormat("$ascii(%album%)").EvalWithMetadb(thisMetadb)));
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 42:
		try {
			WshShell.run("http://www.allmusic.com/search/song/" + encodeURIComponent(fb.TitleFormat("$ascii(%title%)").EvalWithMetadb(thisMetadb)));
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 45:
		try {
			WshShell.run("http://en.wikipedia.org/wiki/Special:Search?search=" + encodeURIComponent(fb.TitleFormat("$replace(%artist%, ,_)").EvalWithMetadb(thisMetadb)));
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 46:
		try {
			WshShell.run("http://musicbrainz.org/search?query=" + encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(thisMetadb)) + "&type=artist&method=indexed");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 47:
		try {
			WshShell.run("http://www.youtube.com/results?search_type=&search_query=" + encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(thisMetadb)) + "&ie=utf-8");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 48:
		try {
			WshShell.run("http:ecover.to/?Module=ExtendedSearch&SearchString=" + encodeURIComponent(fb.TitleFormat("%artist% '+' %album%").EvalWithMetadb(thisMetadb)) + "&ie=utf-8");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case (ret > 0):
		Context.ExecuteByID(ret - 100);
		break;

	}

	Context.Dispose();
	_menu.Dispose();
	return true;
}

function sort_menu(x, y) {
	var _sort = window.CreatePopupMenu();
	var select_pl_active = plman.GetPlaylistName(fb.ActivePlaylist).substr(0, 20) == "Playlist Selection [" ? true : false;

	_sort.AppendMenuItem(lGroup == "Songs" ? MF_STRING : MF_GRAYED, 18, "Track number");
	_sort.AppendMenuItem(lGroup == "Songs" ? MF_STRING : MF_GRAYED, 19, "Title");
	_sort.AppendMenuItem(MF_STRING, 20, "Album");
	_sort.AppendMenuItem(MF_STRING, 21, "Artist");
	_sort.AppendMenuItem(MF_STRING, 22, "Genre");
	_sort.AppendMenuItem(MF_STRING, 24, "Style");
	_sort.AppendMenuItem(MF_STRING, 23, "Year");
	//_sort.AppendMenuItem(MF_STRING, 24, "Path");
	_sort.AppendMenuItem(MF_STRING, 25, "Publisher");
	_sort.AppendMenuItem(lGroup == "Songs" ? MF_STRING : MF_GRAYED, 17, "Length");

	var CheckMenu = "?";
	switch (properties.TFsorting) {
	case SortByLength:
		CheckMenu = 17;
		break;
	case SortByTracknumber:
		CheckMenu = 18;
		break;
	case SortByTitle:
		CheckMenu = 19;
		break;
	case SortByAlbum:
		CheckMenu = 20;
		break;
	case SortByArtist:
		CheckMenu = 21;
		break;
	case SortByGenre:
		CheckMenu = 22;
		break;
	case SortByYear:
		CheckMenu = 23;
		break;
	case SortByStyle:
		CheckMenu = 24;
		break;
	case SortByPublisher:
		CheckMenu = 25;
		break;
	}
	_sort.CheckMenuRadioItem(17, 25, CheckMenu);

	id = _sort.TrackPopupMenu(x, y);
	switch (id) {
	case 17:
		window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByLength);
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		g_browser.populate(false);
		//g_songs.refresh();
		break;
	case 18:
		window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByTracknumber);
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		g_browser.populate(false);
		//g_songs.refresh();
		break;
	case 19:
		window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByTitle);
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		g_browser.populate(false);
		//g_songs.refresh();
		break;
	case 20:
		window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByAlbum);
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		g_browser.populate(false);
		break;
	case 21:
		window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByArtist);
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		g_browser.populate(false);
		break;
	case 22:
		window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByGenre);
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		g_browser.populate(false);
		break;
	case 23:
		window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByYear);
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		g_browser.populate(false);
		break;
	case 24:
		window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByStyle);
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		g_browser.populate(false);
		break;
	case 25:
		window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByPublisher);
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		g_browser.populate(false);
		break;
	}

	var sort_txt = "?";
	switch (properties.TFsorting) {
	case SortByTracknumber:
		sort_txt = "track number";
		break;
	case SortByTitle:
		sort_txt = "title";
		break;
	case SortByAlbum:
		sort_txt = "album";
		break;
	case SortByArtist:
		sort_txt = "artist";
		break;
	case SortByGenre:
		sort_txt = "genre";
		break;
	case SortByYear:
		sort_txt = "year";
		break;
	case SortByStyle:
		sort_txt = "style";
		break;
	case SortByPublisher:
		sort_txt = "publisher";
		break;
	case SortByLength:
		sort_txt = "length";
		break;
	}
	toolbar.buttons[19].update("Sort by " + sort_txt, 0);
	window.Repaint();
	//alphaPLSwitch = 0;

	_sort.Dispose();
	return true;
}

function sortDirection_menu(x, y) {
	var _sort = window.CreatePopupMenu();

	_sort.AppendMenuItem(MF_STRING, 1, "Ascending");
	_sort.AppendMenuItem(MF_STRING, 2, "Descending");
	_sort.CheckMenuRadioItem(1, 2, sortDirection == 1 ? 1 : 2);

	id = _sort.TrackPopupMenu(x, y);
	switch (id) {
	case 1:
		sortDirection = 1;
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		g_browser.populate(false);
		break;
	case 2:
		sortDirection = -1;
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		g_browser.populate(false);
		break;
	}

	toolbar.buttons[23].update(sortDirection == 1 ? "Ascending" : "Descending", 0);
	_sort.Dispose();
	return true;
}

function group_menu(x, y) {
	var _group = window.CreatePopupMenu();

	_group.AppendMenuItem(MF_STRING, 1, "Albums");
	_group.AppendMenuItem(MF_STRING, 2, "Artists");
	_group.AppendMenuItem(MF_STRING, 3, "Genres");
	_group.AppendMenuItem(MF_STRING, 4, "Songs");
	_group.CheckMenuRadioItem(1, 4, lGroup == "Albums" ? 1 : lGroup == "Artists" ? 2 : lGroup == "Genres" ? 3 : lGroup == "Songs" ? 4 : 0);

	id = _group.TrackPopupMenu(x, y);
	switch (id) {
	case 1:
		window.SetProperty("Group active", lGroup = "Albums");
		window.SetProperty("Library Group TitleFormat", properties.TFgrouping = groupByAlbum);
		window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByAlbum);
		toolbar.buttons[19].update("Sort by album", [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg]);
		filter_text = "";
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		returnedPos = false;
		g_browser.populate(false);
		window.Repaint();
		on_size();
		break;
	case 2:
		window.SetProperty("Group active", lGroup = "Artists");
		window.SetProperty("Library Group TitleFormat", properties.TFgrouping = groupByArtist);
		window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByArtist);
		toolbar.buttons[19].update("Sort by artist", [col_text2, col_text2, col_text2], [dropDownImg, dropDownImg, dropDownImg]);

		filter_text = "";
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		returnedPos = false;
		g_browser.populate(false);
		//window.Repaint();
		on_size();
		break;
	case 3:
		window.SetProperty("Group active", lGroup = "Genres");
		window.SetProperty("Library Group TitleFormat", properties.TFgrouping = groupByGenre);
		window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByGenre);
		toolbar.buttons[19].update("Sort by genre", [col_text2, col_text2, col_text2], [dropDownImg, dropDownImg, dropDownImg]);
		filter_text = "";
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		returnedPos = false;
		g_browser.populate(false);
		//window.Repaint();
		on_size();
		break;
	case 4:
		window.SetProperty("Group active", lGroup = "Songs");
		//window.SetProperty("Library Group TitleFormat", properties.TFgrouping = groupByGenre);
		window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByAlbum);
		toolbar.buttons[19].update("Sort by album", [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg]);
		filter_text = "";
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		g_browser.populate(false);
		window.Repaint();
		break;
	}

	toolbar.buttons[29].update(lGroup, 0);
	_group.Dispose();
	return true;
}

function playlist_context_menu(x, y, id, pl_hover) {

	var _menu = window.CreatePopupMenu();
	var c = window.CreatePopupMenu();
	var Context = fb.CreateContextMenuManager();
	var pr = window.CreatePopupMenu();
	var prm = plman.PlaylistRecyclerManager;
	var metadblist_selection = plman.GetPlaylistItems(id);
	var idx;

	//pl_hover && _menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
	//pl_hover && _menu.AppendMenuItem(MF_STRING, 806, "Play");
	//pl_hover && _menu.AppendMenuItem(MF_SEPARATOR, 0, 0);

	pl_hover && _menu.AppendMenuItem(MF_STRING, 805, "Rename");
	pl_hover && _menu.AppendMenuItem(MF_STRING, 824, "Remove");

	//pl_hover && _menu.AppendMenuItem(MF_STRING, 804, "Activate");

	pl_hover && _menu.AppendMenuSeparator();
	pl_hover && _menu.AppendMenuItem(MF_STRING, 830, "Move up");
	pl_hover && _menu.AppendMenuItem(MF_STRING, 831, "Move down");

	if (pl_hover && fb.IsAutoPlaylist(id)) {
		_menu.AppendMenuSeparator();
		_menu.AppendMenuItem(MF_STRING, 821, "Convert to a normal playlist");
		_menu.AppendMenuItem(MF_STRING, 820, "Autoplaylist properties");
	}

	pl_hover && _menu.AppendMenuSeparator();
	pl_hover && _menu.AppendMenuItem(MF_STRING, 822, "Duplicate");
	pl_hover && _menu.AppendMenuItem(!fb.IsAutoPlaylist(id) && (fb.PlaylistItemCount(id) > 0) ? MF_STRING : MF_GRAYED | MF_DISABLED, 825, "Clear");
	pl_hover && _menu.AppendMenuItem(MF_STRING, 823, "Save");

	/*
	var Playlist_Selection_idx = "Undefined";
	for (var i = 0; i < prm.Count; i++) {
	if (prm.Name(i).substr(0, 20) == "Playlist Selection [")
	Playlist_Selection_idx = i;
	}*/

	pr.AppendTo(_menu, prm.Count >= 1 ? MF_STRING : MF_GRAYED | MF_DISABLED, "Restore");
	if (prm.Count >= 1) {
		for (var irm = 0; irm < prm.Count; irm++) {
			//if (prm.Name(irm).substr(0, 20) != "Playlist Selection [")
			pr.AppendMenuItem(prm.Name(i).substr(0, 20) == "Playlist Selection [" ? MF_GRAYED | MF_DISABLED : MF_STRING, 2001 + irm, prm.Name(irm));
		}
		pr.AppendMenuItem(MF_SEPARATOR, 0, 0);
		pr.AppendMenuItem(MF_STRING, 2000, "Clear history");
	}

	pl_hover && (fb.PlaylistItemCount(id) >= 1) && _menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
	pl_hover && (fb.PlaylistItemCount(id) >= 1) && c.AppendTo(_menu, 0, "Contents");
	Context.InitContext(metadblist_selection);
	Context.BuildMenu(c, 1, -1);

	idx = _menu.TrackPopupMenu(x, y);
	if (idx < 800) {
		Context.ExecuteByID(idx - 1);
	} else if (idx < 1000) {
		switch (idx) {
		case 804:
			fb.ActivePlaylist = id;
			break;
		case 805:
			fb.ActivePlaylist = id;
			npl_type = 2;
			NewPlaylistDialog = true;
			g_newPlaylist.inputbox.text = plman.GetPlaylistName(id);
			g_newPlaylist.inputbox.ishover = true;
			g_newPlaylist.inputbox.drag = false;
			g_newPlaylist.inputbox.edit = true;
			g_newPlaylist.inputbox.Cpos = g_newPlaylist.inputbox.GetCPos(x);
			g_newPlaylist.inputbox.anchor = g_newPlaylist.inputbox.Cpos;
			g_newPlaylist.inputbox.resetCursorTimer();
			g_newPlaylist.inputbox.dblclk = true;
			g_newPlaylist.inputbox.SelBegin = 0;
			g_newPlaylist.inputbox.SelEnd = g_newPlaylist.inputbox.text.length;
			g_newPlaylist.inputbox.text_selected = g_newPlaylist.inputbox.text;
			g_newPlaylist.inputbox.select = true;
			window.Repaint();
			break;
		case 806:
			//plman.ExecutePlaylistDefaultAction(id, 0);
			break;
		case 820:
			fb.ShowAutoPlaylistUI(id);
			break;
		case 821:
			fb.DuplicatePlaylist(id, plman.GetPlaylistName(id));
			fb.RemovePlaylist(id);
			fb.ActivePlaylist = id;
			break;
		case 822:
			plman.DuplicatePlaylist(plman.ActivePlaylist, plman.GetPlaylistName(plman.ActivePlaylist));
			plman.ActivePlaylist = plman.ActivePlaylist + 1;
			break;
		case 823:
			fb.RunMainMenuCommand("File/Save Playlist...");
			break;
		case 824:
			fb.RemovePlaylist(id);
			break;
		case 825:
			plman.ActivePlaylist = id;
			fb.ClearPlaylist();
			break;
		case 830:
			id > 0 && plman.MovePlaylist(id, id - 1);
			g_plmanager.repaint();
			break;
		case 831:
			id < plman.PlaylistCount && plman.MovePlaylist(id, id + 1);
			g_plmanager.repaint();
			break;
		}
	}

	if (idx >= 2000) {
		switch (idx) {
		case 2000:
			var affectedItems = Array();
			for (var i = 0; i < prm.Count; i++) {
				affectedItems.push(i);
			}
			prm.Purge(affectedItems);
			break;
		default:
			(prm.Count >= 1) && prm.Restore(idx - 2001);
		}
	}

	_menu.Dispose();
	c.Dispose();

	g_plmanager.playlists[id].plm_rbtnUp = false;
	return true;
}

function MenuFull(x, y) {
	var a = window.CreatePopupMenu();
	var m = window.CreatePopupMenu();
	var b = fb.CreateContextMenuManager();
	b.InitNowPlaying();
	var c1 = window.CreatePopupMenu();
	var c2 = window.CreatePopupMenu();
	var c3 = window.CreatePopupMenu();
	var c4 = window.CreatePopupMenu();
	var c5 = window.CreatePopupMenu();
	var c6 = window.CreatePopupMenu();
	var c7 = window.CreatePopupMenu();
	var d1 = fb.CreateMainMenuManager();
	var d2 = fb.CreateMainMenuManager();
	var d3 = fb.CreateMainMenuManager();
	var d4 = fb.CreateMainMenuManager();
	var d5 = fb.CreateMainMenuManager();
	var d6 = fb.CreateMainMenuManager();

	var p = window.CreatePopupMenu();
	var r = window.CreatePopupMenu();
	var d = window.CreatePopupMenu();
	var w = window.CreatePopupMenu();
	var t = window.CreatePopupMenu();
	var tb = window.CreatePopupMenu();
	var ta = window.CreatePopupMenu();
	var ct = window.CreatePopupMenu();
	var le = window.CreatePopupMenu();
	var lep = window.CreatePopupMenu();
	var lb = window.CreatePopupMenu();
	var v = window.CreatePopupMenu();
	var vm = window.CreatePopupMenu();

	var al = window.CreatePopupMenu();
	var hp = window.CreatePopupMenu();
	var inf = window.CreatePopupMenu();
	var plm = window.CreatePopupMenu();

	
	c1.AppendTo(m, 0, "File");
	c2.AppendTo(m, 0, "Edit");
	c3.AppendTo(m, 0, "View");
	c4.AppendTo(m, 0, "Playback");
	c5.AppendTo(m, 0, "Library");
	c6.AppendTo(m, 0, "Help");

	d1.Init("file");
	d2.Init("edit");
	d3.Init("View");
	d4.Init("playback");
	d5.Init("library");
	d6.Init("help");
	d1.BuildMenu(c1, 1, 200);
	d2.BuildMenu(c2, 201, 200);
	d3.BuildMenu(c3, 401, 200);
	d4.BuildMenu(c4, 601, 300);
	d5.BuildMenu(c5, 901, 300);
	d6.BuildMenu(c6, 1201, 100);
	b.InitNowPlaying();
	b.BuildMenu(c7, 1301, -1);

	m.AppendMenuSeparator();

	a.AppendTo(m, MF_STRING, "Settings");
	 
	
	//fb.IsPlaying && a.AppendMenuSeparator();
	//fb.IsPlaying && c7.AppendTo(a, 0, "Now Playing: " + fb.TitleFormat("%title%").Eval());

	hp.AppendTo(a, MF_STRING, "Panels");
	hp.AppendMenuItem(UIHacks ? MF_STRING : MF_GRAYED | MF_DISABLED, 1583, "Menu bar");
	hp.CheckMenuItem(1583, !hideMenuBar);
	hp.AppendMenuItem(UIHacks ? MF_STRING : MF_GRAYED | MF_DISABLED, 1584, "Status bar");
	hp.CheckMenuItem(1584, !hideStatusBar);
	hp.AppendMenuSeparator();
	hp.AppendMenuItem(MF_STRING, 1581, "Left panel");
	hp.CheckMenuItem(1581, properties.showleftPanel);
	hp.AppendMenuItem(MF_STRING, 1580, "Bottom panel");
	hp.CheckMenuItem(1580, properties.showBottomPanel);
	hp.AppendMenuItem(MF_STRING, 1700, "Right panel");
	hp.CheckMenuItem(1700, rightPanel);

	ta.AppendTo(a, MF_STRING, "Theme");
	ta.AppendMenuItem(MF_STRING, 1510, "Light");
	ta.AppendMenuItem(MF_STRING, 1511, "Dark");
	ta.CheckMenuRadioItem(1510, 1511, properties.darkTheme ? 1511 : 1510);
	ta.AppendMenuSeparator();

	ta.AppendMenuItem(MF_STRING, 1600, "Lime");
	ta.AppendMenuItem(MF_STRING, 1601, "Green");
	ta.AppendMenuItem(MF_STRING, 1602, "Emerald");
	ta.AppendMenuItem(MF_STRING, 1603, "Teal");
	ta.AppendMenuItem(MF_STRING, 1604, "Cyan");
	ta.AppendMenuItem(MF_STRING, 1605, "Cobalt");
	ta.AppendMenuItem(MF_STRING, 1606, "Indigo");
	ta.AppendMenuItem(MF_STRING, 1607, "Violet");
	ta.AppendMenuItem(MF_STRING, 1608, "Pink");
	ta.AppendMenuItem(MF_STRING, 1609, "Magenta");
	ta.AppendMenuItem(MF_STRING, 1610, "Crimson");
	ta.AppendMenuItem(MF_STRING, 1611, "Red");
	ta.AppendMenuItem(MF_STRING, 1612, "Orange");
	ta.AppendMenuItem(MF_STRING, 1613, "Amber");
	ta.AppendMenuItem(MF_STRING, 1614, "Yellow");
	ta.AppendMenuItem(MF_STRING, 1615, "Brown");
	ta.AppendMenuItem(MF_STRING, 1616, "Olive");
	ta.AppendMenuItem(MF_STRING, 1617, "Steel");
	ta.AppendMenuItem(MF_STRING, 1618, "Mauve");
	ta.AppendMenuItem(MF_STRING, 1619, "Taupe");
	ta.AppendMenuItem(MF_STRING, 1620, "Black");
	var accent_colour_n = -1;
	for (i = 0; i < Colours.accent.length; i++) {
		if (accent_colour_p == Colours.accent[i])
			accent_colour_n = i;
	}
	ta.CheckMenuRadioItem(1600, 1620, accent_colour_n + 1600);

	d.AppendTo(a, MF_STRING, "Directories");
	d.AppendMenuItem(MF_STRING, 1550, "Profile path");
	d.AppendMenuItem(MF_STRING, 1551, "Foobar path");
	d.AppendMenuItem(MF_STRING, 1552, "Component path");
	w.AppendTo(a, ActiveX ? MF_STRING : MF_GRAYED | MF_DISABLED, "System power");
	w.AppendMenuItem(MF_STRING, 1560, "Logoff");
	w.AppendMenuItem(MF_STRING, 1561, "Shutdown");
	w.AppendMenuItem(MF_STRING, 1562, "Restart");

	v.AppendTo(a, MF_STRING, "Volume");
	v.AppendMenuItem(UIHacks ? MF_STRING : MF_GRAYED | MF_DISABLED, 1545, "Show master volume");
	v.CheckMenuItem(1545, properties.show_masterVolume);
	vm.AppendTo(v, UIHacks ? MF_STRING : MF_GRAYED | MF_DISABLED, "Set master volume to");
	vm.AppendMenuItem(MF_STRING, 1690, "100%");
	vm.AppendMenuItem(MF_STRING, 1689, "90%");
	vm.AppendMenuItem(MF_STRING, 1688, "80%");
	vm.AppendMenuItem(MF_STRING, 1687, "70%");
	vm.AppendMenuItem(MF_STRING, 1686, "60%");
	vm.AppendMenuItem(MF_STRING, 1685, "50%");
	vm.AppendMenuItem(MF_STRING, 1684, "40%");
	vm.AppendMenuItem(MF_STRING, 1683, "30%");
	vm.AppendMenuItem(MF_STRING, 1682, "20%");
	vm.AppendMenuItem(MF_STRING, 1681, "10%");
	UIHacks && vm.CheckMenuRadioItem(1681, 1690, 1680 + (UIHacks.MasterVolume.Volume * 10));
	vm.AppendMenuSeparator();
	vm.AppendMenuItem(MF_STRING, 1680, "Mute");
	UIHacks && vm.CheckMenuItem(1680, UIHacks.MasterVolume.Mute);
	v.AppendMenuItem(ActiveX ? MF_STRING : MF_GRAYED | MF_DISABLED, 1546, "Open volume mixer");

	//a.AppendMenuItem(MF_STRING, 1544, "Wait for index all tracks to display albums");
	//a.CheckMenuItem(1544, !draw_immediately);

	plm.AppendTo(a, MF_STRING, "Playlist Manager");
	plm.AppendMenuItem(MF_STRING, 1542, "Show playlist count tracks");
	plm.CheckMenuItem(1542, properties.showPlCountTracks);

	al.AppendTo(a, MF_STRING, "Album view");
	al.AppendMenuItem(MF_STRING, 1540, "Separate albums by disc");
	al.CheckMenuItem(1540, properties.separateAlbumsByDisc);
	al.AppendMenuItem(MF_STRING, 1640, "Load hidden covers in background");
	al.CheckMenuItem(1640, properties.loadInBackground);
	al.AppendMenuItem(MF_STRING, 1541, "Show album count tracks");
	al.CheckMenuItem(1541, properties.showCountTracks);
	r.AppendTo(al, MF_STRING, "Refresh");
	r.AppendMenuItem(MF_STRING, 1520, "All \tF5");
	r.AppendMenuItem(MF_STRING, 1521, "Library \tF6");
	r.AppendMenuItem(MF_STRING, 1522, "Images cache \tF7");

	le.AppendTo(a, MF_STRING, "Expanded list");
	le.AppendMenuItem(MF_STRING, 1631, "Use album art colors");
	le.CheckMenuItem(1631, properties.listCoverColor);
	lep.AppendTo(le, MF_STRING, "Album art");
	lep.AppendMenuItem(MF_STRING, 1630, "Show album art");
	le.CheckMenuItem(1630, properties.listShowCoverArt);
	lep.AppendMenuSeparator();
	lep.AppendMenuItem(properties.listShowCoverArt ? MF_STRING : MF_GRAYED | MF_DISABLED, 1632, "Left");
	lep.AppendMenuItem(properties.listShowCoverArt ? MF_STRING : MF_GRAYED | MF_DISABLED, 1633, "Right");

	lep.CheckMenuRadioItem(1632, 1633, !listRightArtwork ? 1632 : 1633);
	lb.AppendTo(le, MF_STRING, "Wallpaper");
	lb.AppendMenuItem(MF_STRING, 1670, "Solid background");
	lb.AppendMenuItem(MF_STRING, 1671, "Album art");
	lb.AppendMenuItem(MF_STRING, 1672, "Artist art");
	lb.CheckMenuRadioItem(1670, 1672, !listbackgroundArtwork ? 1670 : listbackgroundArtworkType == 4 ? 1672 : listbackgroundArtworkType == 0 ? 1671 : 9999);
	lb.AppendMenuSeparator();
	lb.AppendMenuItem(listbackgroundArtwork ? MF_STRING : MF_GRAYED | MF_DISABLED, 1675, "Blurred");
	lb.CheckMenuItem(1675, listbackgroundBlurred);
	le.AppendMenuItem(MF_STRING, 1634, "Show queue number");
	le.CheckMenuItem(1634, properties.listqueue);

	inf.AppendTo(a, MF_STRING, "Info panel");
	inf.AppendMenuItem(MF_STRING, 1701, "Show Album Art");
	inf.CheckMenuItem(1701, rightPanelAlbumArt);

	a.AppendMenuItem(MF_STRING, 1650, "Convert images to bitmaps");
	a.CheckMenuItem(1650, cover.raw_bitmap);

	a.AppendMenuItem(MF_STRING, 1582, "Large now playing artwork");
	a.CheckMenuItem(1582, largeNowPlayingArtwork);

	a.AppendMenuItem(MF_STRING, 1543, "Popup selections bar");
	a.CheckMenuItem(1543, popup_selections);

	a.AppendMenuItem(UIHacks ? MF_STRING : MF_GRAYED | MF_DISABLED, 1585, "Fullscreen \tF11");
	UIHacks && a.CheckMenuItem(1585, UIHacks.FullScreen);

	a.AppendMenuSeparator();
	a.AppendMenuItem(MF_STRING, 1710, "Stop on dblclk Play/Paused button");
	a.CheckMenuItem(1710, toolbar.button_lbtn_dblclk_stop);
	a.AppendMenuItem(MF_STRING, 1711, "Random on dblclk Prev/Next button");
	a.CheckMenuItem(1711, toolbar.button_lbtn_dblclk_random);

	a.AppendMenuSeparator();
	a.AppendMenuItem(MF_STRING, 1529, "Reload");
	a.AppendMenuItem(MF_STRING, 1530, "Properties");
	a.AppendMenuItem(MF_STRING, 1531, "Configure...");

	var ret = 0;
	ret = m.TrackPopupMenu(x, y, TPM_RIGHTALIGN);
	switch (true) {
	case (ret >= 1 && ret < 201):
		d1.ExecuteByID(ret - 1);
		break;
	case (ret >= 201 && ret < 401):
		d2.ExecuteByID(ret - 201);
		break;
	case (ret >= 401 && ret < 601):
		d3.ExecuteByID(ret - 401);
		break;
	case (ret >= 601 && ret < 901):
		d4.ExecuteByID(ret - 601);
		break;
	case (ret >= 901 && ret < 1201):
		d5.ExecuteByID(ret - 901);
		break;
	case (ret >= 1201 && ret < 1301):
		d6.ExecuteByID(ret - 1201);
		break;
	case (ret >= 1301 && ret < 1501):
		b.ExecuteByID(ret - 1301);
		break;
	case ret == 1501:
		window.ShowProperties();
		break;
	case ret == 1502:
		window.ShowConfigure();
		break;
	case (ret >= 1510 && ret <= 1511):
		window.SetProperty("Dark theme", properties.darkTheme = (ret == 1510 ? false : true));
		col_bg = properties.darkTheme ? RGB(34, 34, 34) : RGB(225, 225, 225);
		col_bg_pl = properties.darkTheme ? RGB(24, 24, 24) : RGB(34, 34, 34);
		col_text1 = properties.darkTheme ? RGB(234, 234, 234) : RGB(38, 38, 38);
		col_listSchemeBack = properties.darkTheme ? RGB(20, 20, 20) : RGB(236, 236, 236);

		dropNormalImg = gdi.CreateImage(dropNormalMask.Width, dropNormalMask.Height);
		gb = dropNormalImg.GetGraphics();
		gb.FillSolidRect(0, 0, dropNormalImg.Width, dropNormalImg.Height, col_text1);
		dropNormalImg.ReleaseGraphics(gb);
		dropNormalImg.ApplyMask(dropNormalMask);
		dropHoverImg = gdi.CreateImage(dropNormalMask.Width, dropNormalMask.Height);
		gb = dropHoverImg.GetGraphics();
		gb.FillSolidRect(0, 0, dropHoverImg.Width, dropHoverImg.Height, accent_colour);
		dropHoverImg.ReleaseGraphics(gb);
		dropHoverImg.ApplyMask(dropNormalMask);
		dropDownImg = gdi.CreateImage(dropNormalMask.Width, dropNormalMask.Height);
		gb = dropDownImg.GetGraphics();
		gb.FillSolidRect(0, 0, dropDownImg.Width, dropDownImg.Height, col_text2);
		dropDownImg.ReleaseGraphics(gb);
		dropDownImg.ApplyMask(dropNormalMask);

		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		g_browser.bgColor = col_bg;
		g_browser.fgColor = col_text1;
		set_toolbar_bt();

		toolbar.buttons[19].update(0, [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg]);
		toolbar.buttons[21].update(0, [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg]);
		toolbar.buttons[23].update(0, [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg]);
		toolbar.buttons[29].update(0, [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg]);

		g_songs = new oSongs("g_songs");
		g_songs.refresh();

		g_info = new oInfo("g_info");
		//g_settings = new oSettings();
		g_settings.setButtons();

		g_queue = new oQueue("g_queue");
		g_queue.refresh();

		on_size();
		window.Repaint();
		break;
	case (ret >= 1600 && ret <= 1620):
		window.SetProperty("Accent colour", accent_colour_p = Colours.accent[ret - 1600]);
		accent_colour = eval(accent_colour_p);

		dropNormalImg = gdi.CreateImage(dropNormalMask.Width, dropNormalMask.Height);
		gb = dropNormalImg.GetGraphics();
		gb.FillSolidRect(0, 0, dropNormalImg.Width, dropNormalImg.Height, col_text1);
		dropNormalImg.ReleaseGraphics(gb);
		dropNormalImg.ApplyMask(dropNormalMask);
		dropHoverImg = gdi.CreateImage(dropNormalMask.Width, dropNormalMask.Height);
		gb = dropHoverImg.GetGraphics();
		gb.FillSolidRect(0, 0, dropHoverImg.Width, dropHoverImg.Height, accent_colour);
		dropHoverImg.ReleaseGraphics(gb);
		dropHoverImg.ApplyMask(dropNormalMask);
		dropDownImg = gdi.CreateImage(dropNormalMask.Width, dropNormalMask.Height);
		gb = dropDownImg.GetGraphics();
		gb.FillSolidRect(0, 0, dropDownImg.Width, dropDownImg.Height, col_text2);
		dropDownImg.ReleaseGraphics(gb);
		dropDownImg.ApplyMask(dropNormalMask);

		playlistPlayedIcon = gdi.CreateImage(27, 27);
		gb = playlistPlayedIcon.GetGraphics();
		gb.FillSolidRect(0, 0, playlistPlayedIcon.Width, playlistPlayedIcon.Height, accent_colour);
		playlistPlayedIcon.ReleaseGraphics(gb);
		playlistPlayedIcon.ApplyMask(playlistPlayedIcon_Mask);

		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;

		toolbar.buttons[19].update(0, [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg]);
		toolbar.buttons[21].update(0, [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg]);
		toolbar.buttons[23].update(0, [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg]);
		toolbar.buttons[29].update(0, [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg]);

		g_settings = new oSettings();
		g_settings.setButtons();
		on_size();

		window.Repaint();
		break;
	case ret == 1520:
		scroll = scroll_ = 0;
		g_filterbox.inputbox.text = "";
		filter_text = "";
		g_imageCache = new image_cache;
		g_artistImageCache = new image_cache;
		g_genreImageCache = new image_cache;
		g_browser.populate(false);
		g_sendResponse();
		break;
	case ret == 1521:
		scroll = scroll_ = 0;
		g_filterbox.inputbox.text = "";
		filter_text = "";
		g_browser.populate(true);
		g_sendResponse();
		break;
	case ret == 1522:
		g_imageCache = new image_cache;
		g_artistImageCache = new image_cache;
		g_genreImageCache = new image_cache;
		g_browser.repaint();
		break;
	case ret == 1529:
		try {
			window.Reload();
		} catch (e) {
			fb.trace(e)
		}
		break;
	case ret == 1530:
		window.ShowProperties();
		break;
	case ret == 1531:
		window.ShowConfigure();
		break;
	case ret == 1540:
		window.SetProperty("separate albums by disc", properties.separateAlbumsByDisc = !properties.separateAlbumsByDisc);
		groupByAlbum = properties.separateAlbumsByDisc ? groupByAlbumByDisc : groupByAlbumSimple;
		window.SetProperty("Group active", lGroup = lGroupType[0]);
		window.SetProperty("Library Group TitleFormat", properties.TFgrouping = groupByAlbum);
		window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByAlbum);
		filter_text = "";
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		g_browser.populate(false);
		g_sendResponse();
		break;
	case ret == 1541:
		window.SetProperty("Show album count tracks", properties.showCountTracks = !properties.showCountTracks);
		filter_text = "";
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		g_browser.populate(false);
		g_sendResponse();
		on_size();
		break;
	case ret == 1542:
		window.SetProperty("Show playlists count tracks", properties.showPlCountTracks = !properties.showPlCountTracks);
		on_size();
		break;
	case ret == 1543:
		window.SetProperty("Show popup selections", popup_selections = !popup_selections);
		window.Repaint();
		break;
	case ret == 1544:
		window.SetProperty("draw_immediately", draw_immediately = !draw_immediately);
		break;
	case ret == 1545:
		window.SetProperty("Show master volume", properties.show_masterVolume = !properties.show_masterVolume);
		on_size();
		break;
	case ret == 1546:
		try {
			WshShell.run("SndVol.exe");
		} catch (e) {
			fb.trace(e.message + ": WshShell.run(SndVol.exe)");
		}
		try {
			WshShell.run("sndvol32.exe");
		} catch (e) {
			fb.trace(e.message + ": WshShell.run(sndvol32.exe)");
		}
		break;
	case ret == 1550:
		try {
			WshShell.Run("\"" + fb.ProfilePath + "\"");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 1551:
		try {
			WshShell.Run("\"" + fb.FoobarPath + "\"");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 1552:
		try {
			WshShell.Run("\"" + fb.ComponentPath + "\"");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 1560:
		try {
			WshShell.run("shutdown.exe -L");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 1561:
		try {
			WshShell.run("shutdown.exe -_s -t 00");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 1562:
		try {
			WshShell.run("shutdown.exe -r -t 00");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 1563:
		try {
			WshShell.run("shutdown.exe -r -t 00");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 1564:
		try {
			WshShell.run("shutdown.exe -r -t 00");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 1570:
		try {
			WshShell.run("http://fav.me/d7ojh0e");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 1580:
		window.SetProperty("Show bottom panel", properties.showBottomPanel = !properties.showBottomPanel);
		on_size();
		window.Repaint();
		break;
	case ret == 1581:
		window.SetProperty("Show left panel", properties.showleftPanel = !properties.showleftPanel);
		on_size();
		window.Repaint();
		break;
	case ret == 1582:
		window.SetProperty("Large now playing artwork", largeNowPlayingArtwork = !largeNowPlayingArtwork);
		on_size();
		//g_plmanager.setPlaylistList();
		getData(fb.GetNowPlaying());
		window.Repaint();
		break;
	case ret == 1583:
		window.SetProperty("Hide menu bar", hideMenuBar = (hideMenuBar == MainMenuState.Hide ? MainMenuState.Show : MainMenuState.Hide));
		if (UIHacks)
			UIHacks.MainMenuState = hideMenuBar;
		break;
	case ret == 1584:
		window.SetProperty("Hide status bar", hideStatusBar = !hideStatusBar);
		if (UIHacks)
			UIHacks.StatusBarState = !hideStatusBar;
		break;
	case ret == 1585:
		if (UIHacks)
			UIHacks.FullScreen = !UIHacks.FullScreen;
		break;
	case ret == 1630:
		window.SetProperty("List show cover art", properties.listShowCoverArt = !properties.listShowCoverArt);
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		break;
	case ret == 1631:
		window.SetProperty("Use cover color in expanded list", properties.listCoverColor = !properties.listCoverColor);
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		break;
	case ret == 1632:
		window.SetProperty("Move artwork to left in expanded list", listRightArtwork = false);
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		break;
	case ret == 1633:
		window.SetProperty("Move artwork to left in expanded list", listRightArtwork = true);
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		break;
	case ret == 1634:
		window.SetProperty("Show queue index in expanded list", properties.listqueue = !properties.listqueue);
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		break;
	case ret == 1640:
		window.SetProperty("Load hidden covers in background", properties.loadInBackground = !properties.loadInBackground);
		break;
	case ret == 1650:
		window.SetProperty("Raw bitmap", cover.raw_bitmap = !cover.raw_bitmap);
		g_imageCache = new image_cache;
		g_artistImageCache = new image_cache;
		g_genreImageCache = new image_cache;
		getData(fb.GetNowPlaying());
		window.Repaint();
		break;
	case ret == 1670:
		window.SetProperty("Show cover artwork as background in expanded list", listbackgroundArtwork = false);
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		window.Repaint();
		break;
	case ret == 1671:
		window.SetProperty("Show cover artwork as background in expanded list", listbackgroundArtwork = true);
		window.SetProperty("Show artwork background type in expanded list", listbackgroundArtworkType = 0);
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		window.Repaint();
		break;
	case ret == 1672:
		window.SetProperty("Show cover artwork as background in expanded list", listbackgroundArtwork = true);
		window.SetProperty("Show artwork background type in expanded list", listbackgroundArtworkType = 4);
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		window.Repaint();
		break;
	case ret == 1675:
		window.SetProperty("Blurred wallpaper in expanded list", listbackgroundBlurred = !listbackgroundBlurred);
		g_showlist.idx = g_showlist.rowIdx = -1;
		g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
		window.Repaint();
		break;
	case ret == 1680:
		UIHacks.MasterVolume.Mute = !UIHacks.MasterVolume.Mute;
		break;
	case ret == 1681:
		UIHacks.MasterVolume.Volume = 0.1;
		break;
	case ret == 1682:
		UIHacks.MasterVolume.Volume = 0.2;
		break;
	case ret == 1683:
		UIHacks.MasterVolume.Volume = 0.3;
		break;
	case ret == 1684:
		UIHacks.MasterVolume.Volume = 0.4;
		break;
	case ret == 1685:
		UIHacks.MasterVolume.Volume = 0.5;
		break;
	case ret == 1686:
		UIHacks.MasterVolume.Volume = 0.6;
		break;
	case ret == 1687:
		UIHacks.MasterVolume.Volume = 0.7;
		break;
	case ret == 1688:
		UIHacks.MasterVolume.Volume = 0.8;
		break;
	case ret == 1689:
		UIHacks.MasterVolume.Volume = 0.9;
		break;
	case ret == 1690:
		UIHacks.MasterVolume.Volume = 1.0;
		break;
	case ret == 1700:
		window.SetProperty("Show properties panel", rightPanel = !rightPanel);
		on_size();
		window.repaint();
		break;
	case ret == 1701:
		window.SetProperty("Show album art in properties panel", rightPanelAlbumArt = !rightPanelAlbumArt);
		g_info.showCover = rightPanelAlbumArt;
		on_size();
		window.repaint();
		break;
	case ret == 1710:
		window.SetProperty("Stop on dblclk play/paused button", toolbar.button_lbtn_dblclk_stop = !toolbar.button_lbtn_dblclk_stop);
		break;
	case ret == 1711:
		window.SetProperty("Random on dblclk next/prev button", toolbar.button_lbtn_dblclk_random = !toolbar.button_lbtn_dblclk_random);
		break;
	}

	a.Dispose();
	b.Dispose();
	d1.Dispose();
	d2.Dispose();
	d3.Dispose();
	d4.Dispose();
	d5.Dispose();
	d6.Dispose();
	p.Dispose();
	return true
}

function schedulerMenu(x, y) {
	var _s = window.CreatePopupMenu();
	var _sp = window.CreatePopupMenu();
	var _s1 = window.CreatePopupMenu();
	var _s2 = window.CreatePopupMenu();

	_s1.AppendTo(_s, MF_STRING, "Event");

	//_s1.AppendTo(_s, MF_STRING, "Stop in");
	for (var b = 1; b < 10; b++) {
		var num = Math.pow(2, b - 1);
		var string = "In " + num + " min";
		_s1.AppendMenuItem(MF_STRING, 80 + b, string);
	}
	_s1.CheckMenuRadioItem(81, 90, Scheduler.mode + 70);
	_s1.AppendMenuSeparator();
	for (var a = 1; a < 10; a++) {
		var num = Math.pow(2, a - 1);
		var string = "After " + num + " tracks played";
		_s1.AppendMenuItem(MF_STRING, 70 + a, string);
	}
	_s1.CheckMenuRadioItem(70, 80, Scheduler.mode + 70);

	_sp.AppendTo(_s, MF_STRING, "Action");
	_sp.AppendMenuItem(MF_STRING, 95, "Stop Playback");
	_sp.AppendMenuItem(MF_STRING, 96, "Exit foobar2000");
	_sp.AppendMenuSeparator();
	_sp.AppendMenuItem(MF_STRING, 97, "Logoff");
	_sp.AppendMenuItem(MF_STRING, 98, "Shutdown");
	_sp.AppendMenuItem(MF_STRING, 99, "Restart");
	_sp.CheckMenuRadioItem(95, 99, Scheduler.st + 95);

	var ret = _s.TrackPopupMenu(x, y, TPM_RIGHTALIGN);
	switch (true) {
	case (ret >= 71 && ret <= 81):
		window.SetProperty("Scheduler Mode", Scheduler.mode = ret - 70);
		StopTimer();
		break;
	case (ret >= 81 && ret <= 91):
		window.SetProperty("Scheduler Mode", Scheduler.mode = ret - 70);
		StopTimer();
		break;
	case ret == 95:
	case ret == 96:
	case ret == 97:
	case ret == 98:
	case ret == 99:
		window.SetProperty("Scheduler st", Scheduler.st = (ret - 95));
		break;
	}

	_s.Dispose();
	_s1.Dispose();
	_s2.Dispose();
	_sp.Dispose();
	return true;
}

function schedulerActionMenu(x, y) {
	var _s = window.CreatePopupMenu();

	_s.AppendMenuItem(MF_STRING, 95, "Stop Playback");
	_s.AppendMenuItem(MF_STRING, 96, "Exit foobar2000");
	_s.AppendMenuSeparator();
	_s.AppendMenuItem(MF_STRING, 97, "Logoff");
	_s.AppendMenuItem(MF_STRING, 98, "Shutdown");
	_s.AppendMenuItem(MF_STRING, 99, "Restart");
	_s.CheckMenuRadioItem(95, 99, Scheduler.st + 95);

	var ret = _s.TrackPopupMenu(x, y);
	switch (true) {
	case ret == 95:
	case ret == 96:
	case ret == 97:
	case ret == 98:
	case ret == 99:
		window.SetProperty("Scheduler st", Scheduler.st = (ret - 95));

		switch (Scheduler.st) {
		case 0:
			var SchedulerTxtAction = "Stop Playback";
			break;
		case 1:
			var SchedulerTxtAction = "Exit foobar2000";
			break;
		case 2:
			var SchedulerTxtAction = "Logoff";
			break;
		case 3:
			var SchedulerTxtAction = "Shutdown";
			break;
		case 4:
			var SchedulerTxtAction = "Restart";
			break;
		}

		g_settings.buttons[6].update(SchedulerTxtAction, [col_text1, accent_colour, col_text2]);
		break;
	}
	_s.Dispose();
	return true;
}

function schedulerModeMenu(x, y) {
	var _s = window.CreatePopupMenu();

	for (var b = 1; b < 10; b++) {
		var num = Math.pow(2, b - 1);
		var string = "In " + num + " min";
		_s.AppendMenuItem(MF_STRING, 80 + b, string);
	}
	_s.CheckMenuRadioItem(81, 90, Scheduler.mode + 70);
	_s.AppendMenuSeparator();
	for (var a = 1; a < 10; a++) {
		var num = Math.pow(2, a - 1);
		var string = "After " + num + " tracks played";
		_s.AppendMenuItem(MF_STRING, 70 + a, string);
	}
	_s.CheckMenuRadioItem(70, 80, Scheduler.mode + 70);

	var ret = _s.TrackPopupMenu(x, y);
	switch (true) {
	case (ret >= 71 && ret <= 81):
		window.SetProperty("Scheduler Mode", Scheduler.mode = ret - 70);
		StopTimer();
		break;
	case (ret >= 81 && ret <= 91):
		window.SetProperty("Scheduler Mode", Scheduler.mode = ret - 70);
		StopTimer();
		break;
	}

	if (!Scheduler.timer_started && !Scheduler.counter_started) {
		var SchedulerTxtx2 = false;
		switch (true) {
		case Scheduler.mode >= 1 && Scheduler.mode <= 10:
			var num = Math.pow(2, Scheduler.mode - 1);
			var SchedulerTxtx1 = "After " + num + " tracks played";
			break;
		case Scheduler.mode >= 11 && Scheduler.mode <= 20:
			var num = Math.pow(2, Scheduler.mode - 11);
			var SchedulerTxtx1 = "In " + num + " min";
			break;
		}
	} else if (Scheduler.timer_started) {
		var mins = (Scheduler.timeout / 60000 - Math.round(Scheduler.seconds / 60));
		if (mins > 0)
			var SchedulerTxtx1 = "In " + Math.round(mins) + " min";
		else
			var SchedulerTxtx1 = "Soon";
		var SchedulerTxtx2 = true;
	} else if (Scheduler.counter_started) {
		var SchedulerTxtx1 = "After " + (Scheduler.counter_limit - Scheduler.counter) + " tracks played";
		var SchedulerTxtx2 = true;
	}
	g_settings.buttons[5].update(SchedulerTxtx1, [col_text1, accent_colour, col_text2]);
	g_settings.buttons[4].update(false);

	_s.Dispose();
	return true;
}

function playbackOrderMenu(x, y) {
	var _menu = window.CreatePopupMenu();
	var i = 1;
	var ret;

	_menu.AppendMenuItem(MF_STRING, i++, "Default");
	_menu.AppendMenuItem(MF_STRING, i++, "Repeat (Playlist)");
	_menu.AppendMenuItem(MF_STRING, i++, "Repeat (Track)");
	_menu.AppendMenuItem(MF_STRING, i++, "Random");
	_menu.AppendMenuItem(MF_STRING, i++, "Shuffle (tracks)");
	_menu.AppendMenuItem(MF_STRING, i++, "Shuffle (albums)");
	_menu.AppendMenuItem(MF_STRING, i, "Shuffle (folders)");
	_menu.CheckMenuRadioItem(1, i, fb.PlayBackOrder + 1);

	var order_name = ["Default", "Repeat (Playlist)", "Repeat (Track)", "Random", "Shuffle (tracks)", "Shuffle (albums)", "Shuffle (folders)"];

	ret = _menu.TrackPopupMenu(x, y);
	if (ret >= 1 && ret <= i) {
		fb.PlayBackOrder = ret - 1;
		g_settings.buttons[0].update(order_name[fb.PlaybackOrder], [col_text1, accent_colour, col_text2]);
	}
	_menu.Dispose();
	return true;
}

function favoritesMenu(x, y) {
	var _menu = window.CreatePopupMenu();
	var i = 0;
	var ret;

	_menu.AppendMenuItem(MF_STRING, i++, "Undefined");
	_menu.AppendMenuItem(MF_STRING, i++, "Loved Tracks");
	_menu.AppendMenuItem(MF_STRING, i++, "Hated Tracks");
	_menu.CheckMenuRadioItem(0, i, favoritesPlType);

	ret = _menu.TrackPopupMenu(x, y);
	switch (ret) {
	case 0:
		window.SetProperty("Favorites Playlist Type", favoritesPlType = ret);
		var str = "Favorites";
		var isFound = false;
		var total = plman.PlaylistCount;
		for (var i = 0; i < total; i++) {
			if (plman.GetPlaylistName(i) == str) {
				var plIndex = i;
				isFound = true;
				break;
			}
		}
		if (isFound) {
			plman.RemovePlaylist(plIndex);
		} else
			plIndex = 1;

		fb.CreateAutoPlaylist(plIndex, str, "Mood MISSING", "", 0);
		plman.ActivePlaylist = plIndex;
		break;
	case 1:
		window.SetProperty("Favorites Playlist Type", favoritesPlType = ret);
		var str = "Favorites";
		var isFound = false;
		var total = plman.PlaylistCount;
		for (var i = 0; i < total; i++) {
			if (plman.GetPlaylistName(i) == str) {
				var plIndex = i;
				isFound = true;
				break;
			}
		}
		if (isFound) {
			plman.RemovePlaylist(plIndex);
		} else
			plIndex = 1;

		fb.CreateAutoPlaylist(plIndex, str, "Mood IS Like it", "", 0);
		plman.ActivePlaylist = plIndex;
		break;
	case 2:
		window.SetProperty("Favorites Playlist Type", favoritesPlType = ret);
		var str = "Favorites";
		var isFound = false;
		var total = plman.PlaylistCount;
		for (var i = 0; i < total; i++) {
			if (plman.GetPlaylistName(i) == str) {
				var plIndex = i;
				isFound = true;
				break;
			}
		}
		if (isFound) {
			plman.RemovePlaylist(plIndex);
		} else
			plIndex = 1;

		fb.CreateAutoPlaylist(plIndex, str, "Mood IS Hate it", "", 0);
		plman.ActivePlaylist = plIndex;
		break;
	}

	switch (favoritesPlType) {
	case 0:
		toolbar.buttons[30].update("Undefined", [col_text1, accent_colour, col_text2]);
		break;
	case 1:
		toolbar.buttons[30].update("Loved", [col_text1, accent_colour, col_text2]);
		break;
	case 2:
		toolbar.buttons[30].update("Hated", [col_text1, accent_colour, col_text2]);
		break;
	}

	_menu.Dispose();
	return true;
}
