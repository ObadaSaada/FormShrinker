/**
 * Name:			Form Shrinker
 * File:			fromShrinker.js
 * Version:			1.1.0 (Last Modified: 07/15/2019)
 * Author:			Obada Saada ()
 * Description:		in place edit group of form elements 
 * ------------------------------------------------------------------------------------
 * Date			    Author		        Changes
 * ------------------------------------------------------------------------------------
 * jun 25 2019	    Obada Saada			Created.
 * jul 02 2019      Obada Saada         Allow fs-label For Radio,checkbox
 * jul 15 2019      Obada Saada         fix on cancel return default values of inputs
 * jul 15 2019      Obada Saada         allow language option (default is english[en])
 * ===================================================================================
 * USAGE:
 * ------------------------------------------------------------------------------------
 * $('.formShrink').formShrink(); 
 * ===================================================================================
 */
(function ($) {

    $.fn.formShrink = function (options) {
        var Languages = ['ar', 'en'];
        var selectedLanguage = 'en';
        if (options.lang.length > 0 && Languages.includes(options.lang))
            selectedLanguage = options.lang;
        
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
            }
        };
        options.lang = settings.lang[selectedLanguage];
        if (options) {
            $.extend(settings, options);
        }
        return this.each(function (e) {
            var $this = $(this)
            var inputsValues = [];
            
            var inputs = $this.find('fieldset').find('input,select,textarea');
            var labels = $this.find('label');
            var langSettingsParam = settings.lang
            $this.hide();
            $this.append("<div id='shrinker-controls'><input class='btn btn-primary' type='button' id='ok' value='"+settings.lang.okButtonText+"' shrinker-group-id='" + this.id + "' /> <input class='btn btn-inverse' type='button' id='cancel' value='"+settings.lang.cancelButtonText+"' shrinker-group-id='" + this.id + "' /></div>")
            if($this.attr('shrink-group')=='true')
            {
                var shrink = ShrinkerInputsData({ inputs, labels, langSettingsParam }, this)
            }
            $("div#" + this.id + "-edit").on('click', 'a', function (e) {
                
                $groups = $(document).find('.formShrink')
                $cancelBtnClick = $(document).find('input#cancel')
                $groups = $(document).find('.formShrink')
                for (var g = 0; g < $groups.length; g++) {
                    if ($($groups[g]).css('display') != 'none') {

                        $($cancelBtnClick[g]).click();
                        $($cancelBtnClick[g]).trigger('click');
                    }
                }
                $("div#" + $(this).attr('shrink-group-id')).show();
                
                e.preventDefault();
            });
            $("div#shrinker-controls>input").on("click", function (e) {

                var inputs = $("div#" + $(this).attr('shrinker-group-id')).find('fieldset').find('input,select,textarea');
                var labels = $("div#" + $(this).attr('shrinker-group-id')).find('label');
                var editSelector = $('a[shrink-group-id="' + $(this).attr('shrinker-group-id') + '"]');

                if (this.id == 'ok')
                {
                    $("div#" + $(this).attr('shrinker-group-id') + '.form-group.formShrink').hide();
                    
                    
                    var shrink = ShrinkerInputsData({ inputs, labels, langSettingsParam }, this, true, editSelector)
                    
                }
                else if (this.id == 'cancel') {
                    $("div#" + $(this).attr('shrinker-group-id') + '.form-group.formShrink').hide();
                    inputsValues = [];
                    $inp = $(this).parent().parent().parent().find('a');
                    
                    for (var v = 0; v < $inp.length; v++) {
                        if ($($inp[v]).attr('shrinked-item') && $($inp[v]).attr('shrinked-item'))
                        inputsValues.push({ id: $($inp[v]).attr('shrinked-for'), text: $inp[v].text })
                    }
                    
                    inputs = inputs.filter(v => inputs[v].hasAttribute("id"));

                    if (inputs.length > 0 && inputsValues.length > 0) {
                        if (inputsValues[0].text == settings.lang.EmptyText)
                        {
                            for (var s = 0; s < inputs.length; s++)
                            {
                                if (inputs[s].nodeName == "SELECT")
                                {
                                    $('select#' + inputs[s].id).val("");
                                    $('select#' + inputs[s].id).trigger('change');
                                }
                                else if (inputs[s].nodeName == "INPUT" && inputs[s].type=="radio")
                                {

                                }
                                else if (inputs[s].nodeName == "INPUT")
                                    inputs[s].value = "";
                            }
                        }
                        for (var iv = 0; iv < inputsValues.length; iv++) {
                            if (inputs[iv].nodeName == "INPUT" && inputs[iv].type === "radio")
                            {
                                if (inputs[iv].value == inputsValues[iv].text)
                                    inputs[iv].checked = true;
                            }
                            if (inputs[iv].nodeName == "INPUT" && inputs[iv].type === "checkbox")
                            {
                                var ckbArray = inputsValues[iv].text.split(",");
                                for (var cki = 0; cki < ckbArray.length; cki++) {
                                    if (inputs[cki].value == ckbArray[cki])
                                        inputs[cki].checked = true;
                                }
                                
                            }
                            else if (inputs[iv].nodeName == "INPUT" && inputs[iv].id == inputsValues[iv].id)
                            {
                                (inputsValues[iv].text == settings.lang.EmptyText) ? inputs[iv].value = "" : inputs[iv].value = inputsValues[iv].text;
                            }
                            else if (inputs[iv].nodeName == "SELECT" && inputs[iv].id == inputsValues[iv].id)
                            {
                                    $('select#' + inputs[iv].id).val(inputsValues[iv].text);
                                    $('select#' + inputs[iv].id).trigger('change');
                            }
                        }
                    }
                    inputsValues=[]
                }
                else
                {
                    console.error("undefined index: Form shrinker could not find current control index ")
                }
                return false;
            });
        });
        
    };
})(jQuery);
function ShrinkerInputsData(inputs,selector,editMode,editSelector,settings)
{
    editMode = typeof editMode !== 'undefined' ? editMode : false;

    var isEmpty = true;
    var isRadio = false;
    var isCheckbox = false;
    var data = [];
    //-----------------------------------------------------------------------
    //https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements
    //-----------------------------------------------------------------------
    // Iterate over the form controls
    
    for (i = 0; i < inputs.inputs.length; i++) {
        if (inputs.inputs[i].nodeName === "INPUT" && (

            inputs.inputs[i].type === "text" ||
            inputs.inputs[i].type === "number" ||
            inputs.inputs[i].type === "email" ||
            inputs.inputs[i].type === "url" ||
            inputs.inputs[i].type === "tel" ||
            inputs.inputs[i].type === "number"

            ))
        {
            data.push({ lbl: inputs.inputs[i].labels[0], val: inputs.inputs[i].value });
            if (inputs.inputs[i].value != "")  isEmpty = false; 
        }
        else if (inputs.inputs[i].nodeName === "INPUT" && inputs.inputs[i].type === "radio" && inputs.inputs[i].checked === true) {
            var radioLabel = '';
            isRadio = true;
            for (var lblNum = 0; lblNum < inputs.labels.length; lblNum++) {
                if(inputs.labels[lblNum].hasAttribute('fs-label')) radioLabel = inputs.labels[lblNum]
            }
            data.push({ lbl: radioLabel, val: inputs.inputs[i].value });
            if (inputs.inputs[i].value != "")  isEmpty = false; 
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
            
            data.push({ lbl: inputs.inputs[i].labels[0], val: inputs.inputs[i].value });
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
        if (data[b].lbl != '' || data[b].lbl != undefined || data[b].lbl != null)
        {
            if (data[b].val != '')
                dataArray.push({ lbl: data[b].lbl, val: data[b].val })
            else
                dataArray.push({ lbl: data[b].lbl, val: '<span class="alert-danger">' + inputs.langSettingsParam.EmptyText + '</span>' })
        }
            
    }

    data = dataArray;
    if (!editMode) {
        $(selector).before("<div class='d-inline-flex' id='" + selector.id + "-edit'></div>");
        if (isEmpty)
            $('div#' + selector.id + '-edit').html("<label id='" + selector.id + "'></label><a class='mx-2' href='javascript:;' shrinked-item='true' shrinked-for='' shrink-group-id='" + selector.id + "'>" + inputs.langSettingsParam.EmptyText + "</a>");
        else
        {
            
            for (var n = 0; n < data.length; n++) {
                if (isRadio || isCheckbox) {
                    $('div#' + selector.id + '-edit').append("<label id='" + selector.id + "'>" + data[n].lbl.innerHTML + "</label>");
                    $('div#' + selector.id + '-edit').append("<a class='mx-2' href='javascript:;' shrinked-item='true' shrinked-for='" + data[n].lbl.id + "'  shrink-group-id='" + selector.id + "'>" + data[n].val + "</a>");
                }
                else {
                    if (data[n].lbl != undefined)
                    {
                        $('div#' + selector.id + '-edit').append("<label id='" + selector.id + "'>" + data[n].lbl.innerHTML + "</label>");
                        $('div#' + selector.id + '-edit').append("<a class='mx-2' href='javascript:;' shrinked-item='true' shrinked-for='" + $(data[n].lbl).attr('for') + "' shrink-group-id='" + selector.id + "'>" + data[n].val + "</a>");
                    }
                }
            }
        }
            
            
    }
    else {
        if (isEmpty)
        {
            $('div#' + $(selector).attr('shrinker-group-id') + '-edit').html("<label class='text-right' id='" + selector.id + "'></label><a class='mx-2' href='javascript:;' shrinked-item='true' shrink-group-id='" + $(selector).attr('shrinker-group-id') + "'>" + inputs.langSettingsParam.EmptyText + "</a>");
        }
        else
        {
            $selection = $('div#' + $(selector).attr('shrinker-group-id') + '-edit');

            $('div#' + $(selector).attr('shrinker-group-id') + '-edit a').detach()
            $('div#' + $(selector).attr('shrinker-group-id') + '-edit label').detach()
            for (var n = 0; n < data.length; n++) {
                if (isRadio || isCheckbox) {
                    $selection.append("<label id='" + $(selector).attr('shrinker-group-id') + "'>" + data[n].lbl.innerHTML + "</label>");
                    $selection.append("<a class='mx-2' href='javascript:;' shrinked-item='true'  shrinked-for='" + data[n].lbl.id + "'  shrink-group-id='" + $(selector).attr('shrinker-group-id') + "'>" + data[n].val + "</a>")
                }
                else {
                    if (data[n].lbl != undefined) {
                        $selection.append("<label id='" + $(selector).attr('shrinker-group-id') + "'>" + data[n].lbl.innerHTML + "</label>");
                        $selection.append("<a class='mx-2' href='javascript:;' shrinked-item='true'  shrinked-for='" + $(data[n].lbl).attr('for') + "'  shrink-group-id='" + $(selector).attr('shrinker-group-id') + "'>" + data[n].val + "</a>")
                    }
                    else {
                        console.warn('Warning: make sure all inputs in group (' + $(selector).attr('shrinker-group-id') + ') connected to a LABEL with FOR attribute')
                    }
                }
            }
        
        }
        
    }

}


