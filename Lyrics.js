// Lyrics
var g_need_calc = true,
a_active,
g_active = false,
g_timer = null;
var g_textheight, g_offset, pW, pH = 0;
var metadb, fileinfo, g_text, g_nolyrics;
var lyric_font = window.GetProperty("Lyrics.Font", "Segoe UI");
var lyric_f_size = window.GetProperty("Lyrics.Font.Size", 12);
var g_font_headers = gdi.Font(lyric_font, lyric_f_size);
var ext_lyrics = window.GetProperty("Lyrics.Path", fb.FoobarPath + "lyrics\\" + ("%artist% - %title%"));

function opt_init() {
	a_scroll = window.GetProperty("Lyrics.Autoscroll.Enable", true);
	a_fader = window.GetProperty("Lyrics.Autoscroll.Fading", true);
	a_alignment = window.GetProperty("Lyrics.Alignment", "center");
}

opt_init();

function pad_init() {
	hPad = window.GetProperty("Lyrics.Padding", 30);
	if (typeof hPad != "number" || hPad < 0)
		hPad = 0;
}

pad_init();

var g_drag = false;
var g_drag_y = 0;

function get_text() {
	metadb = fb.GetNowPlaying();
	var a,
	b,
	c,
	d;
	var g_lyrcs = "?";

	g_nolyrics = "no lyrics";

	if (metadb) {

		g_lyrcs = fb.TitleFormat("$if2(%LYRICS%,%UNSYNCED LYRICS%)").Eval(true);

		if (g_lyrcs != "?") {
			g_text = g_lyrcs.replace(/\[..:.*?\]/g, "").replace(/^(\r?\n)+/g, "");
		} else {
			var arr = utils.Glob(fb.TitleFormat(ext_lyrics).Eval() + ".*").toArray();
			loop : for (var i = 0; i < arr.length; ++i) {
				if (arr[i].match(/\.lrc$/m)) {
					d = utils.ReadTextFile(arr[i]);
					break loop;
				} else if (arr[i].match(/\.txt$/m)) {
					d = utils.ReadTextFile(arr[i]);
					break loop;
				}
			}
			g_text = d ? d.replace(/\[..:.*?\]/g, "").replace(/^(\r?\n)+/g, "") : g_nolyrics;
		}
	} else {
		g_nolyrics = "Lyrics only available\n during playback";
		g_text = g_nolyrics;
	}
}

function calc() {
	var a = gdi.CreateImage(1, 1);
	var b = a.GetGraphics();
	arr = b.GdiDrawText(g_text, g_font_headers, g_textcolor, hPad, 0, pW, pH, 3093).toArray();
	g_textheight = arr[3] - arr[1];
	g_offset = a_active ? 0 : g_textheight > pH ? 0 : (pH - g_textheight) / 2;
	g_need_calc = false;
	a.ReleaseGraphics(b);
	a.Dispose();
	repaintLyrics();
}

function repaintLyrics() {
	window.RepaintRect(0, 0, ww, wh);
}

function applyDelta(delta) {
	var a = g_offset + delta;

	if (a <= 0 && a >= wh - (g_textheight + 20) || a_active) {
		g_offset = a;
		repaintLyrics();
	}
}

function reset() {
	g_need_calc = true;
	g_offset = 0;
	get_text();
}

function CustomMenuLyric(x, y) {
	var a = window.CreatePopupMenu();
	var f = window.CreatePopupMenu();
	var al = window.CreatePopupMenu();
	var idx;

	al.AppendTo(a, 0, "Lyric alignment");
	al.AppendMenuItem(MF_STRING, 20, "Left");
	al.AppendMenuItem(MF_STRING, 21, "Center");
	al.AppendMenuItem(MF_STRING, 22, "Right");
	al.CheckMenuRadioItem(20, 22, a_alignment == "left" ? 20 : a_alignment == "center" ? 21 : a_alignment == "right" ? 22 : false);

	f.AppendTo(a, 0, "Lyric font size");
	for (var b = 8; b < 16; b++) {
		f.AppendMenuItem(MF_STRING, b, b);
	}
	f.CheckMenuRadioItem(8, 15, lyric_f_size);

	a.AppendMenuItem(MF_STRING, 2, "Enable scroll");
	a.CheckMenuItem(2, a_scroll);

	a.AppendMenuItem(a_scroll ? MF_STRING : MF_GRAYED, 3, "Enable fading");
	a.CheckMenuItem(3, a_fader);

	a.AppendMenuSeparator();
	a.AppendMenuItem(0, 1, "Refresh");

	if (utils.IsKeyPressed(VK_SHIFT)) {
		a.AppendMenuSeparator();
		a.AppendMenuItem(MF_STRING, 5, "Properties");
		a.AppendMenuItem(MF_STRING, 6, "Configure");
	}

	idx = a.TrackPopupMenu(x, y);

	if (idx != 0)
		switch (true) {
		case (idx == 1):
			reset();
			repaintLyrics();
			break;

		case (idx == 2):
			window.SetProperty("Lyrics.Autoscroll.Enable", a_scroll ? false : true);
			opt_init();
			on_playback_new_track(metadb);
			break;

		case (idx == 3):
			window.SetProperty("Lyrics.Autoscroll.Fading", a_fader ? false : true);
			opt_init();
			repaintLyrics();
			break;

		case (idx == 5):
			window.ShowProperties();
			break;

		case (idx == 6):
			window.ShowConfigure();
			break;

		case (idx >= 8 && idx <= 15):
			window.SetProperty("Lyrics.Font.Size", lyric_f_size = idx);
			g_font_headers = gdi.Font(lyric_font, lyric_f_size);
			reset();
			break;

		case (idx == 20):
			window.SetProperty("Lyrics.Alignment", a_alignment = "left");
			reset();
			break;

		case (idx == 21):
			window.SetProperty("Lyrics.Alignment", a_alignment = "center");
			reset();
			break;

		case (idx == 22):
			window.SetProperty("Lyrics.Alignment", a_alignment = "right");
			reset();
			break;
		}

	a.Dispose();
	al.Dispose();
	f.Dispose();
}
