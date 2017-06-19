

var time_y = l_txt_x = l_txt_w = l_txt_h = r_txt_x = r_txt_w = r_txt_h = 0;

var g_seek_repaint_timer = false;
var seekfader = g_drag = g_drag_seek = pos = 0;

function oSeekbar() {
	this.x = this.y = this.w = this.h = this.seekstart = this.seekend = 0;

	this.setSize = function (x, y, w, h, pad_left, pad_right) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.seekstart = pad_left;
		this.seekend = pad_right;
	}

	this.draw = function (gr) {

		gr.FillSolidRect(this.x, this.y, this.w, this.h, seek_col_back);
		pos = g_seekbar.w * (fb.PlaybackTime / fb.PlaybackLength) - 1;
		pos = pos < 0 ? 1 : pos;
		if (pos) {
			try {
				gr.FillSolidRect(this.x, this.y, pos, this.h, seek_col_solid);
				gr.SetSmoothingMode(2);
				gr.FillEllipse(this.x + pos - 5.5, this.y - 4.5, 13, 13, seek_col_solid);
				!g_drag && gr.FillEllipse(this.x + pos - 3, this.y - 2, 8, 8, col_bg_bar);
				gr.SetSmoothingMode(0);
			} catch (e) {
				fb.trace(e)
			}
		}

		time_y = this.y + 10;
		l_txt_w = gr.CalcTextWidth(g_elap, timeFont);
		l_txt_h = gr.CalcTextHeight(g_elap, timeFont);
		l_txt_x = this.x;
		r_txt = g_remain;
		r_txt_w = gr.CalcTextWidth(r_txt, timeFont);
		r_txt_h = gr.CalcTextHeight(r_txt, timeFont);
		r_txt_x = this.x + this.w - r_txt_w;
		gr.GdiDrawText(g_elap, timeFont, seek_col_txt, l_txt_x, time_y, l_txt_w, l_txt_h, DT_RIGHT | DT_CALCRECT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);
		if ((fb.IsPlaying || fb.IsPaused) && fb.PlaybackLength)
			gr.GdiDrawText(r_txt, timeFont, seek_col_txt, r_txt_x, time_y, r_txt_w, r_txt_h, DT_LEFT | DT_CALCRECT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);

	}

	this.repaint = function (event) {
		switch (event) {
		case 0:
			// Seekbar
			window.RepaintRect(this.x - 7, this.y - 5, this.w + 14, this.h + 11, true);
			break;
		case 2:
			// Time Text
			window.RepaintRect(l_txt_x - 2, time_y, l_txt_w + 4, l_txt_h);
			window.RepaintRect(r_txt_x - 6, time_y, r_txt_w + 6, r_txt_h);
			break;
		case 3:
			// All
			window.RepaintRect(this.x - 10, this.y - 10, this.w + 30, this.h + 30);
			break;
		}
	}

	this.checkstate = function (event, x, y, step) {
		this.ishover = (x > this.x && x < this.x + this.w && y > this.y - 4 && y < this.y + this.h + 8);
		this.old = this.state;
		switch (event) {
		case "down":
			if (this.ishover) {
				if (fb.IsPlaying && fb.PlaybackLength) {
					g_drag = true;
					g_drag_seek = (x > g_seekbar.x && x < (g_seekbar.x + g_seekbar.w)) ? ((x - g_seekbar.x) / g_seekbar.w) : (x <= g_seekbar.x) ? 0 : 1;
					fb.PlaybackTime = fb.PlaybackLength * g_drag_seek;
					g_elap = tf1_elap.Eval(true);
					g_remain = tf1_remain.Eval(true);
					g_seekbar.repaint(3);
				}
			}
			break;
		case "up":
			if (g_drag) {
				g_drag = false;
				g_seekbar.repaint(3);
			}
			break;
		case "move":
			this.ishover = (x > this.x && x < this.x + this.w && y > this.y - 4 && y < this.y + g_seekbar.h + 8);
			if (g_drag) {
				g_drag_seek = (x > g_seekbar.x && x < (g_seekbar.x + g_seekbar.w)) ? ((x - g_seekbar.x) / g_seekbar.w) : (x <= g_seekbar.x) ? 0 : 1;
				//if (!g_seek_repaint_timer) {
				//g_seek_repaint_timer = window.SetTimeout(function () {
				//	window.ClearTimeout(g_seek_repaint_timer);
				//g_seek_repaint_timer = false;

				fb.PlaybackTime = fb.PlaybackLength * g_drag_seek;
				pos = g_seekbar.w * (fb.PlaybackTime / fb.PlaybackLength) - 1;
				g_elap = tf1_elap.Eval(true);
				g_remain = tf1_remain.Eval(true);

				g_seekbar.repaint(0);
				g_seekbar.repaint(2);
				//}, 25);
				//}
			}
			break;
		case "leave":
			break;
		case "playback":
			try {
				this.repaint(0);
				this.repaint(2);
			} catch (e) {}
			break;
		case "new_track":
			pos = g_seekbar.w * (fb.PlaybackTime / fb.PlaybackLength) - 1;
			g_elap = "0:00";
			g_remain = tf1_remain.Eval(true);
			g_seekbar.repaint(3);
			break;
		}

	}

	this.wheel = function (step) {
		if (this.ishover) {
			if (step > 0) {
				fb.RunMainMenuCommand("Playback/Seek/Ahead by 1 second");
			} else {
				fb.RunMainMenuCommand("Playback/Seek/Back by 1 second");
			}
			g_remain = tf1_remain.Eval(true);
			g_elap = tf1_elap.Eval(true);
			g_seekbar.repaint(0);
			g_seekbar.repaint(2);
		}
	}
}
