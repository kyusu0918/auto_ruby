/********************************************************************************
 * 自動ルビティラノスクリプトプラグイン ver1.2.0
 *
 * @since 2026/09/18
 * @author Kei Yusu
 *
 *********************************************************************************/
(() => {

  /********************************************************************************
   * ルビ設定タグ作成
   *
   * @param font: フォント
   * @param size: サイズ
   * @param color 色
   * @since 2024/11/22
   * @author Kei Yusu
   * 
   *********************************************************************************/
  const rb_config = {
    kag: TYRANO.kag,
    vital: [],
    pm: {
      font: "",
      size: "",
      color: "",
    },
    start : function(pm) {

      // ルビ設定がない場合
      if(TYRANO.kag.variable.sf.auto_ruby_config == undefined){

        // ルビ設定を初期値で作成
        TYRANO.kag.variable.sf.auto_ruby_config = {font: TYRANO.kag.config.userFace, size: "", color: ""};

      }

      // フォント指定があった場合
      if(pm.font){

        // 初期値指定の場合
        if(pm.font == "default"){

          // フォント設定(初期値)
          TYRANO.kag.variable.sf.auto_ruby_config.font = TYRANO.kag.config.userFace;

        // その他の場合
        }else{

          // フォント設定
          TYRANO.kag.variable.sf.auto_ruby_config.font = pm.font;

        }

      }

      // サイズ指定があった場合
      if(pm.size){

        // 初期値指定の場合
        if(pm.size == "default"){

          // サイズ設定（初期値）
          TYRANO.kag.variable.sf.auto_ruby_config.size = "";

        // その他の場合
        }else{

          // サイズ設定
          TYRANO.kag.variable.sf.auto_ruby_config.size = pm.size;

        }

      }

      // 色指定があった場合
      if(pm.color){

        // 初期値指定の場合
        if(pm.size == "default"){

          // 色設定（初期値）
          TYRANO.kag.variable.sf.auto_ruby_config.color = "";

        // その他の場会
        }else{

          // 色設定
          TYRANO.kag.variable.sf.auto_ruby_config.color = $.convertColor(pm.color);

        }

      }

      // 次のタグへ
      this.kag.ftag.nextOrder();

    }
  }

  // ルビ設定タグ追加
  TYRANO.kag.ftag.master_tag.rb_config = object(rb_config);
  TYRANO.kag.ftag.master_tag.rb_config.kag = TYRANO.kag;

  /********************************************************************************
   * JSONファイルルビ登録タグ作成
   *
   * @param file JSONファイル
   * @since 2024/11/11
   * @author Kei Yusu
   * 
   *********************************************************************************/
  const arb_json = {
    kag: TYRANO.kag,
    vital: ["file"],
    pm: {},
    start : function(pm) {

      try{

        // ストア配列がない場合
        if(TYRANO.kag.variable.sf.auto_ruby_store == undefined){
    
          // ストア配列作成
          TYRANO.kag.variable.sf.auto_ruby_store = [];
          
        // ストア配列がある場合
        } else {

          // 配列をクリア
          TYRANO.kag.variable.sf.auto_ruby_store.splice(0);
          
        }

        // JSONデータ取得
        $.ajax({
          url: pm.file,
          type: "get",
          dataType: "json"
        })
        .done(json => {
    
          // ストア配列作成
          TYRANO.kag.variable.sf.auto_ruby_store = json;

          console.log("★★★ JSON read successed ★★★:", TYRANO.kag.variable.sf.auto_ruby_store);
    
        })
        .fail((jqXHR, textStatus, errorThrown) => {
    
          // アラート表示
          alert(`JSONの読み込みに失敗しました。\njqXHR : ${jqXHR.status}\ntextStatus : ${textStatus}\nerrorThrown : ${errorThrown.message}`);
    
          console.log("XXX JSON read error XXX");
          console.log("jqXHR          : " + jqXHR.status);
          console.log("textStatus     : " + textStatus);
          console.log("errorThrown    : " + errorThrown.message);
    
        });
    
      }catch(e){

        // エラー出力
        console.log("JSON read error", e.message);
        alert("JSON read error:" + e.message);

      }

      // 次のタグへ
      this.kag.ftag.nextOrder();

    }

  }

  // JSONファイル登録タグ追加
  TYRANO.kag.ftag.master_tag.arb_json = object(arb_json);
  TYRANO.kag.ftag.master_tag.arb_json.kag = TYRANO.kag;

  /********************************************************************************
   * ルビ登録タグ作成
   *
   * @param ruby ルビ
   * @param text テキスト
   * @since 2024/11/11
   * @author Kei Yusu
   * 
   *********************************************************************************/
  const arb = {
    kag: TYRANO.kag,
    vital: ["ruby"],
    pm: {
      text: "",
    },
    start : function(pm) {

      // ストア配列がない場合
      if(TYRANO.kag.variable.sf.auto_ruby_store == undefined){
  
        // ストア配列作成
        TYRANO.kag.variable.sf.auto_ruby_store = [];
        
      }

      // ルビデータ取得
      const auto_ruby_data = TYRANO.kag.variable.sf.auto_ruby_store.find(it => it.ruby == pm.ruby);

      // ルビデータがある場合
      if(auto_ruby_data){

        // ルビ更新
        auto_ruby_data.text = pm.text;

      // ルビデータない場合
      }else{

        // ルビデータ新規作成
        const auto_ruby_data = {
          ruby: pm.ruby,
          text: pm.text,
        }

        // ルビデータ追加
        TYRANO.kag.variable.sf.auto_ruby_store.push(auto_ruby_data);

      }

      // 次のタグへ
      this.kag.ftag.nextOrder();

    }

  }

  // ルビ登録タグ追加
  TYRANO.kag.ftag.master_tag.arb = object(arb);
  TYRANO.kag.ftag.master_tag.arb.kag = TYRANO.kag;

  /********************************************************************************
   * ルビ削除タグ作成
   *
   * @param ruby ルビ
   * @since 2024/11/11
   * @author Kei Yusu
   * 
   *********************************************************************************/
  const drb = {
    kag: TYRANO.kag,
    vital: ["ruby"],
    pm: {
    },
    start : function(pm) {

      // ストア配列がある場合
      if(TYRANO.kag.variable.sf.auto_ruby_store != undefined){

        // 指定ID以外でストア配列を再作成
        TYRANO.kag.variable.sf.auto_ruby_store = TYRANO.kag.variable.sf.auto_ruby_store.filter(it => it.ruby != pm.ruby);

      }

      // 次のタグへ
      this.kag.ftag.nextOrder();

    }

  }

  // ルビ削除タグ追加
  TYRANO.kag.ftag.master_tag.drb = object(drb);
  TYRANO.kag.ftag.master_tag.drb.kag = TYRANO.kag;

  /********************************************************************************
   * ルビクリアタグ作成
   *
   * @since 2024/01/13
   * @author Kei Yusu
   * 
   *********************************************************************************/
  const crb = {
    kag: TYRANO.kag,
    vital: [],
    pm: {
    },
    start : function(pm) {

      // ルビ設定がある場合
      if(TYRANO.kag.variable.sf.auto_ruby_config != undefined){
        
        // ルビ設定削除
        delete TYRANO.kag.variable.sf.auto_ruby_config

      }

      // ストア配列がある場合
      if(TYRANO.kag.variable.sf.auto_ruby_store != undefined){

        // ストア配列削除
        delete TYRANO.kag.variable.sf.auto_ruby_store

      }

      // 次のタグへ
      this.kag.ftag.nextOrder();

    }

  }

  // ルビクリアタグ追加
  TYRANO.kag.ftag.master_tag.crb = object(crb);
  TYRANO.kag.ftag.master_tag.crb.kag = TYRANO.kag;

  /********************************************************************************
   * ルビ開始タグ作成
   *
   * @param text ルビ
   * @since 2026/09/18
   * @author Kei Yusu
   * 
   *********************************************************************************/
  const srb = {
    kag: TYRANO.kag,
    vital: [],
    log_join: "true",
    pm: {
      text: "",
    },
    start : function(pm) {

      // 親エレメントとルビをキャッシュ
      // setMessageCurrentSpan()は「新しい行の開始」として扱われ、
      // speech_bracket_float等の行頭判定ロジックを誤爆させるため、
      // 副作用のないgetMessageCurrentSpan()で現在のspanをそのまま参照する
      const j_current_span = TYRANO.kag.getMessageCurrentSpan();
      TYRANO.kag.variable.tf.auto_ruby_cache_parent = j_current_span;
      TYRANO.kag.variable.tf.auto_ruby_cache_start_index = j_current_span.children('span').length;
      TYRANO.kag.variable.tf.auto_ruby_cache_ruby_text = pm.text;

      // log_join: "true", の方式へ変更したためコメントアウト
      // // 親エレメントの直前のエレメントを取得
      // const prevElem = $(TYRANO.kag.variable.tf.auto_ruby_cache_parent).prev();

      // // 直前のエレメントが空白でなく、親エレメントが同一階層の場合
      // if(prevElem.length && prevElem.text() != "" && prevElem.parent().is($(TYRANO.kag.variable.tf.auto_ruby_cache_parent).parent())){

      //   // 行頭フラグをキャッシュ（行頭でない）
      //   TYRANO.kag.variable.tf.auto_ruby_cache_is_head = false;

      // // 上記以外の場合（行頭の場合）
      // }else{

      //   // 行頭フラグをキャッシュ（行頭）
      //   TYRANO.kag.variable.tf.auto_ruby_cache_is_head = true;

      // }

      // 次のタグへ
      this.kag.ftag.nextOrder();

    },
  
  }

  // ルビ開始タグ追加
  TYRANO.kag.ftag.master_tag.srb = object(srb);
  TYRANO.kag.ftag.master_tag.srb.kag = TYRANO.kag;

  /********************************************************************************
   * ルビ終了タグ作成
   *
   * @since 2026/09/18
   * @author Kei Yusu
   * 
   *********************************************************************************/
  const erb = {
    kag: TYRANO.kag,
    vital: [],
    log_join: "true",
    pm: {},
    start : function(pm) {

      // 親オブジェクトキャッシュが存在する場合
      if(TYRANO.kag.variable.tf.auto_ruby_cache_parent){

        // 親要素の子spanのうち、srb実行時点より後に追加された分だけをルビ対象とする
        const startIndex = TYRANO.kag.variable.tf.auto_ruby_cache_start_index || 0;
        const rubyTargetChars = TYRANO.kag.variable.tf.auto_ruby_cache_parent.children('span').slice(startIndex);

        // ルビ対象文字列取得
        const rubytargetText = rubyTargetChars.text();

        // デフォルトのspanを削除
        $(rubyTargetChars).children('span').remove();

        // ルビの初期値を設定
        let rubyText = "";

        // ルビが指定されている場合
        if(TYRANO.kag.variable.tf.auto_ruby_cache_ruby_text){

          // ルビ取得
          rubyText = TYRANO.kag.variable.tf.auto_ruby_cache_ruby_text;

        // ルビが指定されていない場合
        } else {

          // ルビ取得
          rubyText = getRubyText(rubytargetText);

        }

        // ルビ設定がない場合
        if(TYRANO.kag.variable.sf.auto_ruby_config == undefined){

          // ルビ設定を初期値で作成
          TYRANO.kag.variable.sf.auto_ruby_config = {font: TYRANO.kag.config.userFace, size: "", color: ""};

        }

        // フォント設定取得
        const style_font = TYRANO.kag.variable.sf.auto_ruby_config.font != "" ? `font-family: ${TYRANO.kag.variable.sf.auto_ruby_config.font};` : "";

        // サイズ設定取得
        const style_size = TYRANO.kag.variable.sf.auto_ruby_config.size != "" ? `font-size: ${TYRANO.kag.variable.sf.auto_ruby_config.size};` : "";

        // 色設定取得
        const style_color = TYRANO.kag.variable.sf.auto_ruby_config.color != "" ? `color: ${TYRANO.kag.variable.sf.auto_ruby_config.color};` : "";

        // スタイル設定取得
        const style = style_font || style_size || style_color ? `style="${style_font}${style_size}${style_color}"` : "";

        // ルビ文字を1文字ずつspanに分割（本文幅を文字数で均等割りした区画の中央にそれぞれ配置するため）
        const rubyTextHtml = rubyText.split("").map(c => `<span>${c}</span>`).join("");

        // ルビ付きHTML（画面表示とバックログの両方で使い回す）
        const rubyHtml = `<ruby class='auto_ruby'>${rubytargetText}<rt class='auto_rt' ${style}>${rubyTextHtml}</rt></ruby>`;

        // 標準の<ruby><rt>要素のまま追加（CSS側でposition:absoluteにして行の高さに影響させないようにする）
        // 縦書き/横書きの判定はCSS側で親の.vertical_textクラス（Tyranoが動的に管理）を見て行うため、
        // ここではクラスを固定しない（あとから[position vertical=...]で切り替わった場合も追従させるため）
        $(rubyTargetChars).append(rubyHtml)

        // バックログにもルビを反映する
        // Tyrano本体は印字と同時にバックログへ書き出すため、後からDOMを書き換えるauto_rubyの
        // ルビは通常だとバックログに残らない。ログ末尾は「ルビ対象の文字列」の直後に
        // </span>等の閉じタグが0個以上続いて終わっている形（joinで span 追加される、または
        // 追加無しでそのまま終わる場合の両方）になっているので、そのパターンにマッチした時だけ
        // 閉じタグは残したままルビ対象の文字列の部分だけをルビ付きHTMLに差し替える
        if(rubytargetText != "" && TYRANO.kag.config.maxBackLogNum != 0 && TYRANO.kag.stat.log_write != false){

          const backlog = TYRANO.kag.variable.tf.system.backlog;

          // バックログが存在する場合
          if(backlog && backlog.length > 0){

            // 直前のログエントリを取得
            let last_log = backlog.pop();

            // ルビ対象の文字列＋0個以上の閉じタグで終わっているかを判定
            const escaped = rubytargetText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const tailPattern = new RegExp(escaped + "((?:</[a-zA-Z]+>)*)$");
            const match = last_log.match(tailPattern);

            // マッチした場合のみ差し替える（食い違う場合は元に戻すだけにする）
            if(match){

              const closingTags = match[1];
              const cutIndex = last_log.length - match[0].length;
              last_log = last_log.slice(0, cutIndex) + rubyHtml + closingTags;

            }

            // ログに戻す
            TYRANO.kag.pushBackLog(last_log, "add");

          }

        }

      }

      // 次のタグへ
      this.kag.ftag.nextOrder();

      // 親オブジェクトキャッシュが存在する場合
      if(TYRANO.kag.variable.tf.auto_ruby_cache_parent){

        // バックログ調整
        // log_join: "true", の方式へ変更したためコメントアウト
        // adjustBackLog();

        // キャッシュクリア
        TYRANO.kag.variable.tf.auto_ruby_cache_parent = undefined;
        TYRANO.kag.variable.tf.auto_ruby_cache_start_index = 0;
        TYRANO.kag.variable.tf.auto_ruby_cache_ruby_text = "";

        // log_join: "true", の方式へ変更したためコメントアウト
        // TYRANO.kag.variable.tf.auto_ruby_cache_is_head = false;

      }

    }

  }

  // ルビ終了タグ追加
  TYRANO.kag.ftag.master_tag.erb = object(erb);
  TYRANO.kag.ftag.master_tag.erb.kag = TYRANO.kag;
  
  /********************************************************************************
   * ルビ取得
   *
   * @param rubytargetText ルビ対象文字列
   * @returns ルビ
   * @since 2024/11/11
   * @author Kei Yusu
   * 
   *********************************************************************************/
  const getRubyText = (rubytargetText) => {

    // ルビの初期値を設定
    let text = "";

    // ストア配列がある場合
    if(TYRANO.kag.variable.sf.auto_ruby_store != undefined){

      // ルビオブジェクト取得
      ruby = TYRANO.kag.variable.sf.auto_ruby_store.find(it => it.ruby == rubytargetText);

      // ルビオブジェクトを取得できた場合
      if(ruby){

        // ルビ取得
        text = ruby.text;

      }

    }
    
    // 戻り値の設定
    return text;

  }
  
  /********************************************************************************
   * バックログ調整
   * 
   * ※log_join: "true", の方式へ変更したためコメントアウト
   *
   * @since 2024/11/11
   * @author Kei Yusu
   * 
   *********************************************************************************/
  // const adjustBackLog = () => {

  //   // バックログそ使用しない場合は終了
  //   if(TYRANO.kag.config.maxBackLogNum == 0) return;

  //   // バックログ停止中の場合は終了
  //   if(TYRANO.kag.stat.log_write == false) return;

  //   // ルビ対象テキストの前後のバックログを取得
  //   const backlogs = [
  //     TYRANO.kag.variable.tf.system.backlog[TYRANO.kag.variable.tf.system.backlog.length-3],
  //     TYRANO.kag.variable.tf.system.backlog[TYRANO.kag.variable.tf.system.backlog.length-2],
  //     TYRANO.kag.variable.tf.system.backlog[TYRANO.kag.variable.tf.system.backlog.length-1]
  //   ]

  //   // 取得したバックログ数文ループ
  //   const joinBackLog = backlogs.reduce((accum, it, index) => {

  //     // インデックスを判断
  //     switch(index){

  //       // ツールチップ対象テキストの前の場合
  //       case 0:

  //         // 行頭でない場合
  //         if(TYRANO.kag.variable.tf.auto_ruby_cache_is_head == false){

  //           // ログ取得
  //           accum += it;

  //         }

  //         // 終了
  //         break;

  //       // ツールチップ対象テキストの場合
  //       case 1:

  //         // 行頭の場合
  //         if(TYRANO.kag.variable.tf.auto_ruby_cache_is_head == true){

  //           // ログ取得
  //           accum += it;

  //         // 行頭でない場合
  //         } else {

  //           // キャラ名で分割
  //           const logs = it.split("：");

  //           // ログ取得
  //           accum += logs.length >= 2 ? logs[1] : it;

  //         }

  //         // 終了
  //         break;

  //       // ツールチップ対象テキストの後ろの場合
  //       case 2:

  //         // キャラ名で分割
  //         const logs = it.split("：");

  //         // ログ取得
  //         accum += logs.length >= 2 ? logs[1] : it;

  //         // 終了
  //         break;

  //     }

  //     // 戻り値の設定
  //     return accum;

  //   }, "");

  //   // 行頭フラグをキャッシュ（行頭の場合）
  //   if(TYRANO.kag.variable.tf.auto_ruby_cache_is_head == true){

  //     // 改行付バックログを削除
  //     TYRANO.kag.variable.tf.system.backlog.splice(TYRANO.kag.variable.tf.system.backlog.length - 2, 2);

  //   // 行頭でない場合
  //   } else {

  //     // 改行付バックログを削除
  //     TYRANO.kag.variable.tf.system.backlog.splice(TYRANO.kag.variable.tf.system.backlog.length - 3, 3);

  //   }

  //   // 改行を削除したバックログを追加
  //   TYRANO.kag.variable.tf.system.backlog.push(joinBackLog);

  // }

})();