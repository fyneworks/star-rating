/*
===============================================================================
Chili is the jQuery code highlighter plugin
...............................................................................
LICENSE: http://www.opensource.org/licenses/mit-license.php
WEBSITE: http://noteslog.com/chili/

											   Copyright 2008 / Andrea Ercolino
===============================================================================
*/


( function($) {

ChiliBook = { //implied global

	  version:            "2.0" // 2008-05-12

// options --------------------------------------------------------------------

	, automatic:          true
	, automaticSelector:  "code"

	, codeLanguage:       function( el ) {
		var recipeName = $( el ).attr( "class" );
		return recipeName ? recipeName : '';
	}

	, recipeLoading:      true
	, recipeFolder:       "" // used like: recipeFolder + recipeName + '.js'

	, replaceSpace:       "&#160;"                   // use an empty string for not replacing
	, replaceTab:         "&#160;&#160;&#160;&#160;" // use an empty string for not replacing
	, replaceNewLine:     "&#160;<br/>"              // use an empty string for not replacing

// ------------------------------------------------------------- end of options

	, data:               {}                           // use this for your data

	, defaultReplacement: '<span class="$0">$$</span>' // TODO: make this an option again
	, recipes:            {} //repository
	, queue:              {} //register

	//fix for IE: copy of PREformatted text strips off all html, losing newlines
	, preFixCopy:         document.selection && document.selection.createRange
	, preContent:         ""
	, preElement:         null

	, unique:             function() {
		return (new Date()).valueOf();
	}
};



$.fn.chili = function( options ) {
	var book = $.extend( {}, ChiliBook, options || {} );

	function cook( ingredients, recipe, blockName ) {

		function prepareBlock( recipe, blockName ) {
			var steps = [];
			for( var stepName in recipe[ blockName ] ) {
				steps.push( prepareStep( recipe, blockName, stepName ) );
			}
			return steps;
		} // prepareBlock

		function prepareStep( recipe, blockName, stepName ) {
			var step = recipe[ blockName ][ stepName ];
			var exp = ( typeof step._match == "string" ) ? step._match : step._match.source;
			return {
				recipe: recipe
				, blockName: blockName
				, stepName: stepName
				, exp: "(" + exp + ")"
				, length: 1                         // add 1 to account for the newly added parentheses
					+ (exp                          // count number of submatches in here
						.replace( /\\./g, "%" )     // disable any escaped character
						.replace( /\[.*?\]/g, "%" ) // disable any character class
						.match( /\((?!\?)/g )       // match any open parenthesis, not followed by a ?
					|| []                           // make sure it is an empty array if there are no matches
					).length                        // get the number of matches
				, replacement: step._replace ? step._replace : book.defaultReplacement
			};
		} // prepareStep
	
		function knowHow( steps ) {
			var prevLength = 1;
			var exps = [];
			for (var i = 0; i < steps.length; i++) {
				var exp = steps[ i ].exp;
				// adjust backreferences
				exp = exp.replace( /\\\\|\\(\d+)/g, function( m, aNum ) {
					return !aNum ? m : "\\" + ( prevLength + 1 + parseInt( aNum, 10 ) );
				} );
				exps.push( exp );
				prevLength += steps[ i ].length;
			}
			var prolog = '((?:\\s|\\S)*?)';
			var epilog = '((?:\\s|\\S)+)';
			var source = '(?:' + exps.join( "|" ) + ')';
			source = prolog + source + '|' + epilog;
			return new RegExp( source, recipe._case ? "g" : "gi" );
		} // knowHow

		function escapeHTML( str ) {
			return str.replace( /&/g, "&amp;" ).replace( /</g, "&lt;" );
		} // escapeHTML

		function replaceSpaces( str ) {
			return str.replace( / +/g, function( spaces ) {
				return spaces.replace( / /g, replaceSpace );
			} );
		} // replaceSpaces

		function filter( str ) {
			str = escapeHTML( str );
			if( replaceSpace ) {
				str = replaceSpaces( str );
			}
			return str;
		} // filter

		function applyRecipe( subject, recipe ) {
			return cook( subject, recipe );
		} // applyRecipe

		function applyBlock( subject, recipe, blockName ) {
			return cook( subject, recipe, blockName );
		} // applyBlock

		function applyStep( subject, recipe, blockName, stepName ) {
			var replaceSpace       = book.replaceSpace;

			var step = prepareStep( recipe, blockName, stepName );
			var steps = [step];

			var perfect = subject.replace( knowHow( steps ), function() {
				return chef.apply( { steps: steps }, arguments );
			} );
			return perfect;
		} // applyStep

		function applyModule( subject, module, context ) {
			if( ! module ) {
				return filter( subject );
			}

			var sub = module.split( '/' );
			var recipeName = '';
			var blockName  = '';
			var stepName   = '';
			switch( sub.length ) {
				case 1:
					recipeName = sub[0];
					break;
				case 2:
					recipeName = sub[0]; blockName = sub[1];
					break;
				case 3:
					recipeName = sub[0]; blockName = sub[1]; stepName = sub[2];
					break;
				default:
					return filter( subject );
			}

			function getRecipe( recipeName ) {
				var path = getPath( recipeName );
				var recipe = book.recipes[ path ];
				if( ! recipe ) {
					throw {msg:"recipe not available"};
				}
				return recipe;
			}

			try {
				var recipe;
				if ( '' == stepName ) {
					if ( '' == blockName ) {
						if ( '' == recipeName ) {
							//nothing to do
						}
						else { // ( '' != recipeName )
							recipe = getRecipe( recipeName );
							return applyRecipe( subject, recipe );
						}
					}
					else { // ( '' != blockName )
						if( '' == recipeName ) {
							recipe = context.recipe;
						}
						else {
							recipe = getRecipe( recipeName );
						}
						if( ! (blockName in recipe) ) {
							return filter( subject );
						}
						return applyBlock( subject, recipe, blockName );
					}
				}
				else { // ( '' != stepName )
					if( '' == recipeName ) {
						recipe = context.recipe;
					}
					else {
						recipe = getRecipe( recipeName );
					}
					if( '' == blockName ) {
						blockName = context.blockName;
					}
					if( ! (blockName in recipe) ) {
						return filter( subject );
					}
					if( ! (stepName in recipe[blockName]) ) {
						return filter( subject );
					}
					return applyStep( subject, recipe, blockName, stepName );
				}
			}
			catch( e ) {
				if (e.msg && e.msg == "recipe not available") {
					var cue = 'chili_' + book.unique();
					if( book.recipeLoading ) {
						var path = getPath( recipeName );
						if( ! book.queue[ path ] ) {
							/* this is a new recipe to download */
							try {
								book.queue[ path ] = [ {cue: cue, subject: subject, module: module, context: context} ];
								$.getJSON( path, function( recipeLoaded ) {
									book.recipes[ path ] = recipeLoaded;
									var q = book.queue[ path ];
									for( var i = 0, iTop = q.length; i < iTop; i++ ) {
										var replacement = applyModule( q[ i ].subject, q[ i ].module, q[ i ].context );
										if( book.replaceTab ) {
											replacement = replacement.replace( /\t/g, book.replaceTab );
										}
										if( book.replaceNewLine ) {
											replacement = replacement.replace( /\n/g, book.replaceNewLine );
										}
										$( '#' + q[ i ].cue ).replaceWith( replacement );
									}
								} );
							}
							catch( recipeNotAvailable ) {
								alert( "the recipe for '" + recipeName + "' was not found in '" + path + "'" );
							}
						}
						else {
							/* not a new recipe, so just enqueue this element */
							book.queue[ path ].push( {cue: cue, subject: subject, module: module, context: context} );
						}
						return '<span id="' + cue + '">' + filter( subject ) + '</span>';
					}
					return filter( subject );
				}
				else {
					return filter( subject );
				}
			}
		} // applyModule

		function addPrefix( prefix, replacement ) {
			var aux = replacement.replace( /(<span\s+class\s*=\s*(["']))((?:(?!__)\w)+\2\s*>)/ig, "$1" + prefix + "__$3" );
			return aux;
		} // addPrefix

		function chef() {
			if (! arguments[ 0 ]) {
				return '';
			}
			var steps = this.steps;
			var i = 0;  // iterate steps
			var j = 2;	// iterate chef's arguments
			var prolog = arguments[ 1 ];
			var epilog = arguments[ arguments.length - 3 ];
			if (! epilog) {
				var step;
				while( step = steps[ i++ ] ) {
					var aux = arguments; // this unmasks chef's arguments inside the next function
					if( aux[ j ] ) {
						var replacement = '';
						if( $.isFunction( step.replacement ) ) {
							var matches = []; //Array.slice.call( aux, j, step.length );
							for (var k = 0, kTop = step.length; k < kTop; k++) {
								matches.push( aux[ j + k ] );
							}
							matches.push( aux[ aux.length - 2 ] );
							matches.push( aux[ aux.length - 1 ] );
							replacement = step.replacement
								.apply( { 
									x: function() { 
										var subject = arguments[0];
										var module  = arguments[1];
										var context = { 
											  recipe:    step.recipe
											, blockName: step.blockName 
										};
										return applyModule( subject, module, context );
									} 
								}, matches );
						}
						else { //we expect step.replacement to be a string
							replacement = step.replacement
								.replace( /(\\\$)|(?:\$\$)|(?:\$(\d+))/g, function( m, escaped, K ) {
									if( escaped ) {       /* \$ */ 
										return "$";
									}
									else if( !K ) {       /* $$ */ 
										return filter( aux[ j ] );
									}
									else if( K == "0" ) { /* $0 */ 
										return step.stepName;
									}
									else {                /* $K */
										return filter( aux[ j + parseInt( K, 10 ) ] );
									}
								} );
						}
						replacement = addPrefix( step.recipe._name, replacement );
						return filter( prolog ) + replacement;
					} 
					else {
						j+= step.length;
					}
				}
			}
			else {
				return filter( epilog );
			}
		} // chef

		if( ! blockName ) {
			blockName = '_main';
			checkSpices( recipe );
		}
		if( ! (blockName in recipe) ) {
			return filter( ingredients );
		}
		var replaceSpace = book.replaceSpace;
		var steps = prepareBlock( recipe, blockName );
		var kh = knowHow( steps );
		var perfect = ingredients.replace( kh, function() {
			return chef.apply( { steps: steps }, arguments );
		} );
		return perfect;

	} // cook

	function load_stylesheet_inline( sourceCode ) { 
		if( document.createElement ) { 
			var e = document.createElement( "style" ); 
			e.type = "text/css"; 
			if( e.styleSheet ) { // IE 
				e.styleSheet.cssText = sourceCode; 
			}  
			else { 
				var t = document.createTextNode( sourceCode ); 
				e.appendChild( t ); 
			} 
			document.getElementsByTagName( "head" )[0].appendChild( e ); 
		} 
	} // load_stylesheet_inline
			
	function checkSpices( recipe ) {
		var name = recipe._name;
		if( ! book.queue[ name ] ) {

			var content = ['/* Chili -- ' + name + ' */'];
			for (var blockName in recipe) {
				if( blockName.search( /^_(?!main\b)/ ) < 0 ) {
					for (var stepName in recipe[ blockName ]) {
						var step = recipe[ blockName ][ stepName ];
						if( '_style' in step ) {
							if( step[ '_style' ].constructor == String ) {
								content.push( '.' + name + '__' + stepName + ' { ' + step[ '_style' ] + ' }' );
							}
							else {
								for (var className in step[ '_style' ]) {
									content.push( '.' + name + '__' + className + ' { ' + step[ '_style' ][ className ] + ' }' );
								}
							}
						}
					}
				}
			}
			content = content.join('\n');

			load_stylesheet_inline( content );

			book.queue[ name ] = true;
		}
	} // checkSpices

	function askDish( el ) {
		var recipeName = book.codeLanguage( el );
		if( '' != recipeName ) {
			var path = getPath( recipeName );
			if( book.recipeLoading ) {
				/* dynamic setups come here */
				if( ! book.queue[ path ] ) {
					/* this is a new recipe to download */
					try {
						book.queue[ path ] = [ el ];
						$.getJSON( path, function( recipeLoaded ) {
							book.recipes[ path ] = recipeLoaded;
							var q = book.queue[ path ];
							for( var i = 0, iTop = q.length; i < iTop; i++ ) {
								makeDish( q[ i ], path );
							}
						} );
					}
					catch( recipeNotAvailable ) {
						alert( "the recipe for '" + recipeName + "' was not found in '" + path + "'" );
					}
				}
				else {
					/* not a new recipe, so just enqueue this element */
					book.queue[ path ].push( el );
				}
				/* a recipe could have been already downloaded */
				makeDish( el, path ); 
			}
			else {
				/* static setups come here */
				makeDish( el, path );
			}
		}
	} // askDish

	function makeDish( el, recipePath ) {
		var recipe = book.recipes[ recipePath ];
		if( ! recipe ) {
			return;
		}
		var $el = $( el );
		var ingredients = $el.text();
		if( ! ingredients ) {
			return;
		}
		// hack for IE: \r is used instead of \n
		ingredients = ingredients.replace(/\r\n?/g, "\n");

		var dish = cook( ingredients, recipe ); // all happens here
	
		if( book.replaceTab ) {
			dish = dish.replace( /\t/g, book.replaceTab );
		}
		if( book.replaceNewLine ) {
			dish = dish.replace( /\n/g, book.replaceNewLine );
		}

		el.innerHTML = dish; //much faster than $el.html( dish );

		if( ChiliBook.preFixCopy ) {
			$el
			.parents()
			.filter( "pre" )
			.bind( "mousedown", function() {
				ChiliBook.preElement = this;
			} )
			.bind( "mouseup", function() {
				if( ChiliBook.preElement == this ) {
					ChiliBook.preContent = document.selection.createRange().htmlText;
				}
			} )
			;
		}
	} // makeDish

	function getPath( recipeName ) {
		return book.recipeFolder + recipeName + ".js";
	} // getPath



//-----------------------------------------------------------------------------
// the coloring starts here
	this
	.each( function() {
		var $this = $( this );
		$this.trigger( 'chili.before_coloring' );
		askDish( this );
		$this.trigger( 'chili.after_coloring' );
	} );

	return this;
//-----------------------------------------------------------------------------
};



//main
$( function() {

	if( ChiliBook.automatic ) {
		$( ChiliBook.automaticSelector ).chili();
	}

	if( ChiliBook.preFixCopy ) {
		function preformatted( text ) {
			if( '' == text ) { 
				return ""; 
			}
			do { 
				var newline_flag = ChiliBook.unique();
			}
			while( text.indexOf( newline_flag ) > -1 );
			text = text.replace( /\<br[^>]*?\>/ig, newline_flag );
			var el = document.createElement( '<pre>' );
			el.innerHTML = text;
			text = el.innerText.replace( new RegExp( newline_flag, "g" ), '\r\n' );
			return text;
		}

		$( "body" )
		.bind( "copy", function() {
			if( '' != ChiliBook.preContent ) {
				window.clipboardData.setData( 'Text', preformatted( ChiliBook.preContent ) );
				event.returnValue = false;
			}
		} )
		.bind( "mousedown", function() {
			ChiliBook.preContent = "";
		} )
		.bind( "mouseup", function() {
			ChiliBook.preElement = null;
		} )
		;
	}

} );

} ) ( jQuery );
