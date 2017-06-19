
var g_newPlaylist = null;

var oNewPlaylist = function () {
	this.w = 650;
	this.autoplaylist = 0;
	this.buttons = [];
	this.buttonsTotal = 3;
	this.np_h = 225;

	// inputbox variables
	var temp_bmp = gdi.CreateImage(1, 1);
	var temp_gr = temp_bmp.GetGraphics();
	var g_timer_cursor = false;
	var g_cursor_state = true;
	clipboard = {
		text : null
	}
	images = {
		resetIcon_off : null,
		close_off : null,
		close_ov : null,
		close_on : null,
	}

	this.getImages = function () {
		var gb;
		var bt_h = 35;
		var saveW = cancelW = 0;
		var gAddTxtW = 20;

		calcWidthBt = gdi.CreateImage(1, 1);
		gb = calcWidthBt.GetGraphics();
		saveW = gb.CalcTextWidth("Save", groupFont) + gAddTxtW * 2 + 10;
		cancelW = gb.CalcTextWidth("Cancel", groupFont) + gAddTxtW * 2;
		calcWidthBt.ReleaseGraphics(gb);

		this.g_cancel_off = gdi.CreateImage(cancelW, bt_h);
		gb = this.g_cancel_off.GetGraphics();
		this.g_cancel_off.ReleaseGraphics(gb);
		this.g_cancel_ov = gdi.CreateImage(cancelW, bt_h);
		gb = this.g_cancel_ov.GetGraphics();
		gb.FillSolidRect(0, 0, this.g_cancel_ov.Width, this.g_cancel_ov.Height, RGBA(255, 255, 255, 50));
		this.g_cancel_ov.ReleaseGraphics(gb);
		this.g_cancel_on = gdi.CreateImage(cancelW, bt_h);
		gb = this.g_cancel_on.GetGraphics();
		gb.FillSolidRect(0, 0, this.g_cancel_on.Width, this.g_cancel_on.Height, RGB(58, 58, 58));
		this.g_cancel_on.ReleaseGraphics(gb);

		this.g_save_off = gdi.CreateImage(saveW, bt_h);
		gb = this.g_save_off.GetGraphics();
		this.g_save_off.ReleaseGraphics(gb);
		this.g_save_ov = gdi.CreateImage(saveW, bt_h);
		gb = this.g_save_ov.GetGraphics();
		gb.FillSolidRect(0, 0, this.g_save_ov.Width, this.g_save_ov.Height, RGBA(255, 255, 255, 50));
		this.g_save_ov.ReleaseGraphics(gb);
		this.g_save_on = gdi.CreateImage(saveW, bt_h);
		gb = this.g_save_on.GetGraphics();
		gb.FillSolidRect(0, 0, this.g_save_on.Width, this.g_save_on.Height, RGB(58, 58, 58));
		this.g_save_on.ReleaseGraphics(gb);

		bt_size = 27;

		this.close_off = gdi.CreateImage(bt_size, bt_size);
		gb = this.close_off.GetGraphics();
		gb.DrawImage(icons25v35, 0, 0, bt_size, bt_size, 0, bt_size * 17, bt_size, bt_size);
		this.close_off.ReleaseGraphics(gb);

		this.close_ov = gdi.CreateImage(bt_size, bt_size);
		gb = this.close_ov.GetGraphics();
		gb.DrawImage(icons25v35, 0, 0, bt_size, bt_size, bt_size, bt_size * 17, bt_size, bt_size);
		this.close_ov.ReleaseGraphics(gb);

		this.close_on = gdi.CreateImage(bt_size, bt_size);
		gb = this.close_on.GetGraphics();
		gb.DrawImage(icons25v35, 0, 0, bt_size, bt_size, bt_size * 2, bt_size * 17, bt_size, bt_size);
		this.close_on.ReleaseGraphics(gb);

		for (i = 0; i < this.buttonsTotal; i++) {
			switch (i) {
			case 0:
				if (typeof(this.buttons[i]) == "undefined") {
					this.buttons.push(new button(this.g_cancel_off, this.g_cancel_ov, this.g_cancel_on));
				} else {
					this.buttons[i].img[0] = this.g_cancel_off;
					this.buttons[i].img[1] = this.g_cancel_ov;
					this.buttons[i].img[2] = this.g_cancel_on;
				}
				break;
			case 1:
				if (typeof(this.buttons[i]) == "undefined") {
					this.buttons.push(new button(this.g_save_off, this.g_save_ov, this.g_save_on));
				} else {
					this.buttons[i].img[0] = this.g_save_off;
					this.buttons[i].img[1] = this.g_save_ov;
					this.buttons[i].img[2] = this.g_save_on;
				}
				break;
			case 2:
				if (typeof(this.buttons[i]) == "undefined") {
					this.buttons.push(new button(this.close_off, this.close_ov, this.close_on));
				} else {
					this.buttons[i].img[0] = this.close_off;
					this.buttons[i].img[1] = this.close_ov;
					this.buttons[i].img[2] = this.close_on;
				}
				break;
			}
		}
	}
	this.getImages();

	this.on_init = function () {
		this.inputbox = new oInputbox(this.w - 80 - 16, 25, "", "", RGB(148, 148, 148), RGB(255, 255, 255), 0, RGBA(0, 0, 0, 30), create_newPL, "g_newPlaylist", RGB(255, 255, 255), RGB(34, 34, 34));
		this.inputbox.autovalidation = true;
	}
	this.on_init();

	this.repaint = function () {
		try {
			window.RepaintRect(ww - Math.round((ww + this.w) / 2) + 40, wh - Math.round((wh + this.np_h) / 2) + 90, this.w, this.np_h);
		} catch (e) {}
	}

	this.draw = function (gr) {

		if (this.autoplaylist)
			this.np_h = 425;
		else
			this.np_h = 225;

		var bx = ww - Math.round((ww + this.w) / 2) + 40;
		var by = wh - Math.round((wh + this.np_h) / 2) + 0;
		var bw = this.w - 80;

		gr.FillSolidRect(0, 0, ww, wh, RGBA(0, 0, 0, 130));
		gr.FillSolidRect(ww - Math.round((ww + this.w) / 2), by, this.w, this.np_h, RGB(255, 255, 255));

		this.buttons[2].draw(gr, bx + bw - 5, wh - Math.round((wh + this.np_h + 5) / 2) + 15, 255);

		gr.gdiDrawText("Name this playlist", gdi.Font("Segoe UI", 22), RGB(0, 0, 0), ww - Math.round((ww + this.w) / 2) + 40, by + 44, this.w - 80, 40, DT_LEFT | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);

		if (this.inputbox.edit) {
			gr.DrawRect(ww - Math.round((ww + this.w) / 2) + 40, by +90, this.w - 80, 35, 1, RGB(0, 0, 0));
		} else {
			gr.DrawRect(ww - Math.round((ww + this.w) / 2) + 40, by+90, this.w - 80, 35, 1, RGBA(0, 0, 0, 100));
		}

		var bt_size = 42;

		this.inputbox.draw(gr, bx + 15, by + 96, 0, 0);
		//if (this.inputbox.text.length > 0)
		//	this.reset_bt.draw(gr, bx + bw - 25, by + 9, 255);

		var bt_save_x = bx + bw - this.g_save_off.Width - this.g_cancel_off.Width - 15;
		var bt_cancel_y = by + 150;
		var bt_cancel_x = bx + bw - this.g_cancel_off.Width;

		gr.FillSolidRect(bt_cancel_x, bt_cancel_y, this.g_cancel_off.Width, this.g_cancel_off.Height, RGB(135, 135, 135));
		if (this.inputbox.text.length > 0)
			gr.FillSolidRect(bt_save_x, bt_cancel_y, this.g_save_off.Width, this.g_save_off.Height, accent_colour);
		else
			gr.FillSolidRect(bt_save_x, bt_cancel_y, this.g_save_off.Width, this.g_save_off.Height, setAlpha(accent_colour, 100));

		this.buttons[0].draw(gr, bt_cancel_x, bt_cancel_y, 255);
		gr.GdiDrawText("Cancel", groupFont, RGB(255, 255, 255), this.buttons[0].x, this.buttons[0].y, this.buttons[0].w, this.buttons[0].h, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
		this.buttons[1].draw(gr, bt_save_x, bt_cancel_y, 255);
		gr.GdiDrawText("Save", groupFont, RGB(255, 255, 255), this.buttons[1].x, this.buttons[1].y, this.buttons[1].w, this.buttons[1].h, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);

	}

	this.on_mouse = function (event, x, y, delta) {
		switch (event) {
		case "lbtn_down":
			this.inputbox.check("down", x, y);

			if (this.buttons.length) {
				for (var i = 0; i < this.buttons.length; i++) {
					this.buttons[i].checkstate("down", x, y);
				}
			}
			break;
		case "lbtn_up":
			this.inputbox.check("up", x, y);

			for (var i = 0; i < this.buttons.length; i++) {
				switch (i) {
				case 0:
					if (this.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
						NewPlaylistDialog = false;
						window.Repaint();
						this.buttons[i].state = ButtonStates.hover;
					}
					break;
				case 1:
					if (this.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
						if (this.inputbox.text.length > 0 && (g_newPlaylist.inputbox.text.length > 0))
							create_newPL();
						this.buttons[i].state = ButtonStates.hover;
					}
					break;
				case 2:
					if (this.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
						NewPlaylistDialog = false;
						window.Repaint();
						this.buttons[i].state = ButtonStates.hover;
					}
					break;
				}
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

			if (this.buttons.length) {
				for (var i = 0; i < this.buttons.length; i++) {
					if (this.buttons[i].checkstate("move", x, y) == ButtonStates.hover);
				}
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

var npl_type = 0;
var npl_files = null;

function create_newPL() {
	var plname;

	if (g_newPlaylist.inputbox.text.length == 0) {
		plname = "";
		NewPlaylistDialog = false;
		g_newPlaylist.inputbox.text = "";
		g_newPlaylist.inputbox.offset = 0;
		window.Repaint();
		return true;
	} else {
		plname = g_newPlaylist.inputbox.text;
	}

	switch (npl_type) {
	case 0:
		var new_pl_idx = plman.PlaylistCount;
		plman.ActivePlaylist = plman.CreatePlaylist(new_pl_idx, plname);
		break;
	case 1:
		var new_pl_idx = plman.PlaylistCount;
		plman.ActivePlaylist = plman.CreatePlaylist(new_pl_idx, plname);
		plman.InsertPlaylistItems(new_pl_idx, 0, npl_files, false);
		break;
	case 2:
		plman.RenamePlaylist(plman.ActivePlaylist, plname);
		g_plmanager && g_plmanager.repaint();
		break;
	}
	NewPlaylistDialog = false;
	g_newPlaylist.inputbox.text = "";
	g_newPlaylist.inputbox.offset = 0;
	g_newPlaylist.inputbox.ishover = false;

	on_mouse_move();
	window.Repaint();
}
