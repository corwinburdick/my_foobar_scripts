var g_showPlM = pl_w > 100 ? true : false;
var total;
function switchPlM() {
	g_showPlM = !g_showPlM;
	drag_timerPlM = true;

	plM_time = window.SetInterval(function () {
			if (drag_timerPlM) {
				if (g_showPlM) {
					window.SetProperty("Playlist Manager - Width", pl_w += 50);
					if (pl_w > 150)
						g_filterbox.inputbox.visible = true;
					if (pl_w > pl_deafult_w) {
						window.SetProperty("Playlist Manager - Width", pl_w = pl_deafult_w);

						g_plmanager.setPlaylistList();
						if (largeNowPlayingArtwork)
							getData(fb.GetNowPlaying());
						drag_timerPlM = false;
						plM_time && window.ClearInterval(plM_time);
						plM_time = false;
					}
				} else {
					window.SetProperty("Playlist Manager - Width", pl_w -= 50);
					g_filterbox.inputbox.visible = false;
					if (pl_w < pl_minideafult_w) {
						window.SetProperty("Playlist Manager - Width", pl_w = pl_minideafult_w);
						g_plmanager.setPlaylistList();
						drag_timerPlM = false;
						plM_time && window.ClearInterval(plM_time);
						plM_time = false;
					}
				}
				plM_repaint = true;
			}

			if (plM_repaint) {
				on_size();
				window.Repaint();
			}
		}, 20);
}

var plXmarg = 35;

var playlistPanelObject = function (objectName) {
	this.objectName = objectName;
	this.isOpened = true;
	this.delta = 0;
	this.x = 0;
	this.y = 0;
	this.h = wh;
	this.w = pl_w;
	this.headerHeigth = pl_h;
	this.side = "left";
	this.scrollStep = this.headerHeigth;
	this.playlists = Array();

	this.totalRows = 5;
	this.offset = 0;
	this.totalPlaylistsVis = 0;
	this.scrollbarWidth = 0;
	this.total;
	this.scrollbar = new oScrollBar(0, this.objectName + ".scrollbar", 0, 0, cScrollBar.width, 0, 0, this.headerHeigth, this.offset, objectName, true, 1, true);

	this.state0 = false;
	this.state1 = false;
	this.state2 = false;
	this.state3 = false;
	this.state4 = false;

	this.setPlaylistList = function () {
		this.totalPlaylists = plman.PlaylistCount;
		this.playlists.splice(0, this.playlists.length);
		this.totalPlaylistsVis = 0;
		for (var i = 0; i < this.totalPlaylists; i++) {
			this.playlists.push(new playlistItemObject(i, plman.GetPlaylistName(i), eval(this.objectName)));
		}
		this.total = 5 + this.playlists.length;
		this.scrollbar.reSize(this.x + this.w - cScrollBar.width, this.y + pl_y + this.headerHeigth * 6, cScrollBar.width, this.h - pl_y - this.headerHeigth * 6, 1 + g_plmanager.totalPlaylistsVis, this.headerHeigth, this.offset);
		if (this.scrollbar.visible) {
			this.scrollbarWidth = this.scrollbar.w;
		} else {
			this.scrollbarWidth = 0;
		}
	}

	this.setSize = function (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.offset = 0;

		for (var i = 0; i < this.playlists.length; i++) {
			this.playlists[i].w = this.w;
		}

		this.scrollbar.reSize(this.x + this.w - cScrollBar.width, this.y + pl_y + this.headerHeigth * 6, cScrollBar.width, this.h - pl_y - this.headerHeigth * 6, 1 + g_plmanager.totalPlaylistsVis, this.headerHeigth, this.offset);
		if (this.scrollbar.visible) {
			this.scrollbarWidth = this.scrollbar.w;
		} else {
			this.scrollbarWidth = 0;
		}
	}

	this.draw = function (gr) {
		if (this.side == "right") {
			this.x = ww - this.delta;
		} else {
			this.x = properties.showleftPanel ? 0 : 0 - this.w + this.delta; //- this.w + this.delta;
		}
		this.h = wh - Bar_h - ((largeNowPlayingArtwork && properties.showBottomPanel && pl_w > 100 && wh > 750) ? pl_w : 0);

		gr.FillSolidRect(this.x, this.y, this.w, this.h, col_bg_pl);

		// draw playlists items (rows)
		var count = 0;
		for (var i = 0; i < this.totalPlaylists; i++) {
			if (this.playlists[i].type == 2 || this.playlists[i].type == 3) {
				this.playlists[i].draw(gr, count);
				count++;
			}
		}

		//gr.FillSolidRect(this.x, this.y, this.w, this.y + pl_y + this.headerHeigth * 5 + pl_sep * 2, col_bg_pl);
		//gr.FillSolidRect(this.x, this.y, this.w+300, this.headerHeigth, RGBA(255,25,55,30));
		//gr.FillSolidRect(this.x, this.y + this.headerHeigth, this.w+300, this.headerHeigth, RGBA(25,225,55,30));
		//gr.FillSolidRect(this.x, this.y + this.headerHeigth*2, this.w+300, this.headerHeigth, RGBA(25,225,255,30));

		var bt_size = 27;

		// New playlist
		if (!g_dragup_timer) {
			if (this.ishoverNewPlaylist)
				gr.FillSolidRect(this.x, this.y + pl_y + this.headerHeigth * 4 + pl_sep * 2 - (this.offset * this.headerHeigth), this.w, this.headerHeigth, RGBA(255, 255, 255, 25));
		} else if (g_dragup_flash && g_flash_idx == -99)
			gr.FillSolidRect(this.x, this.y + pl_y + this.headerHeigth * 4 + pl_sep * 2 - (this.offset * this.headerHeigth), this.w, this.headerHeigth, RGBA(255, 255, 255, 25));
		gr.DrawImage(icons25v35, this.x + plXmarg - (pl_w < 100 ? 9 : 6), this.y + pl_y + this.headerHeigth * 4 + pl_sep * 2 + 4 - (this.offset * this.headerHeigth), 27, 27, 0, 27 * 19, 27, 27, 0, 255);
		if (pl_w > 100)
			gr.GdiDrawText("New playlist", playlistsFont2, playlists_col_col, this.x + plXmarg + 30, this.y + pl_y + this.headerHeigth * 4 + pl_sep * 2 - (this.offset * this.headerHeigth), this.w - plXmarg * 2, this.headerHeigth, drawTextFormat2);

		// bg top
		gr.FillSolidRect(this.x, this.y, this.w, this.y + pl_y + pl_sep * 6, col_bg_pl);

		// Collection
		if (tabActive == "Collection" && (fb.ActivePlaylist == 0 || ((plman.GetPlaylistName(fb.ActivePlaylist).substr(0, 20) == "Playlist Selection [") && old_pl_selection == 0)))
			gr.FillSolidRect(this.x, this.y + pl_y + this.headerHeigth + pl_sep, this.w, this.headerHeigth, accent_colour);
		if (this.ishoverCollection && !g_dragA)
			if (this.ishoverCollection && !g_dragR)
				gr.FillSolidRect(this.x, this.y + pl_y + this.headerHeigth + pl_sep, this.w, this.headerHeigth, RGBA(255, 255, 255, 25));
		if (pl_w < 100)
			gr.DrawImage(icons25v35, this.x + plXmarg - 10, this.y + pl_y + this.headerHeigth + pl_sep + 4, bt_size, bt_size, 0, bt_size * 14, bt_size, bt_size, 0, 255);
		if (pl_w > 100)
			gr.GdiDrawText("Collection", playlistsFont, (tabActive == "Collection" && (fb.ActivePlaylist == 0 || ((plman.GetPlaylistName(fb.ActivePlaylist).substr(0, 20) == "Playlist Selection [") && old_pl_selection == 0))) ? playlists_col_col : (plman.PlayingPlaylist == 0 || ((plman.GetPlaylistName(plman.PlayingPlaylist).substr(0, 20) == "Playlist Selection [") && old_pl_selection == 0)) ? accent_colour : playlists_col_col, this.x + plXmarg, this.y + pl_y + this.headerHeigth + pl_sep, this.w - plXmarg * 2, this.headerHeigth, drawTextFormat2);

		// Favorites
		if (tabActive == "Collection" && "Favorites" == plman.GetPlaylistName(fb.ActivePlaylist) || (plman.GetPlaylistName(fb.ActivePlaylist).substr(0, 20) == "Playlist Selection [") && "Favorites" == plman.GetPlaylistName(old_pl_selection))
			gr.FillSolidRect(this.x, this.y + pl_y + this.headerHeigth * 2 + pl_sep, this.w, this.headerHeigth, accent_colour);

		if (this.ishoverFavorites && !g_dragA)
			if (this.ishoverFavorites && !g_dragR)
				gr.FillSolidRect(this.x, this.y + pl_y + this.headerHeigth * 2 + pl_sep, this.w, this.headerHeigth, RGBA(255, 255, 255, 25));
		if (pl_w < 100)
			gr.DrawImage(iconsW_img, this.x + plXmarg - 9, this.y + pl_y + this.headerHeigth * 2 + pl_sep + 4, bt_size, bt_size, 0, bt_size * 33, bt_size, bt_size, 0, 255);
		if (pl_w > 100)
			gr.GdiDrawText("Favorites", playlistsFont, (tabActive == "Collection" && "Favorites" == plman.GetPlaylistName(fb.ActivePlaylist) || (plman.GetPlaylistName(fb.ActivePlaylist).substr(0, 20) == "Playlist Selection [") && "Favorites" == plman.GetPlaylistName(old_pl_selection)) ? playlists_col_col : ("Favorites" == plman.GetPlaylistName(plman.PlayingPlaylist) || ((plman.GetPlaylistName(plman.PlayingPlaylist).substr(0, 20) == "Playlist Selection [") && "Favorites" == plman.GetPlaylistName(old_pl_selection))) ? accent_colour : playlists_col_col, this.x + plXmarg, this.y + pl_y + this.headerHeigth * 2 + pl_sep, this.w - plXmarg * 2, this.headerHeigth, drawTextFormat2);

		// Now playing
		if (tabActive == "Now_Playing")
			gr.FillSolidRect(this.x, this.y + pl_y + this.headerHeigth * 3 + pl_sep, this.w, this.headerHeigth, accent_colour);

		if (this.ishoverNP && !g_dragA)
			if (this.ishoverNP && !g_dragR)
				gr.FillSolidRect(this.x, this.y + pl_y + this.headerHeigth * 3 + pl_sep, this.w, this.headerHeigth, RGBA(255, 255, 255, 25));

		if (pl_w > 100)
			gr.GdiDrawText("Now playing", playlistsFont, playlists_col_col, this.x + plXmarg, this.y + pl_y + this.headerHeigth * 3 + pl_sep, this.w - plXmarg * 2, this.headerHeigth, drawTextFormat2);

		if (plman.GetPlaybackQueueCount()) {
			var queue_total_width = gr.CalcTextWidth(plman.GetPlaybackQueueCount(), playlistsFont);
			if (pl_w < 100) {
				gr.FillSolidRect(this.x + this.w - Math.round((this.w + queue_total_width + 20) / 2), this.y + pl_y + this.headerHeigth * 3 + pl_sep + 3, queue_total_width + 20, this.headerHeigth - 6, accent_colour);
				gr.GdiDrawText(plman.GetPlaybackQueueCount(), gdi.Font("Segoe UI", 14, 1), playlists_col_col, this.x, this.y + pl_y + this.headerHeigth * 3 + pl_sep, this.w, this.headerHeigth, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			} else {
				gr.FillSolidRect(this.x + this.w - 30 - queue_total_width - 10, this.y + pl_y + this.headerHeigth * 3 + pl_sep + 3, queue_total_width + 20, this.headerHeigth - 6, accent_colour);
				gr.GdiDrawText(plman.GetPlaybackQueueCount(), gdi.Font("Segoe UI", 14, 1), playlists_col_col, this.x + 30, this.y + pl_y + this.headerHeigth * 3 + pl_sep, this.w - 60, this.headerHeigth, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			}
		} else if (pl_w < 100)
			gr.DrawImage(icons25v35, this.x + plXmarg - 9, this.y + pl_y + this.headerHeigth * 3 + pl_sep + 4, bt_size, bt_size, 0, bt_size * 10, bt_size, bt_size, 0, 255);

		// Separators
		gr.FillSolidRect(this.x + 20, this.y + pl_y + this.headerHeigth + Math.round(pl_sep / 2), this.w - 40, 1, properties.darkTheme ? RGB(47, 47, 47) : col_plSeparator);
		gr.FillSolidRect(this.x + 20, this.y + pl_y + this.headerHeigth * 4 + pl_sep + Math.round(pl_sep / 2), this.w - 40, 1, properties.darkTheme ? RGB(47, 47, 47) : col_plSeparator);
		//pl_w < 100 && gr.FillSolidRect(this.x + 20, this.y + pl_y - 15, this.w - 40, 1, properties.darkTheme ? RGB(47, 47, 47) : col_plSeparator);


		if (pl_w > 150) {
			gr.GdiDrawText("Fusion Beta", gdi.Font("Segoe UI", 20, 0), playlists_col_col, this.x + plXmarg + 0, this.y + 40 + 4, this.w - 25, this.headerHeigth, drawTextFormat2);
		}

		// inputBox
		if (pl_w < 100) {
			if (this.ishoverSearch && !g_dragA)
				if (this.ishoverSearch && !g_dragR)
					gr.FillSolidRect(this.x, this.y + pl_y, this.w, this.headerHeigth, RGBA(255, 255, 255, 25));
			gr.DrawImage(iconsSearch, this.x + plXmarg - 9, this.y + pl_y + 4, 40 - 13, 40 - 13, 0, 0, 40, 40);
		} else {
			if (g_filterbox.inputbox.visible)
				g_filterbox.draw(gr);
		}

		this.scrollbar.draw(gr);

	}

	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	this.checkstate = function (event, x, y, step) {
		this.ishover = traceMouse(x, y, this.x, this.y, this.w, this.h);
		switch (event) {
		case "down":
			if (this.scrollbar.visible)
				this.scrollbar.check(event, x, y, step);
			break;
		case "up":
			if (this.scrollbar.visible)
				this.scrollbar.check(event, x, y, step);
			if (this.ishoverNewPlaylist) {
				if (g_dragA) {
					g_drag_timer = false;
					g_dragup_flashescounter = 0;
					g_dragup_timer = fb.CreateProfiler();
					npl_type = 1;
					npl_files = g_browser.albums_draw[g_dragA_idx].pl;
					g_newPlaylist.inputbox.text = "";
					g_newPlaylist.inputbox.offset = 0;
					g_dragA = false;
					g_dragA_idx = -1;
				} else if (g_dragR) {
					g_drag_timer = false;
					g_dragup_flashescounter = 0;
					g_dragup_timer = fb.CreateProfiler();
					npl_type = 1;
					npl_files = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
					g_newPlaylist.inputbox.text = "";
					g_newPlaylist.inputbox.offset = 0;
					g_dragR = false;
				} else {
					npl_type = 0;
					g_newPlaylist.inputbox.text = "";
					g_newPlaylist.inputbox.offset = 0;
				}
				this.ishoverNewPlaylist = false;
				NewPlaylistDialog = true;
				g_newPlaylist.inputbox.dblclk = false;
				g_newPlaylist.inputbox.edit = true;
				g_newPlaylist.inputbox.Cpos = g_newPlaylist.inputbox.GetCPos(x);
				g_newPlaylist.inputbox.anchor = g_newPlaylist.inputbox.Cpos;
				g_newPlaylist.inputbox.SelBegin = g_newPlaylist.inputbox.Cpos;
				g_newPlaylist.inputbox.SelEnd = g_newPlaylist.inputbox.Cpos;
				g_newPlaylist.inputbox.resetCursorTimer();

				returnedPos = false;
				window.Repaint();

			} else if (this.ishoverSearch) {
				if (pl_w < 100) {
					window.SetProperty("Playlist Manager - Width", (pl_w == pl_deafult_w) ? (pl_w = pl_minideafult_w) : (pl_w = pl_deafult_w));
					on_size();
					g_plmanager = new playlistPanelObject("g_plmanager");
					eval(this.objectName).setPlaylistList();
					g_filterbox.inputbox.visible = true;
					g_filterbox.inputbox.dblclk = false;
					g_filterbox.inputbox.edit = true;
					g_filterbox.inputbox.Cpos = g_newPlaylist.inputbox.GetCPos(x);
					g_filterbox.inputbox.anchor = g_newPlaylist.inputbox.Cpos;
					g_filterbox.inputbox.SelBegin = g_newPlaylist.inputbox.Cpos;
					g_filterbox.inputbox.SelEnd = g_newPlaylist.inputbox.Cpos;
					g_filterbox.inputbox.resetCursorTimer();
					g_showlist.idx = g_showlist.rowIdx = -1;
					g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
				}
			} else if (this.ishoverCollection) {
			if (tabActive != "Collection")
				g_info && g_info.refresh();
				tabActive = "Collection";
				returnedPos = false;
				plman.ActivePlaylist = 0;
			} else if (this.ishoverFavorites) {
			if (tabActive != "Collection")
				g_info && g_info.refresh();
				tabActive = "Collection";
				returnedPos = false;
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
					plman.ActivePlaylist = plIndex;
					window.RepaintRect(0, 0, ww, wh - Bar_h);
					CollectGarbage();
					return true;
				} else
					plIndex = 1;
				fb.CreateAutoPlaylist(plIndex, str, "Mood IS Like it", "", 0);
				plman.ActivePlaylist = plIndex;
			} else if (this.ishoverNP) {
				tabActive = "Now_Playing";
				g_queue && g_queue.refresh();
				g_info && g_info.refresh();
			} else if (this.ishover) {
				if (this.ishoverPlaylists)
					for (var i = 0; i < this.playlists.length; i++) {
						this.playlists[i].checkstate("up", x, y, i);
					}
			}

			g_dragR = false;
			window.RepaintRect(0, 0, ww, wh - Bar_h);
			CollectGarbage();
			break;
		case "lbtn_dblclk":
			// inputBox
			if (g_filterbox && g_filterbox.inputbox.visible)
				if (g_filterbox.inputbox.hover)
					g_filterbox.on_mouse("lbtn_dblclk", x, y);

			if (this.ishoverPlaylists)
				for (var i = 0; i < this.playlists.length; i++) {
					this.playlists[i].checkstate("lbtn_dblclk", x, y, i);
				}
			break;
		case "rbtn_up":
			if (this.ishoverPlaylists)
				for (var i = 0; i < this.playlists.length; i++) {
					this.playlists[i].checkstate("rbtn_up", x, y, i);
				}
			break;
		case "mbtn_up":
			if (this.ishoverPlaylists)
				for (var i = 0; i < this.playlists.length; i++) {
					this.playlists[i].checkstate("mbtn_up", x, y, i);
				}
			break;
		case "wheel":
			/*var area_h = this.h - pl_y - this.headerHeigth * 5 - pl_sep * 2;
			var row_h = this.headerHeigth;
			var area_h_vis = Math.floor(area_h / row_h) * row_h;

			if (step > 0) {
			if (this.offset > 0)
			this.offset--;
			} else
			if ((this.totalPlaylistsVis - this.offset) * row_h > area_h_vis)
			this.offset++;

			//if (this.ishoverPlaylists)
			for (var i = 0; i < g_plmanager.playlists.length; i++) {
			g_plmanager.playlists[i].checkstate("move", x, y, i);
			}*/

			if (this.scrollbar.visible)
				this.scrollbar.check(event, x, y, step);
			//this.repaint();
			break;
		case "move":
			this.scrollbar.check(event, x, y, step);
			if (this.scrollbar.cursorDrag)
				return;

			this.ishoverSearch = traceMouse(x, y, this.x, this.y + pl_y, this.w - this.scrollbarWidth, this.headerHeigth - 1);
			this.ishoverCollection = traceMouse(x, y, this.x, this.y + pl_y + this.headerHeigth + pl_sep, this.w - this.scrollbarWidth, this.headerHeigth - 1);
			this.ishoverFavorites = traceMouse(x, y, this.x, this.y + pl_y + this.headerHeigth * 2 + pl_sep, this.w - this.scrollbarWidth, this.headerHeigth - 1);
			this.ishoverNP = traceMouse(x, y, this.x, this.y + pl_y + this.headerHeigth * 3 + pl_sep, this.w - this.scrollbarWidth, this.headerHeigth - 1);
			this.ishoverNewPlaylist = !this.offset && traceMouse(x, y, this.x, this.y + pl_y + this.headerHeigth * 4 + pl_sep * 2, this.w - this.scrollbarWidth, this.headerHeigth - 1);
			this.ishoverPlaylists = traceMouse(x, y, this.x, this.y + pl_y + this.headerHeigth + pl_sep, this.w - this.scrollbarWidth, this.h - pl_y - this.headerHeigth - pl_sep);

			if (g_filterbox.inputbox.visible) {
				g_filterbox.on_mouse("move", x, y);
			}

			this.old0 = this.state0;
			this.state0 = (this.ishoverSearch && (!g_dragA || !g_dragR)) ? true : false;
			if (this.old0 != this.state0)
				window.RepaintRect(this.x, this.y + pl_y, this.w, this.headerHeigth);

			this.old1 = this.state1;
			this.state1 = (this.ishoverCollection && (!g_dragA || !g_dragR)) ? true : false;
			if (this.old1 != this.state1)
				window.RepaintRect(this.x, this.y + pl_y + this.headerHeigth + pl_sep, this.w, this.headerHeigth);

			this.old2 = this.state2;
			this.state2 = (this.ishoverFavorites && (!g_dragA || !g_dragR)) ? true : false;
			if (this.old2 != this.state2)
				window.RepaintRect(this.x, this.y + pl_y + this.headerHeigth * 2 + pl_sep, this.w, this.headerHeigth);

			this.old4 = this.state4;
			this.state4 = (this.ishoverNP && (!g_dragA || !g_dragR)) ? true : false;
			if (this.old4 != this.state4)
				window.RepaintRect(this.x, this.y + pl_y + this.headerHeigth * 3 + pl_sep, this.w, this.headerHeigth);

			this.old3 = this.state3;
			this.state3 = (this.ishoverNewPlaylist && (!g_dragA || !g_dragR)) ? true : false;
			if (this.old3 != this.state3)
				window.RepaintRect(this.x, this.y + pl_y + this.headerHeigth * 4 + pl_sep * 2, this.w, this.headerHeigth);

			//if (this.ishoverPlaylists)
			for (var i = 0; i < this.playlists.length; i++) {
				this.playlists[i].checkstate("move", x, y, i);
			}

			break;
		case "leave":
			this.scrollbar.check(event, x, y, step);

			if (g_filterbox.inputbox.visible) {
				g_filterbox.on_mouse("leave");
			}

			this.ishoverSearch = false;
			this.ishoverCollection = false;
			this.ishoverFavorites = false;
			this.ishoverNP = false;
			this.ishoverNewPlaylist = false;
			this.ishoverPlaylists = false;

			for (var i = 0; i < this.playlists.length; i++) {
				this.playlists[i].checkstate("leave", 0, 0, i);
			}

			this.repaint();
			break;
		}

	}
}

var playlistItemObject = function (id, name, objectName) {
	this.objectName = objectName;
	this.id = id;
	this.name = name;
	this.x = 0;
	this.y = 0;
	this.w = pl_w;
	this.h = pl_h;
	this.flash = false;
	this.state = false;
	this.plm_rbtnUp = false;

	switch (true) {
	case name == "Collection":
	case name == "Favorites":
	case name.substr(0, 20) == "Playlist Selection [":
	case name == "Queue Content":
		this.type = 0;
		break;
	default:
		this.type = 2;
		this.objectName.totalPlaylistsVis++;
		break;
	}

	this.setButtons = function () {
		var gb;
		this.close_img = gdi.CreateImage(34, 34);
		gb = this.close_img.GetGraphics();
		this.close_img.ReleaseGraphics(gb);

		if (typeof(this.close_bt) == "undefined")
			this.close_bt = new button(this.close_img, this.close_img, this.close_img);
		else
			this.close_bt.update(this.close_img, this.close_img, this.close_img);
	}
	this.setButtons();

	this.draw = function (gr, drawIdx) {
		this.x = this.objectName.x;
		this.y = this.objectName.y + pl_y + this.objectName.headerHeigth * 5 + pl_sep * 2 + (drawIdx * this.h) - (this.objectName.offset * this.h);
		this.ishover2 = (m_x > this.x && m_x < this.x + this.w && m_y >= this.y && m_y < this.y + this.h);
		if (this.y >= this.objectName.y && this.y < wh) {
			/*
			var parity = ((this.id / 2) == Math.floor(this.id / 2) ? 1 : 0);
			if (parity == 1)
			gr.FillSolidRect(this.x, this.y, this.w, this.h, RGBA(255, 255, 255, 5));
			 */

			var ActivePlaylist = fb.ActivePlaylist;

			if (tabActive == "Collection" && ActivePlaylist == this.id)
				gr.FillSolidRect(this.x, this.y, this.w, this.h, accent_colour);

			if (tabActive == "Collection" && (plman.GetPlaylistName(ActivePlaylist).substr(0, 20) == "Playlist Selection [") && old_pl_selection == this.id)
				gr.FillSolidRect(this.x, this.y, this.w, this.h, accent_colour);

			if ((g_dragA || g_dragR) && this.ishover2 && this.type == 2 && !fb.IsAutoPlaylist(this.id)) {
				gr.FillSolidRect(this.x, this.y, this.w, this.h, RGBA(250, 250, 250, 30));
			} else {
				if (g_dragup_timer && this.id == g_flash_idx) {
					if (g_dragup_flash) {
						gr.FillSolidRect(this.x, this.y, this.w, this.h, RGBA(200, 200, 200, 30));
					}
				}
			}

			if ((this.ishover3 || this.plm_rbtnUp) && !(g_dragA || g_dragR))
				gr.FillSolidRect(this.x, this.y, this.w, this.h, RGBA(255, 255, 255, 25));

			var img_h = 27;
			if ((tabActive == "Collection" && ActivePlaylist == this.id) || ((plman.GetPlaylistName(ActivePlaylist).substr(0, 20) == "Playlist Selection [") && old_pl_selection == this.id))
				gr.DrawImage(icons25v35, this.x + plXmarg - (pl_w < 100 ? 10 : 7), this.y + Math.round((this.h - img_h) / 2) - 2, img_h, img_h, 0, img_h * 13, img_h, img_h, 0, ((g_dragA || g_dragR) && fb.IsAutoPlaylist(this.id) && ActivePlaylist != this.id) ? 100 : 255);
			else if (plman.PlayingPlaylist == this.id)
				playlistPlayedIcon && gr.DrawImage(playlistPlayedIcon, this.x + plXmarg - (pl_w < 100 ? 10 : 7), this.y + Math.round((this.h - playlistPlayedIcon.Height) / 2) - 2, playlistPlayedIcon.Width, playlistPlayedIcon.Height, 0, 0, playlistPlayedIcon.Width, playlistPlayedIcon.Height, 0, ((g_dragA || g_dragR) && fb.IsAutoPlaylist(this.id) && ActivePlaylist != this.id) ? 100 : 255);
			else
				gr.DrawImage(icons25v35, this.x + plXmarg - (pl_w < 100 ? 10 : 7), this.y + Math.round((this.h - img_h) / 2) - 2, img_h, img_h, img_h * 0, img_h * 13, img_h, img_h, 0, ((g_dragA || g_dragR) && fb.IsAutoPlaylist(this.id) && ActivePlaylist != this.id) ? 100 : 255);

			gr.GdiDrawText(this.name, playlistsFont2, ((g_dragA || g_dragR) && fb.IsAutoPlaylist(this.id) && ActivePlaylist != this.id) ? RGB(130, 130, 130) : ((tabActive == "Collection" && ActivePlaylist == this.id) || ((plman.GetPlaylistName(ActivePlaylist).substr(0, 20) == "Playlist Selection [") && old_pl_selection == this.id)) ? RGB(255, 255, 255) : plman.PlayingPlaylist == this.id ? accent_colour : playlists_col_col, this.x + plXmarg + 30, this.y, this.w - 80 - (properties.showPlCountTracks ? gr.CalcTextWidth(plman.PlaylistItemCount(this.id) + " ", playlistsFont2) + 20 : 0), this.h, drawTextFormat2);

			if (properties.showPlCountTracks)
				gr.GdiDrawText(plman.PlaylistItemCount(this.id), playlistsFont2, ((tabActive == "Collection" && ActivePlaylist == this.id) || ((plman.GetPlaylistName(ActivePlaylist).substr(0, 20) == "Playlist Selection [") && old_pl_selection == this.id)) ? playlists_col_col : plman.PlayingPlaylist == this.id ? accent_colour : RGB(130, 130, 130), this.x + 55, this.y, this.w - 90, this.h, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);

			//if ((g_dragA || g_dragR) && fb.IsAutoPlaylist(this.id) && ActivePlaylist != this.id)
			//	gr.FillSolidRect(this.x, this.y, this.w, this.h, setAlpha(col_bg_pl, 150));

			/*
			if (this.ishover2 && !(g_dragA || g_dragR)) {
			this.close_bt.draw(gr,  this.x + this.w - 30 - 21, this.y + Math.round((this.h - img_h) / 2) - 1, 255);
			gr.DrawImage(icons25v35, this.x + this.w - 30 - 21, this.y + Math.round((this.h - img_h) / 2) - 1, img_h, img_h, 0, img_h * 29, img_h, img_h, 0, 255);
			}*/
		}
	}

	this.checkstate = function (event, x, y, id) {
		this.ishover2 = traceMouse(x, y, this.x, this.y, this.w - this.objectName.scrollbarWidth, this.h);
		this.ishover3 = traceMouse(x, y, this.x, this.y, this.w - this.objectName.scrollbarWidth, this.h - 1);
		switch (event) {
		case "up":
			if (this.ishover2 && this.type != 0) {
				returnedPos = false;
				if (g_dragA) {
					g_drag_timer = false;
					g_flash_idx = this.id;
					g_dragup_flashescounter = 0;
					g_dragup_timer = fb.CreateProfiler();
					// add dragged tracks to the target playlist
					plman.InsertPlaylistItems(this.id, plman.PlaylistItemCount(this.id), g_browser.albums_draw[g_dragA_idx].pl, false);
					g_dragA = false;
					g_dragA_idx = -1;
				} else if (g_dragR) {
					g_drag_timer = false;
					g_flash_idx = this.id;
					g_dragup_flashescounter = 0;
					g_dragup_timer = fb.CreateProfiler();
					// add dragged tracks to the target playlist
					plman.InsertPlaylistItems(this.id, plman.PlaylistItemCount(this.id), plman.GetPlaylistSelectedItems(plman.ActivePlaylist), false);
					g_dragR = false;
				} else {
					plman.ActivePlaylist = this.id;
					tabActive = "Collection";
				}

			}
			break;
		case "lbtn_dblclk":
			if (this.ishover2 && this.type != 0) {
				if (fb.PlaylistItemCount(this.id) > 0)
					plman.ExecutePlaylistDefaultAction(this.id, 0);
			}
			break;
		case "rbtn_up":
			if (this.ishover2 && this.type != 0) {
				this.plm_rbtnUp = true;
				playlist_context_menu(x, y, this.id, true);
			}
			break;
		case "mbtn_up":
			if (this.ishover2 && this.type != 0) {
				fb.RemovePlaylist(this.id);
				g_plmanager.setPlaylistList();
				window.Repaint();
			}
			break;
		case "move":
			this.old = this.state;
			this.state = (this.ishover3 && (!g_dragA || !g_dragR)) ? true : false;
			if (this.old != this.state)
				window.RepaintRect(this.x, this.y, this.w, this.h);
			break;
		case "leave":
			this.ishover3 = false;
			break;
		}
		return this.ishover2;
	}

}

var filterBox = function () {
	var temp_bmp = gdi.CreateImage(1, 1);
	var temp_gr = temp_bmp.GetGraphics();
	var g_timer_cursor = false;
	var g_cursor_state = true;
	clipboard = {
		text : null
	}
	images = {
		resetIcon_off : null,
		resetIcon_ov : null,
		searchIcon_off : null,
		searchIcon_ov : null,
		searchIcon_on : null
	}

	this.getImages = function () {
		var gb;
		images.resetIcon_off = gdi.CreateImage(pl_h, pl_h);
		gb = images.resetIcon_off.GetGraphics();
		gb.FillSolidRect(2, 2, images.resetIcon_off.Width - 4, images.resetIcon_off.Height - 4, RGBA(0, 0, 0, 0));
		gb.setSmoothingMode(2);
		X = 8;
		gb.DrawLine(X + 5, X + 5, X + 13, X + 13, 2.0, RGB(0, 0, 0));
		gb.DrawLine(X + 5, X + 13, X + 13, X + 5, 2.0, RGB(0, 0, 0));
		gb.setSmoothingMode(0);
		images.resetIcon_off.ReleaseGraphics(gb);

		images.resetIcon_ov = gdi.CreateImage(pl_h, pl_h);
		gb = images.resetIcon_ov.GetGraphics();
		gb.FillSolidRect(2, 2, images.resetIcon_ov.Width - 4, images.resetIcon_ov.Height - 4, RGBA(0, 0, 0, 25));
		gb.setSmoothingMode(2);
		X = 8;
		gb.DrawLine(X + 5, X + 5, X + 13, X + 13, 2.0, RGB(0, 0, 0));
		gb.DrawLine(X + 5, X + 13, X + 13, X + 5, 2.0, RGB(0, 0, 0));
		gb.setSmoothingMode(0);
		images.resetIcon_ov.ReleaseGraphics(gb);

		if (typeof(this.reset_bt) == "undefined") {
			this.reset_bt = new button(images.resetIcon_off, images.resetIcon_ov, images.resetIcon_ov);
		} else {
			this.reset_bt.img[0] = images.resetIcon_off;
			this.reset_bt.img[1] = images.resetIcon_ov;
			this.reset_bt.img[2] = images.resetIcon_ov;
		}

		images.searchIcon_off = gdi.CreateImage(pl_h, pl_h);
		gb = images.searchIcon_off.GetGraphics();
		gb.DrawImage(iconsSearch, 4, 4, 40 - 13, 40 - 13, 0, 0, 40, 40);
		images.searchIcon_off.ReleaseGraphics(gb);

		images.searchIcon_ov = gdi.CreateImage(pl_h, pl_h);
		gb = images.searchIcon_ov.GetGraphics();
		gb.FillSolidRect(2, 2, images.searchIcon_ov.Width - 4, images.searchIcon_ov.Height - 4, accent_colour);
		gb.DrawImage(iconsSearch, 4, 4, 40 - 13, 40 - 13, 0, 0, 40, 40);
		images.searchIcon_ov.ReleaseGraphics(gb);

		images.searchIcon_on = gdi.CreateImage(pl_h, pl_h);
		gb = images.searchIcon_on.GetGraphics();
		gb.FillSolidRect(2, 2, images.searchIcon_on.Width - 4, images.searchIcon_on.Height - 4, RGB(58, 58, 58));
		gb.DrawImage(iconsSearch, 4, 4, 40 - 13, 40 - 13, 0, 0, 40, 40);
		images.searchIcon_on.ReleaseGraphics(gb);

		if (typeof(this.search_bt) == "undefined") {
			this.search_bt = new button(images.searchIcon_off, images.searchIcon_ov, images.searchIcon_on);
		} else {
			this.search_bt.img[0] = images.searchIcon_off;
			this.search_bt.img[1] = images.searchIcon_ov;
			this.search_bt.img[2] = images.searchIcon_on;
		}
	}
	this.getImages();

	this.on_init = function () {
		this.inputbox = new oInputbox(pl_w < 100 ? 100 : pl_w - 115, 25, "", "Search", RGBA(155, 155, 155), col_searchBox_bg, 0, RGBA(0, 0, 0, 30), g_sendResponse, "g_filterbox", RGB(255, 255, 255), RGB(34, 34, 34));
		this.inputbox.autovalidation = true;
	}
	this.on_init();

	this.draw = function (gr) {
		var bx = g_plmanager.x + 20;
		var by = pl_y;
		var bw = pl_w < 100 ? 100 : pl_w - 40;

		if (this.inputbox.edit || this.inputbox.text.length > 0) {
			gr.FillSolidRect(bx, by, bw, pl_h, RGB(255, 255, 255));
		} else {
			gr.FillSolidRect(bx, by, bw, pl_h, col_searchBox_bg);
		}

		var bt_size = 42;

		this.inputbox.draw(gr, bx + plXmarg - 20, by + 6, 0, 0);
		if (this.inputbox.text.length > 0)
			this.reset_bt.draw(gr, bx + bw - pl_h - pl_h, by, 255);

		if (this.inputbox.edit || this.inputbox.text.length > 0)
			gr.FillSolidRect(bx + bw - pl_h + 2, by + 2, pl_h - 4, pl_h - 4, accent_colour);

		this.search_bt.draw(gr, bx + bw - pl_h, by, 255);

	}

	this.repaint = function () {
		window.RepaintRect(g_plmanager.x + 15, pl_y, pl_w, pl_h);
	}

	this.on_mouse = function (event, x, y, delta) {
		switch (event) {
		case "lbtn_down":
			this.inputbox.check("down", x, y);
			if (this.inputbox.text.length > 0) {
				this.reset_bt.checkstate("down", x, y);
				this.search_bt.checkstate("down", x, y);
			}
			break;
		case "lbtn_up":
			this.inputbox.check("up", x, y);
			if (this.inputbox.text.length > 0) {
				if (this.reset_bt.checkstate("up", x, y) == ButtonStates.hover) {
					this.inputbox.text = "";
					this.inputbox.offset = 0;
					g_sendResponse();
				}
			}
			if (this.search_bt.checkstate("up", x, y) == ButtonStates.hover) {
				g_sendResponse();
			}
			break;
		case "lbtn_dblclk":
			this.inputbox.check("dblclk", x, y);
			break;
		case "rbtn_down":
			this.inputbox.check("right", x, y);
			break;
		case "move":
			this.inputbox.check("move", x, y);
			if (this.inputbox.text.length > 0) {
				this.reset_bt.checkstate("move", x, y);
				this.search_bt.checkstate("move", x, y);
			}
			break;
		}
	}

	this.on_key = function (event, vkey) {
		switch (event) {
		case "down":
			this.inputbox.on_key_down(vkey);
			break;
		}
	}

	this.on_char = function (code) {
		this.inputbox.on_char(code);
	}

	this.on_focus = function (is_focused) {
		this.inputbox.on_focus(is_focused);
	}
}

// Filterbox

function g_sendResponse() {
	if (g_showlist && g_filterbox) {
		g_hiddenLoadTimer && window.ClearTimeout(g_hiddenLoadTimer);
		g_hiddenLoadTimer = false;

		if (g_filterbox.inputbox.text.length == 0) {
			filter_text = "";
		} else {
			filter_text = g_filterbox.inputbox.text;
		}
		g_showlist.idx = -1;
		g_showlist.h = 0;
		g_showlist.rowIdx = -1;
		g_showlist.delta = 0;
		g_showlist.delta_ = 0;
		search(filter_text);
	}
}

function search(string) {
	if (g_browser) {
		str = process_string(filter_text);
		g_browser.albums_draw.splice(0, g_browser.albums_draw.length);
		var back_s = -1.5;
		//var row_count = g_browser.totalColumns;
		var row_count = g_browser.totalRows;
		for (var i in g_browser.albums) {
			for (var j in g_browser.albums[i].tr) {
				if (match(g_browser.albums[i].tr[j], str) || string.length == 0) {
					back_s = g_browser.albums_draw.length;
					g_browser.albums_draw.push(g_browser.albums[i]);
					(g_browser.albums[i].i - back_s > row_count) ? (g_browser.albums[i].i = back_s + row_count) : 0;
					(g_browser.albums[i].i - back_s < -row_count) ? (g_browser.albums[i].i = back_s - row_count) : 0;
					break;
				} else
					g_browser.albums[i].i = (back_s - i < row_count) ? (back_s + 0.5) : i - row_count;
			}
		}
		scroll && (scroll_ = g_browser.rowHeight * 2);
		scroll = 0;

		g_browser.rowsCount = Math.ceil(g_browser.albums_draw.length / g_browser.totalColumns);
		g_scrollbar.setCursor(g_browser.totalRowsVis * g_browser.rowHeight, g_browser.rowHeight * g_browser.rowsCount + g_showlist.h, scroll_);
		g_browser.repaint();
	}
}

// Playback Queue tools

function isQueuePlaylistActive() {
	var queue_pl_idx = isQueuePlaylistPresent();
	if (queue_pl_idx < 0) {
		return false;
	} else if (plman.ActivePlaylist == queue_pl_idx) {
		return true;
	}
}

function isQueuePlaylistPresent() {
	for (var i = 0; i < plman.PlaylistCount; i++) {
		if (plman.GetPlaylistName(i) == "Queue Content")
			return i;
	}
	return -1;
}

function ShowPlaylistQueue(focus_id) {
	var total_pl = plman.PlaylistCount;
	var queue_pl_idx = isQueuePlaylistPresent();
	if (queue_pl_idx < 0) {
		plman.CreatePlaylist(total_pl, "Queue Content");
		queue_pl_idx = total_pl;
		plman.ActivePlaylist = queue_pl_idx;
	} else {
		plman.ActivePlaylist = queue_pl_idx;
		fb.ClearPlaylist();
	}
	var queue_total = plman.GetPlaybackQueueCount();
	var vbarr = plman.GetPlaybackQueueContents();
	var arr = vbarr.toArray();
	var q_handlelist = plman.GetPlaylistSelectedItems(queue_pl_idx);
	q_handlelist.RemoveAll();
	for (var i = 0; i < queue_total; i++) {
		q_handlelist.Add(arr[i].Handle);
	}
	plman.InsertPlaylistItems(queue_pl_idx, i, q_handlelist, false);
	plman.SetPlaylistFocusItem(queue_pl_idx, focus_id);
}
