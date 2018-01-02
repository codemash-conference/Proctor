/* jshint -W121 */
/* jshint -W061 */
/* jshint -W004 */
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
        return this.substr(position || 0, searchString.length) === searchString;
    };
}

String.prototype.toDateFromAspNet = function() {
    var dte = eval("new " + this.replace(/\//g, '') + ";");
    dte.setMinutes(dte.getMinutes() - dte.getTimezoneOffset());
    return dte;
};

if (!String.prototype.padZero) {
    String.prototype.padZero = function (len, c) {
        var s = this, c = c || '0';
        while (s.length < len) { s = c + s; }
        return s;
    };
}

String.prototype.right = function(len) {
    var s = this;
    return s.substr(s.length - len);
};

if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}
