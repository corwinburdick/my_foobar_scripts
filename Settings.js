
var Sdrag_timer;
var S_time;
var Srepaint;

var oSettings = function () {
	this.x = 0;
	this.y = 0;
	this.w = 350;
	this.h = 0;
	this.delta = this.w;
	this.margins = 40;
	this.p_hover = false;
	this.show_panel = false;
	this.tabButtons = [];
	this.tab = 0;
	this.buttons = [];
	this.buttonsTotal = 10;

	this.setSize = function (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	this.setButtons = function () {
		this.tabButtons.splice(0, this.tabButtons.length);
		for (i = 0; i < 2; i++) {
			switch (i) {
			case 0:
				this.tabButtons.push(new popupButton("playback", messageTitleFont2, this.tab == 0 ? [col_text1, accent_colour, col_text2] : [col_text2, accent_colour, col_text2], 0, 35, 0));
				break;
			case 1:
				this.tabButtons.push(new popupButton("theme", messageTitleFont2, this.tab == 1 ? [col_text1, accent_colour, col_text2] : [col_text2, accent_colour, col_text2], 0, 35, 0));
				break;
			}
		}

		var order_name = ["Default", "Repeat (Playlist)", "Repeat (Track)", "Random", "Shuffle (tracks)", "Shuffle (albums)", "Shuffle (folders)"];

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

		this.buttons.splice(0, this.buttons.length);
		for (i = 0; i < this.buttonsTotal; i++) {
			switch (i) {
			case 0:
				this.buttons.push(new popupButton(order_name[fb.PlaybackOrder], groupFont, [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg], 35, 0));
				break;
			case 1:
				this.buttons.push(new settingButton(fb.StopAfterCurrent, gdi.Font("Segoe UI Semibold", 14), [col_text1, col_text2, negative(col_text1), accent_colour]));
				break;
			case 2:
				this.buttons.push(new settingButton(fb.CursorFollowPlayback, gdi.Font("Segoe UI Semibold", 14), [col_text1, col_text2, negative(col_text1), accent_colour]));
				break;
			case 3:
				this.buttons.push(new settingButton(fb.PlaybackFollowCursor, gdi.Font("Segoe UI Semibold", 14), [col_text1, col_text2, negative(col_text1), accent_colour]));
				break;
			case 4:
				this.buttons.push(new settingButton(SchedulerTxtx2, gdi.Font("Segoe UI Semibold", 14), [col_text1, col_text2, negative(col_text1), accent_colour]));
				break;
			case 5:
				this.buttons.push(new popupButton(SchedulerTxtx1, groupFont, [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg], 30, 0));
				break;
			case 6:
				this.buttons.push(new popupButton(SchedulerTxtAction, groupFont, [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg], 30, 0));
				break;
			case 7:
				this.buttons.push(new popupButton("Activates Equalizer window", groupFont, isEqualizer ? [col_text1, accent_colour, col_text2] : [col_text2, col_text2, col_text2], 0, 30, 0));
				break;
			case 8:
				this.buttons.push(new popupButton(properties.darkTheme ? "Dark" : "Light", groupFont, [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg], 35, 0));
				break;
			}
		}
	}

	this.draw = function (gr) {

		gr.FillSolidRect(this.x + this.delta, this.y, this.w, this.h, properties.darkTheme ? RGB(20, 20, 20) : RGB(250, 250, 250));
		gr.FillSolidRect(this.x + this.delta, this.y, 1, this.h, properties.darkTheme ? RGBA(0, 0, 0, 20) : RGBA(255, 255, 255, 20));

		var plb_y = 45;

		//gr.gdiDrawText("Playback", messageTitleFont2, col_text1, this.x + this.delta + this.margins, this.y + plb_y, this.w, 30, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
		//gr.gdiDrawText("theme", messageTitleFont2, col_text2, this.x + this.delta + this.margins + gr.CalcTextWidth("playback", messageTitleFont2) + 15, this.y + plb_y, this.w, 30, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);

		this.tabButtons[0].draw(gr, this.x + this.delta + this.margins, this.y + plb_y, 255);
		this.tabButtons[1].draw(gr, this.x + this.delta + this.margins + gr.CalcTextWidth("playback", messageTitleFont2) + 15, this.y + plb_y, 255);

		switch (this.tab) {
		case 0:
			plb_y = plb_y + 35 + 30;
			gr.gdiDrawText("Playback order", messageBodyFont2, col_text2, this.x + this.delta + this.margins, this.y + plb_y, this.w, 25, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			this.buttons[0].draw(gr, this.x + this.delta + this.margins, this.y + plb_y + 25, 255);

			plb_y = plb_y + 30 + 45;
			gr.gdiDrawText("Stop after current", messageBodyFont2, col_text2, this.x + this.delta + this.margins, this.y + plb_y, this.w, 25, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			this.buttons[1].draw(gr, this.x + this.delta + this.margins, this.y + plb_y + 30, 255);

			plb_y = plb_y + 30 + 45;
			gr.gdiDrawText("Cursor follows playback", messageBodyFont2, col_text2, this.x + this.delta + this.margins, this.y + plb_y, this.w, 25, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			this.buttons[2].draw(gr, this.x + this.delta + this.margins, this.y + plb_y + 30, 255);

			plb_y = plb_y + 30 + 45;
			gr.gdiDrawText("Playback follows cursor", messageBodyFont2, col_text2, this.x + this.delta + this.margins, this.y + plb_y, this.w, 25, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			this.buttons[3].draw(gr, this.x + this.delta + this.margins, this.y + plb_y + 30, 255);

			plb_y = plb_y + 30 + 45;
			gr.gdiDrawText("Scheduler", messageBodyFont2, col_text2, this.x + this.delta + this.margins, this.y + plb_y, this.w, 25, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			this.buttons[4].draw(gr, this.x + this.delta + this.margins, this.y + plb_y + 30, 255);
			this.buttons[5].draw(gr, this.x + this.delta + this.margins, this.y + plb_y + 30 + 30, 255);
			this.buttons[6].draw(gr, this.x + this.delta + this.margins, this.y + plb_y + 30 + 30 + 30, 255);

			plb_y = plb_y + 90 + 45;
			gr.gdiDrawText("Equalizer", messageBodyFont2, col_text2, this.x + this.delta + this.margins, this.y + plb_y, this.w, 25, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			this.buttons[7].draw(gr, this.x + this.delta + this.margins, this.y + plb_y + 30, 255);

			/*
			if (!Scheduler.timer_started && !Scheduler.counter_started) {
			var text2 = 'Start';

			switch (true) {
			case Scheduler.mode >= 1 && Scheduler.mode <= 10:
			var num = Math.pow(2, Scheduler.mode - 1);
			var text = "After " + num + " tracks played";
			break;
			case Scheduler.mode >= 11 && Scheduler.mode <= 20:
			var num = Math.pow(2, Scheduler.mode - 11);
			var text = "In " + num + " min";
			break;
			}

			} else if (Scheduler.timer_started) {
			var mins = (Scheduler.timeout / 60000 - Math.round(Scheduler.seconds / 60));
			if (mins > 0)
			var text = "In " + Math.round(mins) + " min";
			else
			var text = "Soon";
			var text2 = 'Reset';
			} else if (Scheduler.counter_started) {
			var text = "After " + (Scheduler.counter_limit - Scheduler.counter) + " tracks played";
			var text2 = 'Reset';
			}

			var plb_y = 180;

			gr.gdiDrawText("Scheduler", messageBodyFont2, col_text2, this.x + this.delta + this.margins, this.y + plb_y + 2 + 120, this.w, 25, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);

			gr.gdiDrawText("Off", gdi.Font("Segoe UI Semibold", 14), RGB(0, 0, 0), this.x + this.delta + this.margins, this.y + plb_y + 2 + 115 + 0 + 30, this.w, 25, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			gr.FillSolidRect(this.x + this.delta + this.margins + 100, this.y + plb_y + 115 + 35, 50, 20, RGB(180, 180, 180));
			gr.FillSolidRect(this.x + this.delta + this.margins + 100 + 2, this.y + plb_y + 115 + 35 + 2, 50 - 4, 20 - 4, RGB(255, 255, 255));
			gr.FillSolidRect(this.x + this.delta + this.margins + 100 + 3, this.y + plb_y + 115 + 35 + 3, 50 - 6, 20 - 6, RGB(180, 180, 180));
			gr.FillSolidRect(this.x + this.delta + this.margins + 100, this.y + plb_y + 115 + 35, 12, 20, RGB(0, 0, 0));

			gr.FillSolidRect(this.x + this.delta + this.margins, this.y + plb_y + 180, 260, 35, RGB(190, 190, 190));
			gr.FillSolidRect(this.x + this.delta + this.margins + 2, this.y + plb_y + 180 + 2, 260 - 4, 35 - 4, RGB(255, 255, 255));

			gr.gdiDrawText(text + " " + (Scheduler.st == 0 ? "stop playback" : Scheduler.st == 1 ? "close foobar2000" : Scheduler.st == 2 ? "logoff computer" : Scheduler.st == 3 ? "shutdown computer" : Scheduler.st == 4 ? "restart computer" : ""), gdi.Font("Segoe UI", 14), RGB(0, 0, 0), this.x + this.delta + this.margins + 10, this.y + plb_y + 0 + 180, this.w, 35, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			gr.DrawImage(icons25v35, this.x + this.delta + this.margins + 230, this.y + plb_y + 185, bt_size, bt_size, properties.darkTheme ? 0 : bt_size, bt_size * 18, bt_size, bt_size);

			 */

			//var sh_y = 205;

			//gr.gdiDrawText("Scheduler", gdi.Font("Segoe UI Semibold", 14), RGB(38, 38, 38), this.x + this.delta + 25, this.y + sh_y + 1, this.w, 30, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);

			//toolbar.buttons[10].draw(gr, this.x + this.delta + 25, this.y + sh_y + 85, 255);
			//gr.gdiDrawText(text2, gdi.Font("Segoe UI Semibold", 14), RGB(255, 255, 255), toolbar.buttons[10].x, toolbar.buttons[10].y, toolbar.buttons[10].w, toolbar.buttons[10].h, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			//toolbar.buttons[9].draw(gr, toolbar.buttons[10].x + toolbar.buttons[10].w + 1, toolbar.buttons[10].y, 255);

			//gr.gdiDrawText(text + " " + (Scheduler.st == 0 ? "stop playback" : Scheduler.st == 1 ? "close foobar2000" : Scheduler.st == 2 ? "logoff computer" : Scheduler.st == 3 ? "shutdown computer" : Scheduler.st == 4 ? "restart computer" : ""), messageBodyFont2, col_text2, this.x + this.delta + 25, this.y + sh_y + 47, this.w, 25, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);

			//}

			break;
		case 1:
			plb_y = plb_y + 35 + 30;
			gr.gdiDrawText("Background", messageBodyFont2, col_text2, this.x + this.delta + this.margins, this.y + plb_y, this.w, 25, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			this.buttons[8].draw(gr, this.x + this.delta + this.margins, this.y + plb_y + 25, 255);

			break;
		}

	}

	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	this.checkstate = function (event, x, y, step) {
		this.p_hover = traceMouse(x, y, g_settings.x + g_settings.delta, g_settings.y, g_settings.w, g_settings.h);

		switch (event) {
		case "down":
			if (this.p_hover) {
				if (this.tabButtons.length) {
					for (var i = 0; i < this.tabButtons.length; i++) {
						this.tabButtons[i].checkstate("down", x, y);
					}
				}

				if (this.buttons.length) {
					for (var i = 0; i < this.buttons.length; i++) {
						this.buttons[i].checkstate("down", x, y);
					}
				}
			}
			break;
		case "up":
			if (this.p_hover) {
				for (var i = 0; i < this.tabButtons.length; i++) {
					switch (i) {
					case 0:
						if (this.tabButtons[i].checkstate("up", x, y) == ButtonStates.hover) {
							this.tab = 0;
							this.tabButtons[0].update("", [col_text1, accent_colour, col_text2]);
							this.tabButtons[1].update("", [col_text2, accent_colour, col_text2]);
							this.repaint();
							this.tabButtons[i].state = ButtonStates.hover;
						}
						break;
					case 1:
						if (this.tabButtons[i].checkstate("up", x, y) == ButtonStates.hover) {
							this.tab = 1;
							this.tabButtons[0].update("", [col_text2, accent_colour, col_text2]);
							this.tabButtons[1].update("", [col_text1, accent_colour, col_text2]);
							this.repaint();
							this.tabButtons[i].state = ButtonStates.hover;
						}
						break;
					}
				}
				if (this.tab == 0) {
					for (var i = 0; i < this.buttons.length; i++) {
						switch (i) {
						case 0:
							if (this.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
								playbackOrderMenu(this.buttons[i].x, this.buttons[i].y + this.buttons[i].h);
								this.buttons[i].state = ButtonStates.hover;
							}
							break;
						case 1:
							if (this.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
								fb.StopAfterCurrent = !fb.StopAfterCurrent;
								this.buttons[i].state = ButtonStates.hover;
							}
							break;
						case 2:
							if (this.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
								fb.CursorFollowPlayback = !fb.CursorFollowPlayback;
								this.buttons[i].state = ButtonStates.hover;
							}
							break;
						case 3:
							if (this.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
								fb.PlaybackFollowCursor = !fb.PlaybackFollowCursor;
								this.buttons[i].state = ButtonStates.hover;
							}
							break;
						case 4:
							if (this.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
								if (!Scheduler.timer_started && !Scheduler.counter_started) {
									if (!fb.IsPlaying)
										fb.Play();
									if (Scheduler.mode >= 1 && Scheduler.mode <= 10) {
										CreateCounter();
										Scheduler.m_clicked = 1;
									} else if (Scheduler.mode >= 11 && Scheduler.mode <= 20) {
										SwitchTimer();
										Scheduler.m_clicked = 1;
									}
									fb.trace("Scheduler started");
									g_settings.buttons[4].update(true);
								} else {
									StopTimer();
									StopCounter();
									Scheduler.m_clicked = 0;
									fb.trace("Scheduler reseted");
									g_settings.buttons[4].update(false);
								}
								this.buttons[i].state = ButtonStates.hover;
							}
							break;
						case 5:
							if (this.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
								schedulerModeMenu(this.buttons[i].x, this.buttons[i].y + this.buttons[i].h);
								this.buttons[i].state = ButtonStates.hover;
							}
							break;
						case 6:
							if (this.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
								schedulerActionMenu(this.buttons[i].x, this.buttons[i].y + this.buttons[i].h);
								this.buttons[i].state = ButtonStates.hover;
							}
							break;
						case 7:
							if (this.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
								fb.RunMainMenuCommand("View/Equalizer");
								this.buttons[i].state = ButtonStates.hover;
							}
							break;

						}
					}
				} else {
					for (var i = 0; i < this.buttons.length; i++) {
						switch (i) {
						case 8:
							if (this.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
								var _menu = window.CreatePopupMenu();
								_menu.AppendMenuItem(MF_STRING, 1, "Light");
								_menu.AppendMenuItem(MF_STRING, 2, "Dark");
								_menu.CheckMenuRadioItem(1, 2, properties.darkTheme ? 2 : 1);

								var ret = 0;
								ret = _menu.TrackPopupMenu(x, y);
								switch (ret) {
								case 1:
									window.SetProperty("Dark theme", properties.darkTheme = false);
									break;
								case 2:
									window.SetProperty("Dark theme", properties.darkTheme = true);
									break;
								}
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

								//col_groupBttxt_inactive = properties.darkTheme ? RGB(235, 235, 235) : RGB(34, 34, 34);
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

								//g_info.buttons[6].update(moreTxt, 0);

								_menu.Dispose();

								this.buttons[i].state = ButtonStates.hover;
								return true;
							}
							break;
						}
					}
				}
			}
			break;
		case "wheel":
			break;
		case "move":
			if (this.p_hover) {
				if (this.tabButtons.length) {
					for (var i = 0; i < this.tabButtons.length; i++) {
						if (this.tabButtons[i].checkstate("move", x, y) == ButtonStates.hover);
					}
				}
				if (this.buttons.length) {
					for (var i = 0; i < this.buttons.length; i++) {
						if (this.buttons[i].checkstate("move", x, y) == ButtonStates.hover);
					}
				}
			}
			break;
		case "leave":
			for (var i = 0; i < this.tabButtons.length; i++) {
				this.tabButtons[i].checkstate("leave", 0, 0);
			}
			for (var i = 0; i < this.buttons.length; i++) {
				this.buttons[i].checkstate("leave", 0, 0);
			}
			break;
		}
	}

}

function showSettings() {
	if (!g_settings)
		return;

	if (g_showPLM == false) {
		g_showPLM = true;
		g_settings.show_panel = false;
	} else {
		g_showPLM = false;
		g_settings.show_panel = true;
	}
	Sdrag_timer = true;

	S_time = window.SetInterval(function () {
			if (Sdrag_timer) {
				if (g_showPLM) {
					g_settings.delta += 50;
					if (g_settings.delta > g_settings.w) {
						g_settings.delta = g_settings.w;
						Sdrag_timer = false;
						S_time && window.ClearInterval(S_time);
						S_time = false;
					}
				} else {
					g_settings.delta -= 50;
					if (g_settings.delta < 0) {
						g_settings.delta = 0;
						Sdrag_timer = false;
						S_time && window.ClearInterval(S_time);
						S_time = false;
					}
				}
				Srepaint = true;
			}

			if (Srepaint) {
				g_settings.repaint();
			}
		}, 20);
}
