# FormShrinker
small Library that can be used to shrink the size of large forms by changing group of elements to inline text

# Usage

* include the file into your project
* add initialization Query Selector to your code <code> $('.formShrink').formShrink(); </code>
* to change the language pass the <code>lang</code> option with value to your initialization Query Selector
```javascript
$('.formShrink').formShrink({
  lang: 'en'
});
```

* use the following format any where in your code
```html
 <!-- Include the source File -->
  <script src="scripts/formShrinker/formShrinker.js"></script>

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
