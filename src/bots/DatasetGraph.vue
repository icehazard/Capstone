<template>
  <section>
    <v-card class="" color="grey darken-4 mx-3 elevation-16" height="550px">
      <div class="graphHistory"></div>
    </v-card>
  </section>
</template>

<script>
export default {
  data() {
    return {
      data: null
    };
  },
  methods: {
    graph() {
      var margin = { top: 20, right: 20, bottom: 100, left: 50 },
        margin2 = { top: 420, right: 20, bottom: 20, left: 50 },
        width = 1660 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        height2 = 500 - margin2.top - margin2.bottom;

      var parseDate = d3.timeParse("%d-%b-%y");
      var x = techan.scale.financetime().range([0, width]);
      var x2 = techan.scale.financetime().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);
      var yVolume = d3.scaleLinear().range([y(0), y(0.3)]);
      var y2 = d3.scaleLinear().range([height2, 0]);

      var brush = d3
        .brushX()
        .extent([
          [0, 0],
          [width, height2]
        ])
        .on("end", brushed);

      var candlestick = techan.plot
        .candlestick()
        .xScale(x)
        .yScale(y);

      var volume = techan.plot
        .volume()
        .xScale(x)
        .yScale(yVolume);

      var close = techan.plot
        .close()
        .xScale(x2)
        .yScale(y2);

      var xAxis = d3.axisBottom(x);
      var xAxis2 = d3.axisBottom(x2);
      var yAxis = d3.axisLeft(y);
      var yAxis2 = d3.axisLeft(y2).ticks(0);

      var ohlcAnnotation = techan.plot
        .axisannotation()
        .axis(yAxis)
        .orient("left")
        .format(d3.format(",.2f"));

      var timeAnnotation = techan.plot
        .axisannotation()
        .axis(xAxis)
        .orient("bottom")
        .format(d3.timeFormat("%Y-%m-%d"))
        .width(65)
        .translate([0, height]);

      var crosshair = techan.plot
        .crosshair()
        .xScale(x)
        .yScale(y)
        .xAnnotation(timeAnnotation)
        .yAnnotation(ohlcAnnotation);

      var svg = d3
        .select(".graphHistory")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      var focus = svg
        .append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      focus
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("x", 0)
        .attr("y", y(1))
        .attr("width", width)
        .attr("height", y(0) - y(1));

      focus
        .append("g")
        .attr("class", "volume")
        .attr("clip-path", "url(#clip)");

      focus
        .append("g")
        .attr("class", "candlestick")
        .attr("clip-path", "url(#clip)");

      focus
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")");

      focus
        .append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

      focus
        .append("g")
        .attr("class", "crosshair")
        .call(crosshair);

      var context = svg
        .append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

      context.append("g").attr("class", "close");
      context.append("g").attr("class", "pane");

      context
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")");

      context
        .append("g")
        .attr("class", "y axis")
        .call(yAxis2);

      var accessor = candlestick.accessor(),
        timestart = Date.now();

      let data = this.data
        .map(function(d) {
          const timestamp = new Date(d[0]);
          timestamp.setHours(timestamp.getHours());
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

      x.domain(data.map(accessor.d));
      x2.domain(x.domain());
      y.domain(techan.scale.plot.ohlc(data, accessor).domain());
      y2.domain(y.domain());
      yVolume.domain(techan.scale.plot.volume(data).domain());

      focus.select("g.candlestick").datum(data);
      focus.select("g.volume").datum(data);

      context
        .select("g.close")
        .datum(data)
        .call(close);
      context.select("g.x.axis").call(xAxis2);

      // Associate the brush with the scale and render the brush only AFTER a domain has been applied
      context
        .select("g.pane")
        .call(brush)
        .selectAll("rect")
        .attr("height", height2);

      x.zoomable().domain(x2.zoomable().domain());
      draw();

      console.log("Render time: " + (Date.now() - timestart));

      function brushed() {
        var zoomable = x.zoomable(),
          zoomable2 = x2.zoomable();

        zoomable.domain(zoomable2.domain());
        if (d3.event.selection !== null) zoomable.domain(d3.event.selection.map(zoomable.invert));
        draw();
      }

      function draw() {
        var candlestickSelection = focus.select("g.candlestick"),
          data = candlestickSelection.datum();
        y.domain(techan.scale.plot.ohlc(data.slice.apply(data, x.zoomable().domain()), candlestick.accessor()).domain());
        candlestickSelection.call(candlestick);
        focus.select("g.volume").call(volume);
        // using refresh method is more efficient as it does not perform any data joins
        // Use this if underlying data is not changing
        //        svg.select("g.candlestick").call(candlestick.refresh);
        focus.select("g.x.axis").call(xAxis);
        focus.select("g.y.axis").call(yAxis);
      }
    }
  },
  sockets: {
    historicalDataBot(val) {
      d3.select(".graphHistory > svg").remove();
      this.data = val;
      this.graph();
    }
  },
  mounted() {
    //this.$socket.client.emit("historicalDataBot", {})
  }
};
</script>

<style>
text {
  fill: rgb(235, 235, 235);
}

path.candle {
  stroke: white;
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

path.ohlc {
  stroke: #000000;
  stroke-width: 1;
}

path.ohlc.up {
  stroke: #00aa00;
}

path.ohlc.down {
  stroke: #ff0000;
}

path.volume {
  fill: #616161;
}

path.line {
  fill: none;
  stroke: #fb8c00;
  stroke-width: 1;
}

.extent {
  stroke: #fff;
  fill-opacity: 0.125;
  shape-rendering: crispEdges;
}

.crosshair {
  cursor: crosshair;
}

.crosshair path.wire {
  stroke: #dddddd;
  stroke-dasharray: 1, 1;
}

.crosshair .axisannotation path {
  fill: #212121;
}
</style>
