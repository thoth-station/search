(this["webpackJsonpthoth-search"]=this["webpackJsonpthoth-search"]||[]).push([[0],{102:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(10),o=n.n(c),i=n(89),s=n(2);o.a.render(Object(s.jsx)(r.a.StrictMode,{children:Object(s.jsx)(i.a,{})}),document.getElementById("root"))},89:function(e,t,n){"use strict";(function(e){var a=n(90),r=n(51),c=n(99),o=n(153),i=n(154),s=n(2);e.packagesReleases={},t.a=function(){return Object(s.jsxs)(o.a,{theme:a.a,children:[Object(s.jsx)(i.a,{}),Object(s.jsx)(r.a,{children:Object(s.jsx)(c.a,{})})]})}}).call(this,n(56))},90:function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));var a=n(72),r=Object(a.a)({palette:{background:{default:"#f9f9f9"}}})},99:function(e,t,n){"use strict";n.d(t,"a",(function(){return De}));var a=n(12),r="/thoth-search/",c=r+"dashboard",o=n(40),i=n(2),s=function(e){var t=e.text;return Object(i.jsxs)(o.a,{variant:"h2",children:["404: ",null!==t&&void 0!==t?t:"page"," not found!"]})},l=n(28),d=n(0),u=n(193),j=n(190),b=n(204),h=Object(j.a)((function(e){return{root:{display:"flex",flexDirection:"column",alignItems:"stretch",flexGrow:1}}})),f=function(e){var t=e.onChange,n=e.label,a=e.helperText,r=e.error,c=void 0!==r&&r,o=h();return Object(i.jsx)("div",{className:o.root,children:Object(i.jsx)(b.a,{type:"search",variant:"outlined",label:n,className:o.bar,onChange:function(e){return t(e.target.value)},helperText:a,error:c})})},p=n(69),m=n.n(p),g="https://api.moc.thoth-station.ninja/api/v1",v=function(e,t){return m.a.get("https://pypi.org/pypi/"+e+(t?"/"+t:"")+"/json")},O=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"https://pypi.org/simple";return m.a.get(g+"/python/package/dependencies",{params:{name:e,version:t,index:n},timeout:3e3,headers:{accept:"application/json"}})},x=Object(j.a)((function(e){return{root:{display:"flex",flexFlow:"column nowrap",alignItems:"center",marginTop:"20%"},search:{display:"flex",justifyContent:"center",alignItems:"stretch",minWidth:"50%"},description:{marginBottom:e.spacing(6)},title:{marginBottom:e.spacing(1)},button:{marginLeft:e.spacing(2)}}})),y=function(){var e=Object(a.f)(),t=x(),n=Object(d.useState)(""),r=Object(l.a)(n,2),s=r[0],j=r[1],b=Object(d.useState)(""),h=Object(l.a)(b,2),p=h[0],m=h[1];return Object(i.jsxs)("div",{className:t.root,children:[Object(i.jsx)(o.a,{variant:"h4",className:t.title,children:Object(i.jsx)("b",{children:"Thoth Search"})}),Object(i.jsx)(o.a,{variant:"body1",className:t.description,children:"Use this search box to lookup specific Python packages."}),Object(i.jsxs)("div",{className:t.search,children:[Object(i.jsx)(f,{label:"Search for a Python package",onChange:function(e){return function(e){j(e),""!==p&&m("")}(e)},helperText:p,error:""!==p}),Object(i.jsx)(u.a,{variant:"contained",color:"primary",onClick:function(){""!==s&&v(s).then((function(t){e.push(c+"/"+s)})).catch((function(){m("No results")}))},className:t.button,children:Object(i.jsx)("b",{children:"Search"})})]})]})},w=n(43),k=n(15),N=n(194),C=n(196),E=n(195),B=Object(j.a)({root:{minWidth:275},bullet:{display:"inline-block",margin:"0 2px",transform:"scale(0.8)"},title:{fontSize:14},pos:{marginBottom:12}}),S=function(e){var t=e.cardMeta,n=e.cardBody,a=B();return Object(i.jsxs)(N.a,{className:a.root,children:[Object(i.jsx)(E.a,{action:t.action,title:t.title,subheader:t.subTitle}),Object(i.jsx)(C.a,{children:n})]})},T=n(197),R=function(e){var t=e.text;return Object(i.jsx)(o.a,{align:"center",color:"error",variant:"body1",children:t})},L=function(e){var t=e.children,n=e.state,a=e.errorText,r=e.show404,c=e.loadingPage;return Object(i.jsx)(i.Fragment,{children:"error"===n?r?Object(i.jsx)(s,{text:r}):Object(i.jsx)(R,{text:null!==a&&void 0!==a?a:"A unknown error occured"}):void 0===n?null!==c&&void 0!==c?c:Object(i.jsx)(T.a,{style:{marginLeft:"50%"}}):t})},M=n(37),I=n(5),W=n(198),D=n(209),_=["value","total","label"],q=Object(I.a)((function(e){return{root:{height:10,borderRadius:5},colorPrimary:{backgroundColor:e.palette.grey["light"===e.palette.type?200:700]},bar:{borderRadius:5,backgroundColor:"#1a90ff"}}}))(W.a),z=Object(j.a)((function(e){return{root:{display:"grid",gridTemplateColumns:"repeat(6,1fr)",alignItems:"center",gridGap:e.spacing(1)},label:{gridColumnStart:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},value:{gridColumnStart:2,textAlign:"end"},bar:{gridColumnStart:3,gridColumnEnd:"span 4"}}})),F=function(e){var t=e.value,n=e.total,a=e.label,r=Object(M.a)(e,_),c=z();return Object(i.jsxs)("div",{className:"".concat(c.root," ").concat(r.className),children:[Object(i.jsx)(D.a,{title:a,placement:"left",children:Object(i.jsx)(o.a,{variant:"body2",className:c.label,children:a})}),Object(i.jsx)(o.a,{className:c.value,variant:"body2",children:t}),Object(i.jsx)(q,{variant:"determinate",value:n>0?t/n*100:0,className:c.bar})]})},P=Object(j.a)((function(e){return{bar:{marginBottom:e.spacing(1)}}})),A=function(e){var t,n,a,r,c=e.metric,o=e.deepError,s=P(),l=(null!==(t=c.direct)&&void 0!==t?t:0)+(null!==(n=c.indirect)&&void 0!==n?n:0);return Object(i.jsxs)("div",{className:s.root,children:[Object(i.jsx)(L,{state:c.direct,children:Object(i.jsx)(F,{value:null!==(a=c.direct)&&void 0!==a?a:0,total:l,label:"Direct",className:s.bar})}),Object(i.jsx)(L,{state:o?"error":c.indirect,errorText:"Could not run analysis on dependencies.",children:Object(i.jsx)(F,{value:null!==(r=c.indirect)&&void 0!==r?r:0,total:l,label:"Indirect"})})]})},G=n(199),J=Object(j.a)((function(e){return{bar:{marginBottom:e.spacing(1)},marginBottom:{marginBottom:e.spacing(2)}}})),U=function(e){var t,n,a=e.metric,r=e.deepError,c=J(),s=Object.keys(null!==(t=null===a||void 0===a?void 0:a.all)&&void 0!==t?t:{}).reduce((function(e,t){return e+parseFloat(a.all[t]||0)}),0);return Object(i.jsxs)("div",{className:c.root,children:[Object(i.jsx)(o.a,{variant:"body2",gutterBottom:!0,className:c.label,children:Object(i.jsx)("b",{children:"License"})}),Object(i.jsx)(G.a,{}),Object(i.jsx)(o.a,{className:c.marginBottom,variant:"h6",children:a.root}),Object(i.jsx)(o.a,{variant:"body2",gutterBottom:!0,className:c.label,children:Object(i.jsx)("b",{children:"Dependency Licenses"})}),Object(i.jsx)(G.a,{}),Object(i.jsx)(L,{state:r?"error":a.all,errorText:"Could not run analysis on dependencies.",children:Object.entries(null!==(n=null===a||void 0===a?void 0:a.all)&&void 0!==n?n:{}).map((function(e){var t=Object(l.a)(e,2),n=t[0],a=t[1];return Object(i.jsx)(F,{value:null!==a&&void 0!==a?a:0,total:s,label:n,className:c.bar},n)}))})]})},H=n(200),V=function(e){var t=e.state;return Object(i.jsx)(H.a,{container:!0,spacing:3,children:Object.entries(t.metrics).map((function(e){var n=Object(l.a)(e,2),a=n[0],r=n[1];return Object(i.jsx)(H.a,{item:!0,xs:12,sm:6,children:Object(i.jsx)(S,{cardMeta:{title:a.charAt(0).toUpperCase()+a.slice(1)},cardBody:"dependencies"===a?Object(i.jsx)(A,{metric:r,deepError:t.error.graph}):"licenses"===a?Object(i.jsx)(U,{metric:r,deepError:t.error.graph}):null})},a)}))})},Y=n(96),K=n.n(Y),Q=n(97),X=n.n(Q),Z=["text","icon","link"],$=Object(j.a)((function(e){return{root:{display:"flex"}}})),ee=function(e){var t=e.text,n=e.icon,a=e.link,r=Object(M.a)(e,Z),c=$();return Object(i.jsxs)("div",{className:"".concat(c.root," ").concat(r.className),children:[n,Object(i.jsx)(o.a,{href:a||null,variant:"body2",align:"center",children:t})]})};function te(e){var t=Math.floor((new Date-e)/1e3),n=t/31536e3;if(n>1){var a=Math.floor(n);return a+" year"+(1!==a?"s":"")}if((n=t/2592e3)>1){var r=Math.floor(n);return r+" month"+(1!==r?"s":"")}if((n=t/86400)>1){var c=Math.floor(n);return c+" day"+(1!==c?"s":"")}if((n=t/3600)>1){var o=Math.floor(n);return o+" hour"+(1!==o?"s":"")}if((n=t/60)>1){var i=Math.floor(n);return i+" minute"+(1!==i?"s":"")}var s=Math.floor(t);return s+" second"+(1!==s?"s":"")}var ne=Object(j.a)((function(e){return{titleRow:{display:"flex",alignItems:"center",marginBottom:e.spacing(1)},marginLeft:{marginLeft:e.spacing(2)},linksRow:{display:"flex",marginBottom:e.spacing(3)}}})),ae=function(e){var t,n,a,r,c=e.data,s=ne();return Object(i.jsxs)("div",{children:[Object(i.jsxs)("div",{className:s.titleRow,children:[Object(i.jsx)(o.a,{variant:"h4",children:Object(i.jsx)("b",{children:c.info.name})}),Object(i.jsxs)(o.a,{className:s.marginLeft,variant:"subtitle1",children:["v",null===(t=c.info)||void 0===t?void 0:t.version]})]}),Object(i.jsx)(o.a,{gutterBottom:!0,variant:"body1",children:null===(n=c.info)||void 0===n?void 0:n.summary}),Object(i.jsxs)("div",{className:s.linksRow,children:[Object(i.jsx)(ee,{text:null===(a=c.info)||void 0===a?void 0:a.license,icon:Object(i.jsx)(K.a,{})}),Object(i.jsx)(ee,{className:s.marginLeft,text:"Latest version published "+te(new Date(null===(r=c.releases[c.info.version][0])||void 0===r?void 0:r.upload_time))+" ago.",icon:Object(i.jsx)(X.a,{})})]})]})},re=n(205),ce=["children","value","index"],oe=function(e){var t=e.children,n=e.value,a=e.index,r=Object(M.a)(e,ce);return Object(i.jsx)("div",Object(k.a)(Object(k.a)({role:"tabpanel",hidden:n!==a,id:"simple-tabpanel-".concat(a),"aria-labelledby":"simple-tab-".concat(a)},r),{},{children:n===a&&Object(i.jsx)(re.a,{children:t})}))},ie=n(23);function se(e,t,n){var a=n.filter((function(t){return e.includes(t.from)})),r={nodes:[],edges:[]};return a.forEach((function(e){var a=le(e,{nodes:[],edges:[]},n,t);r={nodes:Object(ie.a)(new Set([].concat(Object(ie.a)(a.nodes),Object(ie.a)(r.nodes)))),edges:Object(ie.a)(new Set([].concat(Object(ie.a)(a.edges),Object(ie.a)(r.edges))))}})),r}function le(e,t,n,a){if(t.edges.includes(e.id))return t;if(t.nodes.push(e.from,e.to),t.edges.push(e.id),e.to===a)return t;var r={nodes:[],edges:[]};return n.filter((function(t){return t.from===e.to})).forEach((function(e){var c=le(e,t,n,a);r={nodes:Object(ie.a)(new Set([].concat(Object(ie.a)(c.nodes),Object(ie.a)(r.nodes)))),edges:Object(ie.a)(new Set([].concat(Object(ie.a)(c.edges),Object(ie.a)(r.edges))))}})),r}var de={manipulation:{enabled:!1,editNode:function(e,t){e.fixed=!e.fixed.x,t(e)}},interaction:{hover:!0,hoverConnectedEdges:!1,selectConnectedEdges:!1,selectable:!1},edges:{chosen:!1,smooth:!1,color:{color:"#5c6470"},arrowStrikethrough:!1,arrows:{from:{enabled:!0,type:"triangle"}}},nodes:{chosen:!1,color:{background:"#5c6470",border:"#fff",hover:{background:"#f39200",border:"#fff"}},shape:"dot",size:10,borderWidth:2,labelHighlightBold:!1,font:{color:"#393e46",strokeWidth:2,size:15}},physics:{hierarchicalRepulsion:{damping:.1,springLength:200},solver:"hierarchicalRepulsion",minVelocity:.15}},ue=n(55),je=["data","searchText","root"],be=Object(j.a)((function(e){return{root:{display:"flex",flexFlow:"column nowrap"},canvas:{flex:"1 1 auto",height:"75vh"}}})),he=function(e){var t=e.data,n=(e.searchText,e.root),a=Object(M.a)(e,je),r=Object(d.useRef)(null),c=be();Object(d.useEffect)((function(){var e=r.current&&new ue.b(r.current,t,de),a=t.nodes.get(n);a.color="#4fc1ea",a.font={color:"#4fc1ea",strokeWidth:3,size:20},t.nodes.updateOnly(a);var c=document.getElementById("mynetwork").getElementsByTagName("canvas")[0];function o(e){c.style.cursor=e}e.on("hoverNode",(function(){o("grab")})),e.on("blurNode",(function(){o("default")})),e.on("dragStart",(function(){o("grabbing")})),e.on("dragging",(function(){o("grabbing")})),e.on("dragEnd",(function(){o("grab")})),e.on("dragEnd",(function(t){0!==t.nodes.length&&e.editNode(t.nodes[0])})),e.on("dragStart",(function(t){0!==t.nodes.length&&void 0!==e.body.nodes[t.nodes[0]].options.x&&e.body.nodes[t.nodes[0]].options.x&&e.editNode(t.nodes[0])}))}),[r,t,n]);return Object(i.jsxs)("div",{className:"".concat(c.root," ").concat(a.className),children:[Object(i.jsx)(f,{label:"Filter packages",onChange:function(e){return function(e,t){if(t.nodes.updateOnly(t.nodes.get().map((function(e){return e.id!==n&&(e.color=de.nodes.color,e.font=de.nodes.font),e}))),t.edges.updateOnly(t.edges.get().map((function(e){return e.color=de.edges.color,e}))),""!==e){var a=t.nodes.get({filter:function(t){return t.label.includes(e)}}),r=se(a.map((function(e){return e.id})),n,t.edges.map((function(e){return e}))),c=t.edges.get().filter((function(e){return!r.edges.includes(e.id)})).map((function(e){return e.color={color:"#e3e5e8"},e})),o=t.nodes.get().filter((function(e){return!r.nodes.includes(e.id)})).map((function(e){return e.id!==n&&(e.color={background:"#e3e5e8"},e.font={color:"#e3e5e8",strokeWidth:2,size:15}),e}));a=a.map((function(e){return e.id!==n&&(e.color={background:"#f39200"}),e})),t.nodes.updateOnly(o.concat(a)),t.edges.updateOnly(c)}}(e,t)}}),Object(i.jsx)("div",{ref:r,id:"mynetwork",className:c.canvas})]})},fe=n(152),pe=Object(j.a)((function(e){return{graph:{padding:e.spacing(4)}}})),me=function(e){var t,n,a=e.state,r=pe();return Object(i.jsx)(L,{state:a.error.graph?"error":a.graph,errorText:"Could not load in dependency graph.",children:Object(i.jsx)(fe.a,{children:Object(i.jsx)(he,{data:{nodes:new ue.a(null===(t=a.graph)||void 0===t?void 0:t.nodes),edges:new ue.a(null===(n=a.graph)||void 0===n?void 0:n.edges)},className:r.graph,root:a.metadata.info.name+a.metadata.info.version})})})},ge=n(25),ve=n.n(ge),Oe=n(50),xe=n(98),ye=n.n(xe);function we(e,t){return ke.apply(this,arguments)}function ke(){return(ke=Object(Oe.a)(ve.a.mark((function e(t,n){var a,r,c,o,i=arguments;return ve.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=i.length>2&&void 0!==i[2]?i[2]:2,r=i.length>3&&void 0!==i[3]?i[3]:[],c=[],o=[],0===r.length&&c.push({id:t+n,label:t}),a-=1,e.next=8,O(t,n).then(function(){var e=Object(Oe.a)(ve.a.mark((function e(i){var s,l,d,u;return ve.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:s=i.data.dependencies.sort((function(e,t){return ye()(e.version,t.version)})),l=[],d=ve.a.mark((function e(i){var d,u,j,b,h;return ve.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(l.includes(s[i].name)){e.next=6;break}return l.push(s[i].name),e.next=4,v(s[i].name,s[i].version).then(function(){var e=Object(Oe.a)(ve.a.mark((function e(l){return ve.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(o.push({to:t+n,from:s[i].name+s[i].version}),r.includes(s[i].name)){e.next=8;break}if(r.push(s[i].name),c.push({id:s[i].name+s[i].version,label:s[i].name,metadata:l.data,depth:a}),null===l.data.info.requires_dist||0===l.data.info.requires_dist.length||0===a){e.next=8;break}return e.next=7,we(s[i].name,s[i].version,a,r).then((function(e){return{nodes:e.nodes,edges:e.edges}}));case 7:return e.abrupt("return",e.sent);case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 4:if(d=e.sent){for(u=0,j=d.nodes.length;u<j;u++)c.push(d.nodes[u]);for(b=0,h=d.edges.length;b<h;b++)o.push(d.edges[b])}case 6:case"end":return e.stop()}}),e)})),u=s.length-1;case 4:if(!(u>=0)){e.next=9;break}return e.delegateYield(d(u),"t0",6);case 6:u--,e.next=4;break;case 9:return e.abrupt("return",{nodes:c,edges:o});case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()).catch((function(e){return e.isAxiosError?new Error(e.message):{nodes:c,edges:o}}));case 8:return e.abrupt("return",e.sent);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Ne(){return(Ne=Object(Oe.a)(ve.a.mark((function e(t){var n,a,r=arguments;return ve.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.length>1&&void 0!==r[1]?r[1]:-1,a={},e.next=4,we(t.info.name,t.info.version,n).then((function(e){var n,r;a.graph=e,a.metrics={};var c={};return e.nodes.forEach((function(e){e.metadata&&(c[e.metadata.info.license]&&(c[e.metadata.info.license]+=1),c[e.metadata.info.license]=1)})),a.metrics={dependencies:{indirect:e.nodes.length-(null!==(n=null===(r=t.info.requires_dist)||void 0===r?void 0:r.length)&&void 0!==n?n:0)-1},licenses:{all:c}},a}));case 4:return e.abrupt("return",e.sent);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var Ce=n(206),Ee=n(201),Be=Object(j.a)((function(e){return{root:{flexGrow:1,maxWidth:"95%",marginLeft:"auto",marginRight:"auto",paddingRight:e.spacing(3),paddingLeft:e.spacing(3),marginTop:e.spacing(4)}}}));function Se(e,t){switch(t.type){case"metadata":return Object(k.a)(Object(k.a)({},e),{},{metadata:t.payload});case"graph":return Object(k.a)(Object(k.a)({},e),{},{graph:t.payload});case"metric":return Object(k.a)(Object(k.a)({},e),{},{metrics:Object(k.a)(Object(k.a)({},e.metrics),{},Object(w.a)({},t.metricName,t.payload))});case"metric-field":return Object(k.a)(Object(k.a)({},e),{},{metrics:Object(k.a)(Object(k.a)({},e.metrics),{},Object(w.a)({},t.metricName,Object(k.a)(Object(k.a)({},e.metrics[t.metricName]),{},Object(w.a)({},t.fieldName,t.payload))))});case"error":return Object(k.a)(Object(k.a)({},e),{},{error:Object(w.a)({},t.who,t.payload)});default:return e}}var Te=function(e){e.location;var t=Be(),n=Object(a.g)(),r=Object(d.useReducer)(Se,{metadata:void 0,graph:void 0,metrics:{},error:{graph:!1,metadata:!1}}),c=Object(l.a)(r,2),o=c[0],s=c[1],u=Object(d.useState)(0),j=Object(l.a)(u,2),b=j[0],h=j[1];Object(d.useEffect)((function(){v(null===n||void 0===n?void 0:n.package,null===n||void 0===n?void 0:n.version).then((function(e){s({type:"metadata",payload:e.data}),f(function(e){var t,n,a,r,c={metrics:{}};return c.metrics.dependencies={direct:null!==(t=null===(n=e.info.requires_dist)||void 0===n?void 0:n.length)&&void 0!==t?t:0},c.metrics={dependencies:{direct:null!==(a=null===(r=e.info.requires_dist)||void 0===r?void 0:r.length)&&void 0!==a?a:0},licenses:{root:e.info.license}},c}(e.data).metrics),function(e){return Ne.apply(this,arguments)}(e.data,3).then((function(e){s({type:"graph",payload:e.graph}),f(e.metrics)})).catch((function(e){s({type:"error",who:"graph",payload:!0})}))})).catch((function(e){s({type:"error",who:"metadata",payload:!0})}))}),[n]);var f=function(e){for(var t=0,n=Object.keys(e);t<n.length;t++)for(var a=n[t],r=0,c=Object.entries(e[a]);r<c.length;r++){var o=Object(l.a)(c[r],2),i=o[0],d=o[1];s({type:"metric-field",fieldName:i,metricName:a,payload:d})}};return Object(i.jsx)(L,{state:o.error.metadata?"error":o.metadata,show404:"Package",children:Object(i.jsxs)("div",{className:t.root,children:[Object(i.jsx)(ae,{data:o.metadata}),Object(i.jsxs)(Ce.a,{value:b,onChange:function(e,t){h(t)},indicatorColor:"primary",textColor:"primary",children:[Object(i.jsx)(Ee.a,{label:"Overview"}),Object(i.jsx)(Ee.a,{label:"Dependencies"})]}),Object(i.jsx)(oe,{value:b,index:0,children:Object(i.jsx)(V,{state:o})}),Object(i.jsx)(oe,{value:b,index:1,children:Object(i.jsx)(me,{state:o})})]})})},Re=n(192),Le=n(202),Me=n(203),Ie=Object(j.a)((function(e){return{root:{width:"100%",maxWidth:360,backgroundColor:e.palette.background.paper}}})),We=function(){var e=Ie();return Object(d.useEffect)((function(){}),[]),Object(i.jsx)("div",{className:e.root,children:Object(i.jsx)(Re.a,{component:"nav",children:Object(i.jsx)(Le.a,{button:!0,component:"a",children:Object(i.jsx)(Me.a,{primary:"Result"})})})})},De=function(){return Object(i.jsxs)(a.c,{children:[Object(i.jsx)(a.a,{exact:!0,path:r,component:y}),Object(i.jsx)(a.a,{exact:!0,path:c+"/:package/:version?",component:Te}),Object(i.jsx)(a.a,{exact:!0,path:"/thoth-search/search",component:We}),Object(i.jsx)(a.a,{path:"*",children:Object(i.jsx)(s,{})})]})}}},[[102,1,2]]]);
//# sourceMappingURL=main.085ec9c7.chunk.js.map