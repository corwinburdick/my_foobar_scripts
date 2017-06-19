// Buttons

function set_toolbar_bt() {
	var gb;

	img = iconsPlayer30v09;

	playlistPlayedIcon_Mask = gdi.CreateImage(27, 27);
	gb = playlistPlayedIcon_Mask.GetGraphics();
	gb.FillSolidRect(0, 0, playlistPlayedIcon_Mask.Width, playlistPlayedIcon_Mask.Height, RGB(255, 255, 255));
	gb.DrawImage(icons25v35, 0, 0, 27, 27, 0, 27 * 38, 27, 27);
	playlistPlayedIcon_Mask.ReleaseGraphics(gb);
	playlistPlayedIcon = gdi.CreateImage(27, 27);
	gb = playlistPlayedIcon.GetGraphics();
	gb.FillSolidRect(0, 0, playlistPlayedIcon.Width, playlistPlayedIcon.Height, accent_colour);
	playlistPlayedIcon.ReleaseGraphics(gb);
	playlistPlayedIcon.ApplyMask(playlistPlayedIcon_Mask);

	b_bt_w = 32;

	cover_off = gdi.CreateImage(pl_deafult_w - 20, vBar_h - 20);
	gb = cover_off.GetGraphics();
	gb.FillSolidRect(0, 0, cover_off.Width, cover_off.Height, 0);
	cover_off.ReleaseGraphics(gb);

	cover_ov = gdi.CreateImage(pl_deafult_w - 20, vBar_h - 20);
	gb = cover_ov.GetGraphics();
	gb.FillSolidRect(0, 0, cover_off.Width, cover_off.Height, RGBA(255, 255, 255, 10));
	cover_ov.ReleaseGraphics(gb);

	cover_on = gdi.CreateImage(pl_deafult_w - 20, vBar_h - 20);
	gb = cover_on.GetGraphics();
	gb.FillSolidRect(0, 0, cover_on.Width, cover_on.Height, RGBA(155, 155, 155, 10));
	cover_on.ReleaseGraphics(gb);

	//

	play_off = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = play_off.GetGraphics();
	gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, 0, 0, b_bt_w, b_bt_w);
	play_off.ReleaseGraphics(gb);

	play_ov = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = play_ov.GetGraphics();
	gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, b_bt_w, 0, b_bt_w, b_bt_w);
	play_ov.ReleaseGraphics(gb);

	play_on = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = play_on.GetGraphics();
	gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, b_bt_w * 2, 0, b_bt_w, b_bt_w);
	play_on.ReleaseGraphics(gb);

	//

	pause_off = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = pause_off.GetGraphics();
	gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, 0, b_bt_w * 3, b_bt_w, b_bt_w);
	pause_off.ReleaseGraphics(gb);

	pause_ov = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = pause_ov.GetGraphics();
	gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, b_bt_w, b_bt_w * 3, b_bt_w, b_bt_w);
	pause_ov.ReleaseGraphics(gb);

	pause_on = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = pause_on.GetGraphics();
	gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, b_bt_w * 2, b_bt_w * 3, b_bt_w, b_bt_w);
	pause_on.ReleaseGraphics(gb);

	//

	next_off = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = next_off.GetGraphics();
	gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, 0, b_bt_w * 2, b_bt_w, b_bt_w);
	next_off.ReleaseGraphics(gb);

	next_ov = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = next_ov.GetGraphics();
	gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, b_bt_w, b_bt_w * 2, b_bt_w, b_bt_w);
	next_ov.ReleaseGraphics(gb);

	next_on = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = next_on.GetGraphics();
	gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, b_bt_w * 2, b_bt_w * 2, b_bt_w, b_bt_w);
	next_on.ReleaseGraphics(gb);

	//

	prev_off = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = prev_off.GetGraphics();
	gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, 0, b_bt_w, b_bt_w, b_bt_w);
	prev_off.ReleaseGraphics(gb);

	prev_ov = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = prev_ov.GetGraphics();
	gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, b_bt_w, b_bt_w, b_bt_w, b_bt_w);
	prev_ov.ReleaseGraphics(gb);

	prev_on = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = prev_on.GetGraphics();
	gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, b_bt_w * 2, b_bt_w, b_bt_w, b_bt_w);
	prev_on.ReleaseGraphics(gb);

	//

	vol_off = gdi.CreateImage(b_bt_w + 25, b_bt_w);
	gb = vol_off.GetGraphics();
	//gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, 0, b_bt_w * 9, b_bt_w, b_bt_w);
	vol_off.ReleaseGraphics(gb);

	vol_ov = gdi.CreateImage(b_bt_w + 25, b_bt_w);
	gb = vol_ov.GetGraphics();
	//gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, b_bt_w, b_bt_w * 9, b_bt_w, b_bt_w);
	vol_ov.ReleaseGraphics(gb);

	vol_on = gdi.CreateImage(b_bt_w + 25, b_bt_w);
	gb = vol_on.GetGraphics();
	//gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, b_bt_w * 2, b_bt_w * 9, b_bt_w, b_bt_w);
	vol_on.ReleaseGraphics(gb);

	vol_off_0 = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = vol_off_0.GetGraphics();
	//gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, 0, b_bt_w * 11, b_bt_w, b_bt_w);
	vol_off_0.ReleaseGraphics(gb);

	vol_on_0 = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = vol_on_0.GetGraphics();
	//gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, b_bt_w * 2, b_bt_w * 11, b_bt_w, b_bt_w);
	vol_on_0.ReleaseGraphics(gb);

	//

	plback_off = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = plback_off.GetGraphics();
	//gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, 0, b_bt_w * 17, b_bt_w, b_bt_w);
	gb.FillSolidRect(8, 12, 19, 2, accent_colour);
	gb.FillSolidRect(8, 12 + 5, 19, 2, accent_colour);
	gb.FillSolidRect(8, 12 + 10, 19, 2, accent_colour);
	plback_off.ReleaseGraphics(gb);

	plback_ov = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = plback_ov.GetGraphics();
	//gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, b_bt_w, b_bt_w * 17, b_bt_w, b_bt_w);
	gb.FillSolidRect(8, 12, 19, 2, setAlpha(accent_colour, 210));
	gb.FillSolidRect(8, 12 + 5, 19, 2, setAlpha(accent_colour, 210));
	gb.FillSolidRect(8, 12 + 10, 19, 2, setAlpha(accent_colour, 210));
	plback_ov.ReleaseGraphics(gb);

	plback_on = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = plback_on.GetGraphics();
	//gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, b_bt_w * 2, b_bt_w * 17, b_bt_w, b_bt_w, 0, 150); // 64, 545 // 755
	gb.FillSolidRect(8, 12, 19, 2, setAlpha(accent_colour, 160));
	gb.FillSolidRect(8, 12 + 5, 19, 2, setAlpha(accent_colour, 160));
	gb.FillSolidRect(8, 12 + 10, 19, 2, setAlpha(accent_colour, 160));
	plback_on.ReleaseGraphics(gb);

	//
	/*
	repeat_off = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = repeat_off.GetGraphics();
	gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, b_bt_w * 3, b_bt_w * 5, b_bt_w, b_bt_w, 0, 255);
	repeat_off.ReleaseGraphics(gb);

	Mask_repeat_on = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = Mask_repeat_on.GetGraphics();
	gb.FillSolidRect(0, 0, Mask_repeat_on.Width, Mask_repeat_on.Height, RGB(255, 255, 255));
	gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, b_bt_w * 2, b_bt_w * 5, b_bt_w, b_bt_w);
	Mask_repeat_on.ReleaseGraphics(gb);

	repeat_on = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = repeat_on.GetGraphics();
	gb.FillSolidRect(0, 0, repeat_on.Width, repeat_on.Height, accent_colour);
	repeat_on.ReleaseGraphics(gb);
	repeat_on.ApplyMask(Mask_repeat_on);

	//

	shuffle_off = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = shuffle_off.GetGraphics();
	gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, b_bt_w * 3, b_bt_w * 6, b_bt_w, b_bt_w, 0, 255);
	shuffle_off.ReleaseGraphics(gb);

	Mask_shuffle_on = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = Mask_shuffle_on.GetGraphics();
	gb.FillSolidRect(0, 0, Mask_shuffle_on.Width, Mask_shuffle_on.Height, RGB(255, 255, 255));
	gb.DrawImage(img, 0, 0, b_bt_w, b_bt_w, b_bt_w * 2, b_bt_w * 6, b_bt_w, b_bt_w);
	Mask_shuffle_on.ReleaseGraphics(gb);

	shuffle_on = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = shuffle_on.GetGraphics();
	gb.FillSolidRect(0, 0, shuffle_on.Width, shuffle_on.Height, accent_colour);
	shuffle_on.ReleaseGraphics(gb);
	shuffle_on.ApplyMask(Mask_shuffle_on);
	 */
	//

	sett_off = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = sett_off.GetGraphics();
	gb.DrawImage(icons40v28, 0, 0, b_bt_w, b_bt_w, 90, 1014, b_bt_w, b_bt_w);
	sett_off.ReleaseGraphics(gb);

	sett_ov = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = sett_ov.GetGraphics();
	gb.DrawImage(icons40v28, 0, 0, b_bt_w, b_bt_w, 90, 1014, b_bt_w, b_bt_w, 0, 225);
	sett_ov.ReleaseGraphics(gb);

	sett_on = gdi.CreateImage(b_bt_w, b_bt_w);
	gb = sett_on.GetGraphics();
	gb.DrawImage(icons40v28, 0, 0, b_bt_w, b_bt_w, 90, 1014, b_bt_w, b_bt_w, 0, 155);
	sett_on.ReleaseGraphics(gb);

	//
	/*
	scheduler_set_off = gdi.CreateImage(80, pl_h);
	gb = scheduler_set_off.GetGraphics();
	gb.FillSolidRect(0, 0, scheduler_set_off.Width, scheduler_set_off.Height, accent_colour);
	scheduler_set_off.ReleaseGraphics(gb);

	scheduler_set_ov = gdi.CreateImage(80, pl_h);
	gb = scheduler_set_ov.GetGraphics();
	gb.FillSolidRect(0, 0, scheduler_set_ov.Width, scheduler_set_ov.Height, RGB(42, 42, 42));
	scheduler_set_ov.ReleaseGraphics(gb);

	scheduler_set_on = gdi.CreateImage(80, pl_h);
	gb = scheduler_set_on.GetGraphics();
	gb.FillSolidRect(0, 0, scheduler_set_on.Width, scheduler_set_on.Height, RGB(0, 0, 0));
	scheduler_set_on.ReleaseGraphics(gb);

	//

	scheduler_set2_off = gdi.CreateImage(30, pl_h);
	gb = scheduler_set2_off.GetGraphics();
	gb.FillSolidRect(0, 0, scheduler_set2_off.Width, scheduler_set2_off.Height, accent_colour);
	var bt_size = 27;
	gb.DrawImage(icons25v35, 0, 0 + 3, bt_size, bt_size, 0, bt_size * 18, bt_size, bt_size);
	scheduler_set2_off.ReleaseGraphics(gb);

	scheduler_set2_ov = gdi.CreateImage(30, pl_h);
	gb = scheduler_set2_ov.GetGraphics();
	gb.FillSolidRect(0, 0, scheduler_set2_ov.Width, scheduler_set2_ov.Height, RGB(42, 42, 42));
	var bt_size = 27;
	gb.DrawImage(icons25v35, 0, 0 + 3, bt_size, bt_size, 0, bt_size * 18, bt_size, bt_size);
	scheduler_set2_ov.ReleaseGraphics(gb);

	scheduler_set2_on = gdi.CreateImage(30, pl_h);
	gb = scheduler_set2_on.GetGraphics();
	gb.FillSolidRect(0, 0, scheduler_set2_on.Width, scheduler_set2_on.Height, RGB(0, 0, 0));
	var bt_size = 27;
	gb.DrawImage(icons25v35, 0, 0 + 3, bt_size, bt_size, 0, bt_size * 18, bt_size, bt_size);
	scheduler_set2_on.ReleaseGraphics(gb);

	//

	min_panel_off = gdi.CreateImage(cScrollbar.width, cScrollbar.width);
	gb = min_panel_off.GetGraphics();
	gb.FillSolidRect(0, 0, min_panel_off.Width, min_panel_off.Height, RGBA(185, 185, 185, 0));
	gb.DrawRect(0, 0, min_panel_off.Width - 1, min_panel_off.Height - 1, 1.0, RGBA(160, 160, 160, 0));
	min_panel_off.ReleaseGraphics(gb);

	min_panel_ov = gdi.CreateImage(cScrollbar.width, cScrollbar.width);
	gb = min_panel_ov.GetGraphics();
	gb.FillSolidRect(1, 1, min_panel_ov.Width - 2, min_panel_ov.Height - 2, RGBA(185, 185, 185, 190));
	gb.DrawRect(0, 0, min_panel_ov.Width - 1, min_panel_ov.Height - 1, 1.0, RGBA(160, 160, 160, 150));
	min_panel_ov.ReleaseGraphics(gb);

	min_panel_on = gdi.CreateImage(cScrollbar.width, cScrollbar.width);
	gb = min_panel_on.GetGraphics();
	gb.FillSolidRect(1, 1, min_panel_ov.Width - 2, min_panel_ov.Height - 2, RGBA(24, 24, 24, 190));
	gb.DrawRect(0, 0, min_panel_on.Width - 1, min_panel_on.Height - 1, 1.0, RGBA(16, 16, 16, 170));
	min_panel_on.ReleaseGraphics(gb);
	 */
	//

	var bt_size = 27;

	//
	pl_play_off = gdi.CreateImage(bt_size, bt_size);
	gb = pl_play_off.GetGraphics();
	gb.DrawImage(icons25v35, 0, 0, bt_size, bt_size, 0, properties.darkTheme ? bt_size * 26 : 0, bt_size, bt_size);
	pl_play_off.ReleaseGraphics(gb);

	pl_play_ov = gdi.CreateImage(bt_size, bt_size);
	gb = pl_play_ov.GetGraphics();
	gb.DrawImage(icons25v35, 0, 0, bt_size, bt_size, bt_size, properties.darkTheme ? bt_size * 26 : 0, bt_size, bt_size);
	pl_play_ov.ReleaseGraphics(gb);

	pl_play_on = gdi.CreateImage(bt_size, bt_size);
	gb = pl_play_on.GetGraphics();
	gb.DrawImage(icons25v35, 0, 0, bt_size, bt_size, bt_size * 2, properties.darkTheme ? bt_size * 26 : 0, bt_size, bt_size);
	pl_play_on.ReleaseGraphics(gb);

	//

	pl_add_off = gdi.CreateImage(bt_size, bt_size);
	gb = pl_add_off.GetGraphics();
	gb.DrawImage(icons25v35, 0, 0, bt_size, bt_size, 0, properties.darkTheme ? bt_size * 27 : bt_size, bt_size, bt_size);
	pl_add_off.ReleaseGraphics(gb);

	pl_add_ov = gdi.CreateImage(bt_size, bt_size);
	gb = pl_add_ov.GetGraphics();
	gb.DrawImage(icons25v35, 0, 0, bt_size, bt_size, bt_size, properties.darkTheme ? bt_size * 27 : bt_size, bt_size, bt_size);
	pl_add_ov.ReleaseGraphics(gb);

	pl_add_on = gdi.CreateImage(bt_size, bt_size);
	gb = pl_add_on.GetGraphics();
	gb.DrawImage(icons25v35, 0, 0, bt_size, bt_size, bt_size * 2, properties.darkTheme ? bt_size * 27 : bt_size, bt_size, bt_size);
	pl_add_on.ReleaseGraphics(gb);

	//

	pl_sett_off = gdi.CreateImage(bt_size, bt_size);
	gb = pl_sett_off.GetGraphics();
	gb.DrawImage(icons25v35, 0, 0, bt_size, bt_size, 0, properties.darkTheme ? bt_size * 29 : bt_size * 3, bt_size, bt_size);
	pl_sett_off.ReleaseGraphics(gb);

	pl_sett_ov = gdi.CreateImage(bt_size, bt_size);
	gb = pl_sett_ov.GetGraphics();
	gb.DrawImage(icons25v35, 0, 0, bt_size, bt_size, bt_size, properties.darkTheme ? bt_size * 29 : bt_size * 3, bt_size, bt_size);
	pl_sett_ov.ReleaseGraphics(gb);

	pl_sett_on = gdi.CreateImage(bt_size, bt_size);
	gb = pl_sett_on.GetGraphics();
	gb.DrawImage(icons25v35, 0, 0, bt_size, bt_size, bt_size * 2, properties.darkTheme ? bt_size * 29 : bt_size * 3, bt_size, bt_size);
	pl_sett_on.ReleaseGraphics(gb);

	//

	pl_edit_off = gdi.CreateImage(bt_size, bt_size);
	gb = pl_edit_off.GetGraphics();
	gb.DrawImage(icons25v35, 0, 0, bt_size, bt_size, 0, properties.darkTheme ? bt_size * 30 : bt_size * 4, bt_size, bt_size);
	pl_edit_off.ReleaseGraphics(gb);

	pl_edit_ov = gdi.CreateImage(bt_size, bt_size);
	gb = pl_edit_ov.GetGraphics();
	gb.DrawImage(icons25v35, 0, 0, bt_size, bt_size, bt_size, properties.darkTheme ? bt_size * 30 : bt_size * 4, bt_size, bt_size);
	pl_edit_ov.ReleaseGraphics(gb);

	pl_edit_on = gdi.CreateImage(bt_size, bt_size);
	gb = pl_edit_on.GetGraphics();
	gb.DrawImage(icons25v35, 0, 0, bt_size, bt_size, bt_size * 2, properties.darkTheme ? bt_size * 30 : bt_size * 4, bt_size, bt_size);
	pl_edit_on.ReleaseGraphics(gb);

	//


	bt_h = 35;

	var gAlbumsW = gArtistsW = gGenresW = gSongsW = 0,
	gAddTxtW = 20;

	calcWidthBt = gdi.CreateImage(1, 1);
	gb = calcWidthBt.GetGraphics();
	gAlbumsW = gb.CalcTextWidth("Albums", groupFont) + gAddTxtW * 2;
	gArtistsW = gb.CalcTextWidth("Artists", groupFont) + gAddTxtW * 2;
	gGenresW = gb.CalcTextWidth("Genres", groupFont) + gAddTxtW * 2;
	gSongsW = gb.CalcTextWidth("Songs", groupFont) + gAddTxtW * 2;
	calcWidthBt.ReleaseGraphics(gb);

	g_albums_off = gdi.CreateImage(gAlbumsW, bt_h);
	gb = g_albums_off.GetGraphics();
	g_albums_off.ReleaseGraphics(gb);
	g_albums_ov = gdi.CreateImage(gAlbumsW, bt_h);
	gb = g_albums_ov.GetGraphics();
	gb.FillSolidRect(0, 0, g_albums_ov.Width, g_albums_ov.Height, RGBA(255, 255, 255, 30));
	g_albums_ov.ReleaseGraphics(gb);
	g_albums_on = gdi.CreateImage(gAlbumsW, bt_h);
	gb = g_albums_on.GetGraphics();
	gb.FillSolidRect(0, 0, g_albums_on.Width, g_albums_on.Height, RGB(58, 58, 58));
	g_albums_on.ReleaseGraphics(gb);

	g_artists_off = gdi.CreateImage(gArtistsW, bt_h);
	gb = g_artists_off.GetGraphics();
	g_artists_off.ReleaseGraphics(gb);
	g_artists_ov = gdi.CreateImage(gArtistsW, bt_h);
	gb = g_artists_ov.GetGraphics();
	gb.FillSolidRect(0, 0, g_artists_ov.Width, g_artists_ov.Height, RGBA(255, 255, 255, 30));
	g_artists_ov.ReleaseGraphics(gb);
	g_artists_on = gdi.CreateImage(gArtistsW, bt_h);
	gb = g_artists_on.GetGraphics();
	gb.FillSolidRect(0, 0, g_albums_on.Width, g_albums_on.Height, RGB(58, 58, 58));
	g_artists_on.ReleaseGraphics(gb);

	g_genres_off = gdi.CreateImage(gGenresW, bt_h);
	gb = g_genres_off.GetGraphics();
	g_genres_off.ReleaseGraphics(gb);
	g_genres_ov = gdi.CreateImage(gGenresW, bt_h);
	gb = g_genres_ov.GetGraphics();
	gb.FillSolidRect(0, 0, g_genres_ov.Width, g_genres_ov.Height, RGBA(255, 255, 255, 30));
	g_genres_ov.ReleaseGraphics(gb);
	g_genres_on = gdi.CreateImage(gGenresW, bt_h);
	gb = g_genres_on.GetGraphics();
	gb.FillSolidRect(0, 0, g_genres_on.Width, g_genres_on.Height, RGB(58, 58, 58));
	g_genres_on.ReleaseGraphics(gb);

	g_songs_off = gdi.CreateImage(gSongsW, bt_h);
	gb = g_songs_off.GetGraphics();
	g_songs_off.ReleaseGraphics(gb);
	g_songs_ov = gdi.CreateImage(gSongsW, bt_h);
	gb = g_songs_ov.GetGraphics();
	gb.FillSolidRect(0, 0, g_songs_ov.Width, g_songs_ov.Height, RGBA(255, 255, 255, 30));
	g_songs_ov.ReleaseGraphics(gb);
	g_songs_on = gdi.CreateImage(gSongsW, bt_h);
	gb = g_genres_on.GetGraphics();
	gb.FillSolidRect(0, 0, g_songs_on.Width, g_songs_on.Height, RGB(58, 58, 58));
	g_songs_on.ReleaseGraphics(gb);

	//

	var bt_size = 27;

	g_sort_off = gdi.CreateImage(125, bt_h);
	gb = g_sort_off.GetGraphics();
	//gb.FillSolidRect(0, 0, g_sort_off.Width, g_sort_off.Height, properties.darkTheme ? RGB(16, 16, 16) : RGBA(0, 0, 0, 15));
	//gb.DrawImage(icons25v35, g_sort_off.Width - bt_size, 0, bt_size, bt_size, properties.darkTheme ? 0 : bt_size, bt_size * 18, bt_size, bt_size);
	g_sort_off.ReleaseGraphics(gb);

	g_sort_ov = gdi.CreateImage(125, bt_h);
	gb = g_sort_ov.GetGraphics();
	gb.FillSolidRect(0, 0, g_sort_ov.Width, g_sort_ov.Height, properties.darkTheme ? RGB(24, 24, 24) : RGBA(0, 0, 0, 30));
	//gb.DrawImage(icons25v35, g_sort_ov.Width - bt_size, 0, bt_size, bt_size, properties.darkTheme ? 0 : bt_size, bt_size * 18, bt_size, bt_size);
	g_sort_ov.ReleaseGraphics(gb);

	g_sort_on = gdi.CreateImage(125, bt_h);
	gb = g_sort_on.GetGraphics();
	gb.FillSolidRect(0, 0, g_sort_on.Width, g_sort_on.Height, properties.darkTheme ? RGB(10, 10, 10) : RGBA(0, 0, 0, 10));
	//gb.DrawImage(icons25v35, g_sort_on.Width - bt_size, 0, bt_size, bt_size, properties.darkTheme ? 0 : bt_size, bt_size * 18, bt_size, bt_size);
	g_sort_on.ReleaseGraphics(gb);

	//

	var bt_size = 42;
	var min = 15;

	g_back_off = gdi.CreateImage(bt_size - min, bt_size - min);
	gb = g_back_off.GetGraphics();
	gb.DrawImage(icons_back_v01, 0, 0, bt_size - min, bt_size - min, 0, properties.darkTheme ? 0 : 40, bt_size, bt_size, 0, 240);
	g_back_off.ReleaseGraphics(gb);

	g_back_ov = gdi.CreateImage(bt_size - min, bt_size - min);
	gb = g_back_ov.GetGraphics();
	gb.DrawImage(icons_back_v01, 0, 0, bt_size - min, bt_size - min, bt_size * 2, properties.darkTheme ? 0 : 40, bt_size, bt_size, 0, 240);
	g_back_ov.ReleaseGraphics(gb);

	g_back_on = gdi.CreateImage(bt_size - min, bt_size - min);
	gb = g_back_on.GetGraphics();
	gb.DrawImage(icons_back_v01, 0, 0, bt_size - min, bt_size - min, bt_size, properties.darkTheme ? 0 : 40, bt_size, bt_size, 0, 240);
	g_back_on.ReleaseGraphics(gb);

	//

	g_preferences_off = gdi.CreateImage(80, bt_h);
	gb = g_preferences_off.GetGraphics();
	//gb.FillSolidRect(0, 0, g_preferences_off.Width, g_preferences_off.Height, properties.darkTheme ? RGB(16, 16, 16) : RGBA(0, 0, 0, 15));
	//gb.DrawImage(icons25v35, g_sort_off.Width - bt_size, 0, bt_size, bt_size, properties.darkTheme ? 0 : bt_size, bt_size * 18, bt_size, bt_size);
	g_preferences_off.ReleaseGraphics(gb);

	g_preferences_ov = gdi.CreateImage(125, bt_h);
	gb = g_preferences_ov.GetGraphics();
	//gb.FillSolidRect(0, 0, g_preferences_ov.Width, g_preferences_ov.Height, properties.darkTheme ? RGB(24, 24, 24) : RGBA(0, 0, 0, 30));
	//gb.DrawImage(icons25v35, g_sort_ov.Width - bt_size, 0, bt_size, bt_size, properties.darkTheme ? 0 : bt_size, bt_size * 18, bt_size, bt_size);
	g_preferences_ov.ReleaseGraphics(gb);

	g_preferences_on = gdi.CreateImage(125, bt_h);
	gb = g_preferences_on.GetGraphics();
	//gb.FillSolidRect(0, 0, g_preferences_on.Width, g_preferences_on.Height, properties.darkTheme ? RGB(10, 10, 10) : RGBA(0, 0, 0, 10));
	//gb.DrawImage(icons25v35, g_sort_on.Width - bt_size, 0, bt_size, bt_size, properties.darkTheme ? 0 : bt_size, bt_size * 18, bt_size, bt_size);
	g_preferences_on.ReleaseGraphics(gb);

	//

	bt_size = 27;

	select_play_off = gdi.CreateImage(38, 38);
	gb = select_play_off.GetGraphics();
	gb.DrawImage(icons25v35, 4, 4, bt_size, bt_size, 0, bt_size * 26, bt_size, bt_size);
	select_play_off.ReleaseGraphics(gb);
	select_play_on = gdi.CreateImage(38, 38);
	gb = select_play_on.GetGraphics();
	gb.DrawImage(icons25v35, 4, 4, bt_size, bt_size, bt_size, bt_size * 26, bt_size, bt_size);
	select_play_on.ReleaseGraphics(gb);

	select_add_off = gdi.CreateImage(38, 38);
	gb = select_add_off.GetGraphics();
	gb.DrawImage(icons25v35, 4, 4, bt_size, bt_size, 0, bt_size * 27, bt_size, bt_size);
	select_add_off.ReleaseGraphics(gb);
	select_add_on = gdi.CreateImage(38, 38);
	gb = select_add_on.GetGraphics();
	gb.DrawImage(icons25v35, 4, 4, bt_size, bt_size, bt_size, bt_size * 27, bt_size, bt_size);
	select_add_on.ReleaseGraphics(gb);

	select_delete_off = gdi.CreateImage(38, 38);
	gb = select_delete_off.GetGraphics();
	gb.DrawImage(icons25v35, 4, 4, bt_size, bt_size, 0, bt_size * 29, bt_size, bt_size);
	select_delete_off.ReleaseGraphics(gb);
	select_delete_on = gdi.CreateImage(38, 38);
	gb = select_delete_on.GetGraphics();
	gb.DrawImage(icons25v35, 4, 4, bt_size, bt_size, bt_size, bt_size * 29, bt_size, bt_size);
	select_delete_on.ReleaseGraphics(gb);

	select_more_off = gdi.CreateImage(38, 38);
	gb = select_more_off.GetGraphics();
	gb.DrawImage(icons25v35, 4, 4, bt_size, bt_size, 0, bt_size * 28, bt_size, bt_size);
	select_more_off.ReleaseGraphics(gb);
	select_more_on = gdi.CreateImage(38, 38);
	gb = select_more_on.GetGraphics();
	gb.DrawImage(icons25v35, 4, 4, bt_size, bt_size, bt_size, bt_size * 28, bt_size, bt_size);
	select_more_on.ReleaseGraphics(gb);

	selectQuickMask = gdi.CreateImage(38, 38);
	gb = selectQuickMask.GetGraphics();
	gb.FillSolidRect(0, 0, selectQuickMask.Width, selectQuickMask.Height, RGB(255, 255, 255));
	gb.DrawImage(icons25v35, 4, 4, bt_size, bt_size, 0, bt_size * 39, bt_size, bt_size);
	selectQuickMask.ReleaseGraphics(gb);

	select_quick_off = gdi.CreateImage(38, 38);
	gb = select_quick_off.GetGraphics();
	gb.FillSolidRect(0, 0, select_quick_off.Width, select_quick_off.Height, RGB(255, 255, 255));
	select_quick_off.ReleaseGraphics(gb);
	select_quick_off.ApplyMask(selectQuickMask);

	select_quick_on = gdi.CreateImage(38, 38);
	gb = select_quick_on.GetGraphics();
	gb.FillSolidRect(0, 0, select_quick_on.Width, select_quick_on.Height, RGBA(255, 255, 255, 200));
	select_quick_on.ReleaseGraphics(gb);
	select_quick_on.ApplyMask(selectQuickMask);

	select_clear_off = gdi.CreateImage(38, 38);
	gb = select_clear_off.GetGraphics();
	gb.DrawImage(icons25v35, 4, 4, bt_size, bt_size, 0, bt_size * 16, bt_size, bt_size);
	select_clear_off.ReleaseGraphics(gb);
	select_clear_on = gdi.CreateImage(38, 38);
	gb = select_clear_on.GetGraphics();
	gb.DrawImage(icons25v35, 4, 4, bt_size, bt_size, bt_size, bt_size * 16, bt_size, bt_size);
	select_clear_on.ReleaseGraphics(gb);

	for (i = 0; i < 35; i++) {
		switch (i) {
		case 0:
			toolbar.buttons.push(new button(play_off, play_ov, play_on));
			break;
		case 1:
			toolbar.buttons.push(new button(next_off, next_ov, next_on));
			break;
		case 2:
			toolbar.buttons.push(new button(prev_off, prev_ov, prev_on));
			break;
		case 3:
			toolbar.buttons.push(new button(vol_off, vol_ov, vol_on));
			break;
		case 4:
			toolbar.buttons.push(new button(plback_off, plback_ov, plback_on));
			break;
		case 5:
			toolbar.buttons.push(new button(play_off, play_off, play_off));
			break;
		case 6:
			toolbar.buttons.push(new button(play_off, play_off, play_off));
			break;
		case 7:
			toolbar.buttons.push(new button(cover_off, cover_ov, cover_on));
			break;
		case 8:
			toolbar.buttons.push(new button(sett_off, sett_ov, sett_on));
			break;
		case 9:
			toolbar.buttons.push(new button(play_off, play_off, play_off));
			break;
		case 10:
			toolbar.buttons.push(new button(play_off, play_off, play_off));
			break;
		case 11:
			toolbar.buttons.push(new button(play_off, play_off, play_off));
			break;
		case 12:
			if (typeof(toolbar.buttons[i]) == "undefined") {
				toolbar.buttons.push(new button(pl_play_off, pl_play_ov, pl_play_on));
			} else {
				toolbar.buttons[i].img[0] = pl_play_off;
				toolbar.buttons[i].img[1] = pl_play_ov;
				toolbar.buttons[i].img[2] = pl_play_on;
			}
			break;
		case 13:
			if (typeof(toolbar.buttons[i]) == "undefined") {
				toolbar.buttons.push(new button(pl_add_off, pl_add_ov, pl_add_on));
			} else {
				toolbar.buttons[i].img[0] = pl_add_off;
				toolbar.buttons[i].img[1] = pl_add_ov;
				toolbar.buttons[i].img[2] = pl_add_on;
			}
			break;
		case 14:
			if (typeof(toolbar.buttons[i]) == "undefined") {
				toolbar.buttons.push(new button(pl_sett_off, pl_sett_ov, pl_sett_on));
			} else {
				toolbar.buttons[i].img[0] = pl_sett_off;
				toolbar.buttons[i].img[1] = pl_sett_ov;
				toolbar.buttons[i].img[2] = pl_sett_on;
			}
			break;
		case 15:
			toolbar.buttons.push(new button(g_albums_off, g_albums_ov, g_albums_on));
			break;
		case 16:
			toolbar.buttons.push(new button(g_artists_off, g_artists_ov, g_artists_on));
			break;
		case 17:
			toolbar.buttons.push(new button(g_genres_off, g_genres_ov, g_genres_on));
			break;
		case 18:
			toolbar.buttons.push(new button(g_songs_off, g_songs_ov, g_songs_on));
			break;
		case 19:
			var sort_txt = "?";
			switch (properties.TFsorting) {
			case SortByTracknumber:
				sort_txt = "track number";
				break;
			case SortByTitle:
				sort_txt = "title";
				break;
			case SortByAlbum:
				sort_txt = "album";
				break;
			case SortByArtist:
				sort_txt = "artist";
				break;
			case SortByGenre:
				sort_txt = "genre";
				break;
			case SortByYear:
				sort_txt = "year";
				break;
			case SortByStyle:
				sort_txt = "style";
				break;
			case SortByPublisher:
				sort_txt = "publisher";
				break;
			case SortByLength:
				sort_txt = "length";
				break;
			}
			toolbar.buttons.push(new popupButton("Sort by " + sort_txt, groupFont, (lGroup == "Albums" || lGroup == "Songs") ? [col_text1, accent_colour, col_text2] : [col_text2, col_text2, col_text2], [dropNormalImg, dropHoverImg, dropDownImg], 35, 10));
			break;
		case 20:
			if (typeof(toolbar.buttons[i]) == "undefined") {
				toolbar.buttons.push(new button(g_back_off, g_back_ov, g_back_on));
			} else {
				toolbar.buttons[i].img[0] = g_back_off;
				toolbar.buttons[i].img[1] = g_back_ov;
				toolbar.buttons[i].img[2] = g_back_on;
			}
			break;
		case 21:
			toolbar.buttons.push(new popupButton("Menu", gdi.Font("Segoe UI", 14), [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg], 35, 10));
			break;
		case 22:
			if (typeof(toolbar.buttons[i]) == "undefined") {
				toolbar.buttons.push(new button(pl_edit_off, pl_edit_ov, pl_edit_on));
			} else {
				toolbar.buttons[i].img[0] = pl_edit_off;
				toolbar.buttons[i].img[1] = pl_edit_ov;
				toolbar.buttons[i].img[2] = pl_edit_on;
			}
			break;
		case 23:
			toolbar.buttons.push(new popupButton(sortDirection == 1 ? "Ascending" : "Descending", groupFont, [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg], 35, 10));
			break;
		case 24:
			if (typeof(toolbar.buttons[i]) == "undefined") {
				toolbar.buttons.push(new button(select_play_off, select_play_off, select_play_on));
			} else {
				toolbar.buttons[i].img[0] = select_play_off;
				toolbar.buttons[i].img[1] = select_play_off;
				toolbar.buttons[i].img[2] = select_play_on;
			}
			break;
		case 25:
			if (typeof(toolbar.buttons[i]) == "undefined") {
				toolbar.buttons.push(new button(select_add_off, select_add_off, select_add_on));
			} else {
				toolbar.buttons[i].img[0] = select_add_off;
				toolbar.buttons[i].img[1] = select_add_off;
				toolbar.buttons[i].img[2] = select_add_on;
			}
			break;
		case 26:
			if (typeof(toolbar.buttons[i]) == "undefined") {
				toolbar.buttons.push(new button(select_delete_off, select_delete_off, select_delete_on));
			} else {
				toolbar.buttons[i].img[0] = select_delete_off;
				toolbar.buttons[i].img[1] = select_delete_off;
				toolbar.buttons[i].img[2] = select_delete_on;
			}
			break;
		case 27:
			if (typeof(toolbar.buttons[i]) == "undefined") {
				toolbar.buttons.push(new button(select_quick_off, select_quick_off, select_quick_on));
			} else {
				toolbar.buttons[i].img[0] = select_quick_off;
				toolbar.buttons[i].img[1] = select_quick_off;
				toolbar.buttons[i].img[2] = select_quick_on;
			}
			break;
		case 28:
			if (typeof(toolbar.buttons[i]) == "undefined") {
				toolbar.buttons.push(new button(select_clear_off, select_clear_off, select_clear_on));
			} else {
				toolbar.buttons[i].img[0] = select_clear_off;
				toolbar.buttons[i].img[1] = select_clear_off;
				toolbar.buttons[i].img[2] = select_clear_on;
			}
			break;
		case 29:
			toolbar.buttons.push(new popupButton(lGroup, groupFont, [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg], 35, 10));
			break;
		case 30:
			switch (favoritesPlType) {
			case 0:
				toolbar.buttons.push(new popupButton("Undefined", groupFont, [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg], 35, 10));
				break;
			case 1:
				toolbar.buttons.push(new popupButton("Loved", groupFont, [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg], 35, 10));
				break;
			case 2:
				toolbar.buttons.push(new popupButton("Hated", groupFont, [col_text1, accent_colour, col_text2], [dropNormalImg, dropHoverImg, dropDownImg], 35, 10));
				break;
			}
			break;
		}
	}

}

function check_toolbar_bt() {
	if (toolbar.buttons[0])
		for (i = 0; i < 5; i++) {
			switch (i) {
			case 0:
				if (!fb.IsPlaying || fb.IsPaused) {
					toolbar.buttons[i].update(play_off, play_ov, play_on);
				} else if (fb.IsPlaying) {
					toolbar.buttons[i].update(pause_off, pause_ov, pause_on);
				}
				break;
			}
		}
}
