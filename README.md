#[jQuery Star Rating](http://www.fyneworks.com/jquery/star-rating/)

##Overview
The Star Rating Plugin is a plugin for the jQuery Javascript library that creates a non-obstrusive star rating control based on a set of radio input boxes.

---
 
##Installation
* Current version: 4.11
* Release date: 2013-03-14
* Download: <a href="https://github.com/fyneworks/star-rating/archive/master.zip"><strong>star-rating.zip</strong></a>

---
 
##Basic Usage

###Simple stars
Just add the `class="star"` to your radio boxes:
```html
<input name="star1" type="radio" class="star"/>
<input name="star1" type="radio" class="star"/>
<input name="star1" type="radio" class="star"/>
<input name="star1" type="radio" class="star"/>
<input name="star1" type="radio" class="star"/>
```
####Specifying a default value
Use the `checked` property to specify the initial/default value of the control
```html
<input name="star2" type="radio" class="star"/>
<input name="star2" type="radio" class="star"/>
<input name="star2" type="radio" class="star" checked="checked"/>
<input name="star2" type="radio" class="star"/>
<input name="star2" type="radio" class="star"/>
```
####Read-only stars
Use the `disabled` property to use a control for display purposes only
```html
<input name="star3" type="radio" class="star" disabled="disabled"/>
<input name="star3" type="radio" class="star" disabled="disabled"/>
<input name="star3" type="radio" class="star" disabled="disabled" checked="checked"/>
<input name="star3" type="radio" class="star" disabled="disabled"/>
<input name="star3" type="radio" class="star" disabled="disabled"/>
```
####Split-stars with the metadata plugin
Use the <a href="https://github.com/jquery/jquery-metadata">`metadata` plugin</a> to pass advanced settings to the plugin via the class property.
The example below creates 4 total stars with a selected value of 1.25 (1 and a quarter star).
The total number of stars is the number of radios divided by the split, in this case 16/4 = 4.
The number of stars selected is the ordinal value of the radio selected divided by the split, in this case 5/4 = 1.25
```html
<input name="adv1" type="radio" class="star {split:4}"/>
<input name="adv1" type="radio" class="star {split:4}"/>
<input name="adv1" type="radio" class="star {split:4}"/>
<input name="adv1" type="radio" class="star {split:4}"/>
<input name="adv1" type="radio" class="star {split:4}" checked="checked"/>
<input name="adv1" type="radio" class="star {split:4}"/>
<input name="adv1" type="radio" class="star {split:4}"/>
<input name="adv1" type="radio" class="star {split:4}"/>
<input name="adv1" type="radio" class="star {split:4}"/>
<input name="adv1" type="radio" class="star {split:4}"/>
<input name="adv1" type="radio" class="star {split:4}"/>
<input name="adv1" type="radio" class="star {split:4}"/>
<input name="adv1" type="radio" class="star {split:4}"/>
<input name="adv1" type="radio" class="star {split:4}"/>
<input name="adv1" type="radio" class="star {split:4}"/>
<input name="adv1" type="radio" class="star {split:4}"/>
```

####Options
The rating method takes several options. They are each detailed here:

| option      | type     | default         | Description
| ------      | ----     | -------         | -----------
| cancel      | string   | "Cancel Rating" | Advisory title for the 'cancel' link
| cancelValue | string   | ""              | Value to submit when user click the 'cancel' link
| split       | integer  | 0               | Number of parts to split the star into
| starWidth   | integer  | 16              | Width of star image in case the plugin can't work it out. This can happen if the jQuery.dimensions plugin is not available OR the image is hidden at installation
| half        | boolean  | null            | Shortcut for `split: 2`
| required    | boolean  | null            | Disables the 'cancel' button so user can only select one of the specified values
| readOnly    | boolean  | null            | Disable rating plugin interaction		
| focus       | function | null            | Callback function, executed when stars are focused
| blur        | function | null            | Callback function, executed when stars are focused
| callback    | function | null            | Callback function, executed when a star is clicked
