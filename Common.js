// Scrollbar
SM_CXVSCROLL = 2;
SM_CYHSCROLL = 3;

DLGC_WANTARROWS = 0x0001;
/* Control wants arrow keys         */
DLGC_WANTTAB = 0x0002;
/* Control wants tab keys           */
DLGC_WANTALLKEYS = 0x0004;
/* Control wants all keys           */
DLGC_WANTMESSAGE = 0x0004;
/* Pass message to control          */
DLGC_HASSETSEL = 0x0008;
/* Understands EM_SETSEL message    */
DLGC_DEFPUSHBUTTON = 0x0010;
/* Default pushbutton               */
DLGC_UNDEFPUSHBUTTON = 0x0020;
/* Non-default pushbutton           */
DLGC_RADIOBUTTON = 0x0040;
/* Radio button                     */
DLGC_WANTCHARS = 0x0080;
/* Want WM_CHAR messages            */
DLGC_STATIC = 0x0100;
/* Static item: don't include       */
DLGC_BUTTON = 0x2000;
/* Button item: can be checked      */

// Use with MenuManager()
MF_STRING = 0x00000000;
MF_SEPARATOR = 0x00000800;
MF_GRAYED = 0x00000001;
MF_DISABLED = 0x00000002;
MF_POPUP = 0x00000010;

// Used in TrackPopupMenu()
TPM_LEFTALIGN = 0x0000;
TPM_CENTERALIGN = 0x0004;
TPM_RIGHTALIGN = 0x0008;
TPM_TOPALIGN = 0x0000;
TPM_VCENTERALIGN = 0x0010;
TPM_BOTTOMALIGN = 0x0020;
TPM_HORIZONTAL = 0x0000;
/* Horz alignment matters more */
TPM_VERTICAL = 0x0040;
/* Vert alignment matters more */

// Used in get_colors()
COLOR_BTNFACE = 15;
COLOR_BTNTEXT = 18;

// Used in window.SetCursor()
IDC_ARROW = 32512;
IDC_IBEAM = 32513;
IDC_WAIT = 32514;
IDC_CROSS = 32515;
IDC_UPARROW = 32516;
IDC_SIZE = 32640;
IDC_ICON = 32641;
IDC_SIZENWSE = 32642;
IDC_SIZENESW = 32643;
IDC_SIZEWE = 32644;
IDC_SIZENS = 32645;
IDC_SIZEALL = 32646;
IDC_NO = 32648;
IDC_APPSTARTING = 32650;
IDC_HAND = 32649;
IDC_HELP = 32651;

// Use with GdiDrawText()
var DT_LEFT = 0x00000000;
var DT_RIGHT = 0x00000002;
var DT_TOP = 0x00000000;
var DT_BOTTOM = 0x00000008;
var DT_CENTER = 0x00000001;
var DT_VCENTER = 0x00000004;
var DT_WORDBREAK = 0x00000010;
var DT_SINGLELINE = 0x00000020;
var DT_CALCRECT = 0x00000400;
var DT_NOPREFIX = 0x00000800;
var DT_EDITCONTROL = 0x00002000;
var DT_END_ELLIPSIS = 0x00008000;

// Keyboard Flags & Tools
VK_BACK = 0x08;
VK_CONTROL = 0x11;
VK_SHIFT = 0x10;
VK_MENU = 0x12; // Alt key
VK_ALT = 0x12;
VK_PAUSE = 0x13;
VK_ESCAPE = 0x1B;
VK_SPACE = 0x20;
VK_DELETE = 0x2E;
VK_PRIOR = 0x21; // PAGE UP key
VK_NEXT = 0x22; // PAGE DOWN key
VK_PGUP = 0x21;
VK_PGDN = 0x22;
VK_END = 0x23;
VK_HOME = 0x24;
VK_LEFT = 0x25;
VK_UP = 0x26;
VK_RIGHT = 0x27;
VK_DOWN = 0x28;
VK_INSERT = 0x2D;
VK_SPACEBAR = 0x20;
VK_RETURN = 0x0D; //Enter
VK_LSHIFT = 0xA0; // Left SHIFT key
VK_RSHIFT = 0xA1; // Right SHIFT key
VK_LCONTROL = 0xA2; // Left CONTROL key
VK_RCONTROL = 0xA3; // Right CONTROL key
VK_LMENU = 0xA4; // Left MENU key
VK_RMENU = 0xA5; // Right MENU key
VK_KEY_0 = 0x30; //	0
VK_KEY_1 = 0x31; //	1
VK_KEY_2 = 0x32; //	2
VK_KEY_3 = 0x33; //	3
VK_KEY_4 = 0x34; //	4
VK_KEY_5 = 0x35; //	5
VK_KEY_6 = 0x36; //	6
VK_KEY_7 = 0x37; //	7
VK_KEY_8 = 0x38; //	8
VK_KEY_9 = 0x39; //	9
VK_KEY_A = 0x41; //	A
VK_KEY_B = 0x42; //	B
VK_KEY_C = 0x43; //	C
VK_KEY_D = 0x44; //	D
VK_KEY_E = 0x45; //	E
VK_KEY_F = 0x46; //	F
VK_KEY_G = 0x47; //	G
VK_KEY_H = 0x48; //	H
VK_KEY_I = 0x49; //	I
VK_KEY_J = 0x4A; //	J
VK_KEY_K = 0x4B; //	K
VK_KEY_L = 0x4C; //	L
VK_KEY_M = 0x4D; //	M
VK_KEY_N = 0x4E; //	N
VK_KEY_O = 0x4F; //	O
VK_KEY_P = 0x50; //	P
VK_KEY_Q = 0x51; //	Q
VK_KEY_R = 0x52; //	R
VK_KEY_S = 0x53; //	S
VK_KEY_T = 0x54; //	T
VK_KEY_U = 0x55; //	U
VK_KEY_V = 0x56; //	V
VK_KEY_W = 0x57; //	W
VK_KEY_X = 0x58; //	X
VK_KEY_Y = 0x59; //	Y
VK_KEY_Z = 0x5A; //	Z
VK_F1 = 0x70; // F1
VK_F2 = 0x71; // F2
VK_F3 = 0x72; // F3
VK_F4 = 0x73; // F4
VK_F5 = 0x74; // F5
VK_F6 = 0x75; // F6
VK_F7 = 0x76; // F7
VK_F8 = 0x77; // F8
VK_F9 = 0x78; // F9
VK_F10 = 0x79; // F10
VK_F11 = 0x7A; // F11
VK_F12 = 0x7B; // F12

// Used in mouse callbacks, as mask, used in on_mouse_lbtn_up(), on_mouse_rbtn_up() and so on
MK_LBUTTON = 0x0001;
MK_RBUTTON = 0x0002;
MK_SHIFT = 0x0004; // The SHIFT key is down.
MK_CONTROL = 0x0008; // The CTRL key is down.
MK_MBUTTON = 0x0010;
MK_XBUTTON1 = 0x0020;
MK_XBUTTON2 = 0x0040;
MK_SHIFT = 0x0004;
MK_CONTROL = 0x0008;

var KMask = {
	none : 0,
	ctrl : 1,
	shift : 2,
	ctrlshift : 3,
	ctrlalt : 4,
	ctrlaltshift : 5,
	alt : 6
}

function GetKeyboardMask() {
	var c = utils.IsKeyPressed(VK_CONTROL) ? true : false;
	var a = utils.IsKeyPressed(VK_ALT) ? true : false;
	var s = utils.IsKeyPressed(VK_SHIFT) ? true : false;
	var ret = KMask.none;
	if (c && !a && !s)
		ret = KMask.ctrl;
	if (!c && !a && s)
		ret = KMask.shift;
	if (c && !a && s)
		ret = KMask.ctrlshift;
	if (c && a && !s)
		ret = KMask.ctrlalt;
	if (c && a && s)
		ret = KMask.ctrlaltshift;
	if (!c && a && !s)
		ret = KMask.alt;
	return ret;
}

// Used in gr.DrawString()
function StringFormat() {
	var h_align = 0,
	v_align = 0,
	trimming = 0,
	flags = 0;
	switch (arguments.length) {
	case 3:
		trimming = arguments[2];
	case 2:
		v_align = arguments[1];
	case 1:
		h_align = arguments[0];
		break;
	default:
		return 0;
	}
	return ((h_align << 28) | (v_align << 24) | (trimming << 20) | flags);
}
StringAlignment = {
	Near : 0,
	Centre : 1,
	Far : 2
}
var lt_stringformat = StringFormat(StringAlignment.Near, StringAlignment.Near);
var ct_stringformat = StringFormat(StringAlignment.Centre, StringAlignment.Near);
var rt_stringformat = StringFormat(StringAlignment.Far, StringAlignment.Near);
var lc_stringformat = StringFormat(StringAlignment.Near, StringAlignment.Centre);
var cc_stringformat = StringFormat(StringAlignment.Centre, StringAlignment.Centre);
var rc_stringformat = StringFormat(StringAlignment.Far, StringAlignment.Centre);
var lb_stringformat = StringFormat(StringAlignment.Near, StringAlignment.Far);
var cb_stringformat = StringFormat(StringAlignment.Centre, StringAlignment.Far);
var rb_stringformat = StringFormat(StringAlignment.Far, StringAlignment.Far);

// Used in utils.GetAlbumArt()
AlbumArtId = {
	front : 0,
	back : 1,
	disc : 2,
	icon : 3,
	artist : 4
}
InterpolationMode = {
	Invalid : -1,
	Default : 0,
	LowQuality : 1,
	HighQuality : 2,
	Bilinear : 3,
	Bicubic : 4,
	NearestNeighbor : 5,
	HighQualityBilinear : 6,
	HighQualityBicubic : 7
}

// Used everywhere!
function RGB(r, g, b) {
	return (0xff000000 | (r << 16) | (g << 8) | (b));
}
function RGBA(r, g, b, a) {
	return ((a << 24) | (r << 16) | (g << 8) | (b));
}
function getAlpha(color) {
	return ((color >> 24) & 0xff);
}

function getRed(color) {
	return ((color >> 16) & 0xff);
}

function getGreen(color) {
	return ((color >> 8) & 0xff);
}

function getBlue(color) {
	return (color & 0xff);
}

function negative(colour) {
	var R = getRed(colour);
	var G = getGreen(colour);
	var B = getBlue(colour);
	return RGB(Math.abs(R - 255), Math.abs(G - 255), Math.abs(B - 255));
}

function toRGBA(d) { // convert back to RGB values
	var r = getRed(d);
	var g = getGreen(d);
	var b = getBlue(d);
	var a = getAlpha(d);
	return [r, g, b, a];
}

function toRGB(d) { // convert back to RGB values
	var d = d - 0xff000000;
	var r = d >> 16;
	var g = d >> 8 & 0xFF;
	var b = d & 0xFF;
	return [r, g, b];
}

function blendColors(c1, c2, factor) {
	// When factor is 0, result is 100% color1, when factor is 1, result is 100% color2.
	var c1 = toRGB(c1);
	var c2 = toRGB(c2);
	var r = Math.round(c1[0] + factor * (c2[0] - c1[0]));
	var g = Math.round(c1[1] + factor * (c2[1] - c1[1]));
	var b = Math.round(c1[2] + factor * (c2[2] - c1[2]));
	//fb.trace("R = " + r + " G = " + g + " B = " + b);
	return (0xff000000 | (r << 16) | (g << 8) | (b));
}

function blendColors2(c1, c2, factor) {
	// When factor is 0, result is 100% color1, when factor is 1, result is 100% color2.
	var r = Math.round(c1[0] + factor * (c2[0] - c1[0]));
	var g = Math.round(c1[1] + factor * (c2[1] - c1[1]));
	var b = Math.round(c1[2] + factor * (c2[2] - c1[2]));
	//fb.trace("R = " + r + " G = " + g + " B = " + b);
	return [r, g, b];
}

function setAlpha(color, a) {
	return ((color & 0x00ffffff) | (a << 24));
}

function draw_glass_reflect(w, h) {
	// Mask for glass effect
	var Mask_img = gdi.CreateImage(w, h);
	var gb = Mask_img.GetGraphics();
	gb.FillSolidRect(0, 0, w, h, 0xffffffff);
	gb.FillGradRect(0, 0, w - 20, h, 0, 0xaa000000, 0, 1.0);
	gb.SetSmoothingMode(2);
	gb.FillEllipse(-20, 25, w * 2 + 40, h * 2, 0xffffffff);
	Mask_img.ReleaseGraphics(gb);
	// drawing the white rect
	var glass_img = gdi.CreateImage(w, h);
	gb = glass_img.GetGraphics();
	gb.FillSolidRect(0, 0, w, h, 0xffffffff);
	glass_img.ReleaseGraphics(gb);
	// resizing and applying the mask
	var Mask = Mask_img.Resize(w, h);
	glass_img.ApplyMask(Mask);
	Mask.Dispose();
	return glass_img;
}

function drawBlurbox(w, h, bgcolor, boxcolor, radius, iteration) {
	// Create a image which background is true transparent
	var g_blurbox = gdi.CreateImage(w + 40, h + 40);
	// Get graphics interface like "gr" in on_paint
	var gb = g_blurbox.GetGraphics();
	gb.FillSolidRect(20, 20, w, h, boxcolor);
	g_blurbox.ReleaseGraphics(gb);
	// Make box blur, radius = 2, iteration = 2
	g_blurbox.BoxBlur(radius, iteration);
	var g_blurbox_main = gdi.CreateImage(w + 40, h + 40);
	gb = g_blurbox_main.GetGraphics();
	gb.FillSolidRect(0, 0, w + 40, h + 40, bgcolor);
	gb.DrawImage(g_blurbox, 0, -10, w + 40, h + 40, 0, 0, w + 40, h + 40, 0, 255);
	g_blurbox_main.ReleaseGraphics(gb);
	return g_blurbox_main;
}

function num(strg, nb) {
	var i;
	var str = strg.toString();
	var k = nb - str.length;
	if (k > 0) {
		for (i = 0; i < k; i++) {
			str = "0" + str;
		}
	}
	return str.toString();
}

//Time formatting secondes -> 0:00
function TimeFromSeconds(t) {
	var zpad = function (n) {
		var str = n.toString();
		return (str.length < 2) ? "0" + str : str;
	}
	var h = Math.floor(t / 3600);
	t -= h * 3600;
	var m = Math.floor(t / 60);
	t -= m * 60;
	var s = Math.floor(t);
	if (h > 0)
		return h.toString() + ":" + zpad(m) + ":" + zpad(s);
	return m.toString() + ":" + zpad(s);
}

function TrackType(trkpath) {
	var taggable;
	var type;
	switch (trkpath) {
	case "file":
		taggable = 1;
		type = 0;
		break;
	case "cdda":
		taggable = 1;
		type = 1;
		break;
	case "FOO_":
		taggable = 0;
		type = 2;
		break;
	case "http":
		taggable = 0;
		type = 3;
		break;
	case "mms:":
		taggable = 0;
		type = 3;
		break;
	case "unpa":
		taggable = 0;
		type = 4;
		break;
	default:
		taggable = 0;
		type = 5;
	}
	return type;
}

function replaceAll(str, search, repl) {
	while (str.indexOf(search) != -1) {
		str = str.replace(search, repl);
	}
	return str;
}

var ButtonStates = {
	normal : 0,
	hover : 1,
	down : 2
}
var button = function (normal, hover, down) {
	this.img = Array(normal, hover, down);
	this.w = this.img[0].Width;
	this.h = this.img[0].Height;
	this.state = ButtonStates.normal;
	this.update = function (normal, hover, down) {
		this.img = Array(normal, hover, down);
		this.w = this.img[0].Width;
		this.h = this.img[0].Height;
	}
	this.draw = function (gr, x, y, alpha) {
		this.x = x;
		this.y = y;
		this.img[this.state] && gr.DrawImage(this.img[this.state], this.x, this.y, this.w, this.h, 0, 0, this.w, this.h, 0, alpha);
	}
	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}
	this.checkstate = function (event, x, y) {
		this.ishover = (x > this.x && x < this.x + this.w - 1 && y > this.y && y < this.y + this.h - 1);
		this.old = this.state;
		switch (event) {
		case "down":
			switch (this.state) {
			case ButtonStates.normal:
			case ButtonStates.hover:
				this.state = this.ishover ? ButtonStates.down : ButtonStates.normal;
				break;
			}
			break;
		case "up":
			this.state = this.ishover ? ButtonStates.hover : ButtonStates.normal;
			break;
		case "right":

			break;
		case "move":
			switch (this.state) {
			case ButtonStates.normal:
			case ButtonStates.hover:
				this.state = this.ishover ? ButtonStates.hover : ButtonStates.normal;
				break;
			}
			break;
		case "leave":
			this.state = this.isdown ? ButtonStates.down : ButtonStates.normal;
			break;
		}
		if (this.state != this.old)
			this.repaint();
		return this.state;
	}
}

var popupButton = function (str, font, color, img, h, marg) {
	this.str = str;
	this.font = font;
	this.col = Array(color[0], color[1], color[2]);
	this.img = Array(img[0], img[1], img[2]);
	this.state = ButtonStates.normal;
	this.x = this.y = this.w;
	this.h = h ? h : 0;
	this.marg = marg;
	var s,
	sg;

	this.update = function (str, color, img) {
		if (str)
			this.str = str;
		if (img)
			this.img = Array(img[0], img[1], img[2]);
		this.calcSize();
		if (color)
			this.col = Array(color[0], color[1], color[2]);
		this.repaint();
	}

	this.calcSize = function () {
		s = gdi.CreateImage(1, 1);
		sg = s.GetGraphics();
		this.w = sg.CalcTextWidth(this.str, this.font);
		if (!h)
			this.h = sg.CalcTextHeight(this.str, this.font);
		s.ReleaseGraphics(sg);

		if (this.img[this.state])
			this.w = this.w + 0 + this.img[this.state].Width;

		this.w = this.w + this.marg * 2;

	}
	this.calcSize();

	this.draw = function (gr, x, y) {
		this.x = x;
		this.y = y;
		gr.GdiDrawText(this.str, this.font, this.col[this.state], this.x + this.marg, this.y, this.w, this.h, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
		this.img[this.state] && gr.DrawImage(this.img[this.state], this.x + this.marg + gr.CalcTextWidth(this.str, this.font) -2, this.y + this.h - Math.round((this.h + this.img[this.state].Width) / 2), this.img[this.state].Width, this.img[this.state].Height, 0, 0, this.img[this.state].Width, this.img[this.state].Height);
	}

	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	this.checkstate = function (event, x, y) {
		this.ishover = (x > this.x && x < this.x + this.w - 1 && y > this.y && y < this.y + this.h - 1);
		this.old = this.state;
		switch (event) {
		case "down":
			switch (this.state) {
			case ButtonStates.normal:
			case ButtonStates.hover:
				this.state = this.ishover ? ButtonStates.down : ButtonStates.normal;
				break;
			}
			break;
		case "up":
			this.state = this.ishover ? ButtonStates.hover : ButtonStates.normal;
			break;
		case "right":

			break;
		case "move":
			switch (this.state) {
			case ButtonStates.normal:
			case ButtonStates.hover:
				this.state = this.ishover ? ButtonStates.hover : ButtonStates.normal;
				break;
			}
			break;
		case "leave":
			this.state = this.isdown ? ButtonStates.down : ButtonStates.normal;
			break;
		}
		if (this.state != this.old)
			this.repaint();
		return this.state;
	}
}

var settingButton = function (state, font, color) {
	this.active = state;
	this.str = this.active ? "On" : "Off";
	this.font = font;
	this.col = Array(color[0], color[1], color[2], color[3]);
	this.state = ButtonStates.normal;
	this.x = this.y = 0;
	this.h = 30;
	this.w = 150;

	this.update = function (state, color) {
		this.active = state;
		this.str = this.active ? "On" : "Off";
		if (color)
			this.col = Array(color[0], color[1], color[2], color[3]);
		this.repaint();
	}

	this.draw = function (gr, x, y) {
		this.x = x;
		this.y = y;
		gr.GdiDrawText(this.str, this.font, this.col[0], this.x, this.y, this.w, this.h, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
		gr.FillSolidRect(this.x + 100, this.y + 5, 50, 20, this.col[1]);
		gr.FillSolidRect(this.x + 100 + 2, this.y + 5 + 2, 50 - 4, 20 - 4, this.col[2]);
		gr.FillSolidRect(this.x + 100 + 3, this.y + 5 + 3, 50 - 6, 20 - 6, this.active ? this.col[3] : this.col[1]);
		gr.FillSolidRect(this.x + 100 + (this.active ? 38 : 0), this.y + 5, 12, 20, this.col[0]);
	}

	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	this.checkstate = function (event, x, y) {
		this.ishover = (x > this.x && x < this.x + this.w - 1 && y > this.y && y < this.y + this.h - 1);
		this.old = this.state;
		switch (event) {
		case "down":
			switch (this.state) {
			case ButtonStates.normal:
			case ButtonStates.hover:
				this.state = this.ishover ? ButtonStates.down : ButtonStates.normal;
				break;
			}
			break;
		case "up":
			this.state = this.ishover ? ButtonStates.hover : ButtonStates.normal;
			break;
		case "right":

			break;
		case "move":
			switch (this.state) {
			case ButtonStates.normal:
			case ButtonStates.hover:
				this.state = this.ishover ? ButtonStates.hover : ButtonStates.normal;
				break;
			}
			break;
		case "leave":
			this.state = this.isdown ? ButtonStates.down : ButtonStates.normal;
			break;
		}
		if (this.state != this.old)
			this.repaint();
		return this.state;
	}
}

function get_system_scrollbar_width() {
	var tmp = utils.GetSystemMetrics(SM_CXVSCROLL);
	return tmp;
}

function get_system_scrollbar_height() {
	var tmp = utils.GetSystemMetrics(SM_CYHSCROLL);
	return tmp;
}

String.prototype.repeat = function (num) {
	if (num >= 0 && num <= 5) {
		var g = Math.round(num);
	} else {
		return "";
	}
	return new Array(g + 1).join(this);
}

function cloneObject(obj) {
	var clone = {};
	for (var i in obj) {
		if (typeof(obj[i]) == "object" && obj[i] != null)
			clone[i] = cloneObject(obj[i]);
		else
			clone[i] = obj[i];
	}
	return clone;
}

function compareObject(o1, o2) {
	for (var p in o1) {
		if (o1[p] != o2[p]) {
			return false;
		}
	}
	for (var p in o2) {
		if (o1[p] != o2[p]) {
			return false;
		}
	}
	return true;
}

function getTimestamp() {
	var d,
	s1,
	s2,
	s3,
	hh,
	min,
	sec,
	timestamp;
	d = new Date();
	s1 = d.getFullYear();
	s2 = (d.getMonth() + 1);
	s3 = d.getDate();
	hh = d.getHours();
	min = d.getMinutes();
	sec = d.getSeconds();
	if (s3.length == 1)
		s3 = "0" + s3;
	timestamp = s1 + ((s2 < 10) ? "-0" : "-") + s2 + ((s3 < 10) ? "-0" : "-") + s3 + ((hh < 10) ? " 0" : " ") + hh + ((min < 10) ? ":0" : ":") + min + ((sec < 10) ? ":0" : ":") + sec;
	return timestamp;
}

function RefreshBG() {
	if (fb.IsPlaying || fb.IsPaused) {
		fb.RunMainMenuCommand("Playback/Play or Pause");
		fb.RunMainMenuCommand("Playback/Play or Pause");
	} else {
		fb.RunMainMenuCommand("Playback/Play");
		fb.RunMainMenuCommand("Playback/Stop");
	}
}

function bytesToSize(bytes) {
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes == 0)
		return '';
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	if (i == 0)
		return txt_sep + bytes + ' ' + sizes[i];
	return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}

function timeFormat(s) {
	var weeks = Math.floor(s / 604800),
	days = Math.floor(s % 604800 / 86400),
	hours = Math.floor((s % 86400) / 3600),
	minutes = Math.floor(((s % 86400) % 3600) / 60),
	seconds = Math.round((((s % 86400) % 3600) % 60)),
	weeks = weeks > 0 ? weeks + " wk " : "",
	days = days > 0 ? days + " d " : "",
	hours = hours > 0 ? hours + " h " : "",
	minutes = minutes > 0 ? minutes + " min " : "",
	seconds = seconds > 0 ? seconds + " s" : "";

	return weeks + days + hours + minutes + seconds;
}

function traceMouse(x, y, left, top, right, bottom) {
	return ((left <= x) && (x <= left + right) && (top <= y) && (y <= top + bottom - 1));
}

function createAutoplaylist(str) {
	if (!str || str.substr(0, 6) == "Unknow")
		return fb.trace("Unknow str");
	var isFound = false;
	var total = plman.PlaylistCount;
	for (var i = 0; i < total; i++) {
		if (plman.GetPlaylistName(i) == str) {
			var plIndex = i;
			isFound = true;
			break;
		}
	}
	if (isFound) {
		fb.ActivePlaylist = plIndex;
		return;
	} else {
		plIndex = total;
	}
	fb.CreateAutoPlaylist(plIndex, str, str, "", 0);
	// convert autoplaylist to a normal playlist
	/* fb.DuplicatePlaylist(plIndex, str);
	fb.RemovePlaylist(plIndex);*/
	fb.ActivePlaylist = plIndex;
	plman.ExecutePlaylistDefaultAction(plIndex, 0);
}

function createImage(img, raw_bitmap) {
	if (!img)
		return null;
	var gdi_img,
	gb;
	gdi_img = gdi.CreateImage(img.Width, img.Height),
	gb = gdi_img.GetGraphics();
	gb.DrawImage(img, 0, 0, img.Width, img.Height, 0, 0, img.Width, img.Height);
	gdi_img.ReleaseGraphics(gb);
	CollectGarbage();
	if (raw_bitmap)
		return gdi_img.CreateRawBitmap();
	else
		return gdi_img;
}

function draw_image(gr, img, pos_x, pos_y, width, height, type, interpolation_mode, border, alpha) {
	if (!img)
		return;

	try {
		if (width > 0 && height > 0) {
			gr.SetInterpolationMode(interpolation_mode);
			switch (type) {
			case "crop":
			case "crop top":
			case "crop bottom":
				var sr = img.Width / img.Height;
				var dr = width / height;
				if (sr < dr) {
					var r = img.Width / width;
					var ch = height * r;
					var sy = type == "crop top" ? 0 : type == "crop bottom" ? Math.round(img.Height - ch) : Math.round((img.Height - ch) / 2);
					var cw = img.Width;
					var sx = 0;
				} else {
					var r = img.Height / height;
					var cw = width * r;
					var sx = Math.round((img.Width - cw) / 2);
					var ch = img.Height;
					var sy = 0;
				}
				gr.DrawImage(img, pos_x, pos_y, width, height, sx, sy, cw, ch, 0, alpha);
				if (border)
					gr.DrawRect(pos_x, pos_y, width - 1, height - 1, 1, border);
				break;
			case "stretch":
				gr.DrawImage(img, pos_x, pos_y, width, height, 0, 0, img.Width, img.Height, 0, alpha);
				if (border)
					gr.DrawRect(pos_x, pos_y, width - 1, height - 1, 1, border);
				break;
			case "centre":
			default:
				var s = Math.min(width / img.Width, height / img.Height);
				var nw = Math.round(img.Width * s);
				var nh = Math.round(img.Height * s);
				pos_x += Math.round((width - nw) / 2);
				pos_y += Math.round((height - nh) / 2);
				gr.DrawImage(img, pos_x, pos_y, nw, nh, 0, 0, img.Width, img.Height, 0, alpha);
				if (border)
					gr.DrawRect(pos_x, pos_y, nw - 1, nh - 1, 1, border);
				break;
			}
			gr.SetInterpolationMode(0);
		}
	} catch (e) {}
}

function draw_Bitmap(gr, img, pos_x, pos_y, width, height, type, interpolation_mode) {
	if (!img)
		return;
	try {
		if (width > 0 && height > 0) {
			gr.SetInterpolationMode(interpolation_mode);
			switch (type) {
			case "crop":
			case "crop top":
			case "crop bottom":
				var sr = img.Width / img.Height;
				var dr = width / height;
				if (sr < dr) {
					var r = img.Width / width;
					var ch = height * r;
					var sy = type == "crop top" ? 0 : type == "crop bottom" ? Math.round(img.Height - ch) : Math.round((img.Height - ch) / 2);
					var cw = img.Width;
					var sx = 0;
				} else {
					var r = img.Height / height;
					var cw = width * r;
					var sx = Math.round((img.Width - cw) / 2);
					var ch = img.Height;
					var sy = 0;
				}
				gr.GdiAlphaBlend(img, pos_x, pos_y, width, height, sx, sy, cw, ch);
				break;
			case "stretch":
				gr.GdiAlphaBlend(img, pos_x, pos_y, width, height, 0, 0, img.Width, img.Height);
				break;
			case "centre":
			default:
				var s = Math.min(width / img.Width, height / img.Height);
				var nw = Math.round(img.Width * s);
				var nh = Math.round(img.Height * s);
				pos_x += Math.round((width - nw) / 2);
				pos_y += Math.round((height - nh) / 2);
				gr.GdiAlphaBlend(img, pos_x, pos_y, nw, nh, 0, 0, img.Width, img.Height);
				break;
			}
			gr.SetInterpolationMode(0);
		}
	} catch (e) {}
}

// Active X Object
var ActiveX = false;
var WshShell = false;
var fso = false;
var doc = false;
var xmlhttp = false;
try {
	WshShell = new ActiveXObject("WScript.Shell");
	fso = new ActiveXObject("Scripting.FileSystemObject");
	doc = new ActiveXObject("htmlfile");
	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	ActiveX = true;
} catch (e) {
	fb.trace("ActiveXObject: " + e.message + "\n\Failed to load required system components.\n\Please check \"Safe mode\" has been turned off.\n\Menu > File > Preferences > Tools > WSH Panel Mod");
	fb.ShowPopupMessage("Failed to load required system components.\n\Please check \"Safe mode\" has been turned off.\n\nMenu > File > Preferences > Tools > WSH Panel Mod", title = "WSH Panel Mod", iconid = 0);
}

// Check Fonts
var font1 = utils.CheckFont("Segoe UI");
var font2 = utils.CheckFont("Segoe UI Light");
var font3 = utils.CheckFont("Segoe UI Semibold");

if (!font1 || !font2 || !font3)
	fb.trace("Failed to load required fonts.\n\Please install complete Segoe UI font family.");

// UIHacks
var isUIH = utils.CheckComponent("foo_ui_hacks", true);
var UIHacks = false;

MainMenuState = {
	Show : 0,
	Hide : 1,
	Auto : 2
}
FrameStyle = {
	Default : 0,
	SmallCaption : 1,
	NoCaption : 2,
	NoBorder : 3
}
MoveStyle = {
	Default : 0,
	Middle : 1,
	Left : 2,
	Both : 3
}
AeroEffect = {
	Default : 0,
	Disabled : 1,
	GlassFrame : 2,
	SheetOfGlass : 3
}
WindowState = {
	Normal : 0,
	Minimized : 1,
	Maximized : 2
}

if (!isUIH) {
	fb.trace("UIHacks: " + e.message);
	fb.ShowPopupMessage("Component required:\n  Name: UI Hacks\n  Version: 2013-02-14\n  Module: foo_ui_hacks", title = "WSH Panel Mod", iconid = 0);
} else {
	UIHacks = ActiveX ? new ActiveXObject("UIHacks") : false;
}

var isEqualizer = utils.CheckComponent("foo_dsp_eq", true);

function numericAscending(a, b) {
	return (a - b);
}

function numericDescending(a, b) {
	return (b - a);
}

function match(input, str) {
	var temp = "";
	input = input.toLowerCase();
	for (var j in str) {
		if (input.indexOf(str[j]) < 0)
			return false;
	}
	return true;
}

function process_string(str) {
	str_ = [];
	str = str.toLowerCase();
	while (str != (temp = str.replace("  ", " ")))
		str = temp;
	var str = str.split(" ").sort();
	for (var i in str) {
		if (str[i] != "")
			str_[str_.length] = str[i];
	}
	return str_;
}

function check_playlist(name) {
	var pl_name = "",
	pl_idx = -1;
	for (var i = 0; i < plman.PlaylistCount; i++) {
		pl_name = plman.GetPlaylistName(i);
		if (pl_name == name) {
			pl_idx = i;
			break;
		}
	}
	return pl_idx;
}

function $(field, metadb) {
	var tf;
	try {
		tf = fb.TitleFormat(field).EvalWithMetadb(metadb);
	} catch (e) {
		tf = e + " (Invalid metadb!)"
	}
	return tf;
}

function get_selected() {

	var apl = plman.ActivePlaylist;
	var metadb = null;

	for (var i = 0, l = plman.PlaylistItemCount(apl); i != l; i++) {

		if (plman.IsPlaylistItemSelected(apl, i)) {
			metadb = plman.GetPlaylistItems(apl).Item(i);
			break;
		}

	}

	if (metadb && plman.PlaylistItemCount(apl) > 1)
		select = true;
	else
		select = false;

	return plman.PlaylistItemCount(apl) > 1 ? metadb : false;

}
