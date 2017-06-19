var g_songs = null;

var colorSchemeText = col_text1;
var colorSchemeText2 = col_text2;
var colorSchemeTextSelect = RGB(255, 255, 255);
var colorSchemeBackInvert = accent_colour;

var oISongs = function (metadb, index) {
	this.x = 0;
	this.y = 0;
	this.w = 0;
	this.margins = 40;
	this.row = properties.listColumnsRow;
	this.index = index;
	this.metadb = metadb;
	this.tf_title = this.tf_tracknumber = this.tf_artist = this.tf_album = this.tf_length = this.tf_mood = "";

	this.draw = function (gr, x, y, w, parity) {
		if (!gr)
			return;
		this.x = x;
		this.y = y;
		this.w = w;

		this.tf_tracknumber = $("[%tracknumber%]", this.metadb);
		if (this.tf_tracknumber < 10 && this.tf_tracknumber != "")
			this.tf_tracknumber = this.tf_tracknumber.substr(1, 1);
		this.tf_title = $("%title%", this.metadb);
		this.tf_artist = $("$if(%length%,$if2(%artist%,'Unknown Artist'),'Stream')", this.metadb);

		switch (properties.TFsorting) {
		case SortByGenre:
			this.tf_album = $("$if2(%genre%,'Unknown')", this.metadb);
			break;
		case SortByYear:
			this.tf_album = $("$if2(%date%,'Unknown')", this.metadb);
			break;
		case SortByStyle:
			this.tf_album = $("$if2(%style%,'Unknown')", this.metadb);
			break;
		case SortByPublisher:
			this.tf_album = $("$if2(%publisher%,'Unknown')", this.metadb);
			break;
		default:
			this.tf_album = $("$if(%length%,$if2(%album%,'Unknown Album'),'Web Radios')", this.metadb);
			break;
		}

		//this.tf_album = $("$if(%length%,$if2(%album%,'Unknown Album'),'Web Radios')", this.metadb);
		this.tf_mood = $("$if($stricmp(%mood%,),-1)$if($stricmp(%mood%,Like it),1)$if($stricmp(%mood%,Hate it),2)", this.metadb);

		this.tf_length = $("%length%", this.metadb);
		var isPlaying = false;
		if (fb.IsPlaying) {
			if (this.metadb.Compare(fb.GetNowPlaying())) {
				isPlaying = true;
			}
		}

		if (parity == 1)
			gr.FillSolidRect(this.x + 10, this.y, this.w - 20, this.row, setAlpha(col_text1, properties.darkTheme ? 5 : 10));

		//if (this.ishover)
		//	gr.FillSolidRect(this.x + 10, this.y, this.w - 20, this.row, setAlpha(col_text1, properties.darkTheme ? 15 : 20));

		var txtColor = colorSchemeText;
		var shadowColor = colorSchemeText2;

		if (plman.IsPlaylistItemSelected(plman.ActivePlaylist, this.index)) {
			txtColor = RGB(255, 255, 255);
			shadowColor = RGB(255, 255, 255);
			queueColor = RGB(255, 255, 255);
			gr.FillSolidRect(this.x + 10, this.y, this.w - 20, this.row, accent_colour);
		} else {
			txtColor = col_text1;
			shadowColor = col_text2;
			if (properties.listCoverColor)
				queueColor = colorSchemeBackInvert;
			else
				queueColor = accent_colour;

			if (isPlaying) {
				txtColor = accent_colour;
				shadowColor = accent_colour;
				queueColor = accent_colour;

			}
		}

		this.QtitleW = this.w > 600 ? Math.round((this.w - this.margins * 2 - 55 - 45) / 2) : this.w - this.margins * 2 - 55;
		this.QartistW = Math.round(this.QtitleW / 2);
		this.tf_title_w = gr.CalcTextWidth(this.tf_title, listTrackFont);
		this.showButtons = (this.ishover && !plman.IsPlaylistItemSelected(plman.ActivePlaylist, this.index));
		if ((this.tf_title_w + 10) > this.QtitleW)
			this.tf_title_w = this.QtitleW - 10;

		if (this.showButtons && ((this.tf_title_w + 10) > (this.QtitleW - 94)))
			this.tf_title_w = this.QtitleW - 94;

		gr.GdiDrawText(this.tf_tracknumber, listTrackFont, txtColor, this.x + this.margins, this.y, this.w, this.row, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
		gr.GdiDrawText(this.tf_title, listTrackFont, txtColor, this.x + this.margins + 30, this.y, this.tf_title_w, this.row, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
		this.w > 600 && gr.GdiDrawText(this.tf_artist, listdurationFont, shadowColor, this.x + this.margins + 30 + this.QtitleW, this.y, this.QartistW - 10, this.row, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
		this.w > 600 && gr.GdiDrawText(this.tf_album, listdurationFont, shadowColor, this.x + this.margins + 30 + this.QtitleW + this.QartistW, this.y, this.QartistW - 10, this.row, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
		gr.GdiDrawText(this.tf_length, listdurationFont, shadowColor, this.x + this.margins, this.y, this.w - this.margins * 2 - 45, this.row, DT_RIGHT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);

		if (this.showButtons) {
			g_songs && g_songs.buttons[0].draw(gr, this.x + this.margins + this.tf_title_w + 40, this.y + this.row - Math.round((this.row + g_songs.buttons[0].h) / 2) - 1, 255);
			g_songs && g_songs.buttons[1].draw(gr, this.x + this.margins + this.tf_title_w + 40 + 27, this.y + this.row - Math.round((this.row + g_songs.buttons[0].h) / 2) - 1, 255);
		}

		// mood
		if (this.ishover || this.tf_mood == 1 || this.tf_mood == 2) {
			if (this.ishover)
				g_songs && g_songs.buttons[2].draw(gr, this.x + this.w - this.margins - g_songs.buttons[0].w, this.y + this.row - Math.round((this.row + g_songs.buttons[0].h) / 2) - 1, 255);
			g_songs && g_songs.buttons[0] && gr.DrawImage(plman.IsPlaylistItemSelected(plman.ActivePlaylist, this.index) ? iconsW_img : properties.darkTheme ? iconsW_img : iconsB_img, Math.round(this.x + this.w - this.margins - g_songs.buttons[0].w), this.y + this.row - Math.round((this.row + 27) / 2), 27, 27, (g_songs.buttons[2].y == (this.y + this.row - Math.round((this.row + g_songs.buttons[0].h) / 2) - 1)) ? g_songs.buttons[2].state == ButtonStates.hover ? 27 : g_songs.buttons[2].state == ButtonStates.down ? 27 * 2 : 0 : 0, 27 * (this.tf_mood == 1 ? 33 : this.tf_mood == 2 ? 34 : 32), 27, 27);
		}

	}

	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.row);
	}

	var state1 = 0;

	this.check = function (event, x, y) {
		this.ishover = traceMouse(x, y, this.x, this.y, this.w, this.row);
		var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
		var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);
		var activeList = plman.ActivePlaylist;
		old1 = 0;
		switch (event) {
		case "down":
			if (this.ishover) {
				if (g_songs.buttons.length) {
					for (var i = 0; i < g_songs.buttons.length; i++) {
						g_songs.buttons[i].checkstate("down", x, y);
					}
				}
			}
			break;
		case "up":
			if (this.ishover) {
				for (var i = 0; i < g_songs.buttons.length; i++) {
					switch (i) {
					case 0:
						if (g_songs.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
							plman.ExecutePlaylistDefaultAction(plman.ActivePlaylist, this.index);
							g_songs.buttons[i].state = ButtonStates.hover;
							return;
						}
						break;
					case 1:
						if (g_songs.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
							add_m = this.metadb;
							add_ms = plman.GetPlaylistSelectedItems(-1);
							add_ms.Add(add_m);
							add_menu(g_songs.buttons[i].x, g_songs.buttons[i].y + g_songs.buttons[i].h, add_ms, 0);
							g_songs.buttons[i].state = ButtonStates.hover;
							return;
						}
					case 2:
						if (g_songs.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
							if (this.tf_mood == 0)
								this.metadb.UpdateFileInfoSimple("MOOD", "Like it");
							else if (this.tf_mood == 1)
								this.metadb.UpdateFileInfoSimple("MOOD", "Hate it");
							else if (this.tf_mood == 2)
								this.metadb.UpdateFileInfoSimple("MOOD", "");

							this.repaint();
							g_songs.buttons[i].state = ButtonStates.hover;
							return;
						}
						break;
					}
				}

				IDIsSelected = plman.IsPlaylistItemSelected(activeList, this.index);

				if (!CtrlKeyPressed && !ShiftKeyPressed) {
					selectedIndexes = [];
					plman.ClearPlaylistSelection(activeList);
				}

				if (ShiftKeyPressed) {
					selectedIndexes = [];

					var a = b = 0;

					//if (selectedIndex == undefined)
					selectedIndex = plman.GetPlaylistFocusItemIndex(activeList);

					if (selectedIndex < this.index) {
						a = selectedIndex;
						b = this.index;
					} else {
						a = this.index;
						b = selectedIndex;
					}

					for (var ids = a; ids <= b; ids++) {
						selectedIndexes.push(ids);
					}

					plman.ClearPlaylistSelection(activeList);
					plman.SetPlaylistSelection(activeList, selectedIndexes, true);
				} else {
					plman.SetPlaylistSelectionSingle(activeList, this.index, true);
				}

				if (!IDIsSelected && !CtrlKeyPressed && !ShiftKeyPressed) {
					selectedIndexes = [];
					selectedIndexes[0] = this.index;
				}

				if (CtrlKeyPressed) {
					if (!IDIsSelected)
						selectedIndexes.push(this.index);

					plman.SetPlaylistSelectionSingle(activeList, this.index, IDIsSelected ? false : true);

					if (IDIsSelected) {
						for (var i = 0; i < selectedIndexes.length; i++) {
							if (selectedIndexes[i] == this.index)
								selectedIndexes.splice(i, 1);
						}
					}
				}

				plman.SetPlaylistFocusItem(activeList, this.index);

				if (selectedIndex == undefined)
					selectedIndex = this.index;

				if (selectedIndexes.length > 1)
					selectedIndexes.sort(numericAscending);

				this.repaint();
			}
			break;
		case "lbtn_dblclk":
			if (this.ishover)
				plman.ExecutePlaylistDefaultAction(plman.ActivePlaylist, this.index);

			break;
		case "rbtn_up":
			if (this.ishover) {
				var activeList = plman.ActivePlaylist;
				IDIsSelected = plman.IsPlaylistItemSelected(activeList, this.index);
				if (IDIsSelected) {
					plman.SetPlaylistFocusItem(activeList, this.index);
				} else {
					plman.ClearPlaylistSelection(activeList);
					plman.SetPlaylistFocusItem(activeList, this.index);
					plman.SetPlaylistSelectionSingle(plman.ActivePlaylist, plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist), true);
				}
				songs_cmenu(x, y, this.metadb);
			}
			break;
		case "move":

			for (var i = 0; i < g_songs.buttons.length; i++) {
				if (g_songs.buttons[i].checkstate("move", x, y) == ButtonStates.hover);
			}

			var old1 = state1;
			state1 = this.ishover ? 1 : 0;
			if (old1 != state1)
				this.repaint();

			break;
		}
	}
}

var oSongs = function (objectName) {
	this.objectName = objectName;
	this.x = 0;
	this.y = 0;
	this.w = 0;
	this.h = 10;
	this.rowH = 35;
	this.margins = 40;
	this.p_hover = false;
	this.show_panel = false;
	this.buttons = [];
	this.buttonsTotal = 10;
	this.offset = 0;
	this.scrollbarWidth = 0;
	this.scrollbar = new oScrollBar(0, objectName + ".scrollbar", 0, 0, cScrollBar.width, 0, 0, this.rowH, this.offset, objectName, true, 1, properties.darkTheme);
	this.listLength;
	this.metadb = null;
	this.margTop = 55;
	this.ishover;
	this.items = [];

	this.setButtons = function () {
		this.bt_size = 27;

		//if (this.play_off)
		//	this.play_off.Dispose();
		this.play_off = gdi.CreateImage(this.bt_size, this.bt_size);
		gb = this.play_off.GetGraphics();
		gb.DrawImage(properties.darkTheme ? iconsW_img : iconsB_img, 0, 0, this.bt_size, this.bt_size, 0, this.bt_size * 40, this.bt_size, this.bt_size);
		this.play_off.ReleaseGraphics(gb);

		this.play_ov = this.play_off.ApplyAlpha(190);
		this.play_on = this.play_off.ApplyAlpha(90);

		//if (this.add_off)
		//	this.add_off.Dispose();
		this.add_off = gdi.CreateImage(this.bt_size, this.bt_size);
		gb = this.add_off.GetGraphics();
		gb.DrawImage(properties.darkTheme ? iconsW_img : iconsB_img, 0, 0, this.bt_size, this.bt_size, 0, this.bt_size * 41, this.bt_size, this.bt_size);
		this.add_off.ReleaseGraphics(gb);

		this.add_ov = this.add_off.ApplyAlpha(190);
		this.add_on = this.add_off.ApplyAlpha(90);

		this.mood_off = gdi.CreateImage(this.bt_size, this.bt_size);
		gb = this.mood_off.GetGraphics();
		//gb.DrawImage(properties.darkTheme ? iconsW_img : iconsB_img, 0, 0, this.bt_size, this.bt_size, 0, this.bt_size * 41, this.bt_size, this.bt_size);
		this.mood_off.ReleaseGraphics(gb);

		for (i = 0; i < this.buttonsTotal; i++) {
			switch (i) {
			case 0:
				if (typeof(this.buttons[i]) == "undefined") {
					this.buttons.push(new button(this.play_off, this.play_ov, this.play_on));
				} else {
					this.buttons[i].img[0] = this.play_off;
					this.buttons[i].img[1] = this.play_ov;
					this.buttons[i].img[2] = this.play_on;
				}
				break;
			case 1:
				if (typeof(this.buttons[i]) == "undefined") {
					this.buttons.push(new button(this.add_off, this.add_ov, this.add_on));
				} else {
					this.buttons[i].img[0] = this.add_off;
					this.buttons[i].img[1] = this.add_ov;
					this.buttons[i].img[2] = this.add_on;
				}
				break;
			case 2:
				if (typeof(this.buttons[i]) == "undefined") {
					this.buttons.push(new button(this.mood_off, this.mood_off, this.mood_off));
				} else {
					this.buttons[i].img[0] = this.mood_off;
					this.buttons[i].img[1] = this.mood_off;
					this.buttons[i].img[2] = this.mood_off;
				}
				break;
			}
		}
	}
	this.setButtons();

	this.reload = function () {
		this.listLength = plman.PlaylistItemCount(plman.ActivePlaylist);
		this.contents = plman.GetPlaylistItems(plman.ActivePlaylist);
		//this.arr = this.contents.toArray();

		this.items.splice(0, this.items.length);
		for (var i = 0; i < this.listLength; i++) {
			this.items.push(new oISongs(this.contents.Item(i), i));
		}

		this.totalRowVisible = Math.floor((this.h - this.margTop) / this.rowH);
		this.totalRowToLoad = Math.floor((this.h - this.margTop) / this.rowH) + 1;
		this.totalRows = this.listLength;

		this.offset = 0;
		this.scrollbar.reSize(this.x + this.w - cScrollBar.width, this.y + this.margTop, cScrollBar.width, this.h - this.margTop, this.listLength, this.rowH, this.offset);
		if (this.scrollbar.visible) {
			this.scrollbarWidth = this.scrollbar.w;
		} else {
			this.scrollbarWidth = 0;
		}

		if (this.totalRows - this.offset <= this.totalRowVisible) {
			this.total_rows_to_draw = this.totalRows < this.totalRowVisible ? this.totalRows : this.totalRowVisible;
		} else {
			this.total_rows_to_draw = this.totalRows < this.totalRowToLoad ? this.totalRows : this.totalRowToLoad;
		}

	}
	this.reload();

	this.setSize = function (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		//this.reload();

		this.listLength = plman.PlaylistItemCount(plman.ActivePlaylist);

		this.totalRowVisible = Math.floor((this.h - this.margTop) / this.rowH);
		this.totalRowToLoad = Math.floor((this.h - this.margTop) / this.rowH) + 1;
		this.totalRows = this.listLength;

		if (this.totalRows - this.offset <= this.totalRowVisible) {
			this.total_rows_to_draw = this.totalRows < this.totalRowVisible ? this.totalRows : this.totalRowVisible;
		} else {
			this.total_rows_to_draw = this.totalRows < this.totalRowToLoad ? this.totalRows : this.totalRowToLoad;
		}

		this.scrollbar.reSize(this.x + this.w - cScrollBar.width, this.y + this.margTop, cScrollBar.width, this.h - this.margTop, this.listLength, this.rowH, this.offset);
		if (this.scrollbar.visible) {
			this.scrollbarWidth = this.scrollbar.w;
		} else {
			this.scrollbarWidth = 0;
		}

	}

	this.setButtons = function () {}

	this.draw = function (gr) {
		gr.FillSolidRect(this.x, this.y, this.w, this.h, col_bg);

		if (this.totalRows - this.offset <= this.totalRowVisible) {
			this.total_rows_to_draw = this.totalRows < this.totalRowVisible ? this.totalRows : this.totalRowVisible;
		} else {
			this.total_rows_to_draw = this.totalRows < this.totalRowToLoad ? this.totalRows : this.totalRowToLoad;
		}

		gr.GdiDrawText("#", songsColumnNameFont, col_text2, this.x + this.margins, this.y, this.w, 30, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
		gr.GdiDrawText("TITLE", songsColumnNameFont, col_text2, this.x + this.margins + 30, this.y, this.w, 30, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);

		this.QtitleW = Math.round((this.w - this.scrollbarWidth - this.margins * 2 - 55 - 45) / 2);
		this.QartistW = Math.round(this.QtitleW / 2);

		this.w > 600 && gr.GdiDrawText("ARTIST", songsColumnNameFont, col_text2, this.x + this.margins + this.QtitleW + 30, this.y, this.w, 30, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);

		var sortTxt = "";
		switch (properties.TFsorting) {
		case SortByGenre:
			sortTxt = "GENRE";
			break;
		case SortByYear:
			sortTxt = "YEAR";
			break;
		case SortByStyle:
			sortTxt = "STYLE";
			break;
		case SortByPublisher:
			sortTxt = "PUBLISHER";
			break;
		default:
			sortTxt = "ALBUM";
			break;
		}

		this.w > 600 && gr.GdiDrawText(sortTxt, songsColumnNameFont, col_text2, this.x + this.margins + this.QtitleW + this.QartistW + 30, this.y, this.w, 30, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);

		gr.DrawImage(icons25v35, this.x + this.w - this.scrollbarWidth - 27 - this.margins - 45, this.y, 27, 27, 0, 27 * 59, 27, 27);
		gr.DrawImage(icons_mood, this.x + this.w - this.scrollbarWidth - 27 - this.margins - 0, this.y, 27, 27, 27*2, properties.darkTheme ? 27 * 4 : 27 * 1, 27, 27);

		if (this.listLength) {
			for (var i = 0; i < this.total_rows_to_draw; i++) {
				this.items[i + this.offset] && this.items[i + this.offset].draw(gr, this.x, this.y + this.margTop + i * this.rowH, this.w - this.scrollbarWidth, (((i - this.offset) / 2) == Math.floor((i - this.offset) / 2) ? 1 : 0));
			}
			this.scrollbar.draw(gr);
		}
	}

	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	this.checkstate = function (event, x, y, step) {
		if (tabActive != "Collection" && lGroup != "Songs")
			return;

		this.ishover = traceMouse(x, y, this.x, this.y, this.w - this.scrollbarWidth, this.h);
		switch (event) {
		case "down":
			for (var i = 0; i < this.total_rows_to_draw; i++) {
				this.items[i + this.offset] && this.items[i + this.offset].check(event, x, y);
			}
			if (this.scrollbar.visible)
				this.scrollbar.check(event, x, y, step);
			break;
		case "up":
			if (!this.scrollbar.cursorDrag)
				for (var i = 0; i < this.total_rows_to_draw; i++) {
					this.items[i + this.offset] && this.items[i + this.offset].check(event, x, y);
				}
			if (this.scrollbar.visible)
				this.scrollbar.check(event, x, y, step);
			break;
		case "lbtn_dblclk":
			for (var i = 0; i < this.total_rows_to_draw; i++) {
				this.items[i + this.offset] && this.items[i + this.offset].check(event, x, y);
			}
			break;
		case "rbtn_up":
			for (var i = 0; i < this.total_rows_to_draw; i++) {
				this.items[i + this.offset] && this.items[i + this.offset].check(event, x, y);
			}
			if (!this.items.length)
				songsEmply_cmenu(x, y);
			//queue_menu_context(x, y);
			break;
		case "wheel":
			if (this.ishover || this.scrollbar.isHoverScrollbar)
				if (this.scrollbar.visible)
					this.scrollbar.check(event, x, y, step);
			break;
		case "move":
			if (this.scrollbar.visible)
				this.scrollbar.check(event, x, y, step);
			if (this.scrollbar.cursorDrag)
				return;
			for (var i = 0; i < this.total_rows_to_draw; i++) {
				this.items[i + this.offset] && this.items[i + this.offset].check(event, x, y);
			}
			break;
		case "leave":
			if (this.scrollbar.visible)
				this.scrollbar.check(event, x, y, step);
			break;
		}
	}

	this.refresh = function () {
		if (tabActive == "Collection" && lGroup == "Songs") {
			this.reload();
			this.repaint();
		}
	}
}

function displayFocusItem(focusID) {
	/*if (!g_songs || !g_songs.listLength)
	return;

	if (g_songs.offset > focusID) {
	//g_songs.offset = focusID;
	//g_songs.scrollbar.reSet(g_songs.listLength, g_songs.rowH, g_songs.offset);
	if (g_songs.scrollbar.visible)
	g_songs.scrollbar.check("wheel", m_x, m_y, +1);
	} else if (g_songs.offset + g_songs.totalRowVisible - 1 < focusID) {
	if (g_songs.scrollbar.visible)
	g_songs.scrollbar.check("wheel", m_x, m_y, -1);
	}
	 */
	/*
	for (var i = g_songs.offset; i < g_songs.offset + g_songs.totalRowVisible; i++) {
	if (i == focusID) {

	var step = i - Math.floor(g_songs.totalRowVisible / 2);
	if (step < 0)
	step = 0;


	g_songs.offset = step;
	g_songs.scrollbar.reSet(g_songs.listLength, g_songs.rowH, g_songs.offset);
	return;
	}
	}
	 */
}

function songsEmply_cmenu(x, y) {
	var playlistCount = fb.PlaylistCount;
	var activeList = plman.ActivePlaylist;
	var isAutoPlaylist = fb.IsAutoPlaylist(activeList);

	var _menu = window.CreatePopupMenu();
	_menu.AppendMenuItem(cuttedItemsCount && !isAutoPlaylist ? MF_STRING : MF_GRAYED, 1, "Paste \tCtrl+V");
	var ret = 0;
	ret = _menu.TrackPopupMenu(x, y);

	switch (ret) {
	case 1:
		paste();
		break;
	}
	_menu.Dispose();
	return true;
}

function songs_cmenu(x, y, metadb) {
	var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);
	var playlistCount = fb.PlaylistCount;
	var activeList = plman.ActivePlaylist;
	var isAutoPlaylist = fb.IsAutoPlaylist(activeList);
	var selected = plman.GetPlaylistSelectedItems(plman.ActivePlaylist).Count;
	var selection = (selected > 1);

	var _menu = window.CreatePopupMenu();
	var Context = fb.CreateContextMenuManager();

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
			np_tag[i] = fb.TitleFormat(tf_str[i]).EvalWithMetadb(metadb);
			np_tag[i] != "?" && a.AppendMenuItem(np_tag[i] != "?" ? MF_STRING : MF_GRAYED | MF_DISABLED, 8 + i, "   " + nm_str[i] + " HAS " + '"' + np_tag[i] + '"');
		} catch (e) {
			fb.trace(e + ": Popup Menu Autoplaylist");
		}
	}

	w.AppendTo(_menu, (!selection && ActiveX) ? MF_STRING : MF_DISABLED | MF_GRAYED, "Weblinks");
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

	Context.InitContext(metadb);
	Context.BuildMenu(_menu, 100, -1);

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
	case ret == 2:
		copy();
		break;
	case ret == 3:
		crop();
		break;
	case ret == 5:
		if (!fb.IsAutoPlaylist(activeList)) {
			plman.RemovePlaylistSelection(activeList, false);
			plman.SetPlaylistSelectionSingle(activeList, plman.GetPlaylistFocusItemIndex(activeList), true);
		}
		break;
	case ret == 6:
		cut();
		break;
	case ret == 7:
		paste();
		break;
	case ret == 20:
		try {
			WshShell.run("http://last.fm/music/" + encodeURIComponent(encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(metadb)).replace(/%20/g, '+')) + "/_/" + encodeURIComponent(encodeURIComponent(fb.TitleFormat("%title%").EvalWithMetadb(metadb)).replace(/%20/g, '+')));
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 21:
		try {
			WshShell.run("http://last.fm/music/" + encodeURIComponent(encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(metadb)).replace(/%20/g, '+')) + "/" + encodeURIComponent(encodeURIComponent(fb.TitleFormat("%album%").EvalWithMetadb(metadb)).replace(/%20/g, '+')));
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 22:
		try {
			WshShell.run("http://last.fm/music/" + encodeURIComponent(encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(metadb))).replace(/%20/g, '+'));
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 23:
		try {
			WshShell.run("http://www.last.fm/community/groups/search?q=" + encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(metadb)).replace(/%20/g, '+'));
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 24:
		try {
			WshShell.run("http://last.fm/music/" + encodeURIComponent(encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(metadb)).replace(/%20/g, '+')) + "/+images");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 25:
		try {
			WshShell.run("http://www.last.fm/events/search?q=" + encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(metadb)).replace(/%20/g, '+'));
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 26:
		try {
			WshShell.run("http://www.last.fm/search?q=" + encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(metadb)).replace(/%20/g, '+') + "&type=all");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 30:
		try {
			WshShell.run("http://www.google.com/search?q=" + encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(metadb)).replace(/%20/g, '+') + "&ie=utf-8");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 31:
		try {
			WshShell.run("http://www.google.com/search?q=" + encodeURIComponent(fb.TitleFormat("%artist% %album%").EvalWithMetadb(metadb)).replace(/%20/g, '+') + "&ie=utf-8");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 32:
		try {
			WshShell.run("http://www.google.com/search?q=" + encodeURIComponent(fb.TitleFormat("%artist% %title%").EvalWithMetadb(metadb)).replace(/%20/g, '+') + "&ie=utf-8");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 35:
		try {
			WshShell.run("http://www.discogs.com/search?q=" + encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(metadb)).replace(/%20/g, '+') + "&type=artist");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 36:
		try {
			WshShell.run("http://www.discogs.com/search?q=" + encodeURIComponent(fb.TitleFormat("%album%").EvalWithMetadb(metadb)).replace(/%20/g, '+') + "&type=release");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 37:
		try {
			WshShell.run("http://www.discogs.com/search?q=" + encodeURIComponent(fb.TitleFormat("%artist% %album%").EvalWithMetadb(metadb)).replace(/%20/g, '+') + "&type=all");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 40:
		try {
			WshShell.run("http://www.allmusic.com/search/artist/" + encodeURIComponent(fb.TitleFormat("$ascii(%artist%)").EvalWithMetadb(metadb)));
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 41:
		try {
			WshShell.run("http://www.allmusic.com/search/album/" + encodeURIComponent(fb.TitleFormat("$ascii(%album%)").EvalWithMetadb(metadb)));
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 42:
		try {
			WshShell.run("http://www.allmusic.com/search/song/" + encodeURIComponent(fb.TitleFormat("$ascii(%title%)").EvalWithMetadb(metadb)));
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 45:
		try {
			WshShell.run("http://en.wikipedia.org/wiki/Special:Search?search=" + encodeURIComponent(fb.TitleFormat("$replace(%artist%, ,_)").EvalWithMetadb(metadb)));
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 46:
		try {
			WshShell.run("http://musicbrainz.org/search?query=" + encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(metadb)) + "&type=artist&method=indexed");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 47:
		try {
			WshShell.run("http://www.youtube.com/results?search_type=&search_query=" + encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(metadb)) + "&ie=utf-8");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret == 48:
		try {
			WshShell.run("http:ecover.to/?Module=ExtendedSearch&SearchString=" + encodeURIComponent(fb.TitleFormat("%artist% '+' %album%").EvalWithMetadb(metadb)) + "&ie=utf-8");
		} catch (e) {
			fb.trace(e);
		}
		break;
	case ret > 0:
		Context.ExecuteByID(ret - 100);
		break;

	}

	Context.Dispose();
	_menu.Dispose();
	return true;
}
