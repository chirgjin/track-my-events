/**
 * This file contains various snippets provided to end users for implementing tracking sdk on their websites
 * For the source (non-minified) sdk checkout assets/tracking-sdk.js
 */

export const sdkSnippet = `
<script>
!function(){!function(a){"object"==typeof exports&&"undefined"!=typeof module?module.exports=a():"function"==typeof define&&define.amd?define([],a):("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).cuid=a()}(function(){return(function d(e,f,b){function c(a,k){if(!f[a]){if(!e[a]){var i="function"==typeof require&&require;if(!k&&i)return i(a,!0);if(g)return g(a,!0);var j=new Error("Cannot find module '"+a+"'");throw j.code="MODULE_NOT_FOUND",j}var h=f[a]={exports:{}};e[a][0].call(h.exports,function(b){return c(e[a][1][b]||b)},h,h.exports,d,e,f,b)}return f[a].exports}for(var g="function"==typeof require&&require,a=0;a<b.length;a++)c(b[a]);return c})({1:[function(b,c,e){var d=b("./lib/fingerprint.js"),f=b("./lib/pad.js"),g=b("./lib/getRandomValue.js"),h=0;function i(){return f((1679616*g()<<0).toString(36),4)}function j(){return h=h<1679616?h:0,++h-1}function a(){return"c"+(new Date).getTime().toString(36)+f(j().toString(36),4)+d()+(i()+i())}a.slug=function(){var a=(new Date).getTime().toString(36),b=j().toString(36).slice(-4),c=d().slice(0,1)+d().slice(-1),e=i().slice(-2);return a.slice(-2)+b+c+e},a.isCuid=function(a){return"string"==typeof a&&!!a.startsWith("c")},a.isSlug=function(a){if("string"!=typeof a)return!1;var b=a.length;return 7<=b&&b<=10},a.fingerprint=d,c.exports=a},{"./lib/fingerprint.js":2,"./lib/getRandomValue.js":3,"./lib/pad.js":4}],2:[function(a,b,f){var c=a("./pad.js"),d="object"==typeof window?window:self,e=Object.keys(d).length,g=c(((navigator.mimeTypes?navigator.mimeTypes.length:0)+navigator.userAgent.length).toString(36)+e.toString(36),4);b.exports=function(){return g}},{"./pad.js":4}],3:[function(d,b,e){var a,c="undefined"!=typeof window&&(window.crypto||window.msCrypto)||"undefined"!=typeof self&&self.crypto;if(c){var f=4294967295;a=function(){return Math.abs(c.getRandomValues(new Uint32Array(1))[0]/f)}}else a=Math.random;b.exports=a},{}],4:[function(b,a,c){a.exports=function(b,c){var a="000000000"+b;return a.substr(a.length-c)}},{}]},{},[1])(1)});var b="__trk_session_id",e="__trk_user_id";sessionStorage.getItem(b)||sessionStorage.setItem(b,Date.now()+window.cuid());var f=g();function g(){return localStorage.getItem(e)||localStorage.setItem(e,"temp:"+Date.now()+window.cuid()),localStorage.getItem(e)}function d(a){return a.apiKey="{{API_KEY}}",a.userId=(a.userId,f),a.referrer=void 0!==a.referrer?a.referrer:document.referrer,a.page=void 0!==a.page?a.page:window.location.href,a.eventTime=void 0!==a.eventTime?a.eventTime:Date.now(),a.sessionId=void 0!==a.sessionId?a.sessionId:sessionStorage.getItem(b),fetch("{{BASE_URL}}/api/tracking-service/v1/public/events/",{headers:{"content-type":"application/json"},body:JSON.stringify(a),method:"POST"})}var c=function(a){var b=history[a];return function(){var d=b.apply(this,arguments),c=new Event(a);return c.arguments=arguments,window.dispatchEvent(c),d}};history.pushState=c("pushState"),history.replaceState=c("replaceState");var a=function(a){d({eventName:"PAGE_VIEW",context:{}})};window.addEventListener("popstate",a),window.addEventListener("pushState",a),window.addEventListener("replaceState",a),window.addEventListener("load",a),window.__trk={setUserId:function(a){f=a&&a.toString()||g(),a&&localStorage.removeItem(e)},trackEvent:d}}()
</script>
`
  .trim()
  .replace(/\{\{BASE_URL\}\}/gi, process.env.REACT_APP_API_URL!)

export const setUserIdSnippet = `
<script>
window.__trk.setUserId("<Your user id here>")
</script>
`.trim()

export const trackManuallySnippet = `
<script>
// Capturing all the click events
window.addEventListener('click', function (event) {
    var target = event.target

    window.__trk.trackEvent({
        eventName: "CLICK", // this can be any string you want
        context: {
            // pass custom data
            name: target.getAttribute("name"),
            id: target.getAttribute("id"),
            tag: target.tagName
        }
    })
})
</script>`.trim()
