// Skin Path
var Skin_Path = fb.FoobarPath + "themes\\Fusion\\";

var ww = wh = 0;
ww = window.Width;
wh = window.Height;

// Images
var icons25v35 = createImage(gdi.Image(Skin_Path + "Images\\icons\\icons-25-v3.5.png"));
var iconsPlayer30v09 = createImage(gdi.Image(Skin_Path + "Images\\icons\\icons-player-30-v0.9.png"));
var icons40v28 = createImage(gdi.Image(Skin_Path + "Images\\icons\\icons-40-v2.8.png"));

var mediaMissingAlbum = createImage(gdi.Image(Skin_Path + "Images\\icons\\media-missing-album-v0.1.png"));
var mediaMissingArtist = createImage(gdi.Image(Skin_Path + "Images\\icons\\media-missing-artist-v0.1.png"));
var mediaMissingGenre = createImage(gdi.Image(Skin_Path + "Images\\icons\\media-missing-genre-v0.1.png"));

var iconsSearch = createImage(gdi.Image(Skin_Path + "Images\\icons\\icons-search.png"));
var icons_back_v01 = createImage(gdi.Image(Skin_Path + "Images\\icons\\icons-back-v0.1.png"));
var icons_mood = createImage(gdi.Image(Skin_Path + "Images\\icons\\icons-rated.png"));
var iconsScrollv01 = createImage(gdi.Image(Skin_Path + "Images\\icons\\icons-scroll-v0.1.png"));

var Mask_img = gdi.CreateImage(icons25v35.Width, icons25v35.Height);
gb = Mask_img.GetGraphics();
gb.FillSolidRect(0, 0, Mask_img.Width, Mask_img.Height, RGB(255, 255, 255));
gb.DrawImage(icons25v35, 0, 0, Mask_img.Width, Mask_img.Height, 0, 0, Mask_img.Width, Mask_img.Height);
Mask_img.ReleaseGraphics(gb);

// icons list
var iconsB_img = gdi.CreateImage(Mask_img.Width, Mask_img.Height);
gb = iconsB_img.GetGraphics();
gb.FillSolidRect(0, 0, Mask_img.Width, Mask_img.Height, RGB(35, 35, 35));
iconsB_img.ReleaseGraphics(gb);
iconsB_img.ApplyMask(Mask_img);

var iconsW_img = gdi.CreateImage(Mask_img.Width, Mask_img.Height);
gb = iconsW_img.GetGraphics();
gb.FillSolidRect(0, 0, Mask_img.Width, Mask_img.Height, RGB(255, 255, 255));
iconsW_img.ReleaseGraphics(gb);
iconsW_img.ApplyMask(Mask_img);

var dropNormalMask = gdi.CreateImage(27, 27);
gb = dropNormalMask.GetGraphics();
gb.FillSolidRect(0, 0, dropNormalMask.Width, dropNormalMask.Height, RGB(255, 255, 255));
gb.DrawImage(icons25v35, 0, 0, dropNormalMask.Width, dropNormalMask.Height, dropNormalMask.Width, dropNormalMask.Height * 18, dropNormalMask.Width, dropNormalMask.Height);
dropNormalMask.ReleaseGraphics(gb);

// Fonts
var plTextFont = gdi.Font("Segoe UI", 25, 1);
var albumFont = gdi.Font("Segoe UI", 14);
var albumArtistFont = gdi.Font("Segoe UI", 12);
var listAlbumFont = gdi.Font("Segoe UI", 18, 1);
var listAlbumArtistFont = gdi.Font("Segoe UI", 12);
var listTracknumberFont = gdi.Font("Segoe UI", 14);
var listdurationFont = gdi.Font("Segoe UI", 12);
var listTrackFont = gdi.Font("Segoe UI", 14);
var playlistsFont = gdi.Font("Segoe UI", 14);
var playlistsFont2 = gdi.Font("Segoe UI", 12);
var barTextFont = gdi.Font("Segoe UI", 14);
var barTextFont2 = gdi.Font("Segoe UI", 12);
var timeFont = gdi.Font("Segoe UI Semibold", 12);
var groupFont = gdi.Font("Segoe UI", 14);
var messageTitleFont = gdi.Font("Segoe UI Light", 35);
var messageTitleFont2 = gdi.Font("Segoe UI", 20);
var messageBodyFont = gdi.Font("Segoe UI", 14);
var messageBodyFont2 = gdi.Font("Segoe UI", 14);
var songsColumnNameFont = gdi.Font("Segoe UI", 14,1);

// DrawTextFormat
var drawTextFormat = DT_LEFT | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX;
var drawTextFormat2 = DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX;

// TitleFormat
var SortByTracknumber = window.GetProperty("Sort by track number TitleFormat", "%tracknumber% | %title%[ | %track artist%]");
var SortByTitle = window.GetProperty("Sort by title TitleFormat", "%title%[ | %track artist%]");
var SortByAlbum = window.GetProperty("Sort by album TitleFormat", "$if(%album%,%album%,$if(%album artist%,'Single(s)','Unknown Album')) | %album artist% | $if(%album%,%date%,'9999') | %discnumber% | %tracknumber% | %title%[ | %track artist%]");
var SortByArtist = window.GetProperty("Sort by artist TitleFormat", "$if2(%album artist%,'Unknown Artist') | $if(%album%,%date%,'9999') | $if(%album%,%album%,$if(%album artist%,'Single(s)','Unknown Album')) | %discnumber% | %tracknumber% | %title%[ | %track artist%]");
var SortByGenre = window.GetProperty("Sort by genre TitleFormat", "$if2(%genre%,'Unknown Genre') | %album artist% | $if(%album%,%date%,'9999') | $if(%album%,%album%,$if(%album artist%,'Single(s)','Unknown Album')) | %discnumber% | %tracknumber% | %title%[ | %track artist%]");
var SortByStyle = window.GetProperty("Sort by style TitleFormat", "$if2(%style%,'Unknown Style') | %album artist% | $if(%album%,%date%,'9999') | $if(%album%,%album%,$if(%album artist%,'Single(s)','Unknown Album')) | %discnumber% | %tracknumber% | %title%[ | %track artist%]");
var SortByYear = window.GetProperty("Sort by year TitleFormat", "[%date%] | %album artist% | $if(%album%,%album%,$if(%album artist%,'Single(s)','Unknown Album')) | %discnumber% | %tracknumber% | %title%[ | %track artist%]");
var SortByPath = window.GetProperty("Sort by path TitleFormat", "%path%");
var SortByPublisher = window.GetProperty("Sort by publisher TitleFormat", "%publisher% | %album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%[ | %track artist%]");
var SortByLength = window.GetProperty("Sort by length TitleFormat", "%length%");

/*
var groupByAlbumSimple = window.GetProperty("Group by albumSimple TitleFormat", "$if2(%album artist%,'Unknown Artist')$if(%album%,%album%,$if(%album artist%,'Single(s)','Unknown Album'))");
var groupByAlbumByDisc = window.GetProperty("Group by albumByDisc TitleFormat", "$if2(%album artist%,'Unknown Artist')$if(%album%,%album%$ifgreater(%totaldiscs%,'1',[', disc' %discnumber%],),$if(%album artist%,'Single(s)','Unknown Album'))");
var groupByArtist = window.GetProperty("Group by artist TitleFormat", "$if2(%album artist%,'Unknown Artist')");
var groupByGenre = window.GetProperty("Group by genre TitleFormat", "$if2(%genre%,'Unknown Genre')");
 */
var groupByAlbumSimple = window.GetProperty("Group by albumSimple TitleFormat", "$if2(%album artist%,'Unknown Artist')$if(%album%,%album%,$if(%album artist%,'Single(s)','Unknown Album'))");
var groupByAlbumByDisc = window.GetProperty("Group by albumByDisc TitleFormat", "$if2(%album artist%,'Unknown Artist')$if(%album%,%album%$ifgreater(%totaldiscs%,'1',[', disc' %discnumber%],),$if(%album artist%,'Single(s)','Unknown Album'))");
var groupByArtist = window.GetProperty("Group by artist TitleFormat", "$if2(%album artist%,'Unknown Artist')");
var groupByGenre = window.GetProperty("Group by genre TitleFormat", "$if2(%genre%,'Unknown Genre')");

var list_tf_albumSimple = "$if(%album%,%album%,$if(%album artist%,'Single(s)','Unknown Album'))";
var list_tf_albumByDisc = "$if(%album%,%album%$ifgreater(%totaldiscs%,'1',[', disc' %discnumber%],),$if(%album artist%,'Single(s)','Unknown Album'))";

var vTitleFormatSimple = "$if2(%album artist%,'Unknown Artist') ^^ $if(%album%,%album%,$if(%album artist%,'Single(s)','Unknown Album')) ^^ $if2(%genre%,'Unknown Genre') ^^ %artist% ^^ %title% ^^ [%date%] ^^ %comment% ^^ %path% ^^ $if2(%style%,'Unknown Style') ^^ $if2(%publisher%,'Unknown Publisher')";
var vTitleFormatByDisc = "$if2(%album artist%,'Unknown Artist') ^^ $if(%album%,%album%$ifgreater(%totaldiscs%,'1',[', disc' %discnumber%],),$if(%album artist%,'Single(s)','Unknown Album')) ^^ $if2(%genre%,'Unknown Genre') ^^ %artist% ^^ %title% ^^ [%date%] ^^ %comment% ^^ %path% ^^ $if2(%style%,'Unknown Style') ^^ $if2(%publisher%,'Unknown Publisher')";

// Properties
var properties = {
	darkTheme : window.GetProperty("Dark theme", false),
	showBottomPanel : window.GetProperty("Show bottom panel", true),
	showleftPanel : window.GetProperty("Show left panel", true),
	separateAlbumsByDisc : window.GetProperty("Separate albums by disc", true),
	showscrollbar : window.GetProperty("Scrollbar - Visible", true),
	//columnWidthMin : window.GetProperty("List columns width min", 300),
	listHeightMin : window.GetProperty("List height min", 350),
	listColumnsRow : window.GetProperty("List columns row", 35),
	listShowCoverArt : window.GetProperty("List show cover art", true),
	listCoverColor : window.GetProperty("Use cover color in expanded list", false),
	followNowPlaying : fb.CursorFollowPlayback,
	repaint_rate : window.GetProperty("Repaint rate", 38),
	expandInPlace : true,
	thumbnailWidthMin : window.GetProperty("Thumbnails minimal width", 150),
	artistthumbnailWidthMin : window.GetProperty("Artist thumbnails minimal width", 130),
	loadInBackground : window.GetProperty("Load hidden covers in background", true),
	TFgrouping : window.GetProperty("Library Group TitleFormat", groupByAlbumSimple),
	TFsorting : window.GetProperty("Library Sort TitleFormat", SortByAlbum),
	smooth_scroll_value : window.GetProperty("Smooth scroll value", 2),
	smooth_expand_value : window.GetProperty("Smooth expand value", 2),
	show_masterVolume : window.GetProperty("Show master volume", false),
	showCountTracks : window.GetProperty("Show album count tracks", false),
	showPlCountTracks : window.GetProperty("Show playlists count tracks", false),
	showGrid : false
}

properties.smooth_scroll_value = properties.smooth_scroll_value < 1 ? 1 : properties.smooth_scroll_value;
properties.smooth_expand_value = properties.smooth_expand_value < 1 ? 1 : properties.smooth_expand_value;

var groupByAlbum = properties.separateAlbumsByDisc ? groupByAlbumByDisc : groupByAlbumSimple;
//properties.TFgrouping = groupByAlbum;
//properties.TFsorting = SortByAlbum;

// Cover
var cover = {
	load_timer : false,
	done_timer : false,
	margin : 0,
	max_w : 0,
	max_h : 0,
	draw_glass_reflect : false,
	type : 0,
	keepaspectratio : true,
	raw_bitmap : window.GetProperty("Raw bitmap", false),
	glass_reflect : draw_glass_reflect(200, 200)
}

// Scheduler
var Scheduler = {
	timer_started : false,
	timer : 0,
	timersec : 0,
	seconds : 0,
	timeout : 0,
	counter : 0,
	counter_started : false,
	counter_limit : 0,
	mode : window.GetProperty("Scheduler Mode", 5),
	st : window.GetProperty("Scheduler st", 0),
	m_clicked : 0
}

var deepBlue = 0;

if (deepBlue) {
	var accent_colour_p = window.GetProperty("Accent colour", "RGB(72, 207, 173)");
	var accent_colour = eval(accent_colour_p);
	var col_bg = properties.darkTheme ? RGB(21, 29, 40) : RGB(230, 230, 230);
	var col_bg_bar = properties.darkTheme ? RGB(12, 22, 32) : RGB(237, 237, 237);
	var col_bg_pl = properties.darkTheme ? RGB(17, 24, 34) : RGB(220, 220, 220);
	var col_text1 = properties.darkTheme ? RGB(79, 193, 233) : RGB(133, 133, 133);
	var col_text2 = properties.darkTheme ? RGB(55, 188, 155) : RGB(168, 168, 168);
	var col_bar_title = properties.darkTheme ? RGB(79, 193, 233) : RGB(137, 137, 137);
	var col_bar_artist = properties.darkTheme ? RGB(72, 207, 173) : RGB(139, 139, 139);
	var col_bar_vol = RGB(134, 134, 134);
	var seek_col_solid = properties.darkTheme ? col_text1 : RGB(133, 133, 133);
	var seek_col_back = properties.darkTheme ? setAlpha(col_text2, 50) : RGB(255, 255, 255);
	var seek_col_txt = properties.darkTheme ? RGB(79, 193, 233) : RGB(136, 136, 136);
	var playlists_col_col = properties.darkTheme ? RGB(79, 193, 233) : RGB(100, 100, 100);
	var col_bt_text = RGB(255, 255, 255);

	var col_searchBox_bg = properties.darkTheme ? RGB(35, 45, 55) : RGB(255, 255, 255);
	var col_groupBtBg_inactive = RGB(255, 255, 255);
	var col_groupBttxt_inactive = properties.darkTheme ? RGB(235, 235, 235) : RGB(35, 35, 35);
	var col_plSeparator = col_searchBox_bg;
	var col_listSchemeBack = properties.darkTheme ? RGB(6, 16, 26) : RGB(236, 236, 236);
	var show_ListBorder = 0;

	var col_noCoverBG = RGB(17, 24, 34);
	var col_noCoverLine = RGB(37, 44, 54);

} else {
	var accent_colour_p = window.GetProperty("Accent colour", "RGB(16,124,16)");
	var accent_colour = eval(accent_colour_p);
	var col_bg = properties.darkTheme ? RGB(34, 34, 34) : RGB(225, 225, 225);
	var col_bg_bar = RGB(16, 16, 16);
	var col_bg_pl = properties.darkTheme ? RGB(24, 24, 24) : RGB(34, 34, 34);
	var col_text1 = properties.darkTheme ? RGB(233, 233, 233) : RGB(33, 33, 33);
	var col_text2 = properties.darkTheme ? RGB(124, 124, 124) : RGB(98, 98, 98);
	var col_bar_title = RGB(237, 237, 237);
	var col_bar_artist = properties.darkTheme ? RGB(124, 124, 124) : RGB(139, 139, 139);
	var col_bar_vol = RGB(134, 134, 134);
	var seek_col_solid = accent_colour;
	var seek_col_back = properties.darkTheme ? RGB(35, 35, 35) : RGB(57, 57, 57);
	var seek_col_txt = properties.darkTheme ? RGB(124, 124, 124) : RGB(136, 136, 136);
	var playlists_col_col = RGB(255, 255, 255);
	var col_bt_text = RGB(255, 255, 255);

	var col_searchBox_bg = RGB(58, 58, 58);
	var col_groupBtBg_inactive = RGB(95, 95, 95);
	var col_groupBttxt_inactive = properties.darkTheme ? RGB(255, 255, 255) : RGB(255, 255, 255);
	var col_plSeparator = col_searchBox_bg;
	var col_listSchemeBack = properties.darkTheme ? RGB(20, 20, 20) : RGB(240, 240, 240);
	var show_ListBorder = 1;

	var col_noCoverBG = RGB(100, 100, 100);
	var col_noCoverLine = RGB(124, 124, 124);

}

var col1 = "RGB(164, 196, 0)";
var col2 = "RGB(96, 169, 23)";
var col3 = "RGB(0, 119, 1)";
var col4 = "RGB(0, 171, 169)";
var col5 = "RGB(27, 161, 226)";
var col6 = "RGB(0, 80, 239)";
var col7 = "RGB(106, 0, 255)";
var col8 = "RGB(170, 0, 255)";
var col9 = "RGB(244, 114, 208)";
var col10 = "RGB(216, 0, 115)";
var col11 = "RGB(162, 0, 37)";
var col12 = "RGB(229, 20, 0)";
var col13 = "RGB(250, 104, 0)";
var col14 = "RGB(240, 163, 10)";
var col15 = "RGB(227, 200, 0)";
var col16 = "RGB(130, 90, 44)";
var col17 = "RGB(109, 135, 100)";
var col18 = "RGB(100, 118, 135)";
var col19 = "RGB(118, 96, 138)";
var col20 = "RGB(135, 121, 78)";
var col21 = "RGB(0, 0, 0)";

var Colours = {
	accent : [col1, col2, col3, col4, col5, col6, col7, col8, col9, col10, col11, col12, col13, col14, col15, col16, col17, col18, col19, col20, col21],
}

var dropNormalImg = gdi.CreateImage(dropNormalMask.Width, dropNormalMask.Height);
gb = dropNormalImg.GetGraphics();
gb.FillSolidRect(0, 0, dropNormalImg.Width, dropNormalImg.Height, col_text1);
dropNormalImg.ReleaseGraphics(gb);
dropNormalImg.ApplyMask(dropNormalMask);

var dropHoverImg = gdi.CreateImage(dropNormalMask.Width, dropNormalMask.Height);
gb = dropHoverImg.GetGraphics();
gb.FillSolidRect(0, 0, dropHoverImg.Width, dropHoverImg.Height, accent_colour);
dropHoverImg.ReleaseGraphics(gb);
dropHoverImg.ApplyMask(dropNormalMask);

var dropDownImg = gdi.CreateImage(dropNormalMask.Width, dropNormalMask.Height);
gb = dropDownImg.GetGraphics();
gb.FillSolidRect(0, 0, dropDownImg.Width, dropDownImg.Height, col_text2);
dropDownImg.ReleaseGraphics(gb);
dropDownImg.ApplyMask(dropNormalMask);

var menuImg = gdi.CreateImage(27, 27);
gb = menuImg.GetGraphics();
//gb.FillSolidRect(0, 0, menuImg.Width, menuImg.Height, col_text2);
gb.DrawImage(icons25v35, 8, 0, menuImg.Width, menuImg.Height, 0, menuImg.Height * 20, menuImg.Width, menuImg.Height, 0, 150);
bt_size = 32;
menos = 10;
gb.DrawImage(iconsPlayer30v09, -7, -2, bt_size - menos - 2, bt_size - menos, bt_size * 3, bt_size * 17, bt_size - menos - 2, bt_size - menos);
menuImg.ReleaseGraphics(gb);

//dropNormalMask.Dispose();

var colorSchemeBack = 0;
var colorSchemeBackInvert = 0;
var colorSchemeText = 0;
var colorSchemeText2 = 0;
var colorSchemeTextSelect = 0;

// bbar
var vBar_h = 75;
var Bar_h = vBar_h;

// PlM
var g_plmanager = null;
var g_filterbox = null;
var pl_h = 35;
var pl_y = pl_h * 3; //105;
var pl_deafult_w = 250;
var pl_minideafult_w = 80;
var pl_w = window.GetProperty("Playlist Manager - Width", pl_deafult_w);
var pl_sep = 35;
//var plm_rbtnUp = [];

// Browser Margin
var marginL = 40;

// Groups
var lGroup = window.GetProperty("Group active", "Albums");
var oldlGroup = lGroup;
var tabActive = "Collection"; //"Now_Playing";//

var old_pl_selection;
var old_group_selection = groupByArtist;
var old_sort_selection = SortByAlbum;

//

var g_showPLM = true;

// metadb
var db = fb.IsPlaying ? fb.GetNowPlaying() : false;

// TitleFormat
var tf1_artist = fb.TitleFormat("$if(%length%,$if2(%artist%,'Unknown Artist'),'Stream')");
var tf1_album = fb.TitleFormat("$if(%length%,$if2(%album%,'Unknown Album'),'Web Radios')");
var tf1_title = fb.TitleFormat("[%title%]");
var tf1_len = fb.Titleformat("[%length%]");
var tf1_elap = fb.TitleFormat("[%playback_time%]");
var tf1_remain = fb.TitleFormat("['-'%playback_time_remaining%]");
var tf1_mood = fb.TitleFormat("$if($stricmp(%mood%,),-1)$if($stricmp(%mood%,Like it),1)$if($stricmp(%mood%,Hate it),2)");

var g_artist = g_album = g_title = g_mood = "";
var g_len = g_elap = g_remain = "0:00";

// Cover
var cover_x = 10;
var cover_y = cover_x;
var CoverSize = vBar_h - cover_x * 2;
var b_cover_img = null;
var b_cover_img2 = null;
var ArtId = 0;
var AlbumArtEmbedded = false;
var AlbumArtPath;
var cover_hover = false;

// Seekbar
var g_seekbar = null;
var seekbar_x = pl_w < 100 ? pl_deafult_w + marginL : pl_w + marginL;
var seekbar_w = 100;
var seekbar_y = 0;
var seekbar_h = 5;

var toolbar = {
	stopped : false,
	randomize : false,
	button_lbtn_dblclk_stop : window.GetProperty("Stop on dblclk play/paused button", false),
	button_lbtn_dblclk_random : window.GetProperty("Random on dblclk next/prev button", false),
	buttons : Array()
}

// Buttons bbar
var bt_play_x = 0;
var bt_play_y = 40;
var bt_sep = 60;

// Volume
var g_volume = null;
var show_volume = hover_volume = false;
var vol_x = vol_y = 0,
vol_w = 5,
vol_h = 120;
var vol_margen_x = 25;
var vol_margen_y = 60;
var vol_margen_w = properties.show_masterVolume ? vol_margen_x * 2 + vol_w : vol_margen_x * 4 + vol_w * 2 + 3;
var vol_margen_h = vol_margen_y + 30;

// Queue
var queue_total = 0;
var g_queue = false;

//

var hoverPLButtons = false;
var showPLButtons = false;

var hover_toolbar = false;

// var showcover_mode2 = window.GetProperty("itunes 12 style", false);
var NewPlaylistDialog = false;

//

var g_reload = false;
var g_seconds = 0;
var g_avoid_on_playlists_changed = false;
var repaintforced = false;
var isScrolling = false;
var launch_time = fb.CreateProfiler("launch_time");
var g_syscolor_button_face = utils.GetSysColor(15);
var g_textcolor = g_textcolor_hl = g_backcolor = 0;
var m_x = m_y = 0;

var g_ishover = false;
var g_browser = null;
var g_scrollbar = null;
var g_image_cache = null;
var g_artist_image_cache = null;
var g_genre_image_cache = null;

var g_showlist = null;

var form_text = "";
var repaint_main = repaint_main1 = repaint_main2 = true;
var window_visible = false;

var scrollOld_ = scrollOld = 0;

var scroll_ = scroll = 0;
var g_scroll_step = 1;
var g_step = g_step_ = 0;

var filter_text = "";
var timerList = false;
var g_end = g_last = 0;
var g_hiddenLoadTimer = false;
var selected_row = null;
var rowSelection = null;
var g_dragA = g_dragR = g_dragC = false;
var g_dragA_idx = -1;
var g_metadb_timer = false;
var g_library_to_reload = false;

var images = {
	small_coversize_icon : null,
	big_coversize_icon : null,
	coversize_cursor_off : null,
	coversize_cursor_ov : null,
	coversize_ruler : null
}

// playlist panel variables
var g_drag_timer = g_dragup_timer = g_dragup_flash = false;
var g_dragup_flashescounter = 0;
var g_flash_idx = -1;
var g_scroll_playlist_timer = false;

var gtt = fb.CreateProfiler();

// animacion cambio playlist
var alphaPLSwitch = 0;

// drag and drop callbacks
var wsh_dragging = false;

// on_focus fb2k
var fb2k_focus = true;

// on_item_focus_change
var focusedTrackId = null;

var anim_img = new Array();
var anim_n = 0;
var show_anim = window.GetProperty("Show loading screen", false);
var g_start_Timeout;
var g_start_time;

for (var i = 0; i < 61; i++) {
	anim_img[i] = createImage(gdi.Image(Skin_Path + "Images\\Load\\load_00" + ((i < 10) ? "0" : "") + String(i) + ".png").Resize(40, 40));
}

if (show_anim) {
	g_start_time = window.SetInterval(function () {
			if (anim_n < anim_img.length - 1)
				anim_n = anim_n + 1;
			else
				anim_n = 0;
			window.RepaintRect(ww - Math.round((ww + anim_img[anim_n].Height) / 2), wh - Math.round((wh + anim_img[anim_n].Height - 20) / 2), anim_img[anim_n].Height, anim_img[anim_n].Height);
		}, 70);
	g_start_Timeout = window.SetTimeout(function () {
			show_anim = false;
			window.Repaint();
			g_start_time && window.ClearInterval(g_start_time);
			g_start_time = false;
			g_start_Timeout && window.ClearTimeout(g_start_Timeout);
			g_start_Timeout = false;
		}, 4270);
}

var g_nowplaying = null;
var g_settings = null;

var sortDirection = 1; // direction: 1= Sort ascendingly, -1= Sort descendingly
var selectedIndex, tempFocusItemIndex;
var selectedIndexes = [];

var popup_selections = window.GetProperty("Show popup selections", true);
var draw_immediately = window.GetProperty("draw_immediately", true);
var artistDisplay_v2 = window.GetProperty("Artist display v2", true);
//var show_albumPlbackBtts = window.GetProperty("Show album buttons", true);
var largeNowPlayingArtwork = window.GetProperty("Large now playing artwork", false);
var largeNowPlayingArtworkX = 20;

var listRightArtwork = window.GetProperty("Move artwork to left in expanded list", true);

var listbackgroundArtworkType = window.GetProperty("Show artwork background type in expanded list", 0);
var listbackgroundArtwork = window.GetProperty("Show cover artwork as background in expanded list", false);
var listbackgroundBlurred = window.GetProperty("Blurred wallpaper in expanded list", true);

var returnedPos = false;

var showTopPlName = 1;

// Properties
var g_info = null;
var rightPanel = window.GetProperty("Show properties panel", false);
var rightPanelAlbumArt = window.GetProperty("Show album art in properties panel", false);
var rightPanelW = 350;

var g_queue = null;

var mouse_x, mouse_y;

var hideMenuBar = window.GetProperty("Hide menu bar", MainMenuState.Hide);
var hideStatusBar = window.GetProperty("Hide status bar", true);
if (UIHacks) {
	UIHacks.MainMenuState = hideMenuBar;
	UIHacks.StatusBarState = !hideStatusBar;
}

cScrollBar = {
	width : 17,
	buttonType : {
		cursor : 0,
		up : 1,
		down : 2
	},
	bt_h : 40,
	timerID : false,
	parentObjectScrolling : null,
	timerID1 : false,
	timerID2 : false,
	timerCounter : 0,
	timer_repaint : false
};

var textSeparator = " " + String.fromCharCode(8226) + " ";

var favoritesPlType = window.GetProperty("Favorites Playlist Type", 1);