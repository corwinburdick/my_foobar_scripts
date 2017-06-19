(function on_init() {
	window.SetTimeout(function () {

		window.DlgCode = DLGC_WANTALLKEYS;

		g_plmanager = new playlistPanelObject("g_plmanager");
		g_plmanager.setPlaylistList();
		g_filterbox = new filterBox();
		g_filterbox.inputbox.visible = true;
		g_newPlaylist = new oNewPlaylist();
		g_seekbar = new oSeekbar();
		g_info = new oInfo("g_info");

		set_toolbar_bt();
		check_toolbar_bt();

		g_volume = new oVolume(vol_x, vol_y, vol_w, vol_h);
		g_nowplaying = new oNowPlaying();
		g_queue = new oQueue("g_queue");

	}, 100);

	window.SetTimeout(function () {
		g_browser = new oBrowser("g_browser");
		g_browser.setPlay_bt(50);
		g_imageCache = new image_cache;
		if (artistDisplay_v2) {
			g_artistImageCache = new image_cache;
			g_genreImageCache = new image_cache;
		}
		g_showlist = new showList("g_browser");
		g_scrollbar = new oScrollbar("g_browser");

		g_songs = new oSongs("g_songs");

		on_playback_queue_changed();
		getData(db);

		g_settings = new oSettings();
		g_settings.setButtons();

		on_size();

		CollectGarbage();
		window.Repaint();
	}, 200);
})()

function on_script_unload() {
	if (g_browser) {
		g_browser.g_time && window.ClearInterval(g_browser.g_time);
		g_browser.g_time = false;
	}
}

function on_size() {
	if (!window.Width || !window.Height) {
		return;
	}

	ww = window.Width;
	wh = window.Height;

	Bar_delta = properties.showBottomPanel ? 0 : 55;
	Bar_h = vBar_h - Bar_delta;

	g_plmanager && g_plmanager.setSize(properties.showleftPanel ? 0 : 0 - g_plmanager.w + g_plmanager.delta, 0, pl_w, wh - Bar_h - ((largeNowPlayingArtwork && properties.showBottomPanel && pl_w > 100 && wh > 750) ? pl_w : 0));
	g_songs && g_songs.setSize(properties.showleftPanel ? pl_w : 0, g_browser.headerBarHeight - 10, (ww - (properties.showleftPanel ? pl_w : 0)) > 400 ? (ww - (properties.showleftPanel ? pl_w : 0) - (rightPanel ? rightPanelW : 0)) : 400, wh - g_browser.headerBarHeight - Bar_h + 10);
	g_browser && g_browser.setSize(properties.showleftPanel ? pl_w : 0, g_browser.headerBarHeight, (ww - (properties.showleftPanel ? pl_w : 0)) > 400 ? (ww - (properties.showleftPanel ? pl_w : 0) - (cScrollbar.buttons ? cScrollbar.width : 0) - (rightPanel ? rightPanelW : 0)) : 400, wh - g_browser.headerBarHeight - Bar_h);
	g_scrollbar && g_scrollbar.setSize(ww - cScrollbar.width - (rightPanel ? rightPanelW : 0), g_browser.y - 14, cScrollbar.width, wh - g_browser.y - Bar_h + 14); //  - cScrollbar.width - 1
	g_scrollbar && g_scrollbar.setCursor(g_browser.totalRowsVis * g_browser.rowHeight, g_browser.rowHeight * g_browser.rowsCount + g_showlist.h - Bar_h, scroll_);
	g_nowplaying && g_nowplaying.setSize((properties.showleftPanel ? pl_w : 0) + 40, 40, ww - (properties.showleftPanel ? pl_w : 0) - (rightPanel ? rightPanelW : 0) - 80, ((wh - Bar_h) > q_h ? np_h : wh - Bar_h - 160) - 60);
	g_queue && g_queue.setSize(properties.showleftPanel ? pl_w : 0, (wh - Bar_h) > q_h ? np_h : wh - Bar_h - 160, ww - (properties.showleftPanel ? pl_w : 0) - (rightPanel ? rightPanelW : 0), (wh - Bar_h) > q_h ? wh - Bar_h - np_h : 160);
	g_settings && g_settings.setSize(ww - g_settings.w, 0, g_settings.w, wh - g_settings.y - Bar_h);
	g_info && g_info.setSize(ww - g_info.w, 0, g_info.w, wh - g_info.y - Bar_h);

	cover_y = wh - Bar_h + cover_x;
	bt_play_x = ww - bt_sep * 5 - 35;
	bt_play_y = wh - Bar_h + 22;

	seekbar_y = wh - Bar_h + 30;
	seekbar_w = ww - seekbar_x - 365;
	g_seekbar && g_seekbar.setSize(seekbar_x, seekbar_y, seekbar_w, seekbar_h);

	vol_x = ww - 113;
	vol_y = wh - vol_h - Bar_h - vol_margen_h + vol_margen_y - 0;
	g_volume && g_volume.setSize(vol_x, vol_y, vol_w, vol_h);

}

function on_paint(gr) {
	if (ww == 0 || wh == 0)
		return;

	var ActivePlaylist = plman.ActivePlaylist;

	gr.FillSolidRect(0, 0, ww, wh, col_bg);
	properties.showleftPanel && gr.FillSolidRect(0, 0, pl_w, wh, col_bg_pl);

	g_browser && gr.FillSolidRect(0, 0, ww, wh, g_browser.bgColor);

	// panel playlist
	if (g_plmanager && g_plmanager.isOpened) {
		g_plmanager.draw(gr);
	}

	if (tabActive != "Now_Playing" && g_browser && toolbar.buttons.length) {

		if (lGroup != "Songs") {
			if (draw_immediately ? true : g_browser.ok)
				g_browser.draw(gr);
			else
				gr.GdiDrawText("Loading...", gdi.Font("Segoe UI", 18), col_text2, g_browser.x, g_browser.y - 35, g_browser.w, g_browser.h - 50, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);

			if (!g_browser.ok && returnedPos) {
				gr.FillSolidRect(g_browser.x, g_browser.y - 35, g_browser.w, g_browser.h + 35, setAlpha(g_browser.bgColor, 255));
				gr.GdiDrawText("Loading...", gdi.Font("Segoe UI", 18), col_text1, g_browser.x, g_browser.y - 35, g_browser.w, g_browser.h - 50, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);
			}
		} else {
			g_songs.draw(gr);
		}

		// Top bg
		gr.FillSolidRect(g_browser.x, 0, g_browser.w + cScrollbar.width, g_browser.headerBarHeight - 14, g_browser.bgColor);

		// Playlist Name
		var pl_name = plman.GetPlaylistName(fb.ActivePlaylist);
		var old_pl_name = plman.GetPlaylistName(old_pl_selection);
		var select_pl_active = pl_name.substr(0, 20) == "Playlist Selection [" ? true : false;

		var lGroup_sep = 2;
		var bt_col_i = properties.darkTheme ? RGB(16, 16, 16) : col_groupBtBg_inactive; //properties.darkTheme ? RGB(16, 16, 16) : col_groupBtBg_inactive;
		var tpl_name_y = 45;
		var bt_group_y = showTopPlName ? pl_y : marginL;
		var btsM = 20;

		if (select_pl_active) {
			var plt_x = g_browser.x + marginL + (properties.showleftPanel ? 0 : 45);
			var pltText_x = g_browser.x + marginL + (properties.showleftPanel ? 50 : 50 + 45);

			if (showTopPlName) {
				toolbar.buttons[20].draw(gr, plt_x, tpl_name_y + 5, 255);

				var plText = filter_text != "" ? ('Results for "' + filter_text + '"') : select_pl_active ? pl_name.substr(20, pl_name.length - 21) : pl_name;
				var title_text_w = gr.CalcTextWidth(plText, plTextFont);
				gr.gdiDrawText(plText, plTextFont, col_text1, pltText_x, tpl_name_y, g_browser.w - 40, g_browser.h, DT_LEFT | DT_TOP | DT_NOPREFIX | DT_END_ELLIPSIS);
				/*
				var t_iCount = plman.PlaylistItemCount(ActivePlaylist);
				var t_songs = t_iCount == 0 ? "Empty" : t_iCount > 1 ? t_iCount + " songs" : t_iCount + "song";
				gr.gdiDrawText(t_songs, gdi.Font("Segoe UI", 12), col_text2, pltText_x, tpl_name_y + 30, 200, 35, drawTextFormat2);
				 */

				if (fb.PlaylistItemCount(ActivePlaylist) > 0) {
					toolbar.buttons[12].draw(gr, pltText_x + 0 + title_text_w + btsM, tpl_name_y + 4, 255);
					toolbar.buttons[13].draw(gr, pltText_x + 0 + title_text_w + btsM + toolbar.buttons[12].w + 7, tpl_name_y + 4, 255);
					toolbar.buttons[14].draw(gr, ww, wh, 255);
				}

				// Group
				if (lGroup == "Albums") {
					gr.FillSolidRect(plt_x, bt_group_y, toolbar.buttons[15].w, toolbar.buttons[15].h, accent_colour);
					gr.FillSolidRect(plt_x + toolbar.buttons[15].w + lGroup_sep, bt_group_y, toolbar.buttons[18].w, toolbar.buttons[18].h, bt_col_i);
				} else if (lGroup == "Songs") {
					gr.FillSolidRect(plt_x, bt_group_y, toolbar.buttons[15].w, toolbar.buttons[15].h, bt_col_i);
					gr.FillSolidRect(plt_x + toolbar.buttons[15].w + lGroup_sep, bt_group_y, toolbar.buttons[18].w, toolbar.buttons[18].h, accent_colour);
				}
				toolbar.buttons[15].draw(gr, plt_x, bt_group_y, 255);
				gr.GdiDrawText("Albums", groupFont, lGroup == "Albums" ? RGB(255, 255, 255) : col_groupBttxt_inactive, toolbar.buttons[15].x, toolbar.buttons[15].y, toolbar.buttons[15].w, toolbar.buttons[15].h, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
				toolbar.buttons[18].draw(gr, toolbar.buttons[15].x + toolbar.buttons[15].w + lGroup_sep, bt_group_y, 255);
				gr.GdiDrawText("Songs", groupFont, lGroup == "Songs" ? RGB(255, 255, 255) : col_groupBttxt_inactive, toolbar.buttons[18].x, toolbar.buttons[18].y, toolbar.buttons[18].w, toolbar.buttons[18].h, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);

			} else {
				toolbar.buttons[20].draw(gr, plt_x, tpl_name_y + 10, 255);

				plt_x = g_browser.x + marginL + (properties.showleftPanel ? 0 : 45) + 50;

				// Group
				if (lGroup == "Albums") {
					gr.FillSolidRect(plt_x, bt_group_y, toolbar.buttons[15].w, toolbar.buttons[15].h, accent_colour);
					gr.FillSolidRect(plt_x + toolbar.buttons[15].w + lGroup_sep, bt_group_y, toolbar.buttons[18].w, toolbar.buttons[18].h, bt_col_i);
				} else if (lGroup == "Songs") {
					gr.FillSolidRect(plt_x, bt_group_y, toolbar.buttons[15].w, toolbar.buttons[15].h, bt_col_i);
					gr.FillSolidRect(plt_x + toolbar.buttons[15].w + lGroup_sep, bt_group_y, toolbar.buttons[18].w, toolbar.buttons[18].h, accent_colour);
				}
				toolbar.buttons[15].draw(gr, plt_x, bt_group_y, 255);
				gr.GdiDrawText("Albums", groupFont, lGroup == "Albums" ? RGB(255, 255, 255) : col_groupBttxt_inactive, toolbar.buttons[15].x, toolbar.buttons[15].y, toolbar.buttons[15].w, toolbar.buttons[15].h, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
				toolbar.buttons[18].draw(gr, toolbar.buttons[15].x + toolbar.buttons[15].w + lGroup_sep, bt_group_y, 255);
				gr.GdiDrawText("Songs", groupFont, lGroup == "Songs" ? RGB(255, 255, 255) : col_groupBttxt_inactive, toolbar.buttons[18].x, toolbar.buttons[18].y, toolbar.buttons[18].w, toolbar.buttons[18].h, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			}

			toolbar.buttons[16].draw(gr, ww, wh, 0);
			toolbar.buttons[17].draw(gr, ww, wh, 0);

			// Sort
			var sort_x1 = toolbar.buttons[15].x + toolbar.buttons[15].w + toolbar.buttons[18].w + lGroup_sep + 25;
			toolbar.buttons[19].draw(gr, sort_x1, bt_group_y, 255);

			// Sort Direction
			var sort_x3 = toolbar.buttons[15].x + toolbar.buttons[15].w + toolbar.buttons[18].w + lGroup_sep + 15 + toolbar.buttons[19].w + 15;
			toolbar.buttons[23].draw(gr, sort_x3, bt_group_y, 255);

			if (g_browser.w > 500)
				if (lGroup != "Songs") {
					var t_albums_draw = g_browser.albums_draw.length;
					var t_albums = t_albums_draw > 1 ? " albums" : " album";
					var t_artists = t_albums_draw > 1 ? " artists" : " artists";
					var t_genres = t_albums_draw > 1 ? " genres" : " genre";
					var t_iCount = plman.PlaylistItemCount(ActivePlaylist);
					var t_songs = t_iCount > 1 ? t_iCount + " songs" : t_iCount + "song";
					if (!g_library_to_reload && t_iCount) {
						var total_count_txt = (lGroup == "Songs" ? t_songs : t_albums_draw + ((properties.TFgrouping == groupByArtist) ? t_artists : (properties.TFgrouping == groupByGenre) ? t_genres : t_albums));
						if (g_browser.ok)
							gr.gdiDrawText(total_count_txt, groupFont, col_text2, sort_x3 + toolbar.buttons[23].w + 15, bt_group_y, 200, toolbar.buttons[19].h, drawTextFormat2);
						else
							gr.gdiDrawText("Loading...", groupFont, col_text2, sort_x3 + toolbar.buttons[23].w + 15, bt_group_y, 200, toolbar.buttons[19].h, drawTextFormat2);
					}
				} else {
					var t_iCount = plman.PlaylistItemCount(ActivePlaylist);
					var t_songs = t_iCount > 1 ? t_iCount + " songs" : "empty";
					gr.gdiDrawText(t_songs, groupFont, col_text2, sort_x3 + toolbar.buttons[23].w + 15, bt_group_y, 200, toolbar.buttons[19].h, drawTextFormat2);
				}

		} else {

			var plt_x = g_browser.x + marginL;
			var pltText_x = g_browser.x + marginL + (properties.showleftPanel ? 0 : 45);

			if (showTopPlName) {
				var plText = filter_text != "" ? ('Results for "' + filter_text + '"') : select_pl_active ? old_pl_name : pl_name;
				var title_text_w = gr.CalcTextWidth(plText, plTextFont);
				gr.gdiDrawText(plText, plTextFont, g_browser.fgColor, pltText_x, tpl_name_y, g_browser.w - 40, 35, drawTextFormat2);
				/*
				if ("Favorites" != plman.GetPlaylistName(fb.ActivePlaylist)) {
				var t_iCount = plman.PlaylistItemCount(ActivePlaylist);
				var t_songs = t_iCount == 0 ? "Empty" : t_iCount > 1 ? t_iCount + " songs" : t_iCount + "song";
				gr.gdiDrawText(seconds, gdi.Font("Segoe UI", 12), col_text2, pltText_x, tpl_name_y + 30, 200, 35, drawTextFormat2);
				}
				 */

				// Play/Add
				if (fb.PlaylistItemCount(ActivePlaylist) > 0) {
					toolbar.buttons[12].draw(gr, pltText_x + title_text_w + btsM, tpl_name_y + 4, 255);
					if ("Collection" != plman.GetPlaylistName(fb.ActivePlaylist) && "Favorites" != plman.GetPlaylistName(fb.ActivePlaylist)) {
						toolbar.buttons[13].draw(gr, pltText_x + title_text_w + btsM + toolbar.buttons[12].w + 7, tpl_name_y + 4, 255);
						toolbar.buttons[22].draw(gr, pltText_x + title_text_w + btsM + toolbar.buttons[12].w + 7 + toolbar.buttons[13].w + 7, tpl_name_y + 4, 255);
						toolbar.buttons[14].draw(gr, pltText_x + title_text_w + btsM + toolbar.buttons[12].w + 7 + toolbar.buttons[13].w + 7 + toolbar.buttons[22].w + 7, tpl_name_y + 4, 255);
					}
				} else if ("Collection" != plman.GetPlaylistName(fb.ActivePlaylist) && "Favorites" != plman.GetPlaylistName(fb.ActivePlaylist)) {
					toolbar.buttons[12].draw(gr, ww, wh, 0);
					toolbar.buttons[13].draw(gr, ww, wh, 0);
					toolbar.buttons[22].draw(gr, pltText_x + title_text_w + btsM, tpl_name_y + 4, 255);
					toolbar.buttons[14].draw(gr, pltText_x + title_text_w + btsM + toolbar.buttons[12].w + 7, tpl_name_y + 4, 255);
				}
			}

			if (g_browser.w > 800) {

				// Groups
				if (lGroup == "Albums") {
					gr.FillSolidRect(plt_x, bt_group_y, toolbar.buttons[15].w, toolbar.buttons[15].h, accent_colour);
					gr.FillSolidRect(plt_x + toolbar.buttons[15].w + lGroup_sep, bt_group_y, toolbar.buttons[16].w, toolbar.buttons[16].h, bt_col_i);
					gr.FillSolidRect(plt_x + toolbar.buttons[15].w + toolbar.buttons[16].w + lGroup_sep * 2, bt_group_y, toolbar.buttons[17].w, toolbar.buttons[17].h, bt_col_i);
					gr.FillSolidRect(plt_x + toolbar.buttons[15].w + toolbar.buttons[16].w + toolbar.buttons[17].w + lGroup_sep * 3, bt_group_y, toolbar.buttons[18].w, toolbar.buttons[18].h, bt_col_i);
				} else if (lGroup == "Artists") {
					gr.FillSolidRect(plt_x, bt_group_y, toolbar.buttons[15].w, toolbar.buttons[15].h, bt_col_i);
					gr.FillSolidRect(plt_x + toolbar.buttons[15].w + lGroup_sep, bt_group_y, toolbar.buttons[16].w, toolbar.buttons[16].h, accent_colour);
					gr.FillSolidRect(plt_x + toolbar.buttons[15].w + toolbar.buttons[16].w + lGroup_sep * 2, bt_group_y, toolbar.buttons[17].w, toolbar.buttons[17].h, bt_col_i);
					gr.FillSolidRect(plt_x + toolbar.buttons[15].w + toolbar.buttons[16].w + toolbar.buttons[17].w + lGroup_sep * 3, bt_group_y, toolbar.buttons[18].w, toolbar.buttons[18].h, bt_col_i);
				} else if (lGroup == "Genres") {
					gr.FillSolidRect(plt_x, bt_group_y, toolbar.buttons[15].w, toolbar.buttons[15].h, bt_col_i);
					gr.FillSolidRect(plt_x + toolbar.buttons[15].w + lGroup_sep, bt_group_y, toolbar.buttons[16].w, toolbar.buttons[16].h, bt_col_i);
					gr.FillSolidRect(plt_x + toolbar.buttons[15].w + toolbar.buttons[16].w + lGroup_sep * 2, bt_group_y, toolbar.buttons[17].w, toolbar.buttons[17].h, accent_colour);
					gr.FillSolidRect(plt_x + toolbar.buttons[15].w + toolbar.buttons[16].w + toolbar.buttons[17].w + lGroup_sep * 3, bt_group_y, toolbar.buttons[18].w, toolbar.buttons[18].h, bt_col_i);
				} else if (lGroup == "Songs") {
					gr.FillSolidRect(plt_x, bt_group_y, toolbar.buttons[15].w, toolbar.buttons[15].h, bt_col_i);
					gr.FillSolidRect(plt_x + toolbar.buttons[15].w + lGroup_sep, bt_group_y, toolbar.buttons[16].w, toolbar.buttons[16].h, bt_col_i);
					gr.FillSolidRect(plt_x + toolbar.buttons[15].w + toolbar.buttons[16].w + lGroup_sep * 2, bt_group_y, toolbar.buttons[17].w, toolbar.buttons[17].h, bt_col_i);
					gr.FillSolidRect(plt_x + toolbar.buttons[15].w + toolbar.buttons[16].w + toolbar.buttons[17].w + lGroup_sep * 3, bt_group_y, toolbar.buttons[18].w, toolbar.buttons[18].h, accent_colour);
				}
				toolbar.buttons[15].draw(gr, plt_x, bt_group_y, 255);
				gr.GdiDrawText("Albums", groupFont, lGroup == "Albums" ? RGB(255, 255, 255) : col_groupBttxt_inactive, toolbar.buttons[15].x, toolbar.buttons[15].y, toolbar.buttons[15].w, toolbar.buttons[15].h, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
				toolbar.buttons[16].draw(gr, toolbar.buttons[15].x + toolbar.buttons[15].w + lGroup_sep, bt_group_y, 255);
				gr.GdiDrawText("Artists", groupFont, lGroup == "Artists" ? RGB(255, 255, 255) : col_groupBttxt_inactive, toolbar.buttons[16].x, toolbar.buttons[16].y, toolbar.buttons[16].w, toolbar.buttons[16].h, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
				toolbar.buttons[17].draw(gr, toolbar.buttons[15].x + toolbar.buttons[15].w + toolbar.buttons[16].w + lGroup_sep * 2, bt_group_y, 255);
				gr.GdiDrawText("Genres", groupFont, lGroup == "Genres" ? RGB(255, 255, 255) : col_groupBttxt_inactive, toolbar.buttons[17].x, toolbar.buttons[17].y, toolbar.buttons[17].w, toolbar.buttons[17].h, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
				toolbar.buttons[18].draw(gr, toolbar.buttons[15].x + toolbar.buttons[15].w + toolbar.buttons[16].w + toolbar.buttons[17].w + lGroup_sep * 3, bt_group_y, 255);
				gr.GdiDrawText("Songs", groupFont, lGroup == "Songs" ? RGB(255, 255, 255) : col_groupBttxt_inactive, toolbar.buttons[18].x, toolbar.buttons[18].y, toolbar.buttons[18].w, toolbar.buttons[18].h, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);

				// Sort
				var sort_x2 = toolbar.buttons[15].x + toolbar.buttons[15].w + toolbar.buttons[16].w + toolbar.buttons[17].w + toolbar.buttons[18].w + lGroup_sep * 3 + 25;
				toolbar.buttons[19].draw(gr, sort_x2, bt_group_y, 255);

				// Sort Direction
				var sort_x4 = toolbar.buttons[15].x + toolbar.buttons[15].w + toolbar.buttons[16].w + toolbar.buttons[17].w + toolbar.buttons[18].w + lGroup_sep * 3 + 15 + toolbar.buttons[19].w + 15;
				toolbar.buttons[23].draw(gr, sort_x4, bt_group_y, 255);

				toolbar.buttons[29].draw(gr, ww, wh, 255);

			} else {

				// Groups
				toolbar.buttons[15].draw(gr, ww, wh, 255);
				toolbar.buttons[16].draw(gr, ww, wh, 255);
				toolbar.buttons[17].draw(gr, ww, wh, 255);
				toolbar.buttons[18].draw(gr, ww, wh, 255);
				toolbar.buttons[29].draw(gr, plt_x - 10, bt_group_y, 255);

				// Sort
				var sort_x2 = toolbar.buttons[29].x + toolbar.buttons[29].w + 15;
				toolbar.buttons[19].draw(gr, sort_x2, bt_group_y, 255);

				// Sort Direction
				var sort_x4 = toolbar.buttons[19].x + toolbar.buttons[19].w + 15;
				toolbar.buttons[23].draw(gr, sort_x4, bt_group_y, 255);

			}

			if (g_browser.w > 600)
				if (lGroup != "Songs") {
					var t_albums_draw = g_browser.albums_draw.length;
					var t_albums = t_albums_draw > 1 ? " albums" : " album";
					var t_artists = t_albums_draw > 1 ? " artists" : " artists";
					var t_genres = t_albums_draw > 1 ? " genres" : " genre";
					var t_iCount = plman.PlaylistItemCount(ActivePlaylist);
					var t_songs = t_iCount > 1 ? t_iCount + " songs" : t_iCount + "song";
					if (!g_library_to_reload && t_iCount) {
						var total_count_txt = (lGroup == "Songs" ? t_songs : t_albums_draw + ((properties.TFgrouping == groupByArtist) ? t_artists : (properties.TFgrouping == groupByGenre) ? t_genres : t_albums));
						if (g_browser.ok)
							gr.gdiDrawText(total_count_txt, groupFont, col_text2, sort_x4 + toolbar.buttons[23].w + 15, bt_group_y, 200, toolbar.buttons[19].h, drawTextFormat2);
						else
							gr.gdiDrawText("Loading...", groupFont, col_text2, sort_x4 + toolbar.buttons[23].w + 15, bt_group_y, 200, toolbar.buttons[19].h, drawTextFormat2);
					}
				} else {
					var t_iCount = plman.PlaylistItemCount(ActivePlaylist);
					var t_songs = t_iCount > 1 ? t_iCount + " songs" : "empty";
					gr.gdiDrawText(t_songs, groupFont, col_text2, sort_x4 + toolbar.buttons[23].w + 15, bt_group_y, 200, toolbar.buttons[19].h, drawTextFormat2);
				}

		}

		// library empty
		if (plman.PlaylistItemCount(ActivePlaylist) == 0) {
			var px = g_browser.x + marginL;
			var py = g_browser.y;
			gr.FillSolidRect(g_browser.x, py - 16, g_browser.w + cScrollbar.width, g_browser.h + 16, g_browser.bgColor); //properties.darkTheme ? RGB(45, 45, 45) : RGB(250, 250, 250));
			if (ActivePlaylist == 0) {
				gr.gdiDrawText("Your Media Library is empty (no music found). Click panel to configure the Media Library", messageTitleFont, col_text1, px, py, g_browser.w - marginL * 2, g_browser.h, DT_LEFT | DT_TOP | DT_CALCRECT | DT_TOP | DT_WORDBREAK | DT_NOPREFIX);
			} else {
				gr.gdiDrawText("It's lonely in here. Click panel to add files or drag some tracks here.", messageTitleFont, col_text1, px, py, g_browser.w - marginL * 2, g_browser.h, DT_LEFT | DT_TOP | DT_CALCRECT | DT_TOP | DT_WORDBREAK | DT_NOPREFIX);
			}
		} else if (filter_text != "" && !g_browser.albums_draw.length) {
			var px = g_browser.x + marginL;
			var py = g_browser.y;
			gr.gdiDrawText("Sorry, we've got no results to show.", messageTitleFont, col_text1, px, py, g_browser.w - marginL * 2, g_browser.h, DT_LEFT | DT_TOP | DT_CALCRECT | DT_TOP | DT_WORDBREAK | DT_NOPREFIX);
		}

		// dragging
		if (wsh_dragging) {
			gr.FillSolidRect(g_browser.x, g_browser.y - 15, g_browser.w + cScrollbar.width, g_browser.h + 15, setAlpha(col_bg, 210));
			if (properties.showscrollbar && g_scrollbar && g_browser.rowsCount > 0 && (g_browser.rowsCount + Math.round(g_showlist.delta) > g_browser.totalRowsVis))
				gr.FillSolidRect(ww - cScrollbar.width, 0, cScrollbar.width, g_browser.y, setAlpha(col_bg, 210));

			gr.GdiDrawText(fb.IsAutoPlaylist(ActivePlaylist) ? "This is an autoplaylist, you can't add songs here" : "Add to " + plman.GetPlaylistName(ActivePlaylist), messageTitleFont, col_text1, g_browser.x + marginL, g_browser.y, g_browser.w - marginL * 2 + cScrollbar.width, g_browser.h, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_TOP | DT_WORDBREAK | DT_NOPREFIX);
		}

		// scrollbar
		if (lGroup != "Songs") { //(draw_immediately ? true : g_browser.ok))
			if (!g_plmanager.isOpened || g_plmanager.side == "left") {
				if (properties.showscrollbar && g_scrollbar && g_browser.rowsCount > 0 && (g_browser.rowsCount + Math.round(g_showlist.delta) > g_browser.totalRowsVis)) {
					g_scrollbar.visible = true;
					g_scrollbar.draw(gr);
				} else {
					g_scrollbar.visible = false;
				}
			}
		}

		if (toolbar.buttons[30] && tabActive == "Collection" && "Favorites" == plman.GetPlaylistName(fb.ActivePlaylist) || (plman.GetPlaylistName(fb.ActivePlaylist).substr(0, 20) == "Playlist Selection [") && "Favorites" == plman.GetPlaylistName(old_pl_selection))
			toolbar.buttons[30].draw(gr, g_browser.x + g_browser.w - toolbar.buttons[30].w, bt_group_y, 255);
		else
			toolbar.buttons[30] && toolbar.buttons[30].draw(gr, ww, wh, 0);

		// Selections
		if (popup_selections) {
			var npl_files = plman.GetPlaylistSelectedItems(ActivePlaylist);
			if (npl_files.Count > 0 && ((!show_volume && !g_settings.show_panel && g_settings.delta == g_settings.w) || rightPanel)) {
				npl_deletebtn = fb.IsAutoPlaylist(ActivePlaylist) ? 0 : 1;
				npl_shufflebtn = npl_files.Count > 1 ? 1 : 0;
				npl_totalbtns = 4 + npl_deletebtn + npl_shufflebtn;

				gr.FillSolidRect(g_browser.x + g_browser.w - 38 * npl_totalbtns - 10 - 3, g_browser.y + g_browser.h - 40 - 10, 38 * npl_totalbtns + 3, 40, RGBA(0, 0, 0, 140)); //col_bg_bar
				gr.FillSolidRect(g_browser.x + g_browser.w - 38 * npl_totalbtns - 10 - 2, g_browser.y + g_browser.h - 40 - 10 + 1, 38, 38, accent_colour);
				gr.GdiDrawText(npl_files.Count, gdi.Font("Segoe UI", 15, 1), RGB(255, 255, 255), g_browser.x + g_browser.w - 38 * npl_totalbtns - 10 - 2, g_browser.y + g_browser.h - 40 - 10, 38, 38, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);

				for (var i = 0; i < toolbar.buttons.length; i++) {
					switch (i) {
					case 24:
						// play
						toolbar.buttons[i].draw(gr, g_browser.x + g_browser.w - 38 * (npl_totalbtns - 1) - 10 - 1, g_browser.y + g_browser.h - 40 - 10 + 1, 255);
						break;
					case 25:
						// add
						toolbar.buttons[i].draw(gr, g_browser.x + g_browser.w - 38 * (npl_totalbtns - (npl_shufflebtn ? 3 : 2)) - 10 - 1, g_browser.y + g_browser.h - 40 - 10 + 1, 255);
						break;
					case 26:
						// delete
						npl_deletebtn && toolbar.buttons[i].draw(gr, g_browser.x + g_browser.w - 38 * (npl_totalbtns - (npl_shufflebtn ? 4 : 3)) - 10 - 1, g_browser.y + g_browser.h - 40 - 10 + 1, 255);
						break;
					case 27:
						// shuffle
						npl_shufflebtn && toolbar.buttons[i].draw(gr, g_browser.x + g_browser.w - 38 * (npl_totalbtns - 2) - 10 - 1, g_browser.y + g_browser.h - 40 - 10 + 1, 255);
						break;
					case 28:
						// clear
						toolbar.buttons[i].draw(gr, g_browser.x + g_browser.w - 38 * 1 - 10 - 1, g_browser.y + g_browser.h - 40 - 10 + 1, 255);
						break;
					}
				}
			}
		} else {
			for (var i = 24; i < 28; i++) {
				toolbar.buttons[i].draw(gr, ww, wh, 0);
			}
		}

	} else if (tabActive == "Now_Playing") {
		g_nowplaying && g_nowplaying.draw(gr);
		g_queue && g_queue.draw(gr);

	}

	// Properties
	if (rightPanel) {
		g_info && g_info.draw(gr);
	}

	if (toolbar.buttons.length) {
		if (properties.showleftPanel)
			toolbar.buttons[4].draw(gr, (pl_w < 100) ? 23 : pl_w - 54, 45, 255); // // (pl_w < 100) ? 23 : 27
		else
			toolbar.buttons[4].draw(gr, 33, 36, 255);
	}

	// Menu
	toolbar.buttons[21] && toolbar.buttons[21].draw(gr, ww - toolbar.buttons[21].w, 4, 255);

	//g_settings && g_settings.show_panel && gr.FillSolidRect(0, 0, ww, wh, RGBA(0, 0, 0, 130));
	g_settings && g_settings.draw(gr);

	// Bottom Bar
	gr.FillSolidRect(0, wh - Bar_h, ww, Bar_h, col_bg_bar);
	if (properties.showBottomPanel) {
		if (toolbar.buttons.length) {
			if (largeNowPlayingArtwork && pl_w > 100 && wh > 750 && properties.showleftPanel) {
				gr.FillSolidRect(0, wh - Bar_h - pl_w, pl_w, pl_w, col_searchBox_bg); //blendColors(col_bg_bar, col_bg_pl, 0.7));
				if (fb.IsPlaying || fb.IsPaused) {
					if (b_cover_img) {
						if (cover.raw_bitmap)
							//gr.GdiAlphaBlend(b_cover_img, cover_x, cover_y, CoverSize, CoverSize, 0, 0, CoverSize, CoverSize, 250);
							draw_Bitmap(gr, b_cover_img, largeNowPlayingArtworkX, wh - pl_w + largeNowPlayingArtworkX * 1 - Bar_h, pl_w - largeNowPlayingArtworkX * 2, pl_w - largeNowPlayingArtworkX * 2, "centre", 0);
						else
							draw_image(gr, b_cover_img, largeNowPlayingArtworkX, wh - pl_w + largeNowPlayingArtworkX * 1 - Bar_h, pl_w - largeNowPlayingArtworkX * 2, pl_w - largeNowPlayingArtworkX * 2, "centre", 0, 0, 255);
					} else
						gr.DrawImage(mediaMissingArtist, largeNowPlayingArtworkX + Math.round((pl_w - largeNowPlayingArtworkX * 2 - mediaMissingArtist.Width) / 2), wh - pl_w + largeNowPlayingArtworkX - Bar_h + Math.round((pl_w - largeNowPlayingArtworkX * 2 - mediaMissingArtist.Height) / 2), mediaMissingArtist.Width, mediaMissingArtist.Height, 0, 0, mediaMissingArtist.Width, mediaMissingArtist.Height, 0, 100);

					gr.GdiDrawText(g_title, barTextFont, col_bar_title, largeNowPlayingArtworkX + 0, cover_y + 8, pl_deafult_w - 30, 25, DT_LEFT | DT_CALCRECT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);
					gr.GdiDrawText(g_artist, barTextFont2, col_bar_artist, largeNowPlayingArtworkX + 0, cover_y + 8 + gr.CalcTextHeight(g_title, barTextFont) + 3, pl_deafult_w - 30, 25, DT_LEFT | DT_CALCRECT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);

					if (g_seekbar.w > 70)
						g_seekbar && g_seekbar.draw(gr);

					//gr.DrawImage(icons_mood, pl_deafult_w - 45, cover_y + 15, 27, 27, 0 , 27 * (g_mood == 1 ? 4 : g_mood == 2 ? 5 : 3), 27, 27);
				}
			} else {
				if (fb.IsPlaying || fb.IsPaused) {
					//if (fb.IsPlaying || fb.IsPaused)
					//draw_image(gr, b_cover_img2, cover_x + CoverSize, cover_y, pl_deafult_w - cover_x * 2 - CoverSize, Bar_h - cover_x * 2 , "crop", 5, 0, 50);

					if (b_cover_img) {
						gr.FillSolidRect(cover_x, cover_y, CoverSize, CoverSize, RGB(54, 54, 54));

						if (cover.raw_bitmap)
							//gr.GdiAlphaBlend(b_cover_img, cover_x, cover_y, CoverSize, CoverSize, 0, 0, CoverSize, CoverSize, 250);
							draw_Bitmap(gr, b_cover_img, cover_x, cover_y, CoverSize, CoverSize, "centre", 0);
						else
							draw_image(gr, b_cover_img, cover_x, cover_y, CoverSize, CoverSize, "centre", 0, 0, 255);
					} else
						gr.DrawImage(mediaMissingArtist, cover_x + Math.round((CoverSize - 40) / 2), cover_y + Math.round((CoverSize - 40) / 2), 40, 40, 0, 0, mediaMissingArtist.Width, mediaMissingArtist.Height, 0, 100);

					gr.GdiDrawText(g_title, barTextFont, col_bar_title, cover_x + CoverSize + 15, cover_y + 8, pl_deafult_w - cover_x - CoverSize - 30, 25, DT_LEFT | DT_CALCRECT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);
					gr.GdiDrawText(g_artist, barTextFont2, col_bar_artist, cover_x + CoverSize + 15, cover_y + 8 + gr.CalcTextHeight(g_title, barTextFont) + 3, pl_deafult_w - cover_x - CoverSize - 30, 25, DT_LEFT | DT_CALCRECT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);

					if (g_seekbar.w > 70)
						g_seekbar && g_seekbar.draw(gr);

				}
			}

			for (var i = 0; i < toolbar.buttons.length; i++) {
				switch (i) {
				case 0:
					// Play bt
					if (fb.PlaylistItemCount((fb.IsPlaying || fb.IsPaused) ? plman.PlayingPlaylist : ActivePlaylist) > 0)
						toolbar.buttons[i].draw(gr, ww - 265, bt_play_y - 1, 255);
					else
						gr.DrawImage(play_on, ww - 265, bt_play_y - 1, play_on.Width, play_on.Height, 0, 0, play_on.Width, play_on.Height, 0, 150);
					break;
				case 1 && 2:
					// Prev/Next bt
					if (fb.PlaylistItemCount(plman.PlayingPlaylist) > 1 ? !fb.IsPlaying && !fb.IsPaused : true) {
						gr.DrawImage(next_on, ww - 200 - 5, bt_play_y - 1, next_on.Width, next_on.Height, 0, 0, next_on.Width, next_on.Height, 0, 150);
						gr.DrawImage(prev_on, ww - 330 + 5, bt_play_y - 1, prev_on.Width, prev_on.Height, 0, 0, prev_on.Width, prev_on.Height, 0, 150);
					} else {
						toolbar.buttons[1].draw(gr, ww - 200 - 5, bt_play_y - 1, 255);
						toolbar.buttons[2].draw(gr, ww - 330 + 5, bt_play_y - 1, 255);
					}
					break;
				case 3:
					// Volume
					toolbar.buttons[i].draw(gr, ww - 137 - 5, bt_play_y, 255);
					g_volume.draw(gr);
					break;
				case 4:

					break;
				case 7:
					// Cover
					if (fb.IsPlaying || fb.IsPaused)
						toolbar.buttons[i].draw(gr, 10, wh - Bar_h + 10, 255);
					break;
				case 8:
					toolbar.buttons[i].draw(gr, ww - 59, bt_play_y, 255);
					break;
					/*
					case 11:
					// hide bPanel
					g_browser && toolbar.buttons[i].draw(gr, g_browser.x + g_browser.w, g_browser.y + g_browser.h - cScrollbar.width, 255);
					gr.FillSolidRect(toolbar.buttons[i].x, toolbar.buttons[i].y, toolbar.buttons[i].w, toolbar.buttons[i].h, properties.darkTheme ? RGBA(255, 255, 255, 30) : RGBA(200, 200, 200, 60));
					break;
					 */
				}
			}

		}

	}

	// dragged
	if (g_browser && tabActive != "Now_Playing" && lGroup != "Songs") {
		g_browser.dragged(gr);
	}

	// New Playlist
	if (NewPlaylistDialog) {
		g_newPlaylist.draw(gr);
	}

	// Grid
	if (properties.showGrid) {
		for (i = 0; i < 150; i++) {
			px = 10;
			py = 10;
			gr.FillSolidRect(px * i, 0, 1, wh, RGBA(0, 200, 255, 100));
			gr.FillSolidRect(0, py * i, ww, 1, RGBA(0, 200, 255, 100));
			px = 5;
			py = 5;
			gr.FillSolidRect(px * i, 0, 1, wh, RGBA(150, 150, 150, 50));
			gr.FillSolidRect(0, py * i, ww, 1, RGBA(150, 150, 150, 50));
		}
		for (i = 1; i < 6; i++) {
			px = 10;
			py = 10;
			bt_xw = 25;
			btH = 35;
			btsep = 30;
			gr.FillSolidRect(ww - bt_xw - btH * i - btsep * (i - 1), wh - btH - 15, btH, btH, RGBA(0, 205, 255, 150));
		}
	}

	// Loading
	if (show_anim) {
		gr.FillSolidRect(0, 0, ww, wh, RGB(34, 34, 34));

		gr.GdiDrawText("foobar2000", gdi.Font("Segoe UI", 25), RGB(250, 250, 250), 0, wh - Math.round((wh + anim_img[anim_n].Height) / 2) - 50, ww, 30, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);
		//gr.GdiDrawText("Fusion", gdi.Font("Segoe UI", 12), RGB(150, 150, 150), 0, wh - Math.round((wh + anim_img[anim_n].Height) / 2) - 40, ww, 30, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);

		gr.DrawImage(anim_img[anim_n], ww - Math.round((ww + anim_img[anim_n].Width) / 2), wh - Math.round((wh + anim_img[anim_n].Height - 20) / 2), anim_img[anim_n].Width, anim_img[anim_n].Height, 0, 0, anim_img[anim_n].Width, anim_img[anim_n].Height, 0, 255);
	}

}

// on mouse

function on_mouse_lbtn_down(x, y) {

	if (wsh_dragging)
		return true;

	if (g_newPlaylist && NewPlaylistDialog) {
		g_newPlaylist.on_mouse("lbtn_down", x, y);
		return true;
	}

	// inputBox
	if (g_filterbox && g_filterbox.inputbox.visible) {
		g_filterbox.on_mouse("lbtn_down", x, y);
	}

	g_plmanager && g_plmanager.checkstate("down", x, y);

	if (tabActive == "Now_Playing")
		g_queue && g_queue.checkstate("down", x, y);

	g_info && g_info.checkstate("down", x, y);

	g_seekbar && g_seekbar.checkstate("down", x, y);

	g_volume && show_volume && g_volume.checkstate("down", x, y);
	if (show_volume && hover_volume)
		return true;

	if (g_settings && g_settings.show_panel && g_settings.p_hover) {
		g_settings.checkstate("down", x, y, 0);
		return true;
	}

	if (toolbar.buttons.length) {
		// bar
		for (var i = 0; i < 12; i++) {
			toolbar.buttons[i].checkstate("down", x, y);
		}
		// preferences
		toolbar.buttons[21].checkstate("down", x, y);
	}

	if (tabActive == "Now_Playing")
		return true;

	// Playlist Groups/Sort
	if (toolbar.buttons.length)
		for (var i = 12; i < 24; i++) {
			if (toolbar.buttons[i].checkstate("down", x, y) == ButtonStates.down)
				return true;
		}

	// Popup
	if (toolbar.buttons.length && popup_selections)
		for (var i = 24; i < toolbar.buttons.length; i++) {
			if (toolbar.buttons[i].checkstate("down", x, y) == ButtonStates.down)
				return true;
		}

	if (lGroup == "Songs") {
		g_songs && g_songs.checkstate("down", x, y);
		return true;
	}

	if (hover_toolbar)
		return true;

	g_browser && g_browser.on_mouse("lbtn_down", x, y);

	if (g_showlist && g_showlist.idx > -1) {
		g_showlist.close_bt.checkstate("down", x, y);
	}

	// check showList Tracks
	if (g_showlist && g_showlist.idx > -1 && g_ishover) {
		if (g_showlist.columns[0]) {
			for (var r = 0; r < g_showlist.columns[0].rows.length; r++) {
				g_showlist.columns[0].rows[r].check("down", x, y);
			}
		}
	}

	// check scrollbar
	if (properties.showscrollbar && g_scrollbar && g_browser.rowsCount > 0 && (g_browser.rowsCount + Math.round(g_showlist.delta) > g_browser.totalRowsVis)) {
		g_scrollbar.check("down", x, y);
	}

	// check scrollbar scroll on click above or below the cursor
	if (g_scrollbar && g_scrollbar.hover && !g_scrollbar.cursorDrag && g_browser) {
		var scrollstep = g_browser.totalRowsVis;
		if (y < g_scrollbar.cursorPos) {
			if (!g_browser.buttonclicked && !cScrollbar.timerID1) {
				g_browser.buttonclicked = true;
				on_mouse_wheel(1 * scrollstep);
				cScrollbar.timerID1 = window.SetTimeout(function () {
						on_mouse_wheel(1 * scrollstep);
						cScrollbar.timerID1 && window.ClearTimeout(cScrollbar.timerID1);
						cScrollbar.timerID1 = false;
						cScrollbar.timerID2 && window.ClearInterval(cScrollbar.timerID2);
						cScrollbar.timerID2 = window.SetInterval(function () {
								if (g_scrollbar.hover) {
									if (m_x > g_scrollbar.x && g_scrollbar.cursorPos > m_y) {
										on_mouse_wheel(1 * scrollstep);
									}
								}
							}, 60);
					}, 400);
			}
		} else {
			if (!g_browser.buttonclicked && !cScrollbar.timerID1) {
				g_browser.buttonclicked = true;
				on_mouse_wheel(-1 * scrollstep);
				cScrollbar.timerID1 = window.SetTimeout(function () {
						on_mouse_wheel(-1 * scrollstep);
						cScrollbar.timerID1 && window.ClearTimeout(cScrollbar.timerID1);
						cScrollbar.timerID1 = false;
						cScrollbar.timerID2 && window.ClearInterval(cScrollbar.timerID2);
						cScrollbar.timerID2 = window.SetInterval(function () {
								if (g_scrollbar.hover) {
									if (m_x > g_scrollbar.x && g_scrollbar.cursorPos + g_scrollbar.cursorHeight < m_y) {
										on_mouse_wheel(-1 * scrollstep);
									}
								}
							}, 60);
					}, 400);
			}
		}
	}

}

function on_mouse_lbtn_up(x, y) {
	var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

	if (wsh_dragging)
		return;

	if (g_newPlaylist && NewPlaylistDialog) {
		g_newPlaylist.on_mouse("lbtn_up", x, y);
		return true;
	}

	g_plmanager && g_plmanager.checkstate("up", x, y);

	if (tabActive == "Now_Playing")
		g_queue && g_queue.checkstate("up", x, y);

	g_info && g_info.checkstate("up", x, y);

	g_seekbar && g_seekbar.checkstate("up", x, y);

	// Vol
	if (g_volume && show_volume) {
		g_volume.checkstate("up", x, y);
		if (hover_volume)
			return true;
	}

	// options
	if (g_settings && g_settings.show_panel && g_settings.p_hover) {
		g_settings.checkstate("up", x, y, 0);
		return true;
	}

	if (toolbar.buttons.length)
		for (var i = 0; i < toolbar.buttons.length; i++) {
			switch (i) {
			case 0:
				// Play
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					if (toolbar.stopped) {
						toolbar.stopped = false;
					} else {
						fb.PlayOrPause();
					}
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			case 1:
				// Next
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					if (toolbar.randomize) {
						toolbar.randomize = false;
					} else {
						fb.Next();
					}
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			case 2:
				// Prev
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					if (toolbar.randomize) {
						toolbar.randomize = false;
					} else {
						fb.Prev();
					}
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			case 3:
				// Volume Button
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					show_volume = !show_volume;
					window.RepaintRect(vol_x - vol_margen_x - 2, vol_y - vol_margen_y - 2, vol_w + vol_margen_w + 4, vol_h + vol_margen_h + 4);

					if (g_settings && g_settings.show_panel) {
						g_settings.show_panel = false;
						g_settings.delta = 350;
						g_settings.repaint();
					}
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			case 4:
				// Playlist Manager
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					if (CtrlKeyPressed) {
						window.SetProperty("Show left panel", properties.showleftPanel = !properties.showleftPanel);
						g_showlist.idx = -1;
						g_showlist.h = 0;
						g_showlist.rowIdx = -1;
						g_showlist.delta = 0;
						g_showlist.delta_ = 0;
						on_size();
						if (largeNowPlayingArtwork)
							getData(fb.GetNowPlaying());
					} else {
						if (properties.showleftPanel) {
							g_showlist.idx = -1;
							g_showlist.h = 0;
							g_showlist.rowIdx = -1;
							g_showlist.delta = 0;
							g_showlist.delta_ = 0;
							switchPlM();
						} else {
							window.SetProperty("Show left panel", properties.showleftPanel = !properties.showleftPanel);
							g_showlist.idx = -1;
							g_showlist.h = 0;
							g_showlist.rowIdx = -1;
							g_showlist.delta = 0;
							g_showlist.delta_ = 0;
							on_size();
							if (largeNowPlayingArtwork)
								getData(fb.GetNowPlaying());
						}
					}

					window.Repaint();
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			case 7:
				// Cover
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					tabActive = "Collection";
					filter_text = "";

					if (properties.TFgrouping != groupByAlbum) {
						window.SetProperty("Group active", lGroup = "Albums");
						window.SetProperty("Library Group TitleFormat", properties.TFgrouping = groupByAlbum);
						window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByAlbum);
						on_size();
						g_browser.populate(false);
					}

					if (plman.ActivePlaylist != plman.PlayingPlaylist)
						plman.ActivePlaylist = plman.PlayingPlaylist;
					else
						seek_track(fb.GetNowPlaying());
					//
					//if (properties.TFgrouping != groupByAlbum)
					//	on_size();
					//else
					window.Repaint();
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			case 8:
				// Playback Options
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					g_settings && showSettings();
					if (show_volume) {
						show_volume = false;
						window.RepaintRect(vol_x - vol_margen_x - 2, vol_y - vol_margen_y - 2, vol_w + vol_margen_w + 4, vol_h + vol_margen_h + 4);
					}
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			case 11:
				// Hide Bottom panel
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					window.SetProperty("Show bottom panel", properties.showBottomPanel = !properties.showBottomPanel);
					on_size();
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			case 21:
				// Preferences
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					MenuFull(toolbar.buttons[i].x + toolbar.buttons[i].w, toolbar.buttons[i].y + toolbar.buttons[i].h);
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			}
		}

	if (show_volume && !hover_volume && (!v_drag || !m_drag)) {
		v_drag = m_drag = false;
		show_volume = false;
		window.RepaintRect(vol_x - vol_margen_x - 2, vol_y - vol_margen_y - 2, vol_w + vol_margen_w + 4, vol_h + vol_margen_h + 4);
	}

	if (g_settings && g_settings.show_panel && !g_settings.p_hover && (!v_drag || !m_drag)) {
		v_drag = m_drag = false;
		showSettings();
	}

	if (tabActive == "Now_Playing")
		return true;

	if (toolbar.buttons.length)
		for (var i = 12; i < toolbar.buttons.length; i++) {
			switch (i) {
			case 12:
				// Play
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					if (fb.PlaylistItemCount(plman.ActivePlaylist) > 0) {
						//fb.RunContextCommandWithMetadb("Play", g_browser.albums_draw[0].metadb);
						if (fb.IsPlaying)
							fb.Stop();
						if (plman.IsPlaybackQueueActive())
							plman.FlushPlaybackQueue();
						fb.RunContextCommandWithMetadb("Add to playback queue", plman.GetPlaylistItems(plman.ActivePlaylist));
						fb.Play();
					}
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			case 13:
				// Add
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					if (fb.PlaylistItemCount(plman.ActivePlaylist) > 0)
						add_menu(toolbar.buttons[i].x, toolbar.buttons[i].y + toolbar.buttons[i].h + 0, plman.GetPlaylistItems(plman.ActivePlaylist), 0);
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			case 22:
				// edit
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					fb.ActivePlaylist = plman.ActivePlaylist;
					npl_type = 2;
					NewPlaylistDialog = true;
					g_newPlaylist.inputbox.text = plman.GetPlaylistName(plman.ActivePlaylist);
					g_newPlaylist.inputbox.ishover = true;
					g_newPlaylist.inputbox.drag = false;
					g_newPlaylist.inputbox.edit = true;
					g_newPlaylist.inputbox.Cpos = g_newPlaylist.inputbox.GetCPos(x);
					g_newPlaylist.inputbox.anchor = g_newPlaylist.inputbox.Cpos;
					g_newPlaylist.inputbox.resetCursorTimer();
					g_newPlaylist.inputbox.dblclk = true;
					g_newPlaylist.inputbox.SelBegin = 0;
					g_newPlaylist.inputbox.SelEnd = g_newPlaylist.inputbox.text.length;
					g_newPlaylist.inputbox.text_selected = g_newPlaylist.inputbox.text;
					g_newPlaylist.inputbox.select = true;
					window.Repaint();
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			case 14:
				// Edit
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					fb.RemovePlaylist(plman.ActivePlaylist);
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			case 15:
				// G Albums
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					window.SetProperty("Group active", lGroup = "Albums");
					window.SetProperty("Library Group TitleFormat", properties.TFgrouping = groupByAlbum);
					window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByAlbum);
					toolbar.buttons[19].update("Sort by album", [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg]);
					toolbar.buttons[29].update(lGroup, 0);
					filter_text = "";
					g_showlist.idx = g_showlist.rowIdx = -1;
					g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
					returnedPos = false;
					g_browser.populate(false);
					window.Repaint();
					on_size();
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			case 16:
				// G Artists
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					window.SetProperty("Group active", lGroup = "Artists");
					window.SetProperty("Library Group TitleFormat", properties.TFgrouping = groupByArtist);
					window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByArtist);
					toolbar.buttons[19].update("Sort by artist", [col_text2, col_text2, col_text2], [dropDownImg, dropDownImg, dropDownImg]);
					toolbar.buttons[29].update(lGroup, 0);
					filter_text = "";
					g_showlist.idx = g_showlist.rowIdx = -1;
					g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
					returnedPos = false;
					g_browser.populate(false);
					//window.Repaint();
					on_size();
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			case 17:
				// G Genres
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					window.SetProperty("Group active", lGroup = "Genres");
					window.SetProperty("Library Group TitleFormat", properties.TFgrouping = groupByGenre);
					window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByGenre);
					toolbar.buttons[19].update("Sort by genre", [col_text2, col_text2, col_text2], [dropDownImg, dropDownImg, dropDownImg]);
					toolbar.buttons[29].update(lGroup, 0);
					filter_text = "";
					g_showlist.idx = g_showlist.rowIdx = -1;
					g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
					returnedPos = false;
					g_browser.populate(false);
					//window.Repaint();
					on_size();
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			case 18:
				// G Songs
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					window.SetProperty("Group active", lGroup = "Songs");
					//window.SetProperty("Library Group TitleFormat", properties.TFgrouping = groupByGenre);
					window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByAlbum);
					toolbar.buttons[19].update("Sort by album", [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg]);
					toolbar.buttons[29].update(lGroup, 0);
					filter_text = "";
					g_showlist.idx = g_showlist.rowIdx = -1;
					g_showlist.h = g_showlist.delta = g_showlist.delta_ = 0;
					g_browser.populate(false);
					window.Repaint();
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			case 19:
				// Sort
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					if (properties.TFgrouping == groupByAlbum || lGroup == "Songs")
						sort_menu(toolbar.buttons[i].x, toolbar.buttons[i].y + toolbar.buttons[i].h);
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			case 20:
				// Back
				if (plman.GetPlaylistName(fb.ActivePlaylist).substr(0, 20) == "Playlist Selection [") {
					if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
						window.SetProperty("Group active", lGroup = oldlGroup);
						window.SetProperty("Library Group TitleFormat", properties.TFgrouping = old_group_selection);
						window.SetProperty("Library Sort TitleFormat", properties.TFsorting = old_sort_selection);
						filter_text = "";
						g_showlist.idx = -1;
						g_showlist.h = 0;
						g_showlist.rowIdx = -1;
						g_showlist.delta = 0;
						g_showlist.delta_ = 0;
						returnedPos = true;

						plman.ActivePlaylist = old_pl_selection;
						//window.Repaint();
						on_size();
						toolbar.buttons[i].state = ButtonStates.hover;
						return;
					}
				}
				break;
			case 23:
				// Sort Direction
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					sortDirection_menu(toolbar.buttons[i].x, toolbar.buttons[i].y + toolbar.buttons[i].h);
					toolbar.buttons[i].state = ButtonStates.hover;
					return;
				}
				break;
			case 24:
				if (popup_selections)
					if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {

						if (fb.IsPlaying)
							fb.Stop();
						fb.RunContextCommandWithMetadb("Play", plman.GetPlaylistSelectedItems(plman.ActivePlaylist));
						if (plman.IsPlaybackQueueActive()) {
							plman.FlushPlaybackQueue();
						}
						fb.RunContextCommandWithMetadb("Add to playback queue", plman.GetPlaylistSelectedItems(plman.ActivePlaylist));
						fb.Play();
						toolbar.buttons[i].state = ButtonStates.hover;
						return;
					}
				break;
			case 25:
				if (popup_selections)
					if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
						add_menu(toolbar.buttons[i].x, toolbar.buttons[i].y, plman.GetPlaylistSelectedItems(plman.ActivePlaylist), 0);
						toolbar.buttons[i].state = ButtonStates.hover;
						return;
					}
				break;
			case 26:
				if (popup_selections)
					if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
						var activeList = plman.ActivePlaylist;
						if (!fb.IsAutoPlaylist(activeList)) {
							plman.RemovePlaylistSelection(activeList, false);
						}
						toolbar.buttons[i].state = ButtonStates.hover;
						return;
					}
				break;
			case 27:
				if (popup_selections)
					if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
						if (fb.IsPlaying)
							fb.Stop();
						if (plman.IsPlaybackQueueActive()) {
							plman.FlushPlaybackQueue();
						}
						fb.RunContextCommandWithMetadb("Add to playback queue", shuffleItems(plman.GetPlaylistSelectedItems(plman.ActivePlaylist), "%title%"));
						plman.ClearPlaylistSelection(plman.ActivePlaylist);
						fb.Play();
						toolbar.buttons[i].state = ButtonStates.hover;
						return;
					}
				break;
			case 28:
				if (popup_selections)
					if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
						plman.ClearPlaylistSelection(plman.ActivePlaylist);
						toolbar.buttons[i].state = ButtonStates.hover;
						return;
					}
				break;
			case 29:
				if (popup_selections)
					if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
						group_menu(toolbar.buttons[i].x, toolbar.buttons[i].y + toolbar.buttons[i].h);
						return;
					}
				break;
			case 30:
				if (toolbar.buttons[i].checkstate("up", x, y) == ButtonStates.hover) {
					favoritesMenu(toolbar.buttons[i].x, toolbar.buttons[i].y + toolbar.buttons[i].h);
					return;
				}
				break;
			}
		}

	if (lGroup == "Songs") {
		g_songs && g_songs.checkstate("up", x, y);
		return true;
	}

	if (g_browser && g_scrollbar && g_showlist && !g_dragA && !g_dragR) {
		// set new showlist from selected index to expand and scroll it!
		if (properties.expandInPlace && y > g_browser.headerBarHeight) {
			if (x < g_browser.x + g_browser.w && g_browser.activeIndex > -1) {
				if (g_browser.clicked_id == g_browser.activeIndex) {
					// Selected Albums
					if (CtrlKeyPressed) {
						var activeList = plman.ActivePlaylist;
						var playlist = g_browser.albums_draw[g_browser.activeIndex];
						var selectedIndexes = [];

						//npl_files = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);

						for (var l = playlist.trackIndex; l < (playlist.trackIndex + playlist.pl.Count); l++) {
							if (plman.IsPlaylistItemSelected(plman.ActivePlaylist, l)) {
								IDIsSelected = plman.IsPlaylistItemSelected(activeList, l);
							} else {
								IDIsSelected = null;
							}
						}
						//plman.ClearPlaylistSelection(activeList);
						plman.SetPlaylistFocusItemByHandle(activeList, playlist.pl.Item(0));
						for (var id = playlist.trackIndex; id < (playlist.trackIndex + playlist.pl.Count); id++) {
							selectedIndexes.push(id);
						}
						plman.SetPlaylistSelection(activeList, selectedIndexes, true);
						plman.SetPlaylistFocusItemByHandle(activeList, playlist.pl.Item(0));
					} else {
						// Create a playlist selection in other playlist
						if (properties.TFgrouping == groupByArtist || properties.TFgrouping == groupByGenre) {
							var playlist = g_browser.albums_draw[g_browser.activeIndex].pl;

							repaint_main = false;
							repaint_f = false;
							repaintforced = true;

							// Recorded position
							//returnedPos = true;
							scrollOld = scroll;
							scrollOld_ = scroll_;

							// force to no scroll if only one line of items
							if (g_browser.albums_draw.length <= g_browser.totalColumns) {
								scroll = 0;
								scroll_ = 0;
							}

							// set size of new showList of the selected album
							var playlist = g_browser.albums_draw[g_browser.activeIndex].pl;
							/*g_showlist.calcHeight(playlist, g_browser.activeIndex);
							g_showlist.setColumns(g_browser.activeIndex);
							var showList_nbRows = Math.round(g_showlist.h / g_browser.rowHeight * 100) / 100;
							var showList_h = Math.round(showList_nbRows * g_browser.rowHeight);
							 */
							g_hiddenLoadTimer && window.ClearTimeout(g_hiddenLoadTimer);
							g_hiddenLoadTimer = false;
							g_showlist.idx = -1;
							g_showlist.h = 0;
							g_showlist.rowIdx = -1;
							g_showlist.delta = 0;
							g_showlist.delta_ = 0;

							old_group_selection = properties.TFgrouping;
							old_sort_selection = properties.TFsorting;

							if (properties.TFgrouping == groupByArtist) {
								name = fb.TitleFormat("$if2(%album artist%,'Unknown Artist')").EvalWithMetadb(g_browser.albums_draw[g_browser.activeIndex].metadb);
								window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByYear);
							} else if (properties.TFgrouping == groupByGenre) {
								name = fb.TitleFormat("$if2(%genre%,'Unknown Genre')").EvalWithMetadb(g_browser.albums_draw[g_browser.activeIndex].metadb);
								window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByArtist);
							}

							oldlGroup = lGroup;
							window.SetProperty("Group active", lGroup = "Albums");
							window.SetProperty("Library Group TitleFormat", properties.TFgrouping = groupByAlbum);

							apply_playlist(playlist, name);
							on_size();
						} else {
							//g_browser.selected = +g_browser.activeIndex;
							if (g_browser.activeIndex != g_showlist.idx) {
								if (g_showlist.idx < 0) {
									if (g_browser.albums_draw[g_browser.activeIndex].y - g_browser.y > 2) {
										scroll = scroll + (g_browser.albums_draw[g_browser.activeIndex].y - g_browser.y);
									}
								} else {
									if (g_browser.activeRow > g_showlist.rowIdx) {
										scroll = scroll - g_showlist.h;
										scroll_ = scroll_ - g_showlist.h;
										scroll = scroll + (g_browser.albums_draw[g_browser.activeIndex].y - g_browser.y);
									} else if (g_browser.activeRow < g_showlist.rowIdx)
										scroll = scroll + (g_browser.albums_draw[g_browser.activeIndex].y - g_browser.y);
								}

								// force to no scroll if only one line of items
								if (g_browser.albums_draw.length <= g_browser.totalColumns) {
									scroll = 0;
									scroll_ = 0;
								}

								// set size of new showList of the selected album
								var playlist = g_browser.albums_draw[g_browser.activeIndex].pl;
								g_showlist.calcHeight(playlist, g_browser.activeIndex);
								g_showlist.setColumns(g_browser.activeIndex);
								var showList_nbRows = Math.round(g_showlist.h / g_browser.rowHeight * 100) / 100;
								var showList_h = Math.round(showList_nbRows * g_browser.rowHeight);
							}

							if (g_showlist.idx < 0) {
								if (g_showlist.close_bt)
									g_showlist.close_bt.state = ButtonStates.normal;
								g_showlist.reset(g_browser.activeIndex, g_browser.activeRow, showList_nbRows, showList_h);
							} else if (g_showlist.idx == g_browser.activeIndex) {
								g_showlist.idx = -1;
								g_showlist.h = 0;
							} else {
								g_showlist.close_bt.state = ButtonStates.normal;
								//g_showlist.delta_ = 0;
								g_showlist.reset(g_browser.activeIndex, g_browser.activeRow, showList_nbRows, showList_h);
							}
						}
					}

					g_scrollbar.setCursor(g_browser.totalRowsVis * g_browser.rowHeight, g_browser.rowHeight * g_browser.rowsCount + g_showlist.h, scroll_);
					g_browser.repaint();
				}
			}
		}

		// check button to execute action
		if (g_showlist && g_showlist.idx > -1) {
			if (g_showlist.close_bt.checkstate("up", x, y) == ButtonStates.hover) {
				g_showlist.idx = -1;
				g_showlist.h = 0;
				g_showlist.close_bt.state = ButtonStates.normal;
			}
		}

		// scrollbar scrolls up and down RESET
		if (g_browser && cScrollbar) {
			g_browser.buttonclicked = false;
			cScrollbar.timerID1 && window.ClearTimeout(cScrollbar.timerID1);
			cScrollbar.timerID1 = false;
			cScrollbar.timerID2 && window.ClearTimeout(cScrollbar.timerID2);
			cScrollbar.timerID2 = false;
		}

		// check scrollbar
		if (properties.showscrollbar && g_scrollbar && g_browser.rowsCount > 0 && (g_browser.rowsCount + Math.round(g_showlist.delta) > g_browser.totalRowsVis))
			g_scrollbar.check("up", x, y);

		// inputBox
		if (g_filterbox && g_filterbox.inputbox.visible)
			g_filterbox.on_mouse("lbtn_up", x, y);

	}

	// check showList Tracks
	if (g_showlist && g_showlist.idx > -1 && g_ishover)
		if (g_showlist.columns[0])
			for (var r = 0; r < g_showlist.columns[0].rows.length; r++) {
				g_showlist.columns[0].rows[r].check("up", x, y);
			}

	if (g_browser) {
		g_browser.on_mouse("lbtn_up", x, y);
		g_browser.repaint();
	}

}

function on_mouse_lbtn_dblclk(x, y, mask) {

	if (g_newPlaylist && NewPlaylistDialog) {
		g_newPlaylist.on_mouse("lbtn_dblclk", x, y);
		return;
	}

	g_plmanager && g_plmanager.checkstate("lbtn_dblclk", x, y);

	if (tabActive == "Now_Playing")
		g_queue && g_queue.checkstate("lbtn_dblclk", x, y);

	g_info && g_info.checkstate("lbtn_dblclk", x, y);

	if (toolbar.buttons.length) {
		// Stop
		if (fb.IsPlaying && toolbar.button_lbtn_dblclk_stop)
			if (toolbar.buttons[0].state == ButtonStates.hover) {
				fb.Stop();
				toolbar.stopped = true;
				return;
			}

		// Play Random
		if ((plman.PlaylistItemCount(plman.ActivePlaylist) > 0 || plman.GetPlaybackQueueCount() > 0) && toolbar.button_lbtn_dblclk_random)
			if (toolbar.buttons[1].state == ButtonStates.hover || toolbar.buttons[2].state == ButtonStates.hover) {
				fb.Random();
				toolbar.randomize = true;
				return;
			}

		if (toolbar.buttons[4].state == ButtonStates.hover) {

			window.SetProperty("Show left panel", properties.showleftPanel = false);
			g_showlist.idx = -1;
			g_showlist.h = 0;
			g_showlist.rowIdx = -1;
			g_showlist.delta = 0;
			g_showlist.delta_ = 0;
			on_size();

			if (largeNowPlayingArtwork)
				getData(fb.GetNowPlaying());

			window.Repaint();
			return;
		}
	}

	if (hover_toolbar && !properties.showBottomPanel) {
		window.SetProperty("Show bottom panel", properties.showBottomPanel = !properties.showBottomPanel);
		on_size();
		window.Repaint();
		return;
	}

	if (tabActive == "Now_Playing")
		return true;

	if (lGroup == "Songs") {
		g_songs && g_songs.checkstate("lbtn_dblclk", x, y);
		return true;
	}

	if (g_browser)
		g_browser.on_mouse("lbtn_dblclk", x, y);

	// check showList Tracks
	if (g_showlist && g_showlist.idx > -1 && g_ishover)
		if (g_showlist.columns[0])
			for (var r = 0; r < g_showlist.columns[0].rows.length; r++) {
				g_showlist.columns[0].rows[r].check("dblclk", x, y);
			}

	if (g_browser && g_scrollbar && x > g_browser.x + g_browser.w) {
		// check scrollbar
		if (properties.showscrollbar && g_scrollbar && g_browser.rowsCount > 0 && (g_browser.rowsCount + Math.round(g_showlist.delta) > g_browser.totalRowsVis)) {
			g_scrollbar.check("dblclk", x, y);
			if (g_scrollbar.hover)
				on_mouse_lbtn_down(x, y); // ...to have a scroll response on double clicking scrollbar area above or below the cursor!
		}
	}

}

function on_mouse_rbtn_down(x, y, mask) {
	if (g_newPlaylist && NewPlaylistDialog) {
		g_newPlaylist.on_mouse("rbtn_down", x, y);
		return true;
	}

	// inputBox
	if (g_filterbox && g_filterbox.inputbox.visible)
		g_filterbox.on_mouse("rbtn_down", x, y);

	if (tabActive == "Now_Playing")
		return true;

	if (lGroup == "Songs")
		return true;

	if (g_browser && !g_dragA && !g_dragR && y < wh - Bar_h && g_plmanager && !g_plmanager.ishover && g_ishover)
		g_browser.on_mouse("rbtn_down", x, y);

}

function on_mouse_rbtn_up(x, y) {
	if (NewPlaylistDialog) {
		return true;
	}

	if (g_plmanager && g_plmanager.ishover) {
		g_plmanager.checkstate("rbtn_up", x, y);
		return true;
	}

	if (g_queue && g_queue.ishover) {
		g_queue.checkstate("rbtn_up", x, y);
		return true;
	}

	if (tabActive == "Now_Playing")
		return true;

	if (lGroup == "Songs") {
		g_songs && g_songs.checkstate("rbtn_up", x, y);
		return true;
	}

	if (g_settings && g_settings.show_panel && g_settings.p_hover)
		return true;

	if (show_volume && hover_volume)
		return true;

	if (g_browser && !g_dragA && !g_dragR && y < wh - Bar_h && g_ishover) {
		browser_menu(x, y);
	}

	return true;
}

function on_mouse_mbtn_up(x, y, mask) {
	if (g_plmanager && g_plmanager.ishover) {
		g_plmanager.checkstate("mbtn_up", x, y);
	}
}

function on_mouse_wheel(step) {

	if (NewPlaylistDialog) {
		return;
	}

	if ((show_volume && hover_volume)) {
		g_volume.checkstate("wheel", m_x, m_y, step);
		return true;
	}

	if (g_seekbar && g_seekbar.ishover) {
		g_seekbar.wheel(step);
		return true;
	}

	if (g_plmanager && g_plmanager.ishover) {
		// inputBox
		if (!g_dragA)
			if (g_filterbox.inputbox.visible && g_filterbox.inputbox.edit) {
				g_filterbox.on_mouse("wheel", m_x, m_y, step);
				//return true;
			}

		g_plmanager.checkstate("wheel", m_x, m_y, step);
		return true;
	}

	if (tabActive == "Now_Playing") {
		if (g_queue && (g_queue.ishover || g_queue.scrollbar.isHoverScrollbar)) {
			g_queue && g_queue.checkstate("wheel", m_x, m_y, step);
			return true;
		}
	}

	if (g_info && (g_info.ishover || g_info.scrollbar.isHoverScrollbar)) {
		g_info && g_info.checkstate("wheel", m_x, m_y, step);
		return true;
	}

	if (tabActive == "Now_Playing")
		return true;

	if (lGroup == "Songs") {
		g_songs && g_songs.checkstate("wheel", m_x, m_y, step);
		return true;
	}

	if (g_settings && g_settings.show_panel && g_settings.p_hover)
		return true;

	if (utils.IsKeyPressed(VK_CONTROL)) {
		g_scroll_rows = Math.round(scroll / g_browser.rowHeight);
		if (lGroup == "Artists" || lGroup == "Genres") {
			properties.artistthumbnailWidthMin += step * 20;
			if (properties.artistthumbnailWidthMin < 120)
				properties.artistthumbnailWidthMin = 120;
			if (properties.artistthumbnailWidthMin > 250)
				properties.artistthumbnailWidthMin = 250;
			window.SetProperty("Artist thumbnails minimal width", properties.artistthumbnailWidthMin);
		} else {
			properties.thumbnailWidthMin += step * 20;
			if (properties.thumbnailWidthMin < 120)
				properties.thumbnailWidthMin = 120;
			if (properties.thumbnailWidthMin > 250)
				properties.thumbnailWidthMin = 250;
			window.SetProperty("Thumbnails minimal width", properties.thumbnailWidthMin);
		}
		on_size();
		return;
	}

	if (g_scrollbar && !g_dragA) {
		if (utils.IsKeyPressed(VK_SHIFT)) {}
		else {
			scroll -= step * g_browser.rowHeight;
			scroll = check_scroll(scroll);
			g_scrollbar.setCursor(g_browser.totalRowsVis * g_browser.rowHeight, g_browser.rowHeight * g_browser.rowsCount + g_showlist.h, scroll_);
			//	g_browser.y = 105;
			//g_browser.H = wh -g_browser.y-Bar_h;
		}
	}
	g_step = step;
}

function on_mouse_move(x, y) {

	mouse_x = x;
	mouse_y = y;

	m_x = x;
	m_y = y;

	//m_x, m_y

	//if (x == m_x && y == m_y && !g_dragA)
	//	return;

	if (wsh_dragging)
		return;

	if (g_newPlaylist && NewPlaylistDialog) {
		g_newPlaylist.on_mouse("move", x, y);
		return;
	}

	g_plmanager && g_plmanager.checkstate("move", x, y);

	if (tabActive == "Now_Playing")
		g_queue && g_queue.checkstate("move", x, y);

	g_info && g_info.checkstate("move", x, y);

	g_seekbar && g_seekbar.checkstate("move", x, y);

	hover_volume = traceMouse(x, y, vol_x - vol_margen_x, vol_y - vol_margen_y, vol_w + vol_margen_w, vol_h + vol_margen_h);
	hover_toolbar = traceMouse(x, y, 0, wh - Bar_h, ww, Bar_h);

	g_settings && g_settings.checkstate("move", x, y);

	/*
	hoverPLButtons = traceMouse(x, y, ww - 310, 60, 260, 50);
	var tmp = showPLButtons;
	if (hoverPLButtons)
	showPLButtons = true;
	else
	showPLButtons = false;
	if (tmp != showPLButtons)
	window.Repaint();
	 */

	g_volume && g_volume.checkstate("move", x, y);

	if (toolbar.buttons.length) {
		for (var i = 0; i < 12; i++) {
			if (toolbar.buttons[i].checkstate("move", x, y) == ButtonStates.hover);
		}

		if (tabActive == "Now_Playing")
			return true;

		for (var i = 12; i < toolbar.buttons.length; i++) {
			if (toolbar.buttons[i].checkstate("move", x, y) == ButtonStates.hover);
		}
	}

	if (lGroup == "Songs") {
		g_songs && g_songs.checkstate("move", x, y);
		return true;
	}

	if ((hover_toolbar | (show_volume && hover_volume) | (g_settings && g_settings.show_panel && g_settings.p_hover)) && !g_dragA && !g_dragR) {
		g_ishover = false;
	} else {
		g_ishover = (x > 0 && x < ww && y > 0 && y < wh);
		m_x = x;
		m_y = y;
	}

	// check showList Tracks
	if (g_showlist && g_browser && g_scrollbar) {
		if (g_showlist.idx > -1 && g_ishover) {
			if (g_showlist.columns[0]) {
				for (var r = 0; r < g_showlist.columns[0].rows.length; r++) {
					g_showlist.columns[0].rows[r].check("move", x, y);
				}
			}

			if (traceMouse(x, y, Math.floor(g_showlist.delta_ < (g_showlist.marginTop + g_showlist.marginBot) ? 0 : g_showlist.delta_ - (g_showlist.marginTop + g_showlist.marginBot))))
				return true;
		}

		g_ishover && g_browser.on_mouse("move", x, y);

		if (!g_dragA && !g_dragR) {
			// buttons
			if (g_showlist.idx > -1) {
				g_showlist.close_bt.checkstate("move", x, y);
			}

			// check scrollbar
			if (properties.showscrollbar && g_scrollbar && g_browser.rowsCount > 0 && (g_browser.rowsCount + Math.round(g_showlist.delta) > g_browser.totalRowsVis))
				g_scrollbar.check("move", x, y);
		}

		//if dragging ouot of the panel limits, repaint to clear the dragged cover
		if (!g_ishover)
			g_browser.repaint();
	}

}

function on_mouse_leave() {

	g_plmanager && g_plmanager.checkstate("leave", 0, 0);

	g_queue && g_queue.checkstate("leave", 0, 0);

	g_info && g_info.checkstate("leave", 0, 0);

	// Seekbar leave
	g_seekbar && g_seekbar.checkstate("leave");

	// Playback
	for (var i = 0; i < toolbar.buttons.length; i++) {
		toolbar.buttons[i].checkstate("leave", 0, 0);
	}

	if (tabActive == "Now_Playing")
		return true;

	if (lGroup == "Songs")
		return true;

	if (properties.showscrollbar && g_scrollbar && g_browser.rowsCount > 0 && (g_browser.rowsCount + Math.round(g_showlist.delta) > g_browser.totalRowsVis)) {
		g_scrollbar.check("leave", 0, 0);
	}

	// buttons
	if (g_showlist && g_showlist.idx > -1) {
		g_showlist.close_bt.checkstate("leave", 0, 0);
	}

	g_browser && g_browser.on_mouse("leave", 0, 0);

}

// on key

function on_key_down(vkey) {
	var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);
	var AltKeyPressed = utils.IsKeyPressed(VK_ALT);
	var activeList = plman.ActivePlaylist;
	var playlistCount = plman.PlaylistCount;
	var playlistItemCount = plman.PlaylistItemCount(activeList);

	if (g_newPlaylist && NewPlaylistDialog) {
		g_newPlaylist.on_key("down", vkey);
		return true;
	}

	if (g_filterbox && g_filterbox.inputbox.visible) {
		g_filterbox.on_key("down", vkey);
		if (g_filterbox.inputbox.edit || g_filterbox.inputbox.text.length > 0)
			return;
	}

	if (vkey == VK_UP || vkey == VK_DOWN || vkey == VK_RETURN) {
		var focusItemIndex = plman.GetPlaylistFocusItemIndex(activeList);
	}
	if (!ShiftKeyPressed || tempFocusItemIndex == undefined)
		tempFocusItemIndex = focusItemIndex;

	switch (vkey) {
		case VK_ALT:
			window.SetProperty("Hide menu bar", hideMenuBar = (hideMenuBar == MainMenuState.Hide ? MainMenuState.Show : MainMenuState.Hide));
			if (UIHacks)
				UIHacks.MainMenuState = hideMenuBar;
			break;
		case VK_UP:
			//on_mouse_wheel(1);
			if (focusItemIndex == 0)
				return;

			if (ShiftKeyPressed) {
				if (tempFocusItemIndex == focusItemIndex) {
					plman.ClearPlaylistSelection(activeList);
					plman.SetPlaylistSelectionSingle(activeList, focusItemIndex, true);
				}
				if (tempFocusItemIndex < focusItemIndex) {
					plman.SetPlaylistSelectionSingle(activeList, focusItemIndex, false);
				}
				plman.SetPlaylistSelectionSingle(activeList, focusItemIndex - 1, true);
			}

			if (!CtrlKeyPressed && !ShiftKeyPressed) {
				plman.ClearPlaylistSelection(activeList);
				plman.SetPlaylistSelectionSingle(activeList, focusItemIndex - 1, true);
			}

			plman.SetPlaylistFocusItem(activeList, focusItemIndex - 1);
			window.Repaint();
			break;
		case VK_DOWN:
			//on_mouse_wheel(-1);
			if (focusItemIndex == (plman.PlaylistItemCount(plman.ActivePlaylist) - 1))
				return;

			if (ShiftKeyPressed) {
				if (tempFocusItemIndex == focusItemIndex) {
					plman.ClearPlaylistSelection(activeList);
					plman.SetPlaylistSelectionSingle(activeList, focusItemIndex, true);
				}
				if (tempFocusItemIndex > focusItemIndex) {
					plman.SetPlaylistSelectionSingle(activeList, focusItemIndex, false);
				}
				plman.SetPlaylistSelectionSingle(activeList, focusItemIndex + 1, true);
			}

			if (!CtrlKeyPressed && !ShiftKeyPressed) {
				plman.ClearPlaylistSelection(activeList);
				plman.SetPlaylistSelectionSingle(activeList, focusItemIndex + 1, true);
			}
			plman.SetPlaylistFocusItem(activeList, focusItemIndex + 1);
			window.Repaint();
			break;
		case VK_RETURN:
			fb.RunContextCommandWithMetadb("Play", fb.GetFocusItem());
			break;
		case VK_DELETE:
			var act_pls = plman.ActivePlaylist;
			if (!fb.IsAutoPlaylist(act_pls)) {
				plman.RemovePlaylistSelection(act_pls, false);
				plman.SetPlaylistSelectionSingle(act_pls, plman.GetPlaylistFocusItemIndex(act_pls), true);
			}
			break;
		case VK_HOME:
			plman.ClearPlaylistSelection(activeList);
			plman.SetPlaylistSelectionSingle(activeList, 0, true);
			plman.SetPlaylistFocusItem(activeList, 0);
			break;
		case VK_END:
			plman.ClearPlaylistSelection(activeList);
			plman.SetPlaylistSelectionSingle(activeList, (playlistItemCount - 1), true);
			plman.SetPlaylistFocusItem(activeList, (playlistItemCount - 1));
			break;
		case VK_KEY_A:
			AltKeyPressed && fb.RunMainMenuCommand("View/Always on Top");
			CtrlKeyPressed && selectAll();
			break;
		case VK_KEY_C:
			if (CtrlKeyPressed) {
				if (g_browser) {
					var check__ = g_browser.activeIndex;
					if (check__ > -1) {
						// Select Tracks
						var playlist = g_browser.albums_draw[check__].pl;
						var selectedIndexes = [];
						plman.ClearPlaylistSelection(activeList);
						plman.SetPlaylistFocusItemByHandle(activeList, playlist.Item(0));
						for (var id = plman.GetPlaylistFocusItemIndex(activeList); id < (plman.GetPlaylistFocusItemIndex(activeList) + playlist.Count); id++) {
							selectedIndexes.push(id);
						}
						plman.SetPlaylistSelection(activeList, selectedIndexes, true);
						plman.SetPlaylistFocusItemByHandle(activeList, playlist.Item(0));
						copy();
					} else
						copy();
				}
			}
			break;
		case VK_KEY_F:
			CtrlKeyPressed && fb.RunMainMenuCommand("Edit/Search");
			ShiftKeyPressed && fb.RunMainMenuCommand("Library/Search");
			break;
		case VK_KEY_I:
			CtrlKeyPressed && invertSelection();
			break;
		case VK_KEY_M:
			CtrlKeyPressed && fb.RunMainMenuCommand("View/Playlist Manager");
			break;
		case VK_KEY_N:
			if (!CtrlKeyPressed && ShiftKeyPressed) {
				fb.ActivePlaylist = fb.CreateAutoPlaylist(playlistCount, "Playlist #" + (playlistCount + 1), "");
				fb.RunMainMenuCommand("File/Rename Playlist");
				fb.ShowAutoPlaylistUI(fb.ActivePlaylist);
			}

			if (CtrlKeyPressed && !ShiftKeyPressed) {
				fb.CreatePlaylist(playlistCount, "");
				fb.ActivePlaylist = playlistCount - 1;
			}
			break;
		case VK_KEY_O:
			ShiftKeyPressed && fb.RunContextCommandWithMetadb("Open Containing Folder", fb.GetFocusItem());
			break;
		case VK_KEY_P:
			CtrlKeyPressed && fb.RunMainMenuCommand("File/Preferences");
			break;
		case VK_KEY_S:
			CtrlKeyPressed && fb.RunMainMenuCommand("File/Save playlist...");
			break;
		case VK_KEY_X:
			if (CtrlKeyPressed) {
				if (g_browser) {
					var activeList = plman.ActivePlaylist;
					var check__ = g_browser.activeIndex;
					if (check__ > -1) {
						// Select Tracks
						var playlist = g_browser.albums_draw[check__].pl;
						var selectedIndexes = [];
						plman.ClearPlaylistSelection(activeList);
						plman.SetPlaylistFocusItemByHandle(activeList, playlist.Item(0));
						for (var id = plman.GetPlaylistFocusItemIndex(activeList); id < (plman.GetPlaylistFocusItemIndex(activeList) + playlist.Count); id++) {
							selectedIndexes.push(id);
						}
						plman.SetPlaylistSelection(activeList, selectedIndexes, true);
						plman.SetPlaylistFocusItemByHandle(activeList, playlist.Item(0));
						cut();
					} else
						cut();
				}
			}
			break;
		case VK_KEY_V:
			if (CtrlKeyPressed) {
				var activeList = plman.ActivePlaylist;
				var isAutoPlaylist = fb.IsAutoPlaylist(activeList);
				if (!isAutoPlaylist)
					paste();
			}
			break;
		case VK_F5:
			if (g_browser && g_filterbox) {
				scroll = scroll_ = 0;
				g_filterbox.inputbox.text = "";
				filter_text = "";
				g_imageCache = new image_cache;
				if (artistDisplay_v2) {
					g_artistImageCache = new image_cache;
					g_genreImageCache = new image_cache;
				}
				g_browser.populate(false);
				g_sendResponse();
			}
			break;
		case VK_F6:
			if (g_browser && g_filterbox) {
				scroll = scroll_ = 0;
				g_filterbox.inputbox.text = "";
				filter_text = "";
				g_browser.populate(true);
				g_sendResponse();
			}
			break;
		case VK_F7:
			if (g_browser) {
				g_imageCache = new image_cache;
				if (artistDisplay_v2) {
					g_artistImageCache = new image_cache;
					g_genreImageCache = new image_cache;
				}
				g_browser.repaint();
			}
			break;
		case VK_F11:
			fb.RunMainMenuCommand("View/Fullscreen");
			break;
	}
}

function on_key_up(vkey) {
	if (g_newPlaylist && NewPlaylistDialog) {
		g_newPlaylist.on_key("up", vkey);
		return true;
	}

	// inputBox
	if (g_filterbox && g_filterbox.inputbox.visible) {
		g_filterbox.on_key("up", vkey);
	}
}

function on_char(code) {
	if (NewPlaylistDialog && NewPlaylistDialog) {
		g_newPlaylist.on_char(code);
		return true;
	}

	// inputBox
	if (g_filterbox && g_filterbox.inputbox.visible) {
		g_filterbox.on_char(code);
	}
}

function on_focus(is_focused) {
	fb2k_focus = is_focused;

	if (is_focused)
		return;

	if (g_newPlaylist && NewPlaylistDialog) {
		g_newPlaylist.inputbox.check("down", 0, 0);
		return true;
	}

	showSetingsPanel = is_focused;
	show_volume = is_focused;
	g_filterbox && g_filterbox.inputbox.check("down", 0, 0);
	g_ishover = is_focused;
	//g_browser.repaint();
	if (is_focused) {
		plman.SetActivePlaylistContext();
	}
	window.Repaint();
}

function on_volume_change(val) {
	if (g_volume)
		g_volume.repaint();
}

function on_timer(id) {
	//g_timer && repaintLyrics();
}

// Playback Callbacks

function on_item_played(metadb) {
	if (Scheduler.counter_started)
		Scheduler.counter++;
}

function on_playback_pause(state) {
	if (g_browser)
		g_browser.repaint();
	check_toolbar_bt();
}

function on_playback_stop(reason) {
	g_seconds = 0;
	if (g_showlist) {
		if (g_showlist.idx > -1) {
			if (g_showlist.y > 0 - g_showlist.h && g_showlist.y < wh) {
				g_browser.repaint();
			}
		}
	}

	if (reason != 2) {
		check_toolbar_bt();
	}

	window.RepaintRect(0, wh - Bar_h, ww, Bar_h);

	if (reason == 0 && Scheduler.timer_started)
		StopTimer();

	if (reason == 2)
		return;
	g_info && g_info.refresh();

}

function on_playback_new_track(metadb) {
	g_seconds = 0;
	if (fb.CursorFollowPlayback) {
		if (properties.TFgrouping != groupByAlbum) {
			window.SetProperty("Group active", lGroup = "Albums");
			window.SetProperty("Library Group TitleFormat", properties.TFgrouping = groupByAlbum);
			window.SetProperty("Library Sort TitleFormat", properties.TFsorting = SortByAlbum);
			on_size();
			g_browser.populate(false);
		}
		seek_track(metadb);
	}

	if (g_showlist && g_showlist.idx > -1) {
		if (g_showlist.y > 0 - g_showlist.h && g_showlist.y < wh) {
			g_browser.repaint();
		}
	}

	getData(metadb);
	check_toolbar_bt();
	if (g_seekbar)
		g_seekbar.checkstate("new_track", 0, 0);

	if (Scheduler.counter_started && Scheduler.counter_limit == Scheduler.counter) {
		fb.Stop();
		window.Repaint();
		switch (Scheduler.st) {
		case 0:
			//fb.Stop();
			break;
		case 1:
			fb.Exit();
			break;
		case 2:
			try {
				WshShell.run("shutdown.exe -L");
			} catch (e) {
				fb.trace(e.message);
			}
			break;
		case 3:
			try {
				WshShell.run("shutdown.exe -s -t 00");
			} catch (e) {
				fb.trace(e.message);
			}
			break;
		case 4:
			try {
				WshShell.run("shutdown.exe -r -t 00");
			} catch (e) {
				fb.trace(e.message);
			}
			break;
		}
		StopCounter();
	}

	/*
	if (metadb)
	g_active = fb.PlaybackLength <= 0 || metadb.RawPath.indexOf("cdda://") == 0 || metadb.RawPath.indexOf("FOO_LASTFM") == 0 || true;
	a_active = a_scroll && g_text != g_nolyrics ? true : false;
	repaintLyrics();

	if (a_active) {
	if (g_timer) {
	g_timer.Dispose();
	g_timer = null;
	}
	g_timer = window.CreateTimerInterval(250);
	}
	 */

	g_info && g_info.refresh();

}

function on_playback_time(time) {
	g_seconds = time;
	if (g_showlist && g_showlist.idx > -1) {
		if (g_showlist.y > 0 - g_showlist.h && g_showlist.y < wh) {
			window.RepaintRect(g_showlist.playing_row_x, g_showlist.playing_row_y, g_showlist.playing_row_w, g_showlist.playing_row_h);
		}
	}
}

seek_time = window.SetInterval(function () {
		if (fb.IsPlaying) {
			g_remain = tf1_remain.Eval(true);
			g_elap = tf1_elap.Eval(true);
			g_seekbar && g_seekbar.checkstate("playback");
		}
	}, 500);

function on_playback_edited() {
	/*var a = g_text;
	get_text();

	if (g_text != a)
	on_playback_new_track(metadb);*/
}

function on_playback_order_changed(new_order_index) {}

function on_playback_queue_changed(origin) {
	g_queue && g_queue.refresh();
}

function on_playlist_stop_after_current_changed(state) {
	g_settings && g_settings.buttons[1].update(state, [col_text1, col_text2, negative(col_text1), accent_colour]);
}

function on_cursor_follow_playback_changed(state) {
	g_settings && g_settings.buttons[2].update(state, [col_text1, col_text2, negative(col_text1), accent_colour]);
}

function on_playback_follow_cursor_changed(state) {
	g_settings && g_settings.buttons[3].update(state, [col_text1, col_text2, negative(col_text1), accent_colour]);
}

function on_playback_dynamic_info() {}

function on_playback_dynamic_info_track() {}

function on_metadb_changed(metadb, fromhook) {

	if (lGroup != "Songs") {
		if (g_browser && g_showlist) {
			//g_library_to_reload = true;
			var columnsOffset_saved = g_showlist.columnsOffset;
			// refresh meta datas of the grid
			var total = g_browser.albums.length;
			var vTitleFormat = properties.separateAlbumsByDisc ? vTitleFormatByDisc : vTitleFormatSimple;
			var item;
			var str = "";
			var arr = [];
			for (var i = 0; i < total; i++) {
				item = g_browser.albums[i].metadb;
				str = fb.TitleFormat(vTitleFormat).EvalWithMetadb(item);
				arr = str.split(" ^^ ");
				g_browser.albums[i].albumartist = arr[0];
				g_browser.albums[i].album = arr[1];
				g_browser.albums[i].date = arr[5];
				// for each track of the album group, update tags stored in tr array
				for (var j = 0; j < g_browser.albums[i].tr.length; j++) {
					g_browser.albums[i].tr[j] = str;
				}
			}
			// refresh rows of the active showList if g_browser one is expanded
			var idx = g_showlist.idx;
			if (idx > -1) {
				var playlist = g_browser.albums_draw[idx].pl;
				g_showlist.calcHeight(playlist, idx);
				g_showlist.setColumns(idx);
				g_showlist.columnsOffset = columnsOffset_saved;
			}
			g_browser.repaint();
		}
	} else {
		g_songs && g_songs.repaint();
	}

	g_info && g_info.refresh();
}

function on_get_album_art_done(metadb, art_id, image, image_path) {

	if (g_browser) {
		for (var i = 0; i < g_browser.albums_draw.length; i++) {
			if (g_browser.albums_draw[i].metadb) {
				if (g_browser.albums_draw[i].metadb.Compare(metadb)) {
					if (artistDisplay_v2) {
						if (lGroup == "Artists")
							g_browser.albums_draw[i].cover_img = g_artistImageCache.getit(metadb, g_browser.albums_draw[i].tracktype, image);
						else if (lGroup == "Genres")
							g_browser.albums_draw[i].cover_img = g_genreImageCache.getit(metadb, g_browser.albums_draw[i].tracktype, image);
						else if (lGroup == "Albums")
							g_browser.albums_draw[i].cover_img = g_imageCache.getit(metadb, g_browser.albums_draw[i].tracktype, image);
					} else {
						g_browser.albums_draw[i].cover_img = g_imageCache.getit(metadb, g_browser.albums_draw[i].tracktype, image);
					}
					//g_browser.albums_draw[i].cover_img = g_imageCache.getit(metadb, g_browser.albums_draw[i].tracktype, image);

					if (!cover.done_timer) {
						cover.done_timer = window.SetTimeout(function () {
								try {
									window.RepaintRect(g_browser.albums_draw[i].x, g_browser.albums_draw[i].y, g_browser.thumbnailWidth, g_browser.thumbnailWidth);
								} catch (e) {
									fb.trace(e);
								}
								//CollectGarbage();
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

	/*
	var i = art_id - 5;

	g_last = i;
	if (g_browser)
	if (i < g_browser.albums_draw.length) {
	if (g_browser.albums_draw[i].metadb) {
	g_browser.albums_draw[i].cover_img = g_imageCache.getit(metadb, g_browser.albums_draw[i].tracktype, image);
	if (i <= g_end) {
	window.RepaintRect(g_browser.albums_draw[i].x, g_browser.albums_draw[i].y, g_browser.thumbnailWidth, g_browser.thumbnailWidth);
	//if (!cover.done_timer) {
	//cover.done_timer = window.SetTimeout(function () {
	// !g_start_time && g_browser.repaint();
	//cover.done_timer && window.ClearTimeout(cover.done_timer);
	//cover.done_timer = false;
	//	}, 150);
	//}
	}
	}
	}*/
}

function getData(db) {
	if (!db)
		return;

	if (db) {
		g_artist = tf1_artist.EvalWithMetadb(db);
		g_album = tf1_album.EvalWithMetadb(db);
		g_title = tf1_title.EvalWithMetadb(db);
		g_len = tf1_len.EvalWithMetadb(db);
		g_mood = tf1_mood.EvalWithMetadb(db);
	}

	if (b_cover_img)
		b_cover_img.Dispose();
	try {
		//if (cover.raw_bitmap)
		//	b_cover_img = utils.GetAlbumArtV2(db, AlbumArtId.front, true).Resize(CoverSize, CoverSize).CreateRawBitmap();
		//else
		if (largeNowPlayingArtwork && pl_w > 100) {
			b_cover_img = resizeImage(utils.GetAlbumArtV2(db, AlbumArtId.front, true), pl_w - largeNowPlayingArtworkX * 2, pl_w - largeNowPlayingArtworkX * 2, cover.raw_bitmap, 0);
		} else {
			b_cover_img = resizeImage(utils.GetAlbumArtV2(db, AlbumArtId.front, true), CoverSize, CoverSize, cover.raw_bitmap);
		}
	} catch (e) {
		b_cover_img = null;
	}

	if (b_cover_img2)
		b_cover_img2.Dispose();
	try {
		//b_cover_img2 = FormatCover(utils.GetAlbumArtV2(db, AlbumArtId.artist, true), 900, 900, false, false, "crop top");
		b_cover_img2 = resizeImage(utils.GetAlbumArtV2(db, AlbumArtId.artist, true), ww - pl_w - 80, ww - pl_w - 80, cover.raw_bitmap, 0);
	} catch (e) {
		b_cover_img2 = null;
	}

	/*if (!b_cover_img && db)
	downloadAlbum(fb.TitleFormat("%album artist%").EvalWithMetadb(db), fb.TitleFormat("%album%").EvalWithMetadb(db));
	if (!b_cover_img2 && db)
	download(fb.TitleFormat("%album artist%").EvalWithMetadb(db));
	 */

	if (tabActive == "Now_Playing")
		window.Repaint();
	else {
		if (largeNowPlayingArtwork)
			window.RepaintRect(0, wh - Bar_h - pl_w - largeNowPlayingArtworkX * 2, pl_w, pl_w + largeNowPlayingArtworkX * 2);
		window.RepaintRect(0, wh - Bar_h, ww, Bar_h);
	}
}

// Playlist Callbacks

function on_playlists_changed() {
	if (!g_avoid_on_playlists_changed) {
		checkMediaLibrayPlaylist();
	}
	g_plmanager && g_plmanager.setPlaylistList();
	/*if (fb.IsPlaying)
	return;*/
	g_songs && g_songs.refresh();
	//displayFocusItem(plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist));

	g_info && g_info.refresh();
}

function on_playlist_switch() {

	plman.SetActivePlaylistContext();

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
		if (plman.PlayingPlaylist != pl_idx && plman.ActivePlaylist != pl_idx) {
			plman.RemovePlaylist(pl_idx);
			//plman.ActivePlaylist = 0;
		}
	}

	if (isQueuePlaylistActive()) {
		ShowPlaylistQueue(0);
	} else {
		var act_pls = plman.ActivePlaylist;
		var pls_count = plman.PlaylistCount;
		if (act_pls < 0 || act_pls > pls_count) {
			if (pls_count > 0) {
				act_pls = 0;
				plman.ActivePlaylist = 0;
			}
		}
	}

	/*
	select_pl_active = plman.GetPlaylistName(plman.ActivePlaylist).substr(0, 20) == "Playlist Selection [" ? true : false;
	if (select_pl_active)
	g_browser.headerBarHeight = 276;
	else
	g_browser.headerBarHeight = 140;
	on_size();
	 */
	g_plmanager && g_plmanager.setPlaylistList();
	g_hiddenLoadTimer && window.ClearTimeout(g_hiddenLoadTimer);
	g_hiddenLoadTimer = false;
	scroll = scroll_ = 0;
	if (g_filterbox)
		g_filterbox.inputbox.text = filter_text = "";
	if (g_browser) {
		g_browser.populate(false);
		g_sendResponse();
	}
	focus_id = plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist);

	/*if (fb.IsPlaying)
	return;*/

	/*
	seconds = 0;
	contents = plman.GetPlaylistItems(plman.ActivePlaylist);

	for (var i = 0; i < plman.PlaylistItemCount(plman.ActivePlaylist); i++) {
	seconds += Math.abs(fb.TitleFormat("$if(%length%,%length_seconds_fp%,0)").evalWithMetadb(contents.Item(i)));
	}
	seconds = timeFormat(seconds);
	 */
	g_songs && g_songs.refresh();
	displayFocusItem(plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist));

	g_info && g_info.refresh();

	window.Repaint();
}

//var seconds;

function on_playlist_items_added(playlist) {
	//if (playlist == 0) {
	//	reload_library();
	//} else
	if (plman.ActivePlaylist == playlist) {
		scroll = scroll_ = 0;
		if (g_filterbox)
			g_filterbox.inputbox.text = filter_text = "";
		g_browser && g_browser.populate(false);
		g_sendResponse();
		focus_id = plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist);
	}

	g_plmanager && g_plmanager.repaint();

	if (plman.ActivePlaylist == playlist) {
		g_songs && g_songs.refresh();
		g_info && g_info.refresh();
	}

}

function on_playlist_items_removed(playlist, new_count) {
	//if (playlist == 0) {
	//	reload_library();
	//} else
	if (plman.ActivePlaylist == playlist) {
		if (g_filterbox)
			g_filterbox.inputbox.text = "";
		g_browser && g_browser.populate(true);
		g_sendResponse();
		focus_id = plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist);
	}
	g_plmanager && g_plmanager.repaint();

	if (plman.ActivePlaylist == playlist) {
		g_songs && g_songs.refresh();
		g_info && g_info.refresh();
	}

	plman.SetActivePlaylistContext();
}

function on_playlist_items_reordered(playlist_idx) {
	displayFocusItem(plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist));

	//if (plman.ActivePlaylist == playlist)
	g_songs && g_songs.refresh();
}

function on_playlist_items_selection_change() {
	/*if (fb.IsPlaying)
	return;*/
	g_songs && g_songs.repaint();
	g_info && g_info.refresh();
}

function on_selection_changed(metadb) {
	g_songs && g_songs.repaint();
}

function on_item_focus_change(playlist, from, to) {
	if (!ww || !wh)
		return true;

	focusedTrackId = to;

	if (to < 0)
		return true;

	if (playlist != plman.ActivePlaylist)
		return true;

	displayFocusItem(to);

	plman.SetActivePlaylistContext();
}

// on drag

function on_drag_enter(action, x, y) {
	wsh_dragging = true;
	window.Repaint();
}

function on_drag_leave() {
	wsh_dragging = false;
	window.Repaint();
}

function on_drag_over(action, x, y, mask) {
	on_mouse_move(x, y);
}

function on_drag_drop(action, x, y, mask) {

	wsh_dragging = false;
	window.Repaint();
	action.ToPlaylist();
	action.Playlist = plman.ActivePlaylist;
	action.ToSelect = false;

}
