webpackJsonp([1],{"8K5T":function(t,e){},"9BHd":function(t,e){},"9eNI":function(t,e){},HuWz:function(t,e){},NHnr:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});s("8K5T");var i=s("KvPw"),a=s.n(i),n=(s("9BHd"),s("7+uW")),o={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},staticRenderFns:[]};var h=s("VU/8")({name:"App"},o,!1,function(t){s("HuWz")},null,null).exports,r=s("/ocq"),c={render:function(){var t=this.$createElement,e=this._self._c||t;return this.done?e("div",[e("img",{attrs:{src:this.dataURL}})]):e("div",[e("vue-dropzone",{ref:"myDropzone",attrs:{id:"dropzone",options:this.options,useCustomSlot:!0},on:{"vdropzone-thumbnail":this.thumbnail}},[e("h5",{staticClass:"dropzone-custom-content"},[this._v("drag files or click to upload")])])],1)},staticRenderFns:[]};var d={name:"Upload",components:{Dropzone:s("VU/8")({name:"Dropzone",props:["callback"],data:function(){return{done:!1,dataURL:"",options:{autoProcessQueue:!1,url:"https://github.com/rob--"}}},methods:{thumbnail:function(t,e){this.dataURL=e,this.done=!0,this.callback&&this.callback(t)}}},c,!1,function(t){s("coFE")},"data-v-76611440",null).exports},data:function(){return{}},methods:{setFile:function(t){var e=this;return function(s){return e.$store.commit("setFile",{target:t,file:{dataURL:s.dataURL,height:s.height,width:s.width}})}},start:function(){this.$router.push({name:"core",params:{lsb:1}})}},computed:{done:function(){return this.$store.state.files.host&&this.$store.state.files.asset},text:function(){return this.done?"Now just click the button!":"Hi, upload your images below."}}},l={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"wrapper"},[s("transition",{attrs:{mode:"out-in",name:"fade"}},[s("h1",{key:"text-"+t.done},[t._v(t._s(t.text))])]),t._v(" "),s("div",{staticStyle:{position:"relative"}},[s("div",{style:{opacity:t.done?.4:1}},[s("div",{staticClass:"dropzone-box"},[t._m(0),t._v(" "),s("dropzone",{staticClass:"input",attrs:{callback:t.setFile("host")}})],1)]),t._v(" "),s("div",{style:{opacity:t.done?.4:1}},[s("div",{staticClass:"dropzone-box"},[t._m(1),t._v(" "),s("dropzone",{staticClass:"input",attrs:{callback:t.setFile("asset")}})],1)]),t._v(" "),t.done?s("div",{staticClass:"overlay"},[s("button",{staticClass:"btn",on:{click:function(e){t.start()}}},[t._v("click to start!")])]):t._e()])],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"text"},[e("h5",[this._v("Host Image")]),this._v(" "),e("p",[this._v("This is the main image that will contain the hidden image.")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"text"},[e("h5",[this._v("Asset Image")]),this._v(" "),e("p",[this._v("This is the asset image that will be hidden inside the host image.")])])}]};var v=s("VU/8")(d,l,!1,function(t){s("z1oT")},"data-v-53b16a84",null).exports,u=s("Dd8w"),g=s.n(u),_=s("NYxO"),f=s("g2WZ"),m=s.n(f),b={render:function(){this.$createElement;this._self._c;return this._m(0)},staticRenderFns:[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"details"},[s("div",[s("h3",[t._v("How does it work?")]),t._v(" "),s("blockquote",{staticStyle:{"text-align":"left"}},[t._v("\n      steganography, noun\n      "),s("br"),t._v(" "),s("i",[t._v("the practice of concealing messages or information within other non-secret text or data.")])]),t._v(" "),s("br"),t._v(" "),s("p",[t._v("\n      Every pixel in an image contains 4 channels: red, green, blue and alpha.\n      Each channel describes how much of that colour should be displayed, while alpha\n      describes the opacity of the channel.\n    ")]),t._v(" "),s("p",[t._v("\n      Each channel uses 1 byte (8 bits) to represent the value.\n      This means each channel has a maximum value of 255.\n      For example, take the binary value "),s("code",[t._v("11010101")]),t._v(",\n      that has a decimal value of "),s("code",[t._v("213")]),t._v(". By using\n      the least significant bit (right most bit), we can set that bit\n      to any value we want and the value only changes by either "),s("code",[t._v("+1")]),t._v("\n      or "),s("code",[t._v("-1")]),t._v(": "),s("code",[t._v("11010100 = 212")]),t._v(".\n    ")]),t._v(" "),s("p",[t._v("\n      Take the following colour:\n      "),t._v(" "),s("pre",{staticClass:"code",staticStyle:{"background-color":"rgba(167, 243, 229, 255)"}},[t._v("rgba(167, 243, 229, 255);"),s("br"),t._v("rgba(0b10100111, 0b11110011, 0b11100101, 0b11111111);")]),t._v("\n      Set the least significant bit of each channel to "),s("code",[t._v("0")]),t._v(":\n      "),t._v(" "),s("pre",{staticClass:"code",staticStyle:{"background-color":"rgba(166, 242, 228, 254)"}},[t._v("rgba(166, 242, 228, 254);"),s("br"),t._v("rgba(0b10100110, 0b11110010, 0b11100100, 0b11111110);")]),t._v("\n      The colours look identical, however we have now essentially saved\n      4 bits of information in this 1 pixel. This means to save 1 byte of\n      data would require using 2 pixels.\n    ")]),t._v(" "),s("p",[t._v("\n      We can apply the same logic but use the 2 or 3 least significant bits instead\n      of just 1, this will fluctuate the true value by a maximum of "),s("code",[t._v("3")]),t._v("\n      when using 2 least significant bits, or "),s("code",[t._v("7")]),t._v(" using 3.\n    ")]),t._v(" "),s("p",[t._v("\n      Take the following colour:\n      "),t._v(" "),s("pre",{staticClass:"code",staticStyle:{"background-color":"rgba(240, 160, 184, 248)"}},[t._v("rgba(240, 160, 184, 248);"),s("br"),t._v("rgba(0b11110000, 0b10100000, 0b10111000, 0b11111000);")]),t._v("\n      Set the three least significant bits of each channel to "),s("code",[t._v("1")]),t._v(":\n      "),t._v(" "),s("pre",{staticClass:"code",staticStyle:{"background-color":"rgba(247, 167, 191, 255)"}},[t._v("rgba(247, 167, 191, 255);"),s("br"),t._v("rgba(0b11110111, 0b10100111, 0b10111111, 0b11111111);")]),t._v("\n      It is still difficult to see a difference even when using 3 of the least significant\n      bits to store data. By using more bits, we can save more data inside of an image.\n      The downside is that the more bits you override from the original image, the worse the\n      encoded image will come out and the more quality will be lost.\n    ")]),t._v(" "),s("p",[t._v("\n      We can then use this theory to convert a given image into\n      an array of bits, and write each of those bits into the least\n      significant bits of whatever image we want to hide the given image\n      inside of.\n    ")])])])}]};var p={name:"Core",components:{Details:s("VU/8")({name:"Details"},b,!1,function(t){s("qlXD")},"data-v-3baa645f",null).exports},data:function(){return{canvas:{host:null,asset:null,new:null,extracted:null},loaded:{host:!1,asset:!1,new:!1},height:0,width:0,lsbCount:1,finished:{encoding:!1,decoding:!1},progress:{encoding:0,decoding:0}}},beforeMount:function(){this.host&&this.asset||this.$router.push({name:"upload"})},mounted:function(){this.init("host",this.host),this.init("asset",this.asset),this.init("new",this.host),this.canvas.extracted=document.createElement("canvas"),this.canvas.extracted.width=this.asset.width,this.canvas.extracted.height=this.asset.height,document.querySelector("#extracted").append(this.canvas.extracted),this.width=this.host.width,this.height=this.host.height},methods:{init:function(t,e){var s=this;this.canvas[t]=document.createElement("canvas"),this.canvas[t].width=e.width,this.canvas[t].height=e.height;var i=new Image(e.width,e.height);i.src=e.dataURL,i.onload=function(){s.canvas[t].getContext("2d").drawImage(i,0,0),s.loaded[t]=!0,"new"===t&&document.querySelector("#new").append(s.canvas.new),s.loaded.host&&s.loaded.asset&&s.loaded.new&&s.work()}},setLSB:function(t){this.lsbCount=t,this.finished.encoding=!1,this.finished.decoding=!1,this.work()},work:function(){var t=this,e=new m.a;e.addEventListener("message",function(e){var s=e.data;s.encode&&(t.progress.encoding=s.encode),s.encode&&100===s.encode&&(t.finished.encoding=!0),s.decode&&(t.progress.decoding=s.decode),s.decode&&100===s.decode&&(t.finished.decoding=!0),s.imageData&&(t.canvas.new.getContext("2d").putImageData(s.imageData.new,0,0),t.canvas.extracted.getContext("2d").putImageData(s.imageData.extracted,0,0))}),e.postMessage({lsbCount:this.lsbCount,imageData:{host:this.canvas.host.getContext("2d").getImageData(0,0,this.host.width,this.host.height),asset:this.canvas.asset.getContext("2d").getImageData(0,0,this.asset.width,this.asset.height),new:this.canvas.new.getContext("2d").getImageData(0,0,this.host.width,this.host.height),extracted:this.canvas.extracted.getContext("2d").getImageData(0,0,this.asset.width,this.asset.height)},files:{host:this.host,asset:this.asset}})},getHidability:function(t){var e=this.asset.width*this.asset.height*4*8;return(this.host.width*this.host.height*4*t/e*100).toFixed(2)}},computed:g()({},Object(_.b)({host:function(t){return t.files.host},asset:function(t){return t.files.asset}}),{bits:function(){var t=8/this.lsbCount,e=this.host.width*this.host.height*4,s=Math.floor(e/t),i=this.asset.width*this.asset.height*4;return Math.min(s,i)}})},w={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("div",{directives:[{name:"show",rawName:"v-show",value:t.finished.encoding&&t.finished.decoding,expression:"finished.encoding && finished.decoding"}]},[s("Details"),t._v(" "),s("hr"),t._v(" "),t._m(0),t._v(" "),t._m(1),t._v(" "),s("hr"),t._v(" "),s("div",{staticClass:"part"},[s("div",{staticClass:"text"},[s("div",[s("table",{staticClass:"table table-striped table-hover"},[t._m(2),t._v(" "),s("tbody",t._l(8,function(e){return s("tr",{key:e,on:{click:function(s){t.setLSB(e)}}},[s("td",[t._v(t._s(e))]),t._v(" "),s("td",[t._v(t._s(t.getHidability(e))+"%")])])}))]),t._v(" "),t._m(3),t._v(" "),s("p",[t._v("\n            "+t._s(t.bits.toLocaleString())+" bits written into the\n            original image using "+t._s(t.lsbCount)+" least significant bit(s)\n          ")])])])])],1),t._v(" "),t.finished.encoding&&t.finished.decoding?t._e():s("div",{staticClass:"progress"},[s("h3",[t._v("encoding")]),t._v(" "),s("h6",[t._v("hiding asset inside the host...")]),t._v(" "),s("div",{staticClass:"bar bar-sm"},[s("div",{staticClass:"bar-item",style:{width:t.progress.encoding+"%"},attrs:{role:"progressbar","aria-valuemin":"0","aria-valuemax":"100"}})])]),t._v(" "),t.finished.encoding&&!t.finished.decoding?s("div",{staticClass:"progress"},[s("h3",[t._v("decoding")]),t._v(" "),s("h6",[t._v("extracting asset from the host...")]),t._v(" "),s("div",{staticClass:"bar bar-sm"},[s("div",{staticClass:"bar-item",style:{width:t.progress.decoding+"%"},attrs:{role:"progressbar","aria-valuemin":"0","aria-valuemax":"100"}})])]):t._e()])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"part"},[e("div",{staticClass:"text"},[e("h3",[this._v("encoded image")]),this._v(" "),e("h6",[this._v("this image has the hidden image inside of it")])]),this._v(" "),e("div",{staticClass:"canvas",attrs:{id:"new"}})])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"part"},[e("div",{staticClass:"text"},[e("h3",[this._v("decoded image")]),this._v(" "),e("h6",[this._v("this image has been extracted from the image above")])]),this._v(" "),e("div",{staticClass:"canvas",attrs:{id:"extracted"}})])},function(){var t=this.$createElement,e=this._self._c||t;return e("thead",[e("tr",[e("th",[this._v("Number of LSBs")]),this._v(" "),e("th",[this._v("% of Asset in Host")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[e("br"),this._v("\n            table to show how the number of least significant bits used affects"),e("br"),this._v("\n            how much of the given asset image can be hidden inside the host image.\n            "),e("br")])}]};var x=s("VU/8")(p,w,!1,function(t){s("bb8X"),s("9eNI")},"data-v-89c8d950",null).exports;n.a.use(r.a);var C=new r.a({routes:[{path:"/",name:"upload",component:v},{path:"/core",name:"core",component:x}]});n.a.use(_.a);var y=new _.a.Store({state:{files:{host:null,asset:null}},mutations:{setFile:function(t,e){var s=e.target,i=e.file;t.files[s]=i}}});n.a.config.productionTip=!1,n.a.component("vue-dropzone",a.a),new n.a({el:"#app",router:C,store:y,components:{App:h},template:"<App/>"})},bb8X:function(t,e){},coFE:function(t,e){},g2WZ:function(t,e,s){t.exports=function(){return new Worker(s.p+"32148c4946f1a4a72873.worker.js")}},qlXD:function(t,e){},z1oT:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.23bad62b2ff84e19ba7e.js.map