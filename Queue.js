function Remove_iFromPlaybackQueue() {
	var affectedItems = Array();
	for (var i = 0; i < plman.GetPlaybackQueueCount(); i++) {
		affectedItems.push(i);
	}
	plman.RemoveItemsFromPlaybackQueue(affectedItems);
}

function queue_menu_context(x, y) {
	var _menu = window.CreatePopupMenu();
	var queueActive = plman.IsPlaybackQueueActive();

	if (queueActive)
		_menu.AppendMenuItem(MF_STRING, 1, "Flush playback queue");

	var idx = _menu.TrackPopupMenu(x, y);
	switch (idx) {
	case 1:
		plman.FlushPlaybackQueue();
		break;
	}

	_menu.Dispose();
	return true;
}

function queue_cmenu(x, y, metadb) {
	var _menu = window.CreatePopupMenu();

	var Context = fb.CreateContextMenuManager();

	_menu.AppendMenuItem(MF_STRING, 2, "Flush playback queue");
	_menu.AppendMenuSeparator();

	Context.InitContext(metadb);
	Context.BuildMenu(_menu, 100, -1);

	var ret = 0;
	ret = _menu.TrackPopupMenu(x, y);
	switch (true) {
	case ret == 2:
		plman.FlushPlaybackQueue();
		break;
	case ret > 0:
		Context.ExecuteByID(ret - 100);
		break;

	}

	Context.Dispose();
	_menu.Dispose();
	return true;
}

var oItems = function (metadb) {
	this.x = 0;
	this.y = 0;
	this.w = 0;
	this.margins = 40;
	this.row = properties.listColumnsRow;

	this.font2 = gdi.font("Segoe UI", 12);
	this.font1 = gdi.font("Segoe UI", 14);

	this.metadb = metadb;
	this.tf_title;
	this.tf_tracknumber;
	this.tf_artist;
	this.tf_album;
	this.tf_length;

	this.draw = function (gr, x, y, w, parity) {
		this.x = x;
		this.y = y;
		this.w = w;

		this.tf_tracknumber = $("[%tracknumber%]", this.metadb);
		if (this.tf_tracknumber < 10 && this.tf_tracknumber != "")
			this.tf_tracknumber = this.tf_tracknumber.substr(1, 1);
		this.tf_title = $("[%title%]", this.metadb);
		this.tf_artist = $("$if(%length%,$if2(%artist%,'Unknown Artist'),'Stream')", this.metadb);
		this.tf_album = $("$if(%length%,$if2(%album%,'Unknown Album'),'Web Radios')", this.metadb);
		this.tf_length = $("%length%", this.metadb);

		if (parity == 1)
			gr.FillSolidRect(this.x + 10, this.y, this.w - 20, this.row, setAlpha(col_text1, properties.darkTheme ? 5 : 10));

		if (this.ishover)
			gr.FillSolidRect(this.x + 10, this.y, this.w - 20, this.row, setAlpha(col_text1, properties.darkTheme ? 15 : 20));

		QtitleW = Math.round((this.w - this.margins * 2 - 55) / 2);
		QartistW = Math.round(QtitleW / 2);

		gr.GdiDrawText(this.tf_tracknumber, this.font1, col_text1, this.x + this.margins, this.y, this.w, this.row, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
		gr.GdiDrawText(this.tf_title, this.font1, col_text1, this.x + this.margins + 30, this.y, QtitleW - 10, this.row, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
		gr.GdiDrawText(this.tf_artist, this.font2, col_text2, this.x + this.margins + 30 + QtitleW, this.y, QartistW - 10, this.row, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
		gr.GdiDrawText(this.tf_album, this.font2, col_text2, this.x + this.margins + 30 + QtitleW + QartistW, this.y, QartistW - 10, this.row, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
		gr.GdiDrawText(this.tf_length, this.font2, col_text2, this.x + this.margins, this.y, this.w - this.margins * 2, this.row, DT_RIGHT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);

	}

	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.row);
	}

	var state1 = 0;

	this.check = function (event, x, y) {
		this.ishover = traceMouse(x, y, this.x, this.y, this.w, this.row);
		old1 = 0;
		switch (event) {
		case "down":
			break;
		case "up":
			//if (this.ishover)
			//	fb.trace(this.tf_title);
			break;
		case "dblclk":
			break;
		case "rbtn_up":
			if (this.ishover)
				queue_cmenu(x, y, this.metadb);
			break;
		case "move":
			var old1 = state1;
			state1 = this.ishover ? 1 : 0;
			if (old1 != state1)
				this.repaint();

			break;
		}

	}
}

var oQueue = function (objectName) {
	this.objectName = objectName;
	this.x = 0;
	this.y = 0;
	this.w = 0;
	this.h = 10;
	this.rowH = 35;
	this.margins = 40;
	this.p_hover = false;
	this.show_panel = false;
	this.buttons = [];
	this.buttonsTotal = 10;
	this.offset = 0;
	this.scrollbarWidth = 0;
	this.scrollbar = new oScrollBar(0, objectName + ".scrollbar", 0, 0, cScrollBar.width, 0, 0, this.rowH, this.offset, objectName, true, 1, properties.darkTheme);
	this.font2 = gdi.font("Segoe UI", 12);
	this.font1 = gdi.font("Segoe UI", 14);
	this.listLength;
	this.metadb = null;
	this.margTop = 55;
	this.ishover;
	this.items = [];

	this.setButtons = function () {
		this.bt_size = 27;

		if (this.playAlbum_off)
			this.playAlbum_off.Dispose();
		this.playAlbum_off = gdi.CreateImage(this.bt_size, this.bt_size);
		gb = this.playAlbum_off.GetGraphics();
		gb.DrawImage(iconsB_img, 0, 0, this.bt_size, this.bt_size, 0, 0, this.bt_size, this.bt_size);
		this.playAlbum_off.ReleaseGraphics(gb);

		for (i = 0; i < this.buttonsTotal; i++) {
			switch (i) {
			case 0:
				this.buttons.push(new button(this.playAlbum_off, this.playAlbum_off, this.playAlbum_off));
				break;
			case 1:
				//toolbar.buttons.push(new button(next_off, next_ov, next_on));
				break;
			}
		}
	}
	this.setButtons();

	this.reload = function () {
		this.listLength = plman.GetPlaybackQueueCount();
		this.contents = plman.GetPlaybackQueueContents();
		this.arr = this.contents.toArray();

		this.items.splice(0, this.items.length);
		for (var i = 0; i < this.listLength; i++) {
			this.items.push(new oItems(this.arr[i].Handle));
		}

		this.totalRowVisible = Math.floor((this.h - this.margTop) / this.rowH);
		this.totalRowToLoad = Math.floor((this.h - this.margTop) / this.rowH) + 1;
		this.totalRows = this.listLength;

		this.offset = 0;
		this.scrollbar.reSize(this.x + this.w - cScrollBar.width, this.y + this.margTop, cScrollBar.width, this.h - this.margTop, this.listLength, this.rowH, this.offset);
		if (this.scrollbar.visible) {
			this.scrollbarWidth = this.scrollbar.w;
		} else {
			this.scrollbarWidth = 0;
		}

		if (this.totalRows - this.offset <= this.totalRowVisible) {
			this.total_rows_to_draw = this.totalRows < this.totalRowVisible ? this.totalRows : this.totalRowVisible;
		} else {
			this.total_rows_to_draw = this.totalRows < this.totalRowToLoad ? this.totalRows : this.totalRowToLoad;
		}

	}
	//this.reload();

	this.setSize = function (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		//this.reload();

		this.totalRowVisible = Math.floor((this.h - this.margTop) / this.rowH);
		this.totalRowToLoad = Math.floor((this.h - this.margTop) / this.rowH) + 1;
		this.totalRows = this.listLength;

		this.offset = 0;
		this.scrollbar.reSize(this.x + this.w - cScrollBar.width, this.y + this.margTop, cScrollBar.width, this.h - this.margTop, this.listLength, this.rowH, this.offset);
		if (this.scrollbar.visible) {
			this.scrollbarWidth = this.scrollbar.w;
		} else {
			this.scrollbarWidth = 0;
		}

		if (this.totalRows - this.offset <= this.totalRowVisible) {
			this.total_rows_to_draw = this.totalRows < this.totalRowVisible ? this.totalRows : this.totalRowVisible;
		} else {
			this.total_rows_to_draw = this.totalRows < this.totalRowToLoad ? this.totalRows : this.totalRowToLoad;
		}
	}

	this.setButtons = function () {}

	this.draw = function (gr) {
		gr.FillSolidRect(this.x, this.y, this.w, this.h, col_bg);

		if (this.totalRows - this.offset <= this.totalRowVisible) {
			this.total_rows_to_draw = this.totalRows < this.totalRowVisible ? this.totalRows : this.totalRowVisible;
		} else {
			this.total_rows_to_draw = this.totalRows < this.totalRowToLoad ? this.totalRows : this.totalRowToLoad;
		}

		if (this.listLength) {
			for (var i = 0; i < this.total_rows_to_draw; i++) {
				this.items[i + this.offset] && this.items[i + this.offset].draw(gr, this.x, this.y + this.margTop + i * this.rowH, this.w - this.scrollbarWidth, (((i - this.offset) / 2) == Math.floor((i - this.offset) / 2) ? 1 : 0));
			}
			this.scrollbar.draw(gr);
		} else {
			gr.GdiDrawText("No songs queued", messageBodyFont, col_text2, this.x + this.margins, this.y + 45, this.w - this.margins * 2 + this.scrollbarWidth, this.h, DT_LEFT | DT_TOP | DT_CALCRECT | DT_TOP | DT_WORDBREAK | DT_NOPREFIX);
		}

		gr.GdiDrawText("Queue", gdi.font("Segoe UI", 14, 1), col_text1, this.x + this.margins, this.y + 0, this.w - this.margins * 2 + this.scrollbarWidth, 35, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_WORDBREAK | DT_NOPREFIX);
		if ((fb.IsPlaying || fb.IsPaused) && plman.IsPlaybackQueueActive())
			gr.gdiDrawText(textSeparator + plman.GetPlaybackQueueCount() + (plman.GetPlaybackQueueCount() > 1 ? " songs" : " song"), gdi.Font("Segoe UI", 14), col_text1, this.x + this.margins + gr.CalcTextWidth("Queue", gdi.Font("Segoe UI", 14, 1)), this.y + 0, this.w - this.margins * 2, 35, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);

	}

	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	this.checkstate = function (event, x, y, step) {
		if (tabActive != "Now_Playing")
			return;

		this.ishover = traceMouse(x, y, this.x, this.y, this.w - this.scrollbarWidth, this.h);
		switch (event) {
		case "down":
			for (var i = 0; i < this.total_rows_to_draw; i++) {
				this.items[i + this.offset] && this.items[i + this.offset].check(event, x, y);
			}
			if (this.scrollbar.visible)
				this.scrollbar.check(event, x, y, step);
			break;
		case "up":
			for (var i = 0; i < this.total_rows_to_draw; i++) {
				this.items[i + this.offset] && this.items[i + this.offset].check(event, x, y);
			}
			if (this.scrollbar.visible)
				this.scrollbar.check(event, x, y, step);
			break;
		case "lbtn_dblclk":
			break;
		case "rbtn_up":
			for (var i = 0; i < this.total_rows_to_draw; i++) {
				this.items[i + this.offset] && this.items[i + this.offset].check(event, x, y);
			}
			//queue_menu_context(x, y);
			break;
		case "wheel":
			if (this.scrollbar.visible)
				this.scrollbar.check(event, x, y, step);
			break;
		case "move":
			for (var i = 0; i < this.total_rows_to_draw; i++) {
				this.items[i + this.offset] && this.items[i + this.offset].check(event, x, y);
			}
			if (this.scrollbar.visible)
				this.scrollbar.check(event, x, y, step);
			break;
		case "leave":
			if (this.scrollbar.visible)
				this.scrollbar.check(event, x, y, step);
			break;
		}
	}

	this.refresh = function () {
		if (tabActive == "Now_Playing") {
			this.reload();
			this.repaint();
		}
	}
}
