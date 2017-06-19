var np_h = 510;
var q_h = 680;

var oNowPlaying = function () {
	this.x = 0;
	this.y = 0;
	this.w = 0;
	this.h = 0;
	this.margins = marginL;
	this.showLyrics = 0;

	this.setSize = function (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	this.draw = function (gr) {
		gr.FillSolidRect(this.x, this.y, this.w, this.h, RGB(12, 12, 12));

		var TXTy = this.h - 100;

		if (fb.IsPlaying || fb.IsPaused) {
			if (!cover.raw_bitmap)
				draw_image(gr, b_cover_img2, this.x, this.y, this.w, this.h, "crop top", 0, 0, 255);
			else
				draw_Bitmap(gr, b_cover_img2, this.x, this.y, this.w, this.h, "crop top", 0);
			b_cover_img2 && gr.FillSolidRect(this.x, this.y, this.w, this.h, RGBA(0, 0, 0, 120));

			if (this.h > 100) {

				gr.GdiDrawText(g_title, gdi.Font("Segoe UI semibold", 28, 0), RGB(255, 255, 255), this.x + this.margins, TXTy + 35 * 1 - 2, this.w - this.margins * 2, 35, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
				gr.GdiDrawText(g_artist + textSeparator + g_album, gdi.Font("Segoe UI", 18), RGB(255, 255, 255), this.x + this.margins, TXTy + 35 * 2, this.w - this.margins * 2, 35, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			}

		}
		
		if (this.h > 200)
			gr.gdiDrawText("Now playing", gdi.Font("Segoe UI", 14, 1), RGB(255, 255, 255), this.x + this.margins, this.y + 25, this.w - this.margins * 1, 35, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);

		/*
		if (this.showLyrics) {
		var lh = 500;
		var lw = 600;
		var bx = ww - Math.round((ww + lw) / 2) + 0;
		var by = wh - Math.round((wh + lh) / 2) + 0;
		var bw = lw - 80;

		gr.FillSolidRect(0, 0, ww, wh, RGBA(0, 0, 0, 130));
		gr.FillSolidRect(ww - Math.round((ww + lw) / 2), wh - Math.round((wh + lh) / 2), lw, lh, RGB(255, 255, 255));

		gr.gdiDrawText("Lyrics", gdi.Font("Segoe UI", 22), RGB(0, 0, 0), ww - Math.round((ww + lw) / 2) + 40, wh - Math.round((wh + lh) / 2) + 44, lw - 80, 40, DT_LEFT | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
		gr.GdiDrawText(fb.TitleFormat("$if2(%LYRICS%,%UNSYNCED LYRICS%)").Eval(true).replace(/\[..:.*?\]/g, "").replace(/^(\r?\n)+/g, ""), gdi.Font("Segoe UI", 14), RGB(0, 0, 0), ww - Math.round((ww + lw) / 2) + 40, wh - Math.round((wh + lh) / 2) + 80, 600 - 80, 400, DT_CENTER | DT_TOP | DT_CALCRECT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);
		}
		 */
	}
}
