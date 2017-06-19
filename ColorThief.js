function sqrt(n) {
	return Math.sqrt(n);
};

function pow(n) {
	return Math.pow(n, 2);
};

function rgbToYuv(rgb) {
	return [rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114, rgb[0] * -0.147 + rgb[1] * 0.289 + rgb[2] * 0.436, rgb[0] * 0.615 + rgb[1] * 0.515 + rgb[2] * 0.100];
};

function colorDistance(rgb1, rgb2) {
	var yuv1 = rgbToYuv(rgb1),
	yuv2 = rgbToYuv(rgb2);
	return sqrt(pow(yuv1[0] - yuv2[0])
		 + pow(yuv1[1] - yuv2[1])
		 + pow(yuv1[2] - yuv2[2]));
};

function gatherSimilarElements(list, comparator) {

	var subsets = [];

	for (var u = 0, U = list.length; u < U; ++u) {

		var element = list[u];
		var closest = null;

		for (var v = 0, V = subsets.length; v < V; ++v)
			if (comparator(subsets[v][0], element))
				break;

		if (v === V) {
			closest = [];
			subsets.push(closest);
		} else {
			closest = subsets[v];
		}

		closest.push(element);

	}

	return subsets;

};

function meanColor(colorList) {

	var finalColor = [0, 0, 0];

	for (var t = 0, T = colorList.length; t < T; ++t) {

		var color = colorList[t];

		finalColor[0] += color[0];
		finalColor[1] += color[1];
		finalColor[2] += color[2];

	}

	finalColor[0] /= colorList.length;
	finalColor[1] /= colorList.length;
	finalColor[2] /= colorList.length;

	return finalColor;

};

function dominantColor(colorList, treshold) {

	if (typeof treshold === 'undefined')
		treshold = 0.1;

	var buckets = gatherSimilarElements(colorList, function (colorA, colorB) {
			return colorDistance(colorA, colorB) < treshold;
		}).sort(function (bucketA, bucketB) {
			return bucketB.length - bucketA.length;
		});

	var color = meanColor(buckets.shift());
	return color;

};

function getContrastYIQ(color) {
	var r = color[0],
	g = color[1],
	b = color[2];

	var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

	// return (yiq >= 128) ? 'light' : 'dark';
	return yiq;
};

function getDefaultColor(yiq) {
	return (yiq >= 128) ? [0, 0, 0] : [235, 235, 235];
};

function inverseColors(color, palette) {

	var yiq = getContrastYIQ(color);
	var colors = [],
	primaryColor,
	secondaryColor;

	for (var i = 0; i < palette.length; i++) {

		if (Math.abs(getContrastYIQ(palette[i]) - yiq) > 80) {
			colors.push(palette[i]);
		}
	}

	primaryColor = colors[0] ? colors[0] : getDefaultColor(yiq);
	secondaryColor = colors[1] ? colors[1] : getDefaultColor(yiq);

	return [primaryColor, secondaryColor];
};
