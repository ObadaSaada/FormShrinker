# FormShrinker
small Library that can be used to shrink the size of large forms by changing group of elements to inline text

#Usage

* include the file into your project
* add initialization Query Selector to your code <code> $('.formShrink').formShrink(); </code>
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
* each Input,textarea,select <b>Must</b> have a label, otherwise it will not work correctly
