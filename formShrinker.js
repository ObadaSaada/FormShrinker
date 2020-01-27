/**
 * Name:			Form Shrinker
 * File:			fromShrinker.js
 * Version:			1.2.0 (Last Modified: 27/1/2020)
 * Author:			Obada Saada ()
 * Description:		In-Place group of elements editor
 * ------------------------------------------------------------------------------------
 * Date			    Author		        Changes
 * ------------------------------------------------------------------------------------
 * jun 25 2019	    Obada Saada			Created.
 * jul 02 2019      Obada Saada         Allow fs-label For Radio,checkbox
 * jul 15 2019      Obada Saada         fix on cancel return default values of inputs
 * jul 15 2019      Obada Saada         allow language option (default is english[en])
 * jul 21 2019      Obada Saada         show select-list option's text instead of value
 * oct 10 2019      Obada Saada         create new proparites (view type, css classes)
 * jan 27 2020      Obada Saada         Create Animation from Animate.css Library
 * ===================================================================================
 * USAGE:
 * ------------------------------------------------------------------------------------
 * $('.formShrink').formShrink({ param }); 
 * ===================================================================================
 */
(function ($) {

    $.fn.formShrink = function (options) {
        var Languages = ['ar', 'en'];
        var selectedLanguage = 'en';
        var viewTypes = ['linear', 'list']
        var selectedViewType = 'linear';
        var CssClass_ul = '';
        var CssClass_li = '';
        var CssClass_okButton = ''
        var CssClass_CancelButton = '';
        var animation_Animate = false;
        var Animation_OnOpen = '';
        var Animation_OnClose = '';
        var Animation_Delay = '';

        options.lang == undefined ? options.lang = selectedLanguage : options.lang;
        options.viewType.type == undefined ? options.viewType[0] = selectedViewType : options.viewType.type;
        options.lang.length > 0 && Languages.includes(options.lang) ? selectedLanguage = options.lang : selectedLanguage;
        options.viewType.type.length > 0 && viewTypes.includes(options.viewType.type) ? selectedViewType = options.viewType.type : selectedViewType;
        options.CssClass.ul.length > 0 ? CssClass_ul = options.CssClass.ul : CssClass_ul;
        options.CssClass.li.length > 0 ? CssClass_li = options.CssClass.li : CssClass_li;
        options.CssClass.okButton.length > 0 ? CssClass_okButton = options.CssClass.okButton : CssClass_okButton;
        options.CssClass.cancelButton.length > 0 ? CssClass_CancelButton = options.CssClass.cancelButton : CssClass_CancelButton;
        options.Animation.Animate == true ? animation_Animate = options.Animation.Animate : animation_Animate;
        options.Animation.onOpen.length > 0 ? Animation_OnOpen = options.Animation.onOpen : Animation_OnOpen;
        options.Animation.onClose.length > 0 ? Animation_OnClose = options.Animation.onClose : Animation_OnClose;
        options.Animation.delay.length > 0 ? Animation_Delay = options.Animation.delay : Animation_Delay;

        var settings = {
            lang: {
                en:
                {
                    EmptyText: 'Empty',
                    okButtonText: 'Ok',
                    cancelButtonText: 'Cancel'
                },
                ar:
                {
                    EmptyText: 'فارغ',
                    okButtonText: 'تم',
                    cancelButtonText: 'الغاء'
                }
            },
            viewType:
            {
                type: selectedViewType,
            },
            CssClass:
            {
                ul: CssClass_ul,
                li: CssClass_li,
                okButton: CssClass_okButton,
                cancelButton: CssClass_CancelButton,
            },
            Animation: {
                animate: animation_Animate,
                onOpen: Animation_OnOpen,
                onClose: Animation_OnClose,
                delay: Animation_Delay,
            },
        };

        options.lang = settings.lang[selectedLanguage];
        options.viewType = settings.viewType;
        options.CssClass = settings.CssClass;
        options.Animation = settings.Animation;

        if (options) {
            $.extend(settings, options);
        }
        return this.each(function (e) {
            var $this = $(this)
            var inputsValues = [];

            var inputs = $this.find('fieldset').find('input,select,textarea');
            var labels = $this.find('label');
            var langSettingsParam = settings.lang

            if (settings.Animation.animate == true) {
                $this.addClass("Animated " + settings.Animation.delay)
            }
            setTimeout(function () {
                $this.hide();
            }, delayInMilliseconds(settings.Animation.delay));

            $this.append("<div id='shrinker-controls'>" +
                "<input class='" + settings.CssClass.okButton + "' type='button' id='ok" + this.id + "' value='" + settings.lang.okButtonText + "' shrinker-group-id='" + this.id + "' />" +
                "<input class='" + settings.CssClass.cancelButton + "' type='button' id='cancel" + this.id + "' value='" + settings.lang.cancelButtonText + "' shrinker-group-id='" + this.id + "' />" +
                "</div>")
            if ($this.attr('shrink-group') == 'true') {
                ShrinkerInputsData({ inputs, labels, langSettingsParam }, this, undefined, settings)
            }
            $("div#" + this.id + "-edit").on('click', 'a', function (e) {

                $groups = $(document).find('.formShrink')
                $cancelBtnClick = $(document).find('input#cancel' + this.id)
                $groups = $(document).find('.formShrink')
                for (var g = 0; g < $groups.length; g++) {
                    if ($($groups[g]).css('display') != 'none') {

                        $($cancelBtnClick[g]).click();
                        $($cancelBtnClick[g]).trigger('click');
                    }
                }
                if (settings.Animation.animate == true) {
                    if ($this[0].classList.contains(settings.Animation.onClose)) {
                        $this.removeClass(settings.Animation.onClose);
                    }
                    $this.addClass(settings.Animation.onOpen);
                }
                $("div#" + $(this).attr('shrink-group-id')).show();
                e.preventDefault();
            });
            $("div#shrinker-controls>input").on("click", function (e) {
                var inputs = $("div#" + $(this).attr('shrinker-group-id')).find('fieldset').find('input,select,textarea');
                var labels = $("div#" + $(this).attr('shrinker-group-id')).find('label');

                if (this.id == 'ok' + $(this).attr('shrinker-group-id')) {
                    if (settings.Animation.animate == true) {
                        if ($this[0].classList.contains(settings.Animation.onOpen)) {
                            $this.removeClass(settings.Animation.onOpen);
                        }
                        $this.addClass(settings.Animation.onClose);
                    }
                    var timeout = setTimeout(() => {
                        return $("div#" + $(this).attr('shrinker-group-id') + '.form-group.formShrink').hide();
                    }, delayInMilliseconds(settings.Animation.delay.toString()));
                    ShrinkerInputsData({ inputs, labels, langSettingsParam }, this, true, settings)
                }
                else if (this.id == 'cancel' + $(this).attr('shrinker-group-id')) {
                    if (settings.Animation.animate == true) {
                        if ($this[0].classList.contains(settings.Animation.onOpen)) {
                            $this.removeClass(settings.Animation.onOpen);
                        }
                        $this.addClass(settings.Animation.onClose);
                    }
                    var timeout = setTimeout(() => {
                        return $("div#" + $(this).attr('shrinker-group-id') + '.form-group.formShrink').hide();
                    }, delayInMilliseconds(settings.Animation.delay.toString()));
                    inputsValues = [];
                    $inp = $(this).parent().parent().parent().find('a');

                    for (var v = 0; v < $inp.length; v++) {
                        if ($($inp[v]).attr('shrinked-item') && $($inp[v]).attr('shrinked-item'))
                            inputsValues.push({ id: $($inp[v]).attr('shrinked-for'), text: $inp[v].text })
                    }

                    inputs = inputs.filter(v => inputs[v].hasAttribute("id"));

                    if (inputs.length > 0 && inputsValues.length > 0) {
                        if (inputsValues[0].text == settings.lang.EmptyText) {
                            for (var s = 0; s < inputs.length; s++) {
                                if (inputs[s].nodeName == "SELECT") {
                                    $('select#' + inputs[s].id).val("");
                                    $('select#' + inputs[s].id).trigger('change');
                                }
                                else if (inputs[s].nodeName == "INPUT" && inputs[s].type == "radio") {

                                }
                                else if (inputs[s].nodeName == "INPUT")
                                    inputs[s].value = "";
                            }
                        }
                        for (var iv = 0; iv < inputsValues.length; iv++) {
                            if (inputs[iv].nodeName == "INPUT" && inputs[iv].type === "radio") {
                                if (inputs[iv].value == inputsValues[iv].text)
                                    inputs[iv].checked = true;
                            }
                            if (inputs[iv].nodeName == "INPUT" && inputs[iv].type === "checkbox") {
                                var ckbArray = inputsValues[iv].text.split(",");
                                for (var cki = 0; cki < ckbArray.length; cki++) {
                                    if (inputs[cki].value == ckbArray[cki])
                                        inputs[cki].checked = true;
                                }

                            }
                            else if (inputs[iv].nodeName == "INPUT" && inputs[iv].id == inputsValues[iv].id) {
                                (inputsValues[iv].text == settings.lang.EmptyText) ? inputs[iv].value = "" : inputs[iv].value = inputsValues[iv].text;
                            }
                            else if (inputs[iv].nodeName == "SELECT" && inputs[iv].id == inputsValues[iv].id) {

                                $optionsList = $('select#' + inputs[iv].id).find('option');
                                for (var ol = 0; ol < $optionsList.length; ol++) {
                                    if ($optionsList[ol].text == inputsValues[iv].text) {
                                        $('select#' + inputs[iv].id).val($optionsList[ol].value);
                                        $('select#' + inputs[iv].id).trigger('change');
                                    }
                                }
                            }
                            else if (inputs[iv].nodeName == "TEXTAREA" && inputs[iv].id == inputsValues[iv].id) {
                                (inputsValues[iv].text == settings.lang.EmptyText) ? inputs[iv].value = "" : inputs[iv].value = inputsValues[iv].text;
                            }
                        }
                    }
                    inputsValues = []
                }
                else {
                    console.error("undefined index: Form shrinker could not find current control index ")
                }
                return false;
            });
        });

    };
})(jQuery);
function ShrinkerInputsData(inputs, selector, editMode, settings) {
    editMode = typeof editMode !== 'undefined' ? editMode : false;

    var isEmpty = true;
    var isRadio = false;
    var isCheckbox = false;
    var data = [];

    for (i = 0; i < inputs.inputs.length; i++) {
        if (inputs.inputs[i].nodeName === "INPUT" && (

            inputs.inputs[i].type === "text" ||
            inputs.inputs[i].type === "number" ||
            inputs.inputs[i].type === "email" ||
            inputs.inputs[i].type === "url" ||
            inputs.inputs[i].type === "tel" ||
            inputs.inputs[i].type === "number"

        )) {
            data.push({ lbl: inputs.inputs[i].labels[0], val: inputs.inputs[i].value });
            if (inputs.inputs[i].value != "") isEmpty = false;
        }
        else if (inputs.inputs[i].nodeName === "INPUT" && inputs.inputs[i].type === "radio" && inputs.inputs[i].checked === true) {
            var radioLabel = '';
            isRadio = true;
            for (var lblNum = 0; lblNum < inputs.labels.length; lblNum++) {
                if (inputs.labels[lblNum].hasAttribute('fs-label')) radioLabel = inputs.labels[lblNum]
            }
            data.push({ lbl: radioLabel, val: inputs.inputs[i].value });
            if (inputs.inputs[i].value != "") isEmpty = false;
        }
        else if (inputs.inputs[i].nodeName === "INPUT" && inputs.inputs[i].type === "checkbox" && inputs.inputs[i].checked === true) {
            var checkboxLabel = '';
            isCheckbox = true;

            for (var lblNum = 0; lblNum < inputs.labels.length; lblNum++) {
                if (inputs.labels[lblNum].hasAttribute('fs-label')) checkboxLabel = inputs.labels[lblNum]
            }
            (data.length > 0) ? data[0].val.push(inputs.inputs[i].value) : data.push({ lbl: checkboxLabel, val: [inputs.inputs[i].value] });
            if (inputs.inputs[i].value != "") isEmpty = false;
        }
        else if (inputs.inputs[i].nodeName === "SELECT") {
            $opId = inputs.inputs[i].value;
            if ($opId != "") {
                $selectedOption = $("#" + inputs.inputs[i].id + " option[value='" + $opId + "']").text();
                data.push({ lbl: inputs.inputs[i].labels[0], val: $selectedOption });
            }
            else
                data.push({ lbl: inputs.inputs[i].labels[0], val: "" });

            if (inputs.inputs[i].value != "") isEmpty = false;
        }
        else if (inputs.inputs[i].nodeName === "TEXTAREA") {
            data.push({ lbl: inputs.inputs[i].labels[0], val: inputs.inputs[i].value });
            //data.push(inputs.inputs[i].value.replace(/\n/g, "<br />"));
            if (inputs.inputs[i].value != "") isEmpty = false;
        }
    }
    data = data.filter(v => data.values(v).length !== 0);
    var dataArray = [];
    for (var b = 0; b < data.length; b++) {
        if (data[b].lbl != '' || data[b].lbl != undefined || data[b].lbl != null) {
            if (data[b].val != '')
                dataArray.push({ lbl: data[b].lbl, val: data[b].val })
            else
                dataArray.push({ lbl: data[b].lbl, val: '<span class="alert-danger">' + inputs.langSettingsParam.EmptyText + '</span>' })
        }
    }
    data = dataArray;
    if (!editMode) {
        $(selector).before("<div class='d-inline-flex' id='" + selector.id + "-edit'></div>");

        if (isEmpty) {
            $('div#' + selector.id + '-edit').html("<label id='" + selector.id + "'></label><a class='mx-2' href='javascript:;' shrinked-item='true' shrinked-for='' shrink-group-id='" + selector.id + "'>" + inputs.langSettingsParam.EmptyText + "</a>");
        }
        else {
            for (var n = 0; n < data.length; n++) {
                if (isRadio || isCheckbox) {
                    $('div#' + selector.id + '-edit').append("<label id='" + selector.id + "'>" + data[n].lbl.innerHTML + "</label>");
                    $('div#' + selector.id + '-edit').append("<a class='mx-2' href='javascript:;' shrinked-item='true' shrinked-for='" + data[n].lbl.id + "'  shrink-group-id='" + selector.id + "'>" + data[n].val + "</a>");
                }
                else {
                    if (data[n].lbl != undefined) {
                        $('div#' + selector.id + '-edit').append("<label id='" + selector.id + "'>" + data[n].lbl.innerHTML + "</label>");
                        $('div#' + selector.id + '-edit').append("<a class='mx-2' href='javascript:;' shrinked-item='true' shrinked-for='" + $(data[n].lbl).attr('for') + "' shrink-group-id='" + selector.id + "'>" + data[n].val + "</a>");
                    }
                }
            }
        }
    }
    else {
        if (isEmpty) {
            $('div#' + $(selector).attr('shrinker-group-id') + '-edit').html("<label class='text-right' id='" + selector.id + "'></label><a class='mx-2' href='javascript:;' shrinked-item='true' shrink-group-id='" + $(selector).attr('shrinker-group-id') + "'>" + inputs.langSettingsParam.EmptyText + "</a>");
        }
        else {
            $selection = $('div#' + $(selector).attr('shrinker-group-id') + '-edit');
            settings.viewType.type == 'list' ? $selection.html("<ul class='" + settings.CssClass.ul + "'>") : $selection.html("");

            for (var n = 0; n < data.length; n++) {
                if (isRadio || isCheckbox) {
                    if (settings.viewType.type == 'list') {
                        $label = "<label id='" + $(selector).attr('shrinker-group-id') + "'>" + data[n].lbl.innerHTML + "</label>";
                        $link = "<a class='mx-2' href='javascript:;' shrinked-item='true'  shrinked-for='" + data[n].lbl.id + "'  shrink-group-id='" + $(selector).attr('shrinker-group-id') + "'>" + data[n].val + "</a>";
                        $listcontent = "<li class='" + settings.CssClass.li + "'>" + $label + $link + "</li>"
                        $('div#' + $(selector).attr('shrinker-group-id') + '-edit ul').append($listcontent)
                    }
                    else {
                        $selection.append("<label id='" + $(selector).attr('shrinker-group-id') + "'>" + data[n].lbl.innerHTML + "</label>");
                        $selection.append("<a class='mx-2' href='javascript:;' shrinked-item='true'  shrinked-for='" + data[n].lbl.id + "'  shrink-group-id='" + $(selector).attr('shrinker-group-id') + "'>" + data[n].val + "</a>")
                    }
                }
                else {
                    if (data[n].lbl != undefined) {
                        if (settings.viewType.type == 'list') {
                            $label = "<label id='" + $(selector).attr('shrinker-group-id') + "'>" + data[n].lbl.innerHTML + "</label>";
                            $link = "<a class='mx-2' href='javascript:;' shrinked-item='true'  shrinked-for='" + $(data[n].lbl).attr('for') + "'  shrink-group-id='" + $(selector).attr('shrinker-group-id') + "'>" + data[n].val + "</a>";
                            $listcontent = "<li class='" + settings.CssClass.li + "'>" + $label + $link + "</li>"
                            $('div#' + $(selector).attr('shrinker-group-id') + '-edit ul').append($listcontent)
                        }
                        else {
                            $selection.append("<label id='" + $(selector).attr('shrinker-group-id') + "'>" + data[n].lbl.innerHTML + "</label>");
                            $selection.append("<a class='mx-2' href='javascript:;' shrinked-item='true'  shrinked-for='" + $(data[n].lbl).attr('for') + "'  shrink-group-id='" + $(selector).attr('shrinker-group-id') + "'>" + data[n].val + "</a>")
                        }
                    }
                    else {
                        console.warn('Warning: make sure all inputs in group (' + $(selector).attr('shrinker-group-id') + ') connected to a LABEL with FOR attribute')
                    }
                }
            }
        }
    }
}
function delayInMilliseconds(AnimationDelay) {
    switch (AnimationDelay) {
        case 'fast':
            return 800;
        case 'faster':
            return 500;
        case 'slow':
            return 1000;
        case 'slower':
            return 2000;
        case 'delay-1s':
            return 1000;
        case 'delay-2s':
            return 2000;
        case 'delay-3s':
            return 3000;
        case 'delay-4s':
            return 4000;
        case 'delay-5s':
            return 5000;
    }
    return 0;
}