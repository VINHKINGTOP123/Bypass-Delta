// ==UserScript==
// @name         Bypass Delta
// @homepageURL  https://discord.gg/gFNAH7WNZj
// @version      1.0
// @description  Bypass Delta Key System
// @author       xGreen
// @match        https://loot-link.com/s?*
// @match        https://loot-links.com/s?*
// @match        https://lootlink.org/s?*
// @match        https://lootlinks.co/s?*
// @match        https://gateway.platoboost.com/a/2569?id=*
// @match        https://gateway.platoboost.com/a/8?id=*
// @match        https://lootdest.info/s?*
// @match        https://lootdest.org/s?*
// @match        https://lootdest.com/s?*
// @match        https://links-loot.com/s?*
// @match        https://linksloot.net/s?*
// @match        https://*/recaptcha/*
// @match        https://*.hcaptcha.com/*hcaptcha-challenge*
// @match        https://*.hcaptcha.com/*checkbox*
// @match        https://*.hcaptcha.com/*captcha*

// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_openInTab

// @connect      api-gateway.platoboost.com
// @icon         https://avatars.githubusercontent.com/u/85283786?s=48&v=4
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function delta() {
    let e = new URL(window.location.href).searchParams.get("id"),
        t = await (await fetch("https://api-gateway.platoboost.com/v1/authenticators/8/" + e)).json();
    if (t.key) return;
    let a = new URL(window.location.href).searchParams.get("tk");
    if (a) await sleep(5e3), await (await fetch(`https://api-gateway.platoboost.com/v1/sessions/auth/8/${e}/${a}`, {
        method: "PUT"
    })).json().then(async e => {
        window.location.assign(e.redirect)
    }).catch(e => {
        alert(e)
    });
    else {
        let o = t.captcha,
            n = await fetch("https://api-gateway.platoboost.com/v1/sessions/auth/8/" + e, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    captcha: o ? await getTurnstileResponse() : "",
                    type: o ? "Turnstile" : ""
                })
            });
        n = await n.json(), await sleep(1e3);
        let s = decodeURIComponent(n.redirect),
            i = new URL(s).searchParams.get("r"),
            c = atob(i);
        window.location.assign(c)
    }
}
async function getTurnstileResponse() {
    let e = "";
    for (;;) {
        try {
            if (e = turnstile.getResponse()) break
        } catch (t) {}
        await sleep(1)
    }
    return turnstile.getResponse()
}
let p = window.location.href;
   p.includes("gateway.platoboost.com/a/8") && delta()
(), start();
