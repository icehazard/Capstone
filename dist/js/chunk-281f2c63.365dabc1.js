(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-281f2c63"],{"0e8f":function(t,e,a){"use strict";a("20f6");var s=a("e8f2");e["a"]=Object(s["a"])("flex")},"3fd1":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{staticClass:"login fill-height",attrs:{fluid:""}},[a("v-layout",{staticClass:"align-center justify-center",attrs:{row:"",wrap:""}},[a("v-flex",[a("v-card",{staticClass:"mx-auto",attrs:{elevation:13,"max-width":"500"}},[a("div",{staticClass:"gradient d-flex mb-3"},[a("p",{staticClass:"display-1 pt-3 mx-auto grey--text text--darken-3"},[t._v("Registration")])]),a("v-card-text",{staticClass:"pb-0 pt-5"},[a("v-text-field",{attrs:{label:"Email",outlined:"",hint:"Email is avaiable"},model:{value:t.email,callback:function(e){t.email=e},expression:"email"}}),a("v-text-field",{attrs:{label:"Password",outlined:"",type:"password",hint:"Must be at least 8 characters long"},model:{value:t.password,callback:function(e){t.password=e},expression:"password"}})],1),a("v-card-actions",{staticClass:"pb-4 pt-0 pl-4"},[a("v-btn",{staticClass:"px-5 grey--text text--darken-3",attrs:{color:"primary"},on:{click:t.registration}},[t._v("Register")]),a("v-spacer"),a("span",{staticClass:"caption mr-3 ml-5 text-center "},[t._v("By clicking register, you agree to our "),a("a",[a("router-link",{attrs:{to:"terms"}},[t._v("Terms of use")])],1)])],1)],1)],1)],1)],1)},i=[],r={components:{},data:function(){return{email:"",password:""}},methods:{registration:function(){this.$socket.client.emit("registration",{email:this.email,password:this.password})}},sockets:{registration:function(t){t.success&&(this.$store.commit("updatesToken",t.token),this.$store.commit("updatesEmail",t.email),this.$socket.client.disconnect(),this.$socket.client.io.opts.query={token:t.token},this.$socket.client.connect(),this.email="",this.password="",this.$router.push("/"),console.log("TCL: registration -> val.success",t)),t.error&&console.log(t.error)}}},o=r,n=a("2877"),c=a("6544"),l=a.n(c),u=a("8336"),d=a("b0af"),p=a("99d9"),f=a("a523"),m=a("0e8f"),v=a("a722"),h=a("2fa4"),x=a("8654"),g=Object(n["a"])(o,s,i,!1,null,"1df503e1",null);e["default"]=g.exports;l()(g,{VBtn:u["a"],VCard:d["a"],VCardActions:p["a"],VCardText:p["b"],VContainer:f["a"],VFlex:m["a"],VLayout:v["a"],VSpacer:h["a"],VTextField:x["a"]})},a722:function(t,e,a){"use strict";a("20f6");var s=a("e8f2");e["a"]=Object(s["a"])("layout")}}]);
//# sourceMappingURL=chunk-281f2c63.365dabc1.js.map