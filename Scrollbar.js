/**
 * scrollBar object by Br3tt aka Falstaff (c)2015
 * modded by NadirP
 */

oScrollBar = function (id, object_name, x, y, w, h, total_items, item_height, offset, parent_object, show_buttons, scroll_step, darkTheme) {
	this.id = id;
	this.objectName = object_name;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.total = total_items;
	this.itemHeight = item_height;
	this.offset = offset;
	this.parentObject = parent_object;
	this.buttons = Array(null, null, null);
	this.buttonType = {
		cursor : 0,
		up : 1,
		down : 2
	}
	this.showButtons = show_buttons;
	this.scrollStep = scroll_step;
	this.darkTheme = darkTheme;

	this.total;
	this.totalRowsFull;
	this.parentRepaint = function () {
		eval(this.parentObject).repaint();
	}

	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	this.setCursorButton = function () {

		// normal cursor Image
		this.cursorImage_normal = gdi.CreateImage(this.cursorWidth, this.cursorHeight);
		var gb = this.cursorImage_normal.GetGraphics();
		gb.FillSolidRect(1, 0, this.cursorWidth - 2, this.cursorHeight, this.darkTheme ? RGBA(94, 94, 94, 190) : RGBA(190, 190, 190, 250));
		this.cursorImage_normal.ReleaseGraphics(gb);

		// hover cursor Image
		this.cursorImage_hover = gdi.CreateImage(this.cursorWidth, this.cursorHeight);
		gb = this.cursorImage_hover.GetGraphics();
		gb.FillSolidRect(1, 0, this.cursorWidth - 2, this.cursorHeight, this.darkTheme ? RGBA(94, 94, 94, 190) : RGBA(190, 190, 190, 250)); //RGBA(215, 215, 215, 190));
		this.cursorImage_hover.ReleaseGraphics(gb);

		// down cursor Image
		this.cursorImage_down = gdi.CreateImage(this.cursorWidth, this.cursorHeight);
		gb = this.cursorImage_down.GetGraphics();
		gb.FillSolidRect(1, 0, this.cursorWidth - 2, this.cursorHeight, RGBA(24, 24, 24, 190));
		this.cursorImage_down.ReleaseGraphics(gb);

		// create/refresh cursor Button in buttons array
		this.buttons[this.buttonType.cursor] = new button(this.cursorImage_normal, this.cursorImage_hover, this.cursorImage_down);
	}

	this.setButtons = function () {
		// normal scroll_up Image
		this.upImage_normal = gdi.CreateImage(this.w, cScrollBar.bt_h);
		var gb = this.upImage_normal.GetGraphics();
		gb.DrawImage(iconsScrollv01, 0, 14, 24 - 2, 24, 3, 0, 24, 24, 0, 245);
		this.upImage_normal.ReleaseGraphics(gb);

		// hover scroll_up Image
		this.upImage_hover = gdi.CreateImage(this.w, cScrollBar.bt_h);
		gb = this.upImage_hover.GetGraphics();
		gb.FillSolidRect(1, 0, this.upImage_hover.Width - 2, this.upImage_hover.Height - 1, RGBA(94, 94, 94, 190)); //RGBA(215, 215, 215, 190));
		gb.DrawImage(iconsScrollv01, 0, 14, 24 - 2, 24, 24 + 3, 0, 24, 24, 0, 255);
		this.upImage_hover.ReleaseGraphics(gb);

		// down scroll_up Image
		this.upImage_down = gdi.CreateImage(this.w, cScrollBar.bt_h);
		gb = this.upImage_down.GetGraphics();
		gb.FillSolidRect(1, 0, this.upImage_down.Width - 2, this.upImage_down.Height - 1, RGBA(24, 24, 24, 190));
		gb.DrawImage(iconsScrollv01, 0, 14, 24 - 2, 24, 24 + 3, 0, 24, 24, 0, 255);
		this.upImage_down.ReleaseGraphics(gb);

		// normal scroll_down Image
		this.downImage_normal = gdi.CreateImage(this.w, cScrollBar.bt_h);
		gb = this.downImage_normal.GetGraphics();
		gb.DrawImage(iconsScrollv01, 0, 2, 24 - 2, 24, 3, 24, 24, 24, 0, 245);
		this.downImage_normal.ReleaseGraphics(gb);

		// hover scroll_down Image
		this.downImage_hover = gdi.CreateImage(this.w, cScrollBar.bt_h);
		gb = this.downImage_hover.GetGraphics();
		gb.FillSolidRect(1, 1, this.downImage_hover.Width - 2, this.downImage_hover.Height - 1, RGBA(94, 94, 94, 190)); //RGBA(215, 215, 215, 190));
		gb.DrawImage(iconsScrollv01, 0, 2, 24 - 2, 24, 24 + 3, 24, 24, 24, 0, 255);
		this.downImage_hover.ReleaseGraphics(gb);

		// down scroll_down Image
		this.downImage_down = gdi.CreateImage(this.w, cScrollBar.bt_h);
		gb = this.downImage_down.GetGraphics();
		gb.FillSolidRect(1, 1, this.downImage_down.Width - 2, this.downImage_down.Height - 1, RGBA(24, 24, 24, 190));
		gb.DrawImage(iconsScrollv01, 0, 2, 24 - 2, 24, 24 + 3, 24, 24, 24, 0, 255);
		this.downImage_down.ReleaseGraphics(gb);

		for (i = 1; i < this.buttons.length; i++) {
			switch (i) {
			case this.buttonType.cursor:
				this.buttons[this.buttonType.cursor] = new button(this.cursorImage_normal, this.cursorImage_hover, this.cursorImage_down);
				break;
			case this.buttonType.up:
				this.buttons[this.buttonType.up] = new button(this.upImage_normal, this.upImage_hover, this.upImage_down);
				break;
			case this.buttonType.down:
				this.buttons[this.buttonType.down] = new button(this.downImage_normal, this.downImage_hover, this.downImage_down);
				break;
			}
		}
	}

	this.updateCursorPos = function (offset) {
		if (!this.w || !this.h || this.h < 100)
			return true;

		this.offset = offset;
		// calc cursor position and height / offset
		this.ratio1 = this.totalRowsFull / this.total;
		this.cursorWidth = this.w;
		this.cursorHeight = Math.round(this.ratio1 * this.cursorAreaHeight);
		this.cursorCut = (this.cursorHeight < 15 ? this.cursorHeight - 15 : 0);
		this.cursorHeight -= this.cursorCut;
		var ratio2 = this.offset / (this.total - this.totalRowsFull);
		this.cursorY = this.cursorAreaY + Math.round((this.cursorAreaHeight - this.cursorHeight) * ratio2);
		this.setCursorButton();
	}

	this.reSet = function (total_items, item_height, offset) {
		this.total = total_items;
		this.itemHeight = item_height;
		this.offset = offset;
		//
		this.setButtons();
		this.totalRowsFull = Math.floor(this.h / this.itemHeight);
		this.totalRowsVisibles = Math.ceil(this.h / this.itemHeight);
		this.visible = (this.total > this.totalRowsFull);
		if (this.showButtons) {
			this.buttonHeight = this.buttons[this.buttonType.up].h;
			this.cursorAreaY = this.y + this.buttonHeight;
			this.cursorAreaHeight = this.h - (this.buttonHeight * 2);
		} else {
			this.buttonHeight = 0;
			this.cursorAreaY = this.y;
			this.cursorAreaHeight = this.h;
		}
		if (this.visible)
			this.updateCursorPos(this.offset);

	}
	this.reSet(this.total, this.itemHeight, this.offset);

	this.reSize = function (x, y, w, h, total_items, item_height, offset) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.total = total_items;
		this.itemHeight = item_height;
		this.offset = offset;
		this.reSet(this.total, this.itemHeight, this.offset);
	}

	this.drawXY = function (gr, x, y) {
		this.x = x;
		this.y = y;

		if (this.visible) {
			// scrollbar background
			gr.FillSolidRect(this.x, this.y, this.w, this.h, this.darkTheme ? RGBA(90, 90, 90, 80) : RGBA(200, 200, 200, 100));
			// scrollbar buttons
			this.buttons[this.buttonType.cursor].draw(gr, x, this.cursorY, 255);
			if (this.showButtons) {
				this.buttons[this.buttonType.up].draw(gr, x, y, 255);
				this.buttons[this.buttonType.down].draw(gr, x, this.cursorAreaY + this.cursorAreaHeight, 255);
			}
		}
	}

	this.draw = function (gr) {
		if (this.h < (cScrollBar.bt_h * 2 + 15))
			return;

		if (this.visible) {
			// scrollbar background
			gr.FillSolidRect(this.x, this.y, this.w, this.h, this.darkTheme ? RGBA(90, 90, 90, 80) : RGBA(200, 200, 200, 100));
			// scrollbar buttons
			this.buttons[this.buttonType.cursor].draw(gr, this.x, this.cursorY, 255);
			if (this.showButtons) {
				this.buttons[this.buttonType.up].draw(gr, this.x, this.y, 255);
				this.buttons[this.buttonType.down].draw(gr, this.x, this.cursorAreaY + this.cursorAreaHeight, 255);
			}
		}
	}

	this.getOffsetFromCursorPos = function () {
		// calc ratio of the scroll cursor to calc the equivalent item for the full playlist (with gh)
		var ratio = (this.cursorY - this.cursorAreaY) / (this.cursorAreaHeight - this.cursorHeight);
		// calc idx of the item (of the full list with gh) to display at top of the panel list (visible)
		var newOffset = Math.round((this.total - this.totalRowsFull) * ratio);
		return newOffset;
	}

	this.setCursorPosFromOffset = function () {
		return;
		this.cursorY = Math.round((this.y + this.buttonHeight) + this.offset * (this.cursorAreaHeight / this.total));
		if (this.cursorY + this.cursorHeight > this.cursorAreaY + this.cursorAreaHeight) {
			this.cursorY = (this.cursorAreaY + this.cursorAreaHeight) - this.cursorHeight;
		}
		if (this.cursorY < this.cursorAreaY) {
			this.cursorY = this.cursorAreaY;
		}
	}

	this.cursorCheck = function (event, x, y) {
		this.ishover = (x >= this.x && x <= this.x + this.w && y >= this.cursorY && y <= (this.cursorY + this.cursorHeight));

		if (!this.buttons[this.buttonType.cursor])
			return;

		switch (event) {
		case "down":
			if (this.buttons[this.buttonType.cursor].checkstate(event, x, y) == ButtonStates.down) {
				this.cursorClickX = x;
				this.cursorClickY = y;
				this.cursorDrag = true;
				this.cursorDragDelta = y - this.cursorY;
			}
			break;
		case "up":
			this.buttons[this.buttonType.cursor].checkstate(event, x, y);
			if (this.cursorDrag) {
				eval(this.parentObject).offset = this.getOffsetFromCursorPos();
				this.setCursorPosFromOffset();
				this.parentRepaint();
			}
			this.cursorClickX = 0;
			this.cursorClickY = 0;
			this.cursorDrag = false;
			break;
		case "move":
			this.buttons[this.buttonType.cursor].checkstate(event, x, y);
			if (this.cursorDrag) {
				this.cursorY = y - this.cursorDragDelta;
				if (this.cursorY + this.cursorHeight > this.cursorAreaY + this.cursorAreaHeight) {
					this.cursorY = (this.cursorAreaY + this.cursorAreaHeight) - this.cursorHeight;
				}
				if (this.cursorY < this.cursorAreaY) {
					this.cursorY = this.cursorAreaY;
				}
				this.offset = this.getOffsetFromCursorPos();
				eval(this.parentObject).offset = this.offset;
				cScrollBar.obj = eval(this.objectName);
				if (!cScrollBar.timer_repaint) {
					cScrollBar.timer_repaint = window.SetTimeout(function () {
							var obj = cScrollBar.obj;
							obj.parentRepaint();
							window.ClearTimeout(cScrollBar.timer_repaint);
							cScrollBar.timer_repaint = false;
						}, 32);
				}
			}
			break;
		case "leave":
			this.buttons[this.buttonType.cursor].checkstate(event, x, y);
			break;
		}
	}

	this.check = function (event, x, y, delta) {

		this.isHoverScrollbar = (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h);
		this.isHoverCursor = (x >= this.x && x <= this.x + this.w && y >= this.cursorY && y <= this.cursorY + this.cursorHeight);
		this.isHoverEmptyArea = (x >= this.x && x <= this.x + this.w && y >= this.y + this.buttonHeight && y <= this.cursorAreaY + this.cursorAreaHeight) && !this.isHoverCursor;
		this.isHoverButtons = this.isHoverScrollbar && !this.isHoverCursor && !this.isHoverEmptyArea;

		// cursor events
		if (!this.buttonClick)
			this.cursorCheck(event, x, y);

		if (!this.cursorDrag) {
			// buttons events
			var totalButtonToCheck = 3;
			for (var i = 1; i < totalButtonToCheck; i++) {
				switch (event) {
				case "down":
					switch (i) {
					case 1: // up button
						if (this.buttons[i].checkstate(event, x, y) == ButtonStates.down) {
							this.buttonClick = true;
							this.offset = this.offset > 0 ? this.offset - 1 : 0;
							eval(this.parentObject).offset = this.offset;
							this.updateCursorPos(this.offset);
							this.parentRepaint();
							cScrollBar.obj = eval(this.objectName);
							if (!cScrollBar.timerID) {
								cScrollBar.timerID = window.SetInterval(function () {
										if (cScrollBar.timerCounter > 7) {
											var obj = cScrollBar.obj;
											obj.offset = obj.offset > 0 ? obj.offset - 1 : 0;
											eval(obj.parentObject).offset = obj.offset;
											obj.updateCursorPos(obj.offset);
											obj.parentRepaint();
										} else {
											cScrollBar.timerCounter++;
										}
									}, 60);
							}
						}
						break;
					case 2: // down button
						if (this.buttons[i].checkstate(event, x, y) == ButtonStates.down) {
							this.buttonClick = true;
							var max_offset = this.total - this.totalRowsFull;
							this.offset = (this.offset + 1 >= max_offset ? max_offset : this.offset + 1);
							eval(this.parentObject).offset = this.offset;
							this.updateCursorPos(this.offset);
							this.parentRepaint();
							cScrollBar.obj = eval(this.objectName);
							if (!cScrollBar.timerID) {
								cScrollBar.timerID = window.SetInterval(function () {
										if (cScrollBar.timerCounter > 7) {
											var obj = cScrollBar.obj;
											var max_offset = obj.total - obj.totalRowsFull;
											obj.offset = (obj.offset + 1 >= max_offset ? max_offset : obj.offset + 1);
											eval(obj.parentObject).offset = obj.offset;
											obj.updateCursorPos(obj.offset);
											obj.parentRepaint();
										} else {
											cScrollBar.timerCounter++;
										}
									}, 60);
							}
						}
						break;
					}
					break;
				case "up":
					this.buttonClick = false;
					if (cScrollBar.timerID) {
						window.ClearInterval(cScrollBar.timerID);
						cScrollBar.timerID = false;
					}
					cScrollBar.timerCounter = 0;
					this.buttons[i].checkstate(event, x, y);
					this.setCursorPosFromOffset();
					break;
				default:
					this.buttons[i].checkstate(event, x, y);
				}
			}

			// click on empty scrollbar area to scroll page
			if (this.isHoverEmptyArea) {
				switch (event) {
				case "down":
				case "dblclk":
					switch (y < this.cursorY) {
					case true: // up
						this.offset = this.offset > this.totalRowsFull ? this.offset - this.totalRowsFull : 0;
						eval(this.parentObject).offset = this.offset;
						this.reSet(this.total, this.itemHeight, this.offset);
						this.parentRepaint();
						cScrollBar.obj = eval(this.objectName);
						if (!cScrollBar.timerID) {
							cScrollBar.timerID = window.SetInterval(function () {
									var obj = cScrollBar.obj;
									if (cScrollBar.timerCounter > 7 && mouse_y < obj.cursorY) {
										obj.offset = obj.offset > obj.totalRowsFull ? obj.offset - obj.totalRowsFull : 0;
										eval(obj.parentObject).offset = obj.offset;
										obj.reSet(obj.total, obj.itemHeight, obj.offset);
										obj.parentRepaint();
									} else {
										cScrollBar.timerCounter++;
									}
								}, 60);
						}
						break;
					case false: // down
						var max_offset = this.total - this.totalRowsFull;
						this.offset = (this.offset + this.totalRowsFull >= max_offset ? max_offset : this.offset + this.totalRowsFull);
						eval(this.parentObject).offset = this.offset;
						this.reSet(this.total, this.itemHeight, this.offset);
						this.parentRepaint();
						cScrollBar.obj = eval(this.objectName);
						if (!cScrollBar.timerID) {
							cScrollBar.timerID = window.SetInterval(function () {
									var obj = cScrollBar.obj;
									if (cScrollBar.timerCounter > 7 && mouse_y > obj.cursorY + obj.cursorHeight) {
										var max_offset = obj.total - obj.totalRowsFull;
										obj.offset = (obj.offset + obj.totalRowsFull >= max_offset ? max_offset : obj.offset + obj.totalRowsFull);
										eval(obj.parentObject).offset = obj.offset;
										obj.reSet(obj.total, obj.itemHeight, obj.offset);
										obj.parentRepaint();
									} else {
										cScrollBar.timerCounter++;
									}
								}, 60);
						}
						break;
					}
					break;
				}
			}

			// mouse wheel event
			if (event == "wheel") {
				if (delta > 0) {
					this.offset = this.offset > this.scrollStep ? this.offset - this.scrollStep : 0;
					eval(this.parentObject).offset = this.offset;
					this.reSet(this.total, this.itemHeight, this.offset);
					this.parentRepaint();
				} else {
					this.offset = (this.offset < (this.total - this.totalRowsFull - this.scrollStep) ? (this.offset + this.scrollStep) : (this.total - this.totalRowsFull));
					eval(this.parentObject).offset = this.offset;
					this.reSet(this.total, this.itemHeight, this.offset);
					this.parentRepaint();
				}
			}
		}
	}

	this.on_key = function (event, vkey) {
		switch (event) {
		case "down":
			switch (vkey) {
			case VK_DOWN:
				var max_offset = this.total - this.totalRowsFull;
				this.offset = (this.offset + 1 >= max_offset ? max_offset : this.offset + 1);
				eval(this.parentObject).offset = this.offset;
				this.updateCursorPos(this.offset);
				this.parentRepaint();
				cScrollBar.obj = eval(this.objectName);
				if (!cScrollBar.timerID) {
					cScrollBar.timerID = window.SetInterval(function () {
							if (cScrollBar.timerCounter > 7) {
								var obj = cScrollBar.obj;
								var max_offset = obj.total - obj.totalRowsFull;
								obj.offset = (obj.offset + 1 >= max_offset ? max_offset : obj.offset + 1);
								eval(obj.parentObject).offset = obj.offset;
								obj.updateCursorPos(obj.offset);
								obj.parentRepaint();
							} else {
								cScrollBar.timerCounter++;
							}
						}, 60);
				}
				break;
			case VK_UP:
				this.offset = this.offset > 0 ? this.offset - 1 : 0;
				eval(this.parentObject).offset = this.offset;
				this.updateCursorPos(this.offset);
				this.parentRepaint();
				cScrollBar.obj = eval(this.objectName);
				if (!cScrollBar.timerID) {
					cScrollBar.timerID = window.SetInterval(function () {
							if (cScrollBar.timerCounter > 7) {
								var obj = cScrollBar.obj;
								obj.offset = obj.offset > 0 ? obj.offset - 1 : 0;
								eval(obj.parentObject).offset = obj.offset;
								obj.updateCursorPos(obj.offset);
								obj.parentRepaint();
							} else {
								cScrollBar.timerCounter++;
							}
						}, 60);
				}
				break;
			}
			break;
		case "up":
			if (cScrollBar.timerID) {
				window.ClearInterval(cScrollBar.timerID);
				cScrollBar.timerID = false;
			}
			cScrollBar.timerCounter = 0;
			break;
		}
	}

	this.on_char = function (code) {};

	this.on_focus = function (is_focused) {};
}
