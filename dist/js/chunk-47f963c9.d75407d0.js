(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-47f963c9"],{"1cfb":function(t,e,a){},3232:function(t,e,a){"use strict";var r=a("a088"),n=a.n(r);n.a},7244:function(t,e,a){"use strict";var r=a("b454"),n=a.n(r);n.a},a088:function(t,e,a){},b454:function(t,e,a){},ddcb:function(t,e,a){"use strict";var r=a("1cfb"),n=a.n(r);n.a},eec5:function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("section",[a("top"),a("waves"),a("DataTable")],1)},n=[],i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("svg",{staticClass:"editorial",attrs:{viewBox:"0 24 150 28 ",preserveAspectRatio:"none"}},[a("defs",[a("path",{attrs:{id:"gentle-wave",d:"M-160 44c30 0 \n  58-18 88-18s\n  58 18 88 18 \n  58-18 88-18 \n  58 18 88 18\n  v44h-352z"}})]),a("g",{staticClass:"parallax1"},[a("use",{attrs:{"xlink:href":"#gentle-wave",x:"50",y:"3",fill:"#FFA000"}})]),a("g",{staticClass:"parallax2"},[a("use",{attrs:{"xlink:href":"#gentle-wave",x:"50",y:"0",fill:"#424242"}})]),a("g",{staticClass:"parallax3"},[a("use",{attrs:{"xlink:href":"#gentle-wave",x:"50",y:"9",fill:"#616161"}})]),a("g",{staticClass:"parallax4"},[a("use",{attrs:{"xlink:href":"#gentle-wave",x:"50",y:"6",fill:"#EEEEEE"}})])])},s=[],o={},c=o,l=(a("7244"),a("2877")),u=Object(l["a"])(c,i,s,!1,null,null,null),d=u.exports,v=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"top  grey darken-4"},[a("v-container",[a("v-row",{staticClass:"mt-12"},[a("v-col",{staticClass:"mt-6"},[a("div",{staticClass:"display-4 primary--text"},[t._v("\n          Boca Chica\n        ")]),a("div",{staticClass:"display-1 mt-6"},[t._v("\n          Trading Platform for Bitcoin, Ethereum, Iota, and other cryptocurrencies on Binance.\n        ")]),a("div",{staticClass:"display-1 mt-2"},[t._v("\n          Trade safer with your extended toolset.\n        ")]),a("div",{staticClass:"mt-10"},[a("v-btn",{attrs:{to:"trade",large:"",outlined:"",color:"primary"}},[t._v("Start Trading Now ")])],1)])],1)],1)],1)},f=[],m={},p=m,h=(a("ddcb"),a("6544")),g=a.n(h),x=a("8336"),y=a("62ad"),C=a("a523"),k=a("0fd9"),_=Object(l["a"])(p,v,f,!1,null,"3725cf9e",null),b=_.exports;g()(_,{VBtn:x["a"],VCol:y["a"],VContainer:C["a"],VRow:k["a"]});var w=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"body grey lighten-3"},[a("v-container",{},[a("div",{staticClass:"display-1 text-center grey--text text--darken-3"},[t._v("Top 100 Cryptocurrencies by Market Capitalization")]),a("v-row",{staticClass:"mt-12"},[a("v-col",[a("v-data-table",{staticClass:"elevation-16 pa-10 font-weight-medium",attrs:{"footer-props":{itemsPerPageOptions:[15]},light:"",headers:t.headers,items:t.data},scopedSlots:t._u([{key:"item.rank",fn:function(e){var r=e.item;return[a("div",[t._v(t._s(r.rank))])]}},{key:"item.icon",fn:function(t){var e=t.item;return[a("img",{staticClass:"img_icon",attrs:{src:e.icon,onerror:"this.onerror=null;this.src='https://coincap.io/static/logo_mark.png'"}}),a("div")]}},{key:"item.volumeUsd24Hr",fn:function(e){var r=e.item;return[a("div",[t._v(t._s(t._f("marketCap")(r.volumeUsd24Hr)))])]}},{key:"item.priceUsd",fn:function(e){var r=e.item;return[a("div",{},[t._v(t._s(t._f("price")(r.priceUsd)))])]}},{key:"item.marketCapUsd",fn:function(e){var r=e.item;return[a("div",[t._v(t._s(t._f("marketCap")(r.marketCapUsd)))])]}},{key:"item.changePercent24Hr",fn:function(e){var r=e.item;return[a("div",{class:[r.changePercent24Hr>0?"green--text":"red--text"]},[t._v(t._s(t._f("percentage")(r.changePercent24Hr)))])]}}])})],1)],1)],1)],1)},$=[],P=(a("ac4d"),a("8a81"),a("ac6a"),a("c5f6"),{data:function(){return{imgAlt:new Image(30,30),data:[],interval:null,headers:[{text:"Rank",value:"rank"},{text:"",value:"icon"},{text:"Name",value:"name"},{text:"Symbol",value:"symbol"},{text:"Price",value:"priceUsd"},{text:"Market Cap",value:"marketCapUsd"},{text:"Volume (24Hr)",value:"volumeUsd24Hr"},{text:"Change (24Hr)",value:"changePercent24Hr"}]}},methods:{},filters:{percentage:function(t){return Number(t).toFixed(2)+" %"},largeVal:function(t){return Math.round(t)},price:function(t){return t=Number(t),t>1e3?"$"+t.toFixed(0):t>1?"$"+t.toFixed(2):t>.01?"$"+t.toFixed(4):"$"+t.toFixed(6)},marketCap:function(t){return t=Number(t),t>1e12?"$"+Math.round(t/1e12)+" T":t>1e9?"$"+Math.round(t/1e9)+" B":t>1e6?"$"+Math.round(t/1e6)+" M":t>1e3?"$"+Math.round(t/1e3)+" K":"$"+t.toFixed(0)}},computed:{showTradingPairPanel:function(){return this.$store.state.showTradingPairPanel},search:function(){return this.$store.state.searchTradingPairPanel}},sockets:{homeOrder:function(t){this.data=t.data;var e=!0,a=!1,r=void 0;try{for(var n,i=this.data[Symbol.iterator]();!(e=(n=i.next()).done);e=!0){var s=n.value;s.icon="https://static.coincap.io/assets/icons/"+String(s.symbol).toLowerCase()+"@2x.png"}}catch(o){a=!0,r=o}finally{try{e||null==i.return||i.return()}finally{if(a)throw r}}}},beforeDestroy:function(){clearInterval(this.interval)},mounted:function(){var t=this;this.$socket.client.emit("homeOrder"),this.interval=setInterval((function(){t.$socket.client.emit("homeOrder")}),1e3)}}),E=P,T=(a("3232"),a("8fea")),V=Object(l["a"])(E,w,$,!1,null,"786fdcfe",null),H=V.exports;g()(V,{VCol:y["a"],VContainer:C["a"],VDataTable:T["a"],VRow:k["a"]});var M={components:{waves:d,DataTable:H,top:b}},U=M,F=Object(l["a"])(U,r,n,!1,null,"6930f11f",null);e["default"]=F.exports}}]);
//# sourceMappingURL=chunk-47f963c9.d75407d0.js.map