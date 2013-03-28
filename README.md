#[jQuery Star Rating](http://www.fyneworks.com/jquery/star-rating/)

##Overview
The Star Rating Plugin is a plugin for the jQuery Javascript library that creates a non-obstrusive star rating control based on a set of radio input boxes.

---
 
##Usage

###Getting started
Just add the `class="star"` to your radio boxes:
````html
<input name="star1" type="radio" class="star"/>
<input name="star1" type="radio" class="star"/>
<input name="star1" type="radio" class="star"/>
<input name="star1" type="radio" class="star"/>
<input name="star1" type="radio" class="star"/>
````

####Default value?
Use the `checked` property to specify the initial/default value of the control
````html
<input name="star2" type="radio" class="star"/>
<input name="star2" type="radio" class="star"/>
<input name="star2" type="radio" class="star" checked="checked"/>
<input name="star2" type="radio" class="star"/>
<input name="star2" type="radio" class="star"/>
````

####Read-only stars?
Use the `disabled` property to use a control for display purposes only
````html
<input name="star3" type="radio" class="star" disabled="disabled"/>
<input name="star3" type="radio" class="star" disabled="disabled"/>
<input name="star3" type="radio" class="star" disabled="disabled" checked="checked"/>
<input name="star3" type="radio" class="star" disabled="disabled"/>
<input name="star3" type="radio" class="star" disabled="disabled"/>
````
