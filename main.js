let FONT = '24px "M PLUS 1p"';

/**
 * 指定キーワードをハイライトしながら1行表示する
 * @param ctx Canvasの2Dコンテキスト
 * @param text{string} 描画するテキスト
 * @param pos{Array<string>} ハイライトするキーワード配列
 * @param y 描画Y座標
 */
function draw_1line( ctx, text, pos, y ){
    let resultArray = [];
    let regex;
    if( pos.join( "" ) !== "" ){
        regex = new RegExp( `(${pos.join("|")})` );
        resultArray = text.split( regex );
    }else{
        resultArray.push( text );
        regex = new RegExp( "(foobarbaz)" );
    }
    ctx.font = FONT;
    let x = 10;
    for( let r of resultArray ){
        ctx.fillStyle = !r.match( regex ) ? '#67c4ea' : '#f5608c';
        ctx.fillText( r, x, y );
        let width = ctx.measureText( r ).width;
        x += width;
    }
}


function get_common_prefix( text ){
    let lines = text.split( '\n' );
    let str1 = lines[0];
    let str2 = lines[1];

    let result = "";
    for( let i = 1; i < str1.length; i++ ){
        if( str2.indexOf( str1.substring( 0, i ) ) >= 0 ){
            result = str1.substring( 0, i );
        }
    }
    return result;
}

function draw(){
    // let canvas = document.createElement( "canvas" );
    let canvas = document.querySelector( "#canvas" );
    let ctx = canvas.getContext( '2d' );
    let position = document.querySelector( "#position" ).value;
    // let macro = sample_macro;
    let macro = document.querySelector( "#macro" ).value;

    // チャットログからコピペするときにいろいろと付く行頭の余計なものを削除
    macro = macro.replace( /^\s*/, "" );
    macro = macro.replace( /^\[\d+:\d+\]\s*/gm, "" );   // 行頭の時刻を削除
    let prefix = get_common_prefix( macro );
    if( prefix ){
        macro = macro.replace( new RegExp( `\^.*${prefix}`, 'gm' ), "" );
    }

    // テキストの幅と高さを計算
    ctx.font = FONT;
    ctx.fillStyle = 'white';
    let lines = macro.split( '\n' );
    let maxWidth = 0;
    let lineHeight = 30; // フォントサイズに基づく行の高さ
    let totalHeight = lines.length * lineHeight;

    for( let i = 0; i < lines.length; i++ ){
        let width = ctx.measureText( lines[i] ).width;
        if( width > maxWidth ){
            maxWidth = width;
        }
    }

    // Canvasのサイズをテキストの幅と高さに合わせて調整
    canvas.width = maxWidth + 20; // テキストの幅に余白を加える
    canvas.height = totalHeight + 20; // テキストの高さに余白を加える
    ctx.fillStyle = 'black';
    ctx.fillRect( 0, 0, canvas.width, canvas.height );

    // テキストを描画
    let keyword = [position]
    // if( position.match( /^D/ ) ){
    //     keyword.push( "DPS" );
    // }
    if( document.querySelector( "#keyword" ).value ){
        keyword.push( document.querySelector( "#keyword" ).value );
    }

    let y = 30; // 初期のy座標
    for( let i = 0; i < lines.length; i++ ){
        draw_1line( ctx, lines[i], keyword, y );
        y += lineHeight; // 次の行のy座標を更新
    }
}


window.addEventListener( "load", ( ev ) => {
    let video = document.querySelector( "#video" );
    video.srcObject = document.querySelector( "#canvas" ).captureStream();
    video.muted = true;
    video.play();

    draw();

    document.querySelector( "#macro" ).addEventListener( "input", ( ev ) => {
        draw();
    } );
    document.querySelector( "#position" ).addEventListener( "change", ( ev ) => {
        draw();
    } );
    document.querySelector( "#keyword" ).addEventListener( "change", ( ev ) => {
        draw();
    } );
    document.querySelector( "#btn-pinp" ).addEventListener( 'click', () => {
        const video = document.querySelector( "#video" );
        video.requestPictureInPicture();
    } );
} );
