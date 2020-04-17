<template>
<div>
	<div class="graph"></div>
</div>
</template>



<script>
export default {
	data() {
		return {
			klines: [],
			interval: null
		}
	},
	sockets: {
		getKlines(val) {
			this.klines = val
		}
	},
	methods: {
		main() {
			var margin = { top: 20, right: 20, bottom: 30, left: 80 },
				width = 1400 - margin.left - margin.right,
				height = 700 - margin.top - margin.bottom;

			var parseDate = d3.timeParse("%d-%b-%y");

			var zoom = d3.zoom()
				.on("zoom", zoomed);

			var t;

			var zoomableInit;

			var x = techan.scale.financetime()
				.range([0, width]);

			var y = d3.scaleLinear()
				.range([height, 0]);

			var yVolume = d3.scaleLinear()
				.range([y(0), y(0.2)]);

			var ohlc = techan.plot.ohlc()
				.xScale(x)
				.yScale(y);

			var sma0 = techan.plot.sma()
				.xScale(x)
				.yScale(y);

			var sma0Calculator = techan.indicator.sma()
				.period(10);

			var sma1 = techan.plot.sma()
				.xScale(x)
				.yScale(y);

			var sma1Calculator = techan.indicator.sma()
				.period(20);

			var volume = techan.plot.volume()
				.accessor(ohlc.accessor()) // Set the accessor to a ohlc accessor so we get highlighted bars
				.xScale(x)
				.yScale(yVolume);

			var xAxis = d3.axisBottom(x);

			var yAxis = d3.axisLeft(y)
				.ticks(10)
				.tickFormat(d3.format(",.4f"));;

			var volumeAxis = d3.axisRight(yVolume)
				.ticks(3)
				.tickFormat(d3.format(",.3s"));

			var timeAnnotation = techan.plot.axisannotation()
				.axis(xAxis)
				.orient('bottom')
				.format(d3.timeFormat('%Y-%m-%d'))
				.width(65)
				.translate([0, height]);

			var ohlcAnnotation = techan.plot.axisannotation()
				.axis(yAxis)
				.orient('left')
				.format(d3.format(',.3f'))
				.height(35)
				.width(80);

			var volumeAnnotation = techan.plot.axisannotation()
				.axis(volumeAxis)
				.orient('right')
				.width(35);

			var crosshair = techan.plot.crosshair()
				.xScale(x)
				.yScale(y)
				.xAnnotation(timeAnnotation)
				.yAnnotation([ohlcAnnotation, volumeAnnotation])
				.on("move", move);

			var svg = d3.select(".graph").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom);

			var defs = svg.append("defs");

			defs.append("clipPath")
				.attr("id", "ohlcClip")
				.append("rect")
				.attr("x", 0)
				.attr("y", 0)
				.attr("width", width)
				.attr("height", height)
				.call(zoom);

			svg = svg.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var ohlcSelection = svg.append("g")
				.attr("class", "ohlc")
				.attr("transform", "translate(0,0)");

			ohlcSelection.append("g")
				.attr("class", "volume")
				.attr("clip-path", "url(#ohlcClip)");

			ohlcSelection.append("g")
				.attr("class", "candlestick")
				.attr("clip-path", "url(#ohlcClip)");

			ohlcSelection.append("g")
				.attr("class", "indicator sma ma-0")
				.attr("clip-path", "url(#ohlcClip)");

			ohlcSelection.append("g")
				.attr("class", "indicator sma ma-1")
				.attr("clip-path", "url(#ohlcClip)");

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")");

			svg.append("g")
				.attr("class", "y axis")
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Price ($)");

			svg.append("g")
				.attr("class", "volume axis");

			svg.append('g')
				.attr("class", "crosshair ohlc")
				.attr("font-size", "14px")

			var coordsText = svg.append('text')
				.style("text-anchor", "end")
				.attr("class", "coords")
				.attr("x", width - 5)
				.attr("font-size", "16px")
				.attr("y", 15);

			var feed;
			svg.call(zoom)
			var accessor = ohlc.accessor();

			this.interval = setInterval(() => {
				this.$socket.client.emit('getKlines');
				feed = this.klines.map(function(d) {
					const timestamp = (new Date(d[0]))
					timestamp.setHours(timestamp.getHours() + 5)
					return {
						date: timestamp,
						open: +d[1],
						high: +d[2],
						low: +d[3],
						close: +d[4],
						volume: +d[5]
					};
				}).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });
				redraw(feed);
				zoomableInit = x.zoomable().clamp(false).copy();


			}, 1000);

			function redraw(data) {
				var accessor = ohlc.accessor();
				t = d3.zoomTransform(svg.node());

				x.domain(data.map(accessor.d));
				// Show only 150 points on the plot
				x.zoomable().domain([0, data.length]);
				//svg.call(zoom.transform, t);

				// Update y scale min max, only on viewable zoomable.domain()
				y.domain(techan.scale.plot.ohlc(data.slice(0, data.length)).domain());
				yVolume.domain(techan.scale.plot.volume(data.slice(0, data.length)).domain());

				svg.select('g.x.axis').call(xAxis);
				svg.select('g.y.axis').call(yAxis);
				svg.select("g.volume.axis").call(volumeAxis);

				svg.select("g.candlestick").datum(data).call(ohlc);
				svg.select("g.sma.ma-0").datum(sma0Calculator(data)).call(sma0);
				svg.select("g.sma.ma-1").datum(sma1Calculator(data)).call(sma1);
				svg.select("g.volume").datum(data).call(volume);
				svg.select("g.crosshair.ohlc").call(crosshair);

			}

			function move(coords) {
				coordsText.text(
					timeAnnotation.format()(coords.x) + ", " + ohlcAnnotation.format()(coords.y)
				);
			}

			let that = this;

			function zoomed() {
				var rescaledY = d3.event.transform.rescaleY(y);
				yAxis.scale(rescaledY);
				ohlc.yScale(rescaledY);
				sma0.yScale(rescaledY)
				sma1.yScale(rescaledY)

				// Emulates D3 behaviour, required for financetime due to secondary zoomable scale
				x.zoomable().domain(d3.event.transform.rescaleX(zoomableInit).domain());

				svg.select("g.candlestick").call(ohlc);
				svg.select('g.x.axis').call(xAxis);
				svg.select('g.y.axis').call(yAxis);
				svg.select("g.volume.axis").call(volumeAxis);

				svg.select("g.sma.ma-0").call(sma0);
				svg.select("g.sma.ma-1").call(sma1);
				svg.select("g.volume").call(volume);
				svg.select("g.crosshair.ohlc").call(crosshair);

				t = d3.zoomTransform(svg.node());
				console.log(t)
			}
		}
	},
	beforeDestroy() {
		clearInterval(this.interval);
	},
	mounted() {
		this.$socket.client.emit('getKlines');
		this.main()
	}
};
</script>

<style>
/* .graph {
	background-color: #303030;
} */

body {
	font: 10px sans-serif;
}

text {
	fill: rgb(216, 216, 216);
}

path {
	fill: none;
	stroke-width: 1;
}

path.ohlc {
	stroke: #7e7e7e;
	stroke-width: 1;
}

path.ohlc.up {
	stroke: #00B8D4;
}

path.ohlc.down {
	stroke: #BF360C;
}

.ma-0 path.line {
	stroke: #1f77b4;
}

.ma-1 path.line {
	stroke: #aec7e8;
}

path.volume {
	fill: #000000;
}

.crosshair {
	cursor: crosshair;
}

.crosshair path.wire {
	stroke: #dddddd;
	stroke-dasharray: 1, 1;
}

.crosshair .axisannotation path {
	fill: #000000;
	font-size: 1em;
}
</style>
