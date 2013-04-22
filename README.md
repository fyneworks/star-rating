#[jQuery Star Rating](http://www.fyneworks.com/jquery/star-rating/)

##Overview
The Star Rating Plugin is a plugin for the jQuery Javascript library that creates a non-obstrusive star rating control based on a set of radio input boxes.

---
 
##Installation
* Current version: 4.11
* Release date: 2013-03-14
* Download: <a href="http://jquery-star-rating-plugin.googlecode.com/svn/trunk/star-rating.zip"><strong>star-rating.zip</strong></a>

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
####Split-stars with the matadata plugin
Use the <a href="https://github.com/jquery/jquery-metadata">`metadata` plugin</a> to pass advanced settings to the plugin via the class property.
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
```
