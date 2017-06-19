var row = function (metadb, idx, rowIdx, plindx) {
	this.Selection_cover;
	this.metadb = metadb;
	this.idx = idx;
	this.rowIdx = rowIdx;
	this.stampDrawMode = 0;
	this.row = properties.listColumnsRow;
	this.h = this.row;
	this.title_w = 0;
	this.x = 0;
	this.y = 0;
	this.w = 0;
	this.plindx = plindx;

	this.tf_albumartist = fb.TitleFormat("[%album artist%]").evalWithMetadb(metadb);
	this.tf_artist = fb.TitleFormat("[%artist%]").evalWithMetadb(metadb);
	this.tf_album = fb.TitleFormat("[%album%]").evalWithMetadb(metadb);
	this.tf_tracknumber = fb.TitleFormat("[%tracknumber%]").evalWithMetadb(metadb);
	if (this.tf_tracknumber < 10 && this.tf_tracknumber != "")
		this.tf_tracknumber = this.tf_tracknumber.substr(1, 1);
	if (properties.separateAlbumsByDisc)
		this.tf_tracknumber = this.tf_tracknumber;
	else {
		this.tf_tracknumberdisc = fb.TitleFormat("[%discnumber%.]").evalWithMetadb(metadb);
		this.tf_tracknumber = this.tf_tracknumberdisc + this.tf_tracknumber;
	}
	this.tf_title = fb.TitleFormat("%title%").evalWithMetadb(metadb);
	this.tf_rating = fb.TitleFormat("%rating%").evalWithMetadb(metadb);
	this.tf_length = fb.TitleFormat("%length%").evalWithMetadb(metadb);
	this.tf_playcount = fb.TitleFormat("$if2(%play_counter%, $if2(%play_count%, 0))").evalWithMetadb(metadb);
	this.tf_mood = fb.TitleFormat("$if($stricmp(%mood%,),-1)$if($stricmp(%mood%,Like it),1)$if($stricmp(%mood%,Hate it),2)").evalWithMetadb(metadb);

	this.set_track_bt = function () {
		this.img = iconsW_img;
		this.bt_size = 27;
		if (this.playTrack_off)
			this.playTrack_off.Dispose();
		this.playTrack_off = gdi.CreateImage(this.bt_size, this.bt_size);
		gb = this.playTrack_off.GetGraphics();
		this.playTrack_off.ReleaseGraphics(gb);

		if (typeof(this.play_track_bt) == "undefined") {
			this.play_track_bt = new button(this.playTrack_off, this.playTrack_off, this.playTrack_off);
		} else {
			this.play_track_bt.img[0] = this.playTrack_off;
			this.play_track_bt.img[1] = this.playTrack_off;
			this.play_track_bt.img[2] = this.playTrack_off;
		}

		if (typeof(this.add_track_bt) == "undefined") {
			this.add_track_bt = new button(this.playTrack_off, this.playTrack_off, this.playTrack_off);
		} else {
			this.add_track_bt.img[0] = this.playTrack_off;
			this.add_track_bt.img[1] = this.playTrack_off;
			this.add_track_bt.img[2] = this.playTrack_off;
		}

		if (typeof(this.mood_track_bt) == "undefined") {
			this.mood_track_bt = new button(this.playTrack_off, this.playTrack_off, this.playTrack_off);
		} else {
			this.mood_track_bt.img[0] = this.playTrack_off;
			this.mood_track_bt.img[1] = this.playTrack_off;
			this.mood_track_bt.img[2] = this.playTrack_off;
		}

	}
	this.set_track_bt();

	this.draw = function (gr, x, y, w) {
		this.x = x;
		this.y = y;
		this.w = w;

		var tracknumber_w = 30;
		var length_w = 40;

		var duration = this.tf_length;
		var isPlaying = false;

		if (fb.IsPlaying) {
			try {
				if (this.metadb.Compare(fb.GetNowPlaying())) {
					isPlaying = true;
					g_showlist.playing_row_x = this.x;
					g_showlist.playing_row_y = this.y;
					g_showlist.playing_row_w = this.w;
					g_showlist.playing_row_h = this.h;
					duration = fb.TitleFormat("$if(%length%,$if(%playback_time_remaining%,-%playback_time_remaining%,'-0:00'),'0:00')").Eval(true);
				}
			} catch (e) {}
		}

		if (this.stampDrawMode) {
			gr.FillSolidRect(this.x, this.y, this.w, this.h, RGBA(50, 100, 150, 50));
		}

		var parity = ((this.rowIdx / 2) == Math.floor(this.rowIdx / 2) ? 1 : 0);
		if (parity == 1)
			gr.FillSolidRect(this.x, y, this.w, this.h, properties.listCoverColor ? setAlpha(colorSchemeBackInvert, 10) : setAlpha(colorSchemeText, 10));

		//if (this.clicked)
		//gr.FillSolidRect(this.x, y, this.w, this.h, properties.listCoverColor ? setAlpha(colorSchemeBackInvert, 25) : setAlpha(colorSchemeBackInvert, 40));
		//else if (this.ishover)
		//gr.FillSolidRect(this.x, y, this.w, this.h, setAlpha(colorSchemeText2, 30));

		//if (selected_row && this.metadb.Compare(selected_row)) {

		if (plman.IsPlaylistItemSelected(plman.ActivePlaylist, this.plindx)) {

			txtColor = colorSchemeTextSelect;
			shadowColor = colorSchemeTextSelect;
			queueColor = colorSchemeTextSelect;
			gr.FillSolidRect(this.x, y, this.w, this.h, colorSchemeBackInvert);

			if (isPlaying)
				g_showlist.playicon_on && gr.DrawImage(g_showlist.playicon_on, this.x + 23, this.y + this.row - Math.round((this.row + g_showlist.playicon_on.Height) / 2) - 2, g_showlist.playicon_on.Width, g_showlist.playicon_on.Height, 0, 0, g_showlist.playicon_on.Width, g_showlist.playicon_on.Height);
		} else {
			txtColor = colorSchemeText;
			shadowColor = colorSchemeText2;
			if (properties.listCoverColor)
				queueColor = colorSchemeBackInvert;
			else
				queueColor = accent_colour;

			if (isPlaying) {
				if (properties.listCoverColor) {
					g_showlist.playicon_off && gr.DrawImage(g_showlist.playicon_off, this.x + 23, this.y + this.row - Math.round((this.row + g_showlist.playicon_off.Height) / 2) - 2, g_showlist.playicon_off.Width, g_showlist.playicon_off.Height, 0, 0, g_showlist.playicon_off.Width, g_showlist.playicon_off.Height);
					txtColor = colorSchemeBackInvert;
					shadowColor = colorSchemeBackInvert;

				} else {
					g_showlist.playiconAccentColor && gr.DrawImage(g_showlist.playiconAccentColor, this.x + 23, this.y + this.row - Math.round((this.row + g_showlist.playiconAccentColor.Height) / 2) - 2, g_showlist.playiconAccentColor.Width, g_showlist.playiconAccentColor.Height, 0, 0, g_showlist.playiconAccentColor.Width, g_showlist.playiconAccentColor.Height);
					txtColor = accent_colour;
					shadowColor = accent_colour;
					queueColor = accent_colour;
				}
			}
		}

		var setTxt = marginL - 10;

		// Track N
		if (!isPlaying)
			gr.gdiDrawText(this.tf_tracknumber, listTracknumberFont, txtColor, this.x + setTxt, this.y, tracknumber_w, this.row, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);

		var tX = this.x + setTxt + tracknumber_w;
		var tW = this.w - setTxt - tracknumber_w - setTxt - length_w;

		var artistW = tW > 600 ? Math.round((tW - setTxt - 27) / 1.8) : tW;

		// Queue
		var queueIndexes = [];
		var queueIndexCount = [];
		var isPlaylistItemQueued = [];
		var queueContents = plman.GetPlaybackQueueContents().toArray();
		if (queueContents.length) {
			var queueIndex = plman.FindPlaybackQueueItemIndex(this.metadb, plman.ActivePlaylist, this.plindx);
			for (var q = 0; q != queueContents.length; q++) {
				var handle = queueContents[q].Handle;
				var indexCount = 0;
				if (this.metadb.Compare(handle)) {
					queueIndexes.push(queueIndex);
					isPlaylistItemQueued[i] = true;
					for (var qi = 0, l = queueIndexes.length; qi < l; qi++) {
						if (queueIndex == queueIndexes[qi])
							queueIndexCount[queueIndex] = ++indexCount;
					}
				}
			}
		}
		//var queue = ((queueContents.length && queueIndex != -1) ? ('    ' + (queueIndex + 1) + ' ' + (queueIndexCount[queueIndex] > 1 ? '*' + queueIndexCount[queueIndex] : '')) : '');
		var queue = ((queueContents.length && queueIndex != -1) ? (' [' + (queueIndex + 1) + ']' + (queueIndexCount[queueIndex] > 1 ? '*' + queueIndexCount[queueIndex] : '')) : '');

		queueW = gr.CalcTextWidth(queue, listdurationFont);
		titleW = gr.CalcTextWidth(this.tf_title, listTrackFont);

		if ((titleW + queueW + setTxt + 10) > artistW)
			titleW = artistW - setTxt - 10;

		showBtns = (this.ishover && !plman.IsPlaylistItemSelected(plman.ActivePlaylist, this.plindx));

		if (showBtns && ((titleW + queueW) > (artistW - 94)))
			titleW = artistW - 94;

		gr.gdiDrawText(this.tf_title, listTrackFont, txtColor, tX, this.y, titleW, this.row, drawTextFormat2);
		tX1 = tX + titleW;

		//gr.FillSolidRect(tX, y, titleW, this.row, setAlpha(colorSchemeText, 15));

		gr.gdiDrawText(queue, listdurationFont, queueColor, tX1, this.y, 50, this.row, drawTextFormat2);
		tX1 = tX1 + queueW;

		if (showBtns) {
			this.play_track_bt.draw(gr, Math.round(tX1 + 10), this.y + this.row - Math.round((this.row + 27) / 2) - 1, 255);
			gr.DrawImage(g_showlist.img, Math.round(tX1 + 10), this.y + this.row - Math.round((this.row + 27) / 2) - 1, 27, 27, this.play_track_bt.state == ButtonStates.hover ? 27 : this.play_track_bt.state == ButtonStates.down ? 27 * 2 : 0, 27 * 40, 27, 27);

			this.add_track_bt.draw(gr, Math.round(tX1 + 10 + 27), this.y + this.row - Math.round((this.row + 27) / 2) - 1, 255);
			gr.DrawImage(g_showlist.img, Math.round(tX1 + 10 + 27), this.y + this.row - Math.round((this.row + 27) / 2) - 1, 27, 27, this.add_track_bt.state == ButtonStates.hover ? 27 : this.add_track_bt.state == ButtonStates.down ? 27 * 2 : 0, 27 * 41, 27, 27);
		}

		tW > 600 && gr.gdiDrawText(this.tf_artist, listdurationFont, shadowColor, tX + artistW, this.y, tW - artistW - 27, this.row, drawTextFormat2);

		/*gr.FillSolidRect(tX + artistW, y, tW - artistW - 27, this.row, RGBA(0, 0, 250, 15));
		gr.FillSolidRect(this.x + this.w - length_w - setTxt, this.y, length_w, this.row, setAlpha(colorSchemeText, 35));
		gr.FillSolidRect(this.x + this.w - length_w - setTxt - 27, this.y, 27, this.row, setAlpha(colorSchemeText, 25));
		 */

		// mood
		if (this.ishover || this.tf_mood == 1 || this.tf_mood == 2) {
			this.mood_track_bt.draw(gr, Math.round(this.x + this.w - setTxt - 25), this.y + this.row - Math.round((this.row + 27) / 2) - 1, 255);
			gr.DrawImage(plman.IsPlaylistItemSelected(plman.ActivePlaylist, this.plindx) ? g_showlist.img_selected : g_showlist.img, Math.round(this.x + this.w - setTxt - 25), this.y + this.row - Math.round((this.row + 27) / 2), 27, 27, this.mood_track_bt.state == ButtonStates.hover ? 27 : this.mood_track_bt.state == ButtonStates.down ? 27 * 2 : 0, 27 * (this.tf_mood == 1 ? 33 : this.tf_mood == 2 ? 34 : 32), 27, 27);
		}

		gr.gdiDrawText(duration, listdurationFont, shadowColor, this.x + this.w - length_w - setTxt - 40, this.y, length_w, this.row, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);

	}

	var state1 = 0;

	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	this.check = function (event, x, y) {
		this.ishover = !g_dragA && !g_dragR && traceMouse(x, y, this.x, this.y, this.w, this.h);
		var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
		var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);
		var activeList = plman.ActivePlaylist;

		old1 = 0;

		switch (event) {
		case "down":
			this.clicked = false;

			if (this.ishover && y > g_browser.y) {
				if (this.play_track_bt.checkstate("down", x, y) == ButtonStates.down) {
					return;
				}
				if (this.add_track_bt.checkstate("down", x, y) == ButtonStates.down) {
					return;
				}
				if (this.mood_track_bt.checkstate("down", x, y) == ButtonStates.down) {
					return;
				}
			}

			if (this.ishover && y > g_browser.y) {
				this.clicked = true;
				this.repaint();
			} else {
				this.clicked = false;
			}
			break;
		case "up":
			this.clicked = false;

			if (this.ishover && y > g_browser.y) {
				if (this.play_track_bt.checkstate("up", x, y) == ButtonStates.hover) {
					/*if (fb.IsPlaying)
					fb.Stop();
					fb.RunContextCommandWithMetadb("Play", this.metadb);
					if (plman.IsPlaybackQueueActive()) {
					plman.FlushPlaybackQueue();
					}*/
					//fb.RunContextCommandWithMetadb("Add to playback queue", this.metadb);
					//fb.Play();

					plman.ExecutePlaylistDefaultAction(plman.ActivePlaylist, this.plindx);

					this.clicked = false;
					return true;
				}

				if (this.add_track_bt.checkstate("up", x, y) == ButtonStates.hover) {
					add_m = this.metadb;
					add_ms = plman.GetPlaylistSelectedItems(-1);
					add_ms.Add(add_m);
					add_menu(this.add_track_bt.x, this.add_track_bt.y + this.add_track_bt.h, add_ms);
					this.clicked = false;
					return true;
				}

				if (this.mood_track_bt.checkstate("up", x, y) == ButtonStates.hover) {
					if (this.tf_mood == 0)
						this.metadb.UpdateFileInfoSimple("MOOD", "Like it");
					else if (this.tf_mood == 1)
						this.metadb.UpdateFileInfoSimple("MOOD", "Hate it");
					else if (this.tf_mood == 2)
						this.metadb.UpdateFileInfoSimple("MOOD", "");
					this.clicked = false;
					return true;
				}
			}

			if (g_dragR) {
				len = g_plmanager.playlists.length;
				for (var i = 0; i < len; i++) {
					if (g_plmanager.playlists[i].type == 2) {
						g_plmanager.playlists[i].checkstate("up", x, y, i);
					}
				}

				g_dragR = false;
				g_drag_timer = false;
				g_drag_timer = fb.CreateProfiler();

				this.clicked = false;
				g_browser.repaint();
			}

			if (this.ishover && y > g_browser.y) {

				IDIsSelected = plman.IsPlaylistItemSelected(activeList, this.plindx);

				if (!CtrlKeyPressed && !ShiftKeyPressed) {
					selectedIndexes = [];
					plman.ClearPlaylistSelection(activeList);
				}

				if (ShiftKeyPressed) {
					selectedIndexes = [];

					var a = b = 0;

					//if (selectedIndex == undefined)
					selectedIndex = plman.GetPlaylistFocusItemIndex(activeList);

					if (selectedIndex < this.plindx) {
						a = selectedIndex;
						b = this.plindx;
					} else {
						a = this.plindx;
						b = selectedIndex;
					}

					for (var ids = a; ids <= b; ids++) {
						selectedIndexes.push(ids);
					}

					plman.ClearPlaylistSelection(activeList);
					plman.SetPlaylistSelection(activeList, selectedIndexes, true);
				} else {
					plman.SetPlaylistSelectionSingle(activeList, this.plindx, true);
				}

				if (!IDIsSelected && !CtrlKeyPressed && !ShiftKeyPressed) {
					selectedIndexes = [];
					selectedIndexes[0] = this.plindx;
				}

				if (CtrlKeyPressed) {
					if (!IDIsSelected)
						selectedIndexes.push(this.plindx);

					plman.SetPlaylistSelectionSingle(activeList, this.plindx, IDIsSelected ? false : true);

					if (IDIsSelected) {
						for (var i = 0; i < selectedIndexes.length; i++) {
							if (selectedIndexes[i] == this.plindx)
								selectedIndexes.splice(i, 1);
						}
					}
				}

				plman.SetPlaylistFocusItem(activeList, this.plindx);

				if (selectedIndex == undefined)
					selectedIndex = this.plindx;

				if (selectedIndexes.length > 1)
					selectedIndexes.sort(numericAscending);
				/*
				plman.ClearPlaylistSelection(plman.ActivePlaylist);
				plman.SetPlaylistFocusItemByHandle(plman.ActivePlaylist, this.metadb);
				plman.SetPlaylistSelectionSingle(plman.ActivePlaylist, plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist), true);
				selected_row = this.metadb;
				selected_rows = plman.GetPlaylistSelectedItems(-1);
				selected_rows.Add(selected_row);
				rowSelection = this;
				 */

				this.sourceX = x;
				this.sourceY = y;
				this.clicked = false;

				this.repaint();
			}
			break;
		case "dblclk":
			if (this.ishover) {
				//if (fb.IsPlaying)
				//	fb.Stop();
				//if (plman.IsPlaybackQueueActive()) {
				//	plman.FlushPlaybackQueue();
				//}
				//fb.RunContextCommandWithMetadb("Play", this.metadb);

				plman.ExecutePlaylistDefaultAction(plman.ActivePlaylist, this.plindx);

				//fb.RunContextCommandWithMetadb("Add to playback queue", this.metadb);
				//fb.Play();
				/*
				var saved_current_playlist = plman.ActivePlaylist;
				plman.ActivePlaylist = 0;
				plman.SetPlaylistFocusItemByHandle(plman.ActivePlaylist, this.metadb);
				fb.Play();
				var reset_previous_playlist_timer = window.SetTimeout(function(){
				plman.ActivePlaylist = saved_current_playlist;
				reset_previous_playlist_timer && window.ClearTimeout(reset_previous_playlist_timer);
				}, 1000);
				 */
			}
			break;
		case "right":
			if (this.ishover) {
				//plman.ClearPlaylistSelection(plman.ActivePlaylist);
				//plman.SetPlaylistFocusItemByHandle(plman.ActivePlaylist, this.metadb);
				//plman.SetPlaylistSelectionSingle(plman.ActivePlaylist, plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist), true);

				//selected_row = this.metadb;
				//selected_rows = plman.GetPlaylistSelectedItems(-1);
				//selected_rows.Add(selected_row);
				//rowSelection = this;

				var activeList = plman.ActivePlaylist;
				IDIsSelected = plman.IsPlaylistItemSelected(activeList, this.plindx);
				if (IDIsSelected) {
					plman.SetPlaylistFocusItem(activeList, this.plindx);
				} else {
					plman.ClearPlaylistSelection(activeList);
					plman.SetPlaylistFocusItem(activeList, this.plindx);
					plman.SetPlaylistSelectionSingle(plman.ActivePlaylist, plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist), true);
				}

				return true;
			}
			break;
		case "move":

			this.play_track_bt && this.play_track_bt.checkstate("move", x, y);
			this.add_track_bt && this.add_track_bt.checkstate("move", x, y);
			this.mood_track_bt && this.mood_track_bt.checkstate("move", x, y);

			if (this.ishover && y > g_browser.y && this.clicked) {
				/*plman.ClearPlaylistSelection(plman.ActivePlaylist);
				plman.SetPlaylistFocusItemByHandle(plman.ActivePlaylist, this.metadb);
				plman.SetPlaylistSelectionSingle(plman.ActivePlaylist, plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist), true);

				selected_row = this.metadb;
				selected_rows = plman.GetPlaylistSelectedItems(-1);
				selected_rows.Add(selected_row);
				rowSelection = this;*/

				var activeList = plman.ActivePlaylist;
				IDIsSelected = plman.IsPlaylistItemSelected(activeList, this.plindx);
				if (IDIsSelected) {
					plman.SetPlaylistFocusItem(activeList, this.plindx);
				} else {
					plman.ClearPlaylistSelection(activeList);
					plman.SetPlaylistFocusItem(activeList, this.plindx);
					plman.SetPlaylistSelectionSingle(plman.ActivePlaylist, plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist), true);
				}

				this.sourceX = x;
				this.sourceY = y;
			}

			if (!g_dragR && this.clicked && (Math.abs(x - this.sourceX) > 3 || Math.abs(y - this.sourceY) > 3)) {
				g_dragR = true;
				g_plmanager.isOpened = true;
				g_plmanager.setPlaylistList();
				/*if (this.sourceX > this.x + Math.round(this.w / 2)) {
				g_plmanager.side = "left";
				} else {
				g_plmanager.side = "left";
				}*/
				g_drag_timer = fb.CreateProfiler();
			}

			if (g_dragR) {
				g_browser.repaint();
			}

			var old1 = state1;
			state1 = this.ishover ? 1 : 0;
			if (old1 != state1)
				this.repaint();
			break;
		}
	}
}

var column = function () {
	this.rows = [];
}

var showList = function (parentPanelName) {
	this.parentPanelName = parentPanelName;
	this.y = 0;
	this.h = 0;
	this.heightMin = properties.listHeightMin;
	this.totalHeight = 0;
	this.idx = -1;
	this.rowIdx = -1;
	this.nbRows = 0;
	this.delta = 0;
	this.delta_ = 0;
	this.marginTop = -14;
	this.marginBot = 14;
	this.areaTop = pl_h * 2 + 25 + 10;
	this.areaBot = 10;
	this.areaLeft = 10;
	this.areaRight = 10;
	this.coverMarginTop = this.areaTop;
	this.coverMargins = marginL;

	this.columns = [];
	this.rows_ = [];
	this.columnWidth = 0;

	this.playing_row_x = 0;
	this.playing_row_y = 0;
	this.playing_row_w = 1;
	this.playing_row_h = 1;

	this.showListArrow;

	this.setRowsImages = function () {
		var gb;

		this.img_selected = gdi.CreateImage(Mask_img.Width, Mask_img.Height);
		gb = this.img_selected.GetGraphics();
		gb.FillSolidRect(0, 0, Mask_img.Width, Mask_img.Height, colorSchemeTextSelect); //colorSchemeTextSelect);
		this.img_selected.ReleaseGraphics(gb);
		this.img_selected.ApplyMask(Mask_img);

		//

		var gb;

		if (this.showListArrow)
			this.showListArrow.Dispose();
		this.showListArrow = gdi.CreateImage(31, 19);
		gb = this.showListArrow.GetGraphics();
		gb.SetSmoothingMode(2);
		var pts1 = Array(0, 15, 15, 1, 30, 15, 30, 18, 0, 18);
		gb.FillPolygon(colorSchemeBack, 0, pts1);
		if (show_ListBorder) {
			gb.DrawLine(1, 15, 15, 1, 1.0, setAlpha(properties.listCoverColor ? colorSchemeBackInvert : colorSchemeText, properties.darkTheme ? 60 : 80)); //properties.darkTheme ? RGB(44, 44, 44) : RGB(194, 194, 194));
			gb.DrawLine(16, 2, 29, 15, 1.0, setAlpha(properties.listCoverColor ? colorSchemeBackInvert : colorSchemeText, properties.darkTheme ? 60 : 80)); //properties.darkTheme ? RGB(44, 44, 44) : RGB(194, 194, 194));
		}
		gb.SetSmoothingMode(0);
		this.showListArrow.ReleaseGraphics(gb);

		this.bt_size = 27;
		if (this.playicon_off)
			this.playicon_off.Dispose();
		this.playicon_off = gdi.CreateImage(this.bt_size, this.bt_size);
		gb = this.playicon_off.GetGraphics();
		gb.DrawImage(this.img, 0, 0, this.bt_size, this.bt_size, 0, this.bt_size * 35, this.bt_size, this.bt_size);
		this.playicon_off.ReleaseGraphics(gb);

		this.playiconAccentColorMask = gdi.CreateImage(this.bt_size, this.bt_size);
		gb = this.playiconAccentColorMask.GetGraphics();
		gb.FillSolidRect(0, 0, this.bt_size, this.bt_size, RGB(255, 255, 255));
		gb.DrawImage(icons25v35, 0, 0, this.bt_size, this.bt_size, 0, this.bt_size * 35, this.bt_size, this.bt_size);
		this.playiconAccentColorMask.ReleaseGraphics(gb);
		this.playiconAccentColor = gdi.CreateImage(this.bt_size, this.bt_size);
		gb = this.playiconAccentColor.GetGraphics();
		gb.FillSolidRect(0, 0, this.playiconAccentColor.Width, this.playiconAccentColor.Height, accent_colour);
		this.playiconAccentColor.ReleaseGraphics(gb);
		this.playiconAccentColor.ApplyMask(this.playiconAccentColorMask);

		this.playicon_on = gdi.CreateImage(this.bt_size, this.bt_size);
		gb = this.playicon_on.GetGraphics();
		gb.DrawImage(this.img_selected, 0, 0, this.bt_size, this.bt_size, 0, this.bt_size * 35, this.bt_size, this.bt_size);
		this.playicon_on.ReleaseGraphics(gb);

		//
		if (this.playAlbum_off)
			this.playAlbum_off.Dispose();
		this.playAlbum_off = gdi.CreateImage(this.bt_size, this.bt_size);
		gb = this.playAlbum_off.GetGraphics();
		gb.DrawImage(this.img, 0, 0, this.bt_size, this.bt_size, 0, 0, this.bt_size, this.bt_size);
		this.playAlbum_off.ReleaseGraphics(gb);
		if (this.playAlbum_ov)
			this.playAlbum_ov.Dispose();
		this.playAlbum_ov = gdi.CreateImage(this.bt_size, this.bt_size);
		gb = this.playAlbum_ov.GetGraphics();
		gb.DrawImage(this.img, 0, 0, this.bt_size, this.bt_size, this.bt_size, 0, this.bt_size, this.bt_size);
		this.playAlbum_ov.ReleaseGraphics(gb);
		if (this.playAlbum_on)
			this.playAlbum_on.Dispose();
		this.playAlbum_on = gdi.CreateImage(this.bt_size, this.bt_size);
		gb = this.playAlbum_on.GetGraphics();
		gb.DrawImage(this.img, 0, 0, this.bt_size, this.bt_size, this.bt_size * 2, 0, this.bt_size, this.bt_size);
		this.playAlbum_on.ReleaseGraphics(gb);

		if (typeof(this.play_album_bt) == "undefined") {
			this.play_album_bt = new button(this.playAlbum_off, this.playAlbum_ov, this.playAlbum_on);
		} else {
			this.play_album_bt.img[0] = this.playAlbum_off;
			this.play_album_bt.img[1] = this.playAlbum_ov;
			this.play_album_bt.img[2] = this.playAlbum_on;
		}

		if (this.queueAlbum_off)
			this.queueAlbum_off.Dispose();
		this.queueAlbum_off = gdi.CreateImage(this.bt_size, this.bt_size);
		gb = this.queueAlbum_off.GetGraphics();
		gb.DrawImage(this.img, 0, 0, this.bt_size, this.bt_size, 0, this.bt_size, this.bt_size, this.bt_size);
		this.queueAlbum_off.ReleaseGraphics(gb);
		if (this.queueAlbum_ov)
			this.queueAlbum_ov.Dispose();
		this.queueAlbum_ov = gdi.CreateImage(this.bt_size, this.bt_size);
		gb = this.queueAlbum_ov.GetGraphics();
		gb.DrawImage(this.img, 0, 0, this.bt_size, this.bt_size, this.bt_size, this.bt_size, this.bt_size, this.bt_size);
		this.queueAlbum_ov.ReleaseGraphics(gb);
		if (this.queueAlbum_on)
			this.queueAlbum_on.Dispose();
		this.queueAlbum_on = gdi.CreateImage(this.bt_size, this.bt_size);
		gb = this.queueAlbum_on.GetGraphics();
		gb.DrawImage(this.img, 0, 0, this.bt_size, this.bt_size, this.bt_size * 2, this.bt_size, this.bt_size, this.bt_size);
		this.queueAlbum_on.ReleaseGraphics(gb);

		if (typeof(this.queue_album_bt) == "undefined") {
			this.queue_album_bt = new button(this.queueAlbum_off, this.queueAlbum_ov, this.queueAlbum_on);
		} else {
			this.queue_album_bt.img[0] = this.queueAlbum_off;
			this.queue_album_bt.img[1] = this.queueAlbum_ov;
			this.queue_album_bt.img[2] = this.queueAlbum_on;
		}

		if (this.quickAlbum_off)
			this.quickAlbum_off.Dispose();
		this.quickAlbum_off = gdi.CreateImage(this.bt_size, this.bt_size);
		gb = this.quickAlbum_off.GetGraphics();
		gb.DrawImage(this.img, 0, 0, this.bt_size, this.bt_size, 0, this.bt_size * 39, this.bt_size, this.bt_size);
		this.quickAlbum_off.ReleaseGraphics(gb);
		if (this.quickAlbum_ov)
			this.quickAlbum_ov.Dispose();
		this.quickAlbum_ov = gdi.CreateImage(this.bt_size, this.bt_size);
		gb = this.quickAlbum_ov.GetGraphics();
		gb.DrawImage(this.img, 0, 0, this.bt_size, this.bt_size, this.bt_size, this.bt_size * 39, this.bt_size, this.bt_size);
		this.quickAlbum_ov.ReleaseGraphics(gb);
		if (this.quickAlbum_on)
			this.quickAlbum_on.Dispose();
		this.quickAlbum_on = gdi.CreateImage(this.bt_size, this.bt_size);
		gb = this.quickAlbum_on.GetGraphics();
		gb.DrawImage(this.img, 0, 0, this.bt_size, this.bt_size, this.bt_size * 2, this.bt_size * 39, this.bt_size, this.bt_size);
		this.quickAlbum_on.ReleaseGraphics(gb);

		if (typeof(this.quick_album_bt) == "undefined") {
			this.quick_album_bt = new button(this.quickAlbum_off, this.quickAlbum_ov, this.quickAlbum_on);
		} else {
			this.quick_album_bt.img[0] = this.quickAlbum_off;
			this.quick_album_bt.img[1] = this.quickAlbum_ov;
			this.quick_album_bt.img[2] = this.quickAlbum_on;
		}

		if (this.closeTracklist_off)
			this.closeTracklist_off.Dispose();
		this.closeTracklist_off = gdi.CreateImage(bt_size, bt_size);
		gb = this.closeTracklist_off.GetGraphics();
		//gb.setSmoothingMode(2);
		//gb.DrawLine(5, 5, 13, 13, 2.0, colorSchemeBackInvert);
		//gb.DrawLine(5, 13, 13, 5, 2.0, colorSchemeBackInvert);
		//gb.setSmoothingMode(0);
		gb.DrawImage(this.img, 0, 0, bt_size, bt_size, 0, bt_size * 17, bt_size, bt_size);
		this.closeTracklist_off.ReleaseGraphics(gb);
		if (this.closeTracklist_ov)
			this.closeTracklist_ov.Dispose();
		this.closeTracklist_ov = gdi.CreateImage(bt_size, bt_size);
		gb = this.closeTracklist_ov.GetGraphics();
		/*gb.setSmoothingMode(2);
		gb.DrawLine(5, 5, 13, 13, 2.0, colorSchemeBackInvert);
		gb.DrawLine(5, 13, 13, 5, 2.0, colorSchemeBackInvert);
		gb.FillSolidRect(0, 0, 18, 18, setAlpha(colorSchemeBack, 90));
		gb.setSmoothingMode(0);*/
		gb.DrawImage(this.img, 0, 0, bt_size, bt_size, bt_size, bt_size * 17, bt_size, bt_size);
		this.closeTracklist_ov.ReleaseGraphics(gb);
		if (this.closeTracklist_on)
			this.closeTracklist_on.Dispose();
		this.closeTracklist_on = gdi.CreateImage(bt_size, bt_size);
		gb = this.closeTracklist_on.GetGraphics();
		/*gb.setSmoothingMode(2);
		gb.DrawLine(5, 5, 13, 13, 2.0, colorSchemeBackInvert);
		gb.DrawLine(5, 13, 13, 5, 2.0, colorSchemeBackInvert);
		gb.FillSolidRect(0, 0, 18, 18, setAlpha(colorSchemeBack, 150));
		gb.setSmoothingMode(0);*/
		gb.DrawImage(this.img, 0, 0, bt_size, bt_size, bt_size * 2, bt_size * 17, bt_size, bt_size);
		this.closeTracklist_on.ReleaseGraphics(gb);

		if (typeof(this.close_bt) == "undefined") {
			this.close_bt = new button(this.closeTracklist_off, this.closeTracklist_ov, this.closeTracklist_on);
		} else {
			this.close_bt.img[0] = this.closeTracklist_off;
			this.close_bt.img[1] = this.closeTracklist_ov;
			this.close_bt.img[2] = this.closeTracklist_on;
		}

	}

	this.reset = function (idx, rowIdx, nbRows, height) {
		this.idx = idx;
		this.rowIdx = rowIdx;
		this.nbRows = nbRows;
		this.delta = nbRows;
		this.h = height;
		this.w = eval(this.parentPanelName + ".w");
		this.x = eval(this.parentPanelName + ".x");
		selected_row = false;

		// BgCover & ColorScheme Stuff
		this.coverSize = this.heightMin - this.marginTop - this.marginBot - this.coverMarginTop - this.coverMargins;
		if (this.cover)
			this.cover.Dispose();
		try {
			this.cover = FormatCover(utils.GetAlbumArtV2(eval(this.parentPanelName + ".albums_draw[this.idx].metadb"), 0, true), this.coverSize, this.coverSize, false, false, "center");
			if (properties.listCoverColor)
				this.getColorSchemeFromImageNew(this.cover);
			this.cover = this.cover.CreateRawBitmap();
		} catch (e) {
			this.cover = gdi.CreateImage(this.coverSize, this.coverSize);
			gb = this.cover.GetGraphics();
			gb.FillSolidRect(0, 0, this.cover.Width, this.cover.height, col_noCoverBG);
			gb.DrawImage(mediaMissingAlbum, Math.round((this.cover.Width - mediaMissingArtist.Width) / 2), Math.round((this.cover.Height - mediaMissingArtist.Height) / 2), mediaMissingArtist.Width, mediaMissingArtist.Height, 0, 0, mediaMissingArtist.Width, mediaMissingArtist.Height, 0, 255);
			gb.DrawRect(10, 10, this.cover.Width - 20, this.cover.height - 20, 1.0, col_noCoverLine);
			this.cover.ReleaseGraphics(gb);
			this.cover = this.cover.CreateRawBitmap();

			if (properties.darkTheme) {
				colorSchemeBack = col_listSchemeBack; //RGB(20, 20, 20);
				colorSchemeText = col_text1;
				colorSchemeText2 = col_text2;
				colorSchemeTextSelect = RGB(34, 34, 34);
				colorSchemeBackInvert = RGB(250, 250, 250); //RGB(255, 255, 255);
				this.img = iconsW_img;
			} else {
				colorSchemeBack = col_listSchemeBack;
				colorSchemeText = col_text1;
				colorSchemeText2 = col_text2;
				colorSchemeTextSelect = RGB(250, 250, 250);
				colorSchemeBackInvert = RGB(34, 34, 34);
				this.img = iconsB_img;
			}
		}

		if (listbackgroundArtwork) {
			try {
				if (this.coverBackground)
					this.coverBackground.Dispose();

				if (listbackgroundBlurred)
					this.coverBackground = resizeImage(utils.GetAlbumArtV2(eval(this.parentPanelName + ".albums_draw[this.idx].metadb"), listbackgroundArtworkType, true).Resize(10, 10, 5), this.w, this.w, true, 6);
				else
					this.coverBackground = resizeImage(utils.GetAlbumArtV2(eval(this.parentPanelName + ".albums_draw[this.idx].metadb"), listbackgroundArtworkType, true), this.w, this.w, true, 0);
			} catch (e) {
				this.coverBackground = null;
			}
		}

		if (!properties.listCoverColor) {
			if (properties.darkTheme) {
				colorSchemeBack = col_listSchemeBack; //RGB(20, 20, 20);
				colorSchemeText = RGB(236, 236, 236);
				colorSchemeText2 = RGB(124, 124, 124);
				colorSchemeTextSelect = RGB(255, 255, 255);
				colorSchemeBackInvert = accent_colour; //RGB(255, 255, 255);
				this.img = iconsW_img;
			} else {
				colorSchemeBack = col_listSchemeBack;
				colorSchemeText = col_text1;
				colorSchemeText2 = col_text2;
				colorSchemeTextSelect = RGB(255, 255, 255);
				colorSchemeBackInvert = accent_colour;
				this.img = iconsB_img;
			}
		}

		// set cover of the thumbnail if not already in cache
		if (this.cover)
			if (!g_browser.albums_draw[this.idx].cover_img) {
				if (artistDisplay_v2) {
					if (lGroup == "Artists")
						g_browser.albums_draw[this.idx].cover_img = g_artistImageCache.hit(g_browser.albums_draw[this.idx].metadb, this.idx);
					else if (lGroup == "Genres")
						g_browser.albums_draw[this.idx].cover_img = g_genreImageCache.hit(g_browser.albums_draw[this.idx].metadb, this.idx);
					else if (lGroup == "Albums")
						g_browser.albums_draw[this.idx].cover_img = g_imageCache.hit(g_browser.albums_draw[this.idx].metadb, this.idx);
				} else
					g_browser.albums_draw[this.idx].cover_img = g_imageCache.hit(g_browser.albums_draw[this.idx].metadb, this.idx);
			}

		// TF
		this.tf_albumArtist = fb.TitleFormat("$if2(%album artist%,'Unknown Artist')").evalWithMetadb(this.pl.Item(0)) + textSeparator;
		this.tf_album = fb.TitleFormat(properties.separateAlbumsByDisc ? list_tf_albumByDisc : list_tf_albumSimple).evalWithMetadb(this.pl.Item(0));
		/*if (lGroup == "Albums" && properties.TFsorting == SortByAlbum && this.tf_album == "Single(s)") {
		this.tf_album = "Unknown Album";
		this.tf_albumArtist = "Various Artists";
		}*/

		this.tf_date = fb.TitleFormat("[%date%]").evalWithMetadb(this.pl.Item(0));
		if (this.tf_date)
			this.tf_date = this.tf_date + textSeparator;

		//this.tf_genre = fb.TitleFormat("$if2($caps2( '•' %genre%), '•' Unknown genre)").evalWithMetadb(this.pl.Item(0));
		//this.tf_style = fb.TitleFormat("[ '•' %style%]").evalWithMetadb(this.pl.Item(0));
		this.total_tracks = this.pl.Count + (this.pl.Count > 1 ? " songs" : " song") + textSeparator;

		this.seconds = 0;
		//this.filesize = 0;
		for (var i = 0; i < this.pl.Count; i++) {
			this.seconds += Math.abs(fb.TitleFormat("$if(%length%,%length_seconds_fp%,0)").evalWithMetadb(this.pl.Item(i)));
			//this.filesize += Math.abs(fb.TitleFormat("[%filesize%]").evalWithMetadb(this.pl.Item(i)));
		}
		this.seconds = timeFormat(this.seconds);
		//this.filesize =  textSeparator + bytesToSize(this.filesize);
		this.setRowsImages();
	}

	this.calcHeight = function (playlist, idx) {
		//CollectGarbage();
		this.pl = playlist;
		this.totaltracks = this.pl.Count;
		this.rows_.splice(0, this.rows_.length);
		this.totalHeight = 0;

		for (var i = 0; i < this.totaltracks; i++) {
			this.rows_.push(new row(this.pl.Item(i), idx + i, i, g_browser.albums_draw[idx].trackIndex + i));
			this.totalHeight += this.rows_[i].h;
		}

		var default_cover_size = properties.listShowCoverArt ? (this.heightMin * 2) > (g_browser.w - 100) ? 0 : this.heightMin - this.marginTop - this.marginBot - this.coverMarginTop : 0;
		var a = Math.floor(this.totalHeight / 1);

		if ((this.totalHeight < this.heightMin - this.areaTop - this.areaBot - (this.marginTop + this.marginBot)) && properties.listShowCoverArt) {
			this.h = this.heightMin;
			this.totalCols = 1;
		} else {
			this.h = a + this.areaTop + this.areaBot + (this.marginTop + this.marginBot);
			this.totalCols = 1;
		}

		// calc columnWidth to use for drawing
		this.columnWidth = Math.floor(g_browser.w - this.areaLeft - this.areaRight - default_cover_size - ((this.heightMin * 2) > (g_browser.w - 100) ? 0 : properties.listShowCoverArt ? this.coverMargins : 0)) / 1;
	}

	this.setColumns = function (idx) {
		this.columns.splice(0, this.columns.length);
		this.totaltracks = this.rows_.length;
		var a = this.h - this.areaTop - this.areaBot - (this.marginTop + this.marginBot);
		var colHeight = 0;
		var k = 0;

		// check rows height to get # of colums
		for (var i = 0; i < this.totaltracks; i++) {
			if (i == 0)
				this.columns.push(new column());
			colHeight += this.rows_[i].h;
			this.columns[k].rows.push((this.rows_[i]));
		}
		this.totalCols = this.columns.length;
	}

	this.draw = function (gr) {
		var coverHeight = 0;
		var coverGape = 0;
		var ratio = 0;
		var reflectHeight = 0;
		if (this.delta > 0) {
			this.y = Math.round(eval(this.parentPanelName + ".y") + ((this.rowIdx + 1) * eval(this.parentPanelName + ".rowHeight")) + eval(this.parentPanelName + ".marginTop") - scroll_);
			if (this.y > 0 - (eval(this.parentPanelName + ".h") + this.h) && this.y < eval(this.parentPanelName + ".y") + eval(this.parentPanelName + ".h")) {
				var scrollbarOffset = (properties.showscrollbar && g_scrollbar && g_browser.rowsCount > 0 && g_scrollbar.visible && (g_browser.rowsCount + Math.round(this.delta) > this.nbRows)) ? cScrollbar.width : 0;
				var slh = Math.floor(this.delta_ < (this.marginTop + this.marginBot) ? 0 : this.delta_ - (this.marginTop + this.marginBot));

				gr.FillSolidRect(this.x, this.y + this.marginTop, this.w + cScrollbar.width, slh, colorSchemeBack); // cScrollbar.width

				if (listbackgroundArtwork && this.coverBackground) {
					gr.FillSolidRect(this.x, this.y + this.marginTop, this.w + cScrollbar.width, slh, properties.darkTheme ? RGB(0, 0, 0) : RGB(255, 255, 255));
					draw_Bitmap(gr, this.coverBackground, this.x, this.y + this.marginTop, this.w + cScrollbar.width, slh, "crop top", 6);
					gr.FillSolidRect(this.x, this.y + this.marginTop, this.w + cScrollbar.width, slh, setAlpha(colorSchemeBack, 220));
				}

				if (properties.listShowCoverArt)
					if (this.cover && (slh - this.coverMarginTop) > 0) {
						coverHeight = (slh - this.coverMarginTop) > this.coverSize ? this.coverSize : slh - this.coverMarginTop;
						ratio = (this.coverSize) / this.coverSize;
						coverGape = (this.coverSize - coverHeight) * ratio;
						var cov_y = this.y + this.marginTop + this.coverMarginTop;
						if ((slh >= (this.coverSize + this.coverMargins + this.coverMargins)) && (cov_y <= eval(this.parentPanelName + ".y") + this.coverMargins)) {
							cov_y = eval(this.parentPanelName + ".y") + this.coverMargins;
							if ((this.y + slh) < (eval(this.parentPanelName + ".y") + this.coverSize + this.coverMargins + this.coverMargins))
								cov_y = this.y + this.marginTop + slh - (this.coverSize + this.coverMargins);
						}
						if ((this.heightMin * 2) < (g_browser.w - 100))
							gr.GdiAlphaBlend(this.cover, this.x + (listRightArtwork ? this.w - this.coverSize - this.coverMargins : this.coverMargins), cov_y, this.coverSize, coverHeight, 0, 0, this.cover.Width, this.cover.Height - coverGape);
					}

				if ((slh) > 0) {
					if (show_ListBorder)
						gr.FillSolidRect(this.x, this.y + this.marginTop + slh - 0, this.w + cScrollbar.width, 1, setAlpha(properties.listCoverColor ? colorSchemeBackInvert : colorSchemeText, properties.darkTheme ? 30 : 50)); //properties.darkTheme ? RGB(44, 44, 44) : RGB(194, 194, 194));

					//if (this.y > eval(this.parentPanelName + ".y")) {
					if (show_ListBorder)
						gr.FillSolidRect(this.x, this.y + this.marginTop - 1, this.w + cScrollbar.width, 1, setAlpha(properties.listCoverColor ? colorSchemeBackInvert : colorSchemeText, properties.darkTheme ? 30 : 50)); //properties.darkTheme ? RGB(44, 44, 44) : RGB(194, 194, 194));

					// draw Album Selected Arrow
					var arrowItemIdx = (this.idx % g_browser.totalColumns) + 1;
					var arrow_x = this.x + g_browser.marginLR + (arrowItemIdx * g_browser.thumbnailWidth) - Math.round((g_browser.thumbnailWidth) / 2) - 13;
					var arrow_y = this.y + this.marginTop - 13;
					var arrow_offsetY = Math.floor((this.delta_ / (this.delta * g_browser.rowHeight)) * 19);
					if (arrow_offsetY > 16)
						arrow_offsetY = 19;
					if (arrowItemIdx)
						this.showListArrow && gr.DrawImage(this.showListArrow, arrow_x, arrow_y, this.showListArrow.Width, this.showListArrow.Height - 6, 0, 0, this.showListArrow.Width, this.showListArrow.Height - 6, 0, 255);
					//}
				}

				// draw columns & tracks
				if (this.idx > -1) {
					var k = 0;
					cy = this.y + this.areaTop + this.marginTop;
					cx = this.x + this.areaLeft + (properties.listShowCoverArt && (this.heightMin * 2) <
							(g_browser.w - 100) ? (listRightArtwork ? 0 : this.coverSize + this.coverMargins * 2) : 0);
					for (var r = 0; r < this.columns[0].rows.length; r++) {
						if (cy < (this.y + slh - this.areaBot)) {
							//if ((this.y + slh - 35) > cy && (cy + this.columns[0].rows[r].h) < wh)
							this.columns[0].rows[r].draw(gr, cx, cy, this.columnWidth);
						}
						cy += this.columns[0].rows[r].h;
					}
					k++;
					cy = this.y + this.areaTop;
				}

				if (this.areaTop < slh) {
					// Text Info / Album opened
					var tx = this.x + marginL;
					var ty = this.y + 10;
					/*
					if ((slh > (this.coverSize + this.coverMarginTop + this.coverMargins + 0)) && (this.y < eval(this.parentPanelName + ".y") + this.coverMargins)) {
					ty = eval(this.parentPanelName + ".y");
					if ((this.y + slh) < (eval(this.parentPanelName + ".y") + this.coverSize + this.coverMargins + this.coverMarginTop + 0))
					ty = this.y + this.marginTop + slh - (this.coverSize + this.coverMarginTop + this.coverMargins);

					if (slh > (this.coverSize + this.coverMarginTop + this.coverMargins + this.marginBot)) {
					gr.FillSolidRect(this.x, ty - 1, this.w + cScrollbar.width, 70, colorSchemeBack);
					gr.FillSolidRect(this.x, ty + 35 * 2 - 1, this.w + cScrollbar.width, 1, setAlpha(colorSchemeText, 40)); //properties.darkTheme ? RGB(44, 44, 44) : RGB(194, 194, 194));
					}
					} else {
					}
					 */
					var nb_cols_drawn = this.totalCols;
					var bloc_w = nb_cols_drawn * (this.columnWidth + 5);
					if (nb_cols_drawn == 2)
						bloc_w = bloc_w - 5;

					// draw play album button
					w_album_width = this.w - this.play_album_bt.w * 3 - 5 - marginL * 2;
					tf_album_width = gr.CalcTextWidth(this.tf_album, listAlbumFont);
					tf_album_width = tf_album_width < w_album_width ? tf_album_width : w_album_width;

					if (g_showlist.idx > -1) {
						this.play_album_bt.draw(gr, tx + 20 + tf_album_width, ty + 4, 255);

						if (this.totaltracks > 1) {
							this.quick_album_bt.draw(gr, tx + 20 + tf_album_width + this.play_album_bt.w + 7, ty + 4, 255);
							this.queue_album_bt.draw(gr, tx + 20 + tf_album_width + this.play_album_bt.w + 7 + this.quick_album_bt.w + 7, ty + 4, 255);
						} else {
							//	this.quick_album_bt.draw(gr, tx + 15 + tf_album_width + this.play_album_bt.w + 7, ty + 4, 255);
							this.queue_album_bt.draw(gr, tx + 20 + tf_album_width + this.play_album_bt.w + 7, ty + 4, 255);
						}
					}

					gr.gdiDrawText(this.tf_album, listAlbumFont, colorSchemeText, tx, ty, w_album_width, 35, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);
					gr.gdiDrawText(this.tf_albumArtist + this.tf_date + this.total_tracks + this.seconds, gdi.Font("Segoe UI", 12), colorSchemeText2, tx, ty + 30, this.w - marginL * 2, 30, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);
					//gr.gdiDrawText(this.total_tracks + this.seconds, gdi.Font("Segoe UI", 12), colorSchemeText2, tx + gr.CalcTextWidth(this.tf_albumArtist + this.tf_date, gdi.Font("Segoe UI", 14, 0)), ty + 30, this.w - marginL * 2, 30, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);
					//gr.gdiDrawText(, gdi.Font("Segoe UI", 12), colorSchemeText2, tx, ty + 60, this.w - marginL * 2, 35, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);
					//gr.CalcTextHeight(this.tf_album, listAlbumFont) + 4

					// close button
					if (slh > 35) {
						this.close_bt.draw(gr, this.x + this.w - 35, ty - 15, 255);
					}
				}
			}
		} else {
			this.y = -1;
		}
	}

	this.getColorSchemeFromImageNew = function (image) {
		if (!image)
			return;

		image = image.Resize(10, 10, InterpolationMode.NearestNeighbor);
		var colorScheme_array = Array();
		var myVBArray = image.GetColorScheme(image.Width * image.Height);
		colorScheme_array.splice(0, colorScheme_array.length);
		colorScheme_array = myVBArray.toArray();
		colorScheme_arrayCount = colorScheme_array.length;
		for (var i = 0; i < colorScheme_arrayCount; i++) {
			colorScheme_array[i] = toRGB(colorScheme_array[i]);
		}
		colorSchemeBack = dominantColor(colorScheme_array, .1);
		hol = inverseColors(colorSchemeBack, colorScheme_array);

		coltxt1 = colorDistance(colorSchemeBack, hol[0]);
		coltxt2 = colorDistance(colorSchemeBack, hol[1]);
		coltxtA = Array(coltxt1, coltxt2).sort();

		if (getContrastYIQ(colorSchemeBack) >= 128) {
			this.img = iconsB_img;
			colorSchemeBackInvert = RGB(35, 35, 35);
		} else {
			this.img = iconsW_img;
			colorSchemeBackInvert = RGB(235, 235, 235);
		}

		if (coltxtA[0] == coltxt2) {
			colorSchemeText = eval("RGB(" + hol[0] + ")");
			colorSchemeText2 = eval("RGB(" + hol[1] + ")");
			colorSchemeTextSelect = (getContrastYIQ(colorSchemeBack) >= 128) ? RGB(235, 235, 235) : RGB(10, 10, 10);
		} else {
			colorSchemeText = eval("RGB(" + hol[1] + ")");
			colorSchemeText2 = eval("RGB(" + hol[0] + ")");
			colorSchemeTextSelect = (getContrastYIQ(colorSchemeBack) >= 128) ? RGB(235, 235, 235) : RGB(10, 10, 10);
		}

		//if (colorDistance(colorSchemeBack, [255, 255, 255]) < 30)
		//	colorSchemeBack = RGB(255, 255, 255);
		//else if (colorDistance(colorSchemeBack, (properties.darkTheme ? [35, 35, 35] : [234, 234, 234])) < 30)
		//	colorSchemeBack = properties.darkTheme ? RGB(28, 28, 28) : RGB(204, 204, 204);
		//else
		colorSchemeBack = eval("RGB(" + colorSchemeBack + ")");

		if (image)
			image.Dispose();
	}
}

var oBrowser = function (name) {
	this.name = name;
	this.stampDrawMode = 0;
	this.marginSide = 5;
	this.marginLR = marginL - this.marginSide;
	this.headerBarHeight = showTopPlName ? pl_y + pl_sep + pl_h : pl_y;
	this.albums = [];
	this.albums_draw = [];
	this.rows = [];
	this.songs = [];
	this.rowHeight = 0;
	this.thumbnailWidth = 0;
	this.scroll = 0;
	this.scroll_ = 0;
	this.scrollTimer = false;
	this.bgColor = col_bg;
	this.fgColor = col_text1;
	var collect_counter = 0;
	this.ok = false;

	var launch_timer = window.SetTimeout(function () {
			eval(name + ".populate(false)");
			launch_timer && window.ClearTimeout(launch_timer);
			launch_timer = false;
		}, 100);

	this.repaint = function () {
		repaint_main1 = repaint_main2;
	}

	this.setSize = function (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		// Collapse Album List even if open
		g_showlist.idx = -1;
		g_showlist.h = 0;
		g_showlist.rowIdx = -1;
		g_showlist.delta = 0;
		g_showlist.delta_ = 0;

		if (artistDisplay_v2) {
			if (lGroup == "Artists" || lGroup == "Genres") {
				// Adjust Column
				this.totalColumns = Math.floor((this.w - this.marginLR * 2) / (properties.artistthumbnailWidthMin * 2));
				var gapeWidth = (this.w - this.marginLR * 2) - (this.totalColumns * (properties.artistthumbnailWidthMin * 2));
				var deltaToAdd = Math.round(gapeWidth / this.totalColumns);
				this.thumbnailWidth = (properties.artistthumbnailWidthMin * 2) + deltaToAdd;

				// set margins betweens album stamps
				this.marginTop = 0;
				this.marginBot = 10;

				// calc size of the cover art
				cover.max_w = (this.thumbnailWidth - (this.marginSide * 2));
				cover.max_h = ((properties.artistthumbnailWidthMin) + deltaToAdd) - (this.marginSide * 2);

				// Adjust Row & showList bloc Height
				this.rowHeight = (((properties.artistthumbnailWidthMin) + deltaToAdd) - (this.marginSide * 2)) + (properties.showCountTracks ? 100 : 100);
				this.totalRows = Math.ceil(this.h / this.rowHeight);
				this.totalRowsVis = Math.floor(this.h / this.rowHeight);
			} else if (lGroup == "Albums") {
				// Adjust Column
				this.totalColumns = Math.floor((this.w - this.marginLR * 2) / properties.thumbnailWidthMin);
				var gapeWidth = (this.w - this.marginLR * 2) - (this.totalColumns * properties.thumbnailWidthMin);
				var deltaToAdd = Math.round(gapeWidth / this.totalColumns);
				this.thumbnailWidth = properties.thumbnailWidthMin + deltaToAdd;

				// set margins betweens album stamps
				this.marginTop = 0;
				this.marginBot = 10;

				// calc size of the cover art
				cover.max_w = (this.thumbnailWidth - (this.marginSide * 2));
				cover.max_h = cover.max_w;

				// Adjust Row & showList bloc Height
				this.rowHeight = cover.max_w + (properties.showCountTracks ? 125 : 100);
				this.totalRows = Math.ceil(this.h / this.rowHeight);
				this.totalRowsVis = Math.floor(this.h / this.rowHeight);
			}
		} else {
			// Adjust Column
			this.totalColumns = Math.floor((this.w - this.marginLR * 2) / properties.thumbnailWidthMin);
			var gapeWidth = (this.w - this.marginLR * 2) - (this.totalColumns * properties.thumbnailWidthMin);
			var deltaToAdd = Math.round(gapeWidth / this.totalColumns);
			this.thumbnailWidth = properties.thumbnailWidthMin + deltaToAdd;

			// set margins betweens album stamps
			this.marginTop = 0;
			this.marginBot = 10;

			// calc size of the cover art
			cover.max_w = (this.thumbnailWidth - (this.marginSide * 2));
			cover.max_h = cover.max_w;

			// Adjust Row & showList bloc Height
			this.rowHeight = cover.max_w + (properties.showCountTracks ? 125 : 100);
			this.totalRows = Math.ceil(this.h / this.rowHeight);
			this.totalRowsVis = Math.floor(this.h / this.rowHeight);
		}

		// count total of rows for the whole library
		this.rowsCount = Math.ceil(this.albums_draw.length / this.totalColumns);
		//
		scroll = Math.round(scroll / this.rowHeight) * this.rowHeight;
		scroll_++;
		repaint_main1 = repaint_main2;
		//
		//if (artistDisplay_v2) {
		//	if (lGroup != "Artists" && lGroup != "Genres")
		this.setPlay_bt(35); //Math.round(cover.max_w / 2));
		//} else
		//	this.setPlay_bt(Math.round(cover.max_w / 2));

	}

	this.get_albums = function (bool_reload, start, string_, str_comp) {
		g_reload = bool_reload;
		this.ok = false;

		if (start == null) {
			if (!g_reload)
				scroll = 0;
			start = 0;
			string_ = form_text;
			this.albums.splice(0, this.albums.length);
			this.albums_draw.splice(0, this.albums_draw.length);
			list_ = plman.GetPlaylistItems(plman.ActivePlaylist); //-1);
			str_comp = "123456789123456789";
		} else if (string_ != form_text) {
			fb.trace("Break Search");
			return;
		}
		var i = this.albums.length,
		gk = start,
		temp = "",
		string_compare = str_comp;

		var Time = fb.CreateProfiler();
		var vTitleFormat = properties.separateAlbumsByDisc ? vTitleFormatByDisc : vTitleFormatSimple;
		var string = "",
		arr = [],
		group = "";
		var total = this.list.Count,
		item = null;
		while (gk < total) {
			item = this.list.Item(gk);
			string = fb.TitleFormat(vTitleFormat).EvalWithMetadb(item);
			arr = string.split(" ^^ ");

			if (properties.TFgrouping.length > 0) {
				group = fb.TitleFormat(properties.TFgrouping).EvalWithMetadb(item);
			} else {
				group = groupByAlbum;
			}

			if (gk % 250 == 0 && Time.Time > 50) {
				window.SetTimeout(function () {
					g_browser.get_albums(g_reload, gk, string_, string_compare);
				}, 25);
				break;
			}

			temp = group.toUpperCase();
			if (string_compare != temp) {
				string_compare = temp;
				this.albums[i] = new Object();
				this.albums[i].trackIndex = gk;
				this.albums[i].albumartist = arr[0];
				this.albums[i].album = arr[1];
				/*if (lGroup == "Albums" && properties.TFsorting == SortByAlbum && this.albums[i].album == "Single(s)") {
				this.albums[i].album = "Unknown Album";
				this.albums[i].albumartist = "Various Artists";
				}*/
				this.albums[i].date = arr[5];
				//this.albums[i].disk = arr[7];
				this.albums[i].path = arr[7];
				this.albums[i].style = arr[8];
				this.albums[i].publisher = arr[9];
				//this.albums[i].name = string;
				this.albums[i].i = i;
				this.albums[i].pl = plman.GetPlaylistItems(-1);
				this.albums[i].pl.Add(item);
				this.albums[i].tr = [];
				this.albums[i].tr.push(string);
				this.albums[i].genre = arr[2];
				this.albums[i].tracktype = TrackType(item.rawpath.substring(0, 4));
				this.albums[i].metadb = item;
				this.albums_draw.push(this.albums[i]);
				i++;
			} else {
				this.albums[i - 1].pl.Add(item);
				this.albums[i - 1].tr.push(string);
			}
			gk++;

		}
		this.rowsCount = Math.ceil(this.albums.length / this.totalColumns);
		g_scrollbar.setCursor(g_browser.totalRowsVis * g_browser.rowHeight, g_browser.rowHeight * g_browser.rowsCount + g_showlist.h, scroll_);
		repaint_main1 = repaint_main2;
		//fb.trace("Timeout Searching : " + Time.Time + " ... i = " + i);
		if (gk == total) {
			//fb.trace("ok");
			this.ok = true;
			if (returnedPos) {
				scroll = scrollOld;
				scroll_ = scrollOld_;
			}
		}

	}

	this.populate = function (bool_reload) {
		var isMediaLibraryFound = checkMediaLibrayPlaylist();
		this.list = plman.GetPlaylistItems(plman.ActivePlaylist);
		fb.RunMainMenuCommand("Edit/Remove Duplicates");

		reset_cover_timers();

		sort();

		if (lGroup != "Songs")
			this.get_albums(bool_reload);

		g_reload = false;
		g_library_to_reload = false;
	}

	this.setPlay_bt = function (bt_s) {
		var gb;

		var bt_size = 42;

		if (bt_s < 15)
			bt_s = 15;

		if (this.play_off)
			this.play_off.Dispose();
		this.play_off = gdi.CreateImage(bt_s, bt_s);
		gb = this.play_off.GetGraphics();
		//gb.FillSolidRect(0, 0, this.play_off.Width, this.play_off.Height, RGBA(0, 0, 0, 140));
		gb.DrawImage(icons40v28, Math.round((bt_s - bt_size) / 2) - 2, Math.round((bt_s - bt_size) / 2) - 1, bt_size, bt_size, bt_size * 2, 0, bt_size, bt_size);
		this.play_off.ReleaseGraphics(gb);
		if (this.play_ov)
			this.play_ov.Dispose();
		this.play_ov = gdi.CreateImage(bt_s, bt_s);
		gb = this.play_ov.GetGraphics();
		//gb.FillSolidRect(0, 0, this.play_ov.Width, this.play_ov.Height, RGBA(58, 58, 58, 200));
		gb.DrawImage(icons40v28, Math.round((bt_s - bt_size) / 2) - 2, Math.round((bt_s - bt_size) / 2) - 1, bt_size, bt_size, bt_size * 2, 0, bt_size, bt_size, 0, 170);
		this.play_ov.ReleaseGraphics(gb);
		if (this.play_on)
			this.play_on.Dispose();
		this.play_on = gdi.CreateImage(bt_s, bt_s);
		gb = this.play_on.GetGraphics();
		//gb.FillSolidRect(0, 0, this.play_on.Width, this.play_on.Height, RGBA(16, 16, 16, 200));
		gb.DrawImage(icons40v28, Math.round((bt_s - bt_size) / 2) - 2, Math.round((bt_s - bt_size) / 2) - 1, bt_size, bt_size, bt_size * 2, 0, bt_size, bt_size, 0, 90);
		this.play_on.ReleaseGraphics(gb);

		if (typeof(this.play_bt) == "undefined")
			this.play_bt = new button(this.play_off, this.play_ov, this.play_on);
		else
			this.play_bt.update(this.play_off, this.play_ov, this.play_on);

		if (this.add_off)
			this.add_off.Dispose();
		this.add_off = gdi.CreateImage(bt_s, bt_s);
		gb = this.add_off.GetGraphics();
		//gb.FillSolidRect(0, 0, this.add_off.Width, this.add_off.Height, RGBA(0, 0, 0, 140));
		gb.DrawImage(icons40v28, Math.round((bt_s - bt_size) / 2) - 1, Math.round((bt_s - bt_size) / 2) - 1, bt_size, bt_size, bt_size * 2, bt_size, bt_size, bt_size);
		this.add_off.ReleaseGraphics(gb);
		if (this.add_ov)
			this.add_ov.Dispose();
		this.add_ov = gdi.CreateImage(bt_s, bt_s);
		gb = this.add_ov.GetGraphics();
		//gb.FillSolidRect(0, 0, this.add_ov.Width, this.add_ov.Height, RGBA(58, 58, 58, 200));
		gb.DrawImage(icons40v28, Math.round((bt_s - bt_size) / 2) - 1, Math.round((bt_s - bt_size) / 2) - 1, bt_size, bt_size, bt_size * 2, bt_size, bt_size, bt_size, 0, 170);
		this.add_ov.ReleaseGraphics(gb);
		if (this.add_on)
			this.add_on.Dispose();
		this.add_on = gdi.CreateImage(bt_s, bt_s);
		gb = this.add_on.GetGraphics();
		//gb.FillSolidRect(0, 0, this.add_on.Width, this.add_on.Height, RGBA(16, 16, 16, 200));
		gb.DrawImage(icons40v28, Math.round((bt_s - bt_size) / 2) - 1, Math.round((bt_s - bt_size) / 2) - 1, bt_size, bt_size, bt_size * 2, bt_size, bt_size, bt_size, 0, 90);
		this.add_on.ReleaseGraphics(gb);

		if (typeof(this.add_bt) == "undefined")
			this.add_bt = new button(this.add_off, this.add_ov, this.add_on);
		else
			this.add_bt.update(this.add_off, this.add_ov, this.add_on);

	}

	this.draw = function (gr) {
		var coverWidth,
		coverTop;

		var playingID;
		var focusID;

		if (plman.PlayingPlaylist == plman.ActivePlaylist) {
			playingID = plman.GetPlayingItemLocation().PlaylistItemIndex;
		}
		focusID = plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist);

		if (repaint_main || repaint_f || !repaintforced) {
			repaint_main = false;
			repaint_f = false;
			repaintforced = false;
			if (lGroup == "Songs") {

				for (var r = 0; r < this.songs.length; r++) {

					cy = this.y + 10 + 35 * r;
					if ((this.y + this.h) > cy)
						this.songs[r].draw(gr, this.x + 10, cy, this.w - 20);
				}
			} else {
				var cx = 0;
				var ax,
				ay,
				by,
				rowStart,
				row;
				var aw = this.thumbnailWidth - (this.marginSide * 2);
				var ah = this.rowHeight - this.marginTop - this.marginBot;
				var coverW = cover.max_w;
				if (this.albums_draw.length <= this.totalRowsVis * this.totalColumns) {
					var start_ = 0;
					var end_ = this.albums_draw.length;
					var extended_end_ = end_;
				} else {
					var start_ = Math.round(scroll_ / this.rowHeight + 0.4) * this.totalColumns;
					var end_ = Math.round((scroll_ + wh) / this.rowHeight - 1.5) * this.totalColumns + this.totalColumns;
					var extended_end_ = end_ + ((this.totalRows - 1) * this.totalColumns) * 0;
					end_ = (this.albums_draw.length < end_) ? this.albums_draw.length : end_;
					extended_end_ = (this.albums_draw.length < extended_end_) ? this.albums_draw.length : extended_end_;
					start_ = start_ > 0 ? start_ - 1 * this.totalColumns : start_;
					if (g_showlist.idx > -1) {
						start_ = start_ > 0 ? start_ - 1 * this.totalColumns : start_;
					}
					if (start_ < 0)
						start_ = 0;
					end_ = end_ < this.albums_draw.length - 1 * this.totalColumns ? end_ + 1 * this.totalColumns : this.albums_draw.length;
					extended_end_ = extended_end_ < this.albums_draw.length - 1 * this.totalColumns ? extended_end_ + 1 * this.totalColumns : this.albums_draw.length;
				}

				// stamps
				if (g_showlist.idx > -1) {
					// expand showList
					g_showlist.delta = g_showlist.nbRows;
					rowStart = Math.floor(start_ / this.totalColumns);
					if (rowStart > g_showlist.rowIdx + 1)
						start_ -= this.totalColumns * Math.floor(g_showlist.delta);
					if (start_ < 0)
						start_ = 0;
					g_showlist.delta_ = Math.ceil((g_showlist.delta_ < g_showlist.delta * this.rowHeight) ? g_showlist.delta_ + (g_showlist.delta * this.rowHeight - g_showlist.delta_) / properties.smooth_expand_value : g_showlist.delta * this.rowHeight);
				} else {
					// collapse showList
					g_showlist.delta_ = Math.ceil((g_showlist.delta_ > 5) ? g_showlist.delta_ - (g_showlist.delta_ / properties.smooth_expand_value) : 0);
					if (g_showlist.delta_ == 0) {
						g_showlist.delta = 0;
						g_showlist.rowIdx = -1;
					}
				}
				g_scrollbar.setCursor(g_browser.totalRowsVis * g_browser.rowHeight, g_browser.rowHeight * g_browser.rowsCount + g_showlist.h, scroll_);

				g_end = end_;
				var tmp,
				offset;

				for (var i = start_; i < extended_end_; i++) {
					if (i < end_) {
						row = Math.floor(i / this.totalColumns);
						/*
						tmp = Math.floor(this.albums_draw[i].i/this.totalColumns);
						offset = tmp - row;
						if(Math.abs(offset) > 0.05) {
						this.albums_draw[i].i += (i - this.albums_draw[i].i)/8;
						//tmp = tmp > row ? tmp - 1 : tmp + 1;
						}
						 */
						ax = this.x + (cx * this.thumbnailWidth) + this.marginSide + this.marginLR;
						ay = Math.floor(this.y + (row * this.rowHeight) + this.marginTop - scroll_);
						if (g_showlist.delta_ > 0) {
							if (row > g_showlist.rowIdx) {
								ay = ay + g_showlist.delta_;
							}
						}
						this.albums_draw[i].x = ax;
						this.albums_draw[i].y = ay;
					}

					// get cover
					if (i < end_)
						if (scroll - scroll_ < this.h && this.albums_draw[i].y > (g_browser.y - g_browser.rowHeight - 50)) {
							if (artistDisplay_v2) {
								if (lGroup == "Artists")
									this.albums_draw[i].cover_img = g_artistImageCache.hit(this.albums_draw[i].metadb, i);
								else if (lGroup == "Genres")
									this.albums_draw[i].cover_img = g_genreImageCache.hit(this.albums_draw[i].metadb, i);
								else
									this.albums_draw[i].cover_img = g_imageCache.hit(this.albums_draw[i].metadb, i);
							} else
								this.albums_draw[i].cover_img = g_imageCache.hit(this.albums_draw[i].metadb, i);
						} else {
							if (artistDisplay_v2) {
								if (lGroup == "Artists")
									this.albums_draw[i].cover_img = g_artistImageCache.hit(this.albums_draw[i].metadb, i);
								else if (lGroup == "Genres")
									this.albums_draw[i].cover_img = g_genreImageCache.hit(this.albums_draw[i].metadb, i);
								else
									this.albums_draw[i].cover_img = g_imageCache.hit(this.albums_draw[i].metadb, i);
							} else
								this.albums_draw[i].cover_img = g_imageCache.hit(this.albums_draw[i].metadb, i);
						}
					if (i < end_) {
						if (ay >= (0 - this.rowHeight - 250)) { // && ay < this.y + this.h) {
							// Calcs
							//if (i == g_showlist.idx) {
							//	coverWidth = coverW;
							//	coverTop = ay + 3;
							//} else {
							coverWidth = coverW;
							coverTop = ay;
							//}

							if (this.stampDrawMode == 1)
								gr.FillSolidRect(ax, ay, aw, ah, RGBA(255, 255, 255, 15));

							this.Playing = false;

							for (var l = this.albums[i].trackIndex; l < (this.albums[i].trackIndex + this.albums_draw[i].pl.Count); l++) {
								if (playingID == l) {
									this.Playing = true;
								}
							}

							this.groupTxtCol = this.Playing ? accent_colour : this.fgColor;
							this.sortTxtCol = this.Playing ? accent_colour : col_text2;
							this.selectAll = false;

							for (var l = this.albums[i].trackIndex; l < (this.albums[i].trackIndex + this.albums_draw[i].pl.Count); l++) {
								if (plman.IsPlaylistItemSelected(plman.ActivePlaylist, l)) {
									gr.FillSolidRect(ax - 4, ay - 4, aw + 8, ah + 8 - 8, accent_colour);
									this.groupTxtCol = RGB(255, 255, 255);
									this.sortTxtCol = RGB(255, 255, 255);
									this.selectAll = true;
								} else {
									this.selectAll = false;
								}
							}

							/*
							if (plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist) == this.albums[i].trackIndex){ // this.albums_draw[i].pl)
							gr.FillSolidRect(ax - 3, ay - 3, aw + 6, ah + 6, accent_colour);

							this.groupTxtCol = RGB(255,255,255);
							this.sortTxtCol = RGB(255,255,255);
							} else {
							this.groupTxtCol = this.fgColor;
							this.sortTxtCol = col_text2;
							}
							 */

							if (i == this.activeIndex)
								gr.FillSolidRect(ax - 4, ay - 4, aw + 8, ah + 8 - 8, setAlpha(col_text1, this.clicked_id == this.activeIndex ? 10 : 20));

							// Cover
							var coverX = ax + Math.round((aw - coverWidth) / 2);
							var coverDiv = Math.round(coverWidth / 2);
							if (this.albums_draw[i].cover_img) {
								if (cover.raw_bitmap) {
									if (cover.keepaspectratio)
										draw_Bitmap(gr, this.albums_draw[i].cover_img, coverX, coverTop, coverWidth, cover.max_h, (lGroup == "Artists" || lGroup == "Genres") ? "crop top" : "crop");
									else
										gr.GdiAlphaBlend(this.albums_draw[i].cover_img, coverX, coverTop, coverWidth, cover.max_h, 1, 1, this.albums_draw[i].cover_img.Width - 1, this.albums_draw[i].cover_img.Height - 1, 255);
								} else {
									//	if (cover.keepaspectratio)
									draw_image(gr, this.albums_draw[i].cover_img, coverX, coverTop, coverWidth, cover.max_h, (lGroup == "Artists" || lGroup == "Genres") ? "crop top" : "crop", 0, 0, 255);
									//	else
									//gr.DrawImage(this.albums_draw[i].cover_img, coverX, coverTop, coverWidth, cover.max_h, 1, 1, this.albums_draw[i].cover_img.Width - 2, this.albums_draw[i].cover_img.Height - 2, 0, 255);
								}
							} else if (this.albums_draw[i].cover_img === null) {
								gr.FillSolidRect(coverX, coverTop, coverWidth, cover.max_h, col_noCoverBG);
								gr.DrawImage(properties.TFgrouping == groupByArtist ? mediaMissingArtist : properties.TFgrouping == groupByGenre ? mediaMissingGenre : mediaMissingAlbum, ax + Math.round((aw - 66) / 2), coverTop + Math.round((cover.max_h - 66) / 2), 66, 66, 0, 0, mediaMissingArtist.Width, mediaMissingArtist.Height, 0, 255);
								gr.DrawRect(coverX + 8, coverTop + 8, coverWidth - 8 * 2 - 1, cover.max_h - 8 * 2 - 1, 1.0, col_noCoverLine);
							} else {
								gr.FillSolidRect(coverX, coverTop, coverWidth, cover.max_h, col_noCoverBG);
								gr.GdiDrawText("Loading...", albumFont, RGB(164, 164, 164), coverX, coverTop, coverWidth, cover.max_h, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);
								gr.DrawRect(coverX + 8, coverTop + 8, coverWidth - 8 * 2 - 1, cover.max_h - 8 * 2 - 1, 1.0, col_noCoverLine);
							}

							var roundBorder = 1;

							if (roundBorder && deepBlue) {
								gr.SetSmoothingMode(2);
								gr.DrawRoundRect(coverX - 0.5 - 2, coverTop - 0.5 - 2, coverWidth + 4, cover.max_h + 4, 5, 5, 4, col_bg);
								gr.SetSmoothingMode(0);

								for (var l = this.albums[i].trackIndex; l < (this.albums[i].trackIndex + this.albums_draw[i].pl.Count); l++) {
									if (plman.IsPlaylistItemSelected(plman.ActivePlaylist, l)) {
										gr.SetSmoothingMode(2);
										gr.DrawRoundRect(coverX - 0.5 - 2, coverTop - 0.5 - 2, coverWidth + 4, cover.max_h + 4, 5, 5, 4, accent_colour);
										gr.SetSmoothingMode(0);
									} else {}

								}

								if (i == this.activeIndex) {
									gr.SetSmoothingMode(2);
									gr.DrawRoundRect(coverX - 0.5 - 2, coverTop - 0.5 - 2, coverWidth + 4, cover.max_h + 4, 5, 5, 4, setAlpha(col_text1, this.clicked_id == this.activeIndex ? 10 : 20));
									gr.SetSmoothingMode(0);
								}
							}

							if (deepBlue) {
								if (i == this.activeIndex && ((lGroup != "Artists" && lGroup != "Genres") || !artistDisplay_v2)) {

									gr.FillSolidRect(coverX, coverTop, coverWidth, cover.max_h, setAlpha(col_bg, 190));
								}
							} else {
								//if (i == this.activeIndex && ((lGroup != "Artists" && lGroup != "Genres") || !artistDisplay_v2)) {
								if (i == this.activeIndex && this.play_bt && this.add_bt) {
									gr.FillSolidRect(coverX, coverTop, coverWidth, cover.max_h, RGBA(0, 0, 0, 120));
									this.play_bt.draw(gr, ax + aw - Math.round((aw + this.play_bt.w + this.add_bt.w) / 2), coverTop + cover.max_h - this.play_bt.h - 10, 255);
									this.add_bt.draw(gr, this.play_bt.x + this.play_bt.w, this.play_bt.y, 255);
								}
								//}
							}

							// Selected all group
							if (this.selectAll && plman.IsPlaylistItemSelected(plman.ActivePlaylist, this.albums[i].trackIndex)) {
								var pts1 = Array(coverX + coverWidth - 35, coverTop, coverX + coverWidth, coverTop, coverX + coverWidth, coverTop + 35);
								gr.FillPolygon(accent_colour, 0, pts1);
								gr.DrawImage(icons25v35, coverX + coverWidth - 24, coverTop - 1, 27, 27, 27, 27 * 9, 27, 27);
							}

							// Text
							try {
								this.text1 = "";
								this.text2 = "";
								this.text3 = "";

								if (properties.TFgrouping == groupByArtist) {
									this.text1 = this.albums_draw[i].albumartist;
									this.text2 = this.albums_draw[i].pl.Count + (this.albums_draw[i].pl.Count > 1 ? " songs" : " song");
								} else if (properties.TFgrouping == groupByGenre) {
									this.text1 = this.albums_draw[i].genre;
									this.text2 = this.albums_draw[i].pl.Count + (this.albums_draw[i].pl.Count > 1 ? " songs" : " song");
								} else {
									this.sort_txt = (properties.TFsorting == SortByAlbum ? this.albums_draw[i].albumartist : (properties.TFsorting == SortByArtist ? this.albums_draw[i].albumartist : properties.TFsorting == SortByGenre ? this.albums_draw[i].genre : (properties.TFsorting == SortByYear ? this.albums_draw[i].date : (properties.TFsorting == SortByStyle ? this.albums_draw[i].style : (properties.TFsorting == SortByPublisher ? this.albums_draw[i].publisher : "")))));
									var select_pl_active = plman.GetPlaylistName(fb.ActivePlaylist).substr(0, 20) == "Playlist Selection [" ? true : false;
									if (select_pl_active && properties.TFsorting == SortByArtist && old_group_selection == groupByGenre)
										this.sort_txt = this.albums_draw[i].albumartist;
									else if (select_pl_active && properties.TFsorting == SortByGenre)
										this.sort_txt = this.albums_draw[i].genre;
									this.text1 = this.albums_draw[i].album;
									this.text2 = this.sort_txt;
									this.text3 = this.albums_draw[i].pl.Count + (this.albums_draw[i].pl.Count > 1 ? " songs" : " song");
								}

								var margenTxtX = 0;
								var margenTxtY = 10;

								this.arr_txt = gr.EstimateLineWrap(this.text1, albumFont, coverWidth - margenTxtX * 2).toArray();
								this.txt_w = (this.arr_txt[3] - this.arr_txt[1]);
								this.txt_h = gr.CalcTextHeight(this.text1, albumFont);
								this.album_txt_h = (this.txt_w <= (coverWidth - margenTxtX * 2 + this.txt_h * 2)) ? this.txt_h * 2 : this.txt_h * 1;

								this.arr_txt2 = gr.EstimateLineWrap(this.text2, albumArtistFont, coverWidth - margenTxtX * 2).toArray();
								this.txt_w2 = (this.arr_txt2[3] - this.arr_txt2[1]);
								this.txt_h2 = gr.CalcTextHeight(this.text2, albumArtistFont);
								this.album_txt_h2 = (this.txt_w2 <= (coverWidth - margenTxtX * 2 + this.txt_h2 * 2)) ? this.txt_h2 * 2 : this.txt_h2 * 1;

								gr.GdiDrawText(this.text1, albumFont, this.groupTxtCol, coverX + margenTxtX, coverTop + cover.max_h + margenTxtY, coverWidth - margenTxtX * 2, this.txt_h * 2, DT_LEFT | DT_TOP | DT_WORDBREAK | DT_END_ELLIPSIS | DT_NOPREFIX);
								gr.GdiDrawText(this.text2, albumArtistFont, this.sortTxtCol, coverX + margenTxtX, coverTop + cover.max_h + this.album_txt_h + margenTxtY + 3, coverWidth - margenTxtX * 2, this.txt_h2 * 2, DT_LEFT | DT_TOP | DT_WORDBREAK | DT_END_ELLIPSIS | DT_NOPREFIX);
								if (properties.showCountTracks)
									gr.GdiDrawText(this.text3, albumArtistFont, this.sortTxtCol, coverX + margenTxtX, coverTop + coverW + this.album_txt_h + this.album_txt_h2 + margenTxtY + 4, coverWidth - margenTxtX * 2, 25, DT_LEFT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);
								/*
								var bt_size = 27;
								gr.DrawImage(icons25v23, coverX + margenTxtX + gr.CalcTextWidth(this.text2, albumArtistFont) + 5, coverTop + cover.max_h + this.album_txt_h + margenTxtY + 2, bt_size-10, bt_size-10, bt_size * 1, bt_size * 2, bt_size, bt_size);
								 */
							} catch (e) {}
						}
						if (cx == this.totalColumns - 1)
							cx = 0;
						else
							cx++;
					}
				}

				// draw tracks of expanded album
				g_showlist.draw(gr);

				/*
				var topbar_color = blendColors(this.fgColor, this.bgColor, 0.95);

				// draw header
				gr.FillSolidRect(this.x, 0, this.w + cScrollbar.width, this.y - 7, topbar_color);
				gr.FillSolidRect(this.x, this.y - 7, this.w + cScrollbar.width, 7, topbar_color);
				gr.FillSolidRect(this.x, this.y - 2, this.w + cScrollbar.width, 2, this.bgColor);
				gr.FillGradRect(this.x, this.y - 7, this.w + cScrollbar.width, 10, 90, this.bgColor, 0, 1.0);
				gr.FillGradRect(this.x, 0, this.w + cScrollbar.width, this.y - 4, 90, RGBA(0, 0, 0, 20), 0, 1.0);
				if (g_library_to_reload) {
				gr.gdiDrawText("refresh required!", gdi.Font("Segoe UI semibold", 12, 0), blendColors(this.fgColor, this.bgColor, 0.7), this.x + 185, 12, 200, this.h, DT_LEFT | DT_TOP | DT_NOPREFIX | DT_END_ELLIPSIS);
				} else {
				// top panel info
				gr.gdiDrawText(this.albums_draw.length + " / " + this.albums.length, gdi.Font("Segoe UI semibold", 12, 0), blendColors(this.fgColor, this.bgColor, 0.7), this.x + 185, 12, 200, this.h, DT_LEFT | DT_TOP | DT_NOPREFIX | DT_END_ELLIPSIS);
				}
				 */
			}
		}

	}

	this.dragged = function (gr) {
		if (repaint_main || repaint_f || !repaintforced) {
			repaint_main = false;
			repaint_f = false;
			repaintforced = false;

			var coverDraw_size = 60;
			var drag_x = m_x - 10;
			var drag_y = m_y - 8;

			// dragged album draw
			if (g_dragA && g_ishover) {
				if (this.albums_draw[g_dragA_idx].cover_img) {
					if (cover.raw_bitmap) {
						if (cover.keepaspectratio)
							draw_Bitmap(gr, this.albums_draw[g_dragA_idx].cover_img, drag_x, drag_y, coverDraw_size, coverDraw_size, "crop top", 7);
						else
							gr.GdiAlphaBlend(this.albums_draw[g_dragA_idx].cover_img, drag_x, drag_y, coverDraw_size, coverDraw_size, 0, 0, this.albums_draw[g_dragA_idx].cover_img.Width, this.albums_draw[g_dragA_idx].cover_img.Height, 255);
					} else {
						if (cover.keepaspectratio)
							draw_image(gr, this.albums_draw[g_dragA_idx].cover_img, drag_x, drag_y, coverDraw_size, coverDraw_size, "crop top", 0, 0, 255);
						else
							gr.DrawImage(this.albums_draw[g_dragA_idx].cover_img, drag_x, drag_y, coverDraw_size, coverDraw_size, 0, 0, this.albums_draw[g_dragA_idx].cover_img.Width, this.albums_draw[g_dragA_idx].cover_img.Height, 0, 255);
					}
				} else {
					gr.FillSolidRect(drag_x, drag_y, coverDraw_size, coverDraw_size, col_noCoverBG);
					gr.DrawImage(properties.TFgrouping == groupByArtist ? mediaMissingArtist : properties.TFgrouping == groupByGenre ? mediaMissingGenre : mediaMissingAlbum, drag_x + 10, drag_y + 10, 40, 40, 0, 0, mediaMissingArtist.Width, mediaMissingArtist.Height, 0, 255);
					gr.DrawRect(drag_x + 3, drag_y + 3, coverDraw_size - 7, coverDraw_size - 7, 1.0, col_noCoverLine);
				}
				album_idx_txtW = gr.CalcTextWidth(this.albums_draw[g_dragA_idx].pl.Count, gdi.Font("Segoe UI", 13, 1));
				gr.FillSolidRect(drag_x + coverDraw_size - album_idx_txtW - 24, drag_y + coverDraw_size - 30, album_idx_txtW + 24, 30, accent_colour);
				gr.gdiDrawText(this.albums_draw[g_dragA_idx].pl.Count, gdi.Font("Segoe UI", 13, 1), RGB(255, 255, 255), drag_x + coverDraw_size - 12 - album_idx_txtW, drag_y + coverDraw_size - 30, album_idx_txtW, 30, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			}

			// dragged track draw
			if (g_dragR && g_ishover) {
				if (g_showlist.cover)
					gr.GdiAlphaBlend(g_showlist.cover, drag_x, drag_y, coverDraw_size, coverDraw_size, 0, 0, g_showlist.cover.Width, g_showlist.cover.Height, 255);
				else {
					gr.FillSolidRect(drag_x, drag_y, coverDraw_size, coverDraw_size, col_noCoverBG);
					gr.DrawImage(properties.TFgrouping == groupByArtist ? mediaMissingArtist : properties.TFgrouping == groupByGenre ? mediaMissingGenre : mediaMissingAlbum, drag_x + 10, drag_y + 10, 30, 30, 0, 0, mediaMissingArtist.Width, mediaMissingArtist.Height, 0, 255);
					gr.DrawRect(drag_x + 3, drag_y + 3, coverDraw_size - 7, coverDraw_size - 7, 1.0, col_noCoverLine);
				}
				album_idx_txtW = gr.CalcTextWidth(plman.GetPlaylistSelectedItems(plman.ActivePlaylist).Count, gdi.Font("Segoe UI", 13, 1));
				gr.FillSolidRect(drag_x + coverDraw_size - album_idx_txtW - 24, drag_y + coverDraw_size - 30, album_idx_txtW + 24, 30, accent_colour);
				gr.gdiDrawText(plman.GetPlaylistSelectedItems(plman.ActivePlaylist).Count, gdi.Font("Segoe UI", 13, 1), RGB(255, 255, 255), drag_x + coverDraw_size - 12 - album_idx_txtW, drag_y + coverDraw_size - 30, album_idx_txtW, 30, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			}

		}
	}

	this.on_mouse = function (event, x, y) {
		this.ishover = (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h);

		switch (event) {
		case "lbtn_down":
			if (this.ishover) {
				//if (((lGroup != "Artists" && lGroup != "Genres") || !artistDisplay_v2) &&
				if (this.activeIndex > -1 && Math.abs(scroll - scroll_) < 2) {
					if (this.play_bt.checkstate("down", x, y) == ButtonStates.down)
						return;
					if (this.add_bt.checkstate("down", x, y) == ButtonStates.down)
						return;
				}
			}

			if (this.ishover && this.rowsCount == 0) {}
			else {
				if (this.ishover && this.activeIndex > -1 && Math.abs(scroll - scroll_) < 2) {
					this.sourceX = x;
					this.sourceY = y;
					this.clicked = true;
					this.clicked_id = this.activeIndex;
				} else {
					this.clicked = false;
					this.clicked_id = -1;
				}
				if (g_showlist.idx > -1) {
					g_showlist.play_album_bt.checkstate("down", x, y);
					g_showlist.queue_album_bt.checkstate("down", x, y);
					g_showlist.quick_album_bt.checkstate("down", x, y);
				}
			}
			break;
		case "lbtn_up":
			var a = g_browser.activeIndex;
			if (a > -1) {
				if (this.ishover) {
					try {
						//if (((lGroup != "Artists" && lGroup != "Genres") || !artistDisplay_v2) &&
						if (this.activeIndex > -1 && Math.abs(scroll - scroll_) < 2) {

							if (this.play_bt.checkstate("up", x, y) == ButtonStates.hover) {
								var a = this.activeIndex;
								if (fb.IsPlaying)
									fb.Stop();
								if (plman.IsPlaybackQueueActive())
									plman.FlushPlaybackQueue();

								fb.RunContextCommandWithMetadb("Add to playback queue", this.albums_draw[a].pl);
								fb.Play();
							}

							if (this.add_bt.checkstate("up", x, y) == ButtonStates.hover) {
								var a = this.activeIndex;
								this.ishover = true;
								add_menu(this.add_bt.x + this.add_bt.w, this.add_bt.y + this.add_bt.h + 0, this.albums_draw[a].pl, TPM_RIGHTALIGN);
								g_browser.repaint();
							}

						}
					} catch (e) {
						fb.trace(e.message);
					}
				}
			}

			g_dragC = false;

			if (this.ishover && this.rowsCount == 0) {
				if (plman.ActivePlaylist == 0)
					fb.RunMainMenuCommand("Library/Configure");
				else
					fb.RunMainMenuCommand("File/Add files...");
				this.clicked = false;
			} else {
				this.clicked = false;
				this.clicked_id = -1;
				if (g_dragA) {
					//g_dragA = false;
					//g_dragA_idx = -1;
					//g_drag_timer = false;
					len = g_plmanager.playlists.length;
					for (var i = 0; i < len; i++) {
						if (g_plmanager.playlists[i].type == 2) {
							g_plmanager.playlists[i].checkstate("up", x, y, i);
						}
					}
					if (g_dragA) {
						g_dragA = false;
						g_drag_timer = false;
						g_drag_timer = fb.CreateProfiler();
					}
					this.repaint();
				}
				if (g_showlist.idx > -1) {
					if (g_showlist.play_album_bt.checkstate("up", x, y) == ButtonStates.hover) {
						var a = g_showlist.idx;
						if (a > -1) {
							if (fb.IsPlaying)
								fb.Stop();
							if (plman.IsPlaybackQueueActive()) {
								plman.FlushPlaybackQueue();
							}
							fb.RunContextCommandWithMetadb("Add to playback queue", this.albums_draw[a].pl);
							fb.Play();
						}
					}

					if (g_showlist.queue_album_bt.checkstate("up", x, y) == ButtonStates.hover) {
						var a = g_showlist.idx;
						if (a > -1) {
							try {
								add_menu(g_showlist.queue_album_bt.x, g_showlist.queue_album_bt.y + g_showlist.queue_album_bt.h, this.albums_draw[a].pl, 0);
							} catch (e) {
								fb.trace(e.message);
							}
						}
					}

					if (g_showlist.quick_album_bt.checkstate("up", x, y) == ButtonStates.hover) {
						var a = g_showlist.idx;
						if (a > -1) {
							if (fb.IsPlaying)
								fb.Stop();
							if (plman.IsPlaybackQueueActive()) {
								plman.FlushPlaybackQueue();
							}
							selectedIndexes = [];
							plman.ClearPlaylistSelection(plman.ActivePlaylist);
							for (var id = this.albums_draw[a].trackIndex; id < (this.albums_draw[a].trackIndex + this.albums_draw[a].pl.Count); id++) {
								selectedIndexes.push(id);
							}
							plman.SetPlaylistSelection(plman.ActivePlaylist, selectedIndexes, true);
							fb.RunContextCommandWithMetadb("Add to playback queue", shuffleItems(plman.GetPlaylistSelectedItems(plman.ActivePlaylist), "%title%"));
							plman.ClearPlaylistSelection(plman.ActivePlaylist);
							fb.Play();
						}
					}

					this.repaint();
				}
			}
			break;
		case "lbtn_dblclk":
			/*var a = this.activeIndex;
			if (a > -1) {
			if (plman.IsPlaybackQueueActive()) {
			plman.FlushPlaybackQueue();
			}
			fb.RunContextCommandWithMetadb("Add to playback queue", this.albums_draw[a].pl);
			fb.Play();
			}
			/*
			var a = this.activeIndex;
			apply_playlist(this.albums_draw[a].pl);
			fb.RunContextCommandWithMetadb("Play", this.albums_draw[a].metadb);
			 */
			break;
		case "move":
			var hand = false;

			if (this.ishover) {
				//if ((lGroup != "Artists" && lGroup != "Genres") || !artistDisplay_v2) {
				this.play_bt.checkstate("move", m_x, m_y);
				this.add_bt.checkstate("move", m_x, m_y);
				//}
			}

			if (!g_dragA && this.clicked && (Math.abs(x - this.sourceX) > 3 || Math.abs(y - this.sourceY) > 3)) {
				g_dragA = true;
				g_dragA_idx = this.clicked_id;
				g_plmanager.isOpened = true;
				// rebuild playlists list
				g_plmanager.setPlaylistList();
				if (this.sourceX > this.x + Math.round(this.w / 2)) {
					g_plmanager.side = "left";
				} else {
					g_plmanager.side = "left";
				}
				g_drag_timer = fb.CreateProfiler();
			}
			if (g_dragA) {

				len = g_plmanager.playlists.length;
				for (var i = 0; i < len; i++) {
					if (g_plmanager.playlists[i].type == 2) {
						g_plmanager.playlists[i].checkstate("move", x, y, i);
					}
				}

				this.repaint();
			} else {
				if (g_showlist.idx > -1) {
					if (g_showlist.play_album_bt.checkstate("move", m_x, m_y) == ButtonStates.hover)
						hand = true;
					if (g_showlist.queue_album_bt.checkstate("move", m_x, m_y) == ButtonStates.hover)
						hand = true;
					if (g_showlist.quick_album_bt.checkstate("move", m_x, m_y) == ButtonStates.hover)
						hand = true;
				}
			}
			//window.SetCursor(hand ? IDC_HAND : IDC_ARROW);
			break;
		case "leave":
			if (g_showlist.idx > -1) {
				g_showlist.play_album_bt.checkstate("leave", 0, 0);
				g_showlist.queue_album_bt.checkstate("leave", 0, 0);
				g_showlist.quick_album_bt.checkstate("leave", 0, 0);
			}
			g_ishover = false;
			g_browser.activeIndex = -1;
			g_browser.repaint();
			break;
		}
	}

	if (this.g_time) {
		window.KillTimer(this.g_time);
		this.g_time = false;
	}
	this.g_time = window.SetInterval(function () {
			if (!window.IsVisible) {
				window_visible = false;
				return;
			}

			if ((tabActive == "Now_Playing") || (lGroup == "Songs"))
				return;

			var repaint_1 = false;
			var repaint_2 = false;

			if (!window_visible) {
				window_visible = true;
				on_mouse_lbtn_down(3, 3, 0);
				on_mouse_lbtn_up(3, 3, 0);
				scroll_ += 1;
			}

			/*if (g_drag_timer) {
			if (g_dragA || g_dragR || g_showPLM) {
			order_delta += 50;
			if (order_delta > or_w) {
			order_delta = or_w;
			g_drag_timer = false;
			}
			} else {
			order_delta -= 50;
			if (order_delta < 0) {
			order_delta = 0;
			g_drag_timer = false;
			}
			}

			repaint_1 = true;
			/*
			if (g_plmanager.side == "right") {
			window.RepaintRect(ww - g_plmanager.w, g_plmanager.y, g_plmanager.w, g_plmanager.h);
			} else {
			window.RepaintRect(0, g_plmanager.y, g_plmanager.w, g_plmanager.h);
			}
			 */
			//}

			if (g_dragup_timer) {
				g_dragup_flashescounter++;
				if (g_dragup_flashescounter % 5 == 0 && g_dragup_flashescounter <= 25) {
					g_dragup_flash = !g_dragup_flash;
				}
				if (g_dragup_flash && g_dragup_flashescounter > 25) {
					g_dragup_flash = false;
				}
				if (g_dragup_flashescounter > 40) {
					g_flash_idx = -1;
					g_dragup_timer = false;
					g_drag_timer = fb.CreateProfiler();
				}
				repaint_1 = true;
			}

			if (!g_dragA && !g_dragR && !g_dragC) {
				if (g_showlist.idx > -1) {
					if (m_y > g_showlist.y) {
						if (m_y < g_showlist.y + g_showlist.h + 1) {
							g_browser.activeRow = -10;
						} else {
							g_browser.activeRow = Math.ceil((m_y + scroll_ - g_browser.y - g_showlist.h) / g_browser.rowHeight) - 1;
						}
					} else {
						g_browser.activeRow = Math.ceil((m_y + scroll_ - g_browser.y) / g_browser.rowHeight) - 1;
					}
				} else {
					g_browser.activeRow = Math.ceil((m_y + scroll_ - g_browser.y) / g_browser.rowHeight) - 1;
				}

				if (m_y > g_browser.y && m_x > g_browser.x + g_browser.marginLR && m_x < g_browser.x + g_browser.w - g_browser.marginLR) {
					g_browser.activeColumn = Math.ceil((m_x - g_browser.x - g_browser.marginLR) / (g_browser.thumbnailWidth)) - 1;
					g_browser.activeIndex = (g_browser.activeRow * g_browser.totalColumns) + g_browser.activeColumn;
					g_browser.activeIndex = g_browser.activeIndex > g_browser.albums_draw.length - 1 ? -1 : g_browser.activeIndex;
				} else {
					g_browser.activeIndex = -1;
				}
				if (g_browser.activeIndex != g_browser.activeIndexSaved) {
					g_browser.activeIndexSaved = g_browser.activeIndex;
					repaint_1 = true;
				}
			}

			if (repaint_main1 == repaint_main2) {
				repaint_main2 = !repaint_main1;
				repaint_1 = true;
			}

			scroll = check_scroll(scroll);
			if (scroll - scroll_ < -5.5 || scroll - scroll_ > 5.5) {
				scroll_ += (scroll - scroll_) / properties.smooth_scroll_value;
				isScrolling = true;
				repaint_1 = true;
			} else {
				if (scroll_ != scroll) {
					scroll_ = scroll; // force to scroll_ value to fixe the 5.5 stop value for expanding album action
					repaint_1 = true;
				}
				if (g_showlist.delta_ > 0 && g_showlist.delta_ < g_showlist.delta * g_browser.rowHeight) {
					repaint_1 = true;
				} else {
					isScrolling = false;
				}
			}

			// continue to load cover art for albums after the last albums drawn on screen
			if (!g_dragA && !g_dragR) {
				if (properties.loadInBackground) {
					if (!repaint_1 && !repaint_2) {
						if (g_last < g_browser.albums_draw.length) {
							if (!g_hiddenLoadTimer) {
								g_hiddenLoadTimer = window.SetTimeout(function () {
										try {
											if (artistDisplay_v2) {
												if (lGroup == "Artists")
													g_artistImageCache.hit(g_browser.albums_draw[g_last].metadb, g_last);
												else if (lGroup == "Genres")
													g_genreImageCache.hit(g_browser.albums_draw[g_last].metadb, g_last);
												else
													g_imageCache.hit(g_browser.albums_draw[g_last].metadb, g_last);
											} else
												g_imageCache.hit(g_browser.albums_draw[g_last].metadb, g_last);
										} catch (e) {
											fb.trace(e.message);
										}
										g_last++;
										g_hiddenLoadTimer && window.ClearTimeout(g_hiddenLoadTimer);
										g_hiddenLoadTimer = false;
									}, 50);
							}
						}
					}
				}
			}

			if (repaint_1) {
				repaintforced = true;
				repaint_main = true;

				if (!g_start_time) {
					if (g_dragA || g_dragR) {
						window.Repaint();
					} else {
						window.RepaintRect(properties.showleftPanel ? g_plmanager.w : 0, 0, ww - (properties.showleftPanel ? g_plmanager.w : 0), wh - (properties.showBottomPanel ? Bar_h : 0));
						if (properties.showscrollbar && g_scrollbar && g_browser.rowsCount > 0 && (g_browser.rowsCount + Math.round(g_showlist.delta) > g_browser.totalRowsVis))
							window.RepaintRect(g_scrollbar.x, 0, g_scrollbar.w, g_browser.headerBarHeight);
					}
				}

			}

			// tweaks to fix bug in timer/memory/repaint handle in WSH Panel Mod v1.5.6
			collect_counter++
			if (collect_counter > 30) {
				collect_counter = 0;
				CollectGarbage();
			}
		}, properties.repaint_rate);

}

var image_cache = function () {
	this._cachelist = {};
	this.hit = function (metadb, albumIndex) {
		var img = this._cachelist[metadb.Path];
		if (typeof img == "undefined") {
			// if image not in cache, we load it asynchronously
			if (!cover.load_timer) {
				cover.load_timer = window.SetTimeout(function () {
						if (artistDisplay_v2) {
							if (lGroup == "Artists") {
								art_id = AlbumArtId.artist;
								utils.GetAlbumArtAsync(window.ID, metadb, art_id, true, false, false);
							} else if (lGroup == "Genres") {
								getGenreArt(metadb);
								//gdi.LoadImageAsync(window.ID, Skin_Path + "images\\genres\\" + fb.TitleFormat("%genre%").EvalWithMetadb(metadb) + ".jpg");
							} else if (lGroup == "Albums") {
								art_id = AlbumArtId.front;
								utils.GetAlbumArtAsync(window.ID, metadb, art_id, true, false, false);
							}
						} else {
							art_id = AlbumArtId.front;
							utils.GetAlbumArtAsync(window.ID, metadb, art_id, true, false, false);
						}
						//art_id = albumIndex + 5;
						cover.load_timer && window.ClearTimeout(cover.load_timer);
						cover.load_timer = false;
					}, 20);
			}
		}
		return img;
	}
	this.getit = function (metadb, track_type, image) {
		var cw = cover.max_w;
		var ch = cw;
		var img;
		/*if (cover.keepaspectratio) {
		if (!image) {
		var pw = cw + cover.margin * 2;
		var ph = ch + cover.margin * 2;
		} else {
		if (image.Height >= image.Width) {
		var ratio = image.Width / image.Height;
		var pw = (cw + cover.margin * 2) * ratio;
		var ph = ch + cover.margin * 2;
		} else {
		var ratio = image.Height / image.Width;
		var pw = cw + cover.margin * 2;
		var ph = (ch + cover.margin * 2) * ratio;
		}
		}
		} else {
		var pw = cw + cover.margin * 2;
		var ph = ch + cover.margin * 2;
		}*/
		// cover.type : 0 = nocover, 1 = external cover, 2 = embedded cover, 3 = stream
		if (track_type != 3) {
			if (metadb) {
				//img = FormatCover(image, pw, ph, cover.draw_glass_reflect, cover.raw_bitmap, "center");
				img = resizeImage(image, cover.max_w, cover.max_w, cover.raw_bitmap, 0);
				if (!img) {
					cover.type = 0;
				} else {
					cover.type = 1;
				}
			}
		} else {
			cover.type = 3;
		}
		this._cachelist[metadb.Path] = img;
		return img;
	}
}

function resizeImage(image, w, h, rawBitmap, interpolation_mode) {
	if (!image || w <= 0 || h <= 0)
		return image;

	if (image.Height >= image.Width) {
		var ratio = image.Width / image.Height;
		var pw = w * ratio;
		var ph = h;
	} else {
		var ratio = image.Height / image.Width;
		var pw = w;
		var ph = h * ratio;
	}

	if (rawBitmap)
		return image.Resize(pw, ph, interpolation_mode).CreateRawBitmap();
	else
		return image.Resize(pw, ph, interpolation_mode);

}

function FormatCover(image, w, h, reflect, rawBitmap, type) {
	if (!image || w <= 0 || h <= 0)
		return image;
	if (reflect) {
		var new_img = image.Resize(w, h);
		var gb = new_img.GetGraphics();
		if (h > w) {
			gb.DrawImage(cover.glass_reflect, Math.floor((h - w) / 2) * -1 + 1, 1, h - 2, h - 2, 0, 0, cover.glass_reflect.Width, cover.glass_reflect.Height, 0, 150);
		} else {
			gb.DrawImage(cover.glass_reflect, 1, Math.floor((w - h) / 2) * -1 + 1, w - 2, w - 2, 0, 0, cover.glass_reflect.Width, cover.glass_reflect.Height, 0, 150);
		}
		new_img.ReleaseGraphics(gb);
		if (rawBitmap) {
			return new_img.CreateRawBitmap();
		} else {
			return new_img;
		}
	} else {
		if (rawBitmap) {
			return image.Resize(w, h).CreateRawBitmap();
		} else {
			//return image.Resize(w, h);
			//var new_img = image.Resize(w, h);
			new_img = gdi.CreateImage(w, h);
			var gb = new_img.GetGraphics();
			//if (cover.keepaspectratio)
			draw_image(gb, image, 0, 0, w, h, type, 0, 0, 255);
			//else
			//gb.DrawImage(image, 0, 0, w, h, 0, 0, image.Width, image.Height);
			new_img.ReleaseGraphics(gb);
			return new_img;
		}
	}
	CollectGarbage();
}

function reset_cover_timers() {
	cover.load_timer && window.ClearTimeout(cover.load_timer);
	cover.load_timer = false;
}

function on_load_image_done(tid, image) {
	/*	for (var i = 0; i < g_browser.albums_draw.length; i++) {
	//if (!list[i].id)
	//continue;
	if (list[i].id == tid && list[i].state == 1) {
	list[i].state = 2;
	list[i].img_ = image;
	repaint_main1 = repaint_main2;
	var img_cache = new Object();
	img_cache.img = image;
	img_cache.string = list[i].string_cache;
	list_img.push(img_cache);
	break;
	}
	}*/
	fb.trace(tid);
}

function getGenreArt(metadb) {
	var image = null;
	if (g_browser)
		for (var i = 0; i < g_browser.albums_draw.length; i++) {
			if (g_browser.albums_draw[i].metadb) {
				if (g_browser.albums_draw[i].metadb.Compare(metadb)) {
					try {
						image = gdi.Image(Skin_Path + "images\\genres\\" + fb.TitleFormat("%genre%").EvalWithMetadb(metadb) + ".jpg");
					} catch (e) {
						image = null;
						cover.done_timer && window.ClearTimeout(cover.done_timer);
						cover.done_timer = false;
						return;
					}
					g_browser.albums_draw[i].cover_img = g_genreImageCache.getit(metadb, g_browser.albums_draw[i].tracktype, image);
					if (!cover.done_timer) {
						cover.done_timer = window.SetTimeout(function () {
								try {
									window.RepaintRect(g_browser.albums_draw[i].x, g_browser.albums_draw[i].y, g_browser.thumbnailWidth, g_browser.thumbnailWidth);
								} catch (e) {
									fb.trace(e);
								}
								//g_browser.repaint();
								cover.done_timer && window.ClearTimeout(cover.done_timer);
								cover.done_timer = false;
							}, 5);
					}
					break;
				}
			}
		}
}

function seek_track(metadb) {
	if (g_browser) {
		var total_albums = g_browser.albums_draw.length;
		var total_tracks = 0;
		var found = false;
		for (var a = 0; a < total_albums; a++) {
			total_tracks = g_browser.albums_draw[a].pl.Count;
			for (var t = 0; t < total_tracks; t++) {
				found = g_browser.albums_draw[a].pl.Item(t).Compare(metadb);
				if (found)
					break;
			}
			if (found)
				break;
		}

		if (found) { // scroll to album and open showlist
			if (!properties.expandInPlace && scroll > (g_browser.rowsCount * g_browser.rowHeight) - wh) {}
			else {
				var scroll_new = Math.floor(a / g_browser.totalColumns) * g_browser.rowHeight;

				if (scroll_new <= scroll + 10 && scroll_new >= scroll - 10) {}
				else {
					scroll_ = scroll_new > 0 ? (scroll > scroll_new ? scroll_new + g_browser.rowHeight : scroll_new - g_browser.rowHeight) : scroll_new + g_browser.rowHeight;
					scroll = scroll_new;
				}

				scroll = Math.floor(a / g_browser.totalColumns) * g_browser.rowHeight;
				if (scroll > scroll_ && scroll - scroll_ > wh) {
					scroll_ = scroll - (Math.ceil(wh / g_browser.rowHeight) * g_browser.rowHeight);
				} else if (scroll < scroll_ && scroll_ - scroll > wh) {
					scroll_ = scroll + (Math.ceil(wh / g_browser.rowHeight) * g_browser.rowHeight);
				}
			}

			if (properties.expandInPlace) {
				// set size of new showList of the selected album
				var playlist = g_browser.albums_draw[a].pl;
				g_showlist.calcHeight(playlist, a);
				g_showlist.setColumns(a);
				var showList_nbRows = Math.round(g_showlist.h / g_browser.rowHeight * 100) / 100;
				var showList_h = Math.round(showList_nbRows * g_browser.rowHeight);

				// check in which column is the track seeked if multi columns layout
				found = false;
				for (var r = 0; r < g_showlist.columns[0].rows.length; r++) {
					found = g_showlist.columns[0].rows[r].metadb.Compare(metadb);
					if (found)
						break;
				}

				if (g_showlist.idx < 0) {
					if (g_showlist.close_bt)
						g_showlist.close_bt.state = ButtonStates.normal;
					if (properties.expandInPlace)
						g_showlist.reset(a, Math.floor(a / g_browser.totalColumns), showList_nbRows, showList_h);
					//apply_playlist(playlist);
				} else if (g_showlist.idx == a) {}
				else {
					g_showlist.close_bt.state = ButtonStates.normal;
					g_showlist.delta_ = 0;
					g_showlist.reset(a, Math.floor(a / g_browser.totalColumns), showList_nbRows, showList_h);
					//apply_playlist(playlist);
				}

				selected_row = metadb;
				g_scrollbar.setCursor(g_browser.totalRowsVis * g_browser.rowHeight, g_browser.rowHeight * g_browser.rowsCount + g_showlist.h, scroll_);
			}

			g_browser.repaint();

		}
	}
}

// Reload Library

function reload_library() {
	if (g_browser) {
		if (!g_metadb_timer) {
			g_metadb_timer = window.SetTimeout(function () {
					scroll = scroll_ = 0;
					g_filterbox.inputbox.text = "";
					g_browser.populate(true);
					g_sendResponse();
					g_metadb_timer && window.ClearTimeout(g_metadb_timer);
					g_metadb_timer = false;
				}, 500);
		}
	}
}

function apply_playlist(playlist, plname) {

	old_pl_selection = plman.ActivePlaylist;
	//oldlGroup = lGroup;

	// Search QuickSearch playlist index
	var isFound = false;
	var total = plman.PlaylistCount;
	for (var i = 0; i < total; i++) {
		if (plman.GetPlaylistName(i).substr(0, 20) == "Playlist Selection [") {
			var pl_idx = i;
			isFound = true;
			break;
		}
	}
	if (isFound) {
		plman.RemovePlaylist(pl_idx);
	} else {
		pl_idx = total;
	}

	fb.CreatePlaylist(pl_idx, "Playlist Selection [" + plname + "]");
	var playlist_ = playlist.Clone();
	playlist_.OrderByFormat(fb.TitleFormat(SortByAlbum), sortDirection);
	plman.SortByFormatV2(pl_idx, SortByAlbum, sortDirection);

	plman.InsertPlaylistItems(pl_idx, 1, playlist_);
	plman.ActivePlaylist = pl_idx;
	fb.RunMainMenuCommand("Edit/Remove Duplicates");

	// Remove Historial
	/*	var prm = plman.PlaylistRecyclerManager;
	var affectedItems = Array();
	for (var i = 0; i < prm.Count; i++) {
	if (prm.Name(i).substr(0, 20) == "Playlist Selection [")
	affectedItems.push(i);
	}
	prm.Purge(affectedItems);*/

}

function play_playlist(playlist) {
	// Playlist stuff
	var pl_idx = check_playlist("Album Library Selection");
	if (pl_idx != -1)
		fb.RemovePlaylist(pl_idx);
	else
		pl_idx = fb.PlaylistCount;
	fb.CreatePlaylist(pl_idx, "Album Library Selection");
	var playlist_ = playlist.Clone();
	playlist_.OrderByFormat(fb.TitleFormat(SortByAlbum), sortDirection);
	plman.SortByFormatV2(pl_idx, SortByAlbum, sortDirection);

	plman.InsertPlaylistItems(pl_idx, 1, playlist_);

	focus_id = plman.GetPlaylistFocusItemIndex(pl_idx);
	plman.ExecutePlaylistDefaultAction(pl_idx, 0);

	//fb.RunContextCommandWithMetadb("Play", playlist_);
	//fb.RunMainMenuCommand("Edit/Remove Duplicates");
}

function checkMediaLibrayPlaylist() {
	g_avoid_on_playlists_changed = true;

	// check if library playlist is present
	var isMediaLibraryFound = false;
	var total = plman.PlaylistCount;
	for (var i = 0; i < total; i++) {
		if (plman.GetPlaylistName(i) == "Collection") {
			var mediaLibraryIndex = i;
			isMediaLibraryFound = true;
			break;
		}
	}
	if (!isMediaLibraryFound) {
		fb.CreateAutoPlaylist(total, "Collection", "ALL", "", 0);
		plman.MovePlaylist(total, 0);
	} else if (mediaLibraryIndex > 0) {
		plman.MovePlaylist(mediaLibraryIndex, 0);
	}

	g_avoid_on_playlists_changed = false;
}

function sort() {
	if (properties.TFsorting.length > 0) {
		g_browser && g_browser.list && g_browser.list.OrderByFormat(fb.TitleFormat(properties.TFsorting), sortDirection);
		plman.SortByFormatV2(plman.ActivePlaylist, properties.TFsorting, sortDirection);
	}
}
