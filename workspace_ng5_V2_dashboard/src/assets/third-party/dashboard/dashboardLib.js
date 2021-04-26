/*! jQuery v2.1.1 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */ ! function (a, b) {
  "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function (a) {
    if (!a.document) throw new Error("jQuery requires a window with a document");
    return b(a)
  } : b(a)
}("undefined" != typeof window ? window : this, function (a, b) {
  var c = [],
    d = c.slice,
    e = c.concat,
    f = c.push,
    g = c.indexOf,
    h = {},
    i = h.toString,
    j = h.hasOwnProperty,
    k = {},
    l = a.document,
    m = "2.1.1",
    n = function (a, b) {
      return new n.fn.init(a, b)
    },
    o = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    p = /^-ms-/,
    q = /-([\da-z])/gi,
    r = function (a, b) {
      return b.toUpperCase()
    };
  n.fn = n.prototype = {
    jquery: m,
    constructor: n,
    selector: "",
    length: 0,
    toArray: function () {
      return d.call(this)
    },
    get: function (a) {
      return null != a ? 0 > a ? this[a + this.length] : this[a] : d.call(this)
    },
    pushStack: function (a) {
      var b = n.merge(this.constructor(), a);
      return b.prevObject = this, b.context = this.context, b
    },
    each: function (a, b) {
      return n.each(this, a, b)
    },
    map: function (a) {
      return this.pushStack(n.map(this, function (b, c) {
        return a.call(b, c, b)
      }))
    },
    slice: function () {
      return this.pushStack(d.apply(this, arguments))
    },
    first: function () {
      return this.eq(0)
    },
    last: function () {
      return this.eq(-1)
    },
    eq: function (a) {
      var b = this.length,
        c = +a + (0 > a ? b : 0);
      return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
    },
    end: function () {
      return this.prevObject || this.constructor(null)
    },
    push: f,
    sort: c.sort,
    splice: c.splice
  }, n.extend = n.fn.extend = function () {
    var a, b, c, d, e, f, g = arguments[0] || {},
      h = 1,
      i = arguments.length,
      j = !1;
    for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || n.isFunction(g) || (g = {}), h === i && (g = this, h--); i > h; h++)
      if (null != (a = arguments[h]))
        for (b in a) c = g[b], d = a[b], g !== d && (j && d && (n.isPlainObject(d) || (e = n.isArray(d))) ? (e ? (e = !1, f = c && n.isArray(c) ? c : []) : f = c && n.isPlainObject(c) ? c : {}, g[b] = n.extend(j, f, d)) : void 0 !== d && (g[b] = d));
    return g
  }, n.extend({
    expando: "jQuery" + (m + Math.random()).replace(/\D/g, ""),
    isReady: !0,
    error: function (a) {
      throw new Error(a)
    },
    noop: function () {},
    isFunction: function (a) {
      return "function" === n.type(a)
    },
    isArray: Array.isArray,
    isWindow: function (a) {
      return null != a && a === a.window
    },
    isNumeric: function (a) {
      return !n.isArray(a) && a - parseFloat(a) >= 0
    },
    isPlainObject: function (a) {
      return "object" !== n.type(a) || a.nodeType || n.isWindow(a) ? !1 : a.constructor && !j.call(a.constructor.prototype, "isPrototypeOf") ? !1 : !0
    },
    isEmptyObject: function (a) {
      var b;
      for (b in a) return !1;
      return !0
    },
    type: function (a) {
      return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? h[i.call(a)] || "object" : typeof a
    },
    globalEval: function (a) {
      var b, c = eval;
      a = n.trim(a), a && (1 === a.indexOf("use strict") ? (b = l.createElement("script"), b.text = a, l.head.appendChild(b).parentNode.removeChild(b)) : c(a))
    },
    camelCase: function (a) {
      return a.replace(p, "ms-").replace(q, r)
    },
    nodeName: function (a, b) {
      return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
    },
    each: function (a, b, c) {
      var d, e = 0,
        f = a.length,
        g = s(a);
      if (c) {
        if (g) {
          for (; f > e; e++)
            if (d = b.apply(a[e], c), d === !1) break
        } else
          for (e in a)
            if (d = b.apply(a[e], c), d === !1) break
      } else if (g) {
        for (; f > e; e++)
          if (d = b.call(a[e], e, a[e]), d === !1) break
      } else
        for (e in a)
          if (d = b.call(a[e], e, a[e]), d === !1) break;
      return a
    },
    trim: function (a) {
      return null == a ? "" : (a + "").replace(o, "")
    },
    makeArray: function (a, b) {
      var c = b || [];
      return null != a && (s(Object(a)) ? n.merge(c, "string" == typeof a ? [a] : a) : f.call(c, a)), c
    },
    inArray: function (a, b, c) {
      return null == b ? -1 : g.call(b, a, c)
    },
    merge: function (a, b) {
      for (var c = +b.length, d = 0, e = a.length; c > d; d++) a[e++] = b[d];
      return a.length = e, a
    },
    grep: function (a, b, c) {
      for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++) d = !b(a[f], f), d !== h && e.push(a[f]);
      return e
    },
    map: function (a, b, c) {
      var d, f = 0,
        g = a.length,
        h = s(a),
        i = [];
      if (h)
        for (; g > f; f++) d = b(a[f], f, c), null != d && i.push(d);
      else
        for (f in a) d = b(a[f], f, c), null != d && i.push(d);
      return e.apply([], i)
    },
    guid: 1,
    proxy: function (a, b) {
      var c, e, f;
      return "string" == typeof b && (c = a[b], b = a, a = c), n.isFunction(a) ? (e = d.call(arguments, 2), f = function () {
        return a.apply(b || this, e.concat(d.call(arguments)))
      }, f.guid = a.guid = a.guid || n.guid++, f) : void 0
    },
    now: Date.now,
    support: k
  }), n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (a, b) {
    h["[object " + b + "]"] = b.toLowerCase()
  });

  function s(a) {
    var b = a.length,
      c = n.type(a);
    return "function" === c || n.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
  }
  var t = function (a) {
    var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u = "sizzle" + -new Date,
      v = a.document,
      w = 0,
      x = 0,
      y = gb(),
      z = gb(),
      A = gb(),
      B = function (a, b) {
        return a === b && (l = !0), 0
      },
      C = "undefined",
      D = 1 << 31,
      E = {}.hasOwnProperty,
      F = [],
      G = F.pop,
      H = F.push,
      I = F.push,
      J = F.slice,
      K = F.indexOf || function (a) {
        for (var b = 0, c = this.length; c > b; b++)
          if (this[b] === a) return b;
        return -1
      },
      L = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
      M = "[\\x20\\t\\r\\n\\f]",
      N = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
      O = N.replace("w", "w#"),
      P = "\\[" + M + "*(" + N + ")(?:" + M + "*([*^$|!~]?=)" + M + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + O + "))|)" + M + "*\\]",
      Q = ":(" + N + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + P + ")*)|.*)\\)|)",
      R = new RegExp("^" + M + "+|((?:^|[^\\\\])(?:\\\\.)*)" + M + "+$", "g"),
      S = new RegExp("^" + M + "*," + M + "*"),
      T = new RegExp("^" + M + "*([>+~]|" + M + ")" + M + "*"),
      U = new RegExp("=" + M + "*([^\\]'\"]*?)" + M + "*\\]", "g"),
      V = new RegExp(Q),
      W = new RegExp("^" + O + "$"),
      X = {
        ID: new RegExp("^#(" + N + ")"),
        CLASS: new RegExp("^\\.(" + N + ")"),
        TAG: new RegExp("^(" + N.replace("w", "w*") + ")"),
        ATTR: new RegExp("^" + P),
        PSEUDO: new RegExp("^" + Q),
        CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + M + "*(even|odd|(([+-]|)(\\d*)n|)" + M + "*(?:([+-]|)" + M + "*(\\d+)|))" + M + "*\\)|)", "i"),
        bool: new RegExp("^(?:" + L + ")$", "i"),
        needsContext: new RegExp("^" + M + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + M + "*((?:-\\d)?\\d*)" + M + "*\\)|)(?=[^-]|$)", "i")
      },
      Y = /^(?:input|select|textarea|button)$/i,
      Z = /^h\d$/i,
      $ = /^[^{]+\{\s*\[native \w/,
      _ = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
      ab = /[+~]/,
      bb = /'|\\/g,
      cb = new RegExp("\\\\([\\da-f]{1,6}" + M + "?|(" + M + ")|.)", "ig"),
      db = function (a, b, c) {
        var d = "0x" + b - 65536;
        return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
      };
    try {
      I.apply(F = J.call(v.childNodes), v.childNodes), F[v.childNodes.length].nodeType
    } catch (eb) {
      I = {
        apply: F.length ? function (a, b) {
          H.apply(a, J.call(b))
        } : function (a, b) {
          var c = a.length,
            d = 0;
          while (a[c++] = b[d++]);
          a.length = c - 1
        }
      }
    }

    function fb(a, b, d, e) {
      var f, h, j, k, l, o, r, s, w, x;
      if ((b ? b.ownerDocument || b : v) !== n && m(b), b = b || n, d = d || [], !a || "string" != typeof a) return d;
      if (1 !== (k = b.nodeType) && 9 !== k) return [];
      if (p && !e) {
        if (f = _.exec(a))
          if (j = f[1]) {
            if (9 === k) {
              if (h = b.getElementById(j), !h || !h.parentNode) return d;
              if (h.id === j) return d.push(h), d
            } else if (b.ownerDocument && (h = b.ownerDocument.getElementById(j)) && t(b, h) && h.id === j) return d.push(h), d
          } else {
            if (f[2]) return I.apply(d, b.getElementsByTagName(a)), d;
            if ((j = f[3]) && c.getElementsByClassName && b.getElementsByClassName) return I.apply(d, b.getElementsByClassName(j)), d
          } if (c.qsa && (!q || !q.test(a))) {
          if (s = r = u, w = b, x = 9 === k && a, 1 === k && "object" !== b.nodeName.toLowerCase()) {
            o = g(a), (r = b.getAttribute("id")) ? s = r.replace(bb, "\\$&") : b.setAttribute("id", s), s = "[id='" + s + "'] ", l = o.length;
            while (l--) o[l] = s + qb(o[l]);
            w = ab.test(a) && ob(b.parentNode) || b, x = o.join(",")
          }
          if (x) try {
            return I.apply(d, w.querySelectorAll(x)), d
          } catch (y) {} finally {
            r || b.removeAttribute("id")
          }
        }
      }
      return i(a.replace(R, "$1"), b, d, e)
    }

    function gb() {
      var a = [];

      function b(c, e) {
        return a.push(c + " ") > d.cacheLength && delete b[a.shift()], b[c + " "] = e
      }
      return b
    }

    function hb(a) {
      return a[u] = !0, a
    }

    function ib(a) {
      var b = n.createElement("div");
      try {
        return !!a(b)
      } catch (c) {
        return !1
      } finally {
        b.parentNode && b.parentNode.removeChild(b), b = null
      }
    }

    function jb(a, b) {
      var c = a.split("|"),
        e = a.length;
      while (e--) d.attrHandle[c[e]] = b
    }

    function kb(a, b) {
      var c = b && a,
        d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || D) - (~a.sourceIndex || D);
      if (d) return d;
      if (c)
        while (c = c.nextSibling)
          if (c === b) return -1;
      return a ? 1 : -1
    }

    function lb(a) {
      return function (b) {
        var c = b.nodeName.toLowerCase();
        return "input" === c && b.type === a
      }
    }

    function mb(a) {
      return function (b) {
        var c = b.nodeName.toLowerCase();
        return ("input" === c || "button" === c) && b.type === a
      }
    }

    function nb(a) {
      return hb(function (b) {
        return b = +b, hb(function (c, d) {
          var e, f = a([], c.length, b),
            g = f.length;
          while (g--) c[e = f[g]] && (c[e] = !(d[e] = c[e]))
        })
      })
    }

    function ob(a) {
      return a && typeof a.getElementsByTagName !== C && a
    }
    c = fb.support = {}, f = fb.isXML = function (a) {
      var b = a && (a.ownerDocument || a).documentElement;
      return b ? "HTML" !== b.nodeName : !1
    }, m = fb.setDocument = function (a) {
      var b, e = a ? a.ownerDocument || a : v,
        g = e.defaultView;
      return e !== n && 9 === e.nodeType && e.documentElement ? (n = e, o = e.documentElement, p = !f(e), g && g !== g.top && (g.addEventListener ? g.addEventListener("unload", function () {
        m()
      }, !1) : g.attachEvent && g.attachEvent("onunload", function () {
        m()
      })), c.attributes = ib(function (a) {
        return a.className = "i", !a.getAttribute("className")
      }), c.getElementsByTagName = ib(function (a) {
        return a.appendChild(e.createComment("")), !a.getElementsByTagName("*").length
      }), c.getElementsByClassName = $.test(e.getElementsByClassName) && ib(function (a) {
        return a.innerHTML = "<div class='a'></div><div class='a i'></div>", a.firstChild.className = "i", 2 === a.getElementsByClassName("i").length
      }), c.getById = ib(function (a) {
        return o.appendChild(a).id = u, !e.getElementsByName || !e.getElementsByName(u).length
      }), c.getById ? (d.find.ID = function (a, b) {
        if (typeof b.getElementById !== C && p) {
          var c = b.getElementById(a);
          return c && c.parentNode ? [c] : []
        }
      }, d.filter.ID = function (a) {
        var b = a.replace(cb, db);
        return function (a) {
          return a.getAttribute("id") === b
        }
      }) : (delete d.find.ID, d.filter.ID = function (a) {
        var b = a.replace(cb, db);
        return function (a) {
          var c = typeof a.getAttributeNode !== C && a.getAttributeNode("id");
          return c && c.value === b
        }
      }), d.find.TAG = c.getElementsByTagName ? function (a, b) {
        return typeof b.getElementsByTagName !== C ? b.getElementsByTagName(a) : void 0
      } : function (a, b) {
        var c, d = [],
          e = 0,
          f = b.getElementsByTagName(a);
        if ("*" === a) {
          while (c = f[e++]) 1 === c.nodeType && d.push(c);
          return d
        }
        return f
      }, d.find.CLASS = c.getElementsByClassName && function (a, b) {
        return typeof b.getElementsByClassName !== C && p ? b.getElementsByClassName(a) : void 0
      }, r = [], q = [], (c.qsa = $.test(e.querySelectorAll)) && (ib(function (a) {
        a.innerHTML = "<select msallowclip=''><option selected=''></option></select>", a.querySelectorAll("[msallowclip^='']").length && q.push("[*^$]=" + M + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || q.push("\\[" + M + "*(?:value|" + L + ")"), a.querySelectorAll(":checked").length || q.push(":checked")
      }), ib(function (a) {
        var b = e.createElement("input");
        b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && q.push("name" + M + "*[*^$|!~]?="), a.querySelectorAll(":enabled").length || q.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), q.push(",.*:")
      })), (c.matchesSelector = $.test(s = o.matches || o.webkitMatchesSelector || o.mozMatchesSelector || o.oMatchesSelector || o.msMatchesSelector)) && ib(function (a) {
        c.disconnectedMatch = s.call(a, "div"), s.call(a, "[s!='']:x"), r.push("!=", Q)
      }), q = q.length && new RegExp(q.join("|")), r = r.length && new RegExp(r.join("|")), b = $.test(o.compareDocumentPosition), t = b || $.test(o.contains) ? function (a, b) {
        var c = 9 === a.nodeType ? a.documentElement : a,
          d = b && b.parentNode;
        return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
      } : function (a, b) {
        if (b)
          while (b = b.parentNode)
            if (b === a) return !0;
        return !1
      }, B = b ? function (a, b) {
        if (a === b) return l = !0, 0;
        var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
        return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === e || a.ownerDocument === v && t(v, a) ? -1 : b === e || b.ownerDocument === v && t(v, b) ? 1 : k ? K.call(k, a) - K.call(k, b) : 0 : 4 & d ? -1 : 1)
      } : function (a, b) {
        if (a === b) return l = !0, 0;
        var c, d = 0,
          f = a.parentNode,
          g = b.parentNode,
          h = [a],
          i = [b];
        if (!f || !g) return a === e ? -1 : b === e ? 1 : f ? -1 : g ? 1 : k ? K.call(k, a) - K.call(k, b) : 0;
        if (f === g) return kb(a, b);
        c = a;
        while (c = c.parentNode) h.unshift(c);
        c = b;
        while (c = c.parentNode) i.unshift(c);
        while (h[d] === i[d]) d++;
        return d ? kb(h[d], i[d]) : h[d] === v ? -1 : i[d] === v ? 1 : 0
      }, e) : n
    }, fb.matches = function (a, b) {
      return fb(a, null, null, b)
    }, fb.matchesSelector = function (a, b) {
      if ((a.ownerDocument || a) !== n && m(a), b = b.replace(U, "='$1']"), !(!c.matchesSelector || !p || r && r.test(b) || q && q.test(b))) try {
        var d = s.call(a, b);
        if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d
      } catch (e) {}
      return fb(b, n, null, [a]).length > 0
    }, fb.contains = function (a, b) {
      return (a.ownerDocument || a) !== n && m(a), t(a, b)
    }, fb.attr = function (a, b) {
      (a.ownerDocument || a) !== n && m(a);
      var e = d.attrHandle[b.toLowerCase()],
        f = e && E.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !p) : void 0;
      return void 0 !== f ? f : c.attributes || !p ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null
    }, fb.error = function (a) {
      throw new Error("Syntax error, unrecognized expression: " + a)
    }, fb.uniqueSort = function (a) {
      var b, d = [],
        e = 0,
        f = 0;
      if (l = !c.detectDuplicates, k = !c.sortStable && a.slice(0), a.sort(B), l) {
        while (b = a[f++]) b === a[f] && (e = d.push(f));
        while (e--) a.splice(d[e], 1)
      }
      return k = null, a
    }, e = fb.getText = function (a) {
      var b, c = "",
        d = 0,
        f = a.nodeType;
      if (f) {
        if (1 === f || 9 === f || 11 === f) {
          if ("string" == typeof a.textContent) return a.textContent;
          for (a = a.firstChild; a; a = a.nextSibling) c += e(a)
        } else if (3 === f || 4 === f) return a.nodeValue
      } else
        while (b = a[d++]) c += e(b);
      return c
    }, d = fb.selectors = {
      cacheLength: 50,
      createPseudo: hb,
      match: X,
      attrHandle: {},
      find: {},
      relative: {
        ">": {
          dir: "parentNode",
          first: !0
        },
        " ": {
          dir: "parentNode"
        },
        "+": {
          dir: "previousSibling",
          first: !0
        },
        "~": {
          dir: "previousSibling"
        }
      },
      preFilter: {
        ATTR: function (a) {
          return a[1] = a[1].replace(cb, db), a[3] = (a[3] || a[4] || a[5] || "").replace(cb, db), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
        },
        CHILD: function (a) {
          return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || fb.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && fb.error(a[0]), a
        },
        PSEUDO: function (a) {
          var b, c = !a[6] && a[2];
          return X.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && V.test(c) && (b = g(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3))
        }
      },
      filter: {
        TAG: function (a) {
          var b = a.replace(cb, db).toLowerCase();
          return "*" === a ? function () {
            return !0
          } : function (a) {
            return a.nodeName && a.nodeName.toLowerCase() === b
          }
        },
        CLASS: function (a) {
          var b = y[a + " "];
          return b || (b = new RegExp("(^|" + M + ")" + a + "(" + M + "|$)")) && y(a, function (a) {
            return b.test("string" == typeof a.className && a.className || typeof a.getAttribute !== C && a.getAttribute("class") || "")
          })
        },
        ATTR: function (a, b, c) {
          return function (d) {
            var e = fb.attr(d, a);
            return null == e ? "!=" === b : b ? (e += "", "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e + " ").indexOf(c) > -1 : "|=" === b ? e === c || e.slice(0, c.length + 1) === c + "-" : !1) : !0
          }
        },
        CHILD: function (a, b, c, d, e) {
          var f = "nth" !== a.slice(0, 3),
            g = "last" !== a.slice(-4),
            h = "of-type" === b;
          return 1 === d && 0 === e ? function (a) {
            return !!a.parentNode
          } : function (b, c, i) {
            var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling",
              q = b.parentNode,
              r = h && b.nodeName.toLowerCase(),
              s = !i && !h;
            if (q) {
              if (f) {
                while (p) {
                  l = b;
                  while (l = l[p])
                    if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) return !1;
                  o = p = "only" === a && !o && "nextSibling"
                }
                return !0
              }
              if (o = [g ? q.firstChild : q.lastChild], g && s) {
                k = q[u] || (q[u] = {}), j = k[a] || [], n = j[0] === w && j[1], m = j[0] === w && j[2], l = n && q.childNodes[n];
                while (l = ++n && l && l[p] || (m = n = 0) || o.pop())
                  if (1 === l.nodeType && ++m && l === b) {
                    k[a] = [w, n, m];
                    break
                  }
              } else if (s && (j = (b[u] || (b[u] = {}))[a]) && j[0] === w) m = j[1];
              else
                while (l = ++n && l && l[p] || (m = n = 0) || o.pop())
                  if ((h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) && ++m && (s && ((l[u] || (l[u] = {}))[a] = [w, m]), l === b)) break;
              return m -= e, m === d || m % d === 0 && m / d >= 0
            }
          }
        },
        PSEUDO: function (a, b) {
          var c, e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || fb.error("unsupported pseudo: " + a);
          return e[u] ? e(b) : e.length > 1 ? (c = [a, a, "", b], d.setFilters.hasOwnProperty(a.toLowerCase()) ? hb(function (a, c) {
            var d, f = e(a, b),
              g = f.length;
            while (g--) d = K.call(a, f[g]), a[d] = !(c[d] = f[g])
          }) : function (a) {
            return e(a, 0, c)
          }) : e
        }
      },
      pseudos: {
        not: hb(function (a) {
          var b = [],
            c = [],
            d = h(a.replace(R, "$1"));
          return d[u] ? hb(function (a, b, c, e) {
            var f, g = d(a, null, e, []),
              h = a.length;
            while (h--)(f = g[h]) && (a[h] = !(b[h] = f))
          }) : function (a, e, f) {
            return b[0] = a, d(b, null, f, c), !c.pop()
          }
        }),
        has: hb(function (a) {
          return function (b) {
            return fb(a, b).length > 0
          }
        }),
        contains: hb(function (a) {
          return function (b) {
            return (b.textContent || b.innerText || e(b)).indexOf(a) > -1
          }
        }),
        lang: hb(function (a) {
          return W.test(a || "") || fb.error("unsupported lang: " + a), a = a.replace(cb, db).toLowerCase(),
            function (b) {
              var c;
              do
                if (c = p ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-"); while ((b = b.parentNode) && 1 === b.nodeType);
              return !1
            }
        }),
        target: function (b) {
          var c = a.location && a.location.hash;
          return c && c.slice(1) === b.id
        },
        root: function (a) {
          return a === o
        },
        focus: function (a) {
          return a === n.activeElement && (!n.hasFocus || n.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
        },
        enabled: function (a) {
          return a.disabled === !1
        },
        disabled: function (a) {
          return a.disabled === !0
        },
        checked: function (a) {
          var b = a.nodeName.toLowerCase();
          return "input" === b && !!a.checked || "option" === b && !!a.selected
        },
        selected: function (a) {
          return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
        },
        empty: function (a) {
          for (a = a.firstChild; a; a = a.nextSibling)
            if (a.nodeType < 6) return !1;
          return !0
        },
        parent: function (a) {
          return !d.pseudos.empty(a)
        },
        header: function (a) {
          return Z.test(a.nodeName)
        },
        input: function (a) {
          return Y.test(a.nodeName)
        },
        button: function (a) {
          var b = a.nodeName.toLowerCase();
          return "input" === b && "button" === a.type || "button" === b
        },
        text: function (a) {
          var b;
          return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
        },
        first: nb(function () {
          return [0]
        }),
        last: nb(function (a, b) {
          return [b - 1]
        }),
        eq: nb(function (a, b, c) {
          return [0 > c ? c + b : c]
        }),
        even: nb(function (a, b) {
          for (var c = 0; b > c; c += 2) a.push(c);
          return a
        }),
        odd: nb(function (a, b) {
          for (var c = 1; b > c; c += 2) a.push(c);
          return a
        }),
        lt: nb(function (a, b, c) {
          for (var d = 0 > c ? c + b : c; --d >= 0;) a.push(d);
          return a
        }),
        gt: nb(function (a, b, c) {
          for (var d = 0 > c ? c + b : c; ++d < b;) a.push(d);
          return a
        })
      }
    }, d.pseudos.nth = d.pseudos.eq;
    for (b in {
        radio: !0,
        checkbox: !0,
        file: !0,
        password: !0,
        image: !0
      }) d.pseudos[b] = lb(b);
    for (b in {
        submit: !0,
        reset: !0
      }) d.pseudos[b] = mb(b);

    function pb() {}
    pb.prototype = d.filters = d.pseudos, d.setFilters = new pb, g = fb.tokenize = function (a, b) {
      var c, e, f, g, h, i, j, k = z[a + " "];
      if (k) return b ? 0 : k.slice(0);
      h = a, i = [], j = d.preFilter;
      while (h) {
        (!c || (e = S.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), c = !1, (e = T.exec(h)) && (c = e.shift(), f.push({
          value: c,
          type: e[0].replace(R, " ")
        }), h = h.slice(c.length));
        for (g in d.filter) !(e = X[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(), f.push({
          value: c,
          type: g,
          matches: e
        }), h = h.slice(c.length));
        if (!c) break
      }
      return b ? h.length : h ? fb.error(a) : z(a, i).slice(0)
    };

    function qb(a) {
      for (var b = 0, c = a.length, d = ""; c > b; b++) d += a[b].value;
      return d
    }

    function rb(a, b, c) {
      var d = b.dir,
        e = c && "parentNode" === d,
        f = x++;
      return b.first ? function (b, c, f) {
        while (b = b[d])
          if (1 === b.nodeType || e) return a(b, c, f)
      } : function (b, c, g) {
        var h, i, j = [w, f];
        if (g) {
          while (b = b[d])
            if ((1 === b.nodeType || e) && a(b, c, g)) return !0
        } else
          while (b = b[d])
            if (1 === b.nodeType || e) {
              if (i = b[u] || (b[u] = {}), (h = i[d]) && h[0] === w && h[1] === f) return j[2] = h[2];
              if (i[d] = j, j[2] = a(b, c, g)) return !0
            }
      }
    }

    function sb(a) {
      return a.length > 1 ? function (b, c, d) {
        var e = a.length;
        while (e--)
          if (!a[e](b, c, d)) return !1;
        return !0
      } : a[0]
    }

    function tb(a, b, c) {
      for (var d = 0, e = b.length; e > d; d++) fb(a, b[d], c);
      return c
    }

    function ub(a, b, c, d, e) {
      for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)(f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
      return g
    }

    function vb(a, b, c, d, e, f) {
      return d && !d[u] && (d = vb(d)), e && !e[u] && (e = vb(e, f)), hb(function (f, g, h, i) {
        var j, k, l, m = [],
          n = [],
          o = g.length,
          p = f || tb(b || "*", h.nodeType ? [h] : h, []),
          q = !a || !f && b ? p : ub(p, m, a, h, i),
          r = c ? e || (f ? a : o || d) ? [] : g : q;
        if (c && c(q, r, h, i), d) {
          j = ub(r, n), d(j, [], h, i), k = j.length;
          while (k--)(l = j[k]) && (r[n[k]] = !(q[n[k]] = l))
        }
        if (f) {
          if (e || a) {
            if (e) {
              j = [], k = r.length;
              while (k--)(l = r[k]) && j.push(q[k] = l);
              e(null, r = [], j, i)
            }
            k = r.length;
            while (k--)(l = r[k]) && (j = e ? K.call(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l))
          }
        } else r = ub(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : I.apply(g, r)
      })
    }

    function wb(a) {
      for (var b, c, e, f = a.length, g = d.relative[a[0].type], h = g || d.relative[" "], i = g ? 1 : 0, k = rb(function (a) {
          return a === b
        }, h, !0), l = rb(function (a) {
          return K.call(b, a) > -1
        }, h, !0), m = [function (a, c, d) {
          return !g && (d || c !== j) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d))
        }]; f > i; i++)
        if (c = d.relative[a[i].type]) m = [rb(sb(m), c)];
        else {
          if (c = d.filter[a[i].type].apply(null, a[i].matches), c[u]) {
            for (e = ++i; f > e; e++)
              if (d.relative[a[e].type]) break;
            return vb(i > 1 && sb(m), i > 1 && qb(a.slice(0, i - 1).concat({
              value: " " === a[i - 2].type ? "*" : ""
            })).replace(R, "$1"), c, e > i && wb(a.slice(i, e)), f > e && wb(a = a.slice(e)), f > e && qb(a))
          }
          m.push(c)
        } return sb(m)
    }

    function xb(a, b) {
      var c = b.length > 0,
        e = a.length > 0,
        f = function (f, g, h, i, k) {
          var l, m, o, p = 0,
            q = "0",
            r = f && [],
            s = [],
            t = j,
            u = f || e && d.find.TAG("*", k),
            v = w += null == t ? 1 : Math.random() || .1,
            x = u.length;
          for (k && (j = g !== n && g); q !== x && null != (l = u[q]); q++) {
            if (e && l) {
              m = 0;
              while (o = a[m++])
                if (o(l, g, h)) {
                  i.push(l);
                  break
                } k && (w = v)
            }
            c && ((l = !o && l) && p--, f && r.push(l))
          }
          if (p += q, c && q !== p) {
            m = 0;
            while (o = b[m++]) o(r, s, g, h);
            if (f) {
              if (p > 0)
                while (q--) r[q] || s[q] || (s[q] = G.call(i));
              s = ub(s)
            }
            I.apply(i, s), k && !f && s.length > 0 && p + b.length > 1 && fb.uniqueSort(i)
          }
          return k && (w = v, j = t), r
        };
      return c ? hb(f) : f
    }
    return h = fb.compile = function (a, b) {
      var c, d = [],
        e = [],
        f = A[a + " "];
      if (!f) {
        b || (b = g(a)), c = b.length;
        while (c--) f = wb(b[c]), f[u] ? d.push(f) : e.push(f);
        f = A(a, xb(e, d)), f.selector = a
      }
      return f
    }, i = fb.select = function (a, b, e, f) {
      var i, j, k, l, m, n = "function" == typeof a && a,
        o = !f && g(a = n.selector || a);
      if (e = e || [], 1 === o.length) {
        if (j = o[0] = o[0].slice(0), j.length > 2 && "ID" === (k = j[0]).type && c.getById && 9 === b.nodeType && p && d.relative[j[1].type]) {
          if (b = (d.find.ID(k.matches[0].replace(cb, db), b) || [])[0], !b) return e;
          n && (b = b.parentNode), a = a.slice(j.shift().value.length)
        }
        i = X.needsContext.test(a) ? 0 : j.length;
        while (i--) {
          if (k = j[i], d.relative[l = k.type]) break;
          if ((m = d.find[l]) && (f = m(k.matches[0].replace(cb, db), ab.test(j[0].type) && ob(b.parentNode) || b))) {
            if (j.splice(i, 1), a = f.length && qb(j), !a) return I.apply(e, f), e;
            break
          }
        }
      }
      return (n || h(a, o))(f, b, !p, e, ab.test(a) && ob(b.parentNode) || b), e
    }, c.sortStable = u.split("").sort(B).join("") === u, c.detectDuplicates = !!l, m(), c.sortDetached = ib(function (a) {
      return 1 & a.compareDocumentPosition(n.createElement("div"))
    }), ib(function (a) {
      return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
    }) || jb("type|href|height|width", function (a, b, c) {
      return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
    }), c.attributes && ib(function (a) {
      return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
    }) || jb("value", function (a, b, c) {
      return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
    }), ib(function (a) {
      return null == a.getAttribute("disabled")
    }) || jb(L, function (a, b, c) {
      var d;
      return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
    }), fb
  }(a);
  n.find = t, n.expr = t.selectors, n.expr[":"] = n.expr.pseudos, n.unique = t.uniqueSort, n.text = t.getText, n.isXMLDoc = t.isXML, n.contains = t.contains;
  var u = n.expr.match.needsContext,
    v = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    w = /^.[^:#\[\.,]*$/;

  function x(a, b, c) {
    if (n.isFunction(b)) return n.grep(a, function (a, d) {
      return !!b.call(a, d, a) !== c
    });
    if (b.nodeType) return n.grep(a, function (a) {
      return a === b !== c
    });
    if ("string" == typeof b) {
      if (w.test(b)) return n.filter(b, a, c);
      b = n.filter(b, a)
    }
    return n.grep(a, function (a) {
      return g.call(b, a) >= 0 !== c
    })
  }
  n.filter = function (a, b, c) {
    var d = b[0];
    return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? n.find.matchesSelector(d, a) ? [d] : [] : n.find.matches(a, n.grep(b, function (a) {
      return 1 === a.nodeType
    }))
  }, n.fn.extend({
    find: function (a) {
      var b, c = this.length,
        d = [],
        e = this;
      if ("string" != typeof a) return this.pushStack(n(a).filter(function () {
        for (b = 0; c > b; b++)
          if (n.contains(e[b], this)) return !0
      }));
      for (b = 0; c > b; b++) n.find(a, e[b], d);
      return d = this.pushStack(c > 1 ? n.unique(d) : d), d.selector = this.selector ? this.selector + " " + a : a, d
    },
    filter: function (a) {
      return this.pushStack(x(this, a || [], !1))
    },
    not: function (a) {
      return this.pushStack(x(this, a || [], !0))
    },
    is: function (a) {
      return !!x(this, "string" == typeof a && u.test(a) ? n(a) : a || [], !1).length
    }
  });
  var y, z = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
    A = n.fn.init = function (a, b) {
      var c, d;
      if (!a) return this;
      if ("string" == typeof a) {
        if (c = "<" === a[0] && ">" === a[a.length - 1] && a.length >= 3 ? [null, a, null] : z.exec(a), !c || !c[1] && b) return !b || b.jquery ? (b || y).find(a) : this.constructor(b).find(a);
        if (c[1]) {
          if (b = b instanceof n ? b[0] : b, n.merge(this, n.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : l, !0)), v.test(c[1]) && n.isPlainObject(b))
            for (c in b) n.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
          return this
        }
        return d = l.getElementById(c[2]), d && d.parentNode && (this.length = 1, this[0] = d), this.context = l, this.selector = a, this
      }
      return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : n.isFunction(a) ? "undefined" != typeof y.ready ? y.ready(a) : a(n) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), n.makeArray(a, this))
    };
  A.prototype = n.fn, y = n(l);
  var B = /^(?:parents|prev(?:Until|All))/,
    C = {
      children: !0,
      contents: !0,
      next: !0,
      prev: !0
    };
  n.extend({
    dir: function (a, b, c) {
      var d = [],
        e = void 0 !== c;
      while ((a = a[b]) && 9 !== a.nodeType)
        if (1 === a.nodeType) {
          if (e && n(a).is(c)) break;
          d.push(a)
        } return d
    },
    sibling: function (a, b) {
      for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a);
      return c
    }
  }), n.fn.extend({
    has: function (a) {
      var b = n(a, this),
        c = b.length;
      return this.filter(function () {
        for (var a = 0; c > a; a++)
          if (n.contains(this, b[a])) return !0
      })
    },
    closest: function (a, b) {
      for (var c, d = 0, e = this.length, f = [], g = u.test(a) || "string" != typeof a ? n(a, b || this.context) : 0; e > d; d++)
        for (c = this[d]; c && c !== b; c = c.parentNode)
          if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && n.find.matchesSelector(c, a))) {
            f.push(c);
            break
          } return this.pushStack(f.length > 1 ? n.unique(f) : f)
    },
    index: function (a) {
      return a ? "string" == typeof a ? g.call(n(a), this[0]) : g.call(this, a.jquery ? a[0] : a) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
    },
    add: function (a, b) {
      return this.pushStack(n.unique(n.merge(this.get(), n(a, b))))
    },
    addBack: function (a) {
      return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
    }
  });

  function D(a, b) {
    while ((a = a[b]) && 1 !== a.nodeType);
    return a
  }
  n.each({
    parent: function (a) {
      var b = a.parentNode;
      return b && 11 !== b.nodeType ? b : null
    },
    parents: function (a) {
      return n.dir(a, "parentNode")
    },
    parentsUntil: function (a, b, c) {
      return n.dir(a, "parentNode", c)
    },
    next: function (a) {
      return D(a, "nextSibling")
    },
    prev: function (a) {
      return D(a, "previousSibling")
    },
    nextAll: function (a) {
      return n.dir(a, "nextSibling")
    },
    prevAll: function (a) {
      return n.dir(a, "previousSibling")
    },
    nextUntil: function (a, b, c) {
      return n.dir(a, "nextSibling", c)
    },
    prevUntil: function (a, b, c) {
      return n.dir(a, "previousSibling", c)
    },
    siblings: function (a) {
      return n.sibling((a.parentNode || {}).firstChild, a)
    },
    children: function (a) {
      return n.sibling(a.firstChild)
    },
    contents: function (a) {
      return a.contentDocument || n.merge([], a.childNodes)
    }
  }, function (a, b) {
    n.fn[a] = function (c, d) {
      var e = n.map(this, b, c);
      return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = n.filter(d, e)), this.length > 1 && (C[a] || n.unique(e), B.test(a) && e.reverse()), this.pushStack(e)
    }
  });
  var E = /\S+/g,
    F = {};

  function G(a) {
    var b = F[a] = {};
    return n.each(a.match(E) || [], function (a, c) {
      b[c] = !0
    }), b
  }
  n.Callbacks = function (a) {
    a = "string" == typeof a ? F[a] || G(a) : n.extend({}, a);
    var b, c, d, e, f, g, h = [],
      i = !a.once && [],
      j = function (l) {
        for (b = a.memory && l, c = !0, g = e || 0, e = 0, f = h.length, d = !0; h && f > g; g++)
          if (h[g].apply(l[0], l[1]) === !1 && a.stopOnFalse) {
            b = !1;
            break
          } d = !1, h && (i ? i.length && j(i.shift()) : b ? h = [] : k.disable())
      },
      k = {
        add: function () {
          if (h) {
            var c = h.length;
            ! function g(b) {
              n.each(b, function (b, c) {
                var d = n.type(c);
                "function" === d ? a.unique && k.has(c) || h.push(c) : c && c.length && "string" !== d && g(c)
              })
            }(arguments), d ? f = h.length : b && (e = c, j(b))
          }
          return this
        },
        remove: function () {
          return h && n.each(arguments, function (a, b) {
            var c;
            while ((c = n.inArray(b, h, c)) > -1) h.splice(c, 1), d && (f >= c && f--, g >= c && g--)
          }), this
        },
        has: function (a) {
          return a ? n.inArray(a, h) > -1 : !(!h || !h.length)
        },
        empty: function () {
          return h = [], f = 0, this
        },
        disable: function () {
          return h = i = b = void 0, this
        },
        disabled: function () {
          return !h
        },
        lock: function () {
          return i = void 0, b || k.disable(), this
        },
        locked: function () {
          return !i
        },
        fireWith: function (a, b) {
          return !h || c && !i || (b = b || [], b = [a, b.slice ? b.slice() : b], d ? i.push(b) : j(b)), this
        },
        fire: function () {
          return k.fireWith(this, arguments), this
        },
        fired: function () {
          return !!c
        }
      };
    return k
  }, n.extend({
    Deferred: function (a) {
      var b = [
          ["resolve", "done", n.Callbacks("once memory"), "resolved"],
          ["reject", "fail", n.Callbacks("once memory"), "rejected"],
          ["notify", "progress", n.Callbacks("memory")]
        ],
        c = "pending",
        d = {
          state: function () {
            return c
          },
          always: function () {
            return e.done(arguments).fail(arguments), this
          },
          then: function () {
            var a = arguments;
            return n.Deferred(function (c) {
              n.each(b, function (b, f) {
                var g = n.isFunction(a[b]) && a[b];
                e[f[1]](function () {
                  var a = g && g.apply(this, arguments);
                  a && n.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
                })
              }), a = null
            }).promise()
          },
          promise: function (a) {
            return null != a ? n.extend(a, d) : d
          }
        },
        e = {};
      return d.pipe = d.then, n.each(b, function (a, f) {
        var g = f[2],
          h = f[3];
        d[f[1]] = g.add, h && g.add(function () {
          c = h
        }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function () {
          return e[f[0] + "With"](this === e ? d : this, arguments), this
        }, e[f[0] + "With"] = g.fireWith
      }), d.promise(e), a && a.call(e, e), e
    },
    when: function (a) {
      var b = 0,
        c = d.call(arguments),
        e = c.length,
        f = 1 !== e || a && n.isFunction(a.promise) ? e : 0,
        g = 1 === f ? a : n.Deferred(),
        h = function (a, b, c) {
          return function (e) {
            b[a] = this, c[a] = arguments.length > 1 ? d.call(arguments) : e, c === i ? g.notifyWith(b, c) : --f || g.resolveWith(b, c)
          }
        },
        i, j, k;
      if (e > 1)
        for (i = new Array(e), j = new Array(e), k = new Array(e); e > b; b++) c[b] && n.isFunction(c[b].promise) ? c[b].promise().done(h(b, k, c)).fail(g.reject).progress(h(b, j, i)) : --f;
      return f || g.resolveWith(k, c), g.promise()
    }
  });
  var H;
  n.fn.ready = function (a) {
    return n.ready.promise().done(a), this
  }, n.extend({
    isReady: !1,
    readyWait: 1,
    holdReady: function (a) {
      a ? n.readyWait++ : n.ready(!0)
    },
    ready: function (a) {
      (a === !0 ? --n.readyWait : n.isReady) || (n.isReady = !0, a !== !0 && --n.readyWait > 0 || (H.resolveWith(l, [n]), n.fn.triggerHandler && (n(l).triggerHandler("ready"), n(l).off("ready"))))
    }
  });

  function I() {
    l.removeEventListener("DOMContentLoaded", I, !1), a.removeEventListener("load", I, !1), n.ready()
  }
  n.ready.promise = function (b) {
    return H || (H = n.Deferred(), "complete" === l.readyState ? setTimeout(n.ready) : (l.addEventListener("DOMContentLoaded", I, !1), a.addEventListener("load", I, !1))), H.promise(b)
  }, n.ready.promise();
  var J = n.access = function (a, b, c, d, e, f, g) {
    var h = 0,
      i = a.length,
      j = null == c;
    if ("object" === n.type(c)) {
      e = !0;
      for (h in c) n.access(a, b, h, c[h], !0, f, g)
    } else if (void 0 !== d && (e = !0, n.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function (a, b, c) {
        return j.call(n(a), c)
      })), b))
      for (; i > h; h++) b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
    return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
  };
  n.acceptData = function (a) {
    return 1 === a.nodeType || 9 === a.nodeType || !+a.nodeType
  };

  function K() {
    Object.defineProperty(this.cache = {}, 0, {
      get: function () {
        return {}
      }
    }), this.expando = n.expando + Math.random()
  }
  K.uid = 1, K.accepts = n.acceptData, K.prototype = {
    key: function (a) {
      if (!K.accepts(a)) return 0;
      var b = {},
        c = a[this.expando];
      if (!c) {
        c = K.uid++;
        try {
          b[this.expando] = {
            value: c
          }, Object.defineProperties(a, b)
        } catch (d) {
          b[this.expando] = c, n.extend(a, b)
        }
      }
      return this.cache[c] || (this.cache[c] = {}), c
    },
    set: function (a, b, c) {
      var d, e = this.key(a),
        f = this.cache[e];
      if ("string" == typeof b) f[b] = c;
      else if (n.isEmptyObject(f)) n.extend(this.cache[e], b);
      else
        for (d in b) f[d] = b[d];
      return f
    },
    get: function (a, b) {
      var c = this.cache[this.key(a)];
      return void 0 === b ? c : c[b]
    },
    access: function (a, b, c) {
      var d;
      return void 0 === b || b && "string" == typeof b && void 0 === c ? (d = this.get(a, b), void 0 !== d ? d : this.get(a, n.camelCase(b))) : (this.set(a, b, c), void 0 !== c ? c : b)
    },
    remove: function (a, b) {
      var c, d, e, f = this.key(a),
        g = this.cache[f];
      if (void 0 === b) this.cache[f] = {};
      else {
        n.isArray(b) ? d = b.concat(b.map(n.camelCase)) : (e = n.camelCase(b), b in g ? d = [b, e] : (d = e, d = d in g ? [d] : d.match(E) || [])), c = d.length;
        while (c--) delete g[d[c]]
      }
    },
    hasData: function (a) {
      return !n.isEmptyObject(this.cache[a[this.expando]] || {})
    },
    discard: function (a) {
      a[this.expando] && delete this.cache[a[this.expando]]
    }
  };
  var L = new K,
    M = new K,
    N = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    O = /([A-Z])/g;

  function P(a, b, c) {
    var d;
    if (void 0 === c && 1 === a.nodeType)
      if (d = "data-" + b.replace(O, "-$1").toLowerCase(), c = a.getAttribute(d), "string" == typeof c) {
        try {
          c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : N.test(c) ? n.parseJSON(c) : c
        } catch (e) {}
        M.set(a, b, c)
      } else c = void 0;
    return c
  }
  n.extend({
    hasData: function (a) {
      return M.hasData(a) || L.hasData(a)
    },
    data: function (a, b, c) {
      return M.access(a, b, c)
    },
    removeData: function (a, b) {
      M.remove(a, b)
    },
    _data: function (a, b, c) {
      return L.access(a, b, c)
    },
    _removeData: function (a, b) {
      L.remove(a, b)
    }
  }), n.fn.extend({
    data: function (a, b) {
      var c, d, e, f = this[0],
        g = f && f.attributes;
      if (void 0 === a) {
        if (this.length && (e = M.get(f), 1 === f.nodeType && !L.get(f, "hasDataAttrs"))) {
          c = g.length;
          while (c--) g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = n.camelCase(d.slice(5)), P(f, d, e[d])));
          L.set(f, "hasDataAttrs", !0)
        }
        return e
      }
      return "object" == typeof a ? this.each(function () {
        M.set(this, a)
      }) : J(this, function (b) {
        var c, d = n.camelCase(a);
        if (f && void 0 === b) {
          if (c = M.get(f, a), void 0 !== c) return c;
          if (c = M.get(f, d), void 0 !== c) return c;
          if (c = P(f, d, void 0), void 0 !== c) return c
        } else this.each(function () {
          var c = M.get(this, d);
          M.set(this, d, b), -1 !== a.indexOf("-") && void 0 !== c && M.set(this, a, b)
        })
      }, null, b, arguments.length > 1, null, !0)
    },
    removeData: function (a) {
      return this.each(function () {
        M.remove(this, a)
      })
    }
  }), n.extend({
    queue: function (a, b, c) {
      var d;
      return a ? (b = (b || "fx") + "queue", d = L.get(a, b), c && (!d || n.isArray(c) ? d = L.access(a, b, n.makeArray(c)) : d.push(c)), d || []) : void 0
    },
    dequeue: function (a, b) {
      b = b || "fx";
      var c = n.queue(a, b),
        d = c.length,
        e = c.shift(),
        f = n._queueHooks(a, b),
        g = function () {
          n.dequeue(a, b)
        };
      "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
    },
    _queueHooks: function (a, b) {
      var c = b + "queueHooks";
      return L.get(a, c) || L.access(a, c, {
        empty: n.Callbacks("once memory").add(function () {
          L.remove(a, [b + "queue", c])
        })
      })
    }
  }), n.fn.extend({
    queue: function (a, b) {
      var c = 2;
      return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? n.queue(this[0], a) : void 0 === b ? this : this.each(function () {
        var c = n.queue(this, a, b);
        n._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && n.dequeue(this, a)
      })
    },
    dequeue: function (a) {
      return this.each(function () {
        n.dequeue(this, a)
      })
    },
    clearQueue: function (a) {
      return this.queue(a || "fx", [])
    },
    promise: function (a, b) {
      var c, d = 1,
        e = n.Deferred(),
        f = this,
        g = this.length,
        h = function () {
          --d || e.resolveWith(f, [f])
        };
      "string" != typeof a && (b = a, a = void 0), a = a || "fx";
      while (g--) c = L.get(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h));
      return h(), e.promise(b)
    }
  });
  var Q = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    R = ["Top", "Right", "Bottom", "Left"],
    S = function (a, b) {
      return a = b || a, "none" === n.css(a, "display") || !n.contains(a.ownerDocument, a)
    },
    T = /^(?:checkbox|radio)$/i;
  ! function () {
    var a = l.createDocumentFragment(),
      b = a.appendChild(l.createElement("div")),
      c = l.createElement("input");
    c.setAttribute("type", "radio"), c.setAttribute("checked", "checked"), c.setAttribute("name", "t"), b.appendChild(c), k.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, b.innerHTML = "<textarea>x</textarea>", k.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue
  }();
  var U = "undefined";
  k.focusinBubbles = "onfocusin" in a;
  var V = /^key/,
    W = /^(?:mouse|pointer|contextmenu)|click/,
    X = /^(?:focusinfocus|focusoutblur)$/,
    Y = /^([^.]*)(?:\.(.+)|)$/;

  function Z() {
    return !0
  }

  function $() {
    return !1
  }

  function _() {
    try {
      return l.activeElement
    } catch (a) {}
  }
  n.event = {
    global: {},
    add: function (a, b, c, d, e) {
      var f, g, h, i, j, k, l, m, o, p, q, r = L.get(a);
      if (r) {
        c.handler && (f = c, c = f.handler, e = f.selector), c.guid || (c.guid = n.guid++), (i = r.events) || (i = r.events = {}), (g = r.handle) || (g = r.handle = function (b) {
          return typeof n !== U && n.event.triggered !== b.type ? n.event.dispatch.apply(a, arguments) : void 0
        }), b = (b || "").match(E) || [""], j = b.length;
        while (j--) h = Y.exec(b[j]) || [], o = q = h[1], p = (h[2] || "").split(".").sort(), o && (l = n.event.special[o] || {}, o = (e ? l.delegateType : l.bindType) || o, l = n.event.special[o] || {}, k = n.extend({
          type: o,
          origType: q,
          data: d,
          handler: c,
          guid: c.guid,
          selector: e,
          needsContext: e && n.expr.match.needsContext.test(e),
          namespace: p.join(".")
        }, f), (m = i[o]) || (m = i[o] = [], m.delegateCount = 0, l.setup && l.setup.call(a, d, p, g) !== !1 || a.addEventListener && a.addEventListener(o, g, !1)), l.add && (l.add.call(a, k), k.handler.guid || (k.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, k) : m.push(k), n.event.global[o] = !0)
      }
    },
    remove: function (a, b, c, d, e) {
      var f, g, h, i, j, k, l, m, o, p, q, r = L.hasData(a) && L.get(a);
      if (r && (i = r.events)) {
        b = (b || "").match(E) || [""], j = b.length;
        while (j--)
          if (h = Y.exec(b[j]) || [], o = q = h[1], p = (h[2] || "").split(".").sort(), o) {
            l = n.event.special[o] || {}, o = (d ? l.delegateType : l.bindType) || o, m = i[o] || [], h = h[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), g = f = m.length;
            while (f--) k = m[f], !e && q !== k.origType || c && c.guid !== k.guid || h && !h.test(k.namespace) || d && d !== k.selector && ("**" !== d || !k.selector) || (m.splice(f, 1), k.selector && m.delegateCount--, l.remove && l.remove.call(a, k));
            g && !m.length && (l.teardown && l.teardown.call(a, p, r.handle) !== !1 || n.removeEvent(a, o, r.handle), delete i[o])
          } else
            for (o in i) n.event.remove(a, o + b[j], c, d, !0);
        n.isEmptyObject(i) && (delete r.handle, L.remove(a, "events"))
      }
    },
    trigger: function (b, c, d, e) {
      var f, g, h, i, k, m, o, p = [d || l],
        q = j.call(b, "type") ? b.type : b,
        r = j.call(b, "namespace") ? b.namespace.split(".") : [];
      if (g = h = d = d || l, 3 !== d.nodeType && 8 !== d.nodeType && !X.test(q + n.event.triggered) && (q.indexOf(".") >= 0 && (r = q.split("."), q = r.shift(), r.sort()), k = q.indexOf(":") < 0 && "on" + q, b = b[n.expando] ? b : new n.Event(q, "object" == typeof b && b), b.isTrigger = e ? 2 : 3, b.namespace = r.join("."), b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + r.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = d), c = null == c ? [b] : n.makeArray(c, [b]), o = n.event.special[q] || {}, e || !o.trigger || o.trigger.apply(d, c) !== !1)) {
        if (!e && !o.noBubble && !n.isWindow(d)) {
          for (i = o.delegateType || q, X.test(i + q) || (g = g.parentNode); g; g = g.parentNode) p.push(g), h = g;
          h === (d.ownerDocument || l) && p.push(h.defaultView || h.parentWindow || a)
        }
        f = 0;
        while ((g = p[f++]) && !b.isPropagationStopped()) b.type = f > 1 ? i : o.bindType || q, m = (L.get(g, "events") || {})[b.type] && L.get(g, "handle"), m && m.apply(g, c), m = k && g[k], m && m.apply && n.acceptData(g) && (b.result = m.apply(g, c), b.result === !1 && b.preventDefault());
        return b.type = q, e || b.isDefaultPrevented() || o._default && o._default.apply(p.pop(), c) !== !1 || !n.acceptData(d) || k && n.isFunction(d[q]) && !n.isWindow(d) && (h = d[k], h && (d[k] = null), n.event.triggered = q, d[q](), n.event.triggered = void 0, h && (d[k] = h)), b.result
      }
    },
    dispatch: function (a) {
      a = n.event.fix(a);
      var b, c, e, f, g, h = [],
        i = d.call(arguments),
        j = (L.get(this, "events") || {})[a.type] || [],
        k = n.event.special[a.type] || {};
      if (i[0] = a, a.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, a) !== !1) {
        h = n.event.handlers.call(this, a, j), b = 0;
        while ((f = h[b++]) && !a.isPropagationStopped()) {
          a.currentTarget = f.elem, c = 0;
          while ((g = f.handlers[c++]) && !a.isImmediatePropagationStopped())(!a.namespace_re || a.namespace_re.test(g.namespace)) && (a.handleObj = g, a.data = g.data, e = ((n.event.special[g.origType] || {}).handle || g.handler).apply(f.elem, i), void 0 !== e && (a.result = e) === !1 && (a.preventDefault(), a.stopPropagation()))
        }
        return k.postDispatch && k.postDispatch.call(this, a), a.result
      }
    },
    handlers: function (a, b) {
      var c, d, e, f, g = [],
        h = b.delegateCount,
        i = a.target;
      if (h && i.nodeType && (!a.button || "click" !== a.type))
        for (; i !== this; i = i.parentNode || this)
          if (i.disabled !== !0 || "click" !== a.type) {
            for (d = [], c = 0; h > c; c++) f = b[c], e = f.selector + " ", void 0 === d[e] && (d[e] = f.needsContext ? n(e, this).index(i) >= 0 : n.find(e, this, null, [i]).length), d[e] && d.push(f);
            d.length && g.push({
              elem: i,
              handlers: d
            })
          } return h < b.length && g.push({
        elem: this,
        handlers: b.slice(h)
      }), g
    },
    props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    fixHooks: {},
    keyHooks: {
      props: "char charCode key keyCode".split(" "),
      filter: function (a, b) {
        return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
      }
    },
    mouseHooks: {
      props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      filter: function (a, b) {
        var c, d, e, f = b.button;
        return null == a.pageX && null != b.clientX && (c = a.target.ownerDocument || l, d = c.documentElement, e = c.body, a.pageX = b.clientX + (d && d.scrollLeft || e && e.scrollLeft || 0) - (d && d.clientLeft || e && e.clientLeft || 0), a.pageY = b.clientY + (d && d.scrollTop || e && e.scrollTop || 0) - (d && d.clientTop || e && e.clientTop || 0)), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), a
      }
    },
    fix: function (a) {
      if (a[n.expando]) return a;
      var b, c, d, e = a.type,
        f = a,
        g = this.fixHooks[e];
      g || (this.fixHooks[e] = g = W.test(e) ? this.mouseHooks : V.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new n.Event(f), b = d.length;
      while (b--) c = d[b], a[c] = f[c];
      return a.target || (a.target = l), 3 === a.target.nodeType && (a.target = a.target.parentNode), g.filter ? g.filter(a, f) : a
    },
    special: {
      load: {
        noBubble: !0
      },
      focus: {
        trigger: function () {
          return this !== _() && this.focus ? (this.focus(), !1) : void 0
        },
        delegateType: "focusin"
      },
      blur: {
        trigger: function () {
          return this === _() && this.blur ? (this.blur(), !1) : void 0
        },
        delegateType: "focusout"
      },
      click: {
        trigger: function () {
          return "checkbox" === this.type && this.click && n.nodeName(this, "input") ? (this.click(), !1) : void 0
        },
        _default: function (a) {
          return n.nodeName(a.target, "a")
        }
      },
      beforeunload: {
        postDispatch: function (a) {
          void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
        }
      }
    },
    simulate: function (a, b, c, d) {
      var e = n.extend(new n.Event, c, {
        type: a,
        isSimulated: !0,
        originalEvent: {}
      });
      d ? n.event.trigger(e, null, b) : n.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
    }
  }, n.removeEvent = function (a, b, c) {
    a.removeEventListener && a.removeEventListener(b, c, !1)
  }, n.Event = function (a, b) {
    return this instanceof n.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? Z : $) : this.type = a, b && n.extend(this, b), this.timeStamp = a && a.timeStamp || n.now(), void(this[n.expando] = !0)) : new n.Event(a, b)
  }, n.Event.prototype = {
    isDefaultPrevented: $,
    isPropagationStopped: $,
    isImmediatePropagationStopped: $,
    preventDefault: function () {
      var a = this.originalEvent;
      this.isDefaultPrevented = Z, a && a.preventDefault && a.preventDefault()
    },
    stopPropagation: function () {
      var a = this.originalEvent;
      this.isPropagationStopped = Z, a && a.stopPropagation && a.stopPropagation()
    },
    stopImmediatePropagation: function () {
      var a = this.originalEvent;
      this.isImmediatePropagationStopped = Z, a && a.stopImmediatePropagation && a.stopImmediatePropagation(), this.stopPropagation()
    }
  }, n.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout",
    pointerenter: "pointerover",
    pointerleave: "pointerout"
  }, function (a, b) {
    n.event.special[a] = {
      delegateType: b,
      bindType: b,
      handle: function (a) {
        var c, d = this,
          e = a.relatedTarget,
          f = a.handleObj;
        return (!e || e !== d && !n.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c
      }
    }
  }), k.focusinBubbles || n.each({
    focus: "focusin",
    blur: "focusout"
  }, function (a, b) {
    var c = function (a) {
      n.event.simulate(b, a.target, n.event.fix(a), !0)
    };
    n.event.special[b] = {
      setup: function () {
        var d = this.ownerDocument || this,
          e = L.access(d, b);
        e || d.addEventListener(a, c, !0), L.access(d, b, (e || 0) + 1)
      },
      teardown: function () {
        var d = this.ownerDocument || this,
          e = L.access(d, b) - 1;
        e ? L.access(d, b, e) : (d.removeEventListener(a, c, !0), L.remove(d, b))
      }
    }
  }), n.fn.extend({
    on: function (a, b, c, d, e) {
      var f, g;
      if ("object" == typeof a) {
        "string" != typeof b && (c = c || b, b = void 0);
        for (g in a) this.on(g, b, c, a[g], e);
        return this
      }
      if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, c = void 0) : (d = c, c = b, b = void 0)), d === !1) d = $;
      else if (!d) return this;
      return 1 === e && (f = d, d = function (a) {
        return n().off(a), f.apply(this, arguments)
      }, d.guid = f.guid || (f.guid = n.guid++)), this.each(function () {
        n.event.add(this, a, d, c, b)
      })
    },
    one: function (a, b, c, d) {
      return this.on(a, b, c, d, 1)
    },
    off: function (a, b, c) {
      var d, e;
      if (a && a.preventDefault && a.handleObj) return d = a.handleObj, n(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;
      if ("object" == typeof a) {
        for (e in a) this.off(e, b, a[e]);
        return this
      }
      return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = $), this.each(function () {
        n.event.remove(this, a, c, b)
      })
    },
    trigger: function (a, b) {
      return this.each(function () {
        n.event.trigger(a, b, this)
      })
    },
    triggerHandler: function (a, b) {
      var c = this[0];
      return c ? n.event.trigger(a, b, c, !0) : void 0
    }
  });
  var ab = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    bb = /<([\w:]+)/,
    cb = /<|&#?\w+;/,
    db = /<(?:script|style|link)/i,
    eb = /checked\s*(?:[^=]|=\s*.checked.)/i,
    fb = /^$|\/(?:java|ecma)script/i,
    gb = /^true\/(.*)/,
    hb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
    ib = {
      option: [1, "<select multiple='multiple'>", "</select>"],
      thead: [1, "<table>", "</table>"],
      col: [2, "<table><colgroup>", "</colgroup></table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: [0, "", ""]
    };
  ib.optgroup = ib.option, ib.tbody = ib.tfoot = ib.colgroup = ib.caption = ib.thead, ib.th = ib.td;

  function jb(a, b) {
    return n.nodeName(a, "table") && n.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
  }

  function kb(a) {
    return a.type = (null !== a.getAttribute("type")) + "/" + a.type, a
  }

  function lb(a) {
    var b = gb.exec(a.type);
    return b ? a.type = b[1] : a.removeAttribute("type"), a
  }

  function mb(a, b) {
    for (var c = 0, d = a.length; d > c; c++) L.set(a[c], "globalEval", !b || L.get(b[c], "globalEval"))
  }

  function nb(a, b) {
    var c, d, e, f, g, h, i, j;
    if (1 === b.nodeType) {
      if (L.hasData(a) && (f = L.access(a), g = L.set(b, f), j = f.events)) {
        delete g.handle, g.events = {};
        for (e in j)
          for (c = 0, d = j[e].length; d > c; c++) n.event.add(b, e, j[e][c])
      }
      M.hasData(a) && (h = M.access(a), i = n.extend({}, h), M.set(b, i))
    }
  }

  function ob(a, b) {
    var c = a.getElementsByTagName ? a.getElementsByTagName(b || "*") : a.querySelectorAll ? a.querySelectorAll(b || "*") : [];
    return void 0 === b || b && n.nodeName(a, b) ? n.merge([a], c) : c
  }

  function pb(a, b) {
    var c = b.nodeName.toLowerCase();
    "input" === c && T.test(a.type) ? b.checked = a.checked : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
  }
  n.extend({
    clone: function (a, b, c) {
      var d, e, f, g, h = a.cloneNode(!0),
        i = n.contains(a.ownerDocument, a);
      if (!(k.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || n.isXMLDoc(a)))
        for (g = ob(h), f = ob(a), d = 0, e = f.length; e > d; d++) pb(f[d], g[d]);
      if (b)
        if (c)
          for (f = f || ob(a), g = g || ob(h), d = 0, e = f.length; e > d; d++) nb(f[d], g[d]);
        else nb(a, h);
      return g = ob(h, "script"), g.length > 0 && mb(g, !i && ob(a, "script")), h
    },
    buildFragment: function (a, b, c, d) {
      for (var e, f, g, h, i, j, k = b.createDocumentFragment(), l = [], m = 0, o = a.length; o > m; m++)
        if (e = a[m], e || 0 === e)
          if ("object" === n.type(e)) n.merge(l, e.nodeType ? [e] : e);
          else if (cb.test(e)) {
        f = f || k.appendChild(b.createElement("div")), g = (bb.exec(e) || ["", ""])[1].toLowerCase(), h = ib[g] || ib._default, f.innerHTML = h[1] + e.replace(ab, "<$1></$2>") + h[2], j = h[0];
        while (j--) f = f.lastChild;
        n.merge(l, f.childNodes), f = k.firstChild, f.textContent = ""
      } else l.push(b.createTextNode(e));
      k.textContent = "", m = 0;
      while (e = l[m++])
        if ((!d || -1 === n.inArray(e, d)) && (i = n.contains(e.ownerDocument, e), f = ob(k.appendChild(e), "script"), i && mb(f), c)) {
          j = 0;
          while (e = f[j++]) fb.test(e.type || "") && c.push(e)
        } return k
    },
    cleanData: function (a) {
      for (var b, c, d, e, f = n.event.special, g = 0; void 0 !== (c = a[g]); g++) {
        if (n.acceptData(c) && (e = c[L.expando], e && (b = L.cache[e]))) {
          if (b.events)
            for (d in b.events) f[d] ? n.event.remove(c, d) : n.removeEvent(c, d, b.handle);
          L.cache[e] && delete L.cache[e]
        }
        delete M.cache[c[M.expando]]
      }
    }
  }), n.fn.extend({
    text: function (a) {
      return J(this, function (a) {
        return void 0 === a ? n.text(this) : this.empty().each(function () {
          (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = a)
        })
      }, null, a, arguments.length)
    },
    append: function () {
      return this.domManip(arguments, function (a) {
        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
          var b = jb(this, a);
          b.appendChild(a)
        }
      })
    },
    prepend: function () {
      return this.domManip(arguments, function (a) {
        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
          var b = jb(this, a);
          b.insertBefore(a, b.firstChild)
        }
      })
    },
    before: function () {
      return this.domManip(arguments, function (a) {
        this.parentNode && this.parentNode.insertBefore(a, this)
      })
    },
    after: function () {
      return this.domManip(arguments, function (a) {
        this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
      })
    },
    remove: function (a, b) {
      for (var c, d = a ? n.filter(a, this) : this, e = 0; null != (c = d[e]); e++) b || 1 !== c.nodeType || n.cleanData(ob(c)), c.parentNode && (b && n.contains(c.ownerDocument, c) && mb(ob(c, "script")), c.parentNode.removeChild(c));
      return this
    },
    empty: function () {
      for (var a, b = 0; null != (a = this[b]); b++) 1 === a.nodeType && (n.cleanData(ob(a, !1)), a.textContent = "");
      return this
    },
    clone: function (a, b) {
      return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function () {
        return n.clone(this, a, b)
      })
    },
    html: function (a) {
      return J(this, function (a) {
        var b = this[0] || {},
          c = 0,
          d = this.length;
        if (void 0 === a && 1 === b.nodeType) return b.innerHTML;
        if ("string" == typeof a && !db.test(a) && !ib[(bb.exec(a) || ["", ""])[1].toLowerCase()]) {
          a = a.replace(ab, "<$1></$2>");
          try {
            for (; d > c; c++) b = this[c] || {}, 1 === b.nodeType && (n.cleanData(ob(b, !1)), b.innerHTML = a);
            b = 0
          } catch (e) {}
        }
        b && this.empty().append(a)
      }, null, a, arguments.length)
    },
    replaceWith: function () {
      var a = arguments[0];
      return this.domManip(arguments, function (b) {
        a = this.parentNode, n.cleanData(ob(this)), a && a.replaceChild(b, this)
      }), a && (a.length || a.nodeType) ? this : this.remove()
    },
    detach: function (a) {
      return this.remove(a, !0)
    },
    domManip: function (a, b) {
      a = e.apply([], a);
      var c, d, f, g, h, i, j = 0,
        l = this.length,
        m = this,
        o = l - 1,
        p = a[0],
        q = n.isFunction(p);
      if (q || l > 1 && "string" == typeof p && !k.checkClone && eb.test(p)) return this.each(function (c) {
        var d = m.eq(c);
        q && (a[0] = p.call(this, c, d.html())), d.domManip(a, b)
      });
      if (l && (c = n.buildFragment(a, this[0].ownerDocument, !1, this), d = c.firstChild, 1 === c.childNodes.length && (c = d), d)) {
        for (f = n.map(ob(c, "script"), kb), g = f.length; l > j; j++) h = c, j !== o && (h = n.clone(h, !0, !0), g && n.merge(f, ob(h, "script"))), b.call(this[j], h, j);
        if (g)
          for (i = f[f.length - 1].ownerDocument, n.map(f, lb), j = 0; g > j; j++) h = f[j], fb.test(h.type || "") && !L.access(h, "globalEval") && n.contains(i, h) && (h.src ? n._evalUrl && n._evalUrl(h.src) : n.globalEval(h.textContent.replace(hb, "")))
      }
      return this
    }
  }), n.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function (a, b) {
    n.fn[a] = function (a) {
      for (var c, d = [], e = n(a), g = e.length - 1, h = 0; g >= h; h++) c = h === g ? this : this.clone(!0), n(e[h])[b](c), f.apply(d, c.get());
      return this.pushStack(d)
    }
  });
  var qb, rb = {};

  function sb(b, c) {
    var d, e = n(c.createElement(b)).appendTo(c.body),
      f = a.getDefaultComputedStyle && (d = a.getDefaultComputedStyle(e[0])) ? d.display : n.css(e[0], "display");
    return e.detach(), f
  }

  function tb(a) {
    var b = l,
      c = rb[a];
    return c || (c = sb(a, b), "none" !== c && c || (qb = (qb || n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b = qb[0].contentDocument, b.write(), b.close(), c = sb(a, b), qb.detach()), rb[a] = c), c
  }
  var ub = /^margin/,
    vb = new RegExp("^(" + Q + ")(?!px)[a-z%]+$", "i"),
    wb = function (a) {
      return a.ownerDocument.defaultView.getComputedStyle(a, null)
    };

  function xb(a, b, c) {
    var d, e, f, g, h = a.style;
    return c = c || wb(a), c && (g = c.getPropertyValue(b) || c[b]), c && ("" !== g || n.contains(a.ownerDocument, a) || (g = n.style(a, b)), vb.test(g) && ub.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 !== g ? g + "" : g
  }

  function yb(a, b) {
    return {
      get: function () {
        return a() ? void delete this.get : (this.get = b).apply(this, arguments)
      }
    }
  }! function () {
    var b, c, d = l.documentElement,
      e = l.createElement("div"),
      f = l.createElement("div");
    if (f.style) {
      f.style.backgroundClip = "content-box", f.cloneNode(!0).style.backgroundClip = "", k.clearCloneStyle = "content-box" === f.style.backgroundClip, e.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute", e.appendChild(f);

      function g() {
        f.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", f.innerHTML = "", d.appendChild(e);
        var g = a.getComputedStyle(f, null);
        b = "1%" !== g.top, c = "4px" === g.width, d.removeChild(e)
      }
      a.getComputedStyle && n.extend(k, {
        pixelPosition: function () {
          return g(), b
        },
        boxSizingReliable: function () {
          return null == c && g(), c
        },
        reliableMarginRight: function () {
          var b, c = f.appendChild(l.createElement("div"));
          return c.style.cssText = f.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", c.style.marginRight = c.style.width = "0", f.style.width = "1px", d.appendChild(e), b = !parseFloat(a.getComputedStyle(c, null).marginRight), d.removeChild(e), b
        }
      })
    }
  }(), n.swap = function (a, b, c, d) {
    var e, f, g = {};
    for (f in b) g[f] = a.style[f], a.style[f] = b[f];
    e = c.apply(a, d || []);
    for (f in b) a.style[f] = g[f];
    return e
  };
  var zb = /^(none|table(?!-c[ea]).+)/,
    Ab = new RegExp("^(" + Q + ")(.*)$", "i"),
    Bb = new RegExp("^([+-])=(" + Q + ")", "i"),
    Cb = {
      position: "absolute",
      visibility: "hidden",
      display: "block"
    },
    Db = {
      letterSpacing: "0",
      fontWeight: "400"
    },
    Eb = ["Webkit", "O", "Moz", "ms"];

  function Fb(a, b) {
    if (b in a) return b;
    var c = b[0].toUpperCase() + b.slice(1),
      d = b,
      e = Eb.length;
    while (e--)
      if (b = Eb[e] + c, b in a) return b;
    return d
  }

  function Gb(a, b, c) {
    var d = Ab.exec(b);
    return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
  }

  function Hb(a, b, c, d, e) {
    for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2) "margin" === c && (g += n.css(a, c + R[f], !0, e)), d ? ("content" === c && (g -= n.css(a, "padding" + R[f], !0, e)), "margin" !== c && (g -= n.css(a, "border" + R[f] + "Width", !0, e))) : (g += n.css(a, "padding" + R[f], !0, e), "padding" !== c && (g += n.css(a, "border" + R[f] + "Width", !0, e)));
    return g
  }

  function Ib(a, b, c) {
    var d = !0,
      e = "width" === b ? a.offsetWidth : a.offsetHeight,
      f = wb(a),
      g = "border-box" === n.css(a, "boxSizing", !1, f);
    if (0 >= e || null == e) {
      if (e = xb(a, b, f), (0 > e || null == e) && (e = a.style[b]), vb.test(e)) return e;
      d = g && (k.boxSizingReliable() || e === a.style[b]), e = parseFloat(e) || 0
    }
    return e + Hb(a, b, c || (g ? "border" : "content"), d, f) + "px"
  }

  function Jb(a, b) {
    for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++) d = a[g], d.style && (f[g] = L.get(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && S(d) && (f[g] = L.access(d, "olddisplay", tb(d.nodeName)))) : (e = S(d), "none" === c && e || L.set(d, "olddisplay", e ? c : n.css(d, "display"))));
    for (g = 0; h > g; g++) d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
    return a
  }
  n.extend({
    cssHooks: {
      opacity: {
        get: function (a, b) {
          if (b) {
            var c = xb(a, "opacity");
            return "" === c ? "1" : c
          }
        }
      }
    },
    cssNumber: {
      columnCount: !0,
      fillOpacity: !0,
      flexGrow: !0,
      flexShrink: !0,
      fontWeight: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0
    },
    cssProps: {
      "float": "cssFloat"
    },
    style: function (a, b, c, d) {
      if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
        var e, f, g, h = n.camelCase(b),
          i = a.style;
        return b = n.cssProps[h] || (n.cssProps[h] = Fb(i, h)), g = n.cssHooks[b] || n.cssHooks[h], void 0 === c ? g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b] : (f = typeof c, "string" === f && (e = Bb.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(n.css(a, b)), f = "number"), null != c && c === c && ("number" !== f || n.cssNumber[h] || (c += "px"), k.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), g && "set" in g && void 0 === (c = g.set(a, c, d)) || (i[b] = c)), void 0)
      }
    },
    css: function (a, b, c, d) {
      var e, f, g, h = n.camelCase(b);
      return b = n.cssProps[h] || (n.cssProps[h] = Fb(a.style, h)), g = n.cssHooks[b] || n.cssHooks[h], g && "get" in g && (e = g.get(a, !0, c)), void 0 === e && (e = xb(a, b, d)), "normal" === e && b in Db && (e = Db[b]), "" === c || c ? (f = parseFloat(e), c === !0 || n.isNumeric(f) ? f || 0 : e) : e
    }
  }), n.each(["height", "width"], function (a, b) {
    n.cssHooks[b] = {
      get: function (a, c, d) {
        return c ? zb.test(n.css(a, "display")) && 0 === a.offsetWidth ? n.swap(a, Cb, function () {
          return Ib(a, b, d)
        }) : Ib(a, b, d) : void 0
      },
      set: function (a, c, d) {
        var e = d && wb(a);
        return Gb(a, c, d ? Hb(a, b, d, "border-box" === n.css(a, "boxSizing", !1, e), e) : 0)
      }
    }
  }), n.cssHooks.marginRight = yb(k.reliableMarginRight, function (a, b) {
    return b ? n.swap(a, {
      display: "inline-block"
    }, xb, [a, "marginRight"]) : void 0
  }), n.each({
    margin: "",
    padding: "",
    border: "Width"
  }, function (a, b) {
    n.cssHooks[a + b] = {
      expand: function (c) {
        for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++) e[a + R[d] + b] = f[d] || f[d - 2] || f[0];
        return e
      }
    }, ub.test(a) || (n.cssHooks[a + b].set = Gb)
  }), n.fn.extend({
    css: function (a, b) {
      return J(this, function (a, b, c) {
        var d, e, f = {},
          g = 0;
        if (n.isArray(b)) {
          for (d = wb(a), e = b.length; e > g; g++) f[b[g]] = n.css(a, b[g], !1, d);
          return f
        }
        return void 0 !== c ? n.style(a, b, c) : n.css(a, b)
      }, a, b, arguments.length > 1)
    },
    show: function () {
      return Jb(this, !0)
    },
    hide: function () {
      return Jb(this)
    },
    toggle: function (a) {
      return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function () {
        S(this) ? n(this).show() : n(this).hide()
      })
    }
  });

  function Kb(a, b, c, d, e) {
    return new Kb.prototype.init(a, b, c, d, e)
  }
  n.Tween = Kb, Kb.prototype = {
    constructor: Kb,
    init: function (a, b, c, d, e, f) {
      this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (n.cssNumber[c] ? "" : "px")
    },
    cur: function () {
      var a = Kb.propHooks[this.prop];
      return a && a.get ? a.get(this) : Kb.propHooks._default.get(this)
    },
    run: function (a) {
      var b, c = Kb.propHooks[this.prop];
      return this.pos = b = this.options.duration ? n.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : Kb.propHooks._default.set(this), this
    }
  }, Kb.prototype.init.prototype = Kb.prototype, Kb.propHooks = {
    _default: {
      get: function (a) {
        var b;
        return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = n.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop]
      },
      set: function (a) {
        n.fx.step[a.prop] ? n.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[n.cssProps[a.prop]] || n.cssHooks[a.prop]) ? n.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
      }
    }
  }, Kb.propHooks.scrollTop = Kb.propHooks.scrollLeft = {
    set: function (a) {
      a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
    }
  }, n.easing = {
    linear: function (a) {
      return a
    },
    swing: function (a) {
      return .5 - Math.cos(a * Math.PI) / 2
    }
  }, n.fx = Kb.prototype.init, n.fx.step = {};
  var Lb, Mb, Nb = /^(?:toggle|show|hide)$/,
    Ob = new RegExp("^(?:([+-])=|)(" + Q + ")([a-z%]*)$", "i"),
    Pb = /queueHooks$/,
    Qb = [Vb],
    Rb = {
      "*": [function (a, b) {
        var c = this.createTween(a, b),
          d = c.cur(),
          e = Ob.exec(b),
          f = e && e[3] || (n.cssNumber[a] ? "" : "px"),
          g = (n.cssNumber[a] || "px" !== f && +d) && Ob.exec(n.css(c.elem, a)),
          h = 1,
          i = 20;
        if (g && g[3] !== f) {
          f = f || g[3], e = e || [], g = +d || 1;
          do h = h || ".5", g /= h, n.style(c.elem, a, g + f); while (h !== (h = c.cur() / d) && 1 !== h && --i)
        }
        return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), c
      }]
    };

  function Sb() {
    return setTimeout(function () {
      Lb = void 0
    }), Lb = n.now()
  }

  function Tb(a, b) {
    var c, d = 0,
      e = {
        height: a
      };
    for (b = b ? 1 : 0; 4 > d; d += 2 - b) c = R[d], e["margin" + c] = e["padding" + c] = a;
    return b && (e.opacity = e.width = a), e
  }

  function Ub(a, b, c) {
    for (var d, e = (Rb[b] || []).concat(Rb["*"]), f = 0, g = e.length; g > f; f++)
      if (d = e[f].call(c, b, a)) return d
  }

  function Vb(a, b, c) {
    var d, e, f, g, h, i, j, k, l = this,
      m = {},
      o = a.style,
      p = a.nodeType && S(a),
      q = L.get(a, "fxshow");
    c.queue || (h = n._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function () {
      h.unqueued || i()
    }), h.unqueued++, l.always(function () {
      l.always(function () {
        h.unqueued--, n.queue(a, "fx").length || h.empty.fire()
      })
    })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [o.overflow, o.overflowX, o.overflowY], j = n.css(a, "display"), k = "none" === j ? L.get(a, "olddisplay") || tb(a.nodeName) : j, "inline" === k && "none" === n.css(a, "float") && (o.display = "inline-block")), c.overflow && (o.overflow = "hidden", l.always(function () {
      o.overflow = c.overflow[0], o.overflowX = c.overflow[1], o.overflowY = c.overflow[2]
    }));
    for (d in b)
      if (e = b[d], Nb.exec(e)) {
        if (delete b[d], f = f || "toggle" === e, e === (p ? "hide" : "show")) {
          if ("show" !== e || !q || void 0 === q[d]) continue;
          p = !0
        }
        m[d] = q && q[d] || n.style(a, d)
      } else j = void 0;
    if (n.isEmptyObject(m)) "inline" === ("none" === j ? tb(a.nodeName) : j) && (o.display = j);
    else {
      q ? "hidden" in q && (p = q.hidden) : q = L.access(a, "fxshow", {}), f && (q.hidden = !p), p ? n(a).show() : l.done(function () {
        n(a).hide()
      }), l.done(function () {
        var b;
        L.remove(a, "fxshow");
        for (b in m) n.style(a, b, m[b])
      });
      for (d in m) g = Ub(p ? q[d] : 0, d, l), d in q || (q[d] = g.start, p && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0))
    }
  }

  function Wb(a, b) {
    var c, d, e, f, g;
    for (c in a)
      if (d = n.camelCase(c), e = b[d], f = a[c], n.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = n.cssHooks[d], g && "expand" in g) {
        f = g.expand(f), delete a[d];
        for (c in f) c in a || (a[c] = f[c], b[c] = e)
      } else b[d] = e
  }

  function Xb(a, b, c) {
    var d, e, f = 0,
      g = Qb.length,
      h = n.Deferred().always(function () {
        delete i.elem
      }),
      i = function () {
        if (e) return !1;
        for (var b = Lb || Sb(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++) j.tweens[g].run(f);
        return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1)
      },
      j = h.promise({
        elem: a,
        props: n.extend({}, b),
        opts: n.extend(!0, {
          specialEasing: {}
        }, c),
        originalProperties: b,
        originalOptions: c,
        startTime: Lb || Sb(),
        duration: c.duration,
        tweens: [],
        createTween: function (b, c) {
          var d = n.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
          return j.tweens.push(d), d
        },
        stop: function (b) {
          var c = 0,
            d = b ? j.tweens.length : 0;
          if (e) return this;
          for (e = !0; d > c; c++) j.tweens[c].run(1);
          return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
        }
      }),
      k = j.props;
    for (Wb(k, j.opts.specialEasing); g > f; f++)
      if (d = Qb[f].call(j, a, k, j.opts)) return d;
    return n.map(k, Ub, j), n.isFunction(j.opts.start) && j.opts.start.call(a, j), n.fx.timer(n.extend(i, {
      elem: a,
      anim: j,
      queue: j.opts.queue
    })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
  }
  n.Animation = n.extend(Xb, {
      tweener: function (a, b) {
        n.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
        for (var c, d = 0, e = a.length; e > d; d++) c = a[d], Rb[c] = Rb[c] || [], Rb[c].unshift(b)
      },
      prefilter: function (a, b) {
        b ? Qb.unshift(a) : Qb.push(a)
      }
    }), n.speed = function (a, b, c) {
      var d = a && "object" == typeof a ? n.extend({}, a) : {
        complete: c || !c && b || n.isFunction(a) && a,
        duration: a,
        easing: c && b || b && !n.isFunction(b) && b
      };
      return d.duration = n.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in n.fx.speeds ? n.fx.speeds[d.duration] : n.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function () {
        n.isFunction(d.old) && d.old.call(this), d.queue && n.dequeue(this, d.queue)
      }, d
    }, n.fn.extend({
      fadeTo: function (a, b, c, d) {
        return this.filter(S).css("opacity", 0).show().end().animate({
          opacity: b
        }, a, c, d)
      },
      animate: function (a, b, c, d) {
        var e = n.isEmptyObject(a),
          f = n.speed(b, c, d),
          g = function () {
            var b = Xb(this, n.extend({}, a), f);
            (e || L.get(this, "finish")) && b.stop(!0)
          };
        return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
      },
      stop: function (a, b, c) {
        var d = function (a) {
          var b = a.stop;
          delete a.stop, b(c)
        };
        return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function () {
          var b = !0,
            e = null != a && a + "queueHooks",
            f = n.timers,
            g = L.get(this);
          if (e) g[e] && g[e].stop && d(g[e]);
          else
            for (e in g) g[e] && g[e].stop && Pb.test(e) && d(g[e]);
          for (e = f.length; e--;) f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1));
          (b || !c) && n.dequeue(this, a)
        })
      },
      finish: function (a) {
        return a !== !1 && (a = a || "fx"), this.each(function () {
          var b, c = L.get(this),
            d = c[a + "queue"],
            e = c[a + "queueHooks"],
            f = n.timers,
            g = d ? d.length : 0;
          for (c.finish = !0, n.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;) f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
          for (b = 0; g > b; b++) d[b] && d[b].finish && d[b].finish.call(this);
          delete c.finish
        })
      }
    }), n.each(["toggle", "show", "hide"], function (a, b) {
      var c = n.fn[b];
      n.fn[b] = function (a, d, e) {
        return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(Tb(b, !0), a, d, e)
      }
    }), n.each({
      slideDown: Tb("show"),
      slideUp: Tb("hide"),
      slideToggle: Tb("toggle"),
      fadeIn: {
        opacity: "show"
      },
      fadeOut: {
        opacity: "hide"
      },
      fadeToggle: {
        opacity: "toggle"
      }
    }, function (a, b) {
      n.fn[a] = function (a, c, d) {
        return this.animate(b, a, c, d)
      }
    }), n.timers = [], n.fx.tick = function () {
      var a, b = 0,
        c = n.timers;
      for (Lb = n.now(); b < c.length; b++) a = c[b], a() || c[b] !== a || c.splice(b--, 1);
      c.length || n.fx.stop(), Lb = void 0
    }, n.fx.timer = function (a) {
      n.timers.push(a), a() ? n.fx.start() : n.timers.pop()
    }, n.fx.interval = 13, n.fx.start = function () {
      Mb || (Mb = setInterval(n.fx.tick, n.fx.interval))
    }, n.fx.stop = function () {
      clearInterval(Mb), Mb = null
    }, n.fx.speeds = {
      slow: 600,
      fast: 200,
      _default: 400
    }, n.fn.delay = function (a, b) {
      return a = n.fx ? n.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function (b, c) {
        var d = setTimeout(b, a);
        c.stop = function () {
          clearTimeout(d)
        }
      })
    },
    function () {
      var a = l.createElement("input"),
        b = l.createElement("select"),
        c = b.appendChild(l.createElement("option"));
      a.type = "checkbox", k.checkOn = "" !== a.value, k.optSelected = c.selected, b.disabled = !0, k.optDisabled = !c.disabled, a = l.createElement("input"), a.value = "t", a.type = "radio", k.radioValue = "t" === a.value
    }();
  var Yb, Zb, $b = n.expr.attrHandle;
  n.fn.extend({
    attr: function (a, b) {
      return J(this, n.attr, a, b, arguments.length > 1)
    },
    removeAttr: function (a) {
      return this.each(function () {
        n.removeAttr(this, a)
      })
    }
  }), n.extend({
    attr: function (a, b, c) {
      var d, e, f = a.nodeType;
      if (a && 3 !== f && 8 !== f && 2 !== f) return typeof a.getAttribute === U ? n.prop(a, b, c) : (1 === f && n.isXMLDoc(a) || (b = b.toLowerCase(), d = n.attrHooks[b] || (n.expr.match.bool.test(b) ? Zb : Yb)), void 0 === c ? d && "get" in d && null !== (e = d.get(a, b)) ? e : (e = n.find.attr(a, b), null == e ? void 0 : e) : null !== c ? d && "set" in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), c) : void n.removeAttr(a, b))
    },
    removeAttr: function (a, b) {
      var c, d, e = 0,
        f = b && b.match(E);
      if (f && 1 === a.nodeType)
        while (c = f[e++]) d = n.propFix[c] || c, n.expr.match.bool.test(c) && (a[d] = !1), a.removeAttribute(c)
    },
    attrHooks: {
      type: {
        set: function (a, b) {
          if (!k.radioValue && "radio" === b && n.nodeName(a, "input")) {
            var c = a.value;
            return a.setAttribute("type", b), c && (a.value = c), b
          }
        }
      }
    }
  }), Zb = {
    set: function (a, b, c) {
      return b === !1 ? n.removeAttr(a, c) : a.setAttribute(c, c), c
    }
  }, n.each(n.expr.match.bool.source.match(/\w+/g), function (a, b) {
    var c = $b[b] || n.find.attr;
    $b[b] = function (a, b, d) {
      var e, f;
      return d || (f = $b[b], $b[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, $b[b] = f), e
    }
  });
  var _b = /^(?:input|select|textarea|button)$/i;
  n.fn.extend({
    prop: function (a, b) {
      return J(this, n.prop, a, b, arguments.length > 1)
    },
    removeProp: function (a) {
      return this.each(function () {
        delete this[n.propFix[a] || a]
      })
    }
  }), n.extend({
    propFix: {
      "for": "htmlFor",
      "class": "className"
    },
    prop: function (a, b, c) {
      var d, e, f, g = a.nodeType;
      if (a && 3 !== g && 8 !== g && 2 !== g) return f = 1 !== g || !n.isXMLDoc(a), f && (b = n.propFix[b] || b, e = n.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b]
    },
    propHooks: {
      tabIndex: {
        get: function (a) {
          return a.hasAttribute("tabindex") || _b.test(a.nodeName) || a.href ? a.tabIndex : -1
        }
      }
    }
  }), k.optSelected || (n.propHooks.selected = {
    get: function (a) {
      var b = a.parentNode;
      return b && b.parentNode && b.parentNode.selectedIndex, null
    }
  }), n.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
    n.propFix[this.toLowerCase()] = this
  });
  var ac = /[\t\r\n\f]/g;
  n.fn.extend({
    addClass: function (a) {
      var b, c, d, e, f, g, h = "string" == typeof a && a,
        i = 0,
        j = this.length;
      if (n.isFunction(a)) return this.each(function (b) {
        n(this).addClass(a.call(this, b, this.className))
      });
      if (h)
        for (b = (a || "").match(E) || []; j > i; i++)
          if (c = this[i], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(ac, " ") : " ")) {
            f = 0;
            while (e = b[f++]) d.indexOf(" " + e + " ") < 0 && (d += e + " ");
            g = n.trim(d), c.className !== g && (c.className = g)
          } return this
    },
    removeClass: function (a) {
      var b, c, d, e, f, g, h = 0 === arguments.length || "string" == typeof a && a,
        i = 0,
        j = this.length;
      if (n.isFunction(a)) return this.each(function (b) {
        n(this).removeClass(a.call(this, b, this.className))
      });
      if (h)
        for (b = (a || "").match(E) || []; j > i; i++)
          if (c = this[i], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(ac, " ") : "")) {
            f = 0;
            while (e = b[f++])
              while (d.indexOf(" " + e + " ") >= 0) d = d.replace(" " + e + " ", " ");
            g = a ? n.trim(d) : "", c.className !== g && (c.className = g)
          } return this
    },
    toggleClass: function (a, b) {
      var c = typeof a;
      return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(n.isFunction(a) ? function (c) {
        n(this).toggleClass(a.call(this, c, this.className, b), b)
      } : function () {
        if ("string" === c) {
          var b, d = 0,
            e = n(this),
            f = a.match(E) || [];
          while (b = f[d++]) e.hasClass(b) ? e.removeClass(b) : e.addClass(b)
        } else(c === U || "boolean" === c) && (this.className && L.set(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : L.get(this, "__className__") || "")
      })
    },
    hasClass: function (a) {
      for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++)
        if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(ac, " ").indexOf(b) >= 0) return !0;
      return !1
    }
  });
  var bc = /\r/g;
  n.fn.extend({
    val: function (a) {
      var b, c, d, e = this[0]; {
        if (arguments.length) return d = n.isFunction(a), this.each(function (c) {
          var e;
          1 === this.nodeType && (e = d ? a.call(this, c, n(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : n.isArray(e) && (e = n.map(e, function (a) {
            return null == a ? "" : a + ""
          })), b = n.valHooks[this.type] || n.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e))
        });
        if (e) return b = n.valHooks[e.type] || n.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(bc, "") : null == c ? "" : c)
      }
    }
  }), n.extend({
    valHooks: {
      option: {
        get: function (a) {
          var b = n.find.attr(a, "value");
          return null != b ? b : n.trim(n.text(a))
        }
      },
      select: {
        get: function (a) {
          for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)
            if (c = d[i], !(!c.selected && i !== e || (k.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && n.nodeName(c.parentNode, "optgroup"))) {
              if (b = n(c).val(), f) return b;
              g.push(b)
            } return g
        },
        set: function (a, b) {
          var c, d, e = a.options,
            f = n.makeArray(b),
            g = e.length;
          while (g--) d = e[g], (d.selected = n.inArray(d.value, f) >= 0) && (c = !0);
          return c || (a.selectedIndex = -1), f
        }
      }
    }
  }), n.each(["radio", "checkbox"], function () {
    n.valHooks[this] = {
      set: function (a, b) {
        return n.isArray(b) ? a.checked = n.inArray(n(a).val(), b) >= 0 : void 0
      }
    }, k.checkOn || (n.valHooks[this].get = function (a) {
      return null === a.getAttribute("value") ? "on" : a.value
    })
  }), n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (a, b) {
    n.fn[b] = function (a, c) {
      return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
    }
  }), n.fn.extend({
    hover: function (a, b) {
      return this.mouseenter(a).mouseleave(b || a)
    },
    bind: function (a, b, c) {
      return this.on(a, null, b, c)
    },
    unbind: function (a, b) {
      return this.off(a, null, b)
    },
    delegate: function (a, b, c, d) {
      return this.on(b, a, c, d)
    },
    undelegate: function (a, b, c) {
      return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
    }
  });
  var cc = n.now(),
    dc = /\?/;
  n.parseJSON = function (a) {
    return JSON.parse(a + "")
  }, n.parseXML = function (a) {
    var b, c;
    if (!a || "string" != typeof a) return null;
    try {
      c = new DOMParser, b = c.parseFromString(a, "text/xml")
    } catch (d) {
      b = void 0
    }
    return (!b || b.getElementsByTagName("parsererror").length) && n.error("Invalid XML: " + a), b
  };
  var ec, fc, gc = /#.*$/,
    hc = /([?&])_=[^&]*/,
    ic = /^(.*?):[ \t]*([^\r\n]*)$/gm,
    jc = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    kc = /^(?:GET|HEAD)$/,
    lc = /^\/\//,
    mc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
    nc = {},
    oc = {},
    pc = "*/".concat("*");
  try {
    fc = location.href
  } catch (qc) {
    fc = l.createElement("a"), fc.href = "", fc = fc.href
  }
  ec = mc.exec(fc.toLowerCase()) || [];

  function rc(a) {
    return function (b, c) {
      "string" != typeof b && (c = b, b = "*");
      var d, e = 0,
        f = b.toLowerCase().match(E) || [];
      if (n.isFunction(c))
        while (d = f[e++]) "+" === d[0] ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
    }
  }

  function sc(a, b, c, d) {
    var e = {},
      f = a === oc;

    function g(h) {
      var i;
      return e[h] = !0, n.each(a[h] || [], function (a, h) {
        var j = h(b, c, d);
        return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j), g(j), !1)
      }), i
    }
    return g(b.dataTypes[0]) || !e["*"] && g("*")
  }

  function tc(a, b) {
    var c, d, e = n.ajaxSettings.flatOptions || {};
    for (c in b) void 0 !== b[c] && ((e[c] ? a : d || (d = {}))[c] = b[c]);
    return d && n.extend(!0, a, d), a
  }

  function uc(a, b, c) {
    var d, e, f, g, h = a.contents,
      i = a.dataTypes;
    while ("*" === i[0]) i.shift(), void 0 === d && (d = a.mimeType || b.getResponseHeader("Content-Type"));
    if (d)
      for (e in h)
        if (h[e] && h[e].test(d)) {
          i.unshift(e);
          break
        } if (i[0] in c) f = i[0];
    else {
      for (e in c) {
        if (!i[0] || a.converters[e + " " + i[0]]) {
          f = e;
          break
        }
        g || (g = e)
      }
      f = f || g
    }
    return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0
  }

  function vc(a, b, c, d) {
    var e, f, g, h, i, j = {},
      k = a.dataTypes.slice();
    if (k[1])
      for (g in a.converters) j[g.toLowerCase()] = a.converters[g];
    f = k.shift();
    while (f)
      if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift())
        if ("*" === f) f = i;
        else if ("*" !== i && i !== f) {
      if (g = j[i + " " + f] || j["* " + f], !g)
        for (e in j)
          if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
            g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
            break
          } if (g !== !0)
        if (g && a["throws"]) b = g(b);
        else try {
          b = g(b)
        } catch (l) {
          return {
            state: "parsererror",
            error: g ? l : "No conversion from " + i + " to " + f
          }
        }
    }
    return {
      state: "success",
      data: b
    }
  }
  n.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: fc,
      type: "GET",
      isLocal: jc.test(ec[1]),
      global: !0,
      processData: !0,
      async: !0,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      accepts: {
        "*": pc,
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript"
      },
      contents: {
        xml: /xml/,
        html: /html/,
        json: /json/
      },
      responseFields: {
        xml: "responseXML",
        text: "responseText",
        json: "responseJSON"
      },
      converters: {
        "* text": String,
        "text html": !0,
        "text json": n.parseJSON,
        "text xml": n.parseXML
      },
      flatOptions: {
        url: !0,
        context: !0
      }
    },
    ajaxSetup: function (a, b) {
      return b ? tc(tc(a, n.ajaxSettings), b) : tc(n.ajaxSettings, a)
    },
    ajaxPrefilter: rc(nc),
    ajaxTransport: rc(oc),
    ajax: function (a, b) {
      "object" == typeof a && (b = a, a = void 0), b = b || {};
      var c, d, e, f, g, h, i, j, k = n.ajaxSetup({}, b),
        l = k.context || k,
        m = k.context && (l.nodeType || l.jquery) ? n(l) : n.event,
        o = n.Deferred(),
        p = n.Callbacks("once memory"),
        q = k.statusCode || {},
        r = {},
        s = {},
        t = 0,
        u = "canceled",
        v = {
          readyState: 0,
          getResponseHeader: function (a) {
            var b;
            if (2 === t) {
              if (!f) {
                f = {};
                while (b = ic.exec(e)) f[b[1].toLowerCase()] = b[2]
              }
              b = f[a.toLowerCase()]
            }
            return null == b ? null : b
          },
          getAllResponseHeaders: function () {
            return 2 === t ? e : null
          },
          setRequestHeader: function (a, b) {
            var c = a.toLowerCase();
            return t || (a = s[c] = s[c] || a, r[a] = b), this
          },
          overrideMimeType: function (a) {
            return t || (k.mimeType = a), this
          },
          statusCode: function (a) {
            var b;
            if (a)
              if (2 > t)
                for (b in a) q[b] = [q[b], a[b]];
              else v.always(a[v.status]);
            return this
          },
          abort: function (a) {
            var b = a || u;
            return c && c.abort(b), x(0, b), this
          }
        };
      if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, k.url = ((a || k.url || fc) + "").replace(gc, "").replace(lc, ec[1] + "//"), k.type = b.method || b.type || k.method || k.type, k.dataTypes = n.trim(k.dataType || "*").toLowerCase().match(E) || [""], null == k.crossDomain && (h = mc.exec(k.url.toLowerCase()), k.crossDomain = !(!h || h[1] === ec[1] && h[2] === ec[2] && (h[3] || ("http:" === h[1] ? "80" : "443")) === (ec[3] || ("http:" === ec[1] ? "80" : "443")))), k.data && k.processData && "string" != typeof k.data && (k.data = n.param(k.data, k.traditional)), sc(nc, k, b, v), 2 === t) return v;
      i = k.global, i && 0 === n.active++ && n.event.trigger("ajaxStart"), k.type = k.type.toUpperCase(), k.hasContent = !kc.test(k.type), d = k.url, k.hasContent || (k.data && (d = k.url += (dc.test(d) ? "&" : "?") + k.data, delete k.data), k.cache === !1 && (k.url = hc.test(d) ? d.replace(hc, "$1_=" + cc++) : d + (dc.test(d) ? "&" : "?") + "_=" + cc++)), k.ifModified && (n.lastModified[d] && v.setRequestHeader("If-Modified-Since", n.lastModified[d]), n.etag[d] && v.setRequestHeader("If-None-Match", n.etag[d])), (k.data && k.hasContent && k.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", k.contentType), v.setRequestHeader("Accept", k.dataTypes[0] && k.accepts[k.dataTypes[0]] ? k.accepts[k.dataTypes[0]] + ("*" !== k.dataTypes[0] ? ", " + pc + "; q=0.01" : "") : k.accepts["*"]);
      for (j in k.headers) v.setRequestHeader(j, k.headers[j]);
      if (k.beforeSend && (k.beforeSend.call(l, v, k) === !1 || 2 === t)) return v.abort();
      u = "abort";
      for (j in {
          success: 1,
          error: 1,
          complete: 1
        }) v[j](k[j]);
      if (c = sc(oc, k, b, v)) {
        v.readyState = 1, i && m.trigger("ajaxSend", [v, k]), k.async && k.timeout > 0 && (g = setTimeout(function () {
          v.abort("timeout")
        }, k.timeout));
        try {
          t = 1, c.send(r, x)
        } catch (w) {
          if (!(2 > t)) throw w;
          x(-1, w)
        }
      } else x(-1, "No Transport");

      function x(a, b, f, h) {
        var j, r, s, u, w, x = b;
        2 !== t && (t = 2, g && clearTimeout(g), c = void 0, e = h || "", v.readyState = a > 0 ? 4 : 0, j = a >= 200 && 300 > a || 304 === a, f && (u = uc(k, v, f)), u = vc(k, u, v, j), j ? (k.ifModified && (w = v.getResponseHeader("Last-Modified"), w && (n.lastModified[d] = w), w = v.getResponseHeader("etag"), w && (n.etag[d] = w)), 204 === a || "HEAD" === k.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = u.state, r = u.data, s = u.error, j = !s)) : (s = x, (a || !x) && (x = "error", 0 > a && (a = 0))), v.status = a, v.statusText = (b || x) + "", j ? o.resolveWith(l, [r, x, v]) : o.rejectWith(l, [v, x, s]), v.statusCode(q), q = void 0, i && m.trigger(j ? "ajaxSuccess" : "ajaxError", [v, k, j ? r : s]), p.fireWith(l, [v, x]), i && (m.trigger("ajaxComplete", [v, k]), --n.active || n.event.trigger("ajaxStop")))
      }
      return v
    },
    getJSON: function (a, b, c) {
      return n.get(a, b, c, "json")
    },
    getScript: function (a, b) {
      return n.get(a, void 0, b, "script")
    }
  }), n.each(["get", "post"], function (a, b) {
    n[b] = function (a, c, d, e) {
      return n.isFunction(c) && (e = e || d, d = c, c = void 0), n.ajax({
        url: a,
        type: b,
        dataType: e,
        data: c,
        success: d
      })
    }
  }), n.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (a, b) {
    n.fn[b] = function (a) {
      return this.on(b, a)
    }
  }), n._evalUrl = function (a) {
    return n.ajax({
      url: a,
      type: "GET",
      dataType: "script",
      async: !1,
      global: !1,
      "throws": !0
    })
  }, n.fn.extend({
    wrapAll: function (a) {
      var b;
      return n.isFunction(a) ? this.each(function (b) {
        n(this).wrapAll(a.call(this, b))
      }) : (this[0] && (b = n(a, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && b.insertBefore(this[0]), b.map(function () {
        var a = this;
        while (a.firstElementChild) a = a.firstElementChild;
        return a
      }).append(this)), this)
    },
    wrapInner: function (a) {
      return this.each(n.isFunction(a) ? function (b) {
        n(this).wrapInner(a.call(this, b))
      } : function () {
        var b = n(this),
          c = b.contents();
        c.length ? c.wrapAll(a) : b.append(a)
      })
    },
    wrap: function (a) {
      var b = n.isFunction(a);
      return this.each(function (c) {
        n(this).wrapAll(b ? a.call(this, c) : a)
      })
    },
    unwrap: function () {
      return this.parent().each(function () {
        n.nodeName(this, "body") || n(this).replaceWith(this.childNodes)
      }).end()
    }
  }), n.expr.filters.hidden = function (a) {
    return a.offsetWidth <= 0 && a.offsetHeight <= 0
  }, n.expr.filters.visible = function (a) {
    return !n.expr.filters.hidden(a)
  };
  var wc = /%20/g,
    xc = /\[\]$/,
    yc = /\r?\n/g,
    zc = /^(?:submit|button|image|reset|file)$/i,
    Ac = /^(?:input|select|textarea|keygen)/i;

  function Bc(a, b, c, d) {
    var e;
    if (n.isArray(b)) n.each(b, function (b, e) {
      c || xc.test(a) ? d(a, e) : Bc(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
    });
    else if (c || "object" !== n.type(b)) d(a, b);
    else
      for (e in b) Bc(a + "[" + e + "]", b[e], c, d)
  }
  n.param = function (a, b) {
    var c, d = [],
      e = function (a, b) {
        b = n.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
      };
    if (void 0 === b && (b = n.ajaxSettings && n.ajaxSettings.traditional), n.isArray(a) || a.jquery && !n.isPlainObject(a)) n.each(a, function () {
      e(this.name, this.value)
    });
    else
      for (c in a) Bc(c, a[c], b, e);
    return d.join("&").replace(wc, "+")
  }, n.fn.extend({
    serialize: function () {
      return n.param(this.serializeArray())
    },
    serializeArray: function () {
      return this.map(function () {
        var a = n.prop(this, "elements");
        return a ? n.makeArray(a) : this
      }).filter(function () {
        var a = this.type;
        return this.name && !n(this).is(":disabled") && Ac.test(this.nodeName) && !zc.test(a) && (this.checked || !T.test(a))
      }).map(function (a, b) {
        var c = n(this).val();
        return null == c ? null : n.isArray(c) ? n.map(c, function (a) {
          return {
            name: b.name,
            value: a.replace(yc, "\r\n")
          }
        }) : {
          name: b.name,
          value: c.replace(yc, "\r\n")
        }
      }).get()
    }
  }), n.ajaxSettings.xhr = function () {
    try {
      return new XMLHttpRequest
    } catch (a) {}
  };
  var Cc = 0,
    Dc = {},
    Ec = {
      0: 200,
      1223: 204
    },
    Fc = n.ajaxSettings.xhr();
  a.ActiveXObject && n(a).on("unload", function () {
    for (var a in Dc) Dc[a]()
  }), k.cors = !!Fc && "withCredentials" in Fc, k.ajax = Fc = !!Fc, n.ajaxTransport(function (a) {
    var b;
    return k.cors || Fc && !a.crossDomain ? {
      send: function (c, d) {
        var e, f = a.xhr(),
          g = ++Cc;
        if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields)
          for (e in a.xhrFields) f[e] = a.xhrFields[e];
        a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType), a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
        for (e in c) f.setRequestHeader(e, c[e]);
        b = function (a) {
          return function () {
            b && (delete Dc[g], b = f.onload = f.onerror = null, "abort" === a ? f.abort() : "error" === a ? d(f.status, f.statusText) : d(Ec[f.status] || f.status, f.statusText, "string" == typeof f.responseText ? {
              text: f.responseText
            } : void 0, f.getAllResponseHeaders()))
          }
        }, f.onload = b(), f.onerror = b("error"), b = Dc[g] = b("abort");
        try {
          f.send(a.hasContent && a.data || null)
        } catch (h) {
          if (b) throw h
        }
      },
      abort: function () {
        b && b()
      }
    } : void 0
  }), n.ajaxSetup({
    accepts: {
      script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
      script: /(?:java|ecma)script/
    },
    converters: {
      "text script": function (a) {
        return n.globalEval(a), a
      }
    }
  }), n.ajaxPrefilter("script", function (a) {
    void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET")
  }), n.ajaxTransport("script", function (a) {
    if (a.crossDomain) {
      var b, c;
      return {
        send: function (d, e) {
          b = n("<script>").prop({
            async: !0,
            charset: a.scriptCharset,
            src: a.url
          }).on("load error", c = function (a) {
            b.remove(), c = null, a && e("error" === a.type ? 404 : 200, a.type)
          }), l.head.appendChild(b[0])
        },
        abort: function () {
          c && c()
        }
      }
    }
  });
  var Gc = [],
    Hc = /(=)\?(?=&|$)|\?\?/;
  n.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function () {
      var a = Gc.pop() || n.expando + "_" + cc++;
      return this[a] = !0, a
    }
  }), n.ajaxPrefilter("json jsonp", function (b, c, d) {
    var e, f, g, h = b.jsonp !== !1 && (Hc.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && Hc.test(b.data) && "data");
    return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = n.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(Hc, "$1" + e) : b.jsonp !== !1 && (b.url += (dc.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function () {
      return g || n.error(e + " was not called"), g[0]
    }, b.dataTypes[0] = "json", f = a[e], a[e] = function () {
      g = arguments
    }, d.always(function () {
      a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, Gc.push(e)), g && n.isFunction(f) && f(g[0]), g = f = void 0
    }), "script") : void 0
  }), n.parseHTML = function (a, b, c) {
    if (!a || "string" != typeof a) return null;
    "boolean" == typeof b && (c = b, b = !1), b = b || l;
    var d = v.exec(a),
      e = !c && [];
    return d ? [b.createElement(d[1])] : (d = n.buildFragment([a], b, e), e && e.length && n(e).remove(), n.merge([], d.childNodes))
  };
  var Ic = n.fn.load;
  n.fn.load = function (a, b, c) {
    if ("string" != typeof a && Ic) return Ic.apply(this, arguments);
    var d, e, f, g = this,
      h = a.indexOf(" ");
    return h >= 0 && (d = n.trim(a.slice(h)), a = a.slice(0, h)), n.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (e = "POST"), g.length > 0 && n.ajax({
      url: a,
      type: e,
      dataType: "html",
      data: b
    }).done(function (a) {
      f = arguments, g.html(d ? n("<div>").append(n.parseHTML(a)).find(d) : a)
    }).complete(c && function (a, b) {
      g.each(c, f || [a.responseText, b, a])
    }), this
  }, n.expr.filters.animated = function (a) {
    return n.grep(n.timers, function (b) {
      return a === b.elem
    }).length
  };
  var Jc = a.document.documentElement;

  function Kc(a) {
    return n.isWindow(a) ? a : 9 === a.nodeType && a.defaultView
  }
  n.offset = {
    setOffset: function (a, b, c) {
      var d, e, f, g, h, i, j, k = n.css(a, "position"),
        l = n(a),
        m = {};
      "static" === k && (a.style.position = "relative"), h = l.offset(), f = n.css(a, "top"), i = n.css(a, "left"), j = ("absolute" === k || "fixed" === k) && (f + i).indexOf("auto") > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), n.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (m.top = b.top - h.top + g), null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m)
    }
  }, n.fn.extend({
    offset: function (a) {
      if (arguments.length) return void 0 === a ? this : this.each(function (b) {
        n.offset.setOffset(this, a, b)
      });
      var b, c, d = this[0],
        e = {
          top: 0,
          left: 0
        },
        f = d && d.ownerDocument;
      if (f) return b = f.documentElement, n.contains(b, d) ? (typeof d.getBoundingClientRect !== U && (e = d.getBoundingClientRect()), c = Kc(f), {
        top: e.top + c.pageYOffset - b.clientTop,
        left: e.left + c.pageXOffset - b.clientLeft
      }) : e
    },
    position: function () {
      if (this[0]) {
        var a, b, c = this[0],
          d = {
            top: 0,
            left: 0
          };
        return "fixed" === n.css(c, "position") ? b = c.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), n.nodeName(a[0], "html") || (d = a.offset()), d.top += n.css(a[0], "borderTopWidth", !0), d.left += n.css(a[0], "borderLeftWidth", !0)), {
          top: b.top - d.top - n.css(c, "marginTop", !0),
          left: b.left - d.left - n.css(c, "marginLeft", !0)
        }
      }
    },
    offsetParent: function () {
      return this.map(function () {
        var a = this.offsetParent || Jc;
        while (a && !n.nodeName(a, "html") && "static" === n.css(a, "position")) a = a.offsetParent;
        return a || Jc
      })
    }
  }), n.each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
  }, function (b, c) {
    var d = "pageYOffset" === c;
    n.fn[b] = function (e) {
      return J(this, function (b, e, f) {
        var g = Kc(b);
        return void 0 === f ? g ? g[c] : b[e] : void(g ? g.scrollTo(d ? a.pageXOffset : f, d ? f : a.pageYOffset) : b[e] = f)
      }, b, e, arguments.length, null)
    }
  }), n.each(["top", "left"], function (a, b) {
    n.cssHooks[b] = yb(k.pixelPosition, function (a, c) {
      return c ? (c = xb(a, b), vb.test(c) ? n(a).position()[b] + "px" : c) : void 0
    })
  }), n.each({
    Height: "height",
    Width: "width"
  }, function (a, b) {
    n.each({
      padding: "inner" + a,
      content: b,
      "": "outer" + a
    }, function (c, d) {
      n.fn[d] = function (d, e) {
        var f = arguments.length && (c || "boolean" != typeof d),
          g = c || (d === !0 || e === !0 ? "margin" : "border");
        return J(this, function (b, c, d) {
          var e;
          return n.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? n.css(b, c, g) : n.style(b, c, d, g)
        }, b, f ? d : void 0, f, null)
      }
    })
  }), n.fn.size = function () {
    return this.length
  }, n.fn.andSelf = n.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function () {
    return n
  });
  var Lc = a.jQuery,
    Mc = a.$;
  return n.noConflict = function (b) {
    return a.$ === n && (a.$ = Mc), b && a.jQuery === n && (a.jQuery = Lc), n
  }, typeof b === U && (a.jQuery = a.$ = n), n
});

/*! jQuery UI - v1.11.4 - 2017-03-20
 * http://jqueryui.com
 * Includes: core.js, widget.js, mouse.js, draggable.js, droppable.js, resizable.js, sortable.js, slider.js
 * Copyright jQuery Foundation and other contributors; Licensed MIT */

(function (t) {
  "function" == typeof define && define.amd ? define(["jquery"], t) : t(jQuery)
})(function (t) {
  function e(e, s) {
    var n, o, a, r = e.nodeName.toLowerCase();
    return "area" === r ? (n = e.parentNode, o = n.name, e.href && o && "map" === n.nodeName.toLowerCase() ? (a = t("img[usemap='#" + o + "']")[0], !!a && i(a)) : !1) : (/^(input|select|textarea|button|object)$/.test(r) ? !e.disabled : "a" === r ? e.href || s : s) && i(e)
  }

  function i(e) {
    return t.expr.filters.visible(e) && !t(e).parents().addBack().filter(function () {
      return "hidden" === t.css(this, "visibility")
    }).length
  }
  t.ui = t.ui || {}, t.extend(t.ui, {
    version: "1.11.4",
    keyCode: {
      BACKSPACE: 8,
      COMMA: 188,
      DELETE: 46,
      DOWN: 40,
      END: 35,
      ENTER: 13,
      ESCAPE: 27,
      HOME: 36,
      LEFT: 37,
      PAGE_DOWN: 34,
      PAGE_UP: 33,
      PERIOD: 190,
      RIGHT: 39,
      SPACE: 32,
      TAB: 9,
      UP: 38
    }
  }), t.fn.extend({
    scrollParent: function (e) {
      var i = this.css("position"),
        s = "absolute" === i,
        n = e ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
        o = this.parents().filter(function () {
          var e = t(this);
          return s && "static" === e.css("position") ? !1 : n.test(e.css("overflow") + e.css("overflow-y") + e.css("overflow-x"))
        }).eq(0);
      return "fixed" !== i && o.length ? o : t(this[0].ownerDocument || document)
    },
    uniqueId: function () {
      var t = 0;
      return function () {
        return this.each(function () {
          this.id || (this.id = "ui-id-" + ++t)
        })
      }
    }(),
    removeUniqueId: function () {
      return this.each(function () {
        /^ui-id-\d+$/.test(this.id) && t(this).removeAttr("id")
      })
    }
  }), t.extend(t.expr[":"], {
    data: t.expr.createPseudo ? t.expr.createPseudo(function (e) {
      return function (i) {
        return !!t.data(i, e)
      }
    }) : function (e, i, s) {
      return !!t.data(e, s[3])
    },
    focusable: function (i) {
      return e(i, !isNaN(t.attr(i, "tabindex")))
    },
    tabbable: function (i) {
      var s = t.attr(i, "tabindex"),
        n = isNaN(s);
      return (n || s >= 0) && e(i, !n)
    }
  }), t("<a>").outerWidth(1).jquery || t.each(["Width", "Height"], function (e, i) {
    function s(e, i, s, o) {
      return t.each(n, function () {
        i -= parseFloat(t.css(e, "padding" + this)) || 0, s && (i -= parseFloat(t.css(e, "border" + this + "Width")) || 0), o && (i -= parseFloat(t.css(e, "margin" + this)) || 0)
      }), i
    }
    var n = "Width" === i ? ["Left", "Right"] : ["Top", "Bottom"],
      o = i.toLowerCase(),
      a = {
        innerWidth: t.fn.innerWidth,
        innerHeight: t.fn.innerHeight,
        outerWidth: t.fn.outerWidth,
        outerHeight: t.fn.outerHeight
      };
    t.fn["inner" + i] = function (e) {
      return void 0 === e ? a["inner" + i].call(this) : this.each(function () {
        t(this).css(o, s(this, e) + "px")
      })
    }, t.fn["outer" + i] = function (e, n) {
      return "number" != typeof e ? a["outer" + i].call(this, e) : this.each(function () {
        t(this).css(o, s(this, e, !0, n) + "px")
      })
    }
  }), t.fn.addBack || (t.fn.addBack = function (t) {
    return this.add(null == t ? this.prevObject : this.prevObject.filter(t))
  }), t("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (t.fn.removeData = function (e) {
    return function (i) {
      return arguments.length ? e.call(this, t.camelCase(i)) : e.call(this)
    }
  }(t.fn.removeData)), t.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), t.fn.extend({
    focus: function (e) {
      return function (i, s) {
        return "number" == typeof i ? this.each(function () {
          var e = this;
          setTimeout(function () {
            t(e).focus(), s && s.call(e)
          }, i)
        }) : e.apply(this, arguments)
      }
    }(t.fn.focus),
    disableSelection: function () {
      var t = "onselectstart" in document.createElement("div") ? "selectstart" : "mousedown";
      return function () {
        return this.bind(t + ".ui-disableSelection", function (t) {
          t.preventDefault()
        })
      }
    }(),
    enableSelection: function () {
      return this.unbind(".ui-disableSelection")
    },
    zIndex: function (e) {
      if (void 0 !== e) return this.css("zIndex", e);
      if (this.length)
        for (var i, s, n = t(this[0]); n.length && n[0] !== document;) {
          if (i = n.css("position"), ("absolute" === i || "relative" === i || "fixed" === i) && (s = parseInt(n.css("zIndex"), 10), !isNaN(s) && 0 !== s)) return s;
          n = n.parent()
        }
      return 0
    }
  }), t.ui.plugin = {
    add: function (e, i, s) {
      var n, o = t.ui[e].prototype;
      for (n in s) o.plugins[n] = o.plugins[n] || [], o.plugins[n].push([i, s[n]])
    },
    call: function (t, e, i, s) {
      var n, o = t.plugins[e];
      if (o && (s || t.element[0].parentNode && 11 !== t.element[0].parentNode.nodeType))
        for (n = 0; o.length > n; n++) t.options[o[n][0]] && o[n][1].apply(t.element, i)
    }
  };
  var s = 0,
    n = Array.prototype.slice;
  t.cleanData = function (e) {
    return function (i) {
      var s, n, o;
      for (o = 0; null != (n = i[o]); o++) try {
        s = t._data(n, "events"), s && s.remove && t(n).triggerHandler("remove")
      } catch (a) {}
      e(i)
    }
  }(t.cleanData), t.widget = function (e, i, s) {
    var n, o, a, r, l = {},
      h = e.split(".")[0];
    return e = e.split(".")[1], n = h + "-" + e, s || (s = i, i = t.Widget), t.expr[":"][n.toLowerCase()] = function (e) {
      return !!t.data(e, n)
    }, t[h] = t[h] || {}, o = t[h][e], a = t[h][e] = function (t, e) {
      return this._createWidget ? (arguments.length && this._createWidget(t, e), void 0) : new a(t, e)
    }, t.extend(a, o, {
      version: s.version,
      _proto: t.extend({}, s),
      _childConstructors: []
    }), r = new i, r.options = t.widget.extend({}, r.options), t.each(s, function (e, s) {
      return t.isFunction(s) ? (l[e] = function () {
        var t = function () {
            return i.prototype[e].apply(this, arguments)
          },
          n = function (t) {
            return i.prototype[e].apply(this, t)
          };
        return function () {
          var e, i = this._super,
            o = this._superApply;
          return this._super = t, this._superApply = n, e = s.apply(this, arguments), this._super = i, this._superApply = o, e
        }
      }(), void 0) : (l[e] = s, void 0)
    }), a.prototype = t.widget.extend(r, {
      widgetEventPrefix: o ? r.widgetEventPrefix || e : e
    }, l, {
      constructor: a,
      namespace: h,
      widgetName: e,
      widgetFullName: n
    }), o ? (t.each(o._childConstructors, function (e, i) {
      var s = i.prototype;
      t.widget(s.namespace + "." + s.widgetName, a, i._proto)
    }), delete o._childConstructors) : i._childConstructors.push(a), t.widget.bridge(e, a), a
  }, t.widget.extend = function (e) {
    for (var i, s, o = n.call(arguments, 1), a = 0, r = o.length; r > a; a++)
      for (i in o[a]) s = o[a][i], o[a].hasOwnProperty(i) && void 0 !== s && (e[i] = t.isPlainObject(s) ? t.isPlainObject(e[i]) ? t.widget.extend({}, e[i], s) : t.widget.extend({}, s) : s);
    return e
  }, t.widget.bridge = function (e, i) {
    var s = i.prototype.widgetFullName || e;
    t.fn[e] = function (o) {
      var a = "string" == typeof o,
        r = n.call(arguments, 1),
        l = this;
      return a ? this.each(function () {
        var i, n = t.data(this, s);
        return "instance" === o ? (l = n, !1) : n ? t.isFunction(n[o]) && "_" !== o.charAt(0) ? (i = n[o].apply(n, r), i !== n && void 0 !== i ? (l = i && i.jquery ? l.pushStack(i.get()) : i, !1) : void 0) : t.error("no such method '" + o + "' for " + e + " widget instance") : t.error("cannot call methods on " + e + " prior to initialization; " + "attempted to call method '" + o + "'")
      }) : (r.length && (o = t.widget.extend.apply(null, [o].concat(r))), this.each(function () {
        var e = t.data(this, s);
        e ? (e.option(o || {}), e._init && e._init()) : t.data(this, s, new i(o, this))
      })), l
    }
  }, t.Widget = function () {}, t.Widget._childConstructors = [], t.Widget.prototype = {
    widgetName: "widget",
    widgetEventPrefix: "",
    defaultElement: "<div>",
    options: {
      disabled: !1,
      create: null
    },
    _createWidget: function (e, i) {
      i = t(i || this.defaultElement || this)[0], this.element = t(i), this.uuid = s++, this.eventNamespace = "." + this.widgetName + this.uuid, this.bindings = t(), this.hoverable = t(), this.focusable = t(), i !== this && (t.data(i, this.widgetFullName, this), this._on(!0, this.element, {
        remove: function (t) {
          t.target === i && this.destroy()
        }
      }), this.document = t(i.style ? i.ownerDocument : i.document || i), this.window = t(this.document[0].defaultView || this.document[0].parentWindow)), this.options = t.widget.extend({}, this.options, this._getCreateOptions(), e), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init()
    },
    _getCreateOptions: t.noop,
    _getCreateEventData: t.noop,
    _create: t.noop,
    _init: t.noop,
    destroy: function () {
      this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(t.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")
    },
    _destroy: t.noop,
    widget: function () {
      return this.element
    },
    option: function (e, i) {
      var s, n, o, a = e;
      if (0 === arguments.length) return t.widget.extend({}, this.options);
      if ("string" == typeof e)
        if (a = {}, s = e.split("."), e = s.shift(), s.length) {
          for (n = a[e] = t.widget.extend({}, this.options[e]), o = 0; s.length - 1 > o; o++) n[s[o]] = n[s[o]] || {}, n = n[s[o]];
          if (e = s.pop(), 1 === arguments.length) return void 0 === n[e] ? null : n[e];
          n[e] = i
        } else {
          if (1 === arguments.length) return void 0 === this.options[e] ? null : this.options[e];
          a[e] = i
        } return this._setOptions(a), this
    },
    _setOptions: function (t) {
      var e;
      for (e in t) this._setOption(e, t[e]);
      return this
    },
    _setOption: function (t, e) {
      return this.options[t] = e, "disabled" === t && (this.widget().toggleClass(this.widgetFullName + "-disabled", !!e), e && (this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus"))), this
    },
    enable: function () {
      return this._setOptions({
        disabled: !1
      })
    },
    disable: function () {
      return this._setOptions({
        disabled: !0
      })
    },
    _on: function (e, i, s) {
      var n, o = this;
      "boolean" != typeof e && (s = i, i = e, e = !1), s ? (i = n = t(i), this.bindings = this.bindings.add(i)) : (s = i, i = this.element, n = this.widget()), t.each(s, function (s, a) {
        function r() {
          return e || o.options.disabled !== !0 && !t(this).hasClass("ui-state-disabled") ? ("string" == typeof a ? o[a] : a).apply(o, arguments) : void 0
        }
        "string" != typeof a && (r.guid = a.guid = a.guid || r.guid || t.guid++);
        var l = s.match(/^([\w:-]*)\s*(.*)$/),
          h = l[1] + o.eventNamespace,
          c = l[2];
        c ? n.delegate(c, h, r) : i.bind(h, r)
      })
    },
    _off: function (e, i) {
      i = (i || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, e.unbind(i).undelegate(i), this.bindings = t(this.bindings.not(e).get()), this.focusable = t(this.focusable.not(e).get()), this.hoverable = t(this.hoverable.not(e).get())
    },
    _delay: function (t, e) {
      function i() {
        return ("string" == typeof t ? s[t] : t).apply(s, arguments)
      }
      var s = this;
      return setTimeout(i, e || 0)
    },
    _hoverable: function (e) {
      this.hoverable = this.hoverable.add(e), this._on(e, {
        mouseenter: function (e) {
          t(e.currentTarget).addClass("ui-state-hover")
        },
        mouseleave: function (e) {
          t(e.currentTarget).removeClass("ui-state-hover")
        }
      })
    },
    _focusable: function (e) {
      this.focusable = this.focusable.add(e), this._on(e, {
        focusin: function (e) {
          t(e.currentTarget).addClass("ui-state-focus")
        },
        focusout: function (e) {
          t(e.currentTarget).removeClass("ui-state-focus")
        }
      })
    },
    _trigger: function (e, i, s) {
      var n, o, a = this.options[e];
      if (s = s || {}, i = t.Event(i), i.type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase(), i.target = this.element[0], o = i.originalEvent)
        for (n in o) n in i || (i[n] = o[n]);
      return this.element.trigger(i, s), !(t.isFunction(a) && a.apply(this.element[0], [i].concat(s)) === !1 || i.isDefaultPrevented())
    }
  }, t.each({
    show: "fadeIn",
    hide: "fadeOut"
  }, function (e, i) {
    t.Widget.prototype["_" + e] = function (s, n, o) {
      "string" == typeof n && (n = {
        effect: n
      });
      var a, r = n ? n === !0 || "number" == typeof n ? i : n.effect || i : e;
      n = n || {}, "number" == typeof n && (n = {
        duration: n
      }), a = !t.isEmptyObject(n), n.complete = o, n.delay && s.delay(n.delay), a && t.effects && t.effects.effect[r] ? s[e](n) : r !== e && s[r] ? s[r](n.duration, n.easing, o) : s.queue(function (i) {
        t(this)[e](), o && o.call(s[0]), i()
      })
    }
  }), t.widget;
  var o = !1;
  t(document).mouseup(function () {
    o = !1
  }), t.widget("ui.mouse", {
    version: "1.11.4",
    options: {
      cancel: "input,textarea,button,select,option",
      distance: 1,
      delay: 0
    },
    _mouseInit: function () {
      var e = this;
      this.element.bind("mousedown." + this.widgetName, function (t) {
        return e._mouseDown(t)
      }).bind("click." + this.widgetName, function (i) {
        return !0 === t.data(i.target, e.widgetName + ".preventClickEvent") ? (t.removeData(i.target, e.widgetName + ".preventClickEvent"), i.stopImmediatePropagation(), !1) : void 0
      }), this.started = !1
    },
    _mouseDestroy: function () {
      this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && this.document.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
    },
    _mouseDown: function (e) {
      if (!o) {
        this._mouseMoved = !1, this._mouseStarted && this._mouseUp(e), this._mouseDownEvent = e;
        var i = this,
          s = 1 === e.which,
          n = "string" == typeof this.options.cancel && e.target.nodeName ? t(e.target).closest(this.options.cancel).length : !1;
        return s && !n && this._mouseCapture(e) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
          i.mouseDelayMet = !0
        }, this.options.delay)), this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = this._mouseStart(e) !== !1, !this._mouseStarted) ? (e.preventDefault(), !0) : (!0 === t.data(e.target, this.widgetName + ".preventClickEvent") && t.removeData(e.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (t) {
          return i._mouseMove(t)
        }, this._mouseUpDelegate = function (t) {
          return i._mouseUp(t)
        }, this.document.bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), e.preventDefault(), o = !0, !0)) : !0
      }
    },
    _mouseMove: function (e) {
      if (this._mouseMoved) {
        if (t.ui.ie && (!document.documentMode || 9 > document.documentMode) && !e.button) return this._mouseUp(e);
        if (!e.which) return this._mouseUp(e)
      }
      return (e.which || e.button) && (this._mouseMoved = !0), this._mouseStarted ? (this._mouseDrag(e), e.preventDefault()) : (this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, e) !== !1, this._mouseStarted ? this._mouseDrag(e) : this._mouseUp(e)), !this._mouseStarted)
    },
    _mouseUp: function (e) {
      return this.document.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, e.target === this._mouseDownEvent.target && t.data(e.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(e)), o = !1, !1
    },
    _mouseDistanceMet: function (t) {
      return Math.max(Math.abs(this._mouseDownEvent.pageX - t.pageX), Math.abs(this._mouseDownEvent.pageY - t.pageY)) >= this.options.distance
    },
    _mouseDelayMet: function () {
      return this.mouseDelayMet
    },
    _mouseStart: function () {},
    _mouseDrag: function () {},
    _mouseStop: function () {},
    _mouseCapture: function () {
      return !0
    }
  }), t.widget("ui.draggable", t.ui.mouse, {
    version: "1.11.4",
    widgetEventPrefix: "drag",
    options: {
      addClasses: !0,
      appendTo: "parent",
      axis: !1,
      connectToSortable: !1,
      containment: !1,
      cursor: "auto",
      cursorAt: !1,
      grid: !1,
      handle: !1,
      helper: "original",
      iframeFix: !1,
      opacity: !1,
      refreshPositions: !1,
      revert: !1,
      revertDuration: 500,
      scope: "default",
      scroll: !0,
      scrollSensitivity: 20,
      scrollSpeed: 20,
      snap: !1,
      snapMode: "both",
      snapTolerance: 20,
      stack: !1,
      zIndex: !1,
      drag: null,
      start: null,
      stop: null
    },
    _create: function () {
      "original" === this.options.helper && this._setPositionRelative(), this.options.addClasses && this.element.addClass("ui-draggable"), this.options.disabled && this.element.addClass("ui-draggable-disabled"), this._setHandleClassName(), this._mouseInit()
    },
    _setOption: function (t, e) {
      this._super(t, e), "handle" === t && (this._removeHandleClassName(), this._setHandleClassName())
    },
    _destroy: function () {
      return (this.helper || this.element).is(".ui-draggable-dragging") ? (this.destroyOnClear = !0, void 0) : (this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"), this._removeHandleClassName(), this._mouseDestroy(), void 0)
    },
    _mouseCapture: function (e) {
      var i = this.options;
      return this._blurActiveElement(e), this.helper || i.disabled || t(e.target).closest(".ui-resizable-handle").length > 0 ? !1 : (this.handle = this._getHandle(e), this.handle ? (this._blockFrames(i.iframeFix === !0 ? "iframe" : i.iframeFix), !0) : !1)
    },
    _blockFrames: function (e) {
      this.iframeBlocks = this.document.find(e).map(function () {
        var e = t(this);
        return t("<div>").css("position", "absolute").appendTo(e.parent()).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()).offset(e.offset())[0]
      })
    },
    _unblockFrames: function () {
      this.iframeBlocks && (this.iframeBlocks.remove(), delete this.iframeBlocks)
    },
    _blurActiveElement: function (e) {
      var i = this.document[0];
      if (this.handleElement.is(e.target)) try {
        i.activeElement && "body" !== i.activeElement.nodeName.toLowerCase() && t(i.activeElement).blur()
      } catch (s) {}
    },
    _mouseStart: function (e) {
      var i = this.options;
      return this.helper = this._createHelper(e), this.helper.addClass("ui-draggable-dragging"), this._cacheHelperProportions(), t.ui.ddmanager && (t.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(!0), this.offsetParent = this.helper.offsetParent(), this.hasFixedAncestor = this.helper.parents().filter(function () {
        return "fixed" === t(this).css("position")
      }).length > 0, this.positionAbs = this.element.offset(), this._refreshOffsets(e), this.originalPosition = this.position = this._generatePosition(e, !1), this.originalPageX = e.pageX, this.originalPageY = e.pageY, i.cursorAt && this._adjustOffsetFromHelper(i.cursorAt), this._setContainment(), this._trigger("start", e) === !1 ? (this._clear(), !1) : (this._cacheHelperProportions(), t.ui.ddmanager && !i.dropBehaviour && t.ui.ddmanager.prepareOffsets(this, e), this._normalizeRightBottom(), this._mouseDrag(e, !0), t.ui.ddmanager && t.ui.ddmanager.dragStart(this, e), !0)
    },
    _refreshOffsets: function (t) {
      this.offset = {
        top: this.positionAbs.top - this.margins.top,
        left: this.positionAbs.left - this.margins.left,
        scroll: !1,
        parent: this._getParentOffset(),
        relative: this._getRelativeOffset()
      }, this.offset.click = {
        left: t.pageX - this.offset.left,
        top: t.pageY - this.offset.top
      }
    },
    _mouseDrag: function (e, i) {
      if (this.hasFixedAncestor && (this.offset.parent = this._getParentOffset()), this.position = this._generatePosition(e, !0), this.positionAbs = this._convertPositionTo("absolute"), !i) {
        var s = this._uiHash();
        if (this._trigger("drag", e, s) === !1) return this._mouseUp({}), !1;
        this.position = s.position
      }
      return this.helper[0].style.left = this.position.left + "px", this.helper[0].style.top = this.position.top + "px", t.ui.ddmanager && t.ui.ddmanager.drag(this, e), !1
    },
    _mouseStop: function (e) {
      var i = this,
        s = !1;
      return t.ui.ddmanager && !this.options.dropBehaviour && (s = t.ui.ddmanager.drop(this, e)), this.dropped && (s = this.dropped, this.dropped = !1), "invalid" === this.options.revert && !s || "valid" === this.options.revert && s || this.options.revert === !0 || t.isFunction(this.options.revert) && this.options.revert.call(this.element, s) ? t(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () {
        i._trigger("stop", e) !== !1 && i._clear()
      }) : this._trigger("stop", e) !== !1 && this._clear(), !1
    },
    _mouseUp: function (e) {
      return this._unblockFrames(), t.ui.ddmanager && t.ui.ddmanager.dragStop(this, e), this.handleElement.is(e.target) && this.element.focus(), t.ui.mouse.prototype._mouseUp.call(this, e)
    },
    cancel: function () {
      return this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear(), this
    },
    _getHandle: function (e) {
      return this.options.handle ? !!t(e.target).closest(this.element.find(this.options.handle)).length : !0
    },
    _setHandleClassName: function () {
      this.handleElement = this.options.handle ? this.element.find(this.options.handle) : this.element, this.handleElement.addClass("ui-draggable-handle")
    },
    _removeHandleClassName: function () {
      this.handleElement.removeClass("ui-draggable-handle")
    },
    _createHelper: function (e) {
      var i = this.options,
        s = t.isFunction(i.helper),
        n = s ? t(i.helper.apply(this.element[0], [e])) : "clone" === i.helper ? this.element.clone().removeAttr("id") : this.element;
      return n.parents("body").length || n.appendTo("parent" === i.appendTo ? this.element[0].parentNode : i.appendTo), s && n[0] === this.element[0] && this._setPositionRelative(), n[0] === this.element[0] || /(fixed|absolute)/.test(n.css("position")) || n.css("position", "absolute"), n
    },
    _setPositionRelative: function () {
      /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative")
    },
    _adjustOffsetFromHelper: function (e) {
      "string" == typeof e && (e = e.split(" ")), t.isArray(e) && (e = {
        left: +e[0],
        top: +e[1] || 0
      }), "left" in e && (this.offset.click.left = e.left + this.margins.left), "right" in e && (this.offset.click.left = this.helperProportions.width - e.right + this.margins.left), "top" in e && (this.offset.click.top = e.top + this.margins.top), "bottom" in e && (this.offset.click.top = this.helperProportions.height - e.bottom + this.margins.top)
    },
    _isRootNode: function (t) {
      return /(html|body)/i.test(t.tagName) || t === this.document[0]
    },
    _getParentOffset: function () {
      var e = this.offsetParent.offset(),
        i = this.document[0];
      return "absolute" === this.cssPosition && this.scrollParent[0] !== i && t.contains(this.scrollParent[0], this.offsetParent[0]) && (e.left += this.scrollParent.scrollLeft(), e.top += this.scrollParent.scrollTop()), this._isRootNode(this.offsetParent[0]) && (e = {
        top: 0,
        left: 0
      }), {
        top: e.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
        left: e.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
      }
    },
    _getRelativeOffset: function () {
      if ("relative" !== this.cssPosition) return {
        top: 0,
        left: 0
      };
      var t = this.element.position(),
        e = this._isRootNode(this.scrollParent[0]);
      return {
        top: t.top - (parseInt(this.helper.css("top"), 10) || 0) + (e ? 0 : this.scrollParent.scrollTop()),
        left: t.left - (parseInt(this.helper.css("left"), 10) || 0) + (e ? 0 : this.scrollParent.scrollLeft())
      }
    },
    _cacheMargins: function () {
      this.margins = {
        left: parseInt(this.element.css("marginLeft"), 10) || 0,
        top: parseInt(this.element.css("marginTop"), 10) || 0,
        right: parseInt(this.element.css("marginRight"), 10) || 0,
        bottom: parseInt(this.element.css("marginBottom"), 10) || 0
      }
    },
    _cacheHelperProportions: function () {
      this.helperProportions = {
        width: this.helper.outerWidth(),
        height: this.helper.outerHeight()
      }
    },
    _setContainment: function () {
      var e, i, s, n = this.options,
        o = this.document[0];
      return this.relativeContainer = null, n.containment ? "window" === n.containment ? (this.containment = [t(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, t(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, t(window).scrollLeft() + t(window).width() - this.helperProportions.width - this.margins.left, t(window).scrollTop() + (t(window).height() || o.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top], void 0) : "document" === n.containment ? (this.containment = [0, 0, t(o).width() - this.helperProportions.width - this.margins.left, (t(o).height() || o.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top], void 0) : n.containment.constructor === Array ? (this.containment = n.containment, void 0) : ("parent" === n.containment && (n.containment = this.helper[0].parentNode), i = t(n.containment), s = i[0], s && (e = /(scroll|auto)/.test(i.css("overflow")), this.containment = [(parseInt(i.css("borderLeftWidth"), 10) || 0) + (parseInt(i.css("paddingLeft"), 10) || 0), (parseInt(i.css("borderTopWidth"), 10) || 0) + (parseInt(i.css("paddingTop"), 10) || 0), (e ? Math.max(s.scrollWidth, s.offsetWidth) : s.offsetWidth) - (parseInt(i.css("borderRightWidth"), 10) || 0) - (parseInt(i.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (e ? Math.max(s.scrollHeight, s.offsetHeight) : s.offsetHeight) - (parseInt(i.css("borderBottomWidth"), 10) || 0) - (parseInt(i.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relativeContainer = i), void 0) : (this.containment = null, void 0)
    },
    _convertPositionTo: function (t, e) {
      e || (e = this.position);
      var i = "absolute" === t ? 1 : -1,
        s = this._isRootNode(this.scrollParent[0]);
      return {
        top: e.top + this.offset.relative.top * i + this.offset.parent.top * i - ("fixed" === this.cssPosition ? -this.offset.scroll.top : s ? 0 : this.offset.scroll.top) * i,
        left: e.left + this.offset.relative.left * i + this.offset.parent.left * i - ("fixed" === this.cssPosition ? -this.offset.scroll.left : s ? 0 : this.offset.scroll.left) * i
      }
    },
    _generatePosition: function (t, e) {
      var i, s, n, o, a = this.options,
        r = this._isRootNode(this.scrollParent[0]),
        l = t.pageX,
        h = t.pageY;
      return r && this.offset.scroll || (this.offset.scroll = {
        top: this.scrollParent.scrollTop(),
        left: this.scrollParent.scrollLeft()
      }), e && (this.containment && (this.relativeContainer ? (s = this.relativeContainer.offset(), i = [this.containment[0] + s.left, this.containment[1] + s.top, this.containment[2] + s.left, this.containment[3] + s.top]) : i = this.containment, t.pageX - this.offset.click.left < i[0] && (l = i[0] + this.offset.click.left), t.pageY - this.offset.click.top < i[1] && (h = i[1] + this.offset.click.top), t.pageX - this.offset.click.left > i[2] && (l = i[2] + this.offset.click.left), t.pageY - this.offset.click.top > i[3] && (h = i[3] + this.offset.click.top)), a.grid && (n = a.grid[1] ? this.originalPageY + Math.round((h - this.originalPageY) / a.grid[1]) * a.grid[1] : this.originalPageY, h = i ? n - this.offset.click.top >= i[1] || n - this.offset.click.top > i[3] ? n : n - this.offset.click.top >= i[1] ? n - a.grid[1] : n + a.grid[1] : n, o = a.grid[0] ? this.originalPageX + Math.round((l - this.originalPageX) / a.grid[0]) * a.grid[0] : this.originalPageX, l = i ? o - this.offset.click.left >= i[0] || o - this.offset.click.left > i[2] ? o : o - this.offset.click.left >= i[0] ? o - a.grid[0] : o + a.grid[0] : o), "y" === a.axis && (l = this.originalPageX), "x" === a.axis && (h = this.originalPageY)), {
        top: h - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.offset.scroll.top : r ? 0 : this.offset.scroll.top),
        left: l - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.offset.scroll.left : r ? 0 : this.offset.scroll.left)
      }
    },
    _clear: function () {
      this.helper.removeClass("ui-draggable-dragging"), this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove(), this.helper = null, this.cancelHelperRemoval = !1, this.destroyOnClear && this.destroy()
    },
    _normalizeRightBottom: function () {
      "y" !== this.options.axis && "auto" !== this.helper.css("right") && (this.helper.width(this.helper.width()), this.helper.css("right", "auto")), "x" !== this.options.axis && "auto" !== this.helper.css("bottom") && (this.helper.height(this.helper.height()), this.helper.css("bottom", "auto"))
    },
    _trigger: function (e, i, s) {
      return s = s || this._uiHash(), t.ui.plugin.call(this, e, [i, s, this], !0), /^(drag|start|stop)/.test(e) && (this.positionAbs = this._convertPositionTo("absolute"), s.offset = this.positionAbs), t.Widget.prototype._trigger.call(this, e, i, s)
    },
    plugins: {},
    _uiHash: function () {
      return {
        helper: this.helper,
        position: this.position,
        originalPosition: this.originalPosition,
        offset: this.positionAbs
      }
    }
  }), t.ui.plugin.add("draggable", "connectToSortable", {
    start: function (e, i, s) {
      var n = t.extend({}, i, {
        item: s.element
      });
      s.sortables = [], t(s.options.connectToSortable).each(function () {
        var i = t(this).sortable("instance");
        i && !i.options.disabled && (s.sortables.push(i), i.refreshPositions(), i._trigger("activate", e, n))
      })
    },
    stop: function (e, i, s) {
      var n = t.extend({}, i, {
        item: s.element
      });
      s.cancelHelperRemoval = !1, t.each(s.sortables, function () {
        var t = this;
        t.isOver ? (t.isOver = 0, s.cancelHelperRemoval = !0, t.cancelHelperRemoval = !1, t._storedCSS = {
          position: t.placeholder.css("position"),
          top: t.placeholder.css("top"),
          left: t.placeholder.css("left")
        }, t._mouseStop(e), t.options.helper = t.options._helper) : (t.cancelHelperRemoval = !0, t._trigger("deactivate", e, n))
      })
    },
    drag: function (e, i, s) {
      t.each(s.sortables, function () {
        var n = !1,
          o = this;
        o.positionAbs = s.positionAbs, o.helperProportions = s.helperProportions, o.offset.click = s.offset.click, o._intersectsWith(o.containerCache) && (n = !0, t.each(s.sortables, function () {
          return this.positionAbs = s.positionAbs, this.helperProportions = s.helperProportions, this.offset.click = s.offset.click, this !== o && this._intersectsWith(this.containerCache) && t.contains(o.element[0], this.element[0]) && (n = !1), n
        })), n ? (o.isOver || (o.isOver = 1, s._parent = i.helper.parent(), o.currentItem = i.helper.appendTo(o.element).data("ui-sortable-item", !0), o.options._helper = o.options.helper, o.options.helper = function () {
          return i.helper[0]
        }, e.target = o.currentItem[0], o._mouseCapture(e, !0), o._mouseStart(e, !0, !0), o.offset.click.top = s.offset.click.top, o.offset.click.left = s.offset.click.left, o.offset.parent.left -= s.offset.parent.left - o.offset.parent.left, o.offset.parent.top -= s.offset.parent.top - o.offset.parent.top, s._trigger("toSortable", e), s.dropped = o.element, t.each(s.sortables, function () {
          this.refreshPositions()
        }), s.currentItem = s.element, o.fromOutside = s), o.currentItem && (o._mouseDrag(e), i.position = o.position)) : o.isOver && (o.isOver = 0, o.cancelHelperRemoval = !0, o.options._revert = o.options.revert, o.options.revert = !1, o._trigger("out", e, o._uiHash(o)), o._mouseStop(e, !0), o.options.revert = o.options._revert, o.options.helper = o.options._helper, o.placeholder && o.placeholder.remove(), i.helper.appendTo(s._parent), s._refreshOffsets(e), i.position = s._generatePosition(e, !0), s._trigger("fromSortable", e), s.dropped = !1, t.each(s.sortables, function () {
          this.refreshPositions()
        }))
      })
    }
  }), t.ui.plugin.add("draggable", "cursor", {
    start: function (e, i, s) {
      var n = t("body"),
        o = s.options;
      n.css("cursor") && (o._cursor = n.css("cursor")), n.css("cursor", o.cursor)
    },
    stop: function (e, i, s) {
      var n = s.options;
      n._cursor && t("body").css("cursor", n._cursor)
    }
  }), t.ui.plugin.add("draggable", "opacity", {
    start: function (e, i, s) {
      var n = t(i.helper),
        o = s.options;
      n.css("opacity") && (o._opacity = n.css("opacity")), n.css("opacity", o.opacity)
    },
    stop: function (e, i, s) {
      var n = s.options;
      n._opacity && t(i.helper).css("opacity", n._opacity)
    }
  }), t.ui.plugin.add("draggable", "scroll", {
    start: function (t, e, i) {
      i.scrollParentNotHidden || (i.scrollParentNotHidden = i.helper.scrollParent(!1)), i.scrollParentNotHidden[0] !== i.document[0] && "HTML" !== i.scrollParentNotHidden[0].tagName && (i.overflowOffset = i.scrollParentNotHidden.offset())
    },
    drag: function (e, i, s) {
      var n = s.options,
        o = !1,
        a = s.scrollParentNotHidden[0],
        r = s.document[0];
      a !== r && "HTML" !== a.tagName ? (n.axis && "x" === n.axis || (s.overflowOffset.top + a.offsetHeight - e.pageY < n.scrollSensitivity ? a.scrollTop = o = a.scrollTop + n.scrollSpeed : e.pageY - s.overflowOffset.top < n.scrollSensitivity && (a.scrollTop = o = a.scrollTop - n.scrollSpeed)), n.axis && "y" === n.axis || (s.overflowOffset.left + a.offsetWidth - e.pageX < n.scrollSensitivity ? a.scrollLeft = o = a.scrollLeft + n.scrollSpeed : e.pageX - s.overflowOffset.left < n.scrollSensitivity && (a.scrollLeft = o = a.scrollLeft - n.scrollSpeed))) : (n.axis && "x" === n.axis || (e.pageY - t(r).scrollTop() < n.scrollSensitivity ? o = t(r).scrollTop(t(r).scrollTop() - n.scrollSpeed) : t(window).height() - (e.pageY - t(r).scrollTop()) < n.scrollSensitivity && (o = t(r).scrollTop(t(r).scrollTop() + n.scrollSpeed))), n.axis && "y" === n.axis || (e.pageX - t(r).scrollLeft() < n.scrollSensitivity ? o = t(r).scrollLeft(t(r).scrollLeft() - n.scrollSpeed) : t(window).width() - (e.pageX - t(r).scrollLeft()) < n.scrollSensitivity && (o = t(r).scrollLeft(t(r).scrollLeft() + n.scrollSpeed)))), o !== !1 && t.ui.ddmanager && !n.dropBehaviour && t.ui.ddmanager.prepareOffsets(s, e)
    }
  }), t.ui.plugin.add("draggable", "snap", {
    start: function (e, i, s) {
      var n = s.options;
      s.snapElements = [], t(n.snap.constructor !== String ? n.snap.items || ":data(ui-draggable)" : n.snap).each(function () {
        var e = t(this),
          i = e.offset();
        this !== s.element[0] && s.snapElements.push({
          item: this,
          width: e.outerWidth(),
          height: e.outerHeight(),
          top: i.top,
          left: i.left
        })
      })
    },
    drag: function (e, i, s) {
      var n, o, a, r, l, h, c, u, d, p, f = s.options,
        g = f.snapTolerance,
        m = i.offset.left,
        _ = m + s.helperProportions.width,
        v = i.offset.top,
        b = v + s.helperProportions.height;
      for (d = s.snapElements.length - 1; d >= 0; d--) l = s.snapElements[d].left - s.margins.left, h = l + s.snapElements[d].width, c = s.snapElements[d].top - s.margins.top, u = c + s.snapElements[d].height, l - g > _ || m > h + g || c - g > b || v > u + g || !t.contains(s.snapElements[d].item.ownerDocument, s.snapElements[d].item) ? (s.snapElements[d].snapping && s.options.snap.release && s.options.snap.release.call(s.element, e, t.extend(s._uiHash(), {
        snapItem: s.snapElements[d].item
      })), s.snapElements[d].snapping = !1) : ("inner" !== f.snapMode && (n = g >= Math.abs(c - b), o = g >= Math.abs(u - v), a = g >= Math.abs(l - _), r = g >= Math.abs(h - m), n && (i.position.top = s._convertPositionTo("relative", {
        top: c - s.helperProportions.height,
        left: 0
      }).top), o && (i.position.top = s._convertPositionTo("relative", {
        top: u,
        left: 0
      }).top), a && (i.position.left = s._convertPositionTo("relative", {
        top: 0,
        left: l - s.helperProportions.width
      }).left), r && (i.position.left = s._convertPositionTo("relative", {
        top: 0,
        left: h
      }).left)), p = n || o || a || r, "outer" !== f.snapMode && (n = g >= Math.abs(c - v), o = g >= Math.abs(u - b), a = g >= Math.abs(l - m), r = g >= Math.abs(h - _), n && (i.position.top = s._convertPositionTo("relative", {
        top: c,
        left: 0
      }).top), o && (i.position.top = s._convertPositionTo("relative", {
        top: u - s.helperProportions.height,
        left: 0
      }).top), a && (i.position.left = s._convertPositionTo("relative", {
        top: 0,
        left: l
      }).left), r && (i.position.left = s._convertPositionTo("relative", {
        top: 0,
        left: h - s.helperProportions.width
      }).left)), !s.snapElements[d].snapping && (n || o || a || r || p) && s.options.snap.snap && s.options.snap.snap.call(s.element, e, t.extend(s._uiHash(), {
        snapItem: s.snapElements[d].item
      })), s.snapElements[d].snapping = n || o || a || r || p)
    }
  }), t.ui.plugin.add("draggable", "stack", {
    start: function (e, i, s) {
      var n, o = s.options,
        a = t.makeArray(t(o.stack)).sort(function (e, i) {
          return (parseInt(t(e).css("zIndex"), 10) || 0) - (parseInt(t(i).css("zIndex"), 10) || 0)
        });
      a.length && (n = parseInt(t(a[0]).css("zIndex"), 10) || 0, t(a).each(function (e) {
        t(this).css("zIndex", n + e)
      }), this.css("zIndex", n + a.length))
    }
  }), t.ui.plugin.add("draggable", "zIndex", {
    start: function (e, i, s) {
      var n = t(i.helper),
        o = s.options;
      n.css("zIndex") && (o._zIndex = n.css("zIndex")), n.css("zIndex", o.zIndex)
    },
    stop: function (e, i, s) {
      var n = s.options;
      n._zIndex && t(i.helper).css("zIndex", n._zIndex)
    }
  }), t.ui.draggable, t.widget("ui.droppable", {
    version: "1.11.4",
    widgetEventPrefix: "drop",
    options: {
      accept: "*",
      activeClass: !1,
      addClasses: !0,
      greedy: !1,
      hoverClass: !1,
      scope: "default",
      tolerance: "intersect",
      activate: null,
      deactivate: null,
      drop: null,
      out: null,
      over: null
    },
    _create: function () {
      var e, i = this.options,
        s = i.accept;
      this.isover = !1, this.isout = !0, this.accept = t.isFunction(s) ? s : function (t) {
        return t.is(s)
      }, this.proportions = function () {
        return arguments.length ? (e = arguments[0], void 0) : e ? e : e = {
          width: this.element[0].offsetWidth,
          height: this.element[0].offsetHeight
        }
      }, this._addToManager(i.scope), i.addClasses && this.element.addClass("ui-droppable")
    },
    _addToManager: function (e) {
      t.ui.ddmanager.droppables[e] = t.ui.ddmanager.droppables[e] || [], t.ui.ddmanager.droppables[e].push(this)
    },
    _splice: function (t) {
      for (var e = 0; t.length > e; e++) t[e] === this && t.splice(e, 1)
    },
    _destroy: function () {
      var e = t.ui.ddmanager.droppables[this.options.scope];
      this._splice(e), this.element.removeClass("ui-droppable ui-droppable-disabled")
    },
    _setOption: function (e, i) {
      if ("accept" === e) this.accept = t.isFunction(i) ? i : function (t) {
        return t.is(i)
      };
      else if ("scope" === e) {
        var s = t.ui.ddmanager.droppables[this.options.scope];
        this._splice(s), this._addToManager(i)
      }
      this._super(e, i)
    },
    _activate: function (e) {
      var i = t.ui.ddmanager.current;
      this.options.activeClass && this.element.addClass(this.options.activeClass), i && this._trigger("activate", e, this.ui(i))
    },
    _deactivate: function (e) {
      var i = t.ui.ddmanager.current;
      this.options.activeClass && this.element.removeClass(this.options.activeClass), i && this._trigger("deactivate", e, this.ui(i))
    },
    _over: function (e) {
      var i = t.ui.ddmanager.current;
      i && (i.currentItem || i.element)[0] !== this.element[0] && this.accept.call(this.element[0], i.currentItem || i.element) && (this.options.hoverClass && this.element.addClass(this.options.hoverClass), this._trigger("over", e, this.ui(i)))
    },
    _out: function (e) {
      var i = t.ui.ddmanager.current;
      i && (i.currentItem || i.element)[0] !== this.element[0] && this.accept.call(this.element[0], i.currentItem || i.element) && (this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("out", e, this.ui(i)))
    },
    _drop: function (e, i) {
      var s = i || t.ui.ddmanager.current,
        n = !1;
      return s && (s.currentItem || s.element)[0] !== this.element[0] ? (this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function () {
        var i = t(this).droppable("instance");
        return i.options.greedy && !i.options.disabled && i.options.scope === s.options.scope && i.accept.call(i.element[0], s.currentItem || s.element) && t.ui.intersect(s, t.extend(i, {
          offset: i.element.offset()
        }), i.options.tolerance, e) ? (n = !0, !1) : void 0
      }), n ? !1 : this.accept.call(this.element[0], s.currentItem || s.element) ? (this.options.activeClass && this.element.removeClass(this.options.activeClass), this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("drop", e, this.ui(s)), this.element) : !1) : !1
    },
    ui: function (t) {
      return {
        draggable: t.currentItem || t.element,
        helper: t.helper,
        position: t.position,
        offset: t.positionAbs
      }
    }
  }), t.ui.intersect = function () {
    function t(t, e, i) {
      return t >= e && e + i > t
    }
    return function (e, i, s, n) {
      if (!i.offset) return !1;
      var o = (e.positionAbs || e.position.absolute).left + e.margins.left,
        a = (e.positionAbs || e.position.absolute).top + e.margins.top,
        r = o + e.helperProportions.width,
        l = a + e.helperProportions.height,
        h = i.offset.left,
        c = i.offset.top,
        u = h + i.proportions().width,
        d = c + i.proportions().height;
      switch (s) {
        case "fit":
          return o >= h && u >= r && a >= c && d >= l;
        case "intersect":
          return o + e.helperProportions.width / 2 > h && u > r - e.helperProportions.width / 2 && a + e.helperProportions.height / 2 > c && d > l - e.helperProportions.height / 2;
        case "pointer":
          return t(n.pageY, c, i.proportions().height) && t(n.pageX, h, i.proportions().width);
        case "touch":
          return (a >= c && d >= a || l >= c && d >= l || c > a && l > d) && (o >= h && u >= o || r >= h && u >= r || h > o && r > u);
        default:
          return !1
      }
    }
  }(), t.ui.ddmanager = {
    current: null,
    droppables: {
      "default": []
    },
    prepareOffsets: function (e, i) {
      var s, n, o = t.ui.ddmanager.droppables[e.options.scope] || [],
        a = i ? i.type : null,
        r = (e.currentItem || e.element).find(":data(ui-droppable)").addBack();
      t: for (s = 0; o.length > s; s++)
        if (!(o[s].options.disabled || e && !o[s].accept.call(o[s].element[0], e.currentItem || e.element))) {
          for (n = 0; r.length > n; n++)
            if (r[n] === o[s].element[0]) {
              o[s].proportions().height = 0;
              continue t
            } o[s].visible = "none" !== o[s].element.css("display"), o[s].visible && ("mousedown" === a && o[s]._activate.call(o[s], i), o[s].offset = o[s].element.offset(), o[s].proportions({
            width: o[s].element[0].offsetWidth,
            height: o[s].element[0].offsetHeight
          }))
        }
    },
    drop: function (e, i) {
      var s = !1;
      return t.each((t.ui.ddmanager.droppables[e.options.scope] || []).slice(), function () {
        this.options && (!this.options.disabled && this.visible && t.ui.intersect(e, this, this.options.tolerance, i) && (s = this._drop.call(this, i) || s), !this.options.disabled && this.visible && this.accept.call(this.element[0], e.currentItem || e.element) && (this.isout = !0, this.isover = !1, this._deactivate.call(this, i)))
      }), s
    },
    dragStart: function (e, i) {
      e.element.parentsUntil("body").bind("scroll.droppable", function () {
        e.options.refreshPositions || t.ui.ddmanager.prepareOffsets(e, i)
      })
    },
    drag: function (e, i) {
      e.options.refreshPositions && t.ui.ddmanager.prepareOffsets(e, i), t.each(t.ui.ddmanager.droppables[e.options.scope] || [], function () {
        if (!this.options.disabled && !this.greedyChild && this.visible) {
          var s, n, o, a = t.ui.intersect(e, this, this.options.tolerance, i),
            r = !a && this.isover ? "isout" : a && !this.isover ? "isover" : null;
          r && (this.options.greedy && (n = this.options.scope, o = this.element.parents(":data(ui-droppable)").filter(function () {
            return t(this).droppable("instance").options.scope === n
          }), o.length && (s = t(o[0]).droppable("instance"), s.greedyChild = "isover" === r)), s && "isover" === r && (s.isover = !1, s.isout = !0, s._out.call(s, i)), this[r] = !0, this["isout" === r ? "isover" : "isout"] = !1, this["isover" === r ? "_over" : "_out"].call(this, i), s && "isout" === r && (s.isout = !1, s.isover = !0, s._over.call(s, i)))
        }
      })
    },
    dragStop: function (e, i) {
      e.element.parentsUntil("body").unbind("scroll.droppable"), e.options.refreshPositions || t.ui.ddmanager.prepareOffsets(e, i)
    }
  }, t.ui.droppable, t.widget("ui.resizable", t.ui.mouse, {
    version: "1.11.4",
    widgetEventPrefix: "resize",
    options: {
      alsoResize: !1,
      animate: !1,
      animateDuration: "slow",
      animateEasing: "swing",
      aspectRatio: !1,
      autoHide: !1,
      containment: !1,
      ghost: !1,
      grid: !1,
      handles: "e,s,se",
      helper: !1,
      maxHeight: null,
      maxWidth: null,
      minHeight: 10,
      minWidth: 10,
      zIndex: 90,
      resize: null,
      start: null,
      stop: null
    },
    _num: function (t) {
      return parseInt(t, 10) || 0
    },
    _isNumber: function (t) {
      return !isNaN(parseInt(t, 10))
    },
    _hasScroll: function (e, i) {
      if ("hidden" === t(e).css("overflow")) return !1;
      var s = i && "left" === i ? "scrollLeft" : "scrollTop",
        n = !1;
      return e[s] > 0 ? !0 : (e[s] = 1, n = e[s] > 0, e[s] = 0, n)
    },
    _create: function () {
      var e, i, s, n, o, a = this,
        r = this.options;
      if (this.element.addClass("ui-resizable"), t.extend(this, {
          _aspectRatio: !!r.aspectRatio,
          aspectRatio: r.aspectRatio,
          originalElement: this.element,
          _proportionallyResizeElements: [],
          _helper: r.helper || r.ghost || r.animate ? r.helper || "ui-resizable-helper" : null
        }), this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i) && (this.element.wrap(t("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
          position: this.element.css("position"),
          width: this.element.outerWidth(),
          height: this.element.outerHeight(),
          top: this.element.css("top"),
          left: this.element.css("left")
        })), this.element = this.element.parent().data("ui-resizable", this.element.resizable("instance")), this.elementIsWrapper = !0, this.element.css({
          marginLeft: this.originalElement.css("marginLeft"),
          marginTop: this.originalElement.css("marginTop"),
          marginRight: this.originalElement.css("marginRight"),
          marginBottom: this.originalElement.css("marginBottom")
        }), this.originalElement.css({
          marginLeft: 0,
          marginTop: 0,
          marginRight: 0,
          marginBottom: 0
        }), this.originalResizeStyle = this.originalElement.css("resize"), this.originalElement.css("resize", "none"), this._proportionallyResizeElements.push(this.originalElement.css({
          position: "static",
          zoom: 1,
          display: "block"
        })), this.originalElement.css({
          margin: this.originalElement.css("margin")
        }), this._proportionallyResize()), this.handles = r.handles || (t(".ui-resizable-handle", this.element).length ? {
          n: ".ui-resizable-n",
          e: ".ui-resizable-e",
          s: ".ui-resizable-s",
          w: ".ui-resizable-w",
          se: ".ui-resizable-se",
          sw: ".ui-resizable-sw",
          ne: ".ui-resizable-ne",
          nw: ".ui-resizable-nw"
        } : "e,s,se"), this._handles = t(), this.handles.constructor === String)
        for ("all" === this.handles && (this.handles = "n,e,s,w,se,sw,ne,nw"), e = this.handles.split(","), this.handles = {}, i = 0; e.length > i; i++) s = t.trim(e[i]), o = "ui-resizable-" + s, n = t("<div class='ui-resizable-handle " + o + "'></div>"), n.css({
          zIndex: r.zIndex
        }), "se" === s && n.addClass("ui-icon ui-icon-gripsmall-diagonal-se"), this.handles[s] = ".ui-resizable-" + s, this.element.append(n);
      this._renderAxis = function (e) {
        var i, s, n, o;
        e = e || this.element;
        for (i in this.handles) this.handles[i].constructor === String ? this.handles[i] = this.element.children(this.handles[i]).first().show() : (this.handles[i].jquery || this.handles[i].nodeType) && (this.handles[i] = t(this.handles[i]), this._on(this.handles[i], {
          mousedown: a._mouseDown
        })), this.elementIsWrapper && this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i) && (s = t(this.handles[i], this.element), o = /sw|ne|nw|se|n|s/.test(i) ? s.outerHeight() : s.outerWidth(), n = ["padding", /ne|nw|n/.test(i) ? "Top" : /se|sw|s/.test(i) ? "Bottom" : /^e$/.test(i) ? "Right" : "Left"].join(""), e.css(n, o), this._proportionallyResize()), this._handles = this._handles.add(this.handles[i])
      }, this._renderAxis(this.element), this._handles = this._handles.add(this.element.find(".ui-resizable-handle")), this._handles.disableSelection(), this._handles.mouseover(function () {
        a.resizing || (this.className && (n = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)), a.axis = n && n[1] ? n[1] : "se")
      }), r.autoHide && (this._handles.hide(), t(this.element).addClass("ui-resizable-autohide").mouseenter(function () {
        r.disabled || (t(this).removeClass("ui-resizable-autohide"), a._handles.show())
      }).mouseleave(function () {
        r.disabled || a.resizing || (t(this).addClass("ui-resizable-autohide"), a._handles.hide())
      })), this._mouseInit()
    },
    _destroy: function () {
      this._mouseDestroy();
      var e, i = function (e) {
        t(e).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove()
      };
      return this.elementIsWrapper && (i(this.element), e = this.element, this.originalElement.css({
        position: e.css("position"),
        width: e.outerWidth(),
        height: e.outerHeight(),
        top: e.css("top"),
        left: e.css("left")
      }).insertAfter(e), e.remove()), this.originalElement.css("resize", this.originalResizeStyle), i(this.originalElement), this
    },
    _mouseCapture: function (e) {
      var i, s, n = !1;
      for (i in this.handles) s = t(this.handles[i])[0], (s === e.target || t.contains(s, e.target)) && (n = !0);
      return !this.options.disabled && n
    },
    _mouseStart: function (e) {
      var i, s, n, o = this.options,
        a = this.element;
      return this.resizing = !0, this._renderProxy(), i = this._num(this.helper.css("left")), s = this._num(this.helper.css("top")), o.containment && (i += t(o.containment).scrollLeft() || 0, s += t(o.containment).scrollTop() || 0), this.offset = this.helper.offset(), this.position = {
        left: i,
        top: s
      }, this.size = this._helper ? {
        width: this.helper.width(),
        height: this.helper.height()
      } : {
        width: a.width(),
        height: a.height()
      }, this.originalSize = this._helper ? {
        width: a.outerWidth(),
        height: a.outerHeight()
      } : {
        width: a.width(),
        height: a.height()
      }, this.sizeDiff = {
        width: a.outerWidth() - a.width(),
        height: a.outerHeight() - a.height()
      }, this.originalPosition = {
        left: i,
        top: s
      }, this.originalMousePosition = {
        left: e.pageX,
        top: e.pageY
      }, this.aspectRatio = "number" == typeof o.aspectRatio ? o.aspectRatio : this.originalSize.width / this.originalSize.height || 1, n = t(".ui-resizable-" + this.axis).css("cursor"), t("body").css("cursor", "auto" === n ? this.axis + "-resize" : n), a.addClass("ui-resizable-resizing"), this._propagate("start", e), !0
    },
    _mouseDrag: function (e) {
      var i, s, n = this.originalMousePosition,
        o = this.axis,
        a = e.pageX - n.left || 0,
        r = e.pageY - n.top || 0,
        l = this._change[o];
      return this._updatePrevProperties(), l ? (i = l.apply(this, [e, a, r]), this._updateVirtualBoundaries(e.shiftKey), (this._aspectRatio || e.shiftKey) && (i = this._updateRatio(i, e)), i = this._respectSize(i, e), this._updateCache(i), this._propagate("resize", e), s = this._applyChanges(), !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize(), t.isEmptyObject(s) || (this._updatePrevProperties(), this._trigger("resize", e, this.ui()), this._applyChanges()), !1) : !1
    },
    _mouseStop: function (e) {
      this.resizing = !1;
      var i, s, n, o, a, r, l, h = this.options,
        c = this;
      return this._helper && (i = this._proportionallyResizeElements, s = i.length && /textarea/i.test(i[0].nodeName), n = s && this._hasScroll(i[0], "left") ? 0 : c.sizeDiff.height, o = s ? 0 : c.sizeDiff.width, a = {
        width: c.helper.width() - o,
        height: c.helper.height() - n
      }, r = parseInt(c.element.css("left"), 10) + (c.position.left - c.originalPosition.left) || null, l = parseInt(c.element.css("top"), 10) + (c.position.top - c.originalPosition.top) || null, h.animate || this.element.css(t.extend(a, {
        top: l,
        left: r
      })), c.helper.height(c.size.height), c.helper.width(c.size.width), this._helper && !h.animate && this._proportionallyResize()), t("body").css("cursor", "auto"), this.element.removeClass("ui-resizable-resizing"), this._propagate("stop", e), this._helper && this.helper.remove(), !1
    },
    _updatePrevProperties: function () {
      this.prevPosition = {
        top: this.position.top,
        left: this.position.left
      }, this.prevSize = {
        width: this.size.width,
        height: this.size.height
      }
    },
    _applyChanges: function () {
      var t = {};
      return this.position.top !== this.prevPosition.top && (t.top = this.position.top + "px"), this.position.left !== this.prevPosition.left && (t.left = this.position.left + "px"), this.size.width !== this.prevSize.width && (t.width = this.size.width + "px"), this.size.height !== this.prevSize.height && (t.height = this.size.height + "px"), this.helper.css(t), t
    },
    _updateVirtualBoundaries: function (t) {
      var e, i, s, n, o, a = this.options;
      o = {
        minWidth: this._isNumber(a.minWidth) ? a.minWidth : 0,
        maxWidth: this._isNumber(a.maxWidth) ? a.maxWidth : 1 / 0,
        minHeight: this._isNumber(a.minHeight) ? a.minHeight : 0,
        maxHeight: this._isNumber(a.maxHeight) ? a.maxHeight : 1 / 0
      }, (this._aspectRatio || t) && (e = o.minHeight * this.aspectRatio, s = o.minWidth / this.aspectRatio, i = o.maxHeight * this.aspectRatio, n = o.maxWidth / this.aspectRatio, e > o.minWidth && (o.minWidth = e), s > o.minHeight && (o.minHeight = s), o.maxWidth > i && (o.maxWidth = i), o.maxHeight > n && (o.maxHeight = n)), this._vBoundaries = o
    },
    _updateCache: function (t) {
      this.offset = this.helper.offset(), this._isNumber(t.left) && (this.position.left = t.left), this._isNumber(t.top) && (this.position.top = t.top), this._isNumber(t.height) && (this.size.height = t.height), this._isNumber(t.width) && (this.size.width = t.width)
    },
    _updateRatio: function (t) {
      var e = this.position,
        i = this.size,
        s = this.axis;
      return this._isNumber(t.height) ? t.width = t.height * this.aspectRatio : this._isNumber(t.width) && (t.height = t.width / this.aspectRatio), "sw" === s && (t.left = e.left + (i.width - t.width), t.top = null), "nw" === s && (t.top = e.top + (i.height - t.height), t.left = e.left + (i.width - t.width)), t
    },
    _respectSize: function (t) {
      var e = this._vBoundaries,
        i = this.axis,
        s = this._isNumber(t.width) && e.maxWidth && e.maxWidth < t.width,
        n = this._isNumber(t.height) && e.maxHeight && e.maxHeight < t.height,
        o = this._isNumber(t.width) && e.minWidth && e.minWidth > t.width,
        a = this._isNumber(t.height) && e.minHeight && e.minHeight > t.height,
        r = this.originalPosition.left + this.originalSize.width,
        l = this.position.top + this.size.height,
        h = /sw|nw|w/.test(i),
        c = /nw|ne|n/.test(i);
      return o && (t.width = e.minWidth), a && (t.height = e.minHeight), s && (t.width = e.maxWidth), n && (t.height = e.maxHeight), o && h && (t.left = r - e.minWidth), s && h && (t.left = r - e.maxWidth), a && c && (t.top = l - e.minHeight), n && c && (t.top = l - e.maxHeight), t.width || t.height || t.left || !t.top ? t.width || t.height || t.top || !t.left || (t.left = null) : t.top = null, t
    },
    _getPaddingPlusBorderDimensions: function (t) {
      for (var e = 0, i = [], s = [t.css("borderTopWidth"), t.css("borderRightWidth"), t.css("borderBottomWidth"), t.css("borderLeftWidth")], n = [t.css("paddingTop"), t.css("paddingRight"), t.css("paddingBottom"), t.css("paddingLeft")]; 4 > e; e++) i[e] = parseInt(s[e], 10) || 0, i[e] += parseInt(n[e], 10) || 0;
      return {
        height: i[0] + i[2],
        width: i[1] + i[3]
      }
    },
    _proportionallyResize: function () {
      if (this._proportionallyResizeElements.length)
        for (var t, e = 0, i = this.helper || this.element; this._proportionallyResizeElements.length > e; e++) t = this._proportionallyResizeElements[e], this.outerDimensions || (this.outerDimensions = this._getPaddingPlusBorderDimensions(t)), t.css({
          height: i.height() - this.outerDimensions.height || 0,
          width: i.width() - this.outerDimensions.width || 0
        })
    },
    _renderProxy: function () {
      var e = this.element,
        i = this.options;
      this.elementOffset = e.offset(), this._helper ? (this.helper = this.helper || t("<div style='overflow:hidden;'></div>"), this.helper.addClass(this._helper).css({
        width: this.element.outerWidth() - 1,
        height: this.element.outerHeight() - 1,
        position: "absolute",
        left: this.elementOffset.left + "px",
        top: this.elementOffset.top + "px",
        zIndex: ++i.zIndex
      }), this.helper.appendTo("body").disableSelection()) : this.helper = this.element
    },
    _change: {
      e: function (t, e) {
        return {
          width: this.originalSize.width + e
        }
      },
      w: function (t, e) {
        var i = this.originalSize,
          s = this.originalPosition;
        return {
          left: s.left + e,
          width: i.width - e
        }
      },
      n: function (t, e, i) {
        var s = this.originalSize,
          n = this.originalPosition;
        return {
          top: n.top + i,
          height: s.height - i
        }
      },
      s: function (t, e, i) {
        return {
          height: this.originalSize.height + i
        }
      },
      se: function (e, i, s) {
        return t.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [e, i, s]))
      },
      sw: function (e, i, s) {
        return t.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [e, i, s]))
      },
      ne: function (e, i, s) {
        return t.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [e, i, s]))
      },
      nw: function (e, i, s) {
        return t.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [e, i, s]))
      }
    },
    _propagate: function (e, i) {
      t.ui.plugin.call(this, e, [i, this.ui()]), "resize" !== e && this._trigger(e, i, this.ui())
    },
    plugins: {},
    ui: function () {
      return {
        originalElement: this.originalElement,
        element: this.element,
        helper: this.helper,
        position: this.position,
        size: this.size,
        originalSize: this.originalSize,
        originalPosition: this.originalPosition
      }
    }
  }), t.ui.plugin.add("resizable", "animate", {
    stop: function (e) {
      var i = t(this).resizable("instance"),
        s = i.options,
        n = i._proportionallyResizeElements,
        o = n.length && /textarea/i.test(n[0].nodeName),
        a = o && i._hasScroll(n[0], "left") ? 0 : i.sizeDiff.height,
        r = o ? 0 : i.sizeDiff.width,
        l = {
          width: i.size.width - r,
          height: i.size.height - a
        },
        h = parseInt(i.element.css("left"), 10) + (i.position.left - i.originalPosition.left) || null,
        c = parseInt(i.element.css("top"), 10) + (i.position.top - i.originalPosition.top) || null;
      i.element.animate(t.extend(l, c && h ? {
        top: c,
        left: h
      } : {}), {
        duration: s.animateDuration,
        easing: s.animateEasing,
        step: function () {
          var s = {
            width: parseInt(i.element.css("width"), 10),
            height: parseInt(i.element.css("height"), 10),
            top: parseInt(i.element.css("top"), 10),
            left: parseInt(i.element.css("left"), 10)
          };
          n && n.length && t(n[0]).css({
            width: s.width,
            height: s.height
          }), i._updateCache(s), i._propagate("resize", e)
        }
      })
    }
  }), t.ui.plugin.add("resizable", "containment", {
    start: function () {
      var e, i, s, n, o, a, r, l = t(this).resizable("instance"),
        h = l.options,
        c = l.element,
        u = h.containment,
        d = u instanceof t ? u.get(0) : /parent/.test(u) ? c.parent().get(0) : u;
      d && (l.containerElement = t(d), /document/.test(u) || u === document ? (l.containerOffset = {
        left: 0,
        top: 0
      }, l.containerPosition = {
        left: 0,
        top: 0
      }, l.parentData = {
        element: t(document),
        left: 0,
        top: 0,
        width: t(document).width(),
        height: t(document).height() || document.body.parentNode.scrollHeight
      }) : (e = t(d), i = [], t(["Top", "Right", "Left", "Bottom"]).each(function (t, s) {
        i[t] = l._num(e.css("padding" + s))
      }), l.containerOffset = e.offset(), l.containerPosition = e.position(), l.containerSize = {
        height: e.innerHeight() - i[3],
        width: e.innerWidth() - i[1]
      }, s = l.containerOffset, n = l.containerSize.height, o = l.containerSize.width, a = l._hasScroll(d, "left") ? d.scrollWidth : o, r = l._hasScroll(d) ? d.scrollHeight : n, l.parentData = {
        element: d,
        left: s.left,
        top: s.top,
        width: a,
        height: r
      }))
    },
    resize: function (e) {
      var i, s, n, o, a = t(this).resizable("instance"),
        r = a.options,
        l = a.containerOffset,
        h = a.position,
        c = a._aspectRatio || e.shiftKey,
        u = {
          top: 0,
          left: 0
        },
        d = a.containerElement,
        p = !0;
      d[0] !== document && /static/.test(d.css("position")) && (u = l), h.left < (a._helper ? l.left : 0) && (a.size.width = a.size.width + (a._helper ? a.position.left - l.left : a.position.left - u.left), c && (a.size.height = a.size.width / a.aspectRatio, p = !1), a.position.left = r.helper ? l.left : 0), h.top < (a._helper ? l.top : 0) && (a.size.height = a.size.height + (a._helper ? a.position.top - l.top : a.position.top), c && (a.size.width = a.size.height * a.aspectRatio, p = !1), a.position.top = a._helper ? l.top : 0), n = a.containerElement.get(0) === a.element.parent().get(0), o = /relative|absolute/.test(a.containerElement.css("position")), n && o ? (a.offset.left = a.parentData.left + a.position.left, a.offset.top = a.parentData.top + a.position.top) : (a.offset.left = a.element.offset().left, a.offset.top = a.element.offset().top), i = Math.abs(a.sizeDiff.width + (a._helper ? a.offset.left - u.left : a.offset.left - l.left)), s = Math.abs(a.sizeDiff.height + (a._helper ? a.offset.top - u.top : a.offset.top - l.top)), i + a.size.width >= a.parentData.width && (a.size.width = a.parentData.width - i, c && (a.size.height = a.size.width / a.aspectRatio, p = !1)), s + a.size.height >= a.parentData.height && (a.size.height = a.parentData.height - s, c && (a.size.width = a.size.height * a.aspectRatio, p = !1)), p || (a.position.left = a.prevPosition.left, a.position.top = a.prevPosition.top, a.size.width = a.prevSize.width, a.size.height = a.prevSize.height)
    },
    stop: function () {
      var e = t(this).resizable("instance"),
        i = e.options,
        s = e.containerOffset,
        n = e.containerPosition,
        o = e.containerElement,
        a = t(e.helper),
        r = a.offset(),
        l = a.outerWidth() - e.sizeDiff.width,
        h = a.outerHeight() - e.sizeDiff.height;
      e._helper && !i.animate && /relative/.test(o.css("position")) && t(this).css({
        left: r.left - n.left - s.left,
        width: l,
        height: h
      }), e._helper && !i.animate && /static/.test(o.css("position")) && t(this).css({
        left: r.left - n.left - s.left,
        width: l,
        height: h
      })
    }
  }), t.ui.plugin.add("resizable", "alsoResize", {
    start: function () {
      var e = t(this).resizable("instance"),
        i = e.options;
      t(i.alsoResize).each(function () {
        var e = t(this);
        e.data("ui-resizable-alsoresize", {
          width: parseInt(e.width(), 10),
          height: parseInt(e.height(), 10),
          left: parseInt(e.css("left"), 10),
          top: parseInt(e.css("top"), 10)
        })
      })
    },
    resize: function (e, i) {
      var s = t(this).resizable("instance"),
        n = s.options,
        o = s.originalSize,
        a = s.originalPosition,
        r = {
          height: s.size.height - o.height || 0,
          width: s.size.width - o.width || 0,
          top: s.position.top - a.top || 0,
          left: s.position.left - a.left || 0
        };
      t(n.alsoResize).each(function () {
        var e = t(this),
          s = t(this).data("ui-resizable-alsoresize"),
          n = {},
          o = e.parents(i.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
        t.each(o, function (t, e) {
          var i = (s[e] || 0) + (r[e] || 0);
          i && i >= 0 && (n[e] = i || null)
        }), e.css(n)
      })
    },
    stop: function () {
      t(this).removeData("resizable-alsoresize")
    }
  }), t.ui.plugin.add("resizable", "ghost", {
    start: function () {
      var e = t(this).resizable("instance"),
        i = e.options,
        s = e.size;
      e.ghost = e.originalElement.clone(), e.ghost.css({
        opacity: .25,
        display: "block",
        position: "relative",
        height: s.height,
        width: s.width,
        margin: 0,
        left: 0,
        top: 0
      }).addClass("ui-resizable-ghost").addClass("string" == typeof i.ghost ? i.ghost : ""), e.ghost.appendTo(e.helper)
    },
    resize: function () {
      var e = t(this).resizable("instance");
      e.ghost && e.ghost.css({
        position: "relative",
        height: e.size.height,
        width: e.size.width
      })
    },
    stop: function () {
      var e = t(this).resizable("instance");
      e.ghost && e.helper && e.helper.get(0).removeChild(e.ghost.get(0))
    }
  }), t.ui.plugin.add("resizable", "grid", {
    resize: function () {
      var e, i = t(this).resizable("instance"),
        s = i.options,
        n = i.size,
        o = i.originalSize,
        a = i.originalPosition,
        r = i.axis,
        l = "number" == typeof s.grid ? [s.grid, s.grid] : s.grid,
        h = l[0] || 1,
        c = l[1] || 1,
        u = Math.round((n.width - o.width) / h) * h,
        d = Math.round((n.height - o.height) / c) * c,
        p = o.width + u,
        f = o.height + d,
        g = s.maxWidth && p > s.maxWidth,
        m = s.maxHeight && f > s.maxHeight,
        _ = s.minWidth && s.minWidth > p,
        v = s.minHeight && s.minHeight > f;
      s.grid = l, _ && (p += h), v && (f += c), g && (p -= h), m && (f -= c), /^(se|s|e)$/.test(r) ? (i.size.width = p, i.size.height = f) : /^(ne)$/.test(r) ? (i.size.width = p, i.size.height = f, i.position.top = a.top - d) : /^(sw)$/.test(r) ? (i.size.width = p, i.size.height = f, i.position.left = a.left - u) : ((0 >= f - c || 0 >= p - h) && (e = i._getPaddingPlusBorderDimensions(this)), f - c > 0 ? (i.size.height = f, i.position.top = a.top - d) : (f = c - e.height, i.size.height = f, i.position.top = a.top + o.height - f), p - h > 0 ? (i.size.width = p, i.position.left = a.left - u) : (p = h - e.width, i.size.width = p, i.position.left = a.left + o.width - p))
    }
  }), t.ui.resizable, t.widget("ui.sortable", t.ui.mouse, {
    version: "1.11.4",
    widgetEventPrefix: "sort",
    ready: !1,
    options: {
      appendTo: "parent",
      axis: !1,
      connectWith: !1,
      containment: !1,
      cursor: "auto",
      cursorAt: !1,
      dropOnEmpty: !0,
      forcePlaceholderSize: !1,
      forceHelperSize: !1,
      grid: !1,
      handle: !1,
      helper: "original",
      items: "> *",
      opacity: !1,
      placeholder: !1,
      revert: !1,
      scroll: !0,
      scrollSensitivity: 20,
      scrollSpeed: 20,
      scope: "default",
      tolerance: "intersect",
      zIndex: 1e3,
      activate: null,
      beforeStop: null,
      change: null,
      deactivate: null,
      out: null,
      over: null,
      receive: null,
      remove: null,
      sort: null,
      start: null,
      stop: null,
      update: null
    },
    _isOverAxis: function (t, e, i) {
      return t >= e && e + i > t
    },
    _isFloating: function (t) {
      return /left|right/.test(t.css("float")) || /inline|table-cell/.test(t.css("display"))
    },
    _create: function () {
      this.containerCache = {}, this.element.addClass("ui-sortable"), this.refresh(), this.offset = this.element.offset(), this._mouseInit(), this._setHandleClassName(), this.ready = !0
    },
    _setOption: function (t, e) {
      this._super(t, e), "handle" === t && this._setHandleClassName()
    },
    _setHandleClassName: function () {
      this.element.find(".ui-sortable-handle").removeClass("ui-sortable-handle"), t.each(this.items, function () {
        (this.instance.options.handle ? this.item.find(this.instance.options.handle) : this.item).addClass("ui-sortable-handle")
      })
    },
    _destroy: function () {
      this.element.removeClass("ui-sortable ui-sortable-disabled").find(".ui-sortable-handle").removeClass("ui-sortable-handle"), this._mouseDestroy();
      for (var t = this.items.length - 1; t >= 0; t--) this.items[t].item.removeData(this.widgetName + "-item");
      return this
    },
    _mouseCapture: function (e, i) {
      var s = null,
        n = !1,
        o = this;
      return this.reverting ? !1 : this.options.disabled || "static" === this.options.type ? !1 : (this._refreshItems(e), t(e.target).parents().each(function () {
        return t.data(this, o.widgetName + "-item") === o ? (s = t(this), !1) : void 0
      }), t.data(e.target, o.widgetName + "-item") === o && (s = t(e.target)), s ? !this.options.handle || i || (t(this.options.handle, s).find("*").addBack().each(function () {
        this === e.target && (n = !0)
      }), n) ? (this.currentItem = s, this._removeCurrentsFromItems(), !0) : !1 : !1)
    },
    _mouseStart: function (e, i, s) {
      var n, o, a = this.options;
      if (this.currentContainer = this, this.refreshPositions(), this.helper = this._createHelper(e), this._cacheHelperProportions(), this._cacheMargins(), this.scrollParent = this.helper.scrollParent(), this.offset = this.currentItem.offset(), this.offset = {
          top: this.offset.top - this.margins.top,
          left: this.offset.left - this.margins.left
        }, t.extend(this.offset, {
          click: {
            left: e.pageX - this.offset.left,
            top: e.pageY - this.offset.top
          },
          parent: this._getParentOffset(),
          relative: this._getRelativeOffset()
        }), this.helper.css("position", "absolute"), this.cssPosition = this.helper.css("position"), this.originalPosition = this._generatePosition(e), this.originalPageX = e.pageX, this.originalPageY = e.pageY, a.cursorAt && this._adjustOffsetFromHelper(a.cursorAt), this.domPosition = {
          prev: this.currentItem.prev()[0],
          parent: this.currentItem.parent()[0]
        }, this.helper[0] !== this.currentItem[0] && this.currentItem.hide(), this._createPlaceholder(), a.containment && this._setContainment(), a.cursor && "auto" !== a.cursor && (o = this.document.find("body"), this.storedCursor = o.css("cursor"), o.css("cursor", a.cursor), this.storedStylesheet = t("<style>*{ cursor: " + a.cursor + " !important; }</style>").appendTo(o)), a.opacity && (this.helper.css("opacity") && (this._storedOpacity = this.helper.css("opacity")), this.helper.css("opacity", a.opacity)), a.zIndex && (this.helper.css("zIndex") && (this._storedZIndex = this.helper.css("zIndex")), this.helper.css("zIndex", a.zIndex)), this.scrollParent[0] !== this.document[0] && "HTML" !== this.scrollParent[0].tagName && (this.overflowOffset = this.scrollParent.offset()), this._trigger("start", e, this._uiHash()), this._preserveHelperProportions || this._cacheHelperProportions(), !s)
        for (n = this.containers.length - 1; n >= 0; n--) this.containers[n]._trigger("activate", e, this._uiHash(this));
      return t.ui.ddmanager && (t.ui.ddmanager.current = this), t.ui.ddmanager && !a.dropBehaviour && t.ui.ddmanager.prepareOffsets(this, e), this.dragging = !0, this.helper.addClass("ui-sortable-helper"), this._mouseDrag(e), !0
    },
    _mouseDrag: function (e) {
      var i, s, n, o, a = this.options,
        r = !1;
      for (this.position = this._generatePosition(e), this.positionAbs = this._convertPositionTo("absolute"), this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs), this.options.scroll && (this.scrollParent[0] !== this.document[0] && "HTML" !== this.scrollParent[0].tagName ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - e.pageY < a.scrollSensitivity ? this.scrollParent[0].scrollTop = r = this.scrollParent[0].scrollTop + a.scrollSpeed : e.pageY - this.overflowOffset.top < a.scrollSensitivity && (this.scrollParent[0].scrollTop = r = this.scrollParent[0].scrollTop - a.scrollSpeed), this.overflowOffset.left + this.scrollParent[0].offsetWidth - e.pageX < a.scrollSensitivity ? this.scrollParent[0].scrollLeft = r = this.scrollParent[0].scrollLeft + a.scrollSpeed : e.pageX - this.overflowOffset.left < a.scrollSensitivity && (this.scrollParent[0].scrollLeft = r = this.scrollParent[0].scrollLeft - a.scrollSpeed)) : (e.pageY - this.document.scrollTop() < a.scrollSensitivity ? r = this.document.scrollTop(this.document.scrollTop() - a.scrollSpeed) : this.window.height() - (e.pageY - this.document.scrollTop()) < a.scrollSensitivity && (r = this.document.scrollTop(this.document.scrollTop() + a.scrollSpeed)), e.pageX - this.document.scrollLeft() < a.scrollSensitivity ? r = this.document.scrollLeft(this.document.scrollLeft() - a.scrollSpeed) : this.window.width() - (e.pageX - this.document.scrollLeft()) < a.scrollSensitivity && (r = this.document.scrollLeft(this.document.scrollLeft() + a.scrollSpeed))), r !== !1 && t.ui.ddmanager && !a.dropBehaviour && t.ui.ddmanager.prepareOffsets(this, e)), this.positionAbs = this._convertPositionTo("absolute"), this.options.axis && "y" === this.options.axis || (this.helper[0].style.left = this.position.left + "px"), this.options.axis && "x" === this.options.axis || (this.helper[0].style.top = this.position.top + "px"), i = this.items.length - 1; i >= 0; i--)
        if (s = this.items[i], n = s.item[0], o = this._intersectsWithPointer(s), o && s.instance === this.currentContainer && n !== this.currentItem[0] && this.placeholder[1 === o ? "next" : "prev"]()[0] !== n && !t.contains(this.placeholder[0], n) && ("semi-dynamic" === this.options.type ? !t.contains(this.element[0], n) : !0)) {
          if (this.direction = 1 === o ? "down" : "up", "pointer" !== this.options.tolerance && !this._intersectsWithSides(s)) break;
          this._rearrange(e, s), this._trigger("change", e, this._uiHash());
          break
        } return this._contactContainers(e), t.ui.ddmanager && t.ui.ddmanager.drag(this, e), this._trigger("sort", e, this._uiHash()), this.lastPositionAbs = this.positionAbs, !1
    },
    _mouseStop: function (e, i) {
      if (e) {
        if (t.ui.ddmanager && !this.options.dropBehaviour && t.ui.ddmanager.drop(this, e), this.options.revert) {
          var s = this,
            n = this.placeholder.offset(),
            o = this.options.axis,
            a = {};
          o && "x" !== o || (a.left = n.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollLeft)), o && "y" !== o || (a.top = n.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollTop)), this.reverting = !0, t(this.helper).animate(a, parseInt(this.options.revert, 10) || 500, function () {
            s._clear(e)
          })
        } else this._clear(e, i);
        return !1
      }
    },
    cancel: function () {
      if (this.dragging) {
        this._mouseUp({
          target: null
        }), "original" === this.options.helper ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") : this.currentItem.show();
        for (var e = this.containers.length - 1; e >= 0; e--) this.containers[e]._trigger("deactivate", null, this._uiHash(this)), this.containers[e].containerCache.over && (this.containers[e]._trigger("out", null, this._uiHash(this)), this.containers[e].containerCache.over = 0)
      }
      return this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]), "original" !== this.options.helper && this.helper && this.helper[0].parentNode && this.helper.remove(), t.extend(this, {
        helper: null,
        dragging: !1,
        reverting: !1,
        _noFinalSort: null
      }), this.domPosition.prev ? t(this.domPosition.prev).after(this.currentItem) : t(this.domPosition.parent).prepend(this.currentItem)), this
    },
    serialize: function (e) {
      var i = this._getItemsAsjQuery(e && e.connected),
        s = [];
      return e = e || {}, t(i).each(function () {
        var i = (t(e.item || this).attr(e.attribute || "id") || "").match(e.expression || /(.+)[\-=_](.+)/);
        i && s.push((e.key || i[1] + "[]") + "=" + (e.key && e.expression ? i[1] : i[2]))
      }), !s.length && e.key && s.push(e.key + "="), s.join("&")
    },
    toArray: function (e) {
      var i = this._getItemsAsjQuery(e && e.connected),
        s = [];
      return e = e || {}, i.each(function () {
        s.push(t(e.item || this).attr(e.attribute || "id") || "")
      }), s
    },
    _intersectsWith: function (t) {
      var e = this.positionAbs.left,
        i = e + this.helperProportions.width,
        s = this.positionAbs.top,
        n = s + this.helperProportions.height,
        o = t.left,
        a = o + t.width,
        r = t.top,
        l = r + t.height,
        h = this.offset.click.top,
        c = this.offset.click.left,
        u = "x" === this.options.axis || s + h > r && l > s + h,
        d = "y" === this.options.axis || e + c > o && a > e + c,
        p = u && d;
      return "pointer" === this.options.tolerance || this.options.forcePointerForContainers || "pointer" !== this.options.tolerance && this.helperProportions[this.floating ? "width" : "height"] > t[this.floating ? "width" : "height"] ? p : e + this.helperProportions.width / 2 > o && a > i - this.helperProportions.width / 2 && s + this.helperProportions.height / 2 > r && l > n - this.helperProportions.height / 2
    },
    _intersectsWithPointer: function (t) {
      var e = "x" === this.options.axis || this._isOverAxis(this.positionAbs.top + this.offset.click.top, t.top, t.height),
        i = "y" === this.options.axis || this._isOverAxis(this.positionAbs.left + this.offset.click.left, t.left, t.width),
        s = e && i,
        n = this._getDragVerticalDirection(),
        o = this._getDragHorizontalDirection();
      return s ? this.floating ? o && "right" === o || "down" === n ? 2 : 1 : n && ("down" === n ? 2 : 1) : !1
    },
    _intersectsWithSides: function (t) {
      var e = this._isOverAxis(this.positionAbs.top + this.offset.click.top, t.top + t.height / 2, t.height),
        i = this._isOverAxis(this.positionAbs.left + this.offset.click.left, t.left + t.width / 2, t.width),
        s = this._getDragVerticalDirection(),
        n = this._getDragHorizontalDirection();
      return this.floating && n ? "right" === n && i || "left" === n && !i : s && ("down" === s && e || "up" === s && !e)
    },
    _getDragVerticalDirection: function () {
      var t = this.positionAbs.top - this.lastPositionAbs.top;
      return 0 !== t && (t > 0 ? "down" : "up")
    },
    _getDragHorizontalDirection: function () {
      var t = this.positionAbs.left - this.lastPositionAbs.left;
      return 0 !== t && (t > 0 ? "right" : "left")
    },
    refresh: function (t) {
      return this._refreshItems(t), this._setHandleClassName(), this.refreshPositions(), this
    },
    _connectWith: function () {
      var t = this.options;
      return t.connectWith.constructor === String ? [t.connectWith] : t.connectWith
    },
    _getItemsAsjQuery: function (e) {
      function i() {
        r.push(this)
      }
      var s, n, o, a, r = [],
        l = [],
        h = this._connectWith();
      if (h && e)
        for (s = h.length - 1; s >= 0; s--)
          for (o = t(h[s], this.document[0]), n = o.length - 1; n >= 0; n--) a = t.data(o[n], this.widgetFullName), a && a !== this && !a.options.disabled && l.push([t.isFunction(a.options.items) ? a.options.items.call(a.element) : t(a.options.items, a.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), a]);
      for (l.push([t.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
          options: this.options,
          item: this.currentItem
        }) : t(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]), s = l.length - 1; s >= 0; s--) l[s][0].each(i);
      return t(r)
    },
    _removeCurrentsFromItems: function () {
      var e = this.currentItem.find(":data(" + this.widgetName + "-item)");
      this.items = t.grep(this.items, function (t) {
        for (var i = 0; e.length > i; i++)
          if (e[i] === t.item[0]) return !1;
        return !0
      })
    },
    _refreshItems: function (e) {
      this.items = [], this.containers = [this];
      var i, s, n, o, a, r, l, h, c = this.items,
        u = [
          [t.isFunction(this.options.items) ? this.options.items.call(this.element[0], e, {
            item: this.currentItem
          }) : t(this.options.items, this.element), this]
        ],
        d = this._connectWith();
      if (d && this.ready)
        for (i = d.length - 1; i >= 0; i--)
          for (n = t(d[i], this.document[0]), s = n.length - 1; s >= 0; s--) o = t.data(n[s], this.widgetFullName), o && o !== this && !o.options.disabled && (u.push([t.isFunction(o.options.items) ? o.options.items.call(o.element[0], e, {
            item: this.currentItem
          }) : t(o.options.items, o.element), o]), this.containers.push(o));
      for (i = u.length - 1; i >= 0; i--)
        for (a = u[i][1], r = u[i][0], s = 0, h = r.length; h > s; s++) l = t(r[s]), l.data(this.widgetName + "-item", a), c.push({
          item: l,
          instance: a,
          width: 0,
          height: 0,
          left: 0,
          top: 0
        })
    },
    refreshPositions: function (e) {
      this.floating = this.items.length ? "x" === this.options.axis || this._isFloating(this.items[0].item) : !1, this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset());
      var i, s, n, o;
      for (i = this.items.length - 1; i >= 0; i--) s = this.items[i], s.instance !== this.currentContainer && this.currentContainer && s.item[0] !== this.currentItem[0] || (n = this.options.toleranceElement ? t(this.options.toleranceElement, s.item) : s.item, e || (s.width = n.outerWidth(), s.height = n.outerHeight()), o = n.offset(), s.left = o.left, s.top = o.top);
      if (this.options.custom && this.options.custom.refreshContainers) this.options.custom.refreshContainers.call(this);
      else
        for (i = this.containers.length - 1; i >= 0; i--) o = this.containers[i].element.offset(), this.containers[i].containerCache.left = o.left, this.containers[i].containerCache.top = o.top, this.containers[i].containerCache.width = this.containers[i].element.outerWidth(), this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
      return this
    },
    _createPlaceholder: function (e) {
      e = e || this;
      var i, s = e.options;
      s.placeholder && s.placeholder.constructor !== String || (i = s.placeholder, s.placeholder = {
        element: function () {
          var s = e.currentItem[0].nodeName.toLowerCase(),
            n = t("<" + s + ">", e.document[0]).addClass(i || e.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper");
          return "tbody" === s ? e._createTrPlaceholder(e.currentItem.find("tr").eq(0), t("<tr>", e.document[0]).appendTo(n)) : "tr" === s ? e._createTrPlaceholder(e.currentItem, n) : "img" === s && n.attr("src", e.currentItem.attr("src")), i || n.css("visibility", "hidden"), n
        },
        update: function (t, n) {
          (!i || s.forcePlaceholderSize) && (n.height() || n.height(e.currentItem.innerHeight() - parseInt(e.currentItem.css("paddingTop") || 0, 10) - parseInt(e.currentItem.css("paddingBottom") || 0, 10)), n.width() || n.width(e.currentItem.innerWidth() - parseInt(e.currentItem.css("paddingLeft") || 0, 10) - parseInt(e.currentItem.css("paddingRight") || 0, 10)))
        }
      }), e.placeholder = t(s.placeholder.element.call(e.element, e.currentItem)), e.currentItem.after(e.placeholder), s.placeholder.update(e, e.placeholder)
    },
    _createTrPlaceholder: function (e, i) {
      var s = this;
      e.children().each(function () {
        t("<td>&#160;</td>", s.document[0]).attr("colspan", t(this).attr("colspan") || 1).appendTo(i)
      })
    },
    _contactContainers: function (e) {
      var i, s, n, o, a, r, l, h, c, u, d = null,
        p = null;
      for (i = this.containers.length - 1; i >= 0; i--)
        if (!t.contains(this.currentItem[0], this.containers[i].element[0]))
          if (this._intersectsWith(this.containers[i].containerCache)) {
            if (d && t.contains(this.containers[i].element[0], d.element[0])) continue;
            d = this.containers[i], p = i
          } else this.containers[i].containerCache.over && (this.containers[i]._trigger("out", e, this._uiHash(this)), this.containers[i].containerCache.over = 0);
      if (d)
        if (1 === this.containers.length) this.containers[p].containerCache.over || (this.containers[p]._trigger("over", e, this._uiHash(this)), this.containers[p].containerCache.over = 1);
        else {
          for (n = 1e4, o = null, c = d.floating || this._isFloating(this.currentItem), a = c ? "left" : "top", r = c ? "width" : "height", u = c ? "clientX" : "clientY", s = this.items.length - 1; s >= 0; s--) t.contains(this.containers[p].element[0], this.items[s].item[0]) && this.items[s].item[0] !== this.currentItem[0] && (l = this.items[s].item.offset()[a], h = !1, e[u] - l > this.items[s][r] / 2 && (h = !0), n > Math.abs(e[u] - l) && (n = Math.abs(e[u] - l), o = this.items[s], this.direction = h ? "up" : "down"));
          if (!o && !this.options.dropOnEmpty) return;
          if (this.currentContainer === this.containers[p]) return this.currentContainer.containerCache.over || (this.containers[p]._trigger("over", e, this._uiHash()), this.currentContainer.containerCache.over = 1), void 0;
          o ? this._rearrange(e, o, null, !0) : this._rearrange(e, null, this.containers[p].element, !0), this._trigger("change", e, this._uiHash()), this.containers[p]._trigger("change", e, this._uiHash(this)), this.currentContainer = this.containers[p], this.options.placeholder.update(this.currentContainer, this.placeholder), this.containers[p]._trigger("over", e, this._uiHash(this)), this.containers[p].containerCache.over = 1
        }
    },
    _createHelper: function (e) {
      var i = this.options,
        s = t.isFunction(i.helper) ? t(i.helper.apply(this.element[0], [e, this.currentItem])) : "clone" === i.helper ? this.currentItem.clone() : this.currentItem;
      return s.parents("body").length || t("parent" !== i.appendTo ? i.appendTo : this.currentItem[0].parentNode)[0].appendChild(s[0]), s[0] === this.currentItem[0] && (this._storedCSS = {
        width: this.currentItem[0].style.width,
        height: this.currentItem[0].style.height,
        position: this.currentItem.css("position"),
        top: this.currentItem.css("top"),
        left: this.currentItem.css("left")
      }), (!s[0].style.width || i.forceHelperSize) && s.width(this.currentItem.width()), (!s[0].style.height || i.forceHelperSize) && s.height(this.currentItem.height()), s
    },
    _adjustOffsetFromHelper: function (e) {
      "string" == typeof e && (e = e.split(" ")), t.isArray(e) && (e = {
        left: +e[0],
        top: +e[1] || 0
      }), "left" in e && (this.offset.click.left = e.left + this.margins.left), "right" in e && (this.offset.click.left = this.helperProportions.width - e.right + this.margins.left), "top" in e && (this.offset.click.top = e.top + this.margins.top), "bottom" in e && (this.offset.click.top = this.helperProportions.height - e.bottom + this.margins.top)
    },
    _getParentOffset: function () {
      this.offsetParent = this.helper.offsetParent();
      var e = this.offsetParent.offset();
      return "absolute" === this.cssPosition && this.scrollParent[0] !== this.document[0] && t.contains(this.scrollParent[0], this.offsetParent[0]) && (e.left += this.scrollParent.scrollLeft(), e.top += this.scrollParent.scrollTop()), (this.offsetParent[0] === this.document[0].body || this.offsetParent[0].tagName && "html" === this.offsetParent[0].tagName.toLowerCase() && t.ui.ie) && (e = {
        top: 0,
        left: 0
      }), {
        top: e.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
        left: e.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
      }
    },
    _getRelativeOffset: function () {
      if ("relative" === this.cssPosition) {
        var t = this.currentItem.position();
        return {
          top: t.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
          left: t.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
        }
      }
      return {
        top: 0,
        left: 0
      }
    },
    _cacheMargins: function () {
      this.margins = {
        left: parseInt(this.currentItem.css("marginLeft"), 10) || 0,
        top: parseInt(this.currentItem.css("marginTop"), 10) || 0
      }
    },
    _cacheHelperProportions: function () {
      this.helperProportions = {
        width: this.helper.outerWidth(),
        height: this.helper.outerHeight()
      }
    },
    _setContainment: function () {
      var e, i, s, n = this.options;
      "parent" === n.containment && (n.containment = this.helper[0].parentNode), ("document" === n.containment || "window" === n.containment) && (this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, "document" === n.containment ? this.document.width() : this.window.width() - this.helperProportions.width - this.margins.left, ("document" === n.containment ? this.document.width() : this.window.height() || this.document[0].body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]), /^(document|window|parent)$/.test(n.containment) || (e = t(n.containment)[0], i = t(n.containment).offset(), s = "hidden" !== t(e).css("overflow"), this.containment = [i.left + (parseInt(t(e).css("borderLeftWidth"), 10) || 0) + (parseInt(t(e).css("paddingLeft"), 10) || 0) - this.margins.left, i.top + (parseInt(t(e).css("borderTopWidth"), 10) || 0) + (parseInt(t(e).css("paddingTop"), 10) || 0) - this.margins.top, i.left + (s ? Math.max(e.scrollWidth, e.offsetWidth) : e.offsetWidth) - (parseInt(t(e).css("borderLeftWidth"), 10) || 0) - (parseInt(t(e).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, i.top + (s ? Math.max(e.scrollHeight, e.offsetHeight) : e.offsetHeight) - (parseInt(t(e).css("borderTopWidth"), 10) || 0) - (parseInt(t(e).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top])
    },
    _convertPositionTo: function (e, i) {
      i || (i = this.position);
      var s = "absolute" === e ? 1 : -1,
        n = "absolute" !== this.cssPosition || this.scrollParent[0] !== this.document[0] && t.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
        o = /(html|body)/i.test(n[0].tagName);
      return {
        top: i.top + this.offset.relative.top * s + this.offset.parent.top * s - ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : o ? 0 : n.scrollTop()) * s,
        left: i.left + this.offset.relative.left * s + this.offset.parent.left * s - ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : o ? 0 : n.scrollLeft()) * s
      }
    },
    _generatePosition: function (e) {
      var i, s, n = this.options,
        o = e.pageX,
        a = e.pageY,
        r = "absolute" !== this.cssPosition || this.scrollParent[0] !== this.document[0] && t.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
        l = /(html|body)/i.test(r[0].tagName);
      return "relative" !== this.cssPosition || this.scrollParent[0] !== this.document[0] && this.scrollParent[0] !== this.offsetParent[0] || (this.offset.relative = this._getRelativeOffset()), this.originalPosition && (this.containment && (e.pageX - this.offset.click.left < this.containment[0] && (o = this.containment[0] + this.offset.click.left), e.pageY - this.offset.click.top < this.containment[1] && (a = this.containment[1] + this.offset.click.top), e.pageX - this.offset.click.left > this.containment[2] && (o = this.containment[2] + this.offset.click.left), e.pageY - this.offset.click.top > this.containment[3] && (a = this.containment[3] + this.offset.click.top)), n.grid && (i = this.originalPageY + Math.round((a - this.originalPageY) / n.grid[1]) * n.grid[1], a = this.containment ? i - this.offset.click.top >= this.containment[1] && i - this.offset.click.top <= this.containment[3] ? i : i - this.offset.click.top >= this.containment[1] ? i - n.grid[1] : i + n.grid[1] : i, s = this.originalPageX + Math.round((o - this.originalPageX) / n.grid[0]) * n.grid[0], o = this.containment ? s - this.offset.click.left >= this.containment[0] && s - this.offset.click.left <= this.containment[2] ? s : s - this.offset.click.left >= this.containment[0] ? s - n.grid[0] : s + n.grid[0] : s)), {
        top: a - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : l ? 0 : r.scrollTop()),
        left: o - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : l ? 0 : r.scrollLeft())
      }
    },
    _rearrange: function (t, e, i, s) {
      i ? i[0].appendChild(this.placeholder[0]) : e.item[0].parentNode.insertBefore(this.placeholder[0], "down" === this.direction ? e.item[0] : e.item[0].nextSibling), this.counter = this.counter ? ++this.counter : 1;
      var n = this.counter;
      this._delay(function () {
        n === this.counter && this.refreshPositions(!s)
      })
    },
    _clear: function (t, e) {
      function i(t, e, i) {
        return function (s) {
          i._trigger(t, s, e._uiHash(e))
        }
      }
      this.reverting = !1;
      var s, n = [];
      if (!this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem), this._noFinalSort = null, this.helper[0] === this.currentItem[0]) {
        for (s in this._storedCSS)("auto" === this._storedCSS[s] || "static" === this._storedCSS[s]) && (this._storedCSS[s] = "");
        this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
      } else this.currentItem.show();
      for (this.fromOutside && !e && n.push(function (t) {
          this._trigger("receive", t, this._uiHash(this.fromOutside))
        }), !this.fromOutside && this.domPosition.prev === this.currentItem.prev().not(".ui-sortable-helper")[0] && this.domPosition.parent === this.currentItem.parent()[0] || e || n.push(function (t) {
          this._trigger("update", t, this._uiHash())
        }), this !== this.currentContainer && (e || (n.push(function (t) {
          this._trigger("remove", t, this._uiHash())
        }), n.push(function (t) {
          return function (e) {
            t._trigger("receive", e, this._uiHash(this))
          }
        }.call(this, this.currentContainer)), n.push(function (t) {
          return function (e) {
            t._trigger("update", e, this._uiHash(this))
          }
        }.call(this, this.currentContainer)))), s = this.containers.length - 1; s >= 0; s--) e || n.push(i("deactivate", this, this.containers[s])), this.containers[s].containerCache.over && (n.push(i("out", this, this.containers[s])), this.containers[s].containerCache.over = 0);
      if (this.storedCursor && (this.document.find("body").css("cursor", this.storedCursor), this.storedStylesheet.remove()), this._storedOpacity && this.helper.css("opacity", this._storedOpacity), this._storedZIndex && this.helper.css("zIndex", "auto" === this._storedZIndex ? "" : this._storedZIndex), this.dragging = !1, e || this._trigger("beforeStop", t, this._uiHash()), this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.cancelHelperRemoval || (this.helper[0] !== this.currentItem[0] && this.helper.remove(), this.helper = null), !e) {
        for (s = 0; n.length > s; s++) n[s].call(this, t);
        this._trigger("stop", t, this._uiHash())
      }
      return this.fromOutside = !1, !this.cancelHelperRemoval
    },
    _trigger: function () {
      t.Widget.prototype._trigger.apply(this, arguments) === !1 && this.cancel()
    },
    _uiHash: function (e) {
      var i = e || this;
      return {
        helper: i.helper,
        placeholder: i.placeholder || t([]),
        position: i.position,
        originalPosition: i.originalPosition,
        offset: i.positionAbs,
        item: i.currentItem,
        sender: e ? e.element : null
      }
    }
  }), t.widget("ui.slider", t.ui.mouse, {
    version: "1.11.4",
    widgetEventPrefix: "slide",
    options: {
      animate: !1,
      distance: 0,
      max: 100,
      min: 0,
      orientation: "horizontal",
      range: !1,
      step: 1,
      value: 0,
      values: null,
      change: null,
      slide: null,
      start: null,
      stop: null
    },
    numPages: 5,
    _create: function () {
      this._keySliding = !1, this._mouseSliding = !1, this._animateOff = !0, this._handleIndex = null, this._detectOrientation(), this._mouseInit(), this._calculateNewMax(), this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget" + " ui-widget-content" + " ui-corner-all"), this._refresh(), this._setOption("disabled", this.options.disabled), this._animateOff = !1
    },
    _refresh: function () {
      this._createRange(), this._createHandles(), this._setupEvents(), this._refreshValue()
    },
    _createHandles: function () {
      var e, i, s = this.options,
        n = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),
        o = "<span class='ui-slider-handle ui-state-default ui-corner-all' tabindex='0'></span>",
        a = [];
      for (i = s.values && s.values.length || 1, n.length > i && (n.slice(i).remove(), n = n.slice(0, i)), e = n.length; i > e; e++) a.push(o);
      this.handles = n.add(t(a.join("")).appendTo(this.element)), this.handle = this.handles.eq(0), this.handles.each(function (e) {
        t(this).data("ui-slider-handle-index", e)
      })
    },
    _createRange: function () {
      var e = this.options,
        i = "";
      e.range ? (e.range === !0 && (e.values ? e.values.length && 2 !== e.values.length ? e.values = [e.values[0], e.values[0]] : t.isArray(e.values) && (e.values = e.values.slice(0)) : e.values = [this._valueMin(), this._valueMin()]), this.range && this.range.length ? this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({
        left: "",
        bottom: ""
      }) : (this.range = t("<div></div>").appendTo(this.element), i = "ui-slider-range ui-widget-header ui-corner-all"), this.range.addClass(i + ("min" === e.range || "max" === e.range ? " ui-slider-range-" + e.range : ""))) : (this.range && this.range.remove(), this.range = null)
    },
    _setupEvents: function () {
      this._off(this.handles), this._on(this.handles, this._handleEvents), this._hoverable(this.handles), this._focusable(this.handles)
    },
    _destroy: function () {
      this.handles.remove(), this.range && this.range.remove(), this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all"), this._mouseDestroy()
    },
    _mouseCapture: function (e) {
      var i, s, n, o, a, r, l, h, c = this,
        u = this.options;
      return u.disabled ? !1 : (this.elementSize = {
        width: this.element.outerWidth(),
        height: this.element.outerHeight()
      }, this.elementOffset = this.element.offset(), i = {
        x: e.pageX,
        y: e.pageY
      }, s = this._normValueFromMouse(i), n = this._valueMax() - this._valueMin() + 1, this.handles.each(function (e) {
        var i = Math.abs(s - c.values(e));
        (n > i || n === i && (e === c._lastChangedValue || c.values(e) === u.min)) && (n = i, o = t(this), a = e)
      }), r = this._start(e, a), r === !1 ? !1 : (this._mouseSliding = !0, this._handleIndex = a, o.addClass("ui-state-active").focus(), l = o.offset(), h = !t(e.target).parents().addBack().is(".ui-slider-handle"), this._clickOffset = h ? {
        left: 0,
        top: 0
      } : {
        left: e.pageX - l.left - o.width() / 2,
        top: e.pageY - l.top - o.height() / 2 - (parseInt(o.css("borderTopWidth"), 10) || 0) - (parseInt(o.css("borderBottomWidth"), 10) || 0) + (parseInt(o.css("marginTop"), 10) || 0)
      }, this.handles.hasClass("ui-state-hover") || this._slide(e, a, s), this._animateOff = !0, !0))
    },
    _mouseStart: function () {
      return !0
    },
    _mouseDrag: function (t) {
      var e = {
          x: t.pageX,
          y: t.pageY
        },
        i = this._normValueFromMouse(e);
      return this._slide(t, this._handleIndex, i), !1
    },
    _mouseStop: function (t) {
      return this.handles.removeClass("ui-state-active"), this._mouseSliding = !1, this._stop(t, this._handleIndex), this._change(t, this._handleIndex), this._handleIndex = null, this._clickOffset = null, this._animateOff = !1, !1
    },
    _detectOrientation: function () {
      this.orientation = "vertical" === this.options.orientation ? "vertical" : "horizontal"
    },
    _normValueFromMouse: function (t) {
      var e, i, s, n, o;
      return "horizontal" === this.orientation ? (e = this.elementSize.width, i = t.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (e = this.elementSize.height, i = t.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)), s = i / e, s > 1 && (s = 1), 0 > s && (s = 0), "vertical" === this.orientation && (s = 1 - s), n = this._valueMax() - this._valueMin(), o = this._valueMin() + s * n, this._trimAlignValue(o)
    },
    _start: function (t, e) {
      var i = {
        handle: this.handles[e],
        value: this.value()
      };
      return this.options.values && this.options.values.length && (i.value = this.values(e), i.values = this.values()), this._trigger("start", t, i)
    },
    _slide: function (t, e, i) {
      var s, n, o;
      this.options.values && this.options.values.length ? (s = this.values(e ? 0 : 1), 2 === this.options.values.length && this.options.range === !0 && (0 === e && i > s || 1 === e && s > i) && (i = s), i !== this.values(e) && (n = this.values(), n[e] = i, o = this._trigger("slide", t, {
        handle: this.handles[e],
        value: i,
        values: n
      }), s = this.values(e ? 0 : 1), o !== !1 && this.values(e, i))) : i !== this.value() && (o = this._trigger("slide", t, {
        handle: this.handles[e],
        value: i
      }), o !== !1 && this.value(i))
    },
    _stop: function (t, e) {
      var i = {
        handle: this.handles[e],
        value: this.value()
      };
      this.options.values && this.options.values.length && (i.value = this.values(e), i.values = this.values()), this._trigger("stop", t, i)
    },
    _change: function (t, e) {
      if (!this._keySliding && !this._mouseSliding) {
        var i = {
          handle: this.handles[e],
          value: this.value()
        };
        this.options.values && this.options.values.length && (i.value = this.values(e), i.values = this.values()), this._lastChangedValue = e, this._trigger("change", t, i)
      }
    },
    value: function (t) {
      return arguments.length ? (this.options.value = this._trimAlignValue(t), this._refreshValue(), this._change(null, 0), void 0) : this._value()
    },
    values: function (e, i) {
      var s, n, o;
      if (arguments.length > 1) return this.options.values[e] = this._trimAlignValue(i), this._refreshValue(), this._change(null, e), void 0;
      if (!arguments.length) return this._values();
      if (!t.isArray(arguments[0])) return this.options.values && this.options.values.length ? this._values(e) : this.value();
      for (s = this.options.values, n = arguments[0], o = 0; s.length > o; o += 1) s[o] = this._trimAlignValue(n[o]), this._change(null, o);
      this._refreshValue()
    },
    _setOption: function (e, i) {
      var s, n = 0;
      switch ("range" === e && this.options.range === !0 && ("min" === i ? (this.options.value = this._values(0), this.options.values = null) : "max" === i && (this.options.value = this._values(this.options.values.length - 1), this.options.values = null)), t.isArray(this.options.values) && (n = this.options.values.length), "disabled" === e && this.element.toggleClass("ui-state-disabled", !!i), this._super(e, i), e) {
        case "orientation":
          this._detectOrientation(), this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation), this._refreshValue(), this.handles.css("horizontal" === i ? "bottom" : "left", "");
          break;
        case "value":
          this._animateOff = !0, this._refreshValue(), this._change(null, 0), this._animateOff = !1;
          break;
        case "values":
          for (this._animateOff = !0, this._refreshValue(), s = 0; n > s; s += 1) this._change(null, s);
          this._animateOff = !1;
          break;
        case "step":
        case "min":
        case "max":
          this._animateOff = !0, this._calculateNewMax(), this._refreshValue(), this._animateOff = !1;
          break;
        case "range":
          this._animateOff = !0, this._refresh(), this._animateOff = !1
      }
    },
    _value: function () {
      var t = this.options.value;
      return t = this._trimAlignValue(t)
    },
    _values: function (t) {
      var e, i, s;
      if (arguments.length) return e = this.options.values[t], e = this._trimAlignValue(e);
      if (this.options.values && this.options.values.length) {
        for (i = this.options.values.slice(), s = 0; i.length > s; s += 1) i[s] = this._trimAlignValue(i[s]);
        return i
      }
      return []
    },
    _trimAlignValue: function (t) {
      if (this._valueMin() >= t) return this._valueMin();
      if (t >= this._valueMax()) return this._valueMax();
      var e = this.options.step > 0 ? this.options.step : 1,
        i = (t - this._valueMin()) % e,
        s = t - i;
      return 2 * Math.abs(i) >= e && (s += i > 0 ? e : -e), parseFloat(s.toFixed(5))
    },
    _calculateNewMax: function () {
      var t = this.options.max,
        e = this._valueMin(),
        i = this.options.step,
        s = Math.floor(+(t - e).toFixed(this._precision()) / i) * i;
      t = s + e, this.max = parseFloat(t.toFixed(this._precision()))
    },
    _precision: function () {
      var t = this._precisionOf(this.options.step);
      return null !== this.options.min && (t = Math.max(t, this._precisionOf(this.options.min))), t
    },
    _precisionOf: function (t) {
      var e = "" + t,
        i = e.indexOf(".");
      return -1 === i ? 0 : e.length - i - 1
    },
    _valueMin: function () {
      return this.options.min
    },
    _valueMax: function () {
      return this.max
    },
    _refreshValue: function () {
      var e, i, s, n, o, a = this.options.range,
        r = this.options,
        l = this,
        h = this._animateOff ? !1 : r.animate,
        c = {};
      this.options.values && this.options.values.length ? this.handles.each(function (s) {
        i = 100 * ((l.values(s) - l._valueMin()) / (l._valueMax() - l._valueMin())), c["horizontal" === l.orientation ? "left" : "bottom"] = i + "%", t(this).stop(1, 1)[h ? "animate" : "css"](c, r.animate), l.options.range === !0 && ("horizontal" === l.orientation ? (0 === s && l.range.stop(1, 1)[h ? "animate" : "css"]({
          left: i + "%"
        }, r.animate), 1 === s && l.range[h ? "animate" : "css"]({
          width: i - e + "%"
        }, {
          queue: !1,
          duration: r.animate
        })) : (0 === s && l.range.stop(1, 1)[h ? "animate" : "css"]({
          bottom: i + "%"
        }, r.animate), 1 === s && l.range[h ? "animate" : "css"]({
          height: i - e + "%"
        }, {
          queue: !1,
          duration: r.animate
        }))), e = i
      }) : (s = this.value(), n = this._valueMin(), o = this._valueMax(), i = o !== n ? 100 * ((s - n) / (o - n)) : 0, c["horizontal" === this.orientation ? "left" : "bottom"] = i + "%", this.handle.stop(1, 1)[h ? "animate" : "css"](c, r.animate), "min" === a && "horizontal" === this.orientation && this.range.stop(1, 1)[h ? "animate" : "css"]({
        width: i + "%"
      }, r.animate), "max" === a && "horizontal" === this.orientation && this.range[h ? "animate" : "css"]({
        width: 100 - i + "%"
      }, {
        queue: !1,
        duration: r.animate
      }), "min" === a && "vertical" === this.orientation && this.range.stop(1, 1)[h ? "animate" : "css"]({
        height: i + "%"
      }, r.animate), "max" === a && "vertical" === this.orientation && this.range[h ? "animate" : "css"]({
        height: 100 - i + "%"
      }, {
        queue: !1,
        duration: r.animate
      }))
    },
    _handleEvents: {
      keydown: function (e) {
        var i, s, n, o, a = t(e.target).data("ui-slider-handle-index");
        switch (e.keyCode) {
          case t.ui.keyCode.HOME:
          case t.ui.keyCode.END:
          case t.ui.keyCode.PAGE_UP:
          case t.ui.keyCode.PAGE_DOWN:
          case t.ui.keyCode.UP:
          case t.ui.keyCode.RIGHT:
          case t.ui.keyCode.DOWN:
          case t.ui.keyCode.LEFT:
            if (e.preventDefault(), !this._keySliding && (this._keySliding = !0, t(e.target).addClass("ui-state-active"), i = this._start(e, a), i === !1)) return
        }
        switch (o = this.options.step, s = n = this.options.values && this.options.values.length ? this.values(a) : this.value(), e.keyCode) {
          case t.ui.keyCode.HOME:
            n = this._valueMin();
            break;
          case t.ui.keyCode.END:
            n = this._valueMax();
            break;
          case t.ui.keyCode.PAGE_UP:
            n = this._trimAlignValue(s + (this._valueMax() - this._valueMin()) / this.numPages);
            break;
          case t.ui.keyCode.PAGE_DOWN:
            n = this._trimAlignValue(s - (this._valueMax() - this._valueMin()) / this.numPages);
            break;
          case t.ui.keyCode.UP:
          case t.ui.keyCode.RIGHT:
            if (s === this._valueMax()) return;
            n = this._trimAlignValue(s + o);
            break;
          case t.ui.keyCode.DOWN:
          case t.ui.keyCode.LEFT:
            if (s === this._valueMin()) return;
            n = this._trimAlignValue(s - o)
        }
        this._slide(e, a, n)
      },
      keyup: function (e) {
        var i = t(e.target).data("ui-slider-handle-index");
        this._keySliding && (this._keySliding = !1, this._stop(e, i), this._change(e, i), t(e.target).removeClass("ui-state-active"))
      }
    }
  })
});
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function () {
  function n(n) {
    function t(t, r, e, u, i, o) {
      for (; i >= 0 && o > i; i += n) {
        var a = u ? u[i] : i;
        e = r(e, t[a], a, t)
      }
      return e
    }
    return function (r, e, u, i) {
      e = b(e, i, 4);
      var o = !k(r) && m.keys(r),
        a = (o || r).length,
        c = n > 0 ? 0 : a - 1;
      return arguments.length < 3 && (u = r[o ? o[c] : c], c += n), t(r, e, u, o, c, a)
    }
  }

  function t(n) {
    return function (t, r, e) {
      r = x(r, e);
      for (var u = O(t), i = n > 0 ? 0 : u - 1; i >= 0 && u > i; i += n)
        if (r(t[i], i, t)) return i;
      return -1
    }
  }

  function r(n, t, r) {
    return function (e, u, i) {
      var o = 0,
        a = O(e);
      if ("number" == typeof i) n > 0 ? o = i >= 0 ? i : Math.max(i + a, o) : a = i >= 0 ? Math.min(i + 1, a) : i + a + 1;
      else if (r && i && a) return i = r(e, u), e[i] === u ? i : -1;
      if (u !== u) return i = t(l.call(e, o, a), m.isNaN), i >= 0 ? i + o : -1;
      for (i = n > 0 ? o : a - 1; i >= 0 && a > i; i += n)
        if (e[i] === u) return i;
      return -1
    }
  }

  function e(n, t) {
    var r = I.length,
      e = n.constructor,
      u = m.isFunction(e) && e.prototype || a,
      i = "constructor";
    for (m.has(n, i) && !m.contains(t, i) && t.push(i); r--;) i = I[r], i in n && n[i] !== u[i] && !m.contains(t, i) && t.push(i)
  }
  var u = this,
    i = u._,
    o = Array.prototype,
    a = Object.prototype,
    c = Function.prototype,
    f = o.push,
    l = o.slice,
    s = a.toString,
    p = a.hasOwnProperty,
    h = Array.isArray,
    v = Object.keys,
    g = c.bind,
    y = Object.create,
    d = function () {},
    m = function (n) {
      return n instanceof m ? n : this instanceof m ? void(this._wrapped = n) : new m(n)
    };
  "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = m), exports._ = m) : u._ = m, m.VERSION = "1.8.3";
  var b = function (n, t, r) {
      if (t === void 0) return n;
      switch (null == r ? 3 : r) {
        case 1:
          return function (r) {
            return n.call(t, r)
          };
        case 2:
          return function (r, e) {
            return n.call(t, r, e)
          };
        case 3:
          return function (r, e, u) {
            return n.call(t, r, e, u)
          };
        case 4:
          return function (r, e, u, i) {
            return n.call(t, r, e, u, i)
          }
      }
      return function () {
        return n.apply(t, arguments)
      }
    },
    x = function (n, t, r) {
      return null == n ? m.identity : m.isFunction(n) ? b(n, t, r) : m.isObject(n) ? m.matcher(n) : m.property(n)
    };
  m.iteratee = function (n, t) {
    return x(n, t, 1 / 0)
  };
  var _ = function (n, t) {
      return function (r) {
        var e = arguments.length;
        if (2 > e || null == r) return r;
        for (var u = 1; e > u; u++)
          for (var i = arguments[u], o = n(i), a = o.length, c = 0; a > c; c++) {
            var f = o[c];
            t && r[f] !== void 0 || (r[f] = i[f])
          }
        return r
      }
    },
    j = function (n) {
      if (!m.isObject(n)) return {};
      if (y) return y(n);
      d.prototype = n;
      var t = new d;
      return d.prototype = null, t
    },
    w = function (n) {
      return function (t) {
        return null == t ? void 0 : t[n]
      }
    },
    A = Math.pow(2, 53) - 1,
    O = w("length"),
    k = function (n) {
      var t = O(n);
      return "number" == typeof t && t >= 0 && A >= t
    };
  m.each = m.forEach = function (n, t, r) {
    t = b(t, r);
    var e, u;
    if (k(n))
      for (e = 0, u = n.length; u > e; e++) t(n[e], e, n);
    else {
      var i = m.keys(n);
      for (e = 0, u = i.length; u > e; e++) t(n[i[e]], i[e], n)
    }
    return n
  }, m.map = m.collect = function (n, t, r) {
    t = x(t, r);
    for (var e = !k(n) && m.keys(n), u = (e || n).length, i = Array(u), o = 0; u > o; o++) {
      var a = e ? e[o] : o;
      i[o] = t(n[a], a, n)
    }
    return i
  }, m.reduce = m.foldl = m.inject = n(1), m.reduceRight = m.foldr = n(-1), m.find = m.detect = function (n, t, r) {
    var e;
    return e = k(n) ? m.findIndex(n, t, r) : m.findKey(n, t, r), e !== void 0 && e !== -1 ? n[e] : void 0
  }, m.filter = m.select = function (n, t, r) {
    var e = [];
    return t = x(t, r), m.each(n, function (n, r, u) {
      t(n, r, u) && e.push(n)
    }), e
  }, m.reject = function (n, t, r) {
    return m.filter(n, m.negate(x(t)), r)
  }, m.every = m.all = function (n, t, r) {
    t = x(t, r);
    for (var e = !k(n) && m.keys(n), u = (e || n).length, i = 0; u > i; i++) {
      var o = e ? e[i] : i;
      if (!t(n[o], o, n)) return !1
    }
    return !0
  }, m.some = m.any = function (n, t, r) {
    t = x(t, r);
    for (var e = !k(n) && m.keys(n), u = (e || n).length, i = 0; u > i; i++) {
      var o = e ? e[i] : i;
      if (t(n[o], o, n)) return !0
    }
    return !1
  }, m.contains = m.includes = m.include = function (n, t, r, e) {
    return k(n) || (n = m.values(n)), ("number" != typeof r || e) && (r = 0), m.indexOf(n, t, r) >= 0
  }, m.invoke = function (n, t) {
    var r = l.call(arguments, 2),
      e = m.isFunction(t);
    return m.map(n, function (n) {
      var u = e ? t : n[t];
      return null == u ? u : u.apply(n, r)
    })
  }, m.pluck = function (n, t) {
    return m.map(n, m.property(t))
  }, m.where = function (n, t) {
    return m.filter(n, m.matcher(t))
  }, m.findWhere = function (n, t) {
    return m.find(n, m.matcher(t))
  }, m.max = function (n, t, r) {
    var e, u, i = -1 / 0,
      o = -1 / 0;
    if (null == t && null != n) {
      n = k(n) ? n : m.values(n);
      for (var a = 0, c = n.length; c > a; a++) e = n[a], e > i && (i = e)
    } else t = x(t, r), m.each(n, function (n, r, e) {
      u = t(n, r, e), (u > o || u === -1 / 0 && i === -1 / 0) && (i = n, o = u)
    });
    return i
  }, m.min = function (n, t, r) {
    var e, u, i = 1 / 0,
      o = 1 / 0;
    if (null == t && null != n) {
      n = k(n) ? n : m.values(n);
      for (var a = 0, c = n.length; c > a; a++) e = n[a], i > e && (i = e)
    } else t = x(t, r), m.each(n, function (n, r, e) {
      u = t(n, r, e), (o > u || 1 / 0 === u && 1 / 0 === i) && (i = n, o = u)
    });
    return i
  }, m.shuffle = function (n) {
    for (var t, r = k(n) ? n : m.values(n), e = r.length, u = Array(e), i = 0; e > i; i++) t = m.random(0, i), t !== i && (u[i] = u[t]), u[t] = r[i];
    return u
  }, m.sample = function (n, t, r) {
    return null == t || r ? (k(n) || (n = m.values(n)), n[m.random(n.length - 1)]) : m.shuffle(n).slice(0, Math.max(0, t))
  }, m.sortBy = function (n, t, r) {
    return t = x(t, r), m.pluck(m.map(n, function (n, r, e) {
      return {
        value: n,
        index: r,
        criteria: t(n, r, e)
      }
    }).sort(function (n, t) {
      var r = n.criteria,
        e = t.criteria;
      if (r !== e) {
        if (r > e || r === void 0) return 1;
        if (e > r || e === void 0) return -1
      }
      return n.index - t.index
    }), "value")
  };
  var F = function (n) {
    return function (t, r, e) {
      var u = {};
      return r = x(r, e), m.each(t, function (e, i) {
        var o = r(e, i, t);
        n(u, e, o)
      }), u
    }
  };
  m.groupBy = F(function (n, t, r) {
    m.has(n, r) ? n[r].push(t) : n[r] = [t]
  }), m.indexBy = F(function (n, t, r) {
    n[r] = t
  }), m.countBy = F(function (n, t, r) {
    m.has(n, r) ? n[r]++ : n[r] = 1
  }), m.toArray = function (n) {
    return n ? m.isArray(n) ? l.call(n) : k(n) ? m.map(n, m.identity) : m.values(n) : []
  }, m.size = function (n) {
    return null == n ? 0 : k(n) ? n.length : m.keys(n).length
  }, m.partition = function (n, t, r) {
    t = x(t, r);
    var e = [],
      u = [];
    return m.each(n, function (n, r, i) {
      (t(n, r, i) ? e : u).push(n)
    }), [e, u]
  }, m.first = m.head = m.take = function (n, t, r) {
    return null == n ? void 0 : null == t || r ? n[0] : m.initial(n, n.length - t)
  }, m.initial = function (n, t, r) {
    return l.call(n, 0, Math.max(0, n.length - (null == t || r ? 1 : t)))
  }, m.last = function (n, t, r) {
    return null == n ? void 0 : null == t || r ? n[n.length - 1] : m.rest(n, Math.max(0, n.length - t))
  }, m.rest = m.tail = m.drop = function (n, t, r) {
    return l.call(n, null == t || r ? 1 : t)
  }, m.compact = function (n) {
    return m.filter(n, m.identity)
  };
  var S = function (n, t, r, e) {
    for (var u = [], i = 0, o = e || 0, a = O(n); a > o; o++) {
      var c = n[o];
      if (k(c) && (m.isArray(c) || m.isArguments(c))) {
        t || (c = S(c, t, r));
        var f = 0,
          l = c.length;
        for (u.length += l; l > f;) u[i++] = c[f++]
      } else r || (u[i++] = c)
    }
    return u
  };
  m.flatten = function (n, t) {
    return S(n, t, !1)
  }, m.without = function (n) {
    return m.difference(n, l.call(arguments, 1))
  }, m.uniq = m.unique = function (n, t, r, e) {
    m.isBoolean(t) || (e = r, r = t, t = !1), null != r && (r = x(r, e));
    for (var u = [], i = [], o = 0, a = O(n); a > o; o++) {
      var c = n[o],
        f = r ? r(c, o, n) : c;
      t ? (o && i === f || u.push(c), i = f) : r ? m.contains(i, f) || (i.push(f), u.push(c)) : m.contains(u, c) || u.push(c)
    }
    return u
  }, m.union = function () {
    return m.uniq(S(arguments, !0, !0))
  }, m.intersection = function (n) {
    for (var t = [], r = arguments.length, e = 0, u = O(n); u > e; e++) {
      var i = n[e];
      if (!m.contains(t, i)) {
        for (var o = 1; r > o && m.contains(arguments[o], i); o++);
        o === r && t.push(i)
      }
    }
    return t
  }, m.difference = function (n) {
    var t = S(arguments, !0, !0, 1);
    return m.filter(n, function (n) {
      return !m.contains(t, n)
    })
  }, m.zip = function () {
    return m.unzip(arguments)
  }, m.unzip = function (n) {
    for (var t = n && m.max(n, O).length || 0, r = Array(t), e = 0; t > e; e++) r[e] = m.pluck(n, e);
    return r
  }, m.object = function (n, t) {
    for (var r = {}, e = 0, u = O(n); u > e; e++) t ? r[n[e]] = t[e] : r[n[e][0]] = n[e][1];
    return r
  }, m.findIndex = t(1), m.findLastIndex = t(-1), m.sortedIndex = function (n, t, r, e) {
    r = x(r, e, 1);
    for (var u = r(t), i = 0, o = O(n); o > i;) {
      var a = Math.floor((i + o) / 2);
      r(n[a]) < u ? i = a + 1 : o = a
    }
    return i
  }, m.indexOf = r(1, m.findIndex, m.sortedIndex), m.lastIndexOf = r(-1, m.findLastIndex), m.range = function (n, t, r) {
    null == t && (t = n || 0, n = 0), r = r || 1;
    for (var e = Math.max(Math.ceil((t - n) / r), 0), u = Array(e), i = 0; e > i; i++, n += r) u[i] = n;
    return u
  };
  var E = function (n, t, r, e, u) {
    if (!(e instanceof t)) return n.apply(r, u);
    var i = j(n.prototype),
      o = n.apply(i, u);
    return m.isObject(o) ? o : i
  };
  m.bind = function (n, t) {
    if (g && n.bind === g) return g.apply(n, l.call(arguments, 1));
    if (!m.isFunction(n)) throw new TypeError("Bind must be called on a function");
    var r = l.call(arguments, 2),
      e = function () {
        return E(n, e, t, this, r.concat(l.call(arguments)))
      };
    return e
  }, m.partial = function (n) {
    var t = l.call(arguments, 1),
      r = function () {
        for (var e = 0, u = t.length, i = Array(u), o = 0; u > o; o++) i[o] = t[o] === m ? arguments[e++] : t[o];
        for (; e < arguments.length;) i.push(arguments[e++]);
        return E(n, r, this, this, i)
      };
    return r
  }, m.bindAll = function (n) {
    var t, r, e = arguments.length;
    if (1 >= e) throw new Error("bindAll must be passed function names");
    for (t = 1; e > t; t++) r = arguments[t], n[r] = m.bind(n[r], n);
    return n
  }, m.memoize = function (n, t) {
    var r = function (e) {
      var u = r.cache,
        i = "" + (t ? t.apply(this, arguments) : e);
      return m.has(u, i) || (u[i] = n.apply(this, arguments)), u[i]
    };
    return r.cache = {}, r
  }, m.delay = function (n, t) {
    var r = l.call(arguments, 2);
    return setTimeout(function () {
      return n.apply(null, r)
    }, t)
  }, m.defer = m.partial(m.delay, m, 1), m.throttle = function (n, t, r) {
    var e, u, i, o = null,
      a = 0;
    r || (r = {});
    var c = function () {
      a = r.leading === !1 ? 0 : m.now(), o = null, i = n.apply(e, u), o || (e = u = null)
    };
    return function () {
      var f = m.now();
      a || r.leading !== !1 || (a = f);
      var l = t - (f - a);
      return e = this, u = arguments, 0 >= l || l > t ? (o && (clearTimeout(o), o = null), a = f, i = n.apply(e, u), o || (e = u = null)) : o || r.trailing === !1 || (o = setTimeout(c, l)), i
    }
  }, m.debounce = function (n, t, r) {
    var e, u, i, o, a, c = function () {
      var f = m.now() - o;
      t > f && f >= 0 ? e = setTimeout(c, t - f) : (e = null, r || (a = n.apply(i, u), e || (i = u = null)))
    };
    return function () {
      i = this, u = arguments, o = m.now();
      var f = r && !e;
      return e || (e = setTimeout(c, t)), f && (a = n.apply(i, u), i = u = null), a
    }
  }, m.wrap = function (n, t) {
    return m.partial(t, n)
  }, m.negate = function (n) {
    return function () {
      return !n.apply(this, arguments)
    }
  }, m.compose = function () {
    var n = arguments,
      t = n.length - 1;
    return function () {
      for (var r = t, e = n[t].apply(this, arguments); r--;) e = n[r].call(this, e);
      return e
    }
  }, m.after = function (n, t) {
    return function () {
      return --n < 1 ? t.apply(this, arguments) : void 0
    }
  }, m.before = function (n, t) {
    var r;
    return function () {
      return --n > 0 && (r = t.apply(this, arguments)), 1 >= n && (t = null), r
    }
  }, m.once = m.partial(m.before, 2);
  var M = !{
      toString: null
    }.propertyIsEnumerable("toString"),
    I = ["valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
  m.keys = function (n) {
    if (!m.isObject(n)) return [];
    if (v) return v(n);
    var t = [];
    for (var r in n) m.has(n, r) && t.push(r);
    return M && e(n, t), t
  }, m.allKeys = function (n) {
    if (!m.isObject(n)) return [];
    var t = [];
    for (var r in n) t.push(r);
    return M && e(n, t), t
  }, m.values = function (n) {
    for (var t = m.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++) e[u] = n[t[u]];
    return e
  }, m.mapObject = function (n, t, r) {
    t = x(t, r);
    for (var e, u = m.keys(n), i = u.length, o = {}, a = 0; i > a; a++) e = u[a], o[e] = t(n[e], e, n);
    return o
  }, m.pairs = function (n) {
    for (var t = m.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++) e[u] = [t[u], n[t[u]]];
    return e
  }, m.invert = function (n) {
    for (var t = {}, r = m.keys(n), e = 0, u = r.length; u > e; e++) t[n[r[e]]] = r[e];
    return t
  }, m.functions = m.methods = function (n) {
    var t = [];
    for (var r in n) m.isFunction(n[r]) && t.push(r);
    return t.sort()
  }, m.extend = _(m.allKeys), m.extendOwn = m.assign = _(m.keys), m.findKey = function (n, t, r) {
    t = x(t, r);
    for (var e, u = m.keys(n), i = 0, o = u.length; o > i; i++)
      if (e = u[i], t(n[e], e, n)) return e
  }, m.pick = function (n, t, r) {
    var e, u, i = {},
      o = n;
    if (null == o) return i;
    m.isFunction(t) ? (u = m.allKeys(o), e = b(t, r)) : (u = S(arguments, !1, !1, 1), e = function (n, t, r) {
      return t in r
    }, o = Object(o));
    for (var a = 0, c = u.length; c > a; a++) {
      var f = u[a],
        l = o[f];
      e(l, f, o) && (i[f] = l)
    }
    return i
  }, m.omit = function (n, t, r) {
    if (m.isFunction(t)) t = m.negate(t);
    else {
      var e = m.map(S(arguments, !1, !1, 1), String);
      t = function (n, t) {
        return !m.contains(e, t)
      }
    }
    return m.pick(n, t, r)
  }, m.defaults = _(m.allKeys, !0), m.create = function (n, t) {
    var r = j(n);
    return t && m.extendOwn(r, t), r
  }, m.clone = function (n) {
    return m.isObject(n) ? m.isArray(n) ? n.slice() : m.extend({}, n) : n
  }, m.tap = function (n, t) {
    return t(n), n
  }, m.isMatch = function (n, t) {
    var r = m.keys(t),
      e = r.length;
    if (null == n) return !e;
    for (var u = Object(n), i = 0; e > i; i++) {
      var o = r[i];
      if (t[o] !== u[o] || !(o in u)) return !1
    }
    return !0
  };
  var N = function (n, t, r, e) {
    if (n === t) return 0 !== n || 1 / n === 1 / t;
    if (null == n || null == t) return n === t;
    n instanceof m && (n = n._wrapped), t instanceof m && (t = t._wrapped);
    var u = s.call(n);
    if (u !== s.call(t)) return !1;
    switch (u) {
      case "[object RegExp]":
      case "[object String]":
        return "" + n == "" + t;
      case "[object Number]":
        return +n !== +n ? +t !== +t : 0 === +n ? 1 / +n === 1 / t : +n === +t;
      case "[object Date]":
      case "[object Boolean]":
        return +n === +t
    }
    var i = "[object Array]" === u;
    if (!i) {
      if ("object" != typeof n || "object" != typeof t) return !1;
      var o = n.constructor,
        a = t.constructor;
      if (o !== a && !(m.isFunction(o) && o instanceof o && m.isFunction(a) && a instanceof a) && "constructor" in n && "constructor" in t) return !1
    }
    r = r || [], e = e || [];
    for (var c = r.length; c--;)
      if (r[c] === n) return e[c] === t;
    if (r.push(n), e.push(t), i) {
      if (c = n.length, c !== t.length) return !1;
      for (; c--;)
        if (!N(n[c], t[c], r, e)) return !1
    } else {
      var f, l = m.keys(n);
      if (c = l.length, m.keys(t).length !== c) return !1;
      for (; c--;)
        if (f = l[c], !m.has(t, f) || !N(n[f], t[f], r, e)) return !1
    }
    return r.pop(), e.pop(), !0
  };
  m.isEqual = function (n, t) {
    return N(n, t)
  }, m.isEmpty = function (n) {
    return null == n ? !0 : k(n) && (m.isArray(n) || m.isString(n) || m.isArguments(n)) ? 0 === n.length : 0 === m.keys(n).length
  }, m.isElement = function (n) {
    return !(!n || 1 !== n.nodeType)
  }, m.isArray = h || function (n) {
    return "[object Array]" === s.call(n)
  }, m.isObject = function (n) {
    var t = typeof n;
    return "function" === t || "object" === t && !!n
  }, m.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"], function (n) {
    m["is" + n] = function (t) {
      return s.call(t) === "[object " + n + "]"
    }
  }), m.isArguments(arguments) || (m.isArguments = function (n) {
    return m.has(n, "callee")
  }), "function" != typeof /./ && "object" != typeof Int8Array && (m.isFunction = function (n) {
    return "function" == typeof n || !1
  }), m.isFinite = function (n) {
    return isFinite(n) && !isNaN(parseFloat(n))
  }, m.isNaN = function (n) {
    return m.isNumber(n) && n !== +n
  }, m.isBoolean = function (n) {
    return n === !0 || n === !1 || "[object Boolean]" === s.call(n)
  }, m.isNull = function (n) {
    return null === n
  }, m.isUndefined = function (n) {
    return n === void 0
  }, m.has = function (n, t) {
    return null != n && p.call(n, t)
  }, m.noConflict = function () {
    return u._ = i, this
  }, m.identity = function (n) {
    return n
  }, m.constant = function (n) {
    return function () {
      return n
    }
  }, m.noop = function () {}, m.property = w, m.propertyOf = function (n) {
    return null == n ? function () {} : function (t) {
      return n[t]
    }
  }, m.matcher = m.matches = function (n) {
    return n = m.extendOwn({}, n),
      function (t) {
        return m.isMatch(t, n)
      }
  }, m.times = function (n, t, r) {
    var e = Array(Math.max(0, n));
    t = b(t, r, 1);
    for (var u = 0; n > u; u++) e[u] = t(u);
    return e
  }, m.random = function (n, t) {
    return null == t && (t = n, n = 0), n + Math.floor(Math.random() * (t - n + 1))
  }, m.now = Date.now || function () {
    return (new Date).getTime()
  };
  var B = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "`": "&#x60;"
    },
    T = m.invert(B),
    R = function (n) {
      var t = function (t) {
          return n[t]
        },
        r = "(?:" + m.keys(n).join("|") + ")",
        e = RegExp(r),
        u = RegExp(r, "g");
      return function (n) {
        return n = null == n ? "" : "" + n, e.test(n) ? n.replace(u, t) : n
      }
    };
  m.escape = R(B), m.unescape = R(T), m.result = function (n, t, r) {
    var e = null == n ? void 0 : n[t];
    return e === void 0 && (e = r), m.isFunction(e) ? e.call(n) : e
  };
  var q = 0;
  m.uniqueId = function (n) {
    var t = ++q + "";
    return n ? n + t : t
  }, m.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };
  var K = /(.)^/,
    z = {
      "'": "'",
      "\\": "\\",
      "\r": "r",
      "\n": "n",
      "\u2028": "u2028",
      "\u2029": "u2029"
    },
    D = /\\|'|\r|\n|\u2028|\u2029/g,
    L = function (n) {
      return "\\" + z[n]
    };
  m.template = function (n, t, r) {
    !t && r && (t = r), t = m.defaults({}, t, m.templateSettings);
    var e = RegExp([(t.escape || K).source, (t.interpolate || K).source, (t.evaluate || K).source].join("|") + "|$", "g"),
      u = 0,
      i = "__p+='";
    n.replace(e, function (t, r, e, o, a) {
      return i += n.slice(u, a).replace(D, L), u = a + t.length, r ? i += "'+\n((__t=(" + r + "))==null?'':_.escape(__t))+\n'" : e ? i += "'+\n((__t=(" + e + "))==null?'':__t)+\n'" : o && (i += "';\n" + o + "\n__p+='"), t
    }), i += "';\n", t.variable || (i = "with(obj||{}){\n" + i + "}\n"), i = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + i + "return __p;\n";
    try {
      var o = new Function(t.variable || "obj", "_", i)
    } catch (a) {
      throw a.source = i, a
    }
    var c = function (n) {
        return o.call(this, n, m)
      },
      f = t.variable || "obj";
    return c.source = "function(" + f + "){\n" + i + "}", c
  }, m.chain = function (n) {
    var t = m(n);
    return t._chain = !0, t
  };
  var P = function (n, t) {
    return n._chain ? m(t).chain() : t
  };
  m.mixin = function (n) {
    m.each(m.functions(n), function (t) {
      var r = m[t] = n[t];
      m.prototype[t] = function () {
        var n = [this._wrapped];
        return f.apply(n, arguments), P(this, r.apply(m, n))
      }
    })
  }, m.mixin(m), m.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (n) {
    var t = o[n];
    m.prototype[n] = function () {
      var r = this._wrapped;
      return t.apply(r, arguments), "shift" !== n && "splice" !== n || 0 !== r.length || delete r[0], P(this, r)
    }
  }), m.each(["concat", "join", "slice"], function (n) {
    var t = o[n];
    m.prototype[n] = function () {
      return P(this, t.apply(this._wrapped, arguments))
    }
  }), m.prototype.value = function () {
    return this._wrapped
  }, m.prototype.valueOf = m.prototype.toJSON = m.prototype.value, m.prototype.toString = function () {
    return "" + this._wrapped
  }, "function" == typeof define && define.amd && define("underscore", [], function () {
    return m
  })
}).call(this);
//# sourceMappingURL=underscore-min.map
/**
 * gridstack.js 0.2.7-dev
 * http://troolee.github.io/gridstack.js/
 * (c) 2014-2016 Pavel Reznikov, Dylan Weiss
 * gridstack.js may be freely distributed under the MIT license.
 * @preserve
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'lodash'], factory);
  } else if (typeof exports !== 'undefined') {
    try {
      jQuery = require('jquery');
    } catch (e) {}
    try {
      _ = require('lodash');
    } catch (e) {}
    factory(jQuery, _);
  } else {
    factory(jQuery, _);
  }
})(function ($, _) {

  var scope = window;

  var obsolete = function (f, oldName, newName) {
    var wrapper = function () {
      console.warn('gridstack.js: Function `' + oldName + '` is deprecated as of v0.2.5 and has been replaced ' +
        'with `' + newName + '`. It will be **completely** removed in v1.0.');
      return f.apply(this, arguments);
    };
    wrapper.prototype = f.prototype;

    return wrapper;
  };

  var obsoleteOpts = function (oldName, newName) {
    console.warn('gridstack.js: Option `' + oldName + '` is deprecated as of v0.2.5 and has been replaced with `' +
      newName + '`. It will be **completely** removed in v1.0.');
  };

  var Utils = {
    isIntercepted: function (a, b) {
      return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
    },

    sort: function (nodes, dir, width) {
      width = width || _.chain(nodes).map(function (node) {
        return node.x + node.width;
      }).max().value();
      dir = dir != -1 ? 1 : -1;
      return _.sortBy(nodes, function (n) {
        return dir * (n.x + n.y * width);
      });
    },

    createStylesheet: function (id) {
      var style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.setAttribute('data-gs-style-id', id);
      if (style.styleSheet) {
        style.styleSheet.cssText = '';
      } else {
        style.appendChild(document.createTextNode(''));
      }
      document.getElementsByTagName('head')[0].appendChild(style);
      return style.sheet;
    },

    removeStylesheet: function (id) {
      $('STYLE[data-gs-style-id=' + id + ']').remove();
    },

    insertCSSRule: function (sheet, selector, rules, index) {
      if (typeof sheet.insertRule === 'function') {
        sheet.insertRule(selector + '{' + rules + '}', index);
      } else if (typeof sheet.addRule === 'function') {
        sheet.addRule(selector, rules, index);
      }
    },

    toBool: function (v) {
      if (typeof v == 'boolean') {
        return v;
      }
      if (typeof v == 'string') {
        v = v.toLowerCase();
        return !(v === '' || v == 'no' || v == 'false' || v == '0');
      }
      return Boolean(v);
    },

    _collisionNodeCheck: function (n) {
      return n != this.node && Utils.isIntercepted(n, this.nn);
    },

    _didCollide: function (bn) {
      return Utils.isIntercepted({
        x: this.n.x,
        y: this.newY,
        width: this.n.width,
        height: this.n.height
      }, bn);
    },

    _isAddNodeIntercepted: function (n) {
      return Utils.isIntercepted({
        x: this.x,
        y: this.y,
        width: this.node.width,
        height: this.node.height
      }, n);
    },

    parseHeight: function (val) {
      var height = val;
      var heightUnit = 'px';
      if (height && _.isString(height)) {
        var match = height.match(/^(-[0-9]+\.[0-9]+|[0-9]*\.[0-9]+|-[0-9]+|[0-9]+)(px|em|rem|vh|vw)?$/);
        if (!match) {
          throw new Error('Invalid height');
        }
        heightUnit = match[2] || 'px';
        height = parseFloat(match[1]);
      }
      return {
        height: height,
        unit: heightUnit
      };
    }
  };

  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  Utils.is_intercepted = obsolete(Utils.isIntercepted, 'is_intercepted', 'isIntercepted');

  Utils.create_stylesheet = obsolete(Utils.createStylesheet, 'create_stylesheet', 'createStylesheet');

  Utils.remove_stylesheet = obsolete(Utils.removeStylesheet, 'remove_stylesheet', 'removeStylesheet');

  Utils.insert_css_rule = obsolete(Utils.insertCSSRule, 'insert_css_rule', 'insertCSSRule');
  // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

  /**
   * @class GridStackDragDropPlugin
   * Base class for drag'n'drop plugin.
   */
  function GridStackDragDropPlugin(grid) {
    this.grid = grid;
  }

  GridStackDragDropPlugin.registeredPlugins = [];

  GridStackDragDropPlugin.registerPlugin = function (pluginClass) {
    GridStackDragDropPlugin.registeredPlugins.push(pluginClass);
  };

  GridStackDragDropPlugin.prototype.resizable = function (el, opts) {
    return this;
  };

  GridStackDragDropPlugin.prototype.draggable = function (el, opts) {
    return this;
  };

  GridStackDragDropPlugin.prototype.droppable = function (el, opts) {
    return this;
  };

  GridStackDragDropPlugin.prototype.isDroppable = function (el) {
    return false;
  };

  GridStackDragDropPlugin.prototype.on = function (el, eventName, callback) {
    return this;
  };


  var idSeq = 0;

  var GridStackEngine = function (width, onchange, floatMode, height, items) {
    this.width = width;
    this.float = floatMode || false;
    this.height = height || 0;

    this.nodes = items || [];
    this.onchange = onchange || function () {};

    this._updateCounter = 0;
    this._float = this.float;

    this._addedNodes = [];
    this._removedNodes = [];
  };

  GridStackEngine.prototype.batchUpdate = function () {
    this._updateCounter = 1;
    this.float = true;
  };

  GridStackEngine.prototype.commit = function () {
    if (this._updateCounter !== 0) {
      this._updateCounter = 0;
      this.float = this._float;
      this._packNodes();
      this._notify();
    }
  };

  // For Meteor support: https://github.com/troolee/gridstack.js/pull/272
  GridStackEngine.prototype.getNodeDataByDOMEl = function (el) {
    return _.find(this.nodes, function (n) {
      return el.get(0) === n.el.get(0);
    });
  };

  GridStackEngine.prototype._fixCollisions = function (node) {
    var self = this;
    this._sortNodes(-1);

    var nn = node;
    var hasLocked = Boolean(_.find(this.nodes, function (n) {
      return n.locked;
    }));
    if (!this.float && !hasLocked) {
      nn = {
        x: 0,
        y: node.y,
        width: this.width,
        height: node.height
      };
    }
    while (true) {
      var collisionNode = _.find(this.nodes, _.bind(Utils._collisionNodeCheck, {
        node: node,
        nn: nn
      }));
      if (typeof collisionNode == 'undefined') {
        return;
      }
      this.moveNode(collisionNode, collisionNode.x, node.y + node.height,
        collisionNode.width, collisionNode.height, true);
    }
  };

  GridStackEngine.prototype.isAreaEmpty = function (x, y, width, height) {
    var nn = {
      x: x || 0,
      y: y || 0,
      width: width || 1,
      height: height || 1
    };
    var collisionNode = _.find(this.nodes, _.bind(function (n) {
      return Utils.isIntercepted(n, nn);
    }, this));
    return collisionNode === null || typeof collisionNode === 'undefined';
  };

  GridStackEngine.prototype._sortNodes = function (dir) {
    this.nodes = Utils.sort(this.nodes, dir, this.width);
  };

  GridStackEngine.prototype._packNodes = function () {
    this._sortNodes();

    if (this.float) {
      _.each(this.nodes, _.bind(function (n, i) {
        if (n._updating || typeof n._origY == 'undefined' || n.y == n._origY) {
          return;
        }

        var newY = n.y;
        while (newY >= n._origY) {
          var collisionNode = _.chain(this.nodes)
            .find(_.bind(Utils._didCollide, {
              n: n,
              newY: newY
            }))
            .value();

          if (!collisionNode) {
            n._dirty = true;
            n.y = newY;
          }
          --newY;
        }
      }, this));
    } else {
      _.each(this.nodes, _.bind(function (n, i) {
        if (n.locked) {
          return;
        }
        while (n.y > 0) {
          var newY = n.y - 1;
          var canBeMoved = i === 0;

          if (i > 0) {
            var collisionNode = _.chain(this.nodes)
              .take(i)
              .find(_.bind(Utils._didCollide, {
                n: n,
                newY: newY
              }))
              .value();
            canBeMoved = typeof collisionNode == 'undefined';
          }

          if (!canBeMoved) {
            break;
          }
          n._dirty = n.y != newY;
          n.y = newY;
        }
      }, this));
    }
  };

  GridStackEngine.prototype._prepareNode = function (node, resizing) {
    node = _.defaults(node || {}, {
      width: 1,
      height: 1,
      x: 0,
      y: 0
    });

    node.x = parseInt('' + node.x);
    node.y = parseInt('' + node.y);
    node.width = parseInt('' + node.width);
    node.height = parseInt('' + node.height);
    node.autoPosition = node.autoPosition || false;
    node.noResize = node.noResize || false;
    node.noMove = node.noMove || false;

    if (node.width > this.width) {
      node.width = this.width;
    } else if (node.width < 1) {
      node.width = 1;
    }

    if (node.height < 1) {
      node.height = 1;
    }

    if (node.x < 0) {
      node.x = 0;
    }

    if (node.x + node.width > this.width) {
      if (resizing) {
        node.width = this.width - node.x;
      } else {
        node.x = this.width - node.width;
      }
    }

    if (node.y < 0) {
      node.y = 0;
    }

    return node;
  };

  GridStackEngine.prototype._notify = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = typeof args[0] === 'undefined' ? [] : [args[0]];
    args[1] = typeof args[1] === 'undefined' ? true : args[1];
    if (this._updateCounter) {
      return;
    }
    var deletedNodes = args[0].concat(this.getDirtyNodes());
    this.onchange(deletedNodes, args[1]);
  };

  GridStackEngine.prototype.cleanNodes = function () {
    if (this._updateCounter) {
      return;
    }
    _.each(this.nodes, function (n) {
      n._dirty = false;
    });
  };

  GridStackEngine.prototype.getDirtyNodes = function () {
    return _.filter(this.nodes, function (n) {
      return n._dirty;
    });
  };

  GridStackEngine.prototype.addNode = function (node, triggerAddEvent) {
    node = this._prepareNode(node);

    if (typeof node.maxWidth != 'undefined') {
      node.width = Math.min(node.width, node.maxWidth);
    }
    if (typeof node.maxHeight != 'undefined') {
      node.height = Math.min(node.height, node.maxHeight);
    }
    if (typeof node.minWidth != 'undefined') {
      node.width = Math.max(node.width, node.minWidth);
    }
    if (typeof node.minHeight != 'undefined') {
      node.height = Math.max(node.height, node.minHeight);
    }

    node._id = ++idSeq;
    node._dirty = true;

    if (node.autoPosition) {
      this._sortNodes();

      for (var i = 0;; ++i) {
        var x = i % this.width;
        var y = Math.floor(i / this.width);
        if (x + node.width > this.width) {
          continue;
        }
        if (!_.find(this.nodes, _.bind(Utils._isAddNodeIntercepted, {
            x: x,
            y: y,
            node: node
          }))) {
          node.x = x;
          node.y = y;
          break;
        }
      }
    }

    this.nodes.push(node);
    if (typeof triggerAddEvent != 'undefined' && triggerAddEvent) {
      this._addedNodes.push(_.clone(node));
    }

    this._fixCollisions(node);
    this._packNodes();
    this._notify();
    return node;
  };

  GridStackEngine.prototype.removeNode = function (node, detachNode) {
    detachNode = typeof detachNode === 'undefined' ? true : detachNode;
    this._removedNodes.push(_.clone(node));
    node._id = null;
    this.nodes = _.without(this.nodes, node);
    this._packNodes();
    this._notify(node, detachNode);
  };

  GridStackEngine.prototype.canMoveNode = function (node, x, y, width, height) {
    if (!this.isNodeChangedPosition(node, x, y, width, height)) {
      return false;
    }
    var hasLocked = Boolean(_.find(this.nodes, function (n) {
      return n.locked;
    }));

    if (!this.height && !hasLocked) {
      return true;
    }

    var clonedNode;
    var clone = new GridStackEngine(
      this.width,
      null,
      this.float,
      0,
      _.map(this.nodes, function (n) {
        if (n == node) {
          clonedNode = $.extend({}, n);
          return clonedNode;
        }
        return $.extend({}, n);
      }));

    if (typeof clonedNode === 'undefined') {
      return true;
    }

    clone.moveNode(clonedNode, x, y, width, height);

    var res = true;

    if (hasLocked) {
      res &= !Boolean(_.find(clone.nodes, function (n) {
        return n != clonedNode && Boolean(n.locked) && Boolean(n._dirty);
      }));
    }
    if (this.height) {
      res &= clone.getGridHeight() <= this.height;
    }

    return res;
  };

  GridStackEngine.prototype.canBePlacedWithRespectToHeight = function (node) {
    if (!this.height) {
      return true;
    }

    var clone = new GridStackEngine(
      this.width,
      null,
      this.float,
      0,
      _.map(this.nodes, function (n) {
        return $.extend({}, n);
      }));
    clone.addNode(node);
    return clone.getGridHeight() <= this.height;
  };

  GridStackEngine.prototype.isNodeChangedPosition = function (node, x, y, width, height) {
    if (typeof x != 'number') {
      x = node.x;
    }
    if (typeof y != 'number') {
      y = node.y;
    }
    if (typeof width != 'number') {
      width = node.width;
    }
    if (typeof height != 'number') {
      height = node.height;
    }

    if (typeof node.maxWidth != 'undefined') {
      width = Math.min(width, node.maxWidth);
    }
    if (typeof node.maxHeight != 'undefined') {
      height = Math.min(height, node.maxHeight);
    }
    if (typeof node.minWidth != 'undefined') {
      width = Math.max(width, node.minWidth);
    }
    if (typeof node.minHeight != 'undefined') {
      height = Math.max(height, node.minHeight);
    }

    if (node.x == x && node.y == y && node.width == width && node.height == height) {
      return false;
    }
    return true;
  };

  GridStackEngine.prototype.moveNode = function (node, x, y, width, height, noPack) {
    if (!this.isNodeChangedPosition(node, x, y, width, height)) {
      return node;
    }
    if (typeof x != 'number') {
      x = node.x;
    }
    if (typeof y != 'number') {
      y = node.y;
    }
    if (typeof width != 'number') {
      width = node.width;
    }
    if (typeof height != 'number') {
      height = node.height;
    }

    if (typeof node.maxWidth != 'undefined') {
      width = Math.min(width, node.maxWidth);
    }
    if (typeof node.maxHeight != 'undefined') {
      height = Math.min(height, node.maxHeight);
    }
    if (typeof node.minWidth != 'undefined') {
      width = Math.max(width, node.minWidth);
    }
    if (typeof node.minHeight != 'undefined') {
      height = Math.max(height, node.minHeight);
    }

    if (node.x == x && node.y == y && node.width == width && node.height == height) {
      return node;
    }

    var resizing = node.width != width;
    node._dirty = true;

    node.x = x;
    node.y = y;
    node.width = width;
    node.height = height;

    node = this._prepareNode(node, resizing);

    this._fixCollisions(node);
    if (!noPack) {
      this._packNodes();
      this._notify();
    }
    return node;
  };

  GridStackEngine.prototype.getGridHeight = function () {
    return _.reduce(this.nodes, function (memo, n) {
      return Math.max(memo, n.y + n.height);
    }, 0);
  };

  GridStackEngine.prototype.beginUpdate = function (node) {
    _.each(this.nodes, function (n) {
      n._origY = n.y;
    });
    node._updating = true;
  };

  GridStackEngine.prototype.endUpdate = function () {
    _.each(this.nodes, function (n) {
      n._origY = n.y;
    });
    var n = _.find(this.nodes, function (n) {
      return n._updating;
    });
    if (n) {
      n._updating = false;
    }
  };

  var GridStack = function (el, opts) {
    var self = this;
    var oneColumnMode, isAutoCellHeight;

    opts = opts || {};

    this.container = $(el);

    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    if (typeof opts.handle_class !== 'undefined') {
      opts.handleClass = opts.handle_class;
      obsoleteOpts('handle_class', 'handleClass');
    }
    if (typeof opts.item_class !== 'undefined') {
      opts.itemClass = opts.item_class;
      obsoleteOpts('item_class', 'itemClass');
    }
    if (typeof opts.placeholder_class !== 'undefined') {
      opts.placeholderClass = opts.placeholder_class;
      obsoleteOpts('placeholder_class', 'placeholderClass');
    }
    if (typeof opts.placeholder_text !== 'undefined') {
      opts.placeholderText = opts.placeholder_text;
      obsoleteOpts('placeholder_text', 'placeholderText');
    }
    if (typeof opts.cell_height !== 'undefined') {
      opts.cellHeight = opts.cell_height;
      obsoleteOpts('cell_height', 'cellHeight');
    }
    if (typeof opts.vertical_margin !== 'undefined') {
      opts.verticalMargin = opts.vertical_margin;
      obsoleteOpts('vertical_margin', 'verticalMargin');
    }
    if (typeof opts.min_width !== 'undefined') {
      opts.minWidth = opts.min_width;
      obsoleteOpts('min_width', 'minWidth');
    }
    if (typeof opts.static_grid !== 'undefined') {
      opts.staticGrid = opts.static_grid;
      obsoleteOpts('static_grid', 'staticGrid');
    }
    if (typeof opts.is_nested !== 'undefined') {
      opts.isNested = opts.is_nested;
      obsoleteOpts('is_nested', 'isNested');
    }
    if (typeof opts.always_show_resize_handle !== 'undefined') {
      opts.alwaysShowResizeHandle = opts.always_show_resize_handle;
      obsoleteOpts('always_show_resize_handle', 'alwaysShowResizeHandle');
    }
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

    opts.itemClass = opts.itemClass || 'grid-stack-item';
    var isNested = this.container.closest('.' + opts.itemClass).length > 0;

    this.opts = _.defaults(opts || {}, {
      width: parseInt(this.container.attr('data-gs-width')) || 12,
      height: parseInt(this.container.attr('data-gs-height')) || 0,
      itemClass: 'grid-stack-item',
      placeholderClass: 'grid-stack-placeholder',
      placeholderText: '',
      handle: '.grid-stack-item-content',
      handleClass: null,
      cellHeight: 60,
      verticalMargin: 20,
      auto: true,
      minWidth: 768,
      float: false,
      staticGrid: false,
      _class: 'grid-stack-instance-' + (Math.random() * 10000).toFixed(0),
      animate: Boolean(this.container.attr('data-gs-animate')) || false,
      alwaysShowResizeHandle: opts.alwaysShowResizeHandle || false,
      resizable: _.defaults(opts.resizable || {}, {
        autoHide: !(opts.alwaysShowResizeHandle || false),
        handles: 'se'
      }),
      draggable: _.defaults(opts.draggable || {}, {
        handle: (opts.handleClass ? '.' + opts.handleClass : (opts.handle ? opts.handle : '')) ||
          '.grid-stack-item-content',
        scroll: false,
        appendTo: 'body'
      }),
      disableDrag: opts.disableDrag || false,
      disableResize: opts.disableResize || false,
      rtl: 'auto',
      removable: false,
      removeTimeout: 2000,
      verticalMarginUnit: 'px',
      cellHeightUnit: 'px',
      oneColumnModeClass: opts.oneColumnModeClass || 'grid-stack-one-column-mode',
      ddPlugin: null
    });

    if (this.opts.ddPlugin === false) {
      this.opts.ddPlugin = GridStackDragDropPlugin;
    } else if (this.opts.ddPlugin === null) {
      this.opts.ddPlugin = _.first(GridStackDragDropPlugin.registeredPlugins) || GridStackDragDropPlugin;
    }

    this.dd = new this.opts.ddPlugin(this);

    if (this.opts.rtl === 'auto') {
      this.opts.rtl = this.container.css('direction') === 'rtl';
    }

    if (this.opts.rtl) {
      this.container.addClass('grid-stack-rtl');
    }

    this.opts.isNested = isNested;

    isAutoCellHeight = this.opts.cellHeight === 'auto';
    if (isAutoCellHeight) {
      self.cellHeight(self.cellWidth(), true);
    } else {
      this.cellHeight(this.opts.cellHeight, true);
    }
    this.verticalMargin(this.opts.verticalMargin, true);

    this.container.addClass(this.opts._class);

    this._setStaticClass();

    if (isNested) {
      this.container.addClass('grid-stack-nested');
    }

    this._initStyles();

    this.grid = new GridStackEngine(this.opts.width, function (nodes, detachNode) {
      detachNode = typeof detachNode === 'undefined' ? true : detachNode;
      var maxHeight = 0;
      _.each(nodes, function (n) {
        if (detachNode && n._id === null) {
          if (n.el) {
            n.el.remove();
          }
        } else {
          n.el
            .attr('data-gs-x', n.x)
            .attr('data-gs-y', n.y)
            .attr('data-gs-width', n.width)
            .attr('data-gs-height', n.height);
          maxHeight = Math.max(maxHeight, n.y + n.height);
        }
      });
      self._updateStyles(maxHeight + 10);
    }, this.opts.float, this.opts.height);

    if (this.opts.auto) {
      var elements = [];
      var _this = this;
      this.container.children('.' + this.opts.itemClass + ':not(.' + this.opts.placeholderClass + ')')
        .each(function (index, el) {
          el = $(el);
          elements.push({
            el: el,
            i: parseInt(el.attr('data-gs-x')) + parseInt(el.attr('data-gs-y')) * _this.opts.width
          });
        });
      _.chain(elements).sortBy(function (x) {
        return x.i;
      }).each(function (i) {
        self._prepareElement(i.el);
      }).value();
    }

    this.setAnimation(this.opts.animate);

    this.placeholder = $(
      '<div class="' + this.opts.placeholderClass + ' ' + this.opts.itemClass + '">' +
      '<div class="placeholder-content">' + this.opts.placeholderText + '</div></div>').hide();

    this._updateContainerHeight();

    this._updateHeightsOnResize = _.throttle(function () {
      self.cellHeight(self.cellWidth(), false);
    }, 100);

    this.onResizeHandler = function () {
      if (isAutoCellHeight) {
        self._updateHeightsOnResize();
      }

      if (self._isOneColumnMode()) {
        if (oneColumnMode) {
          return;
        }
        self.container.addClass(self.opts.oneColumnModeClass);
        oneColumnMode = true;

        self.grid._sortNodes();
        _.each(self.grid.nodes, function (node) {
          self.container.append(node.el);

          if (self.opts.staticGrid) {
            return;
          }
          if (node.noMove || self.opts.disableDrag) {
            self.dd.draggable(node.el, 'disable');
          }
          if (node.noResize || self.opts.disableResize) {
            self.dd.resizable(node.el, 'disable');
          }

          node.el.trigger('resize');
        });
      } else {
        if (!oneColumnMode) {
          return;
        }

        self.container.removeClass(self.opts.oneColumnModeClass);
        oneColumnMode = false;

        if (self.opts.staticGrid) {
          return;
        }

        _.each(self.grid.nodes, function (node) {
          if (!node.noMove && !self.opts.disableDrag) {
            self.dd.draggable(node.el, 'enable');
          }
          if (!node.noResize && !self.opts.disableResize) {
            self.dd.resizable(node.el, 'enable');
          }

          node.el.trigger('resize');
        });
      }
    };

    $(window).resize(this.onResizeHandler);
    this.onResizeHandler();

    if (!self.opts.staticGrid && typeof self.opts.removable === 'string') {
      var trashZone = $(self.opts.removable);
      if (!this.dd.isDroppable(trashZone)) {
        this.dd.droppable(trashZone, {
          accept: '.' + self.opts.itemClass
        });
      }
      this.dd
        .on(trashZone, 'dropover', function (event, ui) {
          var el = $(ui.draggable);
          var node = el.data('_gridstack_node');
          if (node._grid !== self) {
            return;
          }
          self._setupRemovingTimeout(el);
        })
        .on(trashZone, 'dropout', function (event, ui) {
          var el = $(ui.draggable);
          var node = el.data('_gridstack_node');
          if (node._grid !== self) {
            return;
          }
          self._clearRemovingTimeout(el);
        });
    }

    if (!self.opts.staticGrid && self.opts.acceptWidgets) {
      var draggingElement = null;

      var onDrag = function (event, ui) {
        var el = draggingElement;
        var node = el.data('_gridstack_node');
        var pos = self.getCellFromPixel(ui.offset, true);
        var x = Math.max(0, pos.x);
        var y = Math.max(0, pos.y);
        if (!node._added) {
          node._added = true;

          node.el = el;
          node.x = x;
          node.y = y;
          self.grid.cleanNodes();
          self.grid.beginUpdate(node);
          self.grid.addNode(node);

          self.container.append(self.placeholder);
          self.placeholder
            .attr('data-gs-x', node.x)
            .attr('data-gs-y', node.y)
            .attr('data-gs-width', node.width)
            .attr('data-gs-height', node.height)
            .show();
          node.el = self.placeholder;
          node._beforeDragX = node.x;
          node._beforeDragY = node.y;

          self._updateContainerHeight();
        } else {
          if (!self.grid.canMoveNode(node, x, y)) {
            return;
          }
          self.grid.moveNode(node, x, y);
          self._updateContainerHeight();
        }
      };

      this.dd
        .droppable(self.container, {
          accept: function (el) {
            el = $(el);
            var node = el.data('_gridstack_node');
            if (node && node._grid === self) {
              return false;
            }
            return el.is(self.opts.acceptWidgets === true ? '.grid-stack-item' : self.opts.acceptWidgets);
          }
        })
        .on(self.container, 'dropover', function (event, ui) {
          var offset = self.container.offset();
          var el = $(ui.draggable);
          var cellWidth = self.cellWidth();
          var cellHeight = self.cellHeight();
          var origNode = el.data('_gridstack_node');

          var width = origNode ? origNode.width : (Math.ceil(el.outerWidth() / cellWidth));
          var height = origNode ? origNode.height : (Math.ceil(el.outerHeight() / cellHeight));

          draggingElement = el;

          var node = self.grid._prepareNode({
            width: width,
            height: height,
            _added: false,
            _temporary: true
          });
          el.data('_gridstack_node', node);
          el.data('_gridstack_node_orig', origNode);

          el.on('drag', onDrag);
        })
        .on(self.container, 'dropout', function (event, ui) {
          var el = $(ui.draggable);
          el.unbind('drag', onDrag);
          var node = el.data('_gridstack_node');
          node.el = null;
          self.grid.removeNode(node);
          self.placeholder.detach();
          self._updateContainerHeight();
          el.data('_gridstack_node', el.data('_gridstack_node_orig'));
        })
        .on(self.container, 'drop', function (event, ui) {
          self.placeholder.detach();

          var node = $(ui.draggable).data('_gridstack_node');
          node._grid = self;
          var el = $(ui.draggable).clone(false);
          el.data('_gridstack_node', node);
          $(ui.draggable).remove();
          node.el = el;
          self.placeholder.hide();
          el
            .attr('data-gs-x', node.x)
            .attr('data-gs-y', node.y)
            .attr('data-gs-width', node.width)
            .attr('data-gs-height', node.height)
            .addClass(self.opts.itemClass)
            .removeAttr('style')
            .enableSelection()
            .removeData('draggable')
            .removeClass('ui-draggable ui-draggable-dragging ui-draggable-disabled')
            .unbind('drag', onDrag);
          self.container.append(el);
          self._prepareElementsByNode(el, node);
          self._updateContainerHeight();
          self._triggerChangeEvent();

          self.grid.endUpdate();
        });
    }
  };

  GridStack.prototype._triggerChangeEvent = function (forceTrigger) {
    var elements = this.grid.getDirtyNodes();
    var hasChanges = false;

    var eventParams = [];
    if (elements && elements.length) {
      eventParams.push(elements);
      hasChanges = true;
    }

    if (hasChanges || forceTrigger === true) {
      this.container.trigger('change', eventParams);
    }
  };

  GridStack.prototype._triggerAddEvent = function () {
    if (this.grid._addedNodes && this.grid._addedNodes.length > 0) {
      this.container.trigger('added', [_.map(this.grid._addedNodes, _.clone)]);
      this.grid._addedNodes = [];
    }
  };

  GridStack.prototype._triggerRemoveEvent = function () {
    if (this.grid._removedNodes && this.grid._removedNodes.length > 0) {
      this.container.trigger('removed', [_.map(this.grid._removedNodes, _.clone)]);
      this.grid._removedNodes = [];
    }
  };

  GridStack.prototype._initStyles = function () {
    if (this._stylesId) {
      Utils.removeStylesheet(this._stylesId);
    }
    this._stylesId = 'gridstack-style-' + (Math.random() * 100000).toFixed();
    this._styles = Utils.createStylesheet(this._stylesId);
    if (this._styles !== null) {
      this._styles._max = 0;
    }
  };

  GridStack.prototype._updateStyles = function (maxHeight) {
    if (this._styles === null || typeof this._styles === 'undefined') {
      return;
    }

    var prefix = '.' + this.opts._class + ' .' + this.opts.itemClass;
    var self = this;
    var getHeight;

    if (typeof maxHeight == 'undefined') {
      maxHeight = this._styles._max;
      this._initStyles();
      this._updateContainerHeight();
    }
    if (!this.opts.cellHeight) { // The rest will be handled by CSS
      return;
    }
    if (this._styles._max !== 0 && maxHeight <= this._styles._max) {
      return;
    }

    if (!this.opts.verticalMargin || this.opts.cellHeightUnit === this.opts.verticalMarginUnit) {
      getHeight = function (nbRows, nbMargins) {
        return (self.opts.cellHeight * nbRows + self.opts.verticalMargin * nbMargins) +
          self.opts.cellHeightUnit;
      };
    } else {
      getHeight = function (nbRows, nbMargins) {
        if (!nbRows || !nbMargins) {
          return (self.opts.cellHeight * nbRows + self.opts.verticalMargin * nbMargins) +
            self.opts.cellHeightUnit;
        }
        return 'calc(' + ((self.opts.cellHeight * nbRows) + self.opts.cellHeightUnit) + ' + ' +
          ((self.opts.verticalMargin * nbMargins) + self.opts.verticalMarginUnit) + ')';
      };
    }

    if (this._styles._max === 0) {
      Utils.insertCSSRule(this._styles, prefix, 'min-height: ' + getHeight(1, 0) + ';', 0);
    }

    if (maxHeight > this._styles._max) {
      for (var i = this._styles._max; i < maxHeight; ++i) {
        Utils.insertCSSRule(this._styles,
          prefix + '[data-gs-height="' + (i + 1) + '"]',
          'height: ' + getHeight(i + 1, i) + ';',
          i
        );
        Utils.insertCSSRule(this._styles,
          prefix + '[data-gs-min-height="' + (i + 1) + '"]',
          'min-height: ' + getHeight(i + 1, i) + ';',
          i
        );
        Utils.insertCSSRule(this._styles,
          prefix + '[data-gs-max-height="' + (i + 1) + '"]',
          'max-height: ' + getHeight(i + 1, i) + ';',
          i
        );
        Utils.insertCSSRule(this._styles,
          prefix + '[data-gs-y="' + i + '"]',
          'top: ' + getHeight(i, i) + ';',
          i
        );
      }
      this._styles._max = maxHeight;
    }
  };

  GridStack.prototype._updateContainerHeight = function () {
    if (this.grid._updateCounter) {
      return;
    }
    var height = this.grid.getGridHeight();
    this.container.attr('data-gs-current-height', height);
    if (!this.opts.cellHeight) {
      return;
    }
    if (!this.opts.verticalMargin) {
      this.container.css('height', (height * (this.opts.cellHeight)) + this.opts.cellHeightUnit);
    } else if (this.opts.cellHeightUnit === this.opts.verticalMarginUnit) {
      this.container.css('height', (height * (this.opts.cellHeight + this.opts.verticalMargin) -
        this.opts.verticalMargin) + this.opts.cellHeightUnit);
    } else {
      this.container.css('height', 'calc(' + ((height * (this.opts.cellHeight)) + this.opts.cellHeightUnit) +
        ' + ' + ((height * (this.opts.verticalMargin - 1)) + this.opts.verticalMarginUnit) + ')');
    }
  };

  GridStack.prototype._isOneColumnMode = function () {
    return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) <=
      this.opts.minWidth;
  };

  GridStack.prototype._setupRemovingTimeout = function (el) {
    var self = this;
    var node = $(el).data('_gridstack_node');

    if (node._removeTimeout || !self.opts.removable) {
      return;
    }
    node._removeTimeout = setTimeout(function () {
      el.addClass('grid-stack-item-removing');
      node._isAboutToRemove = true;
    }, self.opts.removeTimeout);
  };

  GridStack.prototype._clearRemovingTimeout = function (el) {
    var node = $(el).data('_gridstack_node');

    if (!node._removeTimeout) {
      return;
    }
    clearTimeout(node._removeTimeout);
    node._removeTimeout = null;
    el.removeClass('grid-stack-item-removing');
    node._isAboutToRemove = false;
  };

  GridStack.prototype._prepareElementsByNode = function (el, node) {
    if (typeof $.ui === 'undefined') {
      return;
    }
    var self = this;

    var cellWidth;
    var cellHeight;

    var dragOrResize = function (event, ui) {
      var x = Math.round(ui.position.left / cellWidth);
      var y = Math.floor((ui.position.top + cellHeight / 2) / cellHeight);
      var width;
      var height;

      if (event.type != 'drag') {
        width = Math.round(ui.size.width / cellWidth);
        height = Math.round(ui.size.height / cellHeight);
      }

      if (event.type == 'drag') {
        if (x < 0 || x >= self.grid.width || y < 0) {
          if (self.opts.removable === true) {
            self._setupRemovingTimeout(el);
          }

          x = node._beforeDragX;
          y = node._beforeDragY;

          self.placeholder.detach();
          self.placeholder.hide();
          self.grid.removeNode(node);
          self._updateContainerHeight();

          node._temporaryRemoved = true;
        } else {
          self._clearRemovingTimeout(el);

          if (node._temporaryRemoved) {
            self.grid.addNode(node);
            self.placeholder
              .attr('data-gs-x', x)
              .attr('data-gs-y', y)
              .attr('data-gs-width', width)
              .attr('data-gs-height', height)
              .show();
            self.container.append(self.placeholder);
            node.el = self.placeholder;
            node._temporaryRemoved = false;
          }
        }
      } else if (event.type == 'resize') {
        if (x < 0) {
          return;
        }
      }

      if (!self.grid.canMoveNode(node, x, y, width, height)) {
        return;
      }
      self.grid.moveNode(node, x, y, width, height);
      self._updateContainerHeight();
    };

    var onStartMoving = function (event, ui) {
      self.container.append(self.placeholder);
      var o = $(this);
      self.grid.cleanNodes();
      self.grid.beginUpdate(node);
      cellWidth = self.cellWidth();
      var strictCellHeight = Math.ceil(o.outerHeight() / o.attr('data-gs-height'));
      cellHeight = self.container.height() / parseInt(self.container.attr('data-gs-current-height'));
      self.placeholder
        .attr('data-gs-x', o.attr('data-gs-x'))
        .attr('data-gs-y', o.attr('data-gs-y'))
        .attr('data-gs-width', o.attr('data-gs-width'))
        .attr('data-gs-height', o.attr('data-gs-height'))
        .show();
      node.el = self.placeholder;
      node._beforeDragX = node.x;
      node._beforeDragY = node.y;

      self.dd.resizable(el, 'option', 'minWidth', cellWidth * (node.minWidth || 1));
      self.dd.resizable(el, 'option', 'minHeight', strictCellHeight * (node.minHeight || 1));

      if (event.type == 'resizestart') {
        o.find('.grid-stack-item').trigger('resizestart');
      }
    };

    var onEndMoving = function (event, ui) {
      var o = $(this);
      if (!o.data('_gridstack_node')) {
        return;
      }

      var forceNotify = false;
      self.placeholder.detach();
      node.el = o;
      self.placeholder.hide();

      if (node._isAboutToRemove) {
        forceNotify = true;
        el.removeData('_gridstack_node');
        el.remove();
      } else {
        self._clearRemovingTimeout(el);
        if (!node._temporaryRemoved) {
          o
            .attr('data-gs-x', node.x)
            .attr('data-gs-y', node.y)
            .attr('data-gs-width', node.width)
            .attr('data-gs-height', node.height)
            .removeAttr('style');
        } else {
          o
            .attr('data-gs-x', node._beforeDragX)
            .attr('data-gs-y', node._beforeDragY)
            .attr('data-gs-width', node.width)
            .attr('data-gs-height', node.height)
            .removeAttr('style');
          node.x = node._beforeDragX;
          node.y = node._beforeDragY;
          self.grid.addNode(node);
        }
      }
      self._updateContainerHeight();
      self._triggerChangeEvent(forceNotify);

      self.grid.endUpdate();

      var nestedGrids = o.find('.grid-stack');
      if (nestedGrids.length && event.type == 'resizestop') {
        nestedGrids.each(function (index, el) {
          $(el).data('gridstack').onResizeHandler();
        });
        o.find('.grid-stack-item').trigger('resizestop');
      }
    };

    this.dd
      .draggable(el, {
        start: onStartMoving,
        stop: onEndMoving,
        drag: dragOrResize
      })
      .resizable(el, {
        start: onStartMoving,
        stop: onEndMoving,
        resize: dragOrResize
      });

    if (node.noMove || this._isOneColumnMode() || this.opts.disableDrag) {
      this.dd.draggable(el, 'disable');
    }

    if (node.noResize || this._isOneColumnMode() || this.opts.disableResize) {
      this.dd.resizable(el, 'disable');
    }

    el.attr('data-gs-locked', node.locked ? 'yes' : null);
  };

  GridStack.prototype._prepareElement = function (el, triggerAddEvent) {
    triggerAddEvent = typeof triggerAddEvent != 'undefined' ? triggerAddEvent : false;
    var self = this;
    el = $(el);

    el.addClass(this.opts.itemClass);
    var node = self.grid.addNode({
      x: el.attr('data-gs-x'),
      y: el.attr('data-gs-y'),
      width: el.attr('data-gs-width'),
      height: el.attr('data-gs-height'),
      maxWidth: el.attr('data-gs-max-width'),
      minWidth: el.attr('data-gs-min-width'),
      maxHeight: el.attr('data-gs-max-height'),
      minHeight: el.attr('data-gs-min-height'),
      autoPosition: Utils.toBool(el.attr('data-gs-auto-position')),
      noResize: Utils.toBool(el.attr('data-gs-no-resize')),
      noMove: Utils.toBool(el.attr('data-gs-no-move')),
      locked: Utils.toBool(el.attr('data-gs-locked')),
      el: el,
      id: el.attr('data-gs-id'),
      _grid: self
    }, triggerAddEvent);
    el.data('_gridstack_node', node);

    this._prepareElementsByNode(el, node);
  };

  GridStack.prototype.setAnimation = function (enable) {
    if (enable) {
      this.container.addClass('grid-stack-animate');
    } else {
      this.container.removeClass('grid-stack-animate');
    }
  };

  GridStack.prototype.addWidget = function (el, x, y, width, height, autoPosition, minWidth, maxWidth,
    minHeight, maxHeight, id) {
    el = $(el);
    if (typeof x != 'undefined') {
      el.attr('data-gs-x', x);
    }
    if (typeof y != 'undefined') {
      el.attr('data-gs-y', y);
    }
    if (typeof width != 'undefined') {
      el.attr('data-gs-width', width);
    }
    if (typeof height != 'undefined') {
      el.attr('data-gs-height', height);
    }
    if (typeof autoPosition != 'undefined') {
      el.attr('data-gs-auto-position', autoPosition ? 'yes' : null);
    }
    if (typeof minWidth != 'undefined') {
      el.attr('data-gs-min-width', minWidth);
    }
    if (typeof maxWidth != 'undefined') {
      el.attr('data-gs-max-width', maxWidth);
    }
    if (typeof minHeight != 'undefined') {
      el.attr('data-gs-min-height', minHeight);
    }
    if (typeof maxHeight != 'undefined') {
      el.attr('data-gs-max-height', maxHeight);
    }
    if (typeof id != 'undefined') {
      el.attr('data-gs-id', id);
    }
    this.container.append(el);
    this._prepareElement(el, true);
    this._triggerAddEvent();
    this._updateContainerHeight();
    this._triggerChangeEvent(true);

    return el;
  };

  GridStack.prototype.makeWidget = function (el) {
    el = $(el);
    this._prepareElement(el, true);
    this._triggerAddEvent();
    this._updateContainerHeight();
    this._triggerChangeEvent(true);

    return el;
  };

  GridStack.prototype.willItFit = function (x, y, width, height, autoPosition) {
    var node = {
      x: x,
      y: y,
      width: width,
      height: height,
      autoPosition: autoPosition
    };
    return this.grid.canBePlacedWithRespectToHeight(node);
  };

  GridStack.prototype.removeWidget = function (el, detachNode) {
    detachNode = typeof detachNode === 'undefined' ? true : detachNode;
    el = $(el);
    var node = el.data('_gridstack_node');

    // For Meteor support: https://github.com/troolee/gridstack.js/pull/272
    if (!node) {
      node = this.grid.getNodeDataByDOMEl(el);
    }

    this.grid.removeNode(node, detachNode);
    el.removeData('_gridstack_node');
    this._updateContainerHeight();
    if (detachNode) {
      el.remove();
    }
    this._triggerChangeEvent(true);
    this._triggerRemoveEvent();
  };

  GridStack.prototype.removeAll = function (detachNode) {
    _.each(this.grid.nodes, _.bind(function (node) {
      this.removeWidget(node.el, detachNode);
    }, this));
    this.grid.nodes = [];
    this._updateContainerHeight();
  };

  GridStack.prototype.destroy = function (detachGrid) {
    $(window).off('resize', this.onResizeHandler);
    this.disable();
    if (typeof detachGrid != 'undefined' && !detachGrid) {
      this.removeAll(false);
      this.container.removeData('gridstack');
    } else {
      this.container.remove();
    }
    Utils.removeStylesheet(this._stylesId);
    if (this.grid) {
      this.grid = null;
    }
  };

  GridStack.prototype.resizable = function (el, val) {
    var self = this;
    el = $(el);
    el.each(function (index, el) {
      el = $(el);
      var node = el.data('_gridstack_node');
      if (typeof node == 'undefined' || node === null || typeof $.ui === 'undefined') {
        return;
      }

      node.noResize = !(val || false);
      if (node.noResize || self._isOneColumnMode()) {
        self.dd.resizable(el, 'disable');
      } else {
        self.dd.resizable(el, 'enable');
      }
    });
    return this;
  };

  GridStack.prototype.movable = function (el, val) {
    var self = this;
    el = $(el);
    el.each(function (index, el) {
      el = $(el);
      var node = el.data('_gridstack_node');
      if (typeof node == 'undefined' || node === null || typeof $.ui === 'undefined') {
        return;
      }

      node.noMove = !(val || false);
      if (node.noMove || self._isOneColumnMode()) {
        self.dd.draggable(el, 'disable');
        el.removeClass('ui-draggable-handle');
      } else {
        self.dd.draggable(el, 'enable');
        el.addClass('ui-draggable-handle');
      }
    });
    return this;
  };

  GridStack.prototype.enableMove = function (doEnable, includeNewWidgets) {
    this.movable(this.container.children('.' + this.opts.itemClass), doEnable);
    if (includeNewWidgets) {
      this.opts.disableDrag = !doEnable;
    }
  };

  GridStack.prototype.enableResize = function (doEnable, includeNewWidgets) {
    this.resizable(this.container.children('.' + this.opts.itemClass), doEnable);
    if (includeNewWidgets) {
      this.opts.disableResize = !doEnable;
    }
  };

  GridStack.prototype.disable = function () {
    this.movable(this.container.children('.' + this.opts.itemClass), false);
    this.resizable(this.container.children('.' + this.opts.itemClass), false);
    this.container.trigger('disable');
  };

  GridStack.prototype.enable = function () {
    this.movable(this.container.children('.' + this.opts.itemClass), true);
    this.resizable(this.container.children('.' + this.opts.itemClass), true);
    this.container.trigger('enable');
  };

  GridStack.prototype.locked = function (el, val) {
    el = $(el);
    el.each(function (index, el) {
      el = $(el);
      var node = el.data('_gridstack_node');
      if (typeof node == 'undefined' || node === null) {
        return;
      }

      node.locked = (val || false);
      el.attr('data-gs-locked', node.locked ? 'yes' : null);
    });
    return this;
  };

  GridStack.prototype.maxHeight = function (el, val) {
    el = $(el);
    el.each(function (index, el) {
      el = $(el);
      var node = el.data('_gridstack_node');
      if (typeof node === 'undefined' || node === null) {
        return;
      }

      if (!isNaN(val)) {
        node.maxHeight = (val || false);
        el.attr('data-gs-max-height', val);
      }
    });
    return this;
  };

  GridStack.prototype.minHeight = function (el, val) {
    el = $(el);
    el.each(function (index, el) {
      el = $(el);
      var node = el.data('_gridstack_node');
      if (typeof node === 'undefined' || node === null) {
        return;
      }

      if (!isNaN(val)) {
        node.minHeight = (val || false);
        el.attr('data-gs-min-height', val);
      }
    });
    return this;
  };

  GridStack.prototype.maxWidth = function (el, val) {
    el = $(el);
    el.each(function (index, el) {
      el = $(el);
      var node = el.data('_gridstack_node');
      if (typeof node === 'undefined' || node === null) {
        return;
      }

      if (!isNaN(val)) {
        node.maxWidth = (val || false);
        el.attr('data-gs-max-width', val);
      }
    });
    return this;
  };

  GridStack.prototype.minWidth = function (el, val) {
    el = $(el);
    el.each(function (index, el) {
      el = $(el);
      var node = el.data('_gridstack_node');
      if (typeof node === 'undefined' || node === null) {
        return;
      }

      if (!isNaN(val)) {
        node.minWidth = (val || false);
        el.attr('data-gs-min-width', val);
      }
    });
    return this;
  };

  GridStack.prototype._updateElement = function (el, callback) {
    el = $(el).first();
    var node = el.data('_gridstack_node');
    if (typeof node == 'undefined' || node === null) {
      return;
    }

    var self = this;

    self.grid.cleanNodes();
    self.grid.beginUpdate(node);

    callback.call(this, el, node);

    self._updateContainerHeight();
    self._triggerChangeEvent();

    self.grid.endUpdate();
  };

  GridStack.prototype.resize = function (el, width, height) {
    this._updateElement(el, function (el, node) {
      width = (width !== null && typeof width != 'undefined') ? width : node.width;
      height = (height !== null && typeof height != 'undefined') ? height : node.height;

      this.grid.moveNode(node, node.x, node.y, width, height);
    });
  };

  GridStack.prototype.move = function (el, x, y) {
    this._updateElement(el, function (el, node) {
      x = (x !== null && typeof x != 'undefined') ? x : node.x;
      y = (y !== null && typeof y != 'undefined') ? y : node.y;

      this.grid.moveNode(node, x, y, node.width, node.height);
    });
  };

  GridStack.prototype.update = function (el, x, y, width, height) {
    this._updateElement(el, function (el, node) {
      x = (x !== null && typeof x != 'undefined') ? x : node.x;
      y = (y !== null && typeof y != 'undefined') ? y : node.y;
      width = (width !== null && typeof width != 'undefined') ? width : node.width;
      height = (height !== null && typeof height != 'undefined') ? height : node.height;

      this.grid.moveNode(node, x, y, width, height);
    });
  };

  GridStack.prototype.verticalMargin = function (val, noUpdate) {
    if (typeof val == 'undefined') {
      return this.opts.verticalMargin;
    }

    var heightData = Utils.parseHeight(val);

    if (this.opts.verticalMarginUnit === heightData.unit && this.opts.height === heightData.height) {
      return;
    }
    this.opts.verticalMarginUnit = heightData.unit;
    this.opts.verticalMargin = heightData.height;

    if (!noUpdate) {
      this._updateStyles();
    }
  };

  GridStack.prototype.cellHeight = function (val, noUpdate) {
    if (typeof val == 'undefined') {
      if (this.opts.cellHeight) {
        return this.opts.cellHeight;
      }
      var o = this.container.children('.' + this.opts.itemClass).first();
      return Math.ceil(o.outerHeight() / o.attr('data-gs-height'));
    }
    var heightData = Utils.parseHeight(val);

    if (this.opts.cellHeightUnit === heightData.heightUnit && this.opts.height === heightData.height) {
      return;
    }
    this.opts.cellHeightUnit = heightData.unit;
    this.opts.cellHeight = heightData.height;

    if (!noUpdate) {
      this._updateStyles();
    }

  };

  GridStack.prototype.cellWidth = function () {
    return Math.round(this.container.outerWidth() / this.opts.width);
  };

  GridStack.prototype.getCellFromPixel = function (position, useOffset) {
    var containerPos = (typeof useOffset != 'undefined' && useOffset) ?
      this.container.offset() : this.container.position();
    var relativeLeft = position.left - containerPos.left;
    var relativeTop = position.top - containerPos.top;

    var columnWidth = Math.floor(this.container.width() / this.opts.width);
    var rowHeight = Math.floor(this.container.height() / parseInt(this.container.attr('data-gs-current-height')));

    return {
      x: Math.floor(relativeLeft / columnWidth),
      y: Math.floor(relativeTop / rowHeight)
    };
  };

  GridStack.prototype.batchUpdate = function () {
    this.grid.batchUpdate();
  };

  GridStack.prototype.commit = function () {
    this.grid.commit();
    this._updateContainerHeight();
  };

  GridStack.prototype.isAreaEmpty = function (x, y, width, height) {
    return this.grid.isAreaEmpty(x, y, width, height);
  };

  GridStack.prototype.setStatic = function (staticValue) {
    this.opts.staticGrid = (staticValue === true);
    this.enableMove(!staticValue);
    this.enableResize(!staticValue);
    this._setStaticClass();
  };

  GridStack.prototype._setStaticClass = function () {
    var staticClassName = 'grid-stack-static';

    if (this.opts.staticGrid === true) {
      this.container.addClass(staticClassName);
    } else {
      this.container.removeClass(staticClassName);
    }
  };

  GridStack.prototype._updateNodeWidths = function (oldWidth, newWidth) {
    this.grid._sortNodes();
    this.grid.batchUpdate();
    var node = {};
    for (var i = 0; i < this.grid.nodes.length; i++) {
      node = this.grid.nodes[i];
      this.update(node.el, Math.round(node.x * newWidth / oldWidth), undefined,
        Math.round(node.width * newWidth / oldWidth), undefined);
    }
    this.grid.commit();
  };

  GridStack.prototype.setGridWidth = function (gridWidth, doNotPropagate) {
    this.container.removeClass('grid-stack-' + this.opts.width);
    if (doNotPropagate !== true) {
      this._updateNodeWidths(this.opts.width, gridWidth);
    }
    this.opts.width = gridWidth;
    this.grid.width = gridWidth;
    this.container.addClass('grid-stack-' + gridWidth);
  };

  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  GridStackEngine.prototype.batch_update = obsolete(GridStackEngine.prototype.batchUpdate);
  GridStackEngine.prototype._fix_collisions = obsolete(GridStackEngine.prototype._fixCollisions,
    '_fix_collisions', '_fixCollisions');
  GridStackEngine.prototype.is_area_empty = obsolete(GridStackEngine.prototype.isAreaEmpty,
    'is_area_empty', 'isAreaEmpty');
  GridStackEngine.prototype._sort_nodes = obsolete(GridStackEngine.prototype._sortNodes,
    '_sort_nodes', '_sortNodes');
  GridStackEngine.prototype._pack_nodes = obsolete(GridStackEngine.prototype._packNodes,
    '_pack_nodes', '_packNodes');
  GridStackEngine.prototype._prepare_node = obsolete(GridStackEngine.prototype._prepareNode,
    '_prepare_node', '_prepareNode');
  GridStackEngine.prototype.clean_nodes = obsolete(GridStackEngine.prototype.cleanNodes,
    'clean_nodes', 'cleanNodes');
  GridStackEngine.prototype.get_dirty_nodes = obsolete(GridStackEngine.prototype.getDirtyNodes,
    'get_dirty_nodes', 'getDirtyNodes');
  GridStackEngine.prototype.add_node = obsolete(GridStackEngine.prototype.addNode,
    'add_node', 'addNode, ');
  GridStackEngine.prototype.remove_node = obsolete(GridStackEngine.prototype.removeNode,
    'remove_node', 'removeNode');
  GridStackEngine.prototype.can_move_node = obsolete(GridStackEngine.prototype.canMoveNode,
    'can_move_node', 'canMoveNode');
  GridStackEngine.prototype.move_node = obsolete(GridStackEngine.prototype.moveNode,
    'move_node', 'moveNode');
  GridStackEngine.prototype.get_grid_height = obsolete(GridStackEngine.prototype.getGridHeight,
    'get_grid_height', 'getGridHeight');
  GridStackEngine.prototype.begin_update = obsolete(GridStackEngine.prototype.beginUpdate,
    'begin_update', 'beginUpdate');
  GridStackEngine.prototype.end_update = obsolete(GridStackEngine.prototype.endUpdate,
    'end_update', 'endUpdate');
  GridStackEngine.prototype.can_be_placed_with_respect_to_height =
    obsolete(GridStackEngine.prototype.canBePlacedWithRespectToHeight,
      'can_be_placed_with_respect_to_height', 'canBePlacedWithRespectToHeight');
  GridStack.prototype._trigger_change_event = obsolete(GridStack.prototype._triggerChangeEvent,
    '_trigger_change_event', '_triggerChangeEvent');
  GridStack.prototype._init_styles = obsolete(GridStack.prototype._initStyles,
    '_init_styles', '_initStyles');
  GridStack.prototype._update_styles = obsolete(GridStack.prototype._updateStyles,
    '_update_styles', '_updateStyles');
  GridStack.prototype._update_container_height = obsolete(GridStack.prototype._updateContainerHeight,
    '_update_container_height', '_updateContainerHeight');
  GridStack.prototype._is_one_column_mode = obsolete(GridStack.prototype._isOneColumnMode,
    '_is_one_column_mode', '_isOneColumnMode');
  GridStack.prototype._prepare_element = obsolete(GridStack.prototype._prepareElement,
    '_prepare_element', '_prepareElement');
  GridStack.prototype.set_animation = obsolete(GridStack.prototype.setAnimation,
    'set_animation', 'setAnimation');
  GridStack.prototype.add_widget = obsolete(GridStack.prototype.addWidget,
    'add_widget', 'addWidget');
  GridStack.prototype.make_widget = obsolete(GridStack.prototype.makeWidget,
    'make_widget', 'makeWidget');
  GridStack.prototype.will_it_fit = obsolete(GridStack.prototype.willItFit,
    'will_it_fit', 'willItFit');
  GridStack.prototype.remove_widget = obsolete(GridStack.prototype.removeWidget,
    'remove_widget', 'removeWidget');
  GridStack.prototype.remove_all = obsolete(GridStack.prototype.removeAll,
    'remove_all', 'removeAll');
  GridStack.prototype.min_height = obsolete(GridStack.prototype.minHeight,
    'min_height', 'minHeight');
  GridStack.prototype.min_width = obsolete(GridStack.prototype.minWidth,
    'min_width', 'minWidth');
  GridStack.prototype._update_element = obsolete(GridStack.prototype._updateElement,
    '_update_element', '_updateElement');
  GridStack.prototype.cell_height = obsolete(GridStack.prototype.cellHeight,
    'cell_height', 'cellHeight');
  GridStack.prototype.cell_width = obsolete(GridStack.prototype.cellWidth,
    'cell_width', 'cellWidth');
  GridStack.prototype.get_cell_from_pixel = obsolete(GridStack.prototype.getCellFromPixel,
    'get_cell_from_pixel', 'getCellFromPixel');
  GridStack.prototype.batch_update = obsolete(GridStack.prototype.batchUpdate,
    'batch_update', 'batchUpdate');
  GridStack.prototype.is_area_empty = obsolete(GridStack.prototype.isAreaEmpty,
    'is_area_empty', 'isAreaEmpty');
  GridStack.prototype.set_static = obsolete(GridStack.prototype.setStatic,
    'set_static', 'setStatic');
  GridStack.prototype._set_static_class = obsolete(GridStack.prototype._setStaticClass,
    '_set_static_class', '_setStaticClass');
  // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

  scope.GridStackUI = GridStack;

  scope.GridStackUI.Utils = Utils;
  scope.GridStackUI.Engine = GridStackEngine;
  scope.GridStackUI.GridStackDragDropPlugin = GridStackDragDropPlugin;

  $.fn.gridstack = function (opts) {
    return this.each(function () {
      var o = $(this);
      if (!o.data('gridstack')) {
        o
          .data('gridstack', new GridStack(this, opts));
      }
    });
  };

  return scope.GridStackUI;
});

/**
 * gridstack.js 0.3.0
 * http://troolee.github.io/gridstack.js/
 * (c) 2014-2016 Pavel Reznikov, Dylan Weiss
 * gridstack.js may be freely distributed under the MIT license.
 * @preserve
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'lodash', 'gridstack', 'jquery-ui/data', 'jquery-ui/disable-selection', 'jquery-ui/focusable',
      'jquery-ui/form', 'jquery-ui/ie', 'jquery-ui/keycode', 'jquery-ui/labels', 'jquery-ui/jquery-1-7',
      'jquery-ui/plugin', 'jquery-ui/safe-active-element', 'jquery-ui/safe-blur', 'jquery-ui/scroll-parent',
      'jquery-ui/tabbable', 'jquery-ui/unique-id', 'jquery-ui/version', 'jquery-ui/widget',
      'jquery-ui/widgets/mouse', 'jquery-ui/widgets/draggable', 'jquery-ui/widgets/droppable',
      'jquery-ui/widgets/resizable'
    ], factory);
  } else if (typeof exports !== 'undefined') {
    try {
      jQuery = require('jquery');
    } catch (e) {}
    try {
      _ = require('lodash');
    } catch (e) {}
    try {
      GridStackUI = require('gridstack');
    } catch (e) {}
    factory(jQuery, _, GridStackUI);
  } else {
    factory(jQuery, _, GridStackUI);
  }
})(function ($, _, GridStackUI) {

  var scope = window;

  /**
   * @class JQueryUIGridStackDragDropPlugin
   * jQuery UI implementation of drag'n'drop gridstack plugin.
   */
  function JQueryUIGridStackDragDropPlugin(grid) {
    GridStackUI.GridStackDragDropPlugin.call(this, grid);
  }

  GridStackUI.GridStackDragDropPlugin.registerPlugin(JQueryUIGridStackDragDropPlugin);

  JQueryUIGridStackDragDropPlugin.prototype = Object.create(GridStackUI.GridStackDragDropPlugin.prototype);
  JQueryUIGridStackDragDropPlugin.prototype.constructor = JQueryUIGridStackDragDropPlugin;

  JQueryUIGridStackDragDropPlugin.prototype.resizable = function (el, opts) {
    el = $(el);
    if (opts === 'disable' || opts === 'enable') {
      el.resizable(opts);
    } else if (opts === 'option') {
      var key = arguments[2];
      var value = arguments[3];
      el.resizable(opts, key, value);
    } else {
      el.resizable(_.extend({}, this.grid.opts.resizable, {
        start: opts.start || function () {},
        stop: opts.stop || function () {},
        resize: opts.resize || function () {}
      }));
    }
    return this;
  };

  JQueryUIGridStackDragDropPlugin.prototype.draggable = function (el, opts) {
    el = $(el);
    if (opts === 'disable' || opts === 'enable') {
      el.draggable(opts);
    } else {
      el.draggable(_.extend({}, this.grid.opts.draggable, {
        containment: this.grid.opts.isNested ? this.grid.container.parent() : null,
        start: opts.start || function () {},
        stop: opts.stop || function () {},
        drag: opts.drag || function () {}
      }));
    }
    return this;
  };

  JQueryUIGridStackDragDropPlugin.prototype.droppable = function (el, opts) {
    el = $(el);
    if (opts === 'disable' || opts === 'enable') {
      el.droppable(opts);
    } else {
      el.droppable({
        accept: opts.accept
      });
    }
    return this;
  };

  JQueryUIGridStackDragDropPlugin.prototype.isDroppable = function (el, opts) {
    el = $(el);
    return Boolean(el.data('droppable'));
  };

  JQueryUIGridStackDragDropPlugin.prototype.on = function (el, eventName, callback) {
    $(el).on(eventName, callback);
    return this;
  };

  return JQueryUIGridStackDragDropPlugin;
});