# FormShrinker 
[![Build Status](https://travis-ci.org/ObadaSaada/FormShrinker.svg?branch=master)](https://travis-ci.org/ObadaSaada/FormShrinker)
[![npm version](https://img.shields.io/npm/v/FormShrinker.svg)](https://www.npmjs.com/package/formshrinker)
[![npm version](https://img.shields.io/github/package-json/v/obadasaada/formshrinker?label=GitHub)](https://github.com/ObadaSaada/FormShrinker)

In-Place Editor to reduce the size of the form, which form elements will be replaced by inline or listed text

# Installation

* Github

<code>git clone git://github.com/ObadaSaada/FormShrinker.git</code>

* NPM

<code>npm i formshrinker</code>

# Usage

* insert the script source into your code
```html
<script src="./scripts/formShrinker.js"></script>
```
* call the initializer using JQuery
```html
<script> 
  $(function () {
    $('.formShrink').formShrink();
  });
</script>
```
# Properties
* Language property (lang)
 > default language is english (en)
 
 > you can modify the source code to add extra languages 
```javascript
$('.formShrink').formShrink(
  {
    lang: 'en'
  }
);
```
* View mode of the result can be linear or list (viewType)
 > default view mode is linear
 
 > to change the view mode to list change the <code>type</code> inside <code>viewType</code> to list
```javascript
$('.formShrink').formShrink(
  {
    viewType: 
    {
      type : 'linear'
    },
  }
);
```
* CSS Classes
 > there are four available css proparities can be used
 
 -> ul
 
 -> li
 
 -> okButton
 
 -> cancelButton
 
 ```javascript
$('.formShrink').formShrink(
  {
    CssClass:
            {
                ul: "ul-class",
                li: "li-class",
                okButton: "btn btn-primary",
                cancelButton: "btn btn-inverse",
            },
  }
);
```
* Default proparities 
 > following code showing the default proparities
 
 ```javascript
 $('.formShrink').formShrink({
            lang: 'en',
            viewType: {
                type: 'linear',
            },
            CssClass:
            {
                ul: "",
                li: "",
                okButton: "",
                cancelButton: "",
            }
        });
 ```
 # HTML Formatting 
* use the following format any where in your code
```html
  <div id="Mygroup" class="form-group formShrink" shrink-group="true">
      <fieldset>
          <div id="xyz">
              <label for="textareagroup1">text area content</label>
              <textarea id="textareagroup1"></textarea>
          </div>
      </fieldset>
  </div>
```
* make sure the div container class contain formShrinker which is the initial class of the Library
* use the custom attribute <code>shrink-group="true"</code>
* the dive container elements must be inside <code> fieldset </code>
* each Input, textarea, select <b>Must</b> have a label, otherwise it will not work correctly
* for radio, and checkbox Inputs add a label and assign the attribute fs-label as following example
```html
<div id="groupOfRadioButtons" class="form-group formShrink" shrink-group="true">
    <fieldset>
        <label id='groupOfRadioButtonsLabel' fs-label>Drones Label</label>
        <div>
            <input type="radio" id="huey" name="drone" value="huey"
                   checked>
            <label for="huey">Huey</label>
        </div>

        <div>
            <input type="radio" id="dewey" name="drone" value="dewey">
            <label for="dewey">Dewey</label>
        </div>

        <div>
            <input type="radio" id="louie" name="drone" value="louie">
            <label for="louie">Louie</label>
        </div>
    </fieldset>
</div>

<div id="groupOfCheckboxes" class="form-group formShrink" shrink-group="true">
    <fieldset>
        <label id="groupOfCheckboxesLabel" fs-label>interests label</label>
        <div>
            <input type="checkbox" id="coding" name="interest" value="coding">
            <label for="coding">Coding</label>
        </div>
        <div>
            <input type="checkbox" id="music" name="interest" value="music">
            <label for="music">Music</label>
        </div>
    </fieldset>
</div>

```
