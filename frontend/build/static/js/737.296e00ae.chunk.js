"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[737],{6737:function(e,n,r){r.r(n),r.d(n,{default:function(){return l}});var a=r(4942),s=r(1413),t=r(4165),i=r(5861),o=r(9439),c=r(2791),u=r(184),l=function(){var e=c.useState({email:"",password:""}),n=(0,o.Z)(e,2),r=n[0],l=n[1],d=function(){var e=c.useState(null),n=(0,o.Z)(e,2),r=n[0],a=n[1],s=c.useState(null),u=(0,o.Z)(s,2),l=u[0],d=u[1],p=c.useState(null),f=(0,o.Z)(p,2),h=f[0],m=f[1],x=function(){var e=(0,i.Z)((0,t.Z)().mark((function e(n){var r,s;return(0,t.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return d(!0),a(null),e.next=4,fetch("".concat("http://localhost:6060","/api/users/signup"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});case 4:return r=e.sent,e.next=7,r.json();case 7:s=e.sent,r.ok||(d(!1),a(s.error),m(!1)),r.ok&&(d(!1),a(null),m(!0));case 10:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}();return{signup:x,isLoading:l,error:r,verificationNeeded:h}}(),p=d.signup,f=d.isLoading,h=d.error,m=d.verificationNeeded,x=function(){var e=(0,i.Z)((0,t.Z)().mark((function e(n){return(0,t.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n.preventDefault(),e.next=3,p(r);case 3:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),v=function(e){var n=e.target,r=n.name,t=n.value;l((function(e){return(0,s.Z)((0,s.Z)({},e),{},(0,a.Z)({},r,t))}))};return(0,u.jsxs)("div",{className:"form--container--signup",children:[(0,u.jsx)("h1",{children:(0,u.jsx)("p",{})}),(0,u.jsxs)("form",{"aria-label":"create an account",className:"signup",onSubmit:x,children:[(0,u.jsx)("h4",{children:"Create an account"}),(0,u.jsx)("label",{children:"email address:"}),(0,u.jsx)("input",{type:"text",id:"email",name:"email",placeholder:"email address","aria-label":"email address",value:r.email,onChange:v}),(0,u.jsx)("label",{children:"password:"}),(0,u.jsx)("input",{type:"password",id:"password",name:"password",placeholder:"password","aria-label":"password",value:r.password,onChange:v}),(0,u.jsx)("button",{className:"sign-up--form--btn",disabled:f,children:"Sign up"}),h&&(0,u.jsx)("div",{role:"alert",className:"error",children:h}),!h&&m&&(0,u.jsx)("div",{role:"alert",className:"success",children:"Account created and pending confirmation. Please check your inbox."})]})]})}}}]);
//# sourceMappingURL=737.296e00ae.chunk.js.map