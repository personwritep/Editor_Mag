// ==UserScript==
// @name        Editor Mag ⭐
// @namespace        http://tampermonkey.net/
// @version        0.1
// @description        ブログ編集画面の「編集枠」のみを拡大表示する
// @author        Ameba Blog User
// @match        https://blog.ameba.jp/ucs/entry/srventry*
// @exclude        https://blog.ameba.jp/ucs/entry/srventrylist*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=ameba.jp
// @grant        none
// @updateURL        https://github.com/personwritep/Editor_Mag/raw/main/Editor_Mag.user.js
// @downloadURL        https://github.com/personwritep/Editor_Mag/raw/main/Editor_Mag.user.js
// ==/UserScript==


let em_zoom=localStorage.getItem('EditorMag'); // ディスプレイ拡大率 🔵
if(!em_zoom){
    em_zoom=100;
    localStorage.setItem('EditorMag', em_zoom); }



let cont=
    '<div id="zoom_cont">'+
    '<input id="z_con" type="number" min="100" max="160" step="5">'+
    '<style>'+
    '#zoom_cont { position: absolute; top: 5px; right: 184px; opacity: 0; '+
    'transition: .4s; transition-timing-function: ease-in-out; }'+
    '#zoom_cont:hover { opacity: 1; }'+
    '#z_con { font: 16px Meiryo; width: 50px; height: 22px; padding: 2px 2px 0 4px; '+
    'border: 1px solid #aaa; border-radius: 3px; background: #fff; }'+
    '</style></div>';

if(!document.querySelector('#zoom_cont')){
    let p_title=document.querySelector('.p-title');
    p_title.insertAdjacentHTML('beforeend', cont); }

let z_con=document.querySelector('#z_con');
z_con.value=em_zoom;



let retry=0;
let interval=setInterval(wait_target, 20);
function wait_target(){
    retry++;
    if(retry>100){ // リトライ制限 100回 2sec
        clearInterval(interval); }
    let target=document.getElementById('cke_1_contents'); // 監視 target
    if(target){
        clearInterval(interval);
        main(target); }}



function main(cke){

    style_in();

    let monitor=new MutationObserver(style_in);
    monitor.observe(cke, {childList: true});

    function style_in(){
        let editor_iframe=document.querySelector('.cke_wysiwyg_frame');
        if(editor_iframe){ // iframe読込みが実行条件
            let iframe_doc=editor_iframe.contentWindow.document;
            if(iframe_doc){
                let iframe_html=iframe_doc.documentElement;
                if(iframe_html){

                    let style='<style id="editor_mag">body.cke_editable { '+
                        'transform: scale(' + em_zoom/100 +'); transform-origin: top; }'+
                        '</style>';

                    if(iframe_html.querySelector('#editor_mag')){
                        iframe_html.querySelector('#editor_mag').remove(); }
                    iframe_html.insertAdjacentHTML('beforeend', style);

                }}}} // style_in()



    z_con.addEventListener('input', function(){
        em_zoom=z_con.value;
        style_in();
        localStorage.setItem('EditorMag', em_zoom); }); // 拡大率を登録 🔵

} // main()
