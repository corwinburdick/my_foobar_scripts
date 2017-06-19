var oInfo = function (objectName) {
	this.objectName = objectName;
	this.x = 0;
	this.y = 0;
	this.w = rightPanelW;
	this.h = 0;
	this.rowH = 55;
	this.delta = 0;
	this.margins = 40;
	this.p_hover = false;
	this.show_panel = false;
	this.buttons = [];
	this.buttonsTotal = 8;
	this.offset = 0;
	this.scrollbarWidth = 0;
	this.scrollbar = new oScrollBar(0, this.objectName + ".scrollbar", 0, 0, cScrollBar.width, 0, 0, this.rowH, this.offset, objectName, true, 1, properties.darkTheme);
	this.infoNameFont = gdi.font("Segoe UI", 12);
	this.infoValueFont = gdi.font("Segoe UI", 14);
	this.listLength;
	this.metadb = null;
	this.cover = null;
	this.ArtID = window.GetProperty("Properties panel Art ID", 0);
	this.coverSize = 200; //this.w - this.margins * 2 + cScrollBar.width;
	this.coverYH = this.coverSize + 30;
	this.showCover = rightPanelAlbumArt;
	this.margTop = 105;
	this.ishover;
	this.tab = 0;
	this.more = 0;

	this.reload = function () {
		this.list = [];
		this.meta = [];
		this.info = [];
		this.listLength = 0;
		//this.metadb = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();

		if ((tabActive != "Now_Playing") && !plman.IsPlaylistItemSelected(plman.ActivePlaylist, plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist)))
			return;

		this.metadb = (tabActive == "Now_Playing") ? fb.GetNowPlaying() : fb.GetFocusItem(); //fb.GetFocusItem();
		if (!this.metadb)
			return;

		this.fileInfo = this.metadb.GetFileInfo();
		this.metaCount = this.fileInfo.MetaCount;
		this.infoCount = this.fileInfo.InfoCount;
		this.metaValue;
		this.infoName;
		this.infoValue;
		this.inf;

		var img = gdi.CreateImage(1, 1);
		var g = img.GetGraphics();
		for (var i = 0; i < this.fileInfo.MetaCount; i++) {
			this.metaName = this.fileInfo.MetaName(i);
			//if (this.metaName == "title")// && (fb.IsPlaying && this.metadb.RawPath.indexOf("http://") == 0))
			//	this.inf = fb.TitleFormat("%title%").Eval();
			//else
			this.inf = this.fileInfo.MetaValue(this.fileInfo.MetaFind(this.metaName), 0);
			this.meta[i] = [((this.metaName == "www") ? this.metaName : this.metaName.toLowerCase().capitalize() + "")];
			this.meta[i][1] = this.inf;
			this.meta[i][2] = Math.ceil(g.MeasureString(this.meta[i][0], this.infoNameFont, 0, 0, 0, 0).Width) + 5;
		}
		for (var i = 0; i < this.fileInfo.InfoCount; i++) {
			this.infoName = this.fileInfo.InfoName(i);
			this.info[i] = [this.infoName.toLowerCase().capitalize()];
			this.info[i][1] = this.fileInfo.InfoValue(this.fileInfo.InfoFind(this.infoName));
			this.info[i][2] = Math.ceil(g.CalcTextWidth(this.info[i][0], this.infoNameFont)) + 5;
			//this.info[i][2] = Math.ceil(g.MeasureString(this.info[i][0], this.infoNameFont, 0, 0, 0, 0).Width) + 5;
		}
		this.list = this.list.concat(this.meta, this.info);
		this.listLength = this.list.length;
		img.ReleaseGraphics(g);
		img.Dispose();

		this.maxRows = Math.max(0, Math.min(this.listLength, Math.floor(Math.max(0, this.h - this.margTop - (this.showCover ? this.coverYH : 0)) / this.rowH))) + 1;

		this.offset = 0;
		this.scrollbar.reSize(this.x + this.w - cScrollBar.width, this.y + this.margTop + (this.showCover ? this.coverYH : 0), cScrollBar.width, this.h - this.margTop - (this.showCover ? this.coverYH : 0), this.listLength, this.rowH, this.offset);
		if (this.scrollbar.visible) {
			this.scrollbarWidth = this.scrollbar.w;
		} else {
			this.scrollbarWidth = 0;
		}

		if (this.showCover) {
			if (this.cover)
				this.cover.Dispose();
			try {
				this.cover = resizeImage(utils.GetAlbumArtV2(this.metadb, this.ArtID, true), this.coverSize, this.coverSize, true);
			} catch (e) {
				this.cover = null;
			}
		}
	}

	this.setSize = function (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.reload();
	}

	this.setButtons = function () {

		var moreTxt = "";
		switch (this.more) {
		case 0:
			moreTxt = "last.fm & wikipedia biography";
			break;
		case 1:
			moreTxt = "last.fm charts";
			break;
		case 2:
			moreTxt = "last.fm similar artists";
			break;
		case 3:
			moreTxt = "musicbrainz";
			break;
		case 4:
			moreTxt = "news-reviews-blogs";
			break;
		}

		for (i = 0; i < this.buttonsTotal; i++) {
			switch (i) {
			case 0:
				this.buttons.push(new popupButton("Front cover", barTextFont2, this.ArtID == AlbumArtId.front ? [col_text1, accent_colour, col_text2] : [col_text2, accent_colour, col_text2], 0, 35, 0));
				break;
			case 1:
				this.buttons.push(new popupButton("Back cover", barTextFont2, this.ArtID == AlbumArtId.back ? [col_text1, accent_colour, col_text2] : [col_text2, accent_colour, col_text2], 0, 35, 0));
				break;
			case 2:
				this.buttons.push(new popupButton("Artist", barTextFont2, this.ArtID == AlbumArtId.artist ? [col_text1, accent_colour, col_text2] : [col_text2, accent_colour, col_text2], 0, 35, 0));
				break;
			case 3:
				this.buttons.push(new popupButton("Disc", barTextFont2, this.ArtID == AlbumArtId.disc ? [col_text1, accent_colour, col_text2] : [col_text2, accent_colour, col_text2], 0, 35, 0));
				break;
			case 4:
				this.buttons.push(new popupButton("info", messageTitleFont2, this.tab == 0 ? [col_text1, accent_colour, col_text2] : [col_text2, accent_colour, col_text2], 0, 35, 0));
				break;
			case 5:
				this.buttons.push(new popupButton("more", messageTitleFont2, this.tab == 1 ? [col_text1, accent_colour, col_text2] : [col_text2, accent_colour, col_text2], 0, 35, 0));
				break;
			case 6:
				this.buttons.push(new popupButton(moreTxt, groupFont, [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg], 35, 0));
				break;
			}
		}
	}
	this.setButtons();

	this.draw = function (gr) {
		gr.FillSolidRect(this.x + this.delta, this.y, this.w, this.h, properties.darkTheme ? RGB(28, 28, 28) : RGB(245, 245, 245))

		switch (this.tab) {
		case 0:
			if (this.listLength) {
				if (this.showCover) {
					var coy = this.y + this.margTop;
					gr.FillSolidRect(this.x + this.delta + this.margins, coy, this.coverSize, this.coverSize, properties.darkTheme ? RGB(54, 54, 54) : RGB(235, 235, 235));

					if (this.cover)
						draw_Bitmap(gr, this.cover, this.x + this.delta + this.margins, coy, this.coverSize, this.coverSize, "centre", 0);
					else {
						gr.FillSolidRect(this.x + this.delta + this.margins, coy, this.coverSize, this.coverSize, properties.darkTheme ? RGB(54, 54, 54) : RGB(235, 235, 235));
						gr.FillSolidRect(this.x + this.delta + this.margins, coy, this.coverSize, this.coverSize, col_noCoverBG);
						gr.DrawImage(properties.TFgrouping == groupByArtist ? mediaMissingArtist : properties.TFgrouping == groupByGenre ? mediaMissingGenre : mediaMissingAlbum, this.x + this.delta + this.margins + Math.round((this.coverSize - mediaMissingArtist.Width) / 2), coy + Math.round((this.coverSize - mediaMissingArtist.Height) / 2), mediaMissingArtist.Width, mediaMissingArtist.Height, 0, 0, mediaMissingArtist.Width, mediaMissingArtist.Height, 0, 255);
						gr.DrawRect(this.x + this.delta + this.margins + 8, coy + 8, this.coverSize - 8 * 2 - 1, this.coverSize - 8 * 2 - 1, 1.0, col_noCoverLine);
					}

					if (this.buttons.length) {
						this.buttons[0].draw(gr, this.x + this.margins + this.coverSize + 15, this.y + this.margTop, 255);
						this.buttons[1].draw(gr, this.x + this.margins + this.coverSize + 15, this.buttons[0].y + this.buttons[0].h, 255);
						this.buttons[2].draw(gr, this.x + this.margins + this.coverSize + 15, this.buttons[1].y + this.buttons[1].h, 255);
						this.buttons[3].draw(gr, this.x + this.margins + this.coverSize + 15, this.buttons[2].y + this.buttons[2].h, 255);
					}
					/*
					gr.GdiDrawText("Front cover", barTextFont2, col_text1, this.x + this.margins + this.coverSize + 15, this.y + this.margTop, this.w - this.margins * 2 + this.scrollbarWidth, 35, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_WORDBREAK | DT_NOPREFIX);
					gr.GdiDrawText("Back cover", barTextFont2, col_text2, this.x + this.margins + this.coverSize + 15, this.y + this.margTop + 1 * 35, this.w - this.margins * 2 + this.scrollbarWidth, 35, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_WORDBREAK | DT_NOPREFIX);
					gr.GdiDrawText("Artist", barTextFont2, col_text2, this.x + this.margins + this.coverSize + 15, this.y + this.margTop + 2 * 35, this.w - this.margins * 2 + this.scrollbarWidth, 35, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_WORDBREAK | DT_NOPREFIX);
					gr.GdiDrawText("Disc", barTextFont2, col_text2, this.x + this.margins + this.coverSize + 15, this.y + this.margTop + 3 * 35, this.w - this.margins * 2 + this.scrollbarWidth, 35, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_WORDBREAK | DT_NOPREFIX);
					 */
				}

				for (var i = 0; i < this.maxRows; i++) {
					var ID = this.list[i + this.offset]; //listStep[0]];

					this.marginstxt = 10;

					var parity = (((i + this.offset) / 2) == Math.floor((i + this.offset) / 2) ? 1 : 0);
					if (parity == 1)
						gr.FillSolidRect(this.x + this.marginstxt, this.y + this.margTop + (this.showCover ? this.coverYH : 0) + i * this.rowH - 0, this.w - this.marginstxt * 2 - this.scrollbarWidth, this.rowH, setAlpha(col_text1, 7));

					ID && gr.GdiDrawText(ID[0], this.infoNameFont, col_text2, this.x + this.delta + this.margins, this.y + this.margTop + (this.showCover ? this.coverYH : 0) + i * this.rowH + 10, ID[2], this.rowH, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
					ID && gr.GdiDrawText(ID[1], this.infoValueFont, col_text1, this.x + this.delta + this.margins, this.y + this.margTop + (this.showCover ? this.coverYH : 0) + i * this.rowH - 8, this.w - this.margins - this.marginstxt * 2 - this.scrollbarWidth, this.rowH, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
				}

				this.scrollbar.draw(gr);
			} else {
				gr.GdiDrawText(tabActive == "Now_Playing" ? "Play a song to display its properties." : "Select a song to display its properties.", messageBodyFont, col_text2, this.x + this.margins, this.y + this.margTop, this.w - this.margins * 2 + this.scrollbarWidth, 35, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_WORDBREAK | DT_NOPREFIX);
			}

			break;
		case 1:

			if (this.buttons.length) {
				this.buttons[6].draw(gr, this.x + this.margins, this.y + this.margTop, 255);
			}

			gr.GdiDrawText("This is not working yet", messageBodyFont, col_text2, this.x + this.margins, this.y + this.margTop + 40, this.w - this.margins * 2 + this.scrollbarWidth, this.h, DT_LEFT | DT_TOP | DT_CALCRECT | DT_TOP | DT_WORDBREAK | DT_NOPREFIX);

			break;
		}

		var plb_y = 45;

		if (this.buttons.length) {
			this.buttons[4].draw(gr, this.x + this.delta + this.margins, this.y + plb_y, 255);
			this.buttons[5].draw(gr, this.x + this.delta + this.margins + gr.CalcTextWidth("info", messageTitleFont2) + 15, this.y + plb_y, 255);
		}

		//gr.gdiDrawText("properties", messageTitleFont2, col_text1, this.x + this.delta + this.margins, this.y + plb_y, this.w, 30, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
		//gr.gdiDrawText("more", messageTitleFont2, col_text2, this.x + this.delta + this.margins + gr.CalcTextWidth("properties", messageTitleFont2) + 15, this.y + plb_y, this.w, 30, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
	}

	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	this.checkstate = function (event, x, y, step) {
		if (!rightPanel)
			return;

		this.ishover = traceMouse(x, y, this.x, this.y, this.w - this.scrollbarWidth, this.h);
		switch (event) {
		case "down":
			if (this.scrollbar.visible)
				this.scrollbar.check(event, x, y, step);

			if (this.ishover) {
				if (this.buttons.length) {
					for (var i = 0; i < this.buttons.length; i++) {
						this.buttons[i].checkstate("down", x, y);
					}
				}
			}

			break;
		case "up":

			if (this.tab == 0) {
				if (this.scrollbar.visible)
					this.scrollbar.check(event, x, y, step);

				if (this.ishover && this.showCover) {
					for (var i = 0; i < this.buttons.length; i++) {
						switch (i) {
						case 0:
							if (this.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
								window.SetProperty("Properties panel Art ID", this.ArtID = AlbumArtId.front);
								this.buttons[0].update("", [col_text1, accent_colour, col_text2]);
								this.buttons[1].update("", [col_text2, accent_colour, col_text2]);
								this.buttons[2].update("", [col_text2, accent_colour, col_text2]);
								this.buttons[3].update("", [col_text2, accent_colour, col_text2]);
								if (this.cover)
									this.cover.Dispose();
								try {
									this.cover = resizeImage(utils.GetAlbumArtV2(this.metadb, this.ArtID, true), this.coverSize, this.coverSize, true);
								} catch (e) {
									this.cover = null;
								}
								this.repaint();
								this.buttons[i].state = ButtonStates.hover;
							}
							break;
						case 1:
							if (this.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
								window.SetProperty("Properties panel Art ID", this.ArtID = AlbumArtId.back);
								this.buttons[0].update("", [col_text2, accent_colour, col_text2]);
								this.buttons[1].update("", [col_text1, accent_colour, col_text2]);
								this.buttons[2].update("", [col_text2, accent_colour, col_text2]);
								this.buttons[3].update("", [col_text2, accent_colour, col_text2]);
								if (this.cover)
									this.cover.Dispose();
								try {
									this.cover = resizeImage(utils.GetAlbumArtV2(this.metadb, this.ArtID, true), this.coverSize, this.coverSize, true);
								} catch (e) {
									this.cover = null;
								}
								this.repaint();
								this.buttons[i].state = ButtonStates.hover;
							}
							break;
						case 2:
							if (this.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
								window.SetProperty("Properties panel Art ID", this.ArtID = AlbumArtId.artist);
								this.buttons[0].update("", [col_text2, accent_colour, col_text2]);
								this.buttons[1].update("", [col_text2, accent_colour, col_text2]);
								this.buttons[2].update("", [col_text1, accent_colour, col_text2]);
								this.buttons[3].update("", [col_text2, accent_colour, col_text2]);
								if (this.cover)
									this.cover.Dispose();
								try {
									this.cover = resizeImage(utils.GetAlbumArtV2(this.metadb, this.ArtID, true), this.coverSize, this.coverSize, true);
								} catch (e) {
									this.cover = null;
								}
								this.repaint();
								this.buttons[i].state = ButtonStates.hover;
							}
							break;
						case 3:
							if (this.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
								window.SetProperty("Properties panel Art ID", this.ArtID = AlbumArtId.disc);
								this.buttons[0].update("", [col_text2, accent_colour, col_text2]);
								this.buttons[1].update("", [col_text2, accent_colour, col_text2]);
								this.buttons[2].update("", [col_text2, accent_colour, col_text2]);
								this.buttons[3].update("", [col_text1, accent_colour, col_text2]);
								if (this.cover)
									this.cover.Dispose();
								try {
									this.cover = resizeImage(utils.GetAlbumArtV2(this.metadb, this.ArtID, true), this.coverSize, this.coverSize, true);
								} catch (e) {
									this.cover = null;
								}
								this.repaint();
								this.buttons[i].state = ButtonStates.hover;
							}
							break;

						}
					}
				}
			} else {
				if (this.buttons[6].checkstate("up", x, y) == ButtonStates.hover) {
					more_cmenu(this.buttons[6].x, this.buttons[6].y + this.buttons[6].h);
					this.buttons[6].state = ButtonStates.hover;
				}

			}

			if (this.ishover) {
				for (var i = 0; i < this.buttons.length; i++) {
					switch (i) {
					case 4:
						if (this.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
							this.tab = 0;
							this.buttons[4].update("", [col_text1, accent_colour, col_text2]);
							this.buttons[5].update("", [col_text2, accent_colour, col_text2]);
							this.repaint();
							this.buttons[i].state = ButtonStates.hover;
						}
						break;
					case 5:
						if (this.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
							this.tab = 1;
							this.buttons[4].update("", [col_text2, accent_colour, col_text2]);
							this.buttons[5].update("", [col_text1, accent_colour, col_text2]);
							this.repaint();
							this.buttons[i].state = ButtonStates.hover;
						}
						break;
					}
				}
			}

			break;
		case "lbtn_dblclk":
			if (this.tab == 0) {
				if (this.ishover)
					fb.RunContextCommandWithMetadb("Properties", this.metadb);
			}
			break;
		case "wheel":
			if (this.tab == 0) {
				if (this.scrollbar.visible)
					this.scrollbar.check(event, x, y, step);
			}
			break;
		case "move":
			if (this.scrollbar.visible)
				this.scrollbar.check(event, x, y, step);

			if (this.ishover) {
				if (this.buttons.length) {
					for (var i = 0; i < this.buttons.length; i++) {
						if (this.buttons[i].checkstate("move", x, y) == ButtonStates.hover);
					}
				}
			}
			break;
		case "leave":
			if (this.scrollbar.visible)
				this.scrollbar.check(event, x, y, step);

			for (var i = 0; i < this.buttons.length; i++) {
				this.buttons[i].checkstate("leave", 0, 0);
			}
			break;
		}
	}

	this.refresh = function () {
		if (rightPanel) {
			this.reload();
			this.repaint();
		}
	}
}

String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

function more_cmenu(x, y) {
	var _menu = window.CreatePopupMenu();
	var moreTxt = "";

	_menu.AppendMenuItem(MF_DISABLED | MF_GRAYED, 0, "last.fm & wikipedia biography");
	_menu.AppendMenuItem(MF_DISABLED | MF_GRAYED, 1, "last.fm charts");
	_menu.AppendMenuItem(MF_DISABLED | MF_GRAYED, 2, "last.fm similar artists");
	_menu.AppendMenuItem(MF_DISABLED | MF_GRAYED, 3, "musicbrainz");
	_menu.AppendMenuItem(MF_DISABLED | MF_GRAYED, 4, "news-reviews-blogs");
	_menu.CheckMenuRadioItem(0, 4, 0);

	var ret = 0;
	ret = _menu.TrackPopupMenu(x, y);
	switch (ret) {
	case 0:
		g_info.more = ret;
		moreTxt = "last.fm & wikipedia biography";
		break;
	case 1:
		g_info.more = ret;
		moreTxt = "last.fm charts";
		break;
	case 2:
		g_info.more = ret;
		moreTxt = "last.fm similar artists";
		break;
	case 3:
		g_info.more = ret;
		moreTxt = "musicbrainz";
		break;
	case 4:
		g_info.more = ret;
		moreTxt = "news-reviews-blogs";
		break;
	}

	g_info.buttons[6].update(moreTxt, 0);

	_menu.Dispose();
	return true;
}
