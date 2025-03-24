/*! For license information please see index.106d9f27.js.LICENSE.txt */
!function(){var e,i,t,l,r={6930:function(e,i,t){"use strict";t.r(i);var l=t("2676"),r=t("5271"),a=t("3228"),n=t("1130");i.default=()=>{let[e,i]=(0,r.useState)(0),[t,s]=(0,r.useState)(0),[o,c]=(0,r.useState)(null),[d,h]=(0,r.useState)(!1),u=(0,r.useCallback)(()=>{h(!1),o?c({level:e,speed:t,key:o.key+1,running:!0}):c({level:e,speed:t,key:1,running:!0})},[e,t,o]),m=(0,r.useCallback)(()=>{console.log("Game Over!"),h(!0)},[]),v=(0,r.useCallback)(()=>{console.log("Game Clear!"),h(!0)},[]),g=(0,r.useCallback)(e=>{i(Math.max(0,Math.min(24,e)))},[]),p=(0,r.useCallback)(e=>{s(Math.max(0,Math.min(6,e)))},[]);return(0,l.jsxs)("div",{children:[(0,l.jsx)("h3",{children:"\u30C9\u30AF\u30BF\u30FC\u307E\u308A\u304A\u3082\u3069\u304D"}),(0,l.jsxs)("div",{className:"game-container",children:[o&&(0,l.jsx)(a.default,{level:o.level,speed:o.speed,isRunning:o.running,onGameOver:m,onGameClear:v},o.key),(0,l.jsx)(n.default,{onStartGame:u,level:e,speed:t,onLevelChange:g,onSpeedChange:p,isRunning:!!o,gameEnded:d})]})]})}},3228:function(e,i,t){"use strict";t.r(i);var l=t("2676"),r=t("5271"),a=t("4612");i.default=e=>{let{level:i,speed:t,isRunning:n,onGameOver:s,onGameClear:o}=e,c=(0,r.useRef)(null),[d,h]=(0,r.useState)(null);return(0,r.useEffect)(()=>{if(n&&c.current){let e=new a.Field(c.current,i,t,s,o);return h(e),()=>{e.cleanup()}}!n&&d&&(d.cleanup(),h(null))},[n,i,t,s,o]),(0,l.jsx)("canvas",{ref:c,width:360,height:810})}},1130:function(e,i,t){"use strict";t.r(i);var l=t("2676");t("5271");i.default=e=>{let{onStartGame:i,level:t,speed:r,onLevelChange:a,onSpeedChange:n,isRunning:s,gameEnded:o=!1}=e;return(0,l.jsxs)("div",{className:"game-controls",children:[(0,l.jsx)("button",{onClick:i,children:s?"\u30EA\u30B9\u30BF\u30FC\u30C8":"\u30B9\u30BF\u30FC\u30C8"}),(0,l.jsxs)("form",{onSubmit:e=>e.preventDefault(),children:[(0,l.jsx)("label",{htmlFor:"level",children:"game level: "}),(0,l.jsx)("input",{style:{display:"inline-block"},type:"number",max:20,min:0,value:t,id:"level",onChange:e=>a(parseInt(e.target.value,10)||0),disabled:s&&!o}),(0,l.jsx)("label",{htmlFor:"speed",children:"speed level: "}),(0,l.jsx)("input",{style:{display:"inline-block"},type:"number",max:6,min:0,value:r,id:"speed",onChange:e=>n(parseInt(e.target.value,10)||0),disabled:s&&!o})]})]})}},4612:function(e,i,t){"use strict";t.r(i),t.d(i,{Field:function(){return r}}),t("1160"),t("5698"),t("7475"),t("4210"),t("4072"),t("7395");var l=t("1007");class r{setupEventListeners(){let e=e=>{this.timerFlag&&this.moveMedic(e.code)};return window.addEventListener("keydown",e),()=>{window.removeEventListener("keydown",e)}}bacterialOutbreak(e){let i=this.gameField,t=4+4*e,r=0,a=e=>{let i=15-Math.ceil(e/2);return[i+Math.floor(Math.random()*(18-i)),Math.floor(8*Math.random())]};do{let[t,x]=a(e);if(!i[t][x]){var n,s,o,c,d,h,u,m,v,g,p,f;i[t][x]=new l.MedicineAndBug;let e=(null===(s=i[t-2])||void 0===s?void 0:null===(n=s[x])||void 0===n?void 0:n.color)===(null===(o=i[t][x])||void 0===o?void 0:o.color),a=(null===(d=i[t])||void 0===d?void 0:null===(c=d[x-2])||void 0===c?void 0:c.color)===(null===(h=i[t][x])||void 0===h?void 0:h.color),w=(null===(m=i[t+2])||void 0===m?void 0:null===(u=m[x])||void 0===u?void 0:u.color)===(null===(v=i[t][x])||void 0===v?void 0:v.color),b=(null===(p=i[t])||void 0===p?void 0:null===(g=p[x+2])||void 0===g?void 0:g.color)===(null===(f=i[t][x])||void 0===f?void 0:f.color);e||a||w||b?i[t][x]=null:r++}}while(r<t)}updateMoveFlag(){var e,i,t,l,r,a,n;let s=this.gameField,o=this.flagMove,{x_1:c,x_2:d,y_1:h,y_2:u}=this.medic,m=Math.max(c,d)+1,v=Math.min(h,u)-1,g=Math.max(h,u)+1;o.up=!!(null===(e=s[c-1])||void 0===e?void 0:e[v+1]),o.down=!!((null===(i=s[m])||void 0===i?void 0:i[h])||(null===(t=s[m])||void 0===t?void 0:t[u])||18===m),o.left=!!((null===(l=s[c])||void 0===l?void 0:l[v])||(null===(r=s[d])||void 0===r?void 0:r[v])||-1===v),o.right=!!((null===(a=s[c])||void 0===a?void 0:a[g])||(null===(n=s[d])||void 0===n?void 0:n[g])||8===g)}newMedicine(){let e=this.gameField;e[2][3]&&(this.gameOverFlag=!0),e[2][4]&&(this.gameOverFlag=!0),this.medic={x_1:2,y_1:3,x_2:2,y_2:4},this.updateMoveFlag();let{x_1:i,x_2:t,y_1:r,y_2:a}=this.medic;e[i][r]=Object.assign({},e[0][3]),e[t][a]=Object.assign({},e[0][4]),e[0][3]=new l.MedicineAndBug,e[0][4]=new l.MedicineAndBug}fieldCheck(e){if(!this.ctx)return;let i=this.gameField,t=this.flagMove.down;this.updateMoveFlag();let{x_1:l,x_2:r,y_1:a,y_2:n}=this.medic;if(t&&this.flagMove.down&&e.indexOf("Down")>=0){if(i[1]=Array(8).fill(null),i[l][a]&&i[r][n]){let e=i[l][a],t=i[r][n];e.pair_x=this.medic.x_2,e.pair_y=this.medic.y_2,t.pair_x=this.medic.x_1,t.pair_y=this.medic.y_1}else{let e=Math.max(l,r);i[e][a]&&(i[e][a].move=!0)}this.medic={x_1:0,y_1:0,x_2:0,y_2:0},this.stopTimer(),this.checkContinue4()}else!this.timerFlag&&this.startTimer();this.fieldUpdate()}fieldUpdate(){if(!this.ctx||this.gameClearFlag)return;let e=this.gameField,i=!0,{x_1:t,y_1:l,x_2:r,y_2:a}=this.medic;e.forEach((e,n)=>{e.forEach((e,s)=>{if(1===n)return!0;e?e.pair_x||e.move||t===n&&l===s||r===n&&a===s||0===n?this.ctx&&(this.ctx.fillStyle=this.color[e.color],this.ctx.fillRect(1+45*s,1+45*n,43,43)):this.ctx&&e.color-1>=0&&e.color-1<this.bacteriaImage.length&&(this.ctx.drawImage(this.bacteriaImage[e.color-1],1+45*s,1+45*n,43,43),i=!1):(0!==n||0!==s)&&this.ctx&&(this.ctx.fillStyle="black",this.ctx.fillRect(1+45*s,1+45*n,43,43))})}),this.gameClearFlag=i,this.gameOverFlag?(this.ctx&&this.ctx.drawImage(this.image[0],1,300,358,150),clearInterval(this.speedUpTimer),clearInterval(this.dropDownTimer),this.onGameOver()):this.gameClearFlag&&(this.ctx&&this.ctx.drawImage(this.image[1],1,300,358,150),clearInterval(this.speedUpTimer),this.onGameClear())}startClearDownTimer(){this.clearDownTimer=setInterval(()=>this.dropdown(),this.timer)}startSpeedUpTimer(){this.speedUpTimer=setInterval(()=>this.resetTimer(),6e4)}resetTimer(){200===this.timer?clearInterval(this.speedUpTimer):(this.timer-=100,this.timerFlag&&(this.stopTimer(),this.startTimer()))}startTimer(){this.dropDownTimer=setInterval(()=>this.moveMedic(),this.timer),this.timerFlag=!0}stopTimer(){clearInterval(this.dropDownTimer),this.timerFlag=!1}checkContinue4(){let e=[],i=this.gameField;i.forEach((i,t)=>{let l=0,r=4,a=3;do{let o=i.slice(l,r),c=!0;for(let e=0;e<=a;e++){var n,s;((null===(n=o[0])||void 0===n?void 0:n.color)!==(null===(s=o[e])||void 0===s?void 0:s.color)||!o[0]||!o[e])&&(c=!1)}if(c&&(r++,a++),!c||9===r){if(a>=4){for(let i=l;i<r-1;i++)e.push([t,i]);l=r-1,r+=3,a=3}else l++,r++}}while(r<=9)});for(let r=0;r<8;r++){let a=i.map(e=>e[r]),n=0,s=4,o=3;do{let i=a.slice(n,s),c=!0;for(let e=0;e<=o;e++){var t,l;((null===(t=i[0])||void 0===t?void 0:t.color)!==(null===(l=i[e])||void 0===l?void 0:l.color)||!i[0]||!i[e])&&(c=!1)}if(c&&(s++,o++),!c||19===s){if(o>=4){for(let i=n;i<s-1;i++)e.push([i,r]);n=s-1,s+=3,o=3}else n++,s++}}while(s<=19)}e.forEach(e=>{let[t,l]=e;if(null===i[t][l])return!1;let{pair_x:r,pair_y:a}=i[t][l];null!==r&&null!==a&&i[r][a]&&(i[r][a].move=!0,i[r][a].pair_x=null),i[t][l]=null}),this.fieldUpdate(),this.gameClearFlag?(this.ctx&&this.ctx.drawImage(this.image[1],1,300,358,150),clearInterval(this.speedUpTimer),this.onGameClear()):e.length>0?this.startClearDownTimer():(this.newMedicine(),this.fieldUpdate(),!this.timerFlag&&this.startTimer())}moveMedic(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"Down";if(this.gameOverFlag||this.gameClearFlag)return;let i=this.gameField,{x_1:t,x_2:l,y_1:r,y_2:a}=this.medic,{right:n,left:s,up:o,down:c}=this.flagMove,d=Object.assign({},i[t][r]),h=Object.assign({},i[l][a]);switch(i[t][r]=i[l][a]=null,e){case"ArrowRight":r+a<13&&!n&&(r++,a++);break;case"ArrowLeft":r+a>1&&!s&&(r--,a--);break;case"ArrowDown":!c&&this.stopTimer();case"Down":t+l<33&&!c&&(t++,l++);break;case"ArrowUp":if(r===a){if(s&&n)break;t<l?(t++,r++):(l++,a++)}else{if(o)break;r<a?(t--,a--):(l--,r--)}(r+a===14||r!==a&&n)&&(r--,a--)}i[t][r]=d,i[l][a]=h,this.medic={x_1:t,y_1:r,x_2:l,y_2:a},this.fieldCheck(e)}dropdown(){let e;let i=this.gameField,t=!1;for(let l=17;l>1;l--){let r=i[l];r.forEach((r,a)=>{if(!e)return!1;if(r&&!e[a]){var n,s;r.move?(e[a]=Object.assign({},r),i[l][a]=null,t=!0):null!==r.pair_x&&null!==r.pair_y&&(!(null===(n=i[r.pair_x+1])||void 0===n?void 0:n[r.pair_y])||(null===(s=i[r.pair_x][r.pair_y])||void 0===s?void 0:s.pair_y)===r.pair_y)&&(e[a]=Object.assign({},r),i[l][a]=null,null!==r.pair_x&&null!==r.pair_y&&(i[r.pair_x+1][r.pair_y]=Object.assign({},i[r.pair_x][r.pair_y]),i[r.pair_x][r.pair_y]=null,e[a]&&(e[a].pair_x=(r.pair_x||0)+1),i[r.pair_x+1][r.pair_y]&&(i[r.pair_x+1][r.pair_y].pair_x=(r.pair_x||0)+1)),t=!0)}}),e=r}t?this.fieldUpdate():(clearInterval(this.clearDownTimer),this.checkContinue4())}cleanup(){clearInterval(this.dropDownTimer),clearInterval(this.speedUpTimer),clearInterval(this.clearDownTimer)}constructor(e,i,t,r,a){if(this.ctx=null,this.gameField=[],this.color=["black","red","blue","yellow"],this.image=[new Image,new Image],this.bacteriaImage=[new Image,new Image,new Image],this.medic={x_1:0,y_1:0,x_2:0,y_2:0},this.timer=700,this.flagMove={up:!1,down:!1,left:!1,right:!1},this.timerFlag=!1,this.gameOverFlag=!1,this.gameClearFlag=!1,this.onGameOver=r,this.onGameClear=a,this.ctx=e.getContext("2d"),!this.ctx)return;this.setupEventListeners(),this.timer-=100*t,this.image[0].src="/img/gameover.png",this.image[1].src="/img/gameclear.png",this.bacteriaImage[0].src="/img/akakin.png",this.bacteriaImage[1].src="/img/aokin.png",this.bacteriaImage[2].src="/img/kikin.png",this.ctx.clearRect(0,0,e.width,e.height),this.ctx.fillStyle="white",this.ctx.fillRect(1,1,133,90),this.ctx.fillRect(226,1,133,90);var n=Array(20).fill(null).map(()=>Array(8).fill(null));n[0][3]=new l.MedicineAndBug,n[0][4]=new l.MedicineAndBug,this.gameField=n,this.bacterialOutbreak(i),this.startSpeedUpTimer(),this.newMedicine(),this.fieldCheck("Down")}}},1007:function(e,i,t){"use strict";t.r(i),t.d(i,{MedicineAndBug:function(){return l}});class l{constructor(e){this.move=!1,this.color=0,this.pair_x=null,this.pair_y=null,this.color=void 0===e?Math.floor(3*Math.random()+1):e}}},9506:function(e,i,t){"use strict";t.r(i);var l=t("2676"),r=t("8751"),a=t("6930");t("2592"),r.createRoot(document.getElementById("root")).render((0,l.jsx)(a.default,{}))},2592:function(e){}},a={};function n(e){var i=a[e];if(void 0!==i)return i.exports;var t=a[e]={exports:{}};return r[e].call(t.exports,t,t.exports,n),t.exports}n.m=r,n.n=function(e){var i=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(i,{a:i}),i},n.d=function(e,i){for(var t in i)n.o(i,t)&&!n.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:i[t]})},n.k=function(e){return""+e+".css"},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=function(e,i){return Object.prototype.hasOwnProperty.call(e,i)},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},e=[],n.O=function(i,t,l,r){if(t){r=r||0;for(var a=e.length;a>0&&e[a-1][2]>r;a--)e[a]=e[a-1];e[a]=[t,l,r];return}for(var s=1/0,a=0;a<e.length;a++){for(var t=e[a][0],l=e[a][1],r=e[a][2],o=!0,c=0;c<t.length;c++)s>=r&&Object.keys(n.O).every(function(e){return n.O[e](t[c])})?t.splice(c--,1):(o=!1,r<s&&(s=r));if(o){e.splice(a--,1);var d=l();void 0!==d&&(i=d)}}return i},n.p="/doq_mari/",i={980:0},n.O.j=function(e){return 0===i[e]},t=function(e,t){var l=t[0],r=t[1],a=t[2],s,o,c=0;if(l.some(function(e){return 0!==i[e]})){for(s in r)n.o(r,s)&&(n.m[s]=r[s]);if(a)var d=a(n)}for(e&&e(t);c<l.length;c++)o=l[c],n.o(i,o)&&i[o]&&i[o][0](),i[o]=0;return n.O(d)},(l=self.webpackChunkdoq_mari=self.webpackChunkdoq_mari||[]).forEach(t.bind(null,0)),l.push=t.bind(null,l.push.bind(l));var s=n.O(void 0,["126","361"],function(){return n("9506")});n.O(s)}();