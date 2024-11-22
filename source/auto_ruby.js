/********************************************************************************
 * 自動ルビティラノスクリプトプラグイン ver1.1.0
 *
 * @since 2024/11/11
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
   * @since 2024/11/11
   * @author Kei Yusu
   * 
   *********************************************************************************/
  const srb = {
    kag: TYRANO.kag,
    vital: [],
    pm: {
      text: "",
    },
    start : function(pm) {

      // 親エレメントとルビをキャッシュ      
      TYRANO.kag.variable.tf.auto_ruby_cache_parent = TYRANO.kag.setMessageCurrentSpan();
      TYRANO.kag.variable.tf.auto_ruby_cache_ruby_text = pm.text;

      // 親エレメントの直前のエレメントを取得
      const prevElem = $(TYRANO.kag.variable.tf.auto_ruby_cache_parent).prev();

      // 直前のエレメントが空白でなく、親エレメントが同一階層の場合
      if(prevElem.length && prevElem.text() != "" && prevElem.parent().is($(TYRANO.kag.variable.tf.auto_ruby_cache_parent).parent())){

        // 行頭フラグをキャッシュ（行頭でない）
        TYRANO.kag.variable.tf.auto_ruby_cache_is_head = false;

      // 上記以外の場合（行頭の場合）
      }else{

        // 行頭フラグをキャッシュ（行頭）
        TYRANO.kag.variable.tf.auto_ruby_cache_is_head = true;

      }

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
   * @since 2024/11/11
   * @author Kei Yusu
   * 
   *********************************************************************************/
  const erb = {
    kag: TYRANO.kag,
    vital: [],
    pm: {},
    start : function(pm) {

      // 親オブジェクトキャッシュが存在する場合
      if(TYRANO.kag.variable.tf.auto_ruby_cache_parent){
        
        // ルビ対象文字列取得
        const rubyTargetChars = TYRANO.kag.variable.tf.auto_ruby_cache_parent.children('span');

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

        // ルビ対象文字列にルビを付加して追加
        $(rubyTargetChars).append(`<ruby class='auto_ruby'>${rubytargetText}<rt class='auto_rt' ${style}>${rubyText}</rt></ruby>`)
        
      }

      // 次のタグへ
      this.kag.ftag.nextOrder();

      // 親オブジェクトキャッシュが存在する場合
      if(TYRANO.kag.variable.tf.auto_ruby_cache_parent){

        // バックログ調整
        adjustBackLog();

        // キャッシュクリア
        TYRANO.kag.variable.tf.auto_ruby_cache_parent = undefined;
        TYRANO.kag.variable.tf.auto_ruby_cache_ruby_text = "";
        TYRANO.kag.variable.tf.auto_ruby_cache_is_head = false;

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
   * @since 2024/11/11
   * @author Kei Yusu
   * 
   *********************************************************************************/
  const adjustBackLog = () => {

    // バックログそ使用しない場合は終了
    if(TYRANO.kag.config.maxBackLogNum == 0) return;

    // バックログ停止中の場合は終了
    if(TYRANO.kag.stat.log_write == false) return;

    // ルビ対象テキストの前後のバックログを取得
    const backlogs = [
      TYRANO.kag.variable.tf.system.backlog[TYRANO.kag.variable.tf.system.backlog.length-3],
      TYRANO.kag.variable.tf.system.backlog[TYRANO.kag.variable.tf.system.backlog.length-2],
      TYRANO.kag.variable.tf.system.backlog[TYRANO.kag.variable.tf.system.backlog.length-1]
    ]

    // 取得したバックログ数文ループ
    const joinBackLog = backlogs.reduce((accum, it, index) => {

      // インデックスを判断
      switch(index){

        // ツールチップ対象テキストの前の場合
        case 0:

          // 行頭でない場合
          if(TYRANO.kag.variable.tf.auto_ruby_cache_is_head == false){

            // ログ取得
            accum += it;

          }

          // 終了
          break;

        // ツールチップ対象テキストの場合
        case 1:

          // 行頭の場合
          if(TYRANO.kag.variable.tf.auto_ruby_cache_is_head == true){

            // ログ取得
            accum += it;

          // 行頭でない場合
          } else {

            // キャラ名で分割
            const logs = it.split("：");

            // ログ取得
            accum += logs.length >= 2 ? logs[1] : it;

          }

          // 終了
          break;

        // ツールチップ対象テキストの後ろの場合
        case 2:

          // キャラ名で分割
          const logs = it.split("：");

          // ログ取得
          accum += logs.length >= 2 ? logs[1] : it;

          // 終了
          break;

      }

      // 戻り値の設定
      return accum;

    }, "");

    // 行頭フラグをキャッシュ（行頭の場合）
    if(TYRANO.kag.variable.tf.auto_ruby_cache_is_head == true){

      // 改行付バックログを削除
      TYRANO.kag.variable.tf.system.backlog.splice(TYRANO.kag.variable.tf.system.backlog.length - 2, 2);

    // 行頭でない場合
    } else {

      // 改行付バックログを削除
      TYRANO.kag.variable.tf.system.backlog.splice(TYRANO.kag.variable.tf.system.backlog.length - 3, 3);

    }

    // 改行を削除したバックログを追加
    TYRANO.kag.variable.tf.system.backlog.push(joinBackLog);

  }

})();