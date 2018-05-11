
var captcha_st = {
    url: {
        iframe: "https://h5.360buyimg.com/jcap/html/captchaStorage.html",
        report: "//jcapmonitor.m.jd.com/web_jcap_report",
        img: "//h5.360buyimg.com/jcap/img/",
        js: "//h5.360buyimg.com/jcap/js/",
        fp: "/cgi-bin/api/fp",
        refresh: "/cgi-bin/api/refresh",
        check: "/cgi-bin/api/check",
        v: 20180110
    },
    setting: {
        interfaceId: "",
        interfaceName: "",
        captcha_storage: {},
        languageMap: {
            "zh": 1,
            "en": 3,
            "ru": 5,
            "es": 6
        },
        langKey: ""
    },
    lang: {
        3: {
            code_1: "Confirm registration",
            code_2: "Performing security verification",
            code_3: "Incorrect security code",
            code_4: "Please enter the security code",
            code_5: "Verification",
            code_6: "OK",
            code_7: "Loading",
            code_8: "Click on：",
            code_9: "Swipe along the arrow in the image",
            code_10: "Complete verification",
            code_11: "Refresh",
            code_12: "Submit",
            code_13: "Verification complete",
            code_14: "Verification failed",
            code_15: "Verification failed",
            code_16: "Incorrect code entered. Please try again.",
            code_17: "This OTP has expired. Please request for a new OTP.",
            code_18: "Could not refresh code",
            code_19: "Shapes did not match. Please try again.",
            code_20: "Swipe right",
            code_21: "Verification complete",
            code_22: "Verification failed",
            code_23: "Verifying",
            code_24: "Server Error"
        },
        1: {
            code_1: "点击完成验证",
            code_2: "安全检测中",
            code_3: "验证码类型不匹配",
            code_4: "请输入验证码",
            code_5: "安全验证",
            code_6: "确定",
            code_7: "加载中",
            code_8: "请点击上图中的：",
            code_9: "请按照箭头路线滑动手指",
            code_10: "完成验证",
            code_11: "重新发送",
            code_12: "提交",
            code_13: "验证成功",
            code_14: "验证失败，请重新验证",
            code_15: "验证错误请重试",
            code_16: "验证码输入错误，请重新输入",
            code_17: "短信验证码已过期,请重新发送",
            code_18: "刷新验证码失败",
            code_19: "轨迹不一致，请重试",
            code_20: "拖动滑块向右滑动",
            code_21: "滑动验证成功",
            code_22: "滑动验证失败",
            code_23: "滑动验证中",
            code_24: "服务器异常"
        },
        5: {
            code_1: "Подтверждение регистрации",
            code_2: "Выполняется проверка безопасности",
            code_3: "Неверный код подтверждения",
            code_4: "Пожалуйста, введите код проверки.",
            code_5: "Проверка безопасности",
            code_6: "OK",
            code_7: "Идет загрузка…",
            code_8: "Нажмите на：",
            code_9: "Проведите по стрелке на экране",
            code_10: "Проверка успешно завершена.",
            code_11: "Обновить",
            code_12: "Отправить",
            code_13: "Проверка успешно завершена.",
            code_14: "Неверно!",
            code_15: "Неверно!",
            code_16: "Ошибка: Неверный код подтверждения. Пожалуйста, попробуйте еще раз.",
            code_17: "Истек срок действия кода подтверждения. Пожалуйста, запросите новый.",
            code_18: "Не удалось обновить код.",
            code_19: "Ошибка! Повторите попытку еще раз.",
            code_20: "Перетащите ползунок вправо.",
            code_21: "Проверка успешно завершена.",
            code_22: "Не удалось выполнить проверку.",
            code_23: "Идет проверка",
            code_24: "Ошибка сервера"
        },
        6: {
            code_1: "Haga clic para la verificación",
            code_2: "Seguridad Inspeccionando",
            code_3: "Hay un error, inténtalo de nuevo",
            code_4: "Introduce el código de verificación",
            code_5: "Verificación ",
            code_6: "OK",
            code_7: "Cargando",
            code_8: "Haz clic：",
            code_9: "Desliza el dedo sobre la ruta indicada",
            code_10: "Acabado",
            code_11: "Enviar de nuevo",
            code_12: "Enviar",
            code_13: "Verificado con éxito",
            code_14: "Inténtalo de nuevo",
            code_15: "Inténtalo de nuevo",
            code_16: "Código falso, revísalo por favor",
            code_17: "Código caducado, enviarlo de nuevo",
            code_18: "Error en actualizar el código",
            code_19: "Las trayectorias no coinciden, inténtalo de nuevo",
            code_20: "Arrastra el deslizador a verificar",
            code_21: "Verificado con éxito",
            code_22: "Error en la verificación por deslizador",
            code_23: "Verificando",
            code_24: "Error de Servidor"
        }
    }
}
var me = this;

export function captcha(option, info) {
    var tdat_code = info.tdat_version;
    var host = "//" + info.host;
    var firstStep = 0; //第一次验证来源：1.clickCaptcha;2.inputCaptcha;3.touchCaptcha
    captcha_st.setting.langKey = option.language;
    var language = captcha_st.lang[captcha_st.setting.langKey || "1"];
    var clickBtnDes = language.code_1;
    var st = ""; //token
    var context;
    var array_paint = [];
    var m_down = false; //判断鼠标是否按下
    var xy_list = [];
    var lastTime = 0;
    var fp_req = true;  //fp refresh 请求失败16802，只重新请求一次
    var oW = 0;
    var oLeft = 0;
    var JCap = {};
    init();

    //初始化，引入zepto回调加载loading
    function init() {
        jcapUtil.removeStorage("touche_message");
        if ($captcha("#captchaIframe").length == 0) {
            loadIframe(captcha_st.url.iframe);
        }
    };

    function loadIframe(src) {
        var iframe = document.createElement('iframe');
        var head = document.getElementsByTagName('html')[0];
        iframe.id = "captchaIframe";
        iframe.style.display = "none";
        iframe.src = src;
        iframe.onload = iframe.onreadystatechange = function () {
            if (!iframe.readyState || /loaded|complete/.test(iframe.readyState)) {
                iframe.onload = iframe.onreadystatechange = null;
                if (option.display != "popup") {
                    getCaptchaType();
                    bindEvent();
                }
            }
        }
        head.appendChild(iframe);
    }

    function bindEvent() {
        $captcha(document).off('click', '#captcha_img').on('click', '#captcha_img', function () {
            getRefresh();
        });
        $captcha(document).off('click', '#load-error').on('click', '#load-error', function () {
            getRefresh();
        });
        $captcha(document).off('input', '#captcha_dom #captcha-input').on('input', '#captcha_dom #captcha-input', function () {
            var value = $captcha("#captcha-input").val();
            if (value.length == 0) {
                $captcha("#captcha-error-msg").html("&nbsp");
                $captcha("#sure").attr("class", "sure");
            } else {
                $captcha("#sure").attr("class", "sure active");
            }

        });
        $captcha(document).off('change', '.embedInputCaptcha #captcha-input').on('change', '.embedInputCaptcha #captcha-input', function () {
            if ($captcha(this).prop('comStart')) return; // 中文输入过程中不截断
            var value = $captcha("#captcha-input").val();
            if (value.length >= 4) {
                var code = $captcha("#captcha-input").val();
                setTimeout(function () {
                    checkCaptcha(code, checkEmbedInputCallback);
                }, 100);
            }
        });
        $captcha(document).off('click', '#captcha_dom #send_code').on('click', '#captcha_dom #send_code', function () {
            if (!$captcha(this).hasClass("disable")) {
                getRefresh();
            }

        });
        $captcha(document).off('click', '#captcha_dom #cancel').on('click', '#captcha_dom #cancel', function () {
            hideSecondCaptcha("inputCaptcha");
            captchaInit();
        });
        $captcha(document).off('click', '.input_captcha #sure').on('click', '.input_captcha #sure', function () {
            if ($captcha(this).hasClass("active")) {
                var code = $captcha("#captcha-input").val();
                checkCaptcha(code, checkInputCallback);
            }

        });
        $captcha(document).off('click', '.downlink_captcha #sure').on('click', '.downlink_captcha #sure', function () {
            if ($captcha(this).hasClass("active")) {
                var code = $captcha("#captcha-input").val();
                checkCaptcha(code, checkdownlinkCallback);
            }
        });
        $captcha(document).off('click', '.uplink_captcha #sure').on('click', '.uplink_captcha #sure', function () {
            if ($captcha(this).hasClass("active")) {
                checkCaptcha("", checkUplinkCallback);
            }
        });
        $captcha(document).off('click', '#captcha_verify').on('click', '#captcha_verify', function (event) {
            if (option.sessionId == jcapUtil.getStorage("captcha_sid")) {
                JCap.reset(option.sessionId);
            }
            var eventListener = option.eventListener ? option.eventListener() : true;
            if (!eventListener) {
                return false;
            }
            if (!$captcha(this).hasClass("success")) {
                $captcha("#captcha_logo").prop("src", captcha_st.url.img + "loading.gif");
                $captcha("#captcha_txt").html(language.code_2);
                setTimeout(function () {
                    if ($captcha("#captcha_dom").length > 0) {
                        $captcha("#captcha_dom").show();
                    } else {
                        checkCaptcha("", clickCaptchaCallback);
                    }
                }, 10);
            }
            return false;
        });
        $captcha(document).off('click', '#captcha_dom .close').on('click', '#captcha_dom .close', function () {
            hideSecondCaptcha();
            captchaInit();
        });
        $captcha(document).off('click', '#captcha_dom #captcha_drop').on('click', '#captcha_dom #captcha_drop', function () {
            hideSecondCaptcha();
            captchaInit();
        });
        $captcha(document).off('click', '.cp_captcha .jcap_refresh').on('click', '.cp_captcha .jcap_refresh', function () {
            var lineHeight = $captcha("#cpc_img").height();
            $captcha("#captcha_dom .img_loading").css("lineHeight", lineHeight + "px").show();
            $captcha("#captcha_dom .small-drop").show();
            setTimeout(function () {
                getRefresh();
            }, 50);
        });
        $captcha(document).off('click', '.siding_track_captcha .jcap_refresh').on('click', '.siding_track_captcha .jcap_refresh', function () {
            var lineHeight = $captcha("#st_img").height();
            $captcha("#captcha_dom .img_loading").css("lineHeight", lineHeight + "px").show();
            $captcha("#captcha_dom .small-drop").show();
            setTimeout(function () {
                getRefresh();
            }, 50);
        });
        $captcha(document).off('click', '#captcha_dom #cpc_img').on('click', '#captcha_dom #cpc_img', function (event) {
            $captcha(".click_icon")[0].style.top = event.offsetY - 22 + "px";
            $captcha(".click_icon")[0].style.left = event.offsetX - 10 + "px";
            $captcha(".click_icon").show();
            setTimeout(function () {
                var data = {};
                data.ht = $captcha('#captcha_dom #cpc_img').height();
                data.wt = $captcha('#captcha_dom #cpc_img').width();
                data.x = event.offsetX;
                data.y = event.offsetY;
                checkCaptcha(data, clickStepCaptchaCallback);
            }, 50);
            event.stopPropagation();
            event.preventDefault();
        });

        $captcha(document).off('touchstart', '#st_img').on('touchstart', '#st_img', function (event) {
            if ($captcha("#captcha_canvas").length == 0) {
                $captcha("body").append("<canvas id='captcha_canvas' width=" + $captcha(window).width() + " height=" + $captcha(window).height() + " style='position: fixed;top:0;right:0;left:0;bottom:0;px;z-index: 10001;pointer-events: none;'>您当前的版本不支持       </canvas>");
            }
            initCanvas(event);
            lastTime = new Date().getTime();
            draw(event);
        });
        $captcha(document).off('touchmove', '#st_img').on('touchmove', '#st_img', function (event) {
            if (array_paint.length > 400) {
                m_down = false;
                array_paint = [];
                xy_list = [];
                $captcha("#captcha_canvas").remove();
            } else if (m_down) {
                draw(event);
            }

        });
        $captcha(document).off('touchend', '#st_img').on('touchend', '#st_img', function (event) {
            m_down = false;
            var requestData = getElemPos($captcha("#st_img")[0]);
            requestData.ht = $captcha('#captcha_dom #st_img').height();
            requestData.wt = $captcha('#captcha_dom #st_img').width();
            requestData.list = xy_list;
            array_paint = [];
            xy_list = [];
            $captcha("#captcha_canvas").remove();
            checkCaptcha(requestData, sidingTrackCaptchaCallback);

        });
        $captcha(document).off('click', '#captcha_error').on('click', '#captcha_error', function (event) {
            $captcha("#captcha_logo").prop("src", captcha_st.url.img + "loading.gif");
            $captcha("#captcha_txt").html(language.code_2);
            setTimeout(function () {
                getCaptchaType();
            }, 10);
            return false;
        });

        $captcha('#captcha_drag #btn').off('touchstart').on('touchstart', function (e) {
            if (!$captcha(this).hasClass("button-suc")) {
                $captcha("#captcha_drag .label .desc").html(language.code_23);
                $captcha("#captcha_drag .touch-img").attr("src", captcha_st.url.img + "right-white.png");
                var touches = e.touches[0];
                var sdf = $captcha("#captcha_drag #btn");
                oW = touches.clientX - $captcha("#captcha_drag #btn")[0].offsetLeft;
                $captcha("#captcha_drag #btn").attr("class", "button");
                $captcha("#captcha_drag #track").attr("class", "track");

                lastTime = new Date().getTime();
                xy_list.push([e.touches[0].clientX, e.touches[0].clientY, new Date().getTime() - lastTime]);
            }
            e.preventDefault();
        });
        $captcha('#captcha_drag #btn').off('touchmove').on('touchmove', function (e) {
            if (!$captcha(this).hasClass("button-suc")) {
                var touches = e.touches[0];
                oLeft = touches.clientX - oW;
                if (oLeft < 0) {
                    oLeft = 0;
                } else if (oLeft > $captcha("#captcha_drag")[0].clientWidth - $captcha("#btn")[0].offsetWidth) {
                    oLeft = ($captcha("#captcha_drag")[0].clientWidth - $captcha("#btn")[0].offsetWidth);
                }
                var adsfas = $captcha("#captcha_drag #btn");
                $captcha("#captcha_drag #btn")[0].style.left = oLeft + "px";
                $captcha("#captcha_drag #track")[0].style.width = oLeft + "px";

                xy_list.push([e.touches[0].clientX, e.touches[0].clientY, new Date().getTime() - lastTime]);
                lastTime = new Date().getTime();
            }
            e.preventDefault();
        });
        $captcha('#captcha_drag #btn').off('touchend').on('touchend', function (e) {
            if (!$captcha(this).hasClass("button-suc")) {
                var eventListener = option.eventListener ? option.eventListener() : true;
                if (oLeft >= ($captcha("#captcha_drag #slider")[0].clientWidth - $captcha("#captcha_drag #btn")[0].clientWidth - 2) && eventListener) {
                    if ($captcha("#captcha_dom").length > 0) {
                        $captcha("#captcha_dom").show();
                    } else {
                        var requestData = getElemPos($captcha("#captcha_drag")[0]);
                        requestData.ht = $captcha("#captcha_drag").height();
                        requestData.wt = $captcha("#captcha_drag").width();
                        requestData.list = xy_list;
                        checkCaptcha(requestData, dragCaptchaCallback);
                    }

                } else {
                    $captcha("#captcha_drag #btn").attr("class", "button-on");
                    $captcha("#captcha_drag #track").attr("class", "track-on");
                    $captcha("#captcha_drag .label .desc").html(language.code_20);
                    $captcha("#captcha_drag #btn")[0].style.left = 0;
                    $captcha("#captcha_drag #track")[0].style.width = 0;
                    $captcha("#captcha_drag .track-on div").attr("class", "bg-blue");
                    $captcha("#captcha_drag .button-err").attr("class", "button-on");
                    $captcha("#captcha_drag .touch-img").attr("src", captcha_st.url.img + "right-black.png");
                }
                xy_list = [];
            }
            e.preventDefault();
        });
        //滑动拼图验证码-Start
        $captcha(document).off('touchstart', '.captcha_jigsaw #btn').on('touchstart', '.captcha_jigsaw #btn', function (e) {
            if (!$captcha(this).hasClass("button-suc")) {
                $captcha(".captcha_jigsaw .label .desc").html("滑动验证中");
                $captcha(".captcha_jigsaw .touch-img").attr("src", captcha_st.url.img + "right-white.png");
                var touches = e.touches[0];
                var sdf = $captcha(".captcha_jigsaw #btn");
                oW = touches.clientX - $captcha(".captcha_jigsaw #btn")[0].offsetLeft;
                $captcha(".captcha_jigsaw #btn").attr("class", "button");
                $captcha(".captcha_jigsaw #track").attr("class", "track");
                $captcha(".captcha_jigsaw #drag_img").attr("class", "drag_img");
                lastTime = new Date().getTime();
                xy_list.push([e.touches[0].clientX, e.touches[0].clientY, new Date().getTime() - lastTime]);
            }
        });
        $captcha(document).off('touchmove', '.captcha_jigsaw #btn').on('touchmove', '.captcha_jigsaw #btn', function (e) {
            if (!$captcha(this).hasClass("button-suc")) {
                var touches = e.touches[0];
                oLeft = touches.clientX - oW;
                if (oLeft < 0) {
                    oLeft = 0;
                } else if (oLeft > $captcha(".jigsaw_group")[0].clientWidth - $captcha(".captcha_jigsaw #btn")[0].offsetWidth) {
                    oLeft = ($captcha(".jigsaw_group")[0].clientWidth - $captcha(".captcha_jigsaw #btn")[0].offsetWidth);
                }
                var adsfas = $captcha(".captcha_jigsaw #btn");
                $captcha(".captcha_jigsaw #btn")[0].style.left = oLeft + "px";
                $captcha(".captcha_jigsaw #track")[0].style.width = oLeft + "px";
                var btn_left = $captcha(".captcha_jigsaw .jigsaw_img").width() - $captcha(".captcha_jigsaw #btn").width();
                var drag_img_left = $captcha(".captcha_jigsaw .jigsaw_img").width() - $captcha(".captcha_jigsaw #drag_img").width();
                var bili = drag_img_left / (btn_left);
                $captcha("#drag_img")[0].style.left = bili * oLeft + "px";
                xy_list.push([e.touches[0].clientX, e.touches[0].clientY, new Date().getTime() - lastTime]);
                lastTime = new Date().getTime();
            }

        });
        $captcha(document).off('touchend', '.captcha_jigsaw #btn').on('touchend', '.captcha_jigsaw #btn', function (e) {
            if (!$captcha(this).hasClass("button-suc")) {
                if (oLeft >= ($captcha(".captcha_jigsaw #slider")[0].clientWidth - $captcha(".captcha_jigsaw #btn")[0].clientWidth - 2)) {
                    $captcha(".captcha_jigsaw #btn").css.left = (document.documentElement.clientWidth - $captcha(".captcha_jigsaw #btn")[0].offsetWidth - 17);
                    $captcha(".captcha_jigsaw #track").css.width = (document.documentElement.clientWidth - $captcha(".captcha_jigsaw #track")[0].offsetWidth - 17);
                    $captcha(".captcha_jigsaw #oIcon").hide();
                    $captcha(".captcha_jigsaw #oSpinner").show();
                    $captcha(".captcha_jigsaw .track div").attr("class", "bg-green");
                    $captcha(".captcha_jigsaw .button").attr("class", "button-suc");
                    $captcha(".captcha_jigsaw .touch-img").attr("src", captcha_st.url.img + "touch-success.png");
                    $captcha(".captcha_jigsaw .label .desc").html("滑动验证成功");
                    $captcha(".captcha_jigsaw .jcap_refresh").attr("readonly", "readonly");
                } else {
                    $captcha(".captcha_jigsaw .label .desc").html("没有对齐额，请再来一次~");
                    $captcha(".captcha_jigsaw #btn").attr("class", "button-on");
                    $captcha(".captcha_jigsaw #track").attr("class", "track-on");
                    $captcha(".captcha_jigsaw #drag_img").attr("class", "drag_img_on");
                    $captcha(".captcha_jigsaw .track-on div").attr("class", "bg-red");
                    $captcha(".captcha_jigsaw .button-on").attr("class", "button-err");
                    $captcha(".captcha_jigsaw .touch-img").attr("src", captcha_st.url.img + "touch-error.png");
                    setTimeout(function () {
                        $captcha(".captcha_jigsaw .label .desc").html("拖动滑块填充拼图");
                        $captcha(".captcha_jigsaw #btn")[0].style.left = 0;
                        $captcha(".captcha_jigsaw #track")[0].style.width = 0;
                        $captcha(".captcha_jigsaw #drag_img")[0].style.left = 0;
                        $captcha(".captcha_jigsaw .track-on div").attr("class", "bg-blue");
                        $captcha(".captcha_jigsaw .button-err").attr("class", "button-on");
                        $captcha(".captcha_jigsaw .touch-img").attr("src", captcha_st.url.img + "right-black.png");
                    }, 500);
                }
                xy_list = [];
            }
        });
        //滑动拼图验证码-End
    }

    function noSliding() {
        document.querySelector("#captcha_drop,#captcha_dom").removeEventListener("touchmove", function (event) {
            event.preventDefault();
        }, false);
        document.querySelector("#captcha_drop,#captcha_dom").addEventListener("touchmove", function (event) {
            event.preventDefault();
        }, false);
    }

    //拼接参数，获取一次验证类型，回调captchaCallback（）
    function getCaptchaType() {
        var data = {};
        var now = Date.parse(new Date());
        var len = now % 19;
        data.si = option.sessionId;
        //		encrypt([随机字符串][sessionid长度][sessionid][设备信息][timestamp(ms)])
        data.ct = getEncryptData(captchaRandom(len) + complement(data.si.length, 4) + data.si + getDeviceInfo() + now, getKey());
        data.version = 1;
        captcha_st.setting.interfaceId = 268435458;
        captcha_st.setting.interfaceName = "fp";
        data.lang = option.language;
        jcapUtil.captchaAjax(host + captcha_st.url.fp, data, captchaCallback);
    }

    //1.跨域存储fp；2.创建一次验证码
    function captchaCallback(return_data) {
        st = return_data.st || st;
        if (return_data.code == 0) {
            jcapUtil.setStorage("captcha_fp", return_data.fp);
            jcapUtil.setIframeStorage("captcha_fp", return_data.fp);
            firstStep = return_data.tp;
            createCaptcha(return_data, 1); //1表示一次验证
            fp_req = true;
        } else if ((return_data.code == 16802 || return_data.code == 502) && fp_req) {
            fp_req = false;
            getCaptchaType();
        } else {
            fp_req = true;
            option.onFailure(return_data);
            console.log("获取验证码信息错误");
        }
        jcapUtil.removeStorage("captcha_sid");
    }

    //根据tp判断创建验证码的类型
    function createCaptcha(return_data, number) {
        switch (return_data.tp) {
            //文本输入验证码
            case 1:
                if (number == 1 && option.display != "popup") {
                    embedInputCaptcha(return_data);
                } else {
                    inputCaptcha(return_data);
                }
                break;
            //点选局部
            case 2:
                clickPictureCaptcha(return_data);
                break;
            //滑动轨迹验证码
            case 3:
                sidingTrackCaptcha(return_data);
                break;
            //滑动拼图验证码 by whh
            case 4:
                jigsawCaptcha(return_data);
                break;
            //滑动
            case 5:
                dragCaptcha(return_data);
                break;
            //点击
            case 6:
                //clickCaptcha(return_data);
                if (number == 1 && option.display != "popup") {
                    clickCaptcha(return_data);
                } else {
                    option.onFailure({
                        code: "10",
                        message: language.code_3
                    });
                }
                break;
            //上行
            case 7:
                uplinkCaptcha(return_data);
                break;
            //下行
            case 8:
                downlinkCaptcha(return_data);
                break;
        }
    };

    //图片输入验证码
    function inputCaptcha(return_data) {
        var captcha_img = $captcha.parseJSON(return_data.img);
        captcha_img = captcha_img.b1;
        var closeBtn = option.closeBtn ? option.closeBtn.display : true;
        $captcha("#captcha_dom").remove();
        var div = "<div id='captcha_dom' class='input_captcha'><div id='captcha_drop' class='captcha_drop'></div><div id='captcha'><icon class='close' style=display:" + (closeBtn || closeBtn == undefined ? "black" : "none") + "/>" +
            "<div class='captcha_header'>" + language.code_5 + "</div>" +
            "<div id='captcha_body'>" +
            "<div id='captcha_image_group'>" +
            "<input id='captcha-input' type='text' placeholder=" + language.code_4 + " />" +
            "<img id='captcha_img' src=" + captcha_img + ">" +
            "<img id='load-error' src=" + captcha_st.url.img + "/load-error.png>"

            + "</div>" +
            "<div id='captcha-error-msg' class='captcha-error-msg'>&nbsp</div>" +
            "</div>"

            +
            "<footer>" +
            //		"<button id='cancel' class='cancel'>取消</button>" +
            "<button id='sure' class='sure'>" + language.code_6 + "</button>" +
            "</footer>" +
            "</div></div>";
        $captcha("body").append(div);
        noSliding();
        option.onLoad();
    };

    function embedInputCaptcha(return_data) {
        var captcha_img = $captcha.parseJSON(return_data.img);
        captcha_img = captcha_img.b1;
        $captcha("#captcha").remove();
        var div = "<div id='captcha' class='embedInputCaptcha'>" +
            "<input id='captcha-input' style='line-height:normal;height:" + option.height + "px;' type='text' placeholder=" + language.code_4 + " />" +
            "<img id='captcha_img' style='height:" + option.height + "px' src=" + captcha_img + ">" +
            "</div>";
        $captcha(option.element).append(div);
        option.onLoad();
    };

    //图中点选验证码
    function clickPictureCaptcha(return_data) {
        var captcha_img = $captcha.parseJSON(return_data.img);
        captcha_img_b1 = captcha_img.b1;
        captcha_img_b2 = captcha_img.b2;
        var closeBtn = option.closeBtn ? option.closeBtn.display : true;
        $captcha("#captcha_dom").remove();
        var div = "<div id='captcha_dom' class='cp_captcha'>" +
            "<div id='captcha_drop' class='captcha_drop'></div>" +
            "<div id='captcha'>" +
            "<div class='captcha_header'>" + language.code_5 + "<div class='jcap_refresh'><img class='icono-reset' src ='" + captcha_st.url.img + "/refresh.png' /></div></div>" +
            "<div id='captcha_body'>" +
            "<div class='big_img'><div class='img_loading'>" + language.code_7 + "...</div><img id='cpc_img' src='" + captcha_img_b1 + "'>" +
            "<img class='click_icon' src='" + captcha_st.url.img + "/pop.png'>" +
            "</div>" +
            "<div class='cpc_group'>" +
            "<div class='sp_msg'>" + language.code_8 + "</div>" +
            "<div class='pcp_refresh'>" +
            "<div><div class='small-drop'></div><img class='pcp_showPicture' src='" + captcha_img_b2 + "'/></div>" +
            //			"<div class='jcap_refresh'><img class='icono-reset' src ='" + captcha_st.url.img + "/refresh.png' /></div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        $captcha("body").append(div);
        noSliding();
        option.onLoad();
    }

    //滑动轨迹验证码
    function sidingTrackCaptcha(return_data) {
        var captcha_img = $captcha.parseJSON(return_data.img);
        captcha_img_b1 = captcha_img.b1;
        captcha_img_b2 = captcha_img.b2;
        var closeBtn = option.closeBtn ? option.closeBtn.display : true;
        $captcha("#captcha_dom").remove();
        var div = "<div id='captcha_dom' class='siding_track_captcha'>" +
            "<div id='captcha_drop' class='captcha_drop'></div>" +
            "<div id='captcha'>" +
            "<div class='captcha_header'>" + language.code_5 + "<div class='jcap_refresh'><img class='icono-reset' src ='" + captcha_st.url.img + "/refresh.png' /></div></div>" +
            "<div id='captcha_body'>" +
            "<div class='big_img'><div class='img_loading'>" + language.code_7 + "...</div><img id='st_img' class='siding_track' src='" + captcha_img_b1 + "'>" +
            "</div>" +
            "<div class='cpc_group'>" +
            "<div class='sp_msg'>" + language.code_9 + "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        $captcha("body").append(div);
        noSliding();
        option.onLoad();
    }

    //上行短信验证码
    function uplinkCaptcha(return_data) {
        var captcha_img = $captcha.parseJSON(return_data.img);
        captcha_img_b1 = captcha_img.s1;
        var closeBtn = option.closeBtn ? option.closeBtn.display : true;
        $captcha("#captcha_dom").remove();
        var div = "<div id='captcha_dom'>" +
            "<div id='captcha_drop' class='captcha_drop'></div>" +
            "<div id='captcha' class='uplink_captcha'><icon class='close'  style=display:" + (closeBtn || closeBtn == undefined ? "black" : "none") + "/>" +
            "<div class='captcha_header'>" + language.code_5 + "</div>" +
            "<div id='captcha_body'>" +
            "<div class='img_group'>" + captcha_img_b1 + "" +
            "</div>" +
            "<div id='captcha-error-msg' class='captcha-error-msg'>&nbsp</div>" +
            "</div>" +
            "<footer class='up_footer'>" +
            "<button id='sure' class='sure active up_link_btn'>" + language.code_10 + "</button>" +
            "</footer>" +
            "</div>" +
            "</div>";
        $captcha("body").append(div);
        up_count_time();
        noSliding();
        option.onLoad();
    }

    //下行短信验证码
    function downlinkCaptcha(return_data) {
        var captcha_img = $captcha.parseJSON(return_data.img);
        captcha_img = captcha_img.s1;
        var closeBtn = option.closeBtn ? option.closeBtn.display : true;
        $captcha("#captcha_dom").remove();
        var div = "<div id='captcha_dom' class='downlink_captcha'><div id='captcha_drop' class='captcha_drop'></div><div id='captcha'><icon class='close'  style=display:" + (closeBtn || closeBtn == undefined ? "black" : "none") + "/>" +
            "<div class='captcha_header'>" + language.code_5 + "</div>" +
            "<div id='captcha_body'>" +
            "<div id='captcha_group'>" +
            "<div class='captcha-message'>" + captcha_img + "</div>" +
            "<div class='captcha-code-message'><input id='captcha-input' type='text' placeholder=" + language.code_4 + " />" +
            "<button id='send_code'>" + language.code_11 + "</button></div>" +
            "</div>" +
            "<div id='captcha-error-msg' class='captcha-error-msg'>&nbsp</div>" +
            "</div>" +
            "<footer>" +
            "<button id='sure' class='sure'>" + language.code_12 + "</button>" +
            "</footer>" +
            "</div></div>";
        $captcha("body").append(div);
        countTime();
        noSliding();
        option.onLoad();
    }

    //一次点击验证码
    function clickCaptcha(return_data) {
        var div = "<div id='captcha_verify' class='verify' style='height:" + option.height + "px;'> " +
            "<img id='captcha_logo' src='" + captcha_st.url.img + "init.gif' class='' style='padding-top:" + (option.height - 24) / 2 + "px;'> " +
            "<span id='captcha_txt' class='txt' style='line-height:" + option.height + "px;'>" + clickBtnDes + "</span>" +
            "</div>";
        $captcha(option.element).html(div);
        option.onLoad();
    }

    //滑动
    function dragCaptcha(return_data) {
        var div = "<div id='captcha_drag'>" +
            "<div class='slider' id='slider'>" +
            "<div class='label' style='line-height: " + option.height + "px;'><div class='desc'>" + language.code_20 + "</div></div>" +
            "<div class='track-on' id='track'>" +
            "<div class='bg-blue'></div>" +
            "</div>" +
            "<div class='button-on' id='btn' style='height: " + option.height + "px;width: " + option.height + "px;'>" +
            "<img class='touch-img' src='" + captcha_st.url.img + "right-black.png'>" +
            "</div>" +
            "</div>" +
            "</div>";
        $captcha(option.element).html(div);
        option.onLoad();
    }

    //下行短信发送倒计时
    function countTime() {
        $captcha('#send_code').html(language.code_11 + "(120s)").addClass('disable');
        var count = 120;
        var d = new Date().getTime();
        var e = setInterval(function () {
            var f = parseInt((new Date().getTime() - d) / 1000);
            if (f < count) {
                $captcha('#send_code').html(language.code_11 + '(' + (count - f) + 's)');
            } else {
                $captcha('#send_code').html(language.code_11);
                $captcha('#send_code').removeClass('disable');
                clearInterval(e)
            }
        }, 1000)
    }

    //上行短信发送倒计时
    function up_count_time() {
        var count = 120;
        var d = new Date().getTime();
        var e = setInterval(function () {
            var f = parseInt((new Date().getTime() - d) / 1000);
            if (f < count) {
                $captcha('.up_count_time').html(count - f);
            } else {

                clearInterval(e)
            }
        }, 1000)
    }

    //滑动拼图验证码【type=4】
    function jigsawCaptcha(return_data) {
        // var captcha_img = $captcha.parseJSON(return_data.img);
        // captcha_img_b1 = captcha_img.b1;
        // captcha_img_b2 = captcha_img.b2;
        var captcha_img_b1 = "http://beta-jcap.m.jd.com/jcap/img/c70a6a53c8bc4af2bc355a3f2705ff78.jpg";
        var captcha_img_b2 = "http://beta-jcap.m.jd.com/jcap/img/3be108b848794fb284017d1d1ceba52f.png";
        var closeBtn = option.closeBtn ? option.closeBtn.display : true;
        $captcha("#captcha_dom").remove();
        var div = "<div id='captcha_dom' class='captcha_jigsaw'><div id='captcha_drop' class='captcha_drop'></div>" +
            "<div id='captcha'>" +
            "<div class='captcha_header'>" + language.code_5 + "<div class='jcap_refresh'><img class='icono-reset' src ='" + captcha_st.url.img + "/refresh.png' /></div></div>" +
            "<div id='captcha_body'>" +
            "<div class='big_img'><div class='img_loading'>" + language.code_7 + "...</div>" +
            "<img id='' class='jigsaw_img' src='" + captcha_img_b1 + "'>" +
            "<img id='drag_img' class='drag_img_on' src='" + captcha_img_b2 + "'>" +
            "</div>" +
            "<div class='jigsaw_group'><div class='slider' id='slider'>" +
            "<div class='label'><div class='desc'>拖动滑块填充拼图</div></div>" +
            "<div class='track-on' id='track'><div class='bg-blue'></div></div>" +
            "<div class='button-on' id='btn'><img class='touch-img' src='" + captcha_st.url.img + "right-black.png' /></div>" +
            "</div></div>" +
            "</div>" +
            "</div></div>";
        $captcha("body").append(div);
        noSliding();
        option.onLoad();
    }

    //发送验证码
    function sendCode() {
        var data = {};
        data.si = option.sessionId;
        ;
        data.version = 1;
        data.se = getEncryptData(JSON.stringify({"nonce": captchaRandom(16), "token": st, "sid": option.sessionId}));
        captcha_st.setting.interfaceId = 268435459;
        captcha_st.setting.interfaceName = "refresh";
        data.lang = option.language;
        jcapUtil.captchaAjax(host + captcha_st.url.refresh, data, sendCodeCallback);
    }

    //验证码回调
    function sendCodeCallback(data) {
        st = data.st || st;
        if (data.code == 0) {
            countTime();
        } else {
            $captcha("#captcha-error-msg").html(data.msg);
            option.onFailure(data);
        }
    }

    function hideSecondCaptcha(captcha_type) {
        $captcha("#sure").removeClass("active");
        if ($captcha("#captcha_dom").hasClass("siding_track_captcha")) {
            $captcha(".sp_msg").html(language.code_9);
        } else if ($captcha("#captcha_dom").hasClass("cp_captcha")) {
            $captcha(".sp_msg").html(language.code_8);
        } else if ($captcha("#captcha_dom").hasClass("uplink_captcha")) {
            $captcha("#sure").addClass("active");
        } else if ($captcha("#captcha_dom").hasClass("downlink_captcha")) {

        } else if ($captcha("#captcha_dom").hasClass("input_captcha")) {
            $captcha("#captcha-input").val("");
        }
        $captcha("#captcha-error-msg").html("&nbsp");
        $captcha("#captcha_dom").hide();
        captchaInit();
    }

    function captchaInit() {
        if ($captcha("#captcha_verify").length > 0) {
            clickCaptchaInit();
        }
        if ($captcha("#captcha_drag").length > 0) {
            drapCaptchaInit();
        }

    }

    function clickCaptchaInit() {
        $captcha("#captcha_verify").removeClass("success");
        $captcha("#captcha_logo").prop("src", captcha_st.url.img + "init.gif");
        $captcha("#captcha_txt").html(clickBtnDes);
    }

    function clickCaptchaSuccess() {
        if ($captcha("#captcha_verify").length > 0) {
            $captcha("#captcha_logo").prop("src", captcha_st.url.img + "success.gif");
            $captcha("#captcha_verify").addClass("success");
            $captcha("#captcha_txt").html(language.code_13);
        }
    }

    function clickCaptchaError() {
        if ($captcha("#captcha_verify").length > 0) {
            $captcha("#captcha_logo").prop("src", captcha_st.url.img + "error.png");
            $captcha("#captcha_txt").html(language.code_14);
            setTimeout(function () {
                $captcha("#captcha_logo").prop("src", captcha_st.url.img + "init.gif");
            }, 1000);
        }
    }

    function checkCaptcha(code, callbackName) {
        if (typeof(code) != "string") {
            code = JSON.stringify(code);
        }
        code = encodeURI(code);
        var now = Date.parse(new Date());
        var len = now % 41;
        var data = {};
        data.si = option.sessionId;
        var userMsg = {};
        userMsg.touchList = jcapUtil.getStorage("touche_message");
        data.tk = getEncryptData(now + complement(data.si.length, 4) + data.si + complement(st.length, 4) + st + complement(code.length, 6) + code + JSON.stringify(userMsg) + captchaRandom(len), getKey());
        data.ct = getEncryptData(captchaRandom(now % 19) + complement(data.si.length, 4) + data.si + getDeviceInfo() + now, getKey());
        data.version = 1;
        data.lang = option.language;
        captcha_st.setting.interfaceId = 268435460;
        captcha_st.setting.interfaceName = "check";

        jcapUtil.captchaAjax(host + captcha_st.url.check, data, checkCallback, callbackName);
    }

    function checkCallback(data, secondStepCallback) {
        st = data.st || st;
        if (data.code == 0) {
            if (data.tp) { //等后台确认 没有二次验证的tp值
                createCaptcha(data);
            } else {
                firstStepCallback(data);
                secondStepCallback(data);
                jcapUtil.setStorage("captcha_sid", option.sessionId);
                jcapUtil.removeStorage("touche_message");
                option.onSuccess(data);
            }
        } else {
            secondStepCallback(data);
            option.onFailure(data);
        }
    }

    function clickStepCaptchaCallback(data) {
        if (data.code == 0) {
            $captcha("#captcha_dom").remove();
        } else {
            var lineHeight = $captcha("#cpc_img").height();
            $captcha("#captcha_dom .img_loading").css("lineHeight", lineHeight + "px").show();
            $captcha("#captcha_dom .small-drop").show();
            $captcha(".sp_msg").html("<span>" + language.code_15 + "</span>");
            setTimeout(function () {
                getRefresh();
            }, 10);
        }
        $captcha(".click_icon").hide();
    }

    //
    function sidingTrackCaptchaCallback(data) {
        if (data.code == 0) {
            $captcha("#captcha_dom").remove();
        } else {
            var lineHeight = $captcha("#st_img").height();
            $captcha("#captcha_dom .img_loading").css("lineHeight", lineHeight + "px").show();
            $captcha("#captcha_dom .small-drop").show();
            $captcha(".sp_msg").html("<span>" + language.code_19 + "</span>");
            setTimeout(function () {
                getRefresh();
            }, 10);
        }
        $captcha(".click_icon").hide();
    }

    function dragCaptchaCallback(data) {
        if (data.code == 0) {
            drapCaptchaSuccess();
        } else {
            drapCaptchaError();
        }
    }

    function clickCaptchaCallback(data) {
        if (data.code == 0) {
            clickCaptchaSuccess();
        } else {
            clickCaptchaError();
        }
    }

    function checkInputCallback(data) {
        if (data.code == 0) {
            $captcha("#captcha_dom").remove();
        } else {
            getRefresh();
            $captcha("#captcha-error-msg").html(language.code_16);
        }
    }

    function checkEmbedInputCallback(data) {
        if (data.code == 0) {

        } else {
            getRefresh();
        }
    }

    function checkdownlinkCallback(data) {
        if (data.code == 0) {

        } else {
            $captcha("#captcha-error-msg").html(language.code_16);
        }
    }

    function checkUplinkCallback(data) {
        if (data.code == 0) {

        } else {
            $captcha("#captcha-error-msg").html(language.code_17);
        }
    }

    function captchaRandom(num) {
        var data = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        var result = "";
        for (var i = 0; i < num; i++) { //产生20位就使i<20
            var r = Math.floor(Math.random() * 35); //16为数组里面数据的数量，目的是以此当下标取数组data里的值！
            result += data[r]; //输出20次随机数的同时，让rrr加20次，就是20位的随机字符串了。
        }
        return result;
    }

    function drapCaptchaInit() {
        $captcha("#btn").attr("class", "button-on");
        $captcha("#track").attr("class", "track-on");
        $captcha(".label .desc").html(language.code_20);
        $captcha("#btn")[0].style.left = 0;
        $captcha("#track")[0].style.width = 0;
        $captcha(".track-on div").attr("class", "bg-blue");
        $captcha(".button-err").attr("class", "button-on");
        $captcha(".touch-img").attr("src", captcha_st.url.img + "right-black.png");
    }

    function drapCaptchaError() {
        $captcha(".label .desc").html(language.code_22);
        $captcha("#btn").attr("class", "button-on");
        $captcha("#track").attr("class", "track-on");
        $captcha(".track-on div").attr("class", "bg-red");
        $captcha(".button-on").attr("class", "button-err");
        $captcha(".touch-img").attr("src", captcha_st.url.img + "touch-error.png");
        setTimeout(function () {
            $captcha(".label .desc").html(language.code_20);
            $captcha("#btn")[0].style.left = 0;
            $captcha("#track")[0].style.width = 0;
            $captcha(".track-on div").attr("class", "bg-blue");
            $captcha(".button-err").attr("class", "button-on");
            $captcha(".touch-img").attr("src", captcha_st.url.img + "right-black.png");
        }, 1000);
    }

    function drapCaptchaSuccess() {
        $captcha("#btn").css.left = (document.documentElement.clientWidth - $captcha("#btn")[0].offsetWidth - 17);
        $captcha("#track").css.width = (document.documentElement.clientWidth - $captcha("#track")[0].offsetWidth - 17);
        $captcha("#oIcon").hide();
        $captcha("#oSpinner").show();
        $captcha(".track div").attr("class", "bg-green");
        $captcha(".button").attr("class", "button-suc");
        $captcha(".touch-img").attr("src", captcha_st.url.img + "touch-success.png");
        $captcha(".label .desc").html(language.code_21);
    }

    function firstStepCallback(data) {
        switch (firstStep) {
            case 5:
                if (data.code == 0) {
                    drapCaptchaSuccess();
                } else {
                    drapCaptchaError();
                }
                break;
            case 6:
                if (data.code == 0) {
                    clickCaptchaSuccess();
                } else {
                    clickCaptchaError();
                }
                break;
        }
    }

    function complement(num, n) {
        var len = num.toString().length;
        while (len < n) {
            num = "0" + num;
            len++;
        }
        return num;
    }

    function getRefresh() {
        var data = {};
        var se = {"nonce": captchaRandom(16), "token": st, "sid": option.sessionId};
        data.si = option.sessionId;
        ;
        data.version = 1;
        data.se = getEncryptData(JSON.stringify({"nonce": captchaRandom(16), "token": st, "sid": option.sessionId}));
        captcha_st.setting.interfaceId = 268435459;
        captcha_st.setting.interfaceName = "refresh";
        data.lang = option.language;
        jcapUtil.captchaAjax(host + captcha_st.url.refresh, data, refreshCallback);
    }

    function refreshCallback(return_data) {
        if (return_data.code == 0) {
            st = return_data.st || return_data.st == "" ? return_data.st : st;
            if (return_data.tp == 1) {
                $captcha("#load-error").hide();
                $captcha("#captcha_img").css("display", "inherit");
                var captcha_img = $captcha.parseJSON(return_data.img);
                captcha_img = captcha_img.b1;
                $captcha("#captcha_img").prop("src", captcha_img);
            } else if (return_data.tp == 2) {
                $captcha(".img_loading").html(language.code_7).hide();
                $captcha(".small-drop").hide();
                var captcha_img = $captcha.parseJSON(return_data.img);
                $captcha("#cpc_img").prop("src", captcha_img.b1);
                $captcha(".pcp_showPicture").prop("src", captcha_img.b2);
            } else if (return_data.tp == 3) {
                $captcha(".img_loading").html(language.code_7).hide();
                $captcha(".small-drop").hide();
                var captcha_img = $captcha.parseJSON(return_data.img);
                $captcha("#st_img").prop("src", captcha_img.b1);
            } else if (return_data.tp == 8) {
                countTime();
            }
            fp_req = true;
        } else if ((return_data.code == 16802 || return_data.code == 502) && fp_req) {
            fp_req = false;
            getRefresh();
        } else {
            if ($captcha("#load-error").length > 0) {
                $captcha("#captcha_img").hide();
                $captcha("#load-error").css("display", "inherit");
            }
            fp_req = true;
            option.onFailure(return_data);
            $captcha(".img_loading").length > 0 ? $captcha(".img_loading").html(language.code_18) : "";
            console.log(language.code_18);
        }
    }

    function initCanvas(event) {
        var canvas_ = document.getElementById("captcha_canvas");
        context = canvas_.getContext("2d");
        context.strokeStyle = "#8cd941";
//		context.translate(0.5, 0.5);
        context.lineWidth = 6;
        m_down = true;
    }

    function draw(event) {
        var current_x = event.touches[0].clientX;
        var current_y = event.touches[0].clientY;
        array_paint.push({"x": current_x, "y": current_y});
        xy_list.push([current_x, current_y, new Date().getTime() - lastTime]);
        lastTime = new Date().getTime();
        paint();
    }

    function paint() {
        context.beginPath();
        context.moveTo(array_paint[0].x, array_paint[0].y);
        context.clearRect(0, 0, 2000, 2000);//它可以消除齿痕！
        for (var i = 1; i < array_paint.length - 2; i++) {
            var c = (array_paint[i].x + array_paint[i + 1].x) / 2;
            var d = (array_paint[i].y + array_paint[i + 1].y) / 2;

            context.quadraticCurveTo(array_paint[i].x, array_paint[i].y, c, d);
        }
        context.stroke();
    }

    function getElemPos(obj) {
        var pos = {
            "top": 0,
            "left": 0
        };
        if (obj.offsetParent) {
            while (obj.offsetParent) {
                pos.top += obj.offsetTop;
                pos.left += obj.offsetLeft;
                obj = obj.offsetParent;
            }
        } else if (obj.x) {
            pos.left += obj.x;
        } else if (obj.x) {
            pos.top += obj.y;
        }
        return {
            x: pos.left,
            y: pos.top
        };
    }

    // fp helper
    function getColorDepth() {
        return screen.colorDepth;
    }

    function getPixelRatio() {
        return window.devicePixelRatio || "";
    }

    function getScreenWidth() {
        return screen.width;
    }

    function getScreenHeight() {
        return screen.height;
    }

    function getScreenAvailWidth() {
        return screen.availWidth;
    }

    function getScreenAvailHeight() {
        return screen.availHeight;
    }

    function getDeviceXDPI() {
        return screen.deviceXDPI;
    }

    function getDeviceYDPI() {
        return screen.deviceYDPI;
    }

    function getPlugins() {
        var pluginsList = "";

        for (var i = 0; i < navigator.plugins.length; i++) {
            var name = navigator.plugins[i].name;
            if (name) {
                if (i == navigator.plugins.length - 1) {
                    pluginsList += name.replace(/\s/g, "");
                } else {
                    pluginsList += name.replace(/\s/g, "") + ",";
                }
            }
        }
        return pluginsList;
    }

    function hasFlash() {
        var objPlugin = navigator.plugins["Shockwave Flash"];
        if (objPlugin) {
            return true;
        }
        return false;
    }

    function getFlashVersion() {
        if (hasFlash()) {
            var objPlugin = navigator.plugins["Shockwave Flash"];
            return objPlugin.version;
        }
        return "";
    }

    function hasMimeTypes() {
        if (navigator.mimeTypes.length) {
            return true;
        }
        return false;
    }

    function getMimeTypes() {
        if (hasMimeTypes()) {
            var mimeTypeList = "";
            for (var i = 0; i < navigator.mimeTypes.length; i++) {
                var desc = navigator.mimeTypes[i].description;
                if (desc) {
                    if (i == navigator.mimeTypes.length - 1) {
                        mimeTypeList += desc.replace(/\s/g, "");
                    } else {
                        mimeTypeList += desc.replace(/\s/g, "") + ",";
                    }
                }
            }
            return mimeTypeList;
        }
        return "";
    }

    function getFonts() {
        var available = [];

        var baseFonts = ["monospace", "sans-serif", "serif"];
        var fontList = [
            "Andale Mono", "Arial", "Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style",
            "Calibri", "Cambria", "Century", "Century Gothic", "Century Schoolbook", "Consolas", "Courier",
            "Courier New", "Garamond", "Geneva", "Georgia", "Helvetica", "Impact", "Lucida Bright", "Lucida Console",
            "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode",
            "Monaco", "Monotype Corsiva", "MS Gothic", "MS PGothic", "MYRIAD", "MYRIAD PRO",
            "Palatino", "Palatino Linotype", "Segoe Print", "Segoe Script", "Segoe UI",
            "Tahoma", "Times", "Times New Roman", "Trebuchet MS", "Verdana", "Wingdings",

            "Baskerville", "Casual", "cursive", "fantasy", "Droid Sans", "Goudy", "ITC Stone Serif", "Palatino",
            "sans-serif-condensed", "sans-serif-light", "sans-serif-medium", "sans-serif-smallcaps", "sans-serif-thin",

            "-apple-system", "AmericanTypewriter", "AppleGothic", "Charter",
            "Damascus", "DiwanMishafi", "Farah", "Futura", "Marion", "Menlo", "Mishafi",
            "Seravek", "Superclarendon", "Symbol", "Thonburi", "TrebuchetMS", "Zapfino",

            "Bookshelf Symbol 7", "Candara", "Constantia", "Corbel", "Didot", "Ebrima",
            "FangSong", "French Script MT", "Gabriola", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU-ExtB",
            "PMingLiU-ExtB", "SimHei", "SimSun", "SimSun-ExtB"
        ];

        var testString = "wssywssywssy";
        var testSize = "72px";
        var h = document.getElementsByTagName("body")[0];
        var baseFontsDiv = document.createElement("div");
        var fontsDiv = document.createElement("div");

        var defaultWidth = {};
        var defaultHeight = {};
        var createSpan = function () {
            var s = document.createElement("span");
            s.style.position = "absolute";
            s.style.left = "-9999px";
            s.style.fontSize = testSize;
            s.style.lineHeight = "normal";
            s.innerHTML = testString;
            return s;
        };

        var createSpanWithFonts = function (fontToDetect, baseFont) {
            var s = createSpan();
            s.style.fontFamily = "'" + fontToDetect + "'," + baseFont;
            return s;
        };

        var initializeBaseFontsSpans = function () {
            var spans = [];
            for (var index = 0, length = baseFonts.length; index < length; index++) {
                var s = createSpan();
                s.style.fontFamily = baseFonts[index];
                baseFontsDiv.appendChild(s);
                spans.push(s);
            }
            return spans;
        };

        var initializeFontsSpans = function () {
            var spans = {};
            for (var i = 0, l = fontList.length; i < l; i++) {
                var fontSpans = [];
                for (var j = 0, numDefaultFonts = baseFonts.length; j < numDefaultFonts; j++) {
                    var s = createSpanWithFonts(fontList[i], baseFonts[j]);
                    fontsDiv.appendChild(s);
                    fontSpans.push(s);
                }
                spans[fontList[i]] = fontSpans; // Stores {fontName : [spans for that font]}
            }
            return spans;
        };

        var isFontAvailable = function (fontSpans) {
            var detected = false;
            for (var i = 0; i < baseFonts.length; i++) {
                detected = (fontSpans[i].offsetWidth !== defaultWidth[baseFonts[i]] || fontSpans[i].offsetHeight !== defaultHeight[baseFonts[i]]);
                if (detected) {
                    return detected;
                }
            }
            return detected;
        };

        var baseFontsSpans = initializeBaseFontsSpans();
        h.appendChild(baseFontsDiv);
        for (var index = 0, length = baseFonts.length; index < length; index++) {
            defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth; // width for the default font
            defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight; // height for the default font
        }

        var fontsSpans = initializeFontsSpans();
        h.appendChild(fontsDiv);
        for (var i = 0, l = fontList.length; i < l; i++) {
            if (isFontAvailable(fontsSpans[fontList[i]])) {
                available.push(fontList[i].replace(/\s/g, "").replace(/-/g, ""));
            }
        }

        h.removeChild(fontsDiv);
        h.removeChild(baseFontsDiv);
        return available.join(",");
    }

    function hasIndexedDB() {
        try {
            return !!window.indexedDB;
        } catch (e) {
            return true;
        }
    }

    function hasLocalStorage() {
        try {
            return !!window.localStorage;
        } catch (e) {
            return true;
        }
    }

    function hasSessionStorage() {
        try {
            return !!window.sessionStorage;
        } catch (e) {
            return true;
        }
    }

    function hasCookie() {
        return navigator.cookieEnabled;
    }

    function getHardwareConcurrency() {
        if (navigator.hardwareConcurrency) {
            return navigator.hardwareConcurrency;
        }
        return "unknown";
    }

    function getNavigatorCpuClass() {
        if (navigator.cpuClass) {
            return navigator.cpuClass;
        } else {
            return "unknown";
        }
    }

    function getNavigatorPlatform() {
        if (navigator.platform) {
            return navigator.platform;
        } else {
            return "unknown";
        }
    }

    function getTimeZone() {
        return new Date().getTimezoneOffset() / 60;
    }

    function getLanguage() {
        return navigator.language;
    }

    function getLanguages() {
        return navigator.languages;
    }

    function getTouchSupport() {
        var maxTouchpts = 0;
        var touchEvent = 0;
        if (typeof navigator.maxTouchpts !== "undefined") {
            maxTouchpts = navigator.maxTouchpts;
        } else if (typeof navigator.msMaxTouchpts !== "undefined") {
            maxTouchpts = navigator.msMaxTouchpts;
        }
        try {
            document.createEvent("TouchEvent");
            touchEvent = 1;
        } catch (_) { /* squelch */
        }
        var captchaTouchStart = ("ontouchstart" in window) ? 1 : 0;
        return [maxTouchpts, touchEvent, captchaTouchStart];
    }

    function hasCanvas() {
        var elem = document.createElement('canvas');
        try {
            return !!(elem.getContext && elem.getContext('2d'));
        } catch (e) {
            return false;
        }
    }

    function getCanvasData() {
        var canvas = document.createElement('canvas');
        var ctx;
        try {
            ctx = canvas.getContext('2d');
        } catch (e) {
            return null;
        }

        var txt = 'JCap Fingureprint <canvas> 1.0';
        canvas.width = 2e3;
        canvas.height = 200;
        canvas.style.display = "inline";
        ctx.rect(0, 0, 11, 11);
        ctx.rect(3, 3, 6, 6);
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.font = "11px Arial";
        ctx.fillText(txt, 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.font = "18pt Arial";
        ctx.fillText(txt, 4, 45);
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = "rgb(255,0,255)";
        ctx.beginPath();
        ctx.arc(52, 50, 50, 0, 2 * Math.PI, !0);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "rgb(0,255,255)";
        ctx.beginPath();
        ctx.arc(100, 50, 50, 0, 2 * Math.PI, !0);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "rgb(255,255,0)";
        ctx.beginPath();
        ctx.arc(75, 100, 50, 0, 2 * Math.PI, !0);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "rgb(255,0,255)";
        ctx.arc(75, 75, 75, 0, 2 * Math.PI, !0);
        ctx.arc(75, 75, 25, 0, 2 * Math.PI, !0);
        ctx.fill("evenodd");
        return canvas.toDataURL();
    }

    function getCanvasPrint() {
        return x64hash128(getCanvasData(), 31);
    }

    function hasWebgl() {
        // code taken from Modernizr
        if (!hasCanvas()) {
            return false;
        }

        var canvas = document.createElement("canvas"),
            glContext;

        try {
            glContext = canvas.getContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
        } catch (e) {
            glContext = false;
        }

        return !!window.WebGLRenderingContext && !!glContext;
    }

    function getWebglData() {
        if (!hasWebgl()) {
            return null;
        }
        var gl;
        var fa2s = function (fa) {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            return "[" + fa[0] + ", " + fa[1] + "]";
        };
        var maxAnisotropy = function (gl) {
            var anisotropy,
                ext = gl.getExtension("EXT_texture_filter_anisotropic") || gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
            return ext ? (anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT), 0 === anisotropy && (anisotropy = 2), anisotropy) : null;
        };

        var canvas = document.createElement("canvas");
        try {
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        } catch (e) {
        }
        if (!gl) {
            return null;
        }
        var result = [];
        var vShaderTemplate = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
        var fShaderTemplate = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
        var vertexPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
        var vertices = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .732134444, 0]);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        vertexPosBuffer.itemSize = 3;
        vertexPosBuffer.numItems = 3;
        var program = gl.createProgram(),
            vshader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vshader, vShaderTemplate);
        gl.compileShader(vshader);
        var fshader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fshader, fShaderTemplate);
        gl.compileShader(fshader);
        gl.attachShader(program, vshader);
        gl.attachShader(program, fshader);
        gl.linkProgram(program);
        gl.useProgram(program);
        program.vertexPosAttrib = gl.getAttribLocation(program, "attrVertex");
        program.offsetUniform = gl.getUniformLocation(program, "uniformOffset");
        gl.enableVertexAttribArray(program.vertexPosArray);
        gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0);
        gl.uniform2f(program.offsetUniform, 1, 1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);
        if (gl.canvas != null) {
            return gl.canvas.toDataURL();
        } else {
            return null;
        }
    }

    function getWebglPrint() {
        return x64hash128(getWebglData(), 31);
    }

    function getDeviceInfo() {
        var fpInStorage = jcapUtil.getStorage("captcha_fp") || "";
        var fpInCookie = "";


        var gap = "~~";
        var result = [];
        result.push(fpInCookie);
        result.push(fpInStorage);
        var history = result.join(gap);

        var result = [];
        result.push(getCanvasPrint());
        result.push(getWebglPrint());
        result.push(getPixelRatio());
        result.push(getColorDepth());
        result.push(getFlashVersion());
        result.push(getFonts());
        result.push(getScreenWidth() + "x" + getScreenHeight() + "," + getScreenAvailWidth() + "x" + getScreenAvailHeight());
        result.push(getHardwareConcurrency());
        result.push(getNavigatorPlatform());
        result.push(getTimeZone());
        result.push(getLanguage());
        result.push(getLanguages());
        result.push(getTouchSupport());
        var storage = [];
        storage.push(hasCookie() ? 1 : 0);
        storage.push(hasIndexedDB() ? 1 : 0);
        storage.push(hasLocalStorage() ? 1 : 0);
        storage.push(hasSessionStorage() ? 1 : 0);
        result.push(storage.join(""));
        var device = result.join(gap);
        return history + "!!" + device;
    }

    // storage helper
    var storage = {

        getLocalSessionName: function (key) {
            return "jcap_dvzwcc_ls_" + key;
        },

        setLocalSession: function (key, value) {
            if (hasLocalStorage()) {
                var name = storage.getLocalSessionName(key);
                window.localStorage.setItem(name, value);
            }
        },
        setStorage: function (key, data) {
            var str = JSON.stringify(data);

            //		document.domain = "localhost";
            localStorage.setItem(key, str);
        },

        getStorage: function (key) {
            //			document.domain = "localhost";
            var str = localStorage.getItem(key);
            if (str) {
                return JSON.parse(str);
            }
            return undefined;
        },

        getLocalSession: function (key) {
            if (hasLocalStorage()) {
                var name = storage.getLocalSessionName(key);
                return window.localStorage.getItem(name);
            } else {
                return "";
            }
        },
    };

    // MurmurHash3 helper
    function x64Add(m, n) {
        m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
        n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
        var o = [0, 0, 0, 0];
        o[3] += m[3] + n[3];
        o[2] += o[3] >>> 16;
        o[3] &= 0xffff;
        o[2] += m[2] + n[2];
        o[1] += o[2] >>> 16;
        o[2] &= 0xffff;
        o[1] += m[1] + n[1];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[0] += m[0] + n[0];
        o[0] &= 0xffff;
        return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    }

    function x64Multiply(m, n) {
        m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
        n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
        var o = [0, 0, 0, 0];
        o[3] += m[3] * n[3];
        o[2] += o[3] >>> 16;
        o[3] &= 0xffff;
        o[2] += m[2] * n[3];
        o[1] += o[2] >>> 16;
        o[2] &= 0xffff;
        o[2] += m[3] * n[2];
        o[1] += o[2] >>> 16;
        o[2] &= 0xffff;
        o[1] += m[1] * n[3];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[1] += m[2] * n[2];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[1] += m[3] * n[1];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0]);
        o[0] &= 0xffff;
        return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    }

    function x64Rotl(m, n) {
        n %= 64;
        if (n === 32) {
            return [m[1], m[0]];
        } else if (n < 32) {
            return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))];
        } else {
            n -= 32;
            return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))];
        }
    }

    function x64LeftShift(m, n) {
        n %= 64;
        if (n === 0) {
            return m;
        } else if (n < 32) {
            return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
        } else {
            return [m[1] << (n - 32), 0];
        }
    }

    function x64Xor(m, n) {
        return [m[0] ^ n[0], m[1] ^ n[1]];
    }

    function x64Fmix(h) {
        h = x64Xor(h, [0, h[0] >>> 1]);
        h = x64Multiply(h, [0xff51afd7, 0xed558ccd]);
        h = x64Xor(h, [0, h[0] >>> 1]);
        h = x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
        h = x64Xor(h, [0, h[0] >>> 1]);
        return h;
    }

    function x64hash128(key, seed) {
        key = key || "";
        seed = seed || 0;
        var remainder = key.length % 16;
        var bytes = key.length - remainder;
        var h1 = [0, seed];
        var h2 = [0, seed];
        var k1 = [0, 0];
        var k2 = [0, 0];
        var c1 = [0x87c37b91, 0x114253d5];
        var c2 = [0x4cf5ad43, 0x2745937f];
        for (var i = 0; i < bytes; i = i + 16) {
            k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)];
            k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)];
            k1 = x64Multiply(k1, c1);
            k1 = x64Rotl(k1, 31);
            k1 = x64Multiply(k1, c2);
            h1 = x64Xor(h1, k1);
            h1 = x64Rotl(h1, 27);
            h1 = x64Add(h1, h2);
            h1 = x64Add(x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
            k2 = x64Multiply(k2, c2);
            k2 = x64Rotl(k2, 33);
            k2 = x64Multiply(k2, c1);
            h2 = x64Xor(h2, k2);
            h2 = x64Rotl(h2, 31);
            h2 = x64Add(h2, h1);
            h2 = x64Add(x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
        }
        k1 = [0, 0];
        k2 = [0, 0];
        switch (remainder) {
            case 15:
                k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 14)], 48));
            case 14:
                k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 13)], 40));
            case 13:
                k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 12)], 32));
            case 12:
                k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 11)], 24));
            case 11:
                k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 10)], 16));
            case 10:
                k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 9)], 8));
            case 9:
                k2 = x64Xor(k2, [0, key.charCodeAt(i + 8)]);
                k2 = x64Multiply(k2, c2);
                k2 = x64Rotl(k2, 33);
                k2 = x64Multiply(k2, c1);
                h2 = x64Xor(h2, k2);
            case 8:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 7)], 56));
            case 7:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 6)], 48));
            case 6:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 5)], 40));
            case 5:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 4)], 32));
            case 4:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 3)], 24));
            case 3:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 2)], 16));
            case 2:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 1)], 8));
            case 1:
                k1 = x64Xor(k1, [0, key.charCodeAt(i)]);
                k1 = x64Multiply(k1, c1);
                k1 = x64Rotl(k1, 31);
                k1 = x64Multiply(k1, c2);
                h1 = x64Xor(h1, k1);
        }
        h1 = x64Xor(h1, [0, key.length]);
        h2 = x64Xor(h2, [0, key.length]);
        h1 = x64Add(h1, h2);
        h2 = x64Add(h2, h1);
        h1 = x64Fmix(h1);
        h2 = x64Fmix(h2);
        h1 = x64Add(h1, h2);
        h2 = x64Add(h2, h1);
        return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
    }

    // encrypt helper
    function urlsafebtoa(str) {
        var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'.split('');
        var buf, i, j, len, r, l, c;
        i = j = 0;
        len = str.length;
        r = len % 3;
        len = len - r;
        l = (len / 3) << 2;
        if (r > 0) {
            l += 4;
        }
        buf = new Array(l);

        while (i < len) {
            c = str.charCodeAt(i++) << 16 |
                str.charCodeAt(i++) << 8 |
                str.charCodeAt(i++);
            buf[j++] = base64EncodeChars[c >> 18] +
                base64EncodeChars[c >> 12 & 0x3f] +
                base64EncodeChars[c >> 6 & 0x3f] +
                base64EncodeChars[c & 0x3f];
        }
        if (r == 1) {
            c = str.charCodeAt(i++);
            buf[j++] = base64EncodeChars[c >> 2] +
                base64EncodeChars[(c & 0x03) << 4];
        } else if (r == 2) {
            c = str.charCodeAt(i++) << 8 |
                str.charCodeAt(i++);
            buf[j++] = base64EncodeChars[c >> 10] +
                base64EncodeChars[c >> 4 & 0x3f] +
                base64EncodeChars[(c & 0x0f) << 2];
        }
        return buf.join('');
    }

    function urlsafeatob(str) {
        var base64DecodeChars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
            52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
        ];
        var c1, c2, c3, c4;
        var i, j, len, r, l, out;

        len = str.length;
        str += Array(5 - len % 4).join('=');
        str = str.replace(/\-/g, '+').replace(/\_/g, '/');

        if (/[^ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\+\/\=]/.test(str)) {
            return '';
        }
        if (str.charAt(len - 2) == '=') {
            r = 1;
        } else if (str.charAt(len - 1) == '=') {
            r = 2;
        } else {
            r = 0;
        }
        l = len;
        if (r > 0) {
            l -= 4;
        }
        l = (l >> 2) * 3 + r;
        out = new Array(l);

        i = j = 0;
        while (i < len) {
            // c1
            c1 = base64DecodeChars[str.charCodeAt(i++)];
            if (c1 == -1) break;

            // c2
            c2 = base64DecodeChars[str.charCodeAt(i++)];
            if (c2 == -1) break;

            out[j++] = String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

            // c3
            c3 = base64DecodeChars[str.charCodeAt(i++)];
            if (c3 == -1) break;

            out[j++] = String.fromCharCode(((c2 & 0x0f) << 4) | ((c3 & 0x3c) >> 2));

            // c4
            c4 = base64DecodeChars[str.charCodeAt(i++)];
            if (c4 == -1) break;

            out[j++] = String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out.join('');
    }

    function getKey() {
        return "E736B80A35290F193C2034A8021CC63B";
    }

    function getDeltaTea() {
        // return 0x9E3779B9;
        return (0x847F6C3 << 3) + parseInt(urlsafeatob("MTU0Mjk2NDEyOQ"));
    }

    function toBinaryStringTea(v, includeLength) {
        var length = v.length;
        var n = length << 2;
        if (includeLength) {
            var m = v[length - 1];
            n -= 4;
            if ((m < n - 3) || (m > n)) {
                return null;
            }
            n = m;
        }
        for (var i = 0; i < length; i++) {
            v[i] = String.fromCharCode(
                v[i] & 0xFF,
                v[i] >>> 8 & 0xFF,
                v[i] >>> 16 & 0xFF,
                v[i] >>> 24 & 0xFF
            );
        }
        var result = v.join('');
        if (includeLength) {
            return result.substring(0, n);
        }
        return result;
    }

    function toUint32ArrayTea(bs, includeLength) {
        var length = bs.length;
        var n = length >> 2;
        if ((length & 3) !== 0) {
            ++n;
        }
        var v;
        if (includeLength) {
            v = new Array(n + 1);
            v[n] = length;
        } else {
            v = new Array(n);
        }
        for (var i = 0; i < length; ++i) {
            v[i >> 2] |= bs.charCodeAt(i) << ((i & 3) << 3);
        }
        return v;
    }

    function int32Tea(i) {
        return i & 0xFFFFFFFF;
    }

    function mxTea(sum, y, z, p, e, k, code) {
        var c = code - 25700;
        if (1 == (c >>> 16)) {
            var arg1 = c >>> 12 & 0x7;
            var arg2 = c >>> 8 & 0x7;
            var arg3 = c >>> 4 & 0x7;
            var arg4 = c & 0x7;
            return mxOriginalTea(sum, y, z, p, e, k) ^ ((y >>> arg1 ^ z << arg2) + ((sum >>> arg3 & 0x3f) ^ ((z + y) >>> ((7 - arg4) >>> 1) & 0x3f)));
        } else {
            return mxOriginalTea(sum, y, z, p, e, k);
        }
    }

    function mxOriginalTea(sum, y, z, p, e, k) {
        var util = {
            'aa': function aa(_0x21f284, _0x416667) {
                return _0x21f284 ^ _0x416667;
            },
            'bb': function bb(_0x3c5587, _0x521076) {
                return _0x3c5587 + _0x521076;
            },
            'cc': function cc(_0x2577da, _0x6af344) {
                return _0x2577da << _0x6af344;
            },
            'dd': function dd(_0x247258, _0x257629) {
                return _0x247258 >>> _0x257629;
            }
        };
        return util['aa'](util['bb'](util['aa'](z >>> 0x5, util['cc'](y, 0x2)), util['aa'](util['dd'](y, 0x3), util['cc'](z, 0x4))), (sum ^ y) + (k[util['aa'](p & 0x3, e)] ^ z));
    }

    function fixkTea(k) {
        if (k.length < 4) k.length = 4;
        return k;
    }

    function encryptUint32ArrayTea(v, k, code) {
        var length = v.length;
        var n = length - 1;
        var y, z, sum, e, p, q;
        z = v[n];
        sum = 0;
        for (q = Math.floor(6 + 52 / length) | 0; q > 0; --q) {
            sum = int32Tea(sum + getDeltaTea());
            e = sum >>> 2 & 3;
            for (p = 0; p < n; ++p) {
                y = v[p + 1];
                z = v[p] = int32Tea(v[p] + mxTea(sum, y, z, p, e, k, code));
            }
            y = v[0];
            z = v[n] = int32Tea(v[n] + mxTea(sum, y, z, n, e, k, code));
        }
        return v;
    }

    function utf8EncodeTea(str) {
        if (/^[\x00-\x7f]*$captcha/.test(str)) {
            return str;
        }
        var buf = [];
        var n = str.length;
        for (var i = 0, j = 0; i < n; ++i, ++j) {
            var codeUnit = str.charCodeAt(i);
            if (codeUnit < 0x80) {
                buf[j] = str.charAt(i);
            } else if (codeUnit < 0x800) {
                buf[j] = String.fromCharCode(0xC0 | (codeUnit >> 6),
                    0x80 | (codeUnit & 0x3F));
            } else if (codeUnit < 0xD800 || codeUnit > 0xDFFF) {
                buf[j] = String.fromCharCode(0xE0 | (codeUnit >> 12),
                    0x80 | ((codeUnit >> 6) & 0x3F),
                    0x80 | (codeUnit & 0x3F));
            } else {
                if (i + 1 < n) {
                    var nextCodeUnit = str.charCodeAt(i + 1);
                    if (codeUnit < 0xDC00 && 0xDC00 <= nextCodeUnit && nextCodeUnit <= 0xDFFF) {
                        var rune = (((codeUnit & 0x03FF) << 10) | (nextCodeUnit & 0x03FF)) + 0x010000;
                        buf[j] = String.fromCharCode(0xF0 | ((rune >> 18) & 0x3F),
                            0x80 | ((rune >> 12) & 0x3F),
                            0x80 | ((rune >> 6) & 0x3F),
                            0x80 | (rune & 0x3F));
                        ++i;
                        continue;
                    }
                }
                throw new Error('Malformed string');
            }
        }
        return buf.join('');
    }

    function encryptTea(data, key, code) {
        if (data === undefined || data === null || data.length === 0) {
            return data;
        }
        data = utf8EncodeTea(data);
        key = utf8EncodeTea(key);
        return toBinaryStringTea(encryptUint32ArrayTea(toUint32ArrayTea(data, true), fixkTea(toUint32ArrayTea(key, false)), code), false);
    }

    function encryptToBase64Tea(data, key) {
        return urlsafebtoa(encryptTea(data, key, tdat_code));
    }

    function getEncryptData(data, key) {
        var deviceMsg = data;
        var deviceKey = key;
        if (!key) {
            deviceKey = getKey();
        }
        return encryptToBase64Tea(deviceMsg, deviceKey);
    }

    JCap.getSessionId = function () {
        return option.sessionId;
    };
    JCap.getBsId = function () {
        return option.bsId;
    };
    JCap.reset = function (sessionId) {
        option.sessionId = sessionId;
        getCaptchaType();
        bindEvent();
    };
    JCap.create = function () {
        if ($captcha("#captcha_dom").length == 0) {
            getCaptchaType();
            bindEvent();
        } else {
            $captcha("#captcha_dom").show();
        }
    };
    return JCap;
}

var jcapUtil = {
    captchaAjax: function (url, data, callback, callbackName) {
        var start_time = new Date().getTime();
        var interface_data = {};
        interface_data.appID = "";
        interface_data.uid = "";
        interface_data.sid = option.sessionId;
        interface_data.interfaceId = captcha_st.setting.interfaceId;
        interface_data.fp = jcapUtil.getStorage("captcha_fp");
        interface_data.os = "m";
        interface_data.netType = jcapUtil.getNetworkType();
        $captcha.ajax({
            url: url,
            type: 'POST',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            cache: false,
            async: false,
            timeout: 5000,
            data: data,
            dataType: 'json',
            success: function (result) {
                jcapUtil.sendInterfaceStatus(result, start_time);
                result.interfaceName = captcha_st.setting.interfaceName;
                callback(result, callbackName);
            },
            error: function (result) {
                jcapUtil.sendInterfaceStatus(result, start_time);
                callback({
                    code: "30002",
                    msg: captcha_st.lang[captcha_st.setting.langKey || "1"].code_23,
                    interfaceName: captcha_st.setting.interfaceName
                }, callbackName);
            }
        })
    },

    sendInterfaceStatus: function (data, start_time) {
        var interface_data = {};
        interface_data.status = data.code;
        interface_data.callTime = new Date().getTime() - start_time;
        try {
            $captcha.ajax({
                url: captcha_st.url.report,
                type: 'GET',
                data: interface_data,
                dataType: 'json',
                success: function (result) {

                },
                error: function (result) {

                }
            })
        } catch (e) {
            console.log("接口上报失败");
        }

    },
    setStorage: function (key, data) {
        if (window.localStorage) {
            var str = JSON.stringify(data);
            localStorage.setItem(key, str);
        } else {
            captcha_st.setting.captcha_storage[key] = data;
        }
    },

    getStorage: function (key) {
        if (window.localStorage) {
            var str = localStorage.getItem(key);
            if (str) {
                return JSON.parse(str);
            }
        } else {
            return captcha_st.setting.captcha_storage[key];
        }
        return "";
    },
    removeStorage: function (key) {
        if (window.localStorage) {
            localStorage.removeItem(key);
        } else {
            delete captcha_st.setting.captcha_storage[key];
        }
    },
    setIframeStorage: function (key, data) {
        document.getElementById("captchaIframe").contentWindow.postMessage(JSON.stringify({
            type: "SET",
            key: key,
            value: data
        }), captcha_st.url.iframe);
        document.getElementById("captchaIframe").contentWindow.postMessage(JSON.stringify({
            type: "GET",
            key: key
        }), captcha_st.url.iframe);
    },
    removeIframeStorage: function (key) {
        document.getElementById("captchaIframe").contentWindow.postMessage(JSON.stringify({
            type: "REM",
            key: key
        }), captcha_st.url.iframe);
    },
    getNetworkType: function () {
        var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {
            type: 'unknown'
        };
        if (typeof(connection.bandwidth) == "number") {
            if (connection.bandwidth > 10) {
                connection.type = 'wifi';
            } else if (connection.bandwidth > 2) {
                connection.type = '3g';
            } else if (connection.bandwidth > 0) {
                connection.type = '2g';
            } else if (connection.bandwidth == 0) {
                connection.type = 'none';
            } else {
                connection.type = 'unknown';
            }
        } else {
            connection.type = 'unknown';
        }
        return connection.type;
    }
}
var touche_move = {};
var touchLastTime = 0;
document.addEventListener("touchstart", captchaTouchstart, false);
document.addEventListener("touchmove", captchaTouchmove, false);
document.addEventListener("touchend", captchaTouchend, false);
document.addEventListener("click", captchaClick, false);

function captchaTouchstart(event) {
    var touch = event.changedTouches[0];
    touche_move.eid = "touch";
    touche_move.did = touch.target.id;
    touche_move.cn = touch.target.className;
    touche_move.time = new Date().getTime();
    touche_move.pt = [];
    touche_move.pt.push([event.changedTouches[0].screenX, event.changedTouches[0].screenY, event.changedTouches[0].pageX, event.changedTouches[0].pageY, touchLastTime]);
    touchLastTime = new Date().getTime();
};

function captchaTouchmove(event) {
    var touch = event.changedTouches[0];
    touche_move.pt.push([touch.screenX, touch.screenY, touch.pageX, touch.pageY, new Date().getTime() - touchLastTime]);
    touchLastTime = new Date().getTime();
};

function captchaTouchend(event) {
    if (touche_move.pt.length > 0) {
        if (touche_move.pt.length > 400) {
            touche_move.pt.splice(0, touche_move.pt.length - 10);
        }
        var localData = jcapUtil.getStorage("touche_message");
        if (!localData) {
            localData = [];
        }
        localData.push(touche_move);
        if (localData.length >= 10) {
            var lenght = localData.length - 10;
            localData.splice(0, lenght);
        }
        jcapUtil.setStorage('touche_message', localData);
    }
};

function captchaClick(event) {
    var clickMsg = {};
    clickMsg.eid = "click";
    clickMsg.did = event.target.id;
    clickMsg.cn = event.target.className;
    clickMsg.sx = event.screenX;
    clickMsg.sy = event.screenY;
    clickMsg.px = event.pageX;
    clickMsg.py = event.pageY;
    clickMsg.time = new Date().getTime();
    var localData = jcapUtil.getStorage("touche_message");
    if (!localData) {
        localData = [];
    }
    localData.push(clickMsg);
    if (localData.length >= 10) {
        var lenght = localData.length - 10;
        localData.splice(0, lenght);
    }
    jcapUtil.setStorage('touche_message', localData);
};