
var volume_repaint_timer = mvolume_repaint_timer = false;
var v_drag = v_drag_hov = volpos = g_hover_vol = 0;

var m_drag = m_drag_hov = mvolpos = m_hover_vol = 0;
var mv_sep = vol_w + vol_margen_x * 2 + 3;

function oVolume(vx, vy, vw, vh) {

	this.pos2vol = function (pos) {
		return (50 * Math.log(0.99 * ((vy + vh + (vw / 2) - pos) / vh < 0 ? 0 : (vy + vh + (vw / 2) - pos) / vh) + 0.01) / Math.LN10);
	}

	this.vol2pos = function (v, w2) {
		return (w2 - Math.round(((Math.pow(10, v / 50) - 0.01) / 0.99) * w2));
	}

	this.vol2percentage = function (v) {
		var p = ((Math.pow(10, v / 50) - 0.01) / 0.99);
		return (p);
	}

	this.setSize = function (x, y, w, h) {
		vx = x;
		vy = y;
		vw = w;
		vh = h;
	}

	this.setBt = function () {
		var gb;
		this.mute_img = gdi.CreateImage(34, 34);
		gb = this.mute_img.GetGraphics();
		this.mute_img.ReleaseGraphics(gb);

		if (typeof(this.play_bt) == "undefined")
			this.mute_bt = new button(this.mute_img, this.mute_img, this.mute_img);
		else
			this.mute_bt.update(this.mute_img, this.mute_img, this.mute_img);
		if (typeof(this.play_bt2) == "undefined")
			this.mute_bt2 = new button(this.mute_img, this.mute_img, this.mute_img);
		else
			this.mute_bt2.update(this.mute_img, this.mute_img, this.mute_img);
	}
	this.setBt();

	this.draw = function (gr) {

		// Volume
		var volume = fb.Volume;
		var volpos = this.vol2pos(volume, vh);
		var percentage = this.vol2percentage(volume);
		var vol_txt = Math.ceil(percentage * 100);
		vol_txt = vol_txt < "10" ? "0" + vol_txt : vol_txt;

		if (show_volume) {
			gr.FillSolidRect(vx - vol_margen_x, vy - vol_margen_y, vw + vol_margen_x * 2, vh + vol_margen_h, RGB(250, 250, 250));

			this.mute_bt.draw(gr, vx - vol_margen_x + 10, vy - vol_margen_y + 10, 255);
			var img = iconsPlayer30v09;
			var b_bt_w = 32;
			var v_bt_x = this.mute_bt.state == ButtonStates.hover ? b_bt_w : this.mute_bt.state == ButtonStates.down ? b_bt_w * 2 : 0;

			if (vol_txt == 00)
				gr.DrawImage(img, this.mute_bt.x, this.mute_bt.y, b_bt_w, b_bt_w, v_bt_x, b_bt_w * 16, b_bt_w, b_bt_w);
			else if (vol_txt <= 25)
				gr.DrawImage(img, this.mute_bt.x, this.mute_bt.y, b_bt_w, b_bt_w, v_bt_x, b_bt_w * 12, b_bt_w, b_bt_w);
			else if (vol_txt <= 50)
				gr.DrawImage(img, this.mute_bt.x, this.mute_bt.y, b_bt_w, b_bt_w, v_bt_x, b_bt_w * 13, b_bt_w, b_bt_w);
			else if (vol_txt <= 75)
				gr.DrawImage(img, this.mute_bt.x, this.mute_bt.y, b_bt_w, b_bt_w, v_bt_x, b_bt_w * 14, b_bt_w, b_bt_w);
			else if (vol_txt <= 100)
				gr.DrawImage(img, this.mute_bt.x, this.mute_bt.y, b_bt_w, b_bt_w, v_bt_x, b_bt_w * 15, b_bt_w, b_bt_w);

			// fb2k volume
			gr.FillSolidRect(vx, vy, vw, vh + vw, accent_colour);
			gr.FillSolidRect(vx, vy, vw, volpos + vw, RGB(190, 190, 190));

			gr.SetSmoothingMode(2);
			gr.FillEllipse(vx - 4.5, vy + volpos - 4.5, 13, 13, accent_colour);
			!v_drag && gr.FillEllipse(vx - 2, vy + volpos - 2, 8, 8, RGB(255, 255, 255));
			gr.SetSmoothingMode(0);

			if (properties.show_masterVolume) {
				// Master volume
				gr.FillSolidRect(vx + vw + vol_margen_x + 3, vy - vol_margen_y, vw + vol_margen_x * 2, vh + vol_margen_h, RGB(250, 250, 250));

				var mvolume = (ActiveX && UIHacks) ? UIHacks.MasterVolume.Volume : 1.0;
				var mvolpos = (vh - Math.round(mvolume * vh));
				gr.FillSolidRect(vx + mv_sep, vy, vw, vh + vw, RGB(58, 58, 58));
				gr.FillSolidRect(vx + mv_sep, vy, vw, mvolpos + vw, RGB(190, 190, 190));

				gr.SetSmoothingMode(2);
				gr.FillEllipse(vx - 4.5 + mv_sep, vy + mvolpos - 4.5, 13, 13, RGB(58, 58, 58));
				!m_drag && gr.FillEllipse(vx - 2 + mv_sep, vy + mvolpos - 2, 8, 8, RGB(255, 255, 255));
				gr.SetSmoothingMode(0);

				this.mute_bt2.draw(gr, vx + vw + vol_margen_x * 2 - 14, vy - vol_margen_y + 10, 255);
				var v_bt_x2 = this.mute_bt2.state == ButtonStates.hover ? b_bt_w : this.mute_bt2.state == ButtonStates.down ? b_bt_w * 2 : 0;

				if (ActiveX && UIHacks) {
					if (UIHacks.MasterVolume.Mute == true)
						gr.DrawImage(img, this.mute_bt2.x, this.mute_bt2.y, b_bt_w, b_bt_w, v_bt_x2, b_bt_w * 16, b_bt_w, b_bt_w);
					else if (UIHacks.MasterVolume.Volume <= 0.25)
						gr.DrawImage(img, this.mute_bt2.x, this.mute_bt2.y, b_bt_w, b_bt_w, v_bt_x2, b_bt_w * 12, b_bt_w, b_bt_w);
					else if (UIHacks.MasterVolume.Volume <= 0.5)
						gr.DrawImage(img, this.mute_bt2.x, this.mute_bt2.y, b_bt_w, b_bt_w, v_bt_x2, b_bt_w * 13, b_bt_w, b_bt_w);
					else if (UIHacks.MasterVolume.Volume <= 0.75)
						gr.DrawImage(img, this.mute_bt2.x, this.mute_bt2.y, b_bt_w, b_bt_w, v_bt_x2, b_bt_w * 14, b_bt_w, b_bt_w);
					else if (UIHacks.MasterVolume.Volume <= 1.0)
						gr.DrawImage(img, this.mute_bt2.x, this.mute_bt2.y, b_bt_w, b_bt_w, v_bt_x2, b_bt_w * 15, b_bt_w, b_bt_w);
				}
			}
		}

		if (toolbar.buttons[3]) {
			var img = iconsPlayer30v09;
			var b_bt_w = 32;
			var v_bt_x = toolbar.buttons[3].state == ButtonStates.hover ? b_bt_w : toolbar.buttons[3].state == ButtonStates.down ? b_bt_w * 2 : 0;
			if (vol_txt == 00)
				gr.DrawImage(img, ww - 137 - 5, bt_play_y, b_bt_w, b_bt_w, v_bt_x, b_bt_w * 11, b_bt_w, b_bt_w);
			else if (vol_txt <= 25)
				gr.DrawImage(img, ww - 137 - 5, bt_play_y, b_bt_w, b_bt_w, v_bt_x, b_bt_w * 7, b_bt_w, b_bt_w);
			else if (vol_txt <= 50)
				gr.DrawImage(img, ww - 137 - 5, bt_play_y, b_bt_w, b_bt_w, v_bt_x, b_bt_w * 8, b_bt_w, b_bt_w);
			else if (vol_txt <= 75)
				gr.DrawImage(img, ww - 137 - 5, bt_play_y, b_bt_w, b_bt_w, v_bt_x, b_bt_w * 9, b_bt_w, b_bt_w);
			else if (vol_txt <= 100)
				gr.DrawImage(img, ww - 137 - 5, bt_play_y, b_bt_w, b_bt_w, v_bt_x, b_bt_w * 10, b_bt_w, b_bt_w);
		}

		gr.GdiDrawText(vol_txt, timeFont, seek_col_txt, toolbar.buttons[3].x + 35, toolbar.buttons[3].y, 30, 33, DT_LEFT | DT_VCENTER | DT_SINGLELINE);

	}

	this.repaint = function (mode) {
		window.RepaintRect(vx - vol_margen_x, vy - vol_margen_y, vw + vol_margen_w, vh + vol_margen_h);
		window.RepaintRect(toolbar.buttons[3].x + 30, toolbar.buttons[3].y, 30, 33);
		window.Repaint();
	}

	this.checkstate = function (event, x, y, step) {
		switch (event) {
		case "down":
			this.mute_bt.checkstate("down", x, y);
			if (v_drag_hov) {
				v_drag = true;
				this.repaint();
				on_mouse_move(x, y);
			} else
				v_drag = false;

			if (properties.show_masterVolume) {
				this.mute_bt2.checkstate("down", x, y);
				if (m_drag_hov) {
					m_drag = true;
					this.repaint();
					on_mouse_move(x, y);
				} else
					m_drag = false;
			}
			break;
		case "up":
			if (this.mute_bt.checkstate("up", x, y) == ButtonStates.hover) {
				fb.VolumeMute();
			}
			if (v_drag) {
				v_drag = false;
				this.repaint();
			}

			if (properties.show_masterVolume) {
				if (this.mute_bt2.checkstate("up", x, y) == ButtonStates.hover) {
					if (ActiveX && UIHacks) {
						UIHacks.MasterVolume.Mute = !UIHacks.MasterVolume.Mute;
						this.repaint();
					}
				}
				if (m_drag) {
					m_drag = false;
					this.repaint();
				}
			}
			break;
		case "wheel":
			if (v_drag_hov) {
				if (step > 0)
					fb.VolumeUp();
				else
					fb.VolumeDown();
				this.repaint();
				return;
			}
			if (properties.show_masterVolume) {
				if (m_drag_hov && ActiveX && UIHacks) {
					if (step > 0) {
						volMP = UIHacks.MasterVolume.Volume;
						UIHacks.MasterVolume.Volume = eval(volMP + 0.05);
					} else {
						volMP = UIHacks.MasterVolume.Volume;
						UIHacks.MasterVolume.Volume = eval(volMP - 0.05);
					}
					this.repaint();
					return;
				}
			}
			break;
		case "move":
			this.mute_bt.checkstate("move", x, y);

			var hover = traceMouse(x, y, vx - 5, vy - 10, vw + 10, vh + 20);
			var v_tmp1 = v_drag_hov;
			if (hover)
				v_drag_hov = true;
			else
				v_drag_hov = false;
			//if (v_tmp1 != v_drag_hov)
			//	this.repaint();
			if (v_drag) {
				var v = this.pos2vol(y);
				if (v <= -100)
					v = -100;
				if (v >= 0)
					v = 0;
				fb.Volume = v;
			}

			if (properties.show_masterVolume) {
				this.mute_bt2.checkstate("move", x, y);
				var master_hover = traceMouse(x, y, vx + mv_sep - 5, vy - 10, vw + 10, vh + 20);
				var v_tmp2 = m_drag_hov;
				if (master_hover)
					m_drag_hov = true;
				else
					m_drag_hov = false;
				//if (v_tmp2 != m_drag_hov)
				//		this.repaint();
				if (m_drag) {
					var v = this.pos2vol(y);
					if (v <= -100)
						v = -100;
					if (v >= 0)
						v = 0;
					volume = v;
					volpos = this.vol2pos(volume, vh);
					percentage = g_volume.vol2percentage(volume);
					vol_txt = Math.ceil(percentage * 100);
					vol_txt = vol_txt < "10" ? "0" + vol_txt : vol_txt;

					if (ActiveX && UIHacks)
						UIHacks.MasterVolume.Volume = eval(vol_txt == 100 ? "1.0" : "0." + vol_txt);

					this.repaint();

				}
			}
			break;
		case "leave":
			g_hover_vol = false;
			this.repaint();
			break;
		}
	}
}
