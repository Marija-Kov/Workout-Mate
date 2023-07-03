"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[994],{1994:function(e,t,r){r.r(t),r.d(t,{default:function(){return S}});var n=r(4165),a=r(5861),o=r(9439),s=r(2791),l=r(7200),u=r(4961),i=r(6849);var c=r(184),d=s.lazy((function(){return r.e(273).then(r.bind(r,6273))}));function p(e){var t=e.id,r=e.title,p=e.muscle_group,h=e.reps,f=e.load,m=e.createdAt,g=e.updatedAt,b=e.page,x=e.getItems,v=e.total,k=e.limit,j=e.spreadPages,w=s.useState(!1),Z=(0,o.Z)(w,2),y=Z[0],N=Z[1],S=function(){var e=s.useState(null),t=(0,o.Z)(e,2),r=t[0],l=t[1],c=(0,u.m)().dispatch,d=(0,i.E)().user,p=function(){var e=(0,a.Z)((0,n.Z)().mark((function e(t){var r,a;return(0,n.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(d){e.next=3;break}return l("You must be logged in to do that"),e.abrupt("return");case 3:return e.next=5,fetch("".concat("http://localhost:6060","/api/workouts/").concat(t),{method:"DELETE",headers:{Authorization:"Bearer ".concat(d.token)}});case 5:return r=e.sent,e.next=8,r.json();case 8:a=e.sent,r.ok&&(c({type:"DELETE_ONE",payload:a.workout}),l(null)),r.ok||l(a.error);case 11:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return{deleteWorkout:p,error:r}}(),C=S.deleteWorkout,F=S.error,E=function(){var e=(0,a.Z)((0,n.Z)().mark((function e(){return(0,n.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,C(t);case 2:return e.next=4,x("",b);case 4:j(v,k);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),_=function(){N((function(e){return!e}))},A=(0,l.Z)(new Date(m),{addSuffix:!0});return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsxs)("div",{"aria-label":"details of workout ".concat(r," created ").concat(A),className:"workout-details",children:[(0,c.jsx)("h4",{children:r}),(0,c.jsxs)("p",{children:[(0,c.jsx)("strong",{children:"reps:"})," ",h]}),(0,c.jsxs)("p",{children:[(0,c.jsx)("strong",{children:"load:"})," ",f]}),(0,c.jsx)("p",{"aria-label":"date",className:"date",children:A}),(0,c.jsx)("button",{"aria-label":"delete workout ".concat(r," created ").concat(A),className:"material-symbols-outlined",onClick:E,children:"delete"}),(0,c.jsx)("button",{"aria-label":"open ".concat(r," edit form created ").concat(A),className:"material-symbols-outlined edit",onClick:_,children:"edit"}),F&&(0,c.jsx)("div",{role:"alert",className:"error",children:F})]}),y&&(0,c.jsx)(s.Suspense,{children:(0,c.jsx)(d,{id:t,title:r,muscle_group:p,reps:h,load:f,createdAt:m,updatedAt:g,showEdit:function(){return _()}},t+"edit")})]})}var h=r(3433),f=function(){var e=(0,u.m)().dispatch,t=(0,i.E)().user,r=s.useState(null),l=(0,o.Z)(r,2),c=l[0],d=l[1],p=function(){var r=(0,a.Z)((0,n.Z)().mark((function r(a){var o,s;return(0,n.Z)().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:if(t){r.next=3;break}return d("You must be logged in"),r.abrupt("return");case 3:return r.next=5,fetch("".concat("http://localhost:6060","/api/workouts"),{method:"POST",body:JSON.stringify(a),headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(t.token)}});case 5:return o=r.sent,r.next=8,o.json();case 8:if(s=r.sent,o.ok){r.next=12;break}return d("Please fill out the empty fields"),r.abrupt("return");case 12:o.ok&&(d(null),e({type:"CREATE_WORKOUT",payload:s}));case 13:case"end":return r.stop()}}),r)})));return function(e){return r.apply(this,arguments)}}();return{createWorkout:p,error:c}};function m(e){var t=e.hideForm,r=e.spreadPages,l=e.flipPage,u=e.total,i=e.limit,d=e.getItems,p=f(),m=p.createWorkout,g=p.error,b=s.useRef(),x=s.useRef(),v=s.useRef(),k=s.useRef(),j=s.useState([]),w=(0,o.Z)(j,2),Z=w[0],y=w[1],N=function(){var e=(0,a.Z)((0,n.Z)().mark((function e(a){var o;return(0,n.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a.preventDefault(),o={title:b.current.value,muscle_group:x.current.value,load:v.current.value,reps:k.current.value},e.next=4,m(o);case 4:if(o.title||y((function(e){return["title"].concat((0,h.Z)(e))})),o.muscle_group||y((function(e){return["muscle group"].concat((0,h.Z)(e))})),o.reps||y((function(e){return["reps"].concat((0,h.Z)(e))})),o.load||y((function(e){return["load"].concat((0,h.Z)(e))})),!(o.title&&o.muscle_group&&o.reps&&o.load)){e.next=15;break}return t(),e.next=12,d("",0);case 12:r(u,i),l(1),y([]);case 15:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return(0,c.jsx)("div",{className:"form--container--workout--form",children:(0,c.jsxs)("form",{className:"workout--form","aria-label":"workout form",onSubmit:N,children:[(0,c.jsx)("button",{"aria-label":"close form",className:"close material-symbols-outlined",onClick:t,children:"close"}),(0,c.jsx)("h4",{children:"New workout"}),(0,c.jsx)("label",{children:"exercise title:"}),(0,c.jsx)("input",{type:"text",name:"title",id:"title",placeholder:"ex: bench press","aria-label":"workout title",ref:b,className:Z.includes("title")?"error":""}),(0,c.jsx)("label",{htmlFor:"muscle_group",children:"muscle group:"}),(0,c.jsxs)("select",{ref:x,"aria-label":"workout title",name:"muscle_group",id:"muscle_group",className:Z.includes("muscle group")?"error":"",children:[(0,c.jsx)("option",{value:"",children:"-please select-"}),(0,c.jsx)("option",{value:"chest",children:"chest"}),(0,c.jsx)("option",{value:"shoulder",children:"shoulder"}),(0,c.jsx)("option",{value:"biceps",children:"biceps"}),(0,c.jsx)("option",{value:"triceps",children:"triceps"}),(0,c.jsx)("option",{value:"leg",children:"leg"}),(0,c.jsx)("option",{value:"back",children:"back"}),(0,c.jsx)("option",{value:"glute",children:"glute"}),(0,c.jsx)("option",{value:"ab",children:"ab"}),(0,c.jsx)("option",{value:"calf",children:"calf"}),(0,c.jsx)("option",{value:"forearm and grip",children:"forearm and grip"})]}),(0,c.jsx)("label",{children:"number of reps:"}),(0,c.jsx)("input",{type:"number",name:"reps",id:"reps","aria-label":"number of reps",ref:k,className:Z.includes("reps")?"error":""}),(0,c.jsx)("label",{children:"load (kg):"}),(0,c.jsx)("input",{type:"number",name:"load",id:"load","aria-label":"load in kg",ref:v,className:Z.includes("load")?"error":""}),(0,c.jsx)("button",{className:"workout--form--btn","aria-label":"submit workout button",children:"Add workout"}),g&&(0,c.jsx)("div",{role:"alert",className:"error",children:g})]})})}var g=r(6666),b=r.n(g);function x(e){var t=e.page,r=e.limit,n=e.flipPage,a=e.total,o=e.pageSpread;function s(e,t){if(e+1===t)return t-3>1&&o.length-t>1?"num--page current dots-left dots-right":o.length-t>1&&t>2?"num--page current dots-right":t-3>1?"num--page current dots-left":"num--page current";if(e+1!==t){if(t>3&&t!==o.length)return"invisible";if(t===o.length&&t<o.length-1)return"num--page dots-left";if(3===t&&o.length>4&&e+1<3)return"num--page dots-right";if(t<=3||t===o.length)return"num--page"}}return(0,c.jsxs)("div",{"aria-label":"pages",className:"page--btn--container",children:[(0,c.jsx)("button",{"aria-label":"previous page",type:"button",className:"prev--page",disabled:t<=0,onClick:function(){return n(-1)},children:(0,c.jsx)("span",{className:"material-symbols-outlined",children:"chevron_left"})}),o.map((function(e){return(0,c.jsx)("button",{"aria-label":"go to page ".concat(e),className:s(t,e),onClick:function(){return n(e)},children:e},b()())})),(0,c.jsx)("button",{"aria-label":"next page",type:"button",className:"next--page",disabled:(t+1)*r>=a,onClick:function(){return n([1])},children:(0,c.jsx)("span",{className:"material-symbols-outlined",children:"chevron_right"})})]})}var v=function(){var e=s.useState(null),t=(0,o.Z)(e,2),r=t[0],l=t[1],c=(0,i.E)().user,d=(0,u.m)().dispatch,p=s.useState(null),h=(0,o.Z)(p,2),f=h[0],m=h[1],g=s.useState(null),b=(0,o.Z)(g,2),x=b[0],v=b[1],k=s.useState(null),j=(0,o.Z)(k,2),w=j[0],Z=j[1],y=s.useState([]),N=(0,o.Z)(y,2),S=N[0],C=N[1],F=function(){var e=(0,a.Z)((0,n.Z)().mark((function e(t,r){var a,o;return(0,n.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(l(!0),c){e.next=5;break}return l(!1),Z("Not authorized"),e.abrupt("return");case 5:return e.next=7,fetch("".concat("http://localhost:6060","/api/workouts/?search=").concat(t,"&p=").concat(r),{headers:{Authorization:"Bearer ".concat(c.token)}});case 7:return a=e.sent,e.next=10,a.json();case 10:o=e.sent,a.ok&&(Z(null),l(!1),m(o.limit),v(o.total),C(o.allUserWorkoutsMuscleGroups),d({type:"SET_WORKOUTS",payload:o.workoutsChunk})),a.ok||(l(!1),Z(o.error));case 13:case"end":return e.stop()}}),e)})));return function(t,r){return e.apply(this,arguments)}}();return{search:F,isLoading:r,limit:f,total:x,allWorkoutsMuscleGroups:S,error:w}};function k(e){var t=e.handleSearch,r=e.query,n=e.isLoading,a=e.handleSearchChange;return(0,c.jsxs)("form",{"aria-label":"search bar",className:"search--bar",onSubmit:t,children:[(0,c.jsx)("input",{"aria-label":"search input",type:"search",placeholder:"search workouts...",value:r,onChange:a}),(0,c.jsx)("button",{"aria-label":"search button",disabled:n,children:(0,c.jsx)("span",{className:"material-symbols-outlined",children:"search"})})]})}var j=r(7769),w=r(152),Z=r(3077),y=function(e){var t=e.labels,r=e.colors,n=e.percentage;return(0,c.jsx)("ul",{className:"custom--legend","aria-label":"chart legend",children:t.map((function(e,t){return(0,c.jsxs)("li",{className:n[t]>0?"muscle--group":"muscle--group zero--percent","aria-label":"".concat(n[t],"% ").concat(e," workouts"),children:[(0,c.jsx)("span",{style:{backgroundColor:r[t]}}),e]},e+t)}))})};w.kL.register(w.qi,w.u);var N=function(e){var t=e.muscleGroups,r=(0,s.useState)(null),n=(0,o.Z)(r,2),a=n[0],l=n[1],u=(0,s.useState)(null),i=(0,o.Z)(u,2),d=i[0],p=i[1],h=(0,s.useState)(null),f=(0,o.Z)(h,2),m=f[0],g=f[1],b=(0,s.useState)(null),x=(0,o.Z)(b,2),v=x[0],k=x[1],j=(0,s.useState)(null),N=(0,o.Z)(j,2),S=N[0],C=N[1],F=(0,s.useState)(null),E=(0,o.Z)(F,2),_=E[0],A=E[1],P=(0,s.useState)(null),W=(0,o.Z)(P,2),T=W[0],z=W[1],L=(0,s.useState)(null),R=(0,o.Z)(L,2),B=R[0],G=R[1],O=(0,s.useState)(null),I=(0,o.Z)(O,2),D=I[0],M=I[1],U=(0,s.useState)(null),q=(0,o.Z)(U,2),K=q[0],Y=q[1];(0,s.useEffect)((function(){return H(t)}),[t]);var H=function(e){var t=e,r=t.length,n=100*t.filter((function(e){return"chest"===e})).length/r;l(n.toFixed(1));var a=100*t.filter((function(e){return"shoulder"===e})).length/r;p(a.toFixed(1));var o=100*t.filter((function(e){return"biceps"===e})).length/r;g(o.toFixed(1));var s=100*t.filter((function(e){return"triceps"===e})).length/r;k(s.toFixed(1));var u=100*t.filter((function(e){return"leg"===e})).length/r;C(u.toFixed(1));var i=100*t.filter((function(e){return"back"===e})).length/r;A(i.toFixed(1));var c=100*t.filter((function(e){return"glute"===e})).length/r;z(c.toFixed(1));var d=100*t.filter((function(e){return"ab"===e})).length/r;G(d.toFixed(1));var h=100*t.filter((function(e){return"calf"===e})).length/r;M(h.toFixed(1));var f=100*t.filter((function(e){return"forearm and grip"===e})).length/r;Y(f.toFixed(1))},J={labels:["Chest","Shoulder","Biceps","Triceps","Leg","Back","Glute","Ab","Calf","Forearm and Grip"],datasets:[{data:[a,d,m,v,S,_,T,B,D,K],backgroundColor:["rgb(219, 162, 215, 0.7)","rgb(212, 122, 147, 0.7)","rgb(162, 122, 212, 0.7)","rgb(122, 131, 212, 0.7)","rgb(99, 148, 255, 0.7)","rgb(99, 224, 255, 0.7)","rgb(99, 255, 239, 0.7)","rgb(99, 255, 140, 0.7)","rgb(255, 206, 99, 0.7)","rgb(255, 127, 99, 0.7)"],borderWidth:1,borderColor:"rgb(255, 255, 255, 0.001)"}]};w.u.positioners.myCustomPositioner=function(){return window.innerWidth<=450?{x:80,y:100}:{x:100,y:150}};return(0,c.jsxs)("div",{className:"chart--container",children:[(0,c.jsx)("h3",{children:"Routine balance (%)"}),(0,c.jsxs)("div",{className:"chart","aria-label":"routine balance chart",children:[(0,c.jsx)(Z.$I,{data:J,options:{onHover:function(e,t){e.native.target.style.cursor=t.length?"pointer":"default"},plugins:{legend:!1,tooltip:{position:"myCustomPositioner",displayColors:!1,backgroundColor:"rgb(255, 255, 255, 0.7)",titleColor:"rgb(112, 98, 109)",bodyColor:"rgb(48, 48, 48)",titleFont:{family:"Poppins",weight:600,size:14},bodyFont:{family:"Poppins",weight:600,size:14}}}}}),(0,c.jsx)(y,{labels:J.labels,colors:J.datasets[0].backgroundColor,percentage:J.datasets[0].data})]})]})};function S(){var e=s.useState(!1),t=(0,o.Z)(e,2),r=t[0],l=t[1],i=(0,u.m)().workouts,d=v(),h=d.search,f=d.total,g=d.limit,b=d.allWorkoutsMuscleGroups,w=d.isLoading,Z=d.error,y=s.useState(0),S=(0,o.Z)(y,2),C=S[0],F=S[1],E=s.useState([]),_=(0,o.Z)(E,2),A=_[0],P=_[1],W=s.useState(""),T=(0,o.Z)(W,2),z=T[0],L=T[1];s.useEffect((function(){R(z,C)}),[z,C]),s.useEffect((function(){B(f,g)}),[f,g]);var R=function(){var e=(0,a.Z)((0,n.Z)().mark((function e(t,r){return(0,n.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,h(t,r);case 2:case"end":return e.stop()}}),e)})));return function(t,r){return e.apply(this,arguments)}}(),B=function(e,t){for(var r=Math.ceil(e/t),n=[],a=1;a<=r;++a)n.push(a);P(n)},G=function(e){F((function(t){return-1===e?t+e:e[0]?t+e[0]:e-1}))},O=function(){var e=(0,a.Z)((0,n.Z)().mark((function e(t){return(0,n.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),e.next=3,R(z,C);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),I=s.useMemo((function(){return b}),[b.length]);return(0,c.jsx)("div",{className:"home--container",onClick:j.s,children:(0,c.jsxs)("div",{className:"home",children:[(0,c.jsx)(k,{handleSearchChange:function(e){L(e.target.value),F(0)},handleSearch:O,query:z,isLoading:w}),Z&&(0,c.jsx)("div",{role:"alert",className:"error",children:Z}),(0,c.jsxs)("div",{"aria-label":"workouts",className:"workouts--container",children:[w&&(0,c.jsx)("h4",{className:"loading--workouts",children:" Fetching data..."}),i&&i.map((function(e){return(0,c.jsx)(p,{id:e._id,title:e.title,muscle_group:e.muscle_group,reps:e.reps,load:e.load,createdAt:e.createdAt,updatedAt:e.updatedAt,page:C,getItems:R,spreadPages:B,total:f,limit:g},e._id)})),i&&!i.length&&!w&&(0,c.jsxs)("h4",{className:"get--started",children:[!z&&(0,c.jsxs)(c.Fragment,{children:["Buff it up to get started.",(0,c.jsx)("br",{}),"No pressure ",(0,c.jsx)("span",{children:"\ud83e\udd64"})]}),z&&(0,c.jsxs)(c.Fragment,{children:['No "',z,'" workouts found.']})]})]}),i&&(0,c.jsx)(N,{muscleGroups:I}),!r&&(0,c.jsx)("button",{"aria-label":"buff it up",className:i&&i.length||z||w?"add--workout":"add--workout no--workouts--yet",onClick:function(){return l(!0)},children:"+ Buff It Up"}),i&&i.length>0&&(0,c.jsx)(x,{page:C,pageSpread:A,total:f,limit:g,flipPage:G}),r&&(0,c.jsx)(m,{hideForm:function(){l(!1)},getItems:R,spreadPages:B,flipPage:G,total:f,limit:g}),(0,c.jsx)("div",{className:"space"})]})})}}}]);
//# sourceMappingURL=994.cfcaf6fc.chunk.js.map