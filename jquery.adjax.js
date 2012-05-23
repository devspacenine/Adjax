/*************************************************************************
 * 
 * DEVSPACENINE CONFIDENTIAL
 * __________________
 * 
 *  [2009] - [2012] DevSpaceNine 
 *  All Rights Reserved.
 * 
 * NOTICE:  All information contained herein is, and remains
 * the property of DevSpaceNine and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to DevSpaceNine
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from DevSpaceNine.
 */
(function($) {
	/*
	 * Fallback for browsers without a console.
	 */
	if(!window.console) window.console = {log: function(){}};
	
	/*
	 * Array.indexOf prototype
	 */
	if (!Array.prototype.indexOf)
	{
	  Array.prototype.indexOf = function(searchElement /*, fromIndex */)
	  {
	    "use strict";
	
	    if (this === void 0 || this === null)
	      throw new TypeError();
	
	    var t = Object(this);
	    var len = t.length >>> 0;
	    if (len === 0)
	      return -1;
	
	    var n = 0;
	    if (arguments.length > 0)
	    {
	      n = Number(arguments[1]);
	      if (n !== n) // shortcut for verifying if it's NaN
	        n = 0;
	      else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
	        n = (n > 0 || -1) * Math.floor(Math.abs(n));
	    }
	
	    if (n >= len)
	      return -1;
	
	    var k = n >= 0
	          ? n
	          : Math.max(len - Math.abs(n), 0);
	
	    for (; k < len; k++)
	    {
	      if (k in t && t[k] === searchElement)
	        return k;
	    }
	    return -1;
	  };
	}
	
	/*
	 * RegExp function for escaping characters to work in a URL
	 */
	RegExp.escape = function(text) {
	  if (!arguments.callee.sRE) {
	    var specials = [
	      '/', '.', '*', '+', '?', '|',
	      '(', ')', '[', ']', '{', '}', '\\'
	    ];
	    arguments.callee.sRE = new RegExp(
	      '(\\' + specials.join('|\\') + ')', 'g'
	    );
	  }
	  return text.replace(arguments.callee.sRE, '\\$1');
	}

	/*
	 * Future additions
	 */

	//var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
	/*
	// The base Class implementation (does nothing)
		this.Class = function(){};
  
		// Create a new Class that inherits from this class
	Class.extend = function(prop) {
		var _super = this.prototype;

	    // Instantiate a base class (but only create the instance,
	    // don't run the init constructor)
	    initializing = true;
	    var prototype = new this();
	    initializing = false;

	    // Copy the properties over onto the new prototype
	    for (var name in prop) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == "function" && 
			typeof _super[name] == "function" && fnTest.test(prop[name]) ?
				(function(name, fn){
      				return function() {
						var tmp = this._super;
        
						// Add a new ._super() method that is the same method
						// but on the super-class
						this._super = _super[name];
        
						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						var ret = fn.apply(this, arguments);        
						this._super = tmp;
        
						return ret;
					};
				})(name, prop[name]) :
				prop[name];
		}

		// The dummy class constructor
		function Class() {
			// All construction is actually done in the init method
			if ( !initializing && this.init )
			this.init.apply(this, arguments);
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		return Class;
	};
	
	// Matches a valid block title
	var reBlockTitle = /^[a-zA-Z][a-zA-Z\-]*[a-zA-Z]$/,
	
		aDjax = {
			
			// A Tree of blocks of the same type
			BlockTree: Class.extend({
				init: function(type, context) {
					// Unique string identifier for this branch
					this.type = type;
					// Context object for this branch
					this.context = context;
					// The height of this branch
					this.height = 0;
				},
				
				// Set the root node of this tree
				setRoot: function(block) {
					if(!_(this.root).isUndefined()){
						throw "The root node has already been set.";
					}
					// Set the block's depth to 1
					block.depth = 1;
					this.root = block;
					this.height = 1;
					this.children[block.title] = block;
					// Return the depth of the block
					return 1;
				}
			}),
			
			// A tree of blocks for stylesheets.
			StylesheetTree: BlockTree.extend({
				init: function() {
					this._super("stylesheet", document.head);
					this.stylesheetCache = {};
				}
			}),
			
			// A tree of blocks for meta tags, title, and a canonical
			// link.
			MetaTagTree: BlockTree.extend({
				init: function() {
					this._super("meta", document.head);
					this.metaCache = {};
				}
			}),
			
			// A tree of blocks for HTML content inside of the body tag
			HtmlTree: BlockTree.extend({
				init: function() {
					this._super("html", document.body);
					this.htmlCache = {};
				}
			}),
			
			Block: Class.extend({
				init: function(tree, title, parent) {
					// The Type of this block, a reference to a BlockTree
					this.tree = tree;
					// Unique string identifier for this type of block
					if(reBlockTitle.test(title)){
						this.title = title;
					}else{
						throw "The value "+title+" is not a valid block title";
					}
					// Set the parent of this block. Null for root nodes. There
					// should only be one root node of every type.
					if(!parent){
						if(typeof this.tree.root === 'undefined'){
							// The first node defined for a tree is the root
							// node.
							this.parent = null;
							this.depth = this.tree.setRoot(this);
						}else{
							// By default, set the root node of the tree as
							// the parent for new nodes.
							this.parent = this.tree.anonymous;
							this.depth = this.tree.addOrphan(this);
						}
					}else{
						this.parent = parent;
						// Add this block to the collection of child nodes.
						this.depth = this.tree.addChild(this);
					}
				}
			})
		};
	
	aDjax.prototype = {
		init: function(options) {
			// Default options
			this.$ite = $.extend({
				domain: 'http://' + document.domain + (window.location.port == "" ? "" : ":" + window.location.port) + "/",
				staticURL: '/static/',
				mediaURL: '/media/',
				adminURL: '/admin/'
			}, options);
			
			
		}
	};
	*/
	
	/*
	 * Object that contains all of the plugin's functions and
	 * global variables.
	 */
	var $ite = {
	  domain : "http://" + document.domain + (window.location.port == "" ? "" : ":" + window.location.port) + "/",
	  current_hash : '',
	  static_url: '/static/',
	  media_url: '/media/',
	  path_name : window.location.pathname,
	  pages : {},
	  urls: {},
	  animations : {},
	  search_query: '',
	  current_request : null,
	  validators: {},
	  timeout_id: 0,
	  stylesheets: [],
	  ie_stylesheets: [],
	  active_stylesheet_index: 0,
	  active_ie_stylesheet_index: 0,
	  supports_history_api: !!(window.history && history.pushState),
	  supports_placeholder: (('placeholder' in document.createElement("input")) ? true : false)
	};
	
	/*
	 * URL router (based off of Sherpa for node.js)
	 */
	$ite.Sherpa = {
	  Router: function(options) {
	    this.routes = {};
	    this.root = new $ite.Sherpa.Node();
	    this.requestKeys = options && options['requestKeys'] || ['method'];
	  },
	  Path: function(route, uri) {
	    this.route = route;
	    var splitUri = this.pathSplit(uri);
	
	    this.compiledUri = [];
	
	    for (var splitUriIdx = 0; splitUriIdx != splitUri.length; splitUriIdx++) {
	      if (splitUri[splitUriIdx].substring(0, 1) == ':') {
	        this.compiledUri.push("params['" + splitUri[splitUriIdx].substring(1) + "']");
	      } else {
	        this.compiledUri.push("'" + splitUri[splitUriIdx] + "'");
	      }
	    }
	
	    this.compiledUri = this.compiledUri.join('+');
	
	    this.groups = [];
	
	    for (var splitIndex = 0; splitIndex < splitUri.length; splitIndex++) {
	      var part = splitUri[splitIndex];
	      if (part == '/') {
	        this.groups.push([]);
	      } else if (part != '') {
	        this.groups[this.groups.length - 1].push(part);
	      }
	    }
	  },
	  Route: function(router, uri) {
	    this.router = router;
	    this.requestConditions = {};
	    this.matchingConditions = {};
	    this.variableNames = [];
	    var paths = [""];
	    var chars = uri.split('');
	
	    var startIndex = 0;
	    var endIndex = 1;
	
	    for (var charIndex = 0; charIndex < chars.length; charIndex++) {
	      var c = chars[charIndex];
	      if (c == '(') {
	        // over current working set, double paths
	        for (var pathIndex = startIndex; pathIndex != endIndex; pathIndex++) {
	          paths.push(paths[pathIndex]);
	        }
	        // move working set to newly copied paths
	        startIndex = endIndex;
	        endIndex = paths.length;
	      } else if (c == ')') {
	        // expand working set scope
	        startIndex -= (endIndex - startIndex);
	      } else {
	        for (var i = startIndex; i != endIndex; i++) {
	          paths[i] += c;
	        }
	      }
	    }
	
	    this.partial = false;
	    this.paths = [];
	    for (var pathsIdx = 0; pathsIdx != paths.length; pathsIdx++) {
	      this.paths.push(new $ite.Sherpa.Path(this, paths[pathsIdx]));
	    }
	  },
	  Node: function() {
	    this.reset();
	  },
	  Response: function(path, params) {
	    this.path = path
	    this.route = path.route;
	    this.paramsArray = params;
	    this.destination = this.route.destination;
	    this.params = {};
	    for (var varIdx = 0; varIdx != this.path.variableNames.length; varIdx++) {
	      this.params[this.path.variableNames[varIdx]] = this.paramsArray[varIdx];
	    }
	  }
	};
	
	$ite.Sherpa.Node.prototype = {
	  reset: function() {
	    this.linear = [];
	    this.lookup = {};
	    this.catchall = null;
	  },
	  dup: function() {
	    var newNode = new $ite.Sherpa.Node();
	    for(var idx = 0; idx != this.linear.length; idx++) {
	      newNode.linear.push(this.linear[idx]);
	    }
	    for(var key in this.lookup) {
	      newNode.lookup[key] = this.lookup[key];
	    }
	    newNode.catchall = this.catchall;
	    return newNode;
	  },
	  addLinear: function(regex, count) {
	    var newNode = new $ite.Sherpa.Node();
	    this.linear.push([regex, count, newNode]);
	    return newNode;
	  },
	  addCatchall: function() {
	    if (!this.catchall) {
	      this.catchall = new $ite.Sherpa.Node();
	    }
	    return this.catchall;
	  },
	  addLookup: function(part) {
	    if (!this.lookup[part]) {
	      this.lookup[part] = new $ite.Sherpa.Node();
	    }
	    return this.lookup[part];
	  },
	  addRequestNode: function() {
	    if (!this.requestNode) {
	      this.requestNode = new $ite.Sherpa.Node();
	      this.requestNode.requestMethod = null;
	    }
	    return this.requestNode;
	  },
	  find: function(parts, request, params) {
	    if (this.requestNode || this.destination && this.destination.route.partial) {
	      var target = this;
	      if (target.requestNode) {
	        target = target.requestNode.findRequest(request);
	      }
	      if (target && target.destination && target.destination.route.partial) {
	        return new $ite.Sherpa.Response(target.destination, params);
	      }
	    }
	    if (parts.length == 0) {
	      var target = this;
	      if (this.requestNode) {
	        target = this.requestNode.findRequest(request);
	      }
	      return target && target.destination ? new $ite.Sherpa.Response(target.destination, params) : undefined;
	    } else {
	      if (this.linear.length != 0) {
	        var wholePath = parts.join('/');
	        for (var linearIdx = 0; linearIdx != this.linear.length; linearIdx++) {
	          var lin = this.linear[linearIdx];
	          var match = lin[0].exec(wholePath);
	          if (match) {
	            var matchedParams = [];
	            if (match[1] === undefined) {
	              matchedParams.push(match[0]);
	            } else {
	              for (var matchIdx = 1; matchIdx <= lin[1] + 1; matchIdx++) {
	                matchedParams.push(match[matchIdx]);
	              }
	            }
	
	            var newParams = params.concat(matchedParams);
	            matchedIndex = match.shift().length;
	            var resplitParts = wholePath.substring(matchedIndex).split('/');
	            if (resplitParts.length == 1 && resplitParts[0] == '') resplitParts.shift();
	            var potentialMatch = lin[2].find(resplitParts, request, newParams);
	            if (potentialMatch) return potentialMatch;
	          }
	        }
	      }
	      if (this.lookup[parts[0]]) {
	        var potentialMatch = this.lookup[parts[0]].find(parts.slice(1, parts.length), request, params);
	        if (potentialMatch) return potentialMatch;
	      }
	      if (this.catchall) {
	        var part = parts.shift();
	        params.push(part);
	        return this.catchall.find(parts, request, params);
	      }
	    }
	    return undefined;
	  },
	  findRequest: function(request) {
	    if (this.requestMethod) {
	      if (this.linear.length != 0 && request[this.requestMethod]) {
	        for (var linearIdx = 0; linearIdx != this.linear.length; linearIdx++) {
	          var lin = this.linear[linearIdx];
	          var match = lin[0].exec(request[this.requestMethod]);
	          if (match) {
	            matchedIndex = match.shift().length;
	            var potentialMatch = lin[2].findRequest(request);
	            if (potentialMatch) return potentialMatch;
	          }
	        }
	      }
	      if (request[this.requestMethod] && this.lookup[request[this.requestMethod]]) {
	        var potentialMatch = this.lookup[request[this.requestMethod]].findRequest(request);
	        if (potentialMatch) {
	          return potentialMatch;
	        }
	      }
	      if (this.catchall) {
	        return this.catchall.findRequest(request);
	      }
	    } else if (this.destination) {
	      return this;
	    } else {
	      return undefined;
	    }
	  },
	  transplantValue: function() {
	    if (this.destination && this.requestNode) {
	      var targetNode = this.requestNode;
	      while (targetNode.requestMethod) {
	        targetNode = (targetNode.addCatchall());
	      }
	      targetNode.destination = this.destination;
	      this.destination = undefined;
	    }
	  },
	  compileRequestConditions: function(router, requestConditions) {
	    var currentNodes = [this];
	    var requestMethods = router.requestKeys;
	    for (var requestMethodIdx in requestMethods) {
	      var method = requestMethods[requestMethodIdx];
	      if (requestConditions[method]) {// so, the request method we care about it ..
	        if (currentNodes.length == 1 && currentNodes[0] === this) {
	          currentNodes = [this.addRequestNode()];
	        }
	
	        for (var currentNodeIndex = 0; currentNodeIndex != currentNodes.length; currentNodeIndex++) {
	          var currentNode = currentNodes[currentNodeIndex];
	          if (!currentNode.requestMethod) {
	            currentNode.requestMethod = method
	          }
	
	          var masterPosition = requestMethods.indexOf(method);
	          var currentPosition = requestMethods.indexOf(currentNode.requestMethod);
	
	          if (masterPosition == currentPosition) {
	            if (requestConditions[method].compile) {
	              currentNodes[currentNodeIndex] = currentNodes[currentNodeIndex].addLinear(requestConditions[method], 0);
	            } else {
	              currentNodes[currentNodeIndex] = currentNodes[currentNodeIndex].addLookup(requestConditions[method]);
	            }
	          } else if (masterPosition < currentPosition) {
	            currentNodes[currentNodeIndex] = currentNodes[currentNodeIndex].addCatchall();
	          } else {
	            var nextNode = currentNode.dup();
	            currentNode.reset();
	            currentNode.requestMethod = method;
	            currentNode.catchall = nextNode;
	            currentNodeIndex--;
	          }
	        }
	      } else {
	        for (var currentNodeIndex = 0; currentNodeIndex != currentNodes.length; currentNodeIndex++) {
	          var node = currentNodes[currentNodeIndex];
	          if (!node.requestMethod && node.requestNode) {
	            node = node.requestNode;
	          }
	          if (node.requestMethod) {
	            currentNodes[currentNodeIndex] = node.addCatchall();
	            currentNodes[currentNodeIndex].requestMethod = null;
	          }
	        }
	      }
	    }
	    this.transplantValue();
	    return currentNodes;
	  }
	};
	
	$ite.Sherpa.Router.prototype = {
	  generate: function(name, params) {
	    return this.routes[name].generate(params);
	  },
	  add: function(uri, options) {
	    var route = new $ite.Sherpa.Route(this, uri);
	    if (options) route.withOptions(options);
	    return route;
	  },
	  recognize: function(path, request) {
	    if (path.substring(0,1) == '/') path = path.substring(1);
	    return this.root.find(path == '' ? [] : path.split(/\//), request, []);
	  }
	};
	
	$ite.Sherpa.Route.prototype = {
	  withOptions: function(options) {
	    if (options['conditions']) {
	      this.condition(options['conditions']);
	    }
	    if (options['matchesWith']) {
	      this.matchesWith(options['matchesWith']);
	    }
	    if (options['matchPartially']) {
	      this.matchPartially(options['matchPartially']);
	    }
	    if (options['name']) {
	      this.matchPartially(options['name']);
	    }
	    return this;
	  },
	  name: function(routeName) {
	    this.router.routes[routeName] = this;
	    return this;
	  },
	  matchPartially: function(partial) {
	    this.partial = (partial === undefined || partial === true);
	    return this;
	  },
	  matchesWith: function(matches) {
	    for (var matchesKey in matches) {
	      this.matchingConditions[matchesKey] = matches[matchesKey];
	    }
	    return this;
	  },
	  compile: function() {
	    for(var pathIdx = 0; pathIdx != this.paths.length; pathIdx++) {
	      this.paths[pathIdx].compile();
	      for (var variableIdx = 0; variableIdx != this.paths[pathIdx].variableNames.length; variableIdx++) {
	        if (this.variableNames.indexOf(this.paths[pathIdx].variableNames[variableIdx]) == -1) this.variableNames.push(this.paths[pathIdx].variableNames[variableIdx]);
	      }
	    }
	  },
	  to: function(destination) {
	    this.compile();
	    this.destination = destination;
	    return this;
	  },
	  condition: function(conditions) {
	    for (var conditionKey in conditions) {
	      this.requestConditions[conditionKey] = conditions[conditionKey];
	    }
	    return this;
	  },
	  generate: function(params) {
	    var path = undefined;
	    if (params == undefined || this.paths.length == 1) {
	      path = this.paths[0].generate(params);
	    } else {
	      for(var pathIdx = this.paths.length - 1; pathIdx >= 0; pathIdx--) {
	        path = this.paths[pathIdx].generate(params);
	        if (path) break;
	      }
	    }
	
	    if (path) {
	      path = encodeURI(path);
	      var query = '';
	      for (var key in params) {
	        query += (query == '' ? '?' : '&') + encodeURIComponent(key).replace(/%20/g, '+') + '=' + encodeURIComponent(params[key]).replace(/%20/g, '+');
	      }
	      return path + query;
	    } else {
	      return undefined
	    }
	  }
	};
	
	$ite.Sherpa.Path.prototype = {
	  pathSplit: function(path) {
	    var splitParts = [];
	    var parts = path.split('/');
	    if (parts[0] == '') parts.shift();
	
	    for(var i = 0; i != parts.length; i++) {
	      splitParts.push("/");
	      splitParts.push("");
	      partChars = parts[i].split('');
	
	      var inVariable = false;
	
	      for (var j = 0; j != partChars.length; j++) {
	        if (inVariable) {
	          var code = partChars[j].charCodeAt(0);
	          if ((code >= 48 && code <= 57) || (code >= 65 && code <= 90) || (code >= 97 && code <= 122) || code == 95) {
	            splitParts[splitParts.length - 1] += partChars[j];
	          } else {
	            inVariable = false;
	            splitParts.push(partChars[j]);
	          }
	        } else if (partChars[j] == ':') {
	          inVariable = true;
	          if (splitParts[splitParts.length - 1] == '') {
	            splitParts[splitParts.length - 1] += ":";
	          } else {
	            splitParts.push(":");
	          }
	        } else {
	          splitParts[splitParts.length - 1] += partChars[j];
	        }
	      }
	    }
	    return splitParts;
	  },
	  generate: function(params) {
	    for(var varIdx = 0; varIdx != this.variableNames.length; varIdx++) {
	      if (!params[this.variableNames[varIdx]]) return undefined;
	    }
	    for(var varIdx = 0; varIdx != this.variableNames.length; varIdx++) {
	      if (this.route.matchingConditions[this.variableNames[varIdx]]) {
	        if (this.route.matchingConditions[this.variableNames[varIdx]].exec(params[this.variableNames[varIdx]].toString()) != params[this.variableNames[varIdx]].toString()) {
	          return undefined;
	        }
	      }
	    }
	    var path = eval(this.compiledUri);
	    for(var varIdx = 0; varIdx != this.variableNames.length; varIdx++) {
	      delete params[this.variableNames[varIdx]];
	    }
	    return path;
	  },
	  compile: function() {
	    this.variableNames = [];
	    var currentNode = this.route.router.root;
	    for(var groupIdx = 0; groupIdx != this.groups.length; groupIdx++) {
	      var group = this.groups[groupIdx];
	      if (group.length > 1) {
	        var pattern = '^';
	        for (var partIndex = 0; partIndex != group.length; partIndex++) {
	          var part = group[partIndex];
	          var captureCount = 0
	          if (part.substring(0,1) == ':') {
	            var variableName = part.substring(1);
	            this.variableNames.push(variableName);
	            pattern += this.route.matchingConditions[variableName] ? this.route.matchingConditions[variableName].toString() : '(.*?)'
	            captureCount += 1
	          } else {
	            pattern += RegExp.escape(part);
	          }
	        }
	        currentNode = currentNode.addLinear(new RegExp(pattern), captureCount);
	      } else if (group.length == 1) {
	        var part = group[0];
	        if (part.substring(0,1) == ':') {
	          var variableName = part.substring(1);
	          this.variableNames.push(variableName);
	          if (this.route.matchingConditions[variableName]) {
	            currentNode = currentNode.addLinear(this.route.matchingConditions[variableName], 1);
	          } else {
	            currentNode = currentNode.addCatchall();
	          }
	        } else {
	          currentNode = currentNode.addLookup(part);
	        }
	      }
	    }
	    var nodes = currentNode.compileRequestConditions(this.route.router, this.route.requestConditions);
	    for (var nodeIdx = 0; nodeIdx != nodes.length; nodeIdx++) {
	      nodes[nodeIdx].destination = this;
	    }
	  }
	};
	
	$ite.Sherpa.Response.prototype = {
		equals: function(r) {
			if(this.destination !== r.destination || this.paramsArray.length !== r.paramsArray.length)
				return false;
			for(var key in this.params)
				if(!r.params.hasOwnProperty(key) || this.params[key] !== r.params[key])
					return false;
			return true;
		}
	};
	
	// Initialize the URL router
	$ite.router = new $ite.Sherpa.Router();
	
	/* 
	 * Utilitiy Functions
	 */
	$.extend($ite.animations, {
		
		replace: function($target, new_html) {
			var dfd = $.Deferred();
			$target.html(new_html);
			dfd.resolve();
			
			return dfd.promise();
		},
		
		append: function($target, new_html) {
			var dfd = $.Deferred(),
			    new_content = $('<div class="new-content-wrapper"/>').html(new_html);
			new_content.appendTo($target).animate({'opacity': 'show'}, 250, function(){
			    $(this).children().unwrap();
			    dfd.resolve();
			});
			
			return dfd.promise();
		},
		
		prepend: function($target, new_html) {
			var dfd = $.Deferred(),
			    new_content = $('<div class="new-content-wrapper"/>').html(new_html);
			new_content.prependTo($target).animate({'opacity': 'show'}, 250, function(){
			    $(this).children().unwrap();
			    dfd.resolve();
			});
			return dfd.promise();
		},
		
		quickAppend: function($target, new_html) {
			var dfd = $.Deferred(),
			    new_content = $(new_html);
			$target.append(new_content);
			dfd.resolve();
			return dfd.promise();
		},
		
		quickPrepend: function($target, new_html) {
			var dfd = $.Deferred(),
			    new_content = $(new_html);
			$target.prepend(new_content);
			dfd.resolve();
			return dfd.promise();
		},
		
		fade: function($target, new_html) {
			var dfd = $.Deferred(),
				new_content = $('<div class="new-content-wrapper"/>').html(new_html),
				start_height = $target.height(),
				start_width = $target.width();
			$target.css({'position': 'relative', 'display': 'block', 'height': start_height, 'width': start_width}).wrapInner('<div class="old-content-wrapper"/>').children().animate({'opacity': 'hide'}, 300, function(){
				$(this).remove();
			});
			$target.append(new_content).animate({'height': new_content.height(), 'width': new_content.width()}, 600).children(':last').animate({'opacity': 'show'}, 600, function(){
		 		$(this).children().unwrap();
				$target.removeAttr('style');
				dfd.resolve();
			});
			return dfd.promise();
		},
		
		slide: function($target, new_html, direction){
			var dfd = $.Deferred(),
				options = {
					'left': ['translate(500px) scale(0.5,1)', 'translate(-500px) scale(0.5,1)', 'translate(0px)'],
					'right': ['translate(-500px) scale(0.5,1)', 'translate(500px) scale(0.5,1)', 'translate(0px)'],
					'up': ['translateY(500px) scale(1, 0.5)', 'translateY(-950px)  scale(1, 0.2)', 'translateY(0px)'],
					'down': ['translateY(-500px)  scale(1, 0.5)', 'translateY(500px)  scale(1, 0.2)', 'translateY(0px)']
				},
				values = options[direction],
				new_content = $('<div class="new-content-wrapper"/>').html(new_html).css({transform: values[0], opacity: '0'}),
				start_height = $target.height(),
				start_width = $target.width(),
				max_height = $target.css('max-height');
			
			$target.css({'position': 'relative', 'display': 'block', 'overflow': 'hidden', 'height': start_height, 'width': start_width}).wrapInner('<div class="old-content-wrapper"/>').children().css({transform: 'translate(0px,0px)'}).animate({transform: values[1], 'opacity': 'hide'}, 800, function(){
				$(this).remove();
			});
	  
			$target.append(new_content).animate({'height': ((new_content.height() > parseInt(max_height)) ? max_height : new_content.height()), 'width': new_content.width()}, 1000).children('.new-content-wrapper').animate({transform: values[2], 'opacity': '1.0'}, 1000, function(){
				$(this).children().unwrap();
				$target.removeAttr('style');
				dfd.resolve();
			});
	  
			return dfd.promise();
		},
		
		slideLeft: function($target, new_html){
			return $ite.animations.slide($target, new_html, 'left');
		},
		
		slideRight: function($target, new_html){
			return $ite.animations.slide($target, new_html, 'right');
		},
		
		slideUp: function($target, new_html){
			return $ite.animations.slide($target, new_html, 'up');
		},
		
		slideDown: function($target, new_html){
			return $ite.animations.slide($target, new_html, 'down');
		},
		
		shrinkHeight: function($target, new_html){
			var dfd = $.Deferred(),
				new_content = $('<div class="new-content-wrapper"/>').html(new_html),
				start_height = $target.height(),
				start_width = $target.width();
				
			$target.css({'position': 'absolute', 'display': 'block', 'overflow': 'hidden', 'height': start_height, 'width': start_width}).wrapInner('<div class="old-content-wrapper"/>').children().animate({'height': 'hide', 'opacity': 'hide'}, 300, function(){
				$(this).remove();
			});
			
			$target.append(new_content).animate({'height': ((new_content.height() > parseInt($target.css('max-height'))) ? $target.css('max-height') : new_content.height())}, 600).children(':last').animate({'height': 'show', 'opacity': 'show'}, 800, function(){
				$(this).children().unwrap();
				$target.removeAttr('style');
				dfd.resolve();
			});
			
			return dfd.promise();
		}
	});
	
	$.extend($ite, {
		switchStylesheet: function(src) {
			var $stylesheets = $(document.head).find('link[rel="stylesheet"]');
			if(src.indexOf('css/ie-aux-') !== -1) {
				$stylesheets.filter('[href*="css/ie-aux-"]').each(function(i){
					if(this.href === src) {
						this.disabled = false;
						$ite.active_ie_stylesheet_index = i;
					}else
						this.disabled = true;
				});
			}else{
				$stylesheets.filter('[href*="css/aux-"]').each(function(i){
					if(this.href === src) {
						this.disabled = false;
						$ite.active_stylesheet_index = i;
					}else
						this.disabled = true;
				});
			}
		},
		
		enableStylesheet: function(src) {
			$(document.head).find('link[rel="stylesheet"][href="'+src+'"]').each(function(i){
				this.disabled = true;
				this.disabled = false;
			});
		},
		
		stylesheetLoaded: function(src) {
			if(src.indexOf('css/ie-aux-') !== -1)
				for(var i=0; i<$ite.ie_stylesheets.length; i++)
					if($ite.ie_stylesheets[i] === src)
						return true;
			else
				for(var i=0; i<$ite.stylesheets.length; i++)
					if($ite.stylesheets[i] === src)
						return true;
			return false;
		},
		
		loadStylesheet: function(src) {
			if(src.indexOf('css/ie-aux-') !== -1)
				$ite.ie_stylesheets.push(src);
			else
				$ite.stylesheets.push(src);
		},
		
		extendStylesheets: function($tags) {
			$tags.each(function(i){
				var href = this.href;
				if(!$ite.stylesheetLoaded(href)) {
					if(document.createStylesheet)
						document.createStylesheet(href);
					else{
						var link = document.createElement('link');
						link.rel = 'stylesheet';
						link.type = 'text/css';
						link.href = href
						document.getElementsByTagName('head')[0].appendChild(link);
					}
					$ite.loadStylesheet(href);
				}
				$ite.enableStylesheet(href);
			});
		},
		
		loadMetaTag: function(newTag) {
			var $head = $(document.head), $meta = $head.find('meta[name="'+newTag.name+'"]');
			if($meta.length === 0)
				$meta = $('<meta name="'+newTag.name+'"/>').appendTo($head);
			$meta.attr('content', newTag.content);
		},
		
		ajaxLoader: function($el, options) {
			this.options = $.extend({
				bgColor: 'transparent',
				duration: 800,
				opacity: 0.4,
				classOveride: false
			}, options);
			this.container = $el;
			this.init = function() {
				var container = this.container;
				// Delete any other loaders
				this.remove();
				// Create the loader
				var loader = $('<img src="'+$ite.static_url+'img/loader.gif" alt="loading..."/>').css({
					'position': 'absolute',
					'display': 'block',
					'top': container.height()/3 - 24,
					'left': container.width()/2 - 24,
					'height': '48px',
					'width': '48px',
					'z-index': 99999
				}).addClass('ajax_loader');
				// add an overriding class name to set the new loader style
				if(this.options.classOveride){
					loader.addClass(this.options.classOveride);
				}
				// Reduce the opacity of the container and insert the loader
				// into DOM
				container.children().css({'opacity': this.options.opacity}).end().append(loader);
			};
			this.remove = function(){
				var loader = this.container.children(".ajax_loader");
				if(!_(loader).isUndefined()) {
					loader.remove();
					this.container.children().css({'opacity': 1.0});
				}
			}
			this.init();
		},
		
		deferredAJAX: function(url, $target, animation, args) {
			var options = $.extend({
				cache: true
			}, args);
			return $.Deferred(function(dfd){
		      //var loading_note = $('<span id="loading-note">Loading...</span>').prependTo($(document.body));
		      var loader = $ite.ajaxLoader($target);
		      $ite.current_request = $.ajax({
		          type: 'GET',
		          cache: options.cache,
		          url: url,
		          data: args,
		          dataType: 'json',
		          error: function(req, stat, errorThrown){},
		          success: function(data, stat){ // Successful AJAX request
		          	// Start loading any new stylesheets
		          	if(typeof data.css !== 'undefined')
		          		$ite.extendStylesheets($(data.css));
		          	// Switch out the canonical links
		          	if(typeof data.canonical !== 'undefined')
		          		$(document.head).find('link[rel="canonical"]').replaceWith($(data.canonical));
		          	// Switch out the meta tags
		          	if(typeof data.meta !== 'undefined') {
			          	$(data.meta).filter('meta').each(function(i){
			          		$ite.loadMetaTag(this);
			          	});
			          	// Update the title tag
			          	document.title = $(data.meta).filter('title').text();
			        }
		          	// Execute pre-scripts
		          	if(typeof data.prescript !== 'undefined')
		          		$.globalEval(data.prescript);
		          	if(typeof data.html !== 'undefined') {
			          	// Start a deferred animation
			          	$.when($ite.animations[animation]($target, data.html)).then(function(){
							if(typeof data.css !== 'undefined') {
								// Switch to the new stylesheets
								$(data.css).each(function(i){
									$ite.switchStylesheet(this.href);
								});
							}
							// Execute post-scripts
							if(typeof data.postscript !== 'undefined')
								$.globalEval(data.postscript);
							// Resolve the deferred for this AJAX request
							dfd.resolve();
						});
					}else{
						if(typeof data.postscript !== 'undefined')
							$.globalEval(data.postscript);
						dfd.resolve();
					}
		          }
		      });
		  }).promise();
		},
		
		hashString: function() {
			return window.location.hash.slice(1);
		},
		
		preLoadImages: function(img_paths) {
			if(img_paths.length !== 0 && typeof(document.images) !== 'undefined') {
				(function loadImage() {
					var img = new Image(),
						src = img_paths.shift();
					
					img.src = src;
					console.log('loading ' + src);
					
					if(img_paths.length > 0)
						img.onload = loadImage;
				})();
			}
		},
		
		changeView: function(args) {
			var data = $.extend({
				animation: 'fade'
			}, args);
			if(_(data.target).isString() && _(data.node).isString() && _(data.url).isString()) {
				if(_(data.group).isString() && _(data.id).isString()) {
					var group = $(data.group),
						selected = group.filter('.selected').data('name'),
						animation = '';
					if(!_(data.animation).isString())
						animation = data.animation[selected];
					else
						animation = data.animation;
					$ite.deferredAJAX(data.url, $(data.target), animation, {"node": data.node});
					$ite.changeSelection(group, data.id);
				}else{
					$ite.deferredAJAX(data.url, $(data.target), data.animation, {"node": data.node});
					if(_(data.select).isString() && _(data.select_group).isString()) {
						$(data.select_group).filter('.selected').removeClass('selected');
						$(data.select).addClass('selected');
					}
				}
			}
		},
		
		changeSelection: function($options, selector) {
			$options.filter('.selected').removeClass('selected').end().filter(selector).addClass('selected');
		},
		
		getRoute: function(path) {
			var p = $ite.router.recognize(path);
			if(_(p).isUndefined())
				return p;
			var defaults = (_($ite.pages[p.destination]['defaults']).isUndefined()) ? {} : $ite.pages[p.destination]['defaults'];
			for(var key in defaults)
				if(!p.params.hasOwnProperty(key)) {
					p.paramsArray.push(defaults[key]);
					p.params[key] = defaults[key];
				}
			return p;
		},
		
		initRoutes: function() {
			$.each($ite.pages, function(key, page){
				$ite.router.add(page.path, (_(page.args).isUndefined()) ? page.args : {}).to(key);
			});
			$ite.current_page = $ite.getRoute(window.location.pathname.slice(0,-1));
		},
		
		notify: function(args) {
			var opt = $.extend({
				'title': 'Alert',
				'message': ''
			}, args);
			if(_($ite.notify_screen).isUndefined()) {
				$('<div id="notify-screen"><div id="notify-prompt" class="span-10 last"><h2 id="notify-title" class="span-10 last"></h2><p id="notify-msg" class="span-10 last"></p><a href="#" id="close-notify"><img src="'+$ite.static_url+'img/close-icon.png" alt="close"/></a></div></div>').prependTo($(document.body));
				$ite.notify_screen = $('#notify-screen');
				$ite.notify_screen.delegate('#close-notify', 'click', function(e){
			    	$ite.notify_screen.removeClass('show');
			    	return false;
			    });
			}
			$ite.notify_screen.find('#notify-title').html(opt.title).next().html(opt.message);
			$ite.notify_screen.addClass('show');
		}
		
	});
	
	$.extend($.fn, {
		manageForm: function(args) {
			var opt = $.extend({
				'feedbackHandler': $ite.notify
			}, args);
			return this.each(function(){
				var $f = $(this),
					$id = (!_($f.attr('id')).isUndefined()) ? $f.attr('id') : (!_($f.attr('title')).isUndefined()) ? $f.attr('title') : (!_($f.attr('name')).isUndefined()) ? $f.attr('name') : 'unnamed';
				$ite.validators[$id] = $f.validate({
					submitHandler: function(form){
						$f = $(form);
						var form_data = $f.serialize();
						$.ajax({
							type: 'POST',
							url: (_(opt.action).isUndefined()) ? $f.attr('action') : opt.action,
							data: form_data,
							dataType: 'json',
							success: function(data){
								if(data.success)
									$f.clearForm();
								else
									$f.html(data.html);
								if(!_(data.message).isUndefined())
									opt.feedbackHandler(data.message);
							}
						});
					}
				});
			});
		},
	
		clearForm: function(args) {
			var opt = $.extend({
				'includeHidden': false
			}, args);
			var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
			return this.each(function() {
				var t = this.type, tag = this.tagName.toLowerCase();
			    if(tag === 'form')
					return $(this).find('ul.errorlist').remove().end().find('.error').removeClass('error').end().find(':input').clearForm();
			    if(re.test(t) || tag === 'textarea' || (opt.includeHidden && /hidden/i.test(t)))
					this.value = '';
			    else if(t === 'checkbox' || t === 'radio')
					this.checked = false;
			    else if(tag === 'select')
					this.selectedIndex = -1;
		  });
		}
	});
	
	//Test for History API support
	if($ite.supports_history_api) {
		$.extend($ite, {
			/*
			* $ite.makeHistory. Changes the URL path for browsers other than
			* Internet Explorer.
			*
			* @param el - The element with the HREF to push to.
			*/
			makeHistory: function(el) {
				var newPath = el.href.split($ite.domain.slice(0,-1)).pop(),
					page = $ite.getRoute(newPath.slice(0,-1)),
					data = $(el).data();
				// If the this links to the current page, exit out of this function
				if(page.equals($ite.current_page))
					return;
				// Update previous page variable
				$ite.previous_page = (_($ite.previous_page).isUndefined()) ? $ite.getRoute(window.location.pathname.slice(0,-1)) : $ite.current_page;
				// Update location with the history API
				history.pushState(null, null, newPath);
				// Update current page variable
				$ite.current_page = page;
				// Change the view using the link's data variables
				$ite.changeView(data);
			}
		});
	}else{
		//Test browser type. Internet Explorer implements makeHistory differently
		var undef, v = 3, div = document.createElement('div');

		while (
			div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
			div.getElementsByTagName('i')[0]
		);

		v = v > 4 ? v : undef;
  
		if(v<8){
			$.extend($ite, {
				/*
				* $ite.makeHistory. (Internet Explorer) Loads, writes, and closes the
				* iFrame document to create a history marker in Internet Explorer.
				*
				* @param newHash a string to replace the current hash with
				*/
				makeHistory: function(el) {
					var doc = $('#history-frame')[0].contentWindow.document,
						newPath = el.href.split($ite.domain.slice(0,-1)).pop(),
						page = $ite.getRoute(newPath.slice(0,-1));
					if(page.equals($ite.current_page))
						return;
					$ite.data_temp = $(el).data();
					doc.open("javascript:'<html></html>'");
					doc.write("<html><head><script type=\"text/javascript\">parent.$ite.onFrameLoaded('" + newPath + "');</script></head><body></body></html>");
					doc.close();
				},
				
				/*
				* $ite.onFrameLoaded. (Internet Explorer) Called from the iFrame when
				* it is done loading. Changes the URL hash.
				*
				* @param newHash a string to replace the current URL hash with
				*/
				onFrameLoaded: function(newPath) {
					// Update previous page variable
					$ite.previous_page = (typeof $ite.previous_page === 'undefined') ? $ite.getRoute(window.location.pathname.slice(0,-1)) : $ite.current_page;
					// Update location with a hash
					window.location.hash = newPath;
					// Update current page variable
					$ite.current_page = $ite.getRoute(newPath.slice(0,-1));
					// Update the view using the link's data variables
					$ite.changeView($ite.data_temp);
				}
			});
		}else{
			$.extend($ite, {
				/*
				* $ite.makeHistory. Changes the URL hash for browsers other than
				* Internet Explorer.
				*
				* @param newHash a string to replace the current URL hash with
				*
				*/
				makeHistory: function(el) {
					var newPath = el.href.split($ite.domain.slice(0,-1)).pop(),
					page = $ite.getRoute(newPath.slice(0,-1)),
					data = $(el).data();
					// If the this links to the current page, exit out of this function
					if(page.equals($ite.current_page))
						return;
					// Update previous page variable
					$ite.previous_page = (typeof $ite.previous_page === 'undefined') ? $ite.getRoute(window.location.pathname.slice(0,-1)) : $ite.current_page;
					// Update location with a hash
					window.location.hash = newPath;
					// Update current page variable
					$ite.current_page = page;
					// Change the view using the link's data variables
					$ite.changeView(data);
				}
			});
		}
	}
	
	// Expose the $ite variable to the global object
	window.$ite = $ite;
	
	/*
	 * jQuery.ready: Initializes the global object variables, sets an interval
	 * for checking the URL hash, and binds the click event for all 'A' tags
	 * to the body, using event delegation.
	 *
	 */
	$(function() {
		// Initialize some common selections
		$ite.scroll = $('html, body');
		
		// Set up custom validation methods and set them as default rules
		$.validator.addMethod("zipUS", function(val, el){
			return this.optional(el) || /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(val);
		}, "Please enter a valid US zip code.");
		
		$.validator.addMethod("phoneUS", function(val, el){
			val = val.replace(/\s+/g, "");
			return this.optional(el) || val.length > 9 &&
		val.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
		}, "Please enter a valid US phone number.");
		
		$.validator.addMethod("currencyUS", function(val, el){
			return this.optional(el) || /^\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(\.[0-9][0-9])?$/.test(val);
		}, "Please enter a valid US currency.");
		
		$.validator.addClassRules({
			zip: {"zipUS": true},
			phone: {"phoneUS": true},
			dollar: {"currencyUS": true}
		});
	
		// If the History API is supported, bind the popstate event to enable back button
		if($ite.supports_history_api) {
			$(window).bind("popstate", function(e) {
				if(typeof $ite.previous_page !== 'undefined') {
			        $ite.previous_page = $ite.current_page;
					$ite.current_page = $ite.router.recognize((window.location.pathname === '/') ? '/' : window.location.pathname.slice(0,-1));
					$.extend($ite.current_page.params, $ite.pages[$ite.current_page.destination]['extras']);
			        $ite.changeView();
				}
	    	});
		// If the History API is not supported, check to see if hash changes every 150ms
		// with a function called by setTimeout.
		}else{
	  		// Determine what page was loaded initially and set the current_page variable
			if(typeof $ite.previous_page === 'undefined'){
				if($ite.hashString() === '')
					$ite.current_page = $ite.router.recognize((window.location.pathname === '/') ? '/' : window.location.pathname.slice(0,-1));
				else
		  			$ite.current_page = $ite.router.recognize($ite.hashString().slice(0,-1));
		  		$.extend($ite.current_page.params, $ite.pages[$ite.current_page.destination]['extras']);
	        	$ite.previous_page = $ite.current_page;
			}
		}
	
		// Links that are not outbound update the AJAX history
		// and are stopped from propogating. Links with the button class
		// will not trigger a history change.
		$(document.body).delegate('a:not(.button,.outbound)', 'click', function(e) {
			var target = e.target;
		    if(target.nodeName === 'A') {
		    	//$(target).Djax()
				$ite.makeHistory(target);
				return false;
			}else{
				var $parents = $(target).parents('a');
				if($parents.length > 0) {
			        $ite.makeHistory($parents.get(-1));
					return false;
				}
			}
		}).delegate('a.button', 'click', function(e){
			// Prevent default behavior for links with the button class
	    	e.preventDefault();
		});
	  
		// Initialize the lists of auxiliary stylesheets
		var $stylesheets = $(document.head).find('link[rel="stylesheet"]');
		$stylesheets.filter('[href*="css/ie-aux-"]').each(function(i){
			$ite.ie_stylesheets.push(this.href);
		}).end().filter('[href*="css/aux-"]').each(function(i){
			$ite.stylesheets.push(this.href);
		});
		
	});
	
})(jQuery);
