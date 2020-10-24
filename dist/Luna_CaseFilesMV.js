//=============================================================================
// Luna_CaseFilesMV.js
//=============================================================================
//=============================================================================
// Build Date: 2020-10-24 16:15:26
//=============================================================================
//=============================================================================
// Made with LunaTea -- Haxe
//=============================================================================

// Generated by Haxe 4.1.3
/*:
@author LunaTechs - Kino
@plugindesc A plugin that allows items to be used as case files in your game <LunaCaseFiles>.

@target MV MZ



@param backgroundImageName
@text Background Image Name
@desc Background image name fromyour picture folders

@param caseFileFontSize
@text Case File Font Size
@desc The font size used for the case file information window
@default 14

@help
==== How To Use ====

Add <LNCFile> to the item note tag to have it qualify as a case file.

Add the case file note tag to an item in the database to have it appear
in the case file screen.

How to Call the scene?
LunaCaseFiles.gotoCaseFileScene()

MIT License
Copyright (c) 2020 LunaTechsDev
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE
*/





(function ($hx_exports, $global) { "use strict"
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {};
class EReg {
	constructor(r,opt) {
		this.r = new RegExp(r,opt.split("u").join(""))
	}
	match(s) {
		if(this.r.global) {
			this.r.lastIndex = 0
		}
		this.r.m = this.r.exec(s)
		this.r.s = s
		return this.r.m != null;
	}
	matched(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) {
			return this.r.m[n];
		} else {
			throw haxe_Exception.thrown("EReg::matched")
		}
	}
}
EReg.__name__ = true
class LunaCaseFiles {
	static main() {
		let _this = $plugins
		let _g = []
		let _g1 = 0
		while(_g1 < _this.length) {
			let v = _this[_g1]
			++_g1
			if(new EReg("<LunaCaseFiles>","ig").match(v.description)) {
				_g.push(v)
			}
		}
		let plugin = _g[0]
		let string = plugin.parameters["caseFileFontSize"]
		LunaCaseFiles.Params = { backgroundImageName : plugin.parameters["backgroundImageName"], caseFileFontSize : parseInt(string,10)}
	}
	static params() {
		return LunaCaseFiles.Params;
	}
	static gotoCaseFileScene() {
		SceneManager.push(SceneCaseFiles)
	}
}
$hx_exports["LunaCaseFiles"] = LunaCaseFiles
LunaCaseFiles.__name__ = true
Math.__name__ = true
class SceneCaseFiles extends Scene_MenuBase {
	constructor() {
		super();
		this._caseFileList = []
		this.setupCaseFiles()
	}
	setupCaseFiles() {
		let _this = $gameParty.items()
		let _g = []
		let _g1 = 0
		while(_g1 < _this.length) {
			let v = _this[_g1]
			++_g1
			if(new EReg("<LNCFile>([\\S\\s]*)</LNCFile>","igm").match(v.note)) {
				_g.push(v)
			}
		}
		let result = new Array(_g.length)
		let _g2 = 0
		let _g3 = _g.length
		while(_g2 < _g3) {
			let i = _g2++
			let item = _g[i]
			let re = new EReg("<LNCFile>([\\S\\s]*)</LNCFile>","igm")
			re.match(item.note)
			result[i] = { name : item.name, text : re.matched(1), image : null}
		}
		this._caseFileList = result
	}
	create() {
		super.create()
		this.createAllWindows()
	}
	createBackground() {
		this._backgroundSprite = new Sprite()
		this._backgroundSprite.bitmap = ImageManager.loadPicture(LunaCaseFiles.Params.backgroundImageName)
		this.addChild(this._backgroundSprite)
		this.setBackgroundOpacity(192)
	}
	createAllWindows() {
		this.createCaseFileHelpWindow()
		this.createCaseFileInfoWindow()
		this.createCaseFileListWindow()
	}
	createCaseFileHelpWindow() {
		this._caseFileHelpWindow = new Window_Help(1)
		this._caseFileHelpWindow.setText("Case Files")
		this.addWindow(this._caseFileHelpWindow)
	}
	createCaseFileInfoWindow() {
		let helpWinOffsetY = this._caseFileHelpWindow.height
		this._caseFileInfoWindow = new WindowCaseInfo(0,helpWinOffsetY,Graphics.boxWidth / 1.5,Graphics.boxHeight - helpWinOffsetY)
		this.addWindow(this._caseFileInfoWindow)
	}
	createCaseFileListWindow() {
		let helpWinOffsetY = this._caseFileHelpWindow.height
		let infoWin = this._caseFileInfoWindow
		this._caseFilesListWindow = new WindowCaseFilesList(infoWin.width,helpWinOffsetY,Graphics.boxWidth - infoWin.width,Graphics.boxHeight - helpWinOffsetY)
		this._caseFilesListWindow.setCaseFiles(this._caseFileList)
		this._caseFilesListWindow.setHandler("ok",$bind(this,this.caseFileListOkHandler))
		this.addWindow(this._caseFilesListWindow)
		this._caseFilesListWindow.select(0)
		this._caseFilesListWindow.activate()
		this._caseFilesListWindow.refresh()
	}
	update() {
		super.update()
		this.processSceneTransition()
	}
	processSceneTransition() {
		if(Input.isTriggered("cancel") || TouchInput.isCancelled()) {
			SceneManager.pop()
		}
	}
	caseFileListOkHandler() {
		this._activeCaseFile = this._caseFilesListWindow._caseFiles[this._caseFilesListWindow.index()]
		if(this._activeCaseFile != null) {
			this.showActiveCaseFile()
		}
	}
	showActiveCaseFile() {
		this._caseFileInfoWindow.showCaseFileText(this._activeCaseFile.text)
	}
}
SceneCaseFiles.__name__ = true
class WindowCaseFilesList extends Window_Selectable {
	constructor(x,y,width,height) {
		super(x,y,width,height);
		this._caseFiles = []
	}
	maxItems() {
		return this._caseFiles.length;
	}
	processOk() {
		if(this.isCurrentItemEnabled()) {
			this.playOkSound()
			this.updateInputData()
			this.callOkHandler()
		} else {
			this.playBuzzerSound()
		}
	}
	setCaseFiles(files) {
		this._caseFiles = files
		this.refresh()
	}
	drawItem(index) {
		let rect = this.itemRectForText(index)
		let caseFile = this._caseFiles[index]
		this.drawTextEx(caseFile.name,rect.x,rect.y)
	}
}
WindowCaseFilesList.__name__ = true
class WindowCaseInfo extends Window_Base {
	constructor(x,y,width,height) {
		super(x,y,width,height);
	}
	showCaseFileText(text) {
		this._caseText = text
		this.refresh()
	}
	clearCaseFileText() {
		this._caseText = ""
		this.refresh()
	}
	drawTextEx(text,x,y) {
		if(text) {
			let textState = { index : 0, x : x, y : y, left : x, text : "", height : 0}
			textState.text = this.convertEscapeCharacters(text)
			textState.height = this.calcTextHeight(textState,false)
			this.resetFontSettings()
			while(textState.index < textState.text.length) {
				let textUpToIndex = textState.text.substring(0,textState.index)
				if(this.textWidth(textUpToIndex) > this.contentsWidth() && textUpToIndex.charAt(textState.index) != "\n") {
					textState.text = textUpToIndex + "\n" + textState.text.substring(textState.index,textState.text.length - 1)
					console.log("src/WindowCaseInfo.hx:55:",textState.text)
				}
				this.processCharacter(textState)
			}
			return textState.x - x;
		} else {
			return 0;
		}
	}
	refresh() {
		if(this.contents != null) {
			this.contents.clear()
			this.paintText()
		}
	}
	paintText() {
		this.drawTextEx(this._caseText,0,0)
	}
}
WindowCaseInfo.__name__ = true
class haxe_Exception extends Error {
	constructor(message,previous,native) {
		super(message);
		this.message = message
		this.__previousException = previous
		this.__nativeException = native != null ? native : this
	}
	get_native() {
		return this.__nativeException;
	}
	static thrown(value) {
		if(((value) instanceof haxe_Exception)) {
			return value.get_native();
		} else if(((value) instanceof Error)) {
			return value;
		} else {
			let e = new haxe_ValueException(value)
			return e;
		}
	}
}
haxe_Exception.__name__ = true
class haxe_ValueException extends haxe_Exception {
	constructor(value,previous,native) {
		super(String(value),previous,native);
		this.value = value
	}
}
haxe_ValueException.__name__ = true
class haxe_iterators_ArrayIterator {
	constructor(array) {
		this.current = 0
		this.array = array
	}
	hasNext() {
		return this.current < this.array.length;
	}
	next() {
		return this.array[this.current++];
	}
}
haxe_iterators_ArrayIterator.__name__ = true
class js_Boot {
	static __string_rec(o,s) {
		if(o == null) {
			return "null";
		}
		if(s.length >= 5) {
			return "<...>";
		}
		let t = typeof(o)
		if(t == "function" && (o.__name__ || o.__ename__)) {
			t = "object"
		}
		switch(t) {
		case "function":
			return "<function>";
		case "object":
			if(o.__enum__) {
				let e = $hxEnums[o.__enum__]
				let n = e.__constructs__[o._hx_index]
				let con = e[n]
				if(con.__params__) {
					s = s + "\t"
					return n + "(" + ((function($this) {
						var $r
						let _g = []
						{
							let _g1 = 0
							let _g2 = con.__params__
							while(true) {
								if(!(_g1 < _g2.length)) {
									break
								}
								let p = _g2[_g1]
								_g1 = _g1 + 1
								_g.push(js_Boot.__string_rec(o[p],s))
							}
						}
						$r = _g
						return $r;
					}(this))).join(",") + ")"
				} else {
					return n;
				}
			}
			if(((o) instanceof Array)) {
				let str = "["
				s += "\t";
				let _g = 0
				let _g1 = o.length
				while(_g < _g1) {
					let i = _g++
					str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
				}
				str += "]";
				return str;
			}
			let tostr
			try {
				tostr = o.toString
			} catch( _g ) {
				return "???";
			}
			if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
				let s2 = o.toString()
				if(s2 != "[object Object]") {
					return s2;
				}
			}
			let str = "{\n"
			s += "\t";
			let hasp = o.hasOwnProperty != null
			let k = null
			for( k in o ) {
			if(hasp && !o.hasOwnProperty(k)) {
				continue
			}
			if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
				continue
			}
			if(str.length != 2) {
				str += ", \n";
			}
			str += s + k + " : " + js_Boot.__string_rec(o[k],s);
			}
			s = s.substring(1)
			str += "\n" + s + "}";
			return str;
		case "string":
			return o;
		default:
			return String(o);
		}
	}
}
js_Boot.__name__ = true
class _$LTGlobals_$ {
}
_$LTGlobals_$.__name__ = true
class utils_Fn {
	static proto(obj) {
		return obj.prototype;
	}
	static updateProto(obj,fn) {
		return (fn)(obj.prototype);
	}
	static updateEntity(obj,fn) {
		return (fn)(obj);
	}
}
utils_Fn.__name__ = true
var $_
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $global.$haxeUID++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
$global.$haxeUID |= 0
String.__name__ = true
Array.__name__ = true
js_Boot.__toStr = ({ }).toString
LunaCaseFiles.listener = new PIXI.utils.EventEmitter()
LunaCaseFiles.main()
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this)

//# sourceMappingURL=Luna_CaseFilesMV.js.map