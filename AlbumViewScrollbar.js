
cScrollbar = {
	buttons : window.GetProperty("Show album browser scrollbar buttons", true),
	width : 17,
	ButtonType : {
		cursor : 0,
		up : 1,
		down : 2
	},
	timerID1 : false,
	timerID2 : false,
	timer_counter : 0,
	bt_h : 40
}

oScrollbar = function (parentObjectName) {
	this.parentObjName = parentObjectName;
	this.cursorScrollTimer = false;
	this.buttons = Array(null, null, null);

	this.draw = function (gr, x, y) {
		if (g_browser && g_browser.ok) {
			if (fb2k_focus) {
				if (cScrollbar.buttons)
					// draw background and buttons up & down
					gr.FillSolidRect(this.x, this.y, this.w, this.h, properties.darkTheme ? RGBA(90, 90, 90, 80) : RGBA(200, 200, 200, 100));
				//gr.FillSolidRect(this.x, this.y, this.w, this.h, RGBA(200, 200, 200, 100));


				if (cScrollbar.buttons) {
					// draw up & down buttons
					this.buttons[cScrollbar.ButtonType.up].draw(gr, this.x, this.y, 255);
					this.buttons[cScrollbar.ButtonType.down].draw(gr, this.x, this.y + this.h - cScrollbar.bt_h, 255);
				}

				if (cScrollbar.buttons)
					// draw cursor
					if (this.cursorDrag) {
						gr.DrawImage(this.cursorImage_down, this.x, this.cursorPos, this.cursorImage_down.Width, this.cursorImage_down.Height, 0, 0, this.cursorImage_down.Width, this.cursorImage_down.Height, 0, 255);
					} else {
						try {
							if (this.buttons[cScrollbar.ButtonType.cursor].ishover)
								gr.DrawImage(this.cursorImage_hover, this.x, this.cursorPos, this.cursorImage_hover.Width, this.cursorImage_hover.Height, 0, 0, this.cursorImage_hover.Width, this.cursorImage_hover.Height, 0, 255);
							else
								this.buttons[cScrollbar.ButtonType.cursor].draw(gr, this.x, this.cursorPos, 255);
						} catch (e) {}
					}
				else {
					gr.FillSolidRect(this.x + 6, this.cursorPos + 7, this.w - 12, this.cursorImage_down.Height - 14, RGBA(100, 100, 100, 60));
					//gr.DrawRect(this.x + 5, this.cursorPos + 6, this.w - 10 - 1, this.cursorImage_down.Height - 12 - 1, 1.0, RGBA(255, 255, 255, 10));
				}

			} else {
				gr.FillSolidRect(this.x + 6, this.cursorPos, this.w - 12, this.cursorImage_down.Height, RGBA(100, 100, 100, 60));
			}
		} else {
			gr.FillSolidRect(this.x, this.y, this.w, this.h, properties.darkTheme ? RGBA(55, 55, 55, 100) : RGBA(200, 200, 200, 100));
			if (cScrollbar.buttons) {
				// draw up & down buttons
				this.buttons[cScrollbar.ButtonType.up].draw(gr, this.x, this.y, 55);
				this.buttons[cScrollbar.ButtonType.down].draw(gr, this.x, this.y + this.h - cScrollbar.bt_h, 55);
			}
		}
	}

	this.setCursor = function (h_vis, h_tot, offset) {
		if (!ww || !wh || wh < 100)
			return true;
		if (h_tot > h_vis && this.w > 2) {
			this.cursorWidth = this.w;
			// calc cursor height
			this.cursorHeight = Math.round((h_vis / h_tot) * this.area_h);
			if (this.cursorHeight < 15)
				this.cursorHeight = 15;
			// cursor pos
			var ratio = offset / (h_tot - h_vis);
			this.cursorPos = this.area_y + Math.round((this.area_h - this.cursorHeight) * ratio);
			this.setCursorButton();
		}
	}

	this.setCursorButton = function () {
		// normal cursor Image
		this.cursorImage_normal = gdi.CreateImage(this.cursorWidth, this.cursorHeight);
		var gb = this.cursorImage_normal.GetGraphics();
		gb.FillSolidRect(1, 0, this.cursorWidth - 2, this.cursorHeight, properties.darkTheme ? RGBA(90, 90, 90, 250) : RGBA(190, 190, 190, 250));
		this.cursorImage_normal.ReleaseGraphics(gb);

		// hover cursor Image
		this.cursorImage_hover = gdi.CreateImage(this.cursorWidth, this.cursorHeight);
		gb = this.cursorImage_hover.GetGraphics();
		gb.FillSolidRect(1, 1, this.cursorWidth - 2, this.cursorHeight - 2, RGBA(215, 215, 215, 190));
		this.cursorImage_hover.ReleaseGraphics(gb);

		// down cursor Image
		this.cursorImage_down = gdi.CreateImage(this.cursorWidth, this.cursorHeight);
		gb = this.cursorImage_down.GetGraphics();
		gb.FillSolidRect(1, 0, this.cursorWidth - 2, this.cursorHeight, RGBA(24, 24, 24, 190));
		this.cursorImage_down.ReleaseGraphics(gb);

		// create/refresh cursor Button in buttons array
		this.buttons[cScrollbar.ButtonType.cursor] = new button(this.cursorImage_normal, this.cursorImage_hover, this.cursorImage_down);
	}

	this.setButtons = function () {

		// normal scroll_up Image
		this.upImage_normal = gdi.CreateImage(this.w, cScrollbar.bt_h);
		var gb = this.upImage_normal.GetGraphics();
		gb.DrawImage(iconsScrollv01, 0, 14, 24 - 2, 24, 3, 0, 24, 24, 0, 245);
		this.upImage_normal.ReleaseGraphics(gb);

		// hover scroll_up Image
		this.upImage_hover = gdi.CreateImage(this.w, cScrollbar.bt_h);
		gb = this.upImage_hover.GetGraphics();
		gb.FillSolidRect(1, 0, this.upImage_hover.Width - 2, this.upImage_hover.Height - 1, RGBA(94, 94, 94, 190));
		gb.DrawImage(iconsScrollv01, 0, 14, 24 - 2, 24, 24 + 3, 0, 24, 24, 0, 255);
		this.upImage_hover.ReleaseGraphics(gb);

		// down scroll_up Image
		this.upImage_down = gdi.CreateImage(this.w, cScrollbar.bt_h);
		gb = this.upImage_down.GetGraphics();
		gb.FillSolidRect(1, 0, this.upImage_down.Width - 2, this.upImage_down.Height - 1, RGBA(24, 24, 24, 190));
		gb.DrawImage(iconsScrollv01, 0, 14, 24 - 2, 24, 24 + 3, 0, 24, 24, 0, 255);
		this.upImage_down.ReleaseGraphics(gb);

		// normal scroll_down Image
		this.downImage_normal = gdi.CreateImage(this.w, cScrollbar.bt_h);
		gb = this.downImage_normal.GetGraphics();
		gb.DrawImage(iconsScrollv01, 0, 2, 24 - 2, 24, 3, 24, 24, 24, 0, 245);
		this.downImage_normal.ReleaseGraphics(gb);

		// hover scroll_down Image
		this.downImage_hover = gdi.CreateImage(this.w, cScrollbar.bt_h);
		gb = this.downImage_hover.GetGraphics();
		gb.FillSolidRect(1, 1, this.downImage_hover.Width - 2, this.downImage_hover.Height - 1, RGBA(94, 94, 94, 190));
		gb.DrawImage(iconsScrollv01, 0, 2, 24 - 2, 24, 24 + 3, 24, 24, 24, 0, 255);
		this.downImage_hover.ReleaseGraphics(gb);

		// down scroll_down Image
		this.downImage_down = gdi.CreateImage(this.w, cScrollbar.bt_h);
		gb = this.downImage_down.GetGraphics();
		gb.FillSolidRect(1, 1, this.downImage_down.Width - 2, this.downImage_down.Height - 1, RGBA(24, 24, 24, 190));
		gb.DrawImage(iconsScrollv01, 0, 2, 24 - 2, 24, 24 + 3, 24, 24, 24, 0, 255);
		this.downImage_down.ReleaseGraphics(gb);

		for (i = 1; i < this.buttons.length; i++) {
			switch (i) {
			case cScrollbar.ButtonType.cursor:
				this.buttons[cScrollbar.ButtonType.cursor] = new button(this.cursorImage_normal, this.cursorImage_hover, this.cursorImage_down);
				break;
			case cScrollbar.ButtonType.up:
				this.buttons[cScrollbar.ButtonType.up] = new button(this.upImage_normal, this.upImage_hover, this.upImage_down);
				break;
			case cScrollbar.ButtonType.down:
				this.buttons[cScrollbar.ButtonType.down] = new button(this.downImage_normal, this.downImage_hover, this.downImage_down);
				break;
			}
		}
	}

	this.setSize = function (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.area_y = y + (cScrollbar.buttons ? cScrollbar.bt_h : 0);
		this.area_h = h - (cScrollbar.buttons ? (cScrollbar.bt_h * 2) : 0);
		this.setButtons();
	}

	// (g_browser.totalRowsVis*g_browser.rowHeight), (g_browser.rowHeight*g_browser.rowsCount + g_showlist.h), scroll)

	this.setOffsetFromCursorPos_ko = function () {
		// calc ratio of the scroll cursor to calc the equivalent item for the full playlist (with gh)
		var ratio = (this.cursorPos - this.area_y) / (this.area_h - this.cursorHeight);
		// calc idx of the item (of the full playlist with gh) to display at top of the panel list (visible)
		var newOffset = Math.round(((g_browser.rowHeight * g_browser.rowsCount + g_showlist.h) - (g_browser.totalRowsVis * g_browser.rowHeight)) * ratio);
		return newOffset;
	}

	this.setOffsetFromCursorPos = function () {
		// calc ratio of the scroll cursor to calc the equivalent item for the full playlist (with gh)
		var ratio = (this.cursorPos - this.area_y) / (this.area_h - this.cursorHeight);
		// calc idx of the item (of the full playlist with gh) to display at top of the panel list (visible)
		var newOffset = Math.round(((g_browser.rowsCount + Math.round(g_showlist.delta)) - g_browser.totalRowsVis) * ratio);
		return newOffset;
	}

	this.cursorCheck = function (event, x, y) {
		this.ishover = (x >= this.x && x <= this.x + this.w && y >= this.cursorPos && y <= (this.cursorPos + this.cursorHeight));

		if (!this.buttons[0])
			return;

		switch (event) {
		case "down":
			this.buttons[cScrollbar.ButtonType.cursor].checkstate(event, x, y);
			if (this.ishover) {
				this.cursorClickX = x;
				this.cursorClickY = y;
				this.cursorDrag = true;
				this.cursorDragDelta = y - this.cursorPos;
			}

			break;
		case "up":
			this.buttons[cScrollbar.ButtonType.cursor].checkstate(event, x, y);
			if (this.cursorDrag) {
				scroll = this.setOffsetFromCursorPos() * g_browser.rowHeight;
				this.repaint();
			}
			this.cursorClickX = 0;
			this.cursorClickY = 0;
			this.cursorDrag = false;
			break;
		case "move":
			this.buttons[cScrollbar.ButtonType.cursor].checkstate(event, x, y);
			if (this.cursorDrag) {
				this.cursorPos = y - this.cursorDragDelta;
				if (this.cursorPos + this.cursorHeight > this.area_y + this.area_h) {
					this.cursorPos = (this.area_y + this.area_h) - this.cursorHeight;
				}
				if (this.cursorPos < this.area_y) {
					this.cursorPos = this.area_y;
				}
				scroll = this.setOffsetFromCursorPos() * g_browser.rowHeight;
			}
			break;
		case "leave":
			this.buttons[cScrollbar.ButtonType.cursor].checkstate(event, x, y);
			break;
		default:
			//
		}
	}

	this.check = function (event, x, y) {
		this.hover = (x >= this.x && x <= this.x + this.w && y > this.area_y && y < this.area_y + this.area_h);

		// check cursor
		this.cursorCheck(event, x, y);

		// check other buttons
		var totalButtonToCheck = 3;
		for (var i = 1; i < totalButtonToCheck; i++) {
			switch (event) {
			case "dblclk":
				switch (i) {
				case 1: // up button
					if (this.buttons[i].checkstate(event, x, y) == ButtonStates.hover) {
						g_browser.buttonclicked = true;
						this.buttons[i].checkstate("down", x, y);
						on_mouse_wheel(1);
						if (!cScrollbar.timerID2) {
							cScrollbar.timerID2 = window.SetInterval(function () {
									cScrollbar.timer_counter++;
									if (cScrollbar.timer_counter > 7) {
										on_mouse_wheel(1);
									}
								}, 60);
						}
					}
					break;
				case 2: // down button
					if (this.buttons[i].checkstate(event, x, y) == ButtonStates.hover) {
						g_browser.buttonclicked = true;
						this.buttons[i].checkstate("down", x, y);
						on_mouse_wheel(-1);
						if (!cScrollbar.timerID2) {
							cScrollbar.timerID2 = window.SetInterval(function () {
									cScrollbar.timer_counter++;
									if (cScrollbar.timer_counter > 7) {
										on_mouse_wheel(-1);
									}
								}, 60);
						}
					}
					break;
				}
				break;
			case "down":
				switch (i) {
				case 1: // up button
					if (this.buttons[i].checkstate(event, x, y) == ButtonStates.down) {
						g_browser.buttonclicked = true;
						cScrollbar.timer_counter = 0;
						on_mouse_wheel(1);
						cScrollbar.timerID2 = window.SetInterval(function () {
								cScrollbar.timer_counter++;
								if (cScrollbar.timer_counter > 7) {
									on_mouse_wheel(1);
								}
							}, 60)
					}
					break;
				case 2: // down button
					if (this.buttons[i].checkstate(event, x, y) == ButtonStates.down) {
						g_browser.buttonclicked = true;
						cScrollbar.timer_counter = 0;
						on_mouse_wheel(-1);
						cScrollbar.timerID2 = window.SetInterval(function () {
								cScrollbar.timer_counter++;
								if (cScrollbar.timer_counter > 7) {
									on_mouse_wheel(-1);
								}
							}, 60);
					}
					break;
				}
				break;
			case "up":
				if (cScrollbar.timerID2) {
					window.ClearInterval(cScrollbar.timerID2);
					cScrollbar.timerID2 = false;
				}
				cScrollbar.timer_counter = 0;
				this.buttons[i].checkstate(event, x, y);
				break;
			default:
				this.buttons[i].checkstate(event, x, y);
			}
		}
	}

	this.repaint = function () {
		eval(this.parentObjName + ".repaint()");
	}
}

function check_scroll(scroll___) {
	if (g_browser) {
		if (scroll___ < 0)
			scroll___ = 0;
		if (scroll___ != 0 && scroll___ > g_browser.rowsCount * g_browser.rowHeight + g_showlist.h - g_browser.totalRowsVis * g_browser.rowHeight) {
			scroll___ = g_browser.rowsCount * g_browser.rowHeight + g_showlist.h - g_browser.totalRowsVis * g_browser.rowHeight;
		}
		g_scrollbar.setCursor(g_browser.totalRowsVis * g_browser.rowHeight, g_browser.rowHeight * g_browser.rowsCount + g_showlist.h, scroll_);
		return scroll___;
	}
}
