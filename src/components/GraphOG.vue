<template>
  <div class="hello">
    <div class="graph"></div>
  </div>
</template>

<script>
export default {
  name: "Graph",
  data() {
    return {
      data: [],
      interval: null
    };
  },
  sockets: {
    getKlines(val) {
      this.data = val.data;
      if (val.timeframe != this.timeFrame) {
        console.log("TCL: getKlines -> this.timeFrame", val.timeframe);
        this.mana();
      }
    }
  },
  computed: {
    timeFrame() {
      return this.$store.state.timeFrame;
    },
    symbol() {
      return this.$store.state.symbol;
    }
  },
  watch: {
    timeFrame() {
      this.mana();
    },
    symbol() {
      this.mana();
    }
  },
  methods: {
    mana() {
      clearInterval(this.interval);
      this.$socket.client.emit("getKlines", { timeframe: this.timeFrame, symbol: this.symbol });
      d3.select(".graph")
        .selectAll("*")
        .remove();
      this.graph();
    },
    graph() {
      let parentThis = this;
      var dim = {
        width: document.getElementsByClassName("graph")[0].offsetWidth,
        height: 880,
        margin: {
          top: 20,
          right: 60,
          bottom: 30,
          left: 50
        },
        ohlc: {
          height: 500
        },
        indicator: {
          height: 100,
          padding: 5
        }
      };
      dim.plot = {
        width: dim.width - dim.margin.left - dim.margin.right,
        height: dim.height - dim.margin.top - dim.margin.bottom
      };
      dim.indicator.top = dim.ohlc.height + dim.indicator.padding;
      dim.indicator.bottom = dim.indicator.top + dim.indicator.height;
      dim.indicator.rsiS = dim.ohlc.height;

      var indicatorTop = d3.scaleLinear().range([dim.indicator.top, dim.indicator.top + dim.margin.top]);

      window.onresize = function() {
        //d3.select('.graph').call(resize).call(draw);
      };

      //window.addEventListener('resize', this.mana);

      function resize(selection) {
        dim.width = window.innerWidth;
        d3.select(".graph")
          .append("svg")
          .attr("width", dim.width)
          .attr("height", dim.height);
      }

      var parseDate = d3.timeParse("%d-%b-%y");

      var zoom = d3.zoom().on("zoom", zoomed);

      var x = techan.scale.financetime().range([0, dim.plot.width]);

      var y = d3.scaleLinear().range([dim.ohlc.height, 0]);

      var yPercent = y.copy();

      var yInit, yPercentInit, zoomableInit, t;

      var yVolume = d3.scaleLinear().range([y(0), y(0.2)]);

      var candlestick = techan.plot
        .candlestick()
        .xScale(x)
        .yScale(y);

      var sma0 = techan.plot
        .sma()
        .xScale(x)
        .yScale(y);

      var sma1 = techan.plot
        .sma()
        .xScale(x)
        .yScale(y);

      var ema2 = techan.plot
        .ema()
        .xScale(x)
        .yScale(y);

      var volume = techan.plot
        .volume()
        .accessor(candlestick.accessor()) // Set the accessor to a ohlc accessor so we get highlighted bars
        .xScale(x)
        .yScale(yVolume);

      var xAxis = d3.axisBottom(x);

      var timeAnnotation = techan.plot
        .axisannotation()
        .axis(xAxis)
        .orient("bottom")
        .format(d3.timeFormat("%Y-%m-%d"))
        .width(65)
        .translate([0, dim.plot.height]);

      var yAxis = d3.axisRight(y);

      var ohlcAnnotation = techan.plot
        .axisannotation()
        .axis(yAxis)
        .orient("right")
        .format(d3.format(",.4f"))
        .translate([x(1), 0]);

      var closeAnnotation = techan.plot
        .axisannotation()
        .axis(yAxis)
        .orient("right")
        .accessor(candlestick.accessor())
        .format(d3.format(",.4f"))
        .translate([x(1), 0]);

      var percentAxis = d3.axisLeft(yPercent).tickFormat(d3.format("+.1%"));

      var percentAnnotation = techan.plot
        .axisannotation()
        .axis(percentAxis)
        .orient("left");

      var volumeAxis = d3
        .axisRight(yVolume)
        .ticks(3)
        .tickFormat(d3.format(",.3s"));

      var volumeAnnotation = techan.plot
        .axisannotation()
        .axis(volumeAxis)
        .orient("right")
        .width(35);

      var macdScale = d3.scaleLinear().range([indicatorTop(0) + dim.indicator.height, indicatorTop(0)]);

      var rsiScale = macdScale.copy().range([indicatorTop(1) + dim.indicator.height, indicatorTop(1)]);

      var rsiStochScale = macdScale.copy().range([indicatorTop(1) + dim.indicator.height, indicatorTop(1)]);

      var macd = techan.plot
        .macd()
        .xScale(x)
        .yScale(macdScale);

      var macdAxis = d3.axisRight(macdScale).ticks(3);

      var macdAnnotation = techan.plot
        .axisannotation()
        .axis(macdAxis)
        .orient("right")
        .format(d3.format(",.2f"))
        .translate([x(1), 0]);

      var macdAxisLeft = d3.axisLeft(macdScale).ticks(3);

      var macdAnnotationLeft = techan.plot
        .axisannotation()
        .axis(macdAxisLeft)
        .orient("left")
        .format(d3.format(",.2f"));

      var rsiStoch = techan.plot
        .rsi()
        .xScale(x)
        .yScale(rsiStochScale);

      var rsiStochAxis = d3.axisRight(rsiStochScale).ticks(3);

      var rsiStochAnnotation = techan.plot
        .axisannotation()
        .axis(rsiStochAxis)
        .orient("right")
        .format(d3.format(",.2f"))
        .translate([x(1), "0"]);

      var rsiStochAxisLeft = d3.axisLeft(rsiStochAxis).ticks(3);

      var rsiStochAnnotationLeft = techan.plot
        .axisannotation()
        .axis(rsiStochAxisLeft)
        .orient("left")
        .format(d3.format(",.2f"));

      var rsi = techan.plot
        .rsi()
        .xScale(x)
        .yScale(rsiScale);

      var rsiAxis = d3.axisRight(rsiScale).ticks(3);

      var rsiAnnotation = techan.plot
        .axisannotation()
        .axis(rsiAxis)
        .orient("right")
        .format(d3.format(",.2f"))
        .translate([x(1), 0]);

      var rsiAxisLeft = d3.axisLeft(rsiScale).ticks(3);

      var rsiAnnotationLeft = techan.plot
        .axisannotation()
        .axis(rsiAxisLeft)
        .orient("left")
        .format(d3.format(",.2f"));

      var ohlcCrosshair = techan.plot
        .crosshair()
        .xScale(timeAnnotation.axis().scale())
        .yScale(ohlcAnnotation.axis().scale())
        .xAnnotation(timeAnnotation)
        .yAnnotation([ohlcAnnotation, percentAnnotation, volumeAnnotation])
        .verticalWireRange([0, dim.plot.height]);

      var macdCrosshair = techan.plot
        .crosshair()
        .xScale(timeAnnotation.axis().scale())
        .yScale(macdAnnotation.axis().scale())
        .xAnnotation(timeAnnotation)
        .yAnnotation([macdAnnotation, macdAnnotationLeft])
        .verticalWireRange([0, dim.plot.height]);

      var rsiCrosshair = techan.plot
        .crosshair()
        .xScale(timeAnnotation.axis().scale())
        .yScale(rsiAnnotation.axis().scale())
        .xAnnotation(timeAnnotation)
        .yAnnotation([rsiAnnotation, rsiAnnotationLeft])
        .verticalWireRange([0, dim.plot.height]);

      var rsiStochCrosshair = techan.plot
        .crosshair()
        .xScale(timeAnnotation.axis().scale())
        .yScale(rsiAnnotation.axis().scale())
        .xAnnotation(timeAnnotation)
        .yAnnotation([rsiAnnotation, rsiAnnotationLeft])
        .verticalWireRange([0, dim.plot.height]);

      var svg = d3
        .select(".graph")
        .append("svg")
        .attr("width", dim.width)
        .attr("height", dim.height);

      var defs = svg.append("defs");

      defs
        .append("clipPath")
        .attr("id", "ohlcClip")
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", dim.plot.width)
        .attr("height", dim.ohlc.height);

      defs
        .selectAll("indicatorClip")
        .data([0, 1, 2])
        .enter()
        .append("clipPath")
        .attr("id", function(d, i) {
          return "indicatorClip-" + i;
        })
        .append("rect")
        .attr("x", 0)
        .attr("y", function(d, i) {
          return indicatorTop(i);
        })
        .attr("width", dim.plot.width)
        .attr("height", dim.indicator.height);

      svg = svg.append("g").attr("transform", "translate(" + dim.margin.left + "," + dim.margin.top + ")");

      svg
        .append("text")
        .attr("class", "symbol")
        .attr("x", 20)
        .attr("font-size", "16px")
        .text(parentThis.symbol + " (" + parentThis.timeFrame + ")");

      svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + dim.plot.height + ")");

      var ohlcSelection = svg
        .append("g")
        .attr("class", "ohlc")
        .attr("transform", "translate(0,0)");

      ohlcSelection
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + x(1) + ",0)")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -12)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

      ohlcSelection
        .append("g")
        .attr("font-size", "14px")
        .attr("class", "close annotation up");

      ohlcSelection
        .append("g")
        .attr("class", "volume")
        .attr("clip-path", "url(#ohlcClip)");

      ohlcSelection
        .append("g")
        .attr("class", "candlestick")
        .attr("clip-path", "url(#ohlcClip)");

      ohlcSelection
        .append("g")
        .attr("class", "indicator sma ma-0")
        .attr("clip-path", "url(#ohlcClip)");

      ohlcSelection
        .append("g")
        .attr("class", "indicator sma ma-1")
        .attr("clip-path", "url(#ohlcClip)");

      ohlcSelection
        .append("g")
        .attr("class", "indicator ema ma-2")
        .attr("clip-path", "url(#ohlcClip)");

      ohlcSelection.append("g").attr("class", "percent axis");

      ohlcSelection.append("g").attr("class", "volume axis");

      var indicatorSelection = svg
        .selectAll("svg > g.indicator")
        .data(["macd", "rsi", "rsiStoch"])
        .enter()
        .append("g")
        .attr("class", function(d) {
          return d + " indicator";
        });

      indicatorSelection
        .append("g")
        .attr("class", "axis right")
        .attr("transform", "translate(" + x(1) + ",0)");

      indicatorSelection
        .append("g")
        .attr("class", "axis left")
        .attr("transform", "translate(" + x(0) + ",0)");

      indicatorSelection
        .append("g")
        .attr("class", "indicator-plot")
        .attr("clip-path", function(d, i) {
          return "url(#indicatorClip-" + i + ")";
        });

      svg.append("g").attr("class", "crosshair ohlc");
      svg.append("g").attr("class", "crosshair macd");
      svg.append("g").attr("class", "crosshair rsi");
      svg.append("g").attr("class", "crosshair rsiStoch");

      document.getElementsByClassName("rsi")[0].style.transform = " translate(0px, 80px)";
       document.getElementsByClassName("crosshair rsi")[0].style.transform = " translate(0px, 80px)";
      document.getElementsByClassName("rsiStoch")[0].style.transform = " translate(0px, 170px)";
      document.getElementsByClassName("crosshair rsiStoch")[0].style.transform = " translate(0px, 195px)";
     
      
      svg.call(zoom);

      svg
        .append("g")
        .attr("class", "grid")
        .call(
          make_y_gridlines()
            .tickSize(-dim.plot.width)
            .tickFormat("")
        );

      this.interval = setInterval(() => {
        if (this.data[0]) {
          this.$socket.client.emit("getKlines", { timeframe: parentThis.timeFrame, symbol: parentThis.symbol });
          var accessor = candlestick.accessor();

          let data = this.data
            .map(function(d) {
              const timestamp = new Date(d[0]);
              timestamp.setHours(timestamp.getHours() + 5);
              return {
                date: timestamp,
                open: +d[1],
                high: +d[2],
                low: +d[3],
                close: +d[4],
                volume: +d[5]
              };
            })
            .sort(function(a, b) {
              return d3.ascending(accessor.d(a), accessor.d(b));
            });

          x.domain(techan.scale.plot.time(data).domain()).zoomable();
          y.domain(techan.scale.plot.ohlc(data).domain());
          yPercent.domain(techan.scale.plot.percent(y, accessor(data)).domain());
          yVolume.domain(techan.scale.plot.volume(data).domain());

          var macdData = techan.indicator.macd()(data);
          macdScale.domain(techan.scale.plot.macd(macdData).domain());
          var rsiData = techan.indicator.rsi()(data);
          var rsiStochData = JSON.parse(JSON.stringify(rsiData));
          rsiScale.domain(techan.scale.plot.rsi(rsiData).domain());
          rsiStochScale.domain(techan.scale.plot.rsi(rsiStochData).domain());

          let collection = [];
          const period = 50;
          let highest, lowest, stochRSI;

          for (let i in rsiStochData) {
            collection.push(rsiStochData[i]);
            rsiStochData[i].date = rsiData[i].date;

            if (collection.length >= period) {
              lowest = collection.reduce((min, p) => (p.rsi < min ? p.rsi : min), collection[0].rsi);
              highest = collection.reduce((max, p) => (p.rsi > max ? p.rsi : max), collection[0].rsi);
              stochRSI = ((rsiStochData[i].rsi - lowest) / (highest - lowest)) * 100;
              rsiStochData[i].rsi = stochRSI;
              collection.shift();
            }
          }

          svg
            .select("g.candlestick")
            .datum(data)
            .call(candlestick);
          svg
            .select("g.close.annotation")
            .datum([data[data.length - 1]])
            .call(closeAnnotation);
          svg
            .select("g.volume")
            .datum(data)
            .call(volume);
          svg
            .select("g.sma.ma-0")
            .datum(techan.indicator.sma().period(21)(data))
            .call(sma0);
          svg
            .select("g.sma.ma-1")
            .datum(techan.indicator.sma().period(50)(data))
            .call(sma1);
          svg
            .select("g.ema.ma-2")
            .datum(techan.indicator.ema().period(200)(data))
            .call(ema2);
          svg
            .select("g.macd .indicator-plot")
            .datum(macdData)
            .call(macd);
          svg
            .select("g.rsi .indicator-plot")
            .datum(rsiData)
            .call(rsi);
          svg
            .select("g.rsiStoch .indicator-plot")
            .datum(rsiStochData)
            .call(rsiStoch);
          svg.select("g.crosshair.ohlc").call(ohlcCrosshair);
          svg.select("g.crosshair.macd").call(macdCrosshair);
          svg.select("g.crosshair.rsi").call(rsiCrosshair);
          svg.select("g.crosshair.rsiStoch").call(rsiStochCrosshair);

          // draw();

          if (!t) {
            zoomableInit = x
              .zoomable()
              .domain([0, data.length])
              .clamp(false)
              .copy();
            t = d3.zoomTransform(svg.node());
            yPercentInit = yPercent.copy();
            yInit = y.copy();
          }
          let smaLength = techan.indicator.sma().period(21)(data).length - 1;
          document.title = data[data.length - 1].close.toFixed(4) + " | Boca | " + Math.round(rsiStochData[rsiStochData.length - 1].rsi);
          this.$store.commit("updatePrice", Number(data[data.length - 1].close));
          this.$store.commit("updateMacD", macdData[macdData.length - 1].macd);
          this.$store.commit("updateRsi", rsiData[rsiData.length - 1].rsi);
          this.$store.commit("updateStoch", rsiStochData[rsiStochData.length - 1].rsi);
          this.$store.commit("updateEma1", techan.indicator.sma().period(21)(data)[smaLength].value);

          svg.call(zoom.transform, t);
        }
      }, 5000);

      function zoomed() {
        x.zoomable().domain(d3.event.transform.rescaleX(zoomableInit).domain());
        y.domain(d3.event.transform.rescaleY(yInit).domain());
        yPercent.domain(d3.event.transform.rescaleY(yPercentInit).domain());
        t = d3.zoomTransform(svg.node());
        draw();
      }

      function make_y_gridlines() {
        return d3.axisLeft(y).ticks(5);
      }

      function draw() {
        svg.select("g.x.axis").call(xAxis);
        svg.select("g.ohlc .axis").call(yAxis);
        svg.select("g.volume.axis").call(volumeAxis);
        svg.select("g.percent.axis").call(percentAxis);
        svg.select("g.macd .axis.right").call(macdAxis);
        svg.select("g.rsi .axis.right").call(rsiAxis);
        svg.select("g.macd .axis.left").call(macdAxisLeft);
        svg.select("g.rsi .axis.left").call(rsiAxisLeft);
        svg.select("g.rsiStoch .axis.right").call(rsiAxis);
        svg.select("g.rsiStoch .axis.left").call(rsiAxisLeft);

        svg.select("g.candlestick").call(candlestick);
        svg.select("g.close.annotation").call(closeAnnotation);
        svg.select("g.volume").call(volume);
        svg.select("g .sma.ma-0").call(sma0);
        svg.select("g .sma.ma-1").call(sma1);
        svg.select("g .ema.ma-2").call(ema2);
        svg.select("g.macd .indicator-plot").call(macd);
        svg.select("g.rsi .indicator-plot").call(rsi);
        svg.select("g.rsiStoch .indicator-plot").call(rsiStoch);
        svg.select("g.crosshair.ohlc").call(ohlcCrosshair);
        svg.select("g.crosshair.macd").call(macdCrosshair);
        svg.select("g.crosshair.rsiStoch").call(rsiStochCrosshair);
        document.getElementsByClassName("rsiStoch")[0].lastElementChild.firstElementChild.style.transform = " translate(0px, 25px)";
        document.querySelector("g.rsiStoch.indicator g.axis.left").style.transform = " translate(0px, 25px)";
        let widthX = dim.width - 110;
        document.querySelector("g.rsiStoch.indicator g.axis.right").style.transform = " translate(" + widthX + "px, 25px)";
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
    document.title = "Boca";
  },
  mounted() {
    this.$socket.client.emit("getKlines", { timeframe: this.timeFrame, symbol: this.symbol });
    this.graph();
  }
};
</script>

<style lang="less">
text {
  fill: #bbbbbb;
}

path {
  fill: none;
  stroke-width: 1;
}

path.candle {
  stroke: #000000;
}

path.candle.body {
  stroke-width: 0;
}

path.candle.up {
  fill: #00b8d4;
  stroke: #00b8d4;
}

path.candle.down {
  fill: #bf360c;
  stroke: #bf360c;
}

.close.annotation.up path {
  fill: #00b8d4;
}

path.volume {
  fill: #000000;
}

.indicator-plot path.line {
  fill: none;
  stroke-width: 1;
}

.ma-0 path.line {
  stroke: #1f76b475;
}

.ma-1 path.line {
  stroke: #aec7e875;
}

.ma-2 path.line {
  stroke: #ff7e0e7a;
}

path.macd {
  stroke: #0000aa;
}

path.signal {
  stroke: #ff9999;
}

path.zero {
  stroke: #bbbbbb;
  stroke-dasharray: 0;
  stroke-opacity: 0.5;
}

path.difference {
  fill: #bbbbbb;
  opacity: 0.5;
}

path.rsi {
  stroke: #adadad;
}

path.overbought,
path.oversold {
  stroke: #ff9999;
  stroke-dasharray: 5, 5;
}

path.middle,
path.zero {
  stroke: #bbbbbb;
  stroke-dasharray: 5, 5;
}

.analysis path,
.analysis circle {
  stroke: blue;
  stroke-width: 0.8;
}

.trendline circle {
  stroke-width: 0;
  display: none;
}

.mouseover .trendline path {
  stroke-width: 1.2;
}

.mouseover .trendline circle {
  stroke-width: 1;
  display: inline;
}

.dragging .trendline path,
.dragging .trendline circle {
  stroke: darkblue;
}

.interaction path,
.interaction circle {
  pointer-events: all;
}

.interaction .body {
  cursor: move;
}

.trendlines .interaction .start,
.trendlines .interaction .end {
  cursor: nwse-resize;
}

.supstance path {
  stroke-dasharray: 2, 2;
}

.supstances .interaction path {
  pointer-events: all;
  cursor: ns-resize;
}

.mouseover .supstance path {
  stroke-width: 1.5;
}

.dragging .supstance path {
  stroke: darkblue;
}

.crosshair {
  cursor: crosshair;
}

.crosshair path.wire {
  stroke: #dddddd;
  stroke-dasharray: 1, 1;
}

.crosshair .axisannotation path {
  fill: #dddddd;
}

.tradearrow path.tradearrow {
  stroke: none;
}

.tradearrow path.buy {
  fill: #0000ff;
}

.tradearrow path.sell {
  fill: #9900ff;
}

.tradearrow path.highlight {
  fill: none;
  stroke-width: 2;
}

.tradearrow path.highlight.buy {
  stroke: #0000ff;
}

.tradearrow path.highlight.sell {
  stroke: #9900ff;
}

.time {
  min-width: 0px;
  margin: 0px;
}

.box {
  background-color: black;
}

.graph {
  height: 100vh;
}

.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 2px;
}

.grid line {
  stroke: lightgrey;
  stroke-opacity: 0.2;
  shape-rendering: crispEdges;
}

.grid path {
  stroke-width: 0;
}

.crosshair .axisannotation path {
  fill: #272727;
  font-size: 1em;
}

g.ohlc > g.close > g.data > text {
  fill: black;
}
</style>
