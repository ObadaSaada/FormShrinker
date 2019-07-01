/**
 * Name:			Form Shrinker
 * File:			fromShrinker.js
 * Version:			1.0.0 (Last Modified: 06/25/2019)
 * Author:			Obada Saada ()
 * Description:		in place edit group of form elements 
 * ------------------------------------------------------------------------------------
 * Date			    Author		        Changes
 * ------------------------------------------------------------------------------------
 * jun 25 2019	    Obada Saada			Created.
 * ===================================================================================
 * USAGE:
 * ------------------------------------------------------------------------------------
 * $('.formShrink').formShrink(); 
 * ===================================================================================
 */
(function ($) {

    $.fn.formShrink = function (options) {
        var settings = {
            'on': 'click',
        };
        if (options) {
            $.extend(settings, options);
        }
        return this.each(function (e) {
            var $this = $(this)
            $this.hide();
            $this.append("<div id='shrinker-controls'><input class='btn btn-primary' type='button' id='ok' value='OK' shrinker-group-id='" + this.id + "' /> <input class='btn btn-inverse' type='button' id='cancel' value='Cancel' shrinker-group-id='" + this.id + "' /></div>")
            if($this.attr('shrink-group')=='true')
            {
                var inputs = $this.find('fieldset').find('input,select,textarea');
                var labels = $this.find('label');
                var isEmpty = ShrinkerInputsData({ inputs,labels },this)
                
            }
            $("div#" + this.id + "-edit").on('click', 'a', function (e) {
                $("div#" + $(this).attr('shrink-group-id')).show();
                e.preventDefault();
            });
            $("div#shrinker-controls>input").on("click", function () {
                if (this.id == 'ok')
                {
                    $("div#" + $(this).attr('shrinker-group-id') + '.form-group.formShrink').hide();
                    
                    var inputs = $("div#" + $(this).attr('shrinker-group-id') ).find('fieldset').find('input,select,textarea');
                    var labels = $("div#" + $(this).attr('shrinker-group-id')).find('label');
                    var editSelector = $('a[shrink-group-id="' + $(this).attr('shrinker-group-id') + '"]');
                    var isEmpty = ShrinkerInputsData({ inputs, labels }, this, true, editSelector)
                    
                }
                else if (this.id == 'cancel') {
                    $("div#" + $(this).attr('shrinker-group-id') + '.form-group.formShrink').hide();
                }
                else
                {
                    console.error("undefined index: Form shrinker could not find current control index ")
                }
                
            });
        });
        
    };
})(jQuery);
var data = [];
function ShrinkerInputsData(inputs,selector,editMode,editSelector)
{
    editMode = typeof editMode !== 'undefined' ? editMode : false;

    var isEmpty = true;
    var data = [];
    var checkboxes = [];
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

            )) {
            data.push({ lbl: inputs.inputs[i].labels[0], val: inputs.inputs[i].value });

            if (inputs.inputs[i].value != "") {
                isEmpty = false;
            }
        }
        else if (inputs.inputs[i].nodeName === "INPUT" && inputs.inputs[i].type === "radio" && inputs.inputs[i].checked === true) {

            data.push({ lbl: inputs.inputs[i].labels[0], val: inputs.inputs[i].value });
            if (inputs.inputs[i].value != "") {
                isEmpty = false;
            }
        }
        else if (inputs.inputs[i].nodeName === "INPUT" && inputs.inputs[i].type === "checkbox" && inputs.inputs[i].checked === true) {
            data.push({ lbl: inputs.inputs[i].labels[0], val: inputs.inputs[i].value });
            if (inputs.inputs[i].value != "") {
                isEmpty = false;
            }
        }
        else if (inputs.inputs[i].nodeName === "SELECT") {
            
            data.push({ lbl: inputs.inputs[i].labels[0], val: inputs.inputs[i].value });
            if (inputs.inputs[i].value != "") {
                isEmpty = false;
            }
        }
        else if (inputs.inputs[i].nodeName === "TEXTAREA") {
            
            data.push({ lbl: inputs.inputs[i].labels[0], val: inputs.inputs[i].value });

            //data.push(inputs.inputs[i].value.replace(/\n/g, "<br />"));
            if (inputs.inputs[i].value != "") {
                isEmpty = false;
            }
        }
    }
    if (checkboxes.length > 0) {
        data.push("[" + checkboxes + "]")
    }
    
    data = data.filter(v => data.values(v).length !== 0);
    var dataArray = [];
    for (var b = 0; b < data.length; b++) {
        if (data[b].lbl != '' || data[b].lbl != undefined || data[b].lbl != null)
        {
            if (data[b].val != '')
                dataArray.push({ lbl: data[b].lbl, val: data[b].val })
            else
                dataArray.push({ lbl: data[b].lbl, val: '<span class="alert-danger">Empty</span>' })
        }
            
    }

    data = dataArray;
    if (!editMode) {
        $(selector).before("<div class='d-inline-flex' id='" + selector.id + "-edit'></div>");
        if (isEmpty)
            $('div#' + selector.id + '-edit').html("<label id='" + selector.id + "'></label><a class='mx-2' href='javascript:;' shrinked-item='true' shrink-group-id='" + selector.id + "'>Empty</a>");
        else
            for (var n = 0; n < data.length; n++) {
                if (data[n].lbl != undefined)
                {
                    $('div#' + selector.id + '-edit').append("<label id='" + selector.id + "'>" + data[n].lbl.innerHTML + "</label>");
                    $('div#' + selector.id + '-edit').append("<a class='mx-2' href='javascript:;' shrinked-item='true' shrink-group-id='" + selector.id + "'>" + data[n].val + "</a>");
                }
            }
    }
    else {
        if (!isEmpty)
        {
            
            $selection = $('div#' + $(selector).attr('shrinker-group-id') + '-edit');

            $('div#' + $(selector).attr('shrinker-group-id') + '-edit a').detach()
            $('div#' + $(selector).attr('shrinker-group-id') + '-edit label').detach()
            for (var x = 0; x < data.length; x++) {
                if (data[x].lbl != undefined) {
                    $selection.append("<label id='" + $(selector).attr('shrinker-group-id') + "'>" + data[x].lbl.innerHTML + "</label><a class='mx-2' href='javascript:;' shrinked-item='true' shrink-group-id='" + $(selector).attr('shrinker-group-id') + "'>" + data[x].val + "</a>");
                }
                else {
                    console.warn('Warning: make sure all inputs in group (' + $(selector).attr('shrinker-group-id') + ') connected to a LABEL with FOR attribute')
                }
        }
        }
        else
            $('div#' + $(selector).attr('shrinker-group-id') + '-edit').html("<label class='text-right' id='" + selector.id + "'></label><a class='mx-2' href='javascript:;' shrinked-item='true' shrink-group-id='" + $(selector).attr('shrinker-group-id') + "'>Empty</a>");
    }

}


