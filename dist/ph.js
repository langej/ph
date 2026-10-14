// src/utils/Base.ts
class Base extends HTMLElement {
  #disposes = [];
  log(...content) {
    const id = this.id ? ` #${this.id}` : "";
    const name = this.getAttribute("name") ? ` :${this.getAttribute("name")}` : "";
    console.log(`[${this.tagName}${name}${id}]`, ...content);
  }
  mount() {}
  unmount() {}
  connectedCallback() {
    this.mount();
  }
  disconnectedCallback() {
    this.unmount();
    this.#disposes?.forEach((d) => d());
    this.#disposes = [];
  }
  on(event, cb) {
    this.#disposes?.push(() => this.removeEventListener(event, cb));
    return this.addEventListener(event, cb);
  }
  getHost() {
    const root = this.getRootNode();
    return root.host ?? root;
  }
  emit(event, detail, options) {
    const ev = !detail ? new Event(event, { composed: options?.composed ?? true, bubbles: options?.bubbles ?? true, cancelable: options?.cancelable ?? false }) : new CustomEvent(event, {
      detail,
      composed: options?.composed ?? true,
      bubbles: options?.bubbles ?? true,
      cancelable: options?.cancelable ?? false
    });
    this.dispatchEvent(ev);
  }
  onRemove(fn) {
    this.#disposes.push(fn);
  }
}

// node_modules/@preact/signals-core/dist/signals-core.module.js
var i = Symbol.for("preact-signals");
function t() {
  if (!(s > 1)) {
    var i, t = false;
    while (h !== undefined) {
      var r = h;
      h = undefined;
      f++;
      while (r !== undefined) {
        var o = r.o;
        r.o = undefined;
        r.f &= -3;
        if (!(8 & r.f) && c(r))
          try {
            r.c();
          } catch (r) {
            if (!t) {
              i = r;
              t = true;
            }
          }
        r = o;
      }
    }
    f = 0;
    s--;
    if (t)
      throw i;
  } else
    s--;
}
var o = undefined;
function n(i) {
  var t = o;
  o = undefined;
  try {
    return i();
  } finally {
    o = t;
  }
}
var h = undefined;
var s = 0;
var f = 0;
var v = 0;
function e(i) {
  if (o !== undefined) {
    var t = i.n;
    if (t === undefined || t.t !== o) {
      t = { i: 0, S: i, p: o.s, n: undefined, t: o, e: undefined, x: undefined, r: t };
      if (o.s !== undefined)
        o.s.n = t;
      o.s = t;
      i.n = t;
      if (32 & o.f)
        i.S(t);
      return t;
    } else if (t.i === -1) {
      t.i = 0;
      if (t.n !== undefined) {
        t.n.p = t.p;
        if (t.p !== undefined)
          t.p.n = t.n;
        t.p = o.s;
        t.n = undefined;
        o.s.n = t;
        o.s = t;
      }
      return t;
    }
  }
}
function u(i, t) {
  this.v = i;
  this.i = 0;
  this.n = undefined;
  this.t = undefined;
  this.W = t == null ? undefined : t.watched;
  this.Z = t == null ? undefined : t.unwatched;
  this.name = t == null ? undefined : t.name;
}
u.prototype.brand = i;
u.prototype.h = function() {
  return true;
};
u.prototype.S = function(i) {
  var t = this, r = this.t;
  if (r !== i && i.e === undefined) {
    i.x = r;
    this.t = i;
    if (r !== undefined)
      r.e = i;
    else
      n(function() {
        var i;
        (i = t.W) == null || i.call(t);
      });
  }
};
u.prototype.U = function(i) {
  var t = this;
  if (this.t !== undefined) {
    var { e: r, x: o } = i;
    if (r !== undefined) {
      r.x = o;
      i.e = undefined;
    }
    if (o !== undefined) {
      o.e = r;
      i.x = undefined;
    }
    if (i === this.t) {
      this.t = o;
      if (o === undefined)
        n(function() {
          var i;
          (i = t.Z) == null || i.call(t);
        });
    }
  }
};
u.prototype.subscribe = function(i) {
  var t = this;
  return E(function() {
    var r = t.value, n = o;
    o = undefined;
    try {
      i(r);
    } finally {
      o = n;
    }
  }, { name: "sub" });
};
u.prototype.valueOf = function() {
  return this.value;
};
u.prototype.toString = function() {
  return this.value + "";
};
u.prototype.toJSON = function() {
  return this.value;
};
u.prototype.peek = function() {
  var i = o;
  o = undefined;
  try {
    return this.value;
  } finally {
    o = i;
  }
};
Object.defineProperty(u.prototype, "value", { get: function() {
  var i = e(this);
  if (i !== undefined)
    i.i = this.i;
  return this.v;
}, set: function(i) {
  if (i !== this.v) {
    if (f > 100)
      throw new Error("Cycle detected");
    this.v = i;
    this.i++;
    v++;
    s++;
    try {
      for (var r = this.t;r !== undefined; r = r.x)
        r.t.N();
    } finally {
      t();
    }
  }
} });
function d(i, t) {
  return new u(i, t);
}
function c(i) {
  for (var t = i.s;t !== undefined; t = t.n)
    if (t.S.i !== t.i || !t.S.h() || t.S.i !== t.i)
      return true;
  return false;
}
function a(i) {
  for (var t = i.s;t !== undefined; t = t.n) {
    var r = t.S.n;
    if (r !== undefined)
      t.r = r;
    t.S.n = t;
    t.i = -1;
    if (t.n === undefined) {
      i.s = t;
      break;
    }
  }
}
function l(i) {
  var t = i.s, r = undefined;
  while (t !== undefined) {
    var o = t.p;
    if (t.i === -1) {
      t.S.U(t);
      if (o !== undefined)
        o.n = t.n;
      if (t.n !== undefined)
        t.n.p = o;
    } else
      r = t;
    t.S.n = t.r;
    if (t.r !== undefined)
      t.r = undefined;
    t = o;
  }
  i.s = r;
}
function y(i, t) {
  u.call(this, undefined);
  this.x = i;
  this.s = undefined;
  this.g = v - 1;
  this.f = 4;
  this.W = t == null ? undefined : t.watched;
  this.Z = t == null ? undefined : t.unwatched;
  this.name = t == null ? undefined : t.name;
}
y.prototype = new u;
y.prototype.h = function() {
  this.f &= -3;
  if (1 & this.f)
    return false;
  if ((36 & this.f) == 32)
    return true;
  this.f &= -5;
  if (this.g === v)
    return true;
  this.g = v;
  this.f |= 1;
  if (this.i > 0 && !c(this)) {
    this.f &= -2;
    return true;
  }
  var i = o;
  try {
    a(this);
    o = this;
    var t = this.x();
    if (16 & this.f || this.v !== t || this.i === 0) {
      this.v = t;
      this.f &= -17;
      this.i++;
    }
  } catch (i) {
    this.v = i;
    this.f |= 16;
    this.i++;
  }
  o = i;
  l(this);
  this.f &= -2;
  return true;
};
y.prototype.S = function(i) {
  if (this.t === undefined) {
    this.f |= 36;
    for (var t = this.s;t !== undefined; t = t.n)
      t.S.S(t);
  }
  u.prototype.S.call(this, i);
};
y.prototype.U = function(i) {
  if (this.t !== undefined) {
    u.prototype.U.call(this, i);
    if (this.t === undefined) {
      this.f &= -33;
      for (var t = this.s;t !== undefined; t = t.n)
        t.S.U(t);
    }
  }
};
y.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (var i = this.t;i !== undefined; i = i.x)
      i.t.N();
  }
};
Object.defineProperty(y.prototype, "value", { get: function() {
  if (1 & this.f)
    throw new Error("Cycle detected");
  var i = e(this);
  this.h();
  if (i !== undefined)
    i.i = this.i;
  if (16 & this.f)
    throw this.v;
  return this.v;
} });
function w(i, t) {
  return new y(i, t);
}
function _(i) {
  var r = i.u;
  i.u = undefined;
  if (typeof r == "function") {
    s++;
    var n = o;
    o = undefined;
    try {
      r();
    } catch (t) {
      i.f &= -2;
      i.f |= 8;
      b(i);
      throw t;
    } finally {
      o = n;
      t();
    }
  }
}
function b(i) {
  for (var t = i.s;t !== undefined; t = t.n)
    t.S.U(t);
  i.x = undefined;
  i.s = undefined;
  _(i);
}
function g(i) {
  if (o !== this)
    throw new Error("Out-of-order effect");
  l(this);
  o = i;
  this.f &= -2;
  if (8 & this.f)
    b(this);
  t();
}
function p(i, t) {
  this.x = i;
  this.u = undefined;
  this.s = undefined;
  this.o = undefined;
  this.f = 32;
  this.name = t == null ? undefined : t.name;
}
p.prototype.c = function() {
  var i = this.S();
  try {
    if (8 & this.f)
      return;
    if (this.x === undefined)
      return;
    var t = this.x();
    if (typeof t == "function")
      this.u = t;
  } finally {
    i();
  }
};
p.prototype.S = function() {
  if (1 & this.f)
    throw new Error("Cycle detected");
  this.f |= 1;
  this.f &= -9;
  _(this);
  a(this);
  s++;
  var i = o;
  o = this;
  return g.bind(this, i);
};
p.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 2;
    this.o = h;
    h = this;
  }
};
p.prototype.d = function() {
  this.f |= 8;
  if (!(1 & this.f))
    b(this);
};
p.prototype.dispose = function() {
  this.d();
};
function E(i, t) {
  var r = new p(i, t);
  try {
    r.c();
  } catch (i) {
    r.d();
    throw i;
  }
  var o = r.d.bind(r);
  o[Symbol.dispose] = o;
  return o;
}

// src/utils/Utils.ts
var replaceHandlebars = (input, fn) => input.replace(/{{[^{}]*}}/g, (result) => fn(result.replace(/[{}]/g, "")));
var TW = document.createTreeWalker.bind(document);
var defineComponent = (tag, spec) => !customElements.get(tag) && customElements.define(tag, spec);
var toCamelCase = (name) => name.replace(/-[a-z]/g, (m) => m[1].toUpperCase());
var phSlotSyntax = (input, replaceContent) => {
  return replaceHandlebars(input, (m) => {
    let content = m.replace(/[{}]/g, " ");
    if (replaceContent)
      content = replaceContent(content);
    return `<ph-slot value="${content}"></ph-slot>`;
  });
};
var createContextComputed = (context, statement) => {
  const body = statement;
  return Function("context", "computed", `with(context){return computed(() => ${body})}`)(context, w);
};
var createContextMethod = (context, statement, parameterList = "") => {
  const body = statement ?? "";
  const isAsync = statement?.includes("await");
  return Function("context", `return ${isAsync ? "async" : ""} function(${parameterList}){with (context) {${body}}}`)(context);
};
var noTemplateTreeWalker = (root) => {
  return TW(root, NodeFilter.SHOW_ELEMENT, (node) => node.nodeType === Node.ELEMENT_NODE && node.tagName !== "TEMPLATE" ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT);
};
var allElementsTreeWalker = (root, filter) => {
  return TW(root, NodeFilter.SHOW_ELEMENT, filter);
};
var delayProcessing = (callback) => {
  queueMicrotask(callback);
};
var executeDeferredUnmount = (element, onRemove) => {
  if (!(element instanceof HTMLElement)) {
    onRemove();
    return;
  }
  let isDeferred = false;
  const event = new CustomEvent("beforeremove", {
    detail: {
      defer: (promise) => {
        isDeferred = true;
        promise.then(onRemove);
      }
    },
    cancelable: true
  });
  element.dispatchEvent(event);
  if (isDeferred)
    return;
  const leaveClass = element.getAttribute("ph-leave-class");
  if (leaveClass) {
    element.classList.add(...leaveClass.split(" "));
  }
  const animations = element.getAnimations?.() || [];
  if (animations.length > 0) {
    Promise.all(animations.map((a) => a.finished)).then(onRemove).catch(onRemove);
  } else {
    onRemove();
  }
};

// src/elements/declarations/Context.ts
var getTypedValue = ({ value, context }) => {
  try {
    return createContextMethod(context, `return ${value}`)();
  } catch (error) {
    console.error(error);
  }
};
var getAttributes = (element) => {
  const context = resolveContext(element), name = element.getAttribute("name"), value = element.getAttribute("value");
  return { context, name, value };
};
var CONTEXT = Symbol();
var ADD_SIGNAL = Symbol();
var ADD_COMPUTED = Symbol();
var ADD_METHOD = Symbol();
var ADD_CONST = Symbol();
var ADD_SLOT = Symbol();
var resolveContext = (node) => {
  let current = node;
  while (current && current !== document) {
    if (current[CONTEXT])
      return current[CONTEXT];
    if (current instanceof ShadowRoot)
      current = current.host;
    else
      current = current.parentNode;
  }
  return document[CONTEXT];
};

class Context {
  slots = {};
  constructor() {
    this[ADD_SLOT]("default");
  }
  [ADD_SLOT](name) {
    const s = d([]);
    Object.defineProperty(this.slots, name, {
      get() {
        return s.value;
      },
      set(v) {
        s.value = v;
      }
    });
  }
  [ADD_SIGNAL](name, s) {
    Object.defineProperty(this, name, {
      get() {
        return s.value;
      },
      set(v) {
        s.value = v;
      }
    });
  }
  [ADD_COMPUTED](name, c) {
    Object.defineProperty(this, name, {
      get() {
        return c.value;
      }
    });
  }
  [ADD_METHOD](name, m) {
    Object.defineProperty(this, name, {
      value: m
    });
  }
  [ADD_CONST](name, v) {
    Object.defineProperty(this, name, { value: v, writable: false });
  }
}

class PhSignal extends Base {
  #handleLocalStorage(localStorageAttribute, name, context) {
    if (localStorageAttribute !== null) {
      const localStoragePrefix = localStorageAttribute ? localStorageAttribute + "/" : "", key = localStoragePrefix + name, localStorageValue = localStorage.getItem(key);
      if (localStorageValue)
        context[name] = JSON.parse(localStorageValue);
      E(() => {
        localStorage.setItem(key, JSON.stringify(context[name]));
      });
    }
  }
  mount() {
    const { name, value, context } = getAttributes(this);
    if (name && value && context) {
      const typedValue = getTypedValue({ value, context }), localStorageAttribute = this.getAttribute("local-storage");
      context[ADD_SIGNAL](name, d(typedValue));
      if (localStorageAttribute !== null)
        this.#handleLocalStorage(localStorageAttribute, name, context);
    }
    this.remove();
  }
}

class PhComputed extends Base {
  mount() {
    const { name, value, context } = getAttributes(this);
    if (name && value && context) {
      const typedValue = createContextComputed(context, value);
      context[ADD_COMPUTED](name, typedValue);
    }
    this.remove();
  }
}

class PhConst extends Base {
  mount() {
    const { name, value, context } = getAttributes(this);
    if (name && value && context) {
      const typedValue = getTypedValue({ value, context });
      context[ADD_CONST](name, typedValue);
    }
    this.remove();
  }
}

class PhMethod extends Base {
  mount() {
    this.style.display = "none";
    const { context, name } = getAttributes(this), scriptElement = this.querySelector("script"), body = scriptElement?.textContent.trim() ?? "", args = scriptElement?.getAttribute("args")?.split(",")?.map((arg) => {
      const [argName, argType] = arg.split(":").map((a) => a.trim());
      return { name: argName, type: argType };
    }), joined = args?.map((arg) => arg.name).join(",");
    if (name && context && body) {
      const method = createContextMethod(context, body, joined);
      context[ADD_METHOD](name, method);
    } else {
      if (!context)
        this.log("no context provided!");
      if (!body)
        this.log("no body provided!");
    }
    this.remove();
  }
}

// src/utils/Attributes.ts
var Directives = {
  "bind:": "bind:",
  "bool:": "bool:",
  "on:": "on:",
  "prop:": "prop:",
  "ph:": "ph:"
};
var AttributeMapping = {
  "@": (name) => name.replace("@", Directives["on:"]),
  ".": (name) => name.replace(".", Directives["prop:"]),
  "?": (name) => name.replace("?", Directives["bool:"]),
  ":": (name) => name.replace(":", Directives["bind:"]),
  "*": (name) => name.replace("*", Directives["ph:"])
};
var modifiers = {
  ctrl: () => (e) => e.ctrlKey,
  shift: () => (e) => e.shiftKey,
  alt: () => (e) => e.altKey,
  meta: () => (e) => e.metaKey,
  enter: () => (e) => e.key === "Enter",
  escape: () => (e) => e.key === "Escape",
  throttle: (delay) => {
    let lastCall = 0;
    return () => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return true;
      }
    };
  },
  debounce: (delay) => {
    let timeout;
    return (callback) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        callback();
      }, delay);
    };
  }
};
var renameShortcutAttributesInTemplate = (template) => {
  const tw = allElementsTreeWalker(template);
  while (tw.nextNode()) {
    renameShortcutAttributes(tw.currentNode);
  }
};
var processAttributesForChildrenElements = (root, context) => {
  const disposes = [], elements = [], tw = noTemplateTreeWalker(root);
  while (tw.nextNode()) {
    elements.push(tw.currentNode);
  }
  for (const element of elements) {
    disposes.push(...processAttributes(element, context));
  }
  return disposes;
};
var renameShortcutAttributes = (element) => {
  for (const attributeName of element.getAttributeNames()) {
    const name = attributeName, replacedAttributeName = AttributeMapping[name[0]]?.(name), value = element.getAttribute(name);
    if (replacedAttributeName && value) {
      element.setAttribute(replacedAttributeName, value);
      element.removeAttribute(name);
    }
  }
};
var processAttributes = (element, context) => {
  const disposes = [], attributeNames = element.getAttributeNames();
  for (const attributeName of attributeNames) {
    const attributeValue = element.getAttribute(attributeName), attributeExists = attributeValue && attributeValue !== "";
    if (attributeExists) {
      if (attributeName.startsWith(Directives["on:"])) {
        const [eventName, ...mods] = attributeName.replace(Directives["on:"], "").split("."), modFilters = [], eventOptions = {}, eventListener = createContextMethod(context, attributeValue, "$e");
        let shouldPreventDefault = false, shouldStopPropagation = false, debounceFn;
        mods.forEach((mod) => {
          const [name, ...args] = mod.split(":");
          switch (name) {
            case "once":
              eventOptions.once = true;
              break;
            case "passive":
              eventOptions.passive = true;
              break;
            case "capture":
              eventOptions.capture = true;
              break;
            case "prevent":
              shouldPreventDefault = true;
              break;
            case "stop":
              shouldStopPropagation = true;
              break;
            case "debounce":
              debounceFn = modifiers.debounce(Number(args[0]));
              break;
            default:
              if (modifiers[name])
                modFilters.push(modifiers[name]?.(...args));
          }
        });
        delayProcessing(() => {
          element.addEventListener(eventName, (e) => {
            if (shouldPreventDefault)
              e.preventDefault();
            if (shouldStopPropagation)
              e.stopPropagation();
            if (modFilters.every((m) => m(e))) {
              if (debounceFn)
                debounceFn(() => eventListener(e));
              else
                eventListener(e);
            }
          }, eventOptions);
        });
        element.removeAttribute(attributeName);
      }
      if (attributeName.startsWith(Directives["bind:"])) {
        const computed = createContextComputed(context, attributeValue), name = attributeName.replace(Directives["bind:"], "");
        disposes.push(E(() => {
          if (computed.value !== undefined && computed.value !== null)
            element.setAttribute(name, computed.value);
          else
            element.removeAttribute(name);
        }));
        element.removeAttribute(attributeName);
      }
      if (attributeName.startsWith(Directives["prop:"])) {
        const name = toCamelCase(attributeName.replace(Directives["prop:"], "")), computed = createContextComputed(context, attributeValue);
        disposes.push(E(() => {
          const target = element[CONTEXT] ?? element;
          if (target[name] !== computed.value)
            target[name] = computed.value;
        }));
        element.removeAttribute(attributeName);
      }
      if (attributeName.startsWith(Directives["bool:"])) {
        const name = attributeName.replace(Directives["bool:"], ""), computed = createContextComputed(context, attributeValue);
        disposes.push(E(() => {
          if (computed.value)
            element.toggleAttribute(name, true);
          else
            element.toggleAttribute(name, false);
        }));
        element.removeAttribute(attributeName);
      }
      if (attributeName.startsWith(Directives["ph:"])) {
        const name = attributeName.replace(Directives["ph:"], "");
        if (name === "if") {
          const computed = createContextComputed(context, attributeValue), comment = document.createComment("ph-if");
          element.before(comment);
          disposes.push(E(() => {
            if (Boolean(computed.value)) {
              if (!element.isConnected)
                comment.after(element);
            } else {
              if (element.isConnected)
                element.remove();
            }
          }));
        } else if (name === "show") {
          const computed = createContextComputed(context, attributeValue), displayValue = element.style.display;
          disposes.push(E(() => {
            if (computed.value)
              element.style.display = displayValue;
            else
              element.style.display = "none";
          }));
        } else if (name !== "each" && name !== "key")
          element.removeAttribute(attributeName);
        if (name === "if" || name === "show")
          element.removeAttribute(attributeName);
      }
    }
  }
  return disposes;
};

// src/elements/control-flow/For.ts
var createElement = (content) => {
  const el = content.cloneNode(true);
  el.innerHTML = phSlotSyntax(el.innerHTML);
  return el;
};

class PhFor extends Base {
  static processForElements(root) {
    for (const template of root.querySelectorAll("template[ph\\:each]")) {
      PhFor.fromTemplate(template);
    }
  }
  mount() {
    this.style.display = "contents";
    renameShortcutAttributes(this);
    const templateElement = this.firstElementChild, phEach = this.getAttribute("ph:each"), phKey = this.getAttribute("ph:key");
    if (templateElement?.tagName === "TEMPLATE") {
      if (phEach) {
        templateElement.setAttribute("ph:each", phEach);
        this.removeAttribute("ph:each");
      }
      if (phKey) {
        templateElement.setAttribute("ph:key", phKey);
        this.removeAttribute("ph:key");
      }
      PhFor.fromTemplate(templateElement);
    } else {
      throw Error("no template element provided");
    }
  }
  static fromTemplate(template) {
    renameShortcutAttributesInTemplate(template.content);
    template.before(document.createComment("ph-for begin"));
    template.after(document.createComment("ph-for end"));
    const eachAttribute = template.getAttribute("ph:each"), keyAttribute = template.getAttribute("ph:key"), { previousSibling: beginComment, nextSibling: endComment } = template, context = resolveContext(template), [definition, collection] = eachAttribute?.split(" in ") ?? [], [itemName, indexName] = definition.split(",").map((it) => it.trim());
    if (context && itemName && collection && template) {
      const computed = createContextComputed(context, collection);
      let renderedNodes = new Map;
      E(() => {
        const currentArray = computed.value || [], newRenderedNodes = new Map;
        let currentDomNode = beginComment?.nextSibling;
        for (let index = 0;index < currentArray.length; index++) {
          const item = currentArray[index], keyValue = (keyAttribute ? item[keyAttribute] : index) ?? index;
          let nodeData = renderedNodes.get(keyValue);
          if (nodeData) {
            nodeData.indexSignal.value = index;
            nodeData.context[itemName] = item;
            renderedNodes.delete(keyValue);
          } else {
            const childContext = new Context, content = template.content.firstElementChild, createdElement = createElement(content), idxSignal = d(index);
            Object.setPrototypeOf(childContext, context);
            childContext[ADD_SIGNAL](itemName, d(item));
            if (indexName)
              childContext[ADD_SIGNAL](indexName, idxSignal);
            if (!customElements.get(createdElement.localName)) {
              Object.defineProperty(createdElement, CONTEXT, { value: childContext, configurable: true });
            }
            PhFor.processForElements(createdElement);
            createdElement.disposes = [
              ...processAttributesForChildrenElements(createdElement, childContext),
              ...processAttributes(createdElement, childContext)
            ];
            nodeData = { el: createdElement, context: childContext, indexSignal: idxSignal };
          }
          if (nodeData.el === currentDomNode) {
            currentDomNode = currentDomNode.nextSibling;
          } else {
            endComment?.parentNode?.insertBefore(nodeData.el, currentDomNode || endComment);
          }
          newRenderedNodes.set(keyValue, nodeData);
        }
        renderedNodes.forEach((nodeData) => {
          nodeData.el.disposes?.forEach((d) => d());
          executeDeferredUnmount(nodeData.el, () => {
            nodeData.el.remove();
          });
        });
        renderedNodes = newRenderedNodes;
      });
    }
    template.remove();
  }
}

// src/elements/declarations/Store.ts
var READY = Symbol("ready");

class PhStore extends Base {
  #shadowroot = this.attachShadow({ mode: "open" });
  #context = new Context;
  get [CONTEXT]() {
    return this.#context;
  }
  async mount() {
    this.#context[ADD_CONST](READY, new Promise(async (resolve, reject) => {
      try {
        this.style.display = "none";
        const name = this.getAttribute("name"), template = this.querySelector("template"), clonedTemplate = template.cloneNode(true).content, watcher = [];
        document[CONTEXT][`$${name}`] = this[CONTEXT];
        let initFn;
        for (const script of clonedTemplate.querySelectorAll("script")) {
          script.setAttribute("type", "javascript/blocked");
          if (script.hasAttribute("init"))
            initFn = createContextMethod(this[CONTEXT], script.textContent);
          if (script.hasAttribute("watch"))
            watcher.push(createContextMethod(this[CONTEXT], script.textContent));
          if (script.parentElement?.tagName !== "PH-METHOD")
            script.remove();
        }
        const imports = await processImports(clonedTemplate);
        for (const [key, value] of imports) {
          this[CONTEXT][ADD_CONST](key, value);
        }
        this.#shadowroot.append(clonedTemplate);
        await initFn?.();
        Object.seal(this[CONTEXT]);
        for (const fn of watcher) {
          E(() => {
            fn();
          });
        }
        resolve(true);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    }));
  }
}

// src/elements/declarations/Component.ts
var processSlots = (root, context) => {
  let defaultSlot = undefined, namedSlots = [];
  root.querySelectorAll("slot").forEach((s) => {
    if (s.hasAttribute("name"))
      namedSlots.push(s);
    else
      defaultSlot ??= s;
  });
  for (const slot of namedSlots) {
    const name = slot.getAttribute("name");
    if (name)
      context[ADD_SLOT](name);
  }
  root.onslotchange = () => {
    context.slots.default = defaultSlot?.assignedElements() ?? [];
    for (const slot of namedSlots) {
      const name = slot.getAttribute("name");
      if (name && context.slots)
        context.slots[name] = slot.assignedElements();
    }
  };
};
var processRefs = (root, context) => {
  for (const element of root.querySelectorAll("[ph\\:ref]")) {
    const name = element.getAttribute("ph:ref");
    if (name)
      context[ADD_CONST](name, element);
    element.removeAttribute("ph:ref");
  }
};
var memoizedGlobalStylesheet = (() => {
  let cachedValue = null;
  return () => {
    if (cachedValue === null) {
      cachedValue = document.querySelector("style[global]");
    }
    return cachedValue;
  };
})();
var createStyles = (root, isInline = false) => {
  const styleElement = root.querySelector("style"), globalStyle = new CSSStyleSheet, baseStyle = new CSSStyleSheet, customStyle = new CSSStyleSheet;
  if (!styleElement?.hasAttribute("isolated")) {
    globalStyle.replaceSync(memoizedGlobalStylesheet()?.innerHTML ?? "");
  }
  baseStyle.replaceSync(`:host { display: ${isInline ? "inline-block" : "block"}; ${isInline ? "position: relative" : ""} }`);
  customStyle.replaceSync(styleElement?.textContent ?? "");
  styleElement?.remove();
  root.adoptedStyleSheets = [globalStyle, baseStyle, customStyle];
};
var constructCustomElement = (tag, spec) => {
  if (!tag)
    throw Error("no tag attribute was provided");
  if (!spec.template)
    throw Error("no template provided for component " + tag);
  const template = spec.template.cloneNode(true), observedAttributes = spec.attributes ?? [], observedProperties = spec.properties ?? [], importPromises = processImports(template.content);
  const ComponentClass = class extends Base {
    #shadowRoot;
    #disposes = [];
    #onRemoveFn = () => {};
    #isMounted = false;
    #context;
    get [CONTEXT]() {
      return this.#context;
    }
    static observedAttributes = observedAttributes;
    attributeChangedCallback(name, oldV, newV) {
      const camelCased = toCamelCase(name);
      if (this[CONTEXT] && oldV !== newV) {
        this[CONTEXT][camelCased] = newV;
      }
    }
    constructor() {
      super();
      const mode = spec.closedShadowRoot ? "closed" : "open";
      this.#shadowRoot = this.attachShadow({ mode });
      this.#context ??= new Context;
      Object.setPrototypeOf(this[CONTEXT], document[CONTEXT]);
      this[CONTEXT][ADD_CONST]("self", this);
      this[CONTEXT][ADD_CONST]("root", this.#shadowRoot);
      for (const property of observedProperties) {
        if (property) {
          const hasInitialValue = Object.prototype.hasOwnProperty.call(this, property), initialValue = hasInitialValue ? Reflect.get(this, property) : undefined;
          if (hasInitialValue && !Reflect.deleteProperty(this, property)) {
            throw new TypeError(`cannot initialize component property "${property}"`);
          }
          this[CONTEXT][ADD_SIGNAL](property, d(initialValue));
        }
      }
    }
    async mount() {
      if (this.#isMounted)
        return;
      this.#isMounted = true;
      for (const attribute of observedAttributes) {
        if (attribute) {
          const camelCased = toCamelCase(attribute);
          this[CONTEXT][ADD_SIGNAL](camelCased, d(this.getAttribute(attribute)));
          this.#disposes.push(E(() => {
            const value = this[CONTEXT][camelCased];
            if (value !== undefined && value !== null)
              this.setAttribute(attribute, value);
            else
              this.removeAttribute(attribute);
          }));
        }
      }
      const clonedTemplate = template.cloneNode(true).content, onMountElement = clonedTemplate.querySelector("script[on-mount]"), onRemoveElement = clonedTemplate.querySelector("script[on-remove]"), watchElements = clonedTemplate.querySelectorAll("script[watch]"), onMountFunction = onMountElement ? createContextMethod(this[CONTEXT], onMountElement.textContent) : undefined, onRemoveFunction = onRemoveElement ? createContextMethod(this[CONTEXT], onRemoveElement.textContent) : undefined, watcherFunctions = Array.from(watchElements).map((watchElement) => {
        const watchFn = createContextMethod(this[CONTEXT], watchElement.textContent);
        watchElement.remove();
        return watchFn;
      });
      this.#onRemoveFn = onRemoveFunction;
      onMountElement?.remove();
      onRemoveElement?.remove();
      renameShortcutAttributesInTemplate(clonedTemplate);
      processTemplateSyntax(clonedTemplate);
      processRefs(clonedTemplate, this[CONTEXT]);
      const storePromises = spec.stores?.map((store) => document[CONTEXT][`$${store}`][READY]);
      await Promise.all(storePromises ?? []);
      for (const store of spec.stores ?? []) {
        if (!this[CONTEXT][store])
          this[CONTEXT][ADD_CONST](store, document[CONTEXT][`$${store}`]);
      }
      const allImports = await importPromises;
      for (const [key, value] of allImports) {
        if (!this[CONTEXT][key])
          this[CONTEXT][ADD_CONST](key, value);
      }
      const root = this.#shadowRoot;
      root.replaceChildren();
      root.append(clonedTemplate);
      processSlots(this.#shadowRoot, this[CONTEXT]);
      PhFor.processForElements(root);
      await onMountFunction?.();
      const childrenDisposes = processAttributesForChildrenElements(root, this[CONTEXT]);
      this.#disposes.push(...childrenDisposes);
      Object.seal(this[CONTEXT]);
      for (const fn of watcherFunctions) {
        this.#disposes.push(E(() => {
          fn();
        }));
      }
      createStyles(root, spec.inline);
    }
    unmount() {
      this.#onRemoveFn?.();
      for (const d of this.#disposes) {
        d();
      }
      this.#disposes = [];
      this.#isMounted = false;
    }
  };
  for (const property of observedProperties) {
    if (!property)
      continue;
    Object.defineProperty(ComponentClass.prototype, property, {
      get() {
        return this[CONTEXT][property];
      },
      set(value) {
        this[CONTEXT][property] = value;
      },
      configurable: true
    });
  }
  defineComponent(tag, ComponentClass);
};
var processTemplateSyntax = (root) => {
  const tw = noTemplateTreeWalker(root);
  while (tw.nextNode()) {
    const element = tw.currentNode;
    element.innerHTML = phSlotSyntax(element.innerHTML);
  }
};
var parseImportAttribute = (importAttr) => {
  if (!importAttr)
    return;
  const result = {
    default: undefined,
    "*": undefined,
    named: []
  }, regular = /^(?<default>(\w+)\s*,?\s*)?(?<all>(\*\s+as\s+\w+)\s*,?\s*)?(?<named>\{[^}]+\})?$/, match = importAttr.match(regular), matchedGroups = match?.groups;
  result.named = [];
  if (matchedGroups) {
    if (matchedGroups["default"])
      result.default = matchedGroups["default"].replace(",", "").trim();
    if (matchedGroups["all"])
      result["*"] = matchedGroups["all"].replace("* as ", "").replace(",", "").trim();
    if (matchedGroups["named"]) {
      const namedContent = matchedGroups["named"].slice(1, -1), namedParts = namedContent.split(",").map((s) => s.trim());
      for (const entry of namedParts) {
        const asMatch = entry.match(/^(\w+)\s+as\s+(\w+)$/);
        if (asMatch) {
          result.named.push([asMatch[1], asMatch[2]]);
        } else {
          result.named.push(entry);
        }
      }
    }
  }
  return result;
};
var processImports = async (element) => {
  return Promise.all(Array.from(element.querySelectorAll("import[src]")).map(async (lib) => {
    const source = lib.getAttribute("src");
    if (!source) {
      console.error("Import element is missing src attribute", lib);
      return [];
    }
    const src = URL.parse(source)?.href ?? URL.parse(source, document.baseURI)?.href;
    if (!src) {
      console.error("Failed to resolve import source", source);
      return [];
    }
    const importedModule = await import(src), addToContext = [], imports = parseImportAttribute(lib.getAttribute("import"));
    if (imports) {
      if (imports.default)
        addToContext.push([imports.default, importedModule.default]);
      if (imports["*"])
        addToContext.push([imports["*"], importedModule]);
      for (const named of imports.named ?? []) {
        if (typeof named == "string") {
          const part = importedModule[named];
          if (part)
            addToContext.push([named, part]);
          else
            console.warn(`Import "${named}" not found in module ${src}`);
        } else {
          const [originalName, asName] = named, part = importedModule[originalName];
          if (part)
            addToContext.push([asName, part]);
          else
            console.warn(`Import "${originalName}" not found in module ${src}`);
        }
      }
    }
    lib.remove();
    return addToContext;
  })).then((allImports) => allImports.flat());
};

class PhComponent extends Base {
  mount() {
    const template = this.querySelector("template");
    if (template) {
      const tag = this.getAttribute("tag"), attributes = template.getAttribute("attributes")?.split(",")?.map((attribute) => attribute.split(":")[0].trim()), properties = template.getAttribute("properties")?.split(",")?.map((property) => property.split(":")[0].trim()), closedShadowRoot = template.hasAttribute("closed"), inline = template.hasAttribute("inline"), stores = template.getAttribute("use-stores")?.split(",")?.map((s) => s.trim()) ?? [];
      if (tag && template)
        constructCustomElement(tag, { template, attributes, properties, inline, closedShadowRoot, stores });
      else
        throw Error("no template element provided");
    }
    this.remove();
  }
}

// src/elements/control-flow/If.ts
class PhIf extends Base {
  #disposes = [];
  #children = [];
  #initialized = false;
  mount() {
    if (!this.#initialized) {
      this.#children = Array.from(this.childNodes);
      this.#initialized = true;
    }
    this.style.display = "inline flow";
    const value = this.getAttribute("value"), context = resolveContext(this);
    if (value && context) {
      const computed = createContextComputed(context, value);
      this.#disposes.push(...processAttributesForChildrenElements(this, context));
      this.#disposes.push(...processAttributes(this, context));
      this.#disposes.push(E(() => {
        const isTruthy = Boolean(computed.value);
        if (isTruthy) {
          if (this.childNodes.length === 0)
            this.append(...this.#children);
        } else {
          if (this.childNodes.length > 0) {
            for (const child of this.#children) {
              child.remove();
            }
          }
        }
      }));
    }
  }
  unmount() {
    for (const dispose of this.#disposes) {
      dispose();
    }
    this.#disposes = [];
  }
}

// src/elements/control-flow/Show.ts
class PhShow extends Base {
  #dispose;
  mount() {
    this.style.display = "inline flow";
    const value = this.getAttribute("value"), context = resolveContext(this);
    if (value && context) {
      const val = createContextComputed(context, value);
      this.#dispose = E(() => {
        if (val.value) {
          this.style.display = "inline flow";
        } else {
          this.style.display = "none";
        }
      });
    }
  }
  unmount() {
    this.#dispose?.();
  }
}

// src/elements/control-flow/Either.ts
class PhEither extends Base {
  #disposes = [];
  #trueChild;
  #falseChild;
  #initialized = false;
  mount() {
    this.style.display = "inline flow";
    const value = this.getAttribute("value"), context = resolveContext(this);
    if (value && context) {
      if (!this.#initialized) {
        const [True, False] = this.children;
        this.#trueChild = True;
        this.#falseChild = False;
        this.#initialized = true;
      }
      this.#disposes.push(...processAttributes(this, context));
      if (this.#trueChild instanceof Element) {
        this.#disposes.push(...processAttributesForChildrenElements(this.#trueChild, context));
        this.#disposes.push(...processAttributes(this.#trueChild, context));
      }
      if (this.#falseChild instanceof Element) {
        this.#disposes.push(...processAttributesForChildrenElements(this.#falseChild, context));
        this.#disposes.push(...processAttributes(this.#falseChild, context));
      }
      delayProcessing(() => {
        this.innerHTML = "";
        const computed = createContextComputed(context, value);
        let lastState = !!computed.value;
        if (lastState) {
          if (this.#trueChild)
            this.append(this.#trueChild);
        } else {
          if (this.#falseChild)
            this.append(this.#falseChild);
        }
        this.#disposes.push(E(() => {
          const currentState = !!computed.value;
          if (currentState === lastState)
            return;
          lastState = currentState;
          if (currentState) {
            if (this.firstChild && this.#trueChild) {
              this.firstChild.replaceWith(this.#trueChild);
            } else if (this.#trueChild) {
              this.append(this.#trueChild);
            }
          } else {
            if (this.firstChild && this.#falseChild) {
              this.firstChild.replaceWith(this.#falseChild);
            } else if (this.#falseChild) {
              this.append(this.#falseChild);
            }
          }
        }));
      });
    }
  }
  unmount() {
    for (const dispose of this.#disposes) {
      dispose();
    }
  }
}

// src/elements/Dynamic.ts
class PhDynamic extends Base {
  mount() {
    const is = this.getAttribute("is"), context = resolveContext(this), computed = createContextComputed(context, is);
    if (is && context) {
      E(() => {
        delayProcessing(() => {
          this.replaceWith(computed.value);
        });
      });
    }
  }
}

// src/elements/Slot.ts
class PhSlot extends Base {
  #dispose;
  mount() {
    this.style.display = "contents";
    const value = this.getAttribute("value"), context = resolveContext(this);
    delayProcessing(() => {
      if (value && context) {
        const computed = createContextComputed(context, value);
        this.#dispose = E(() => {
          this.textContent = computed.value;
        });
      }
    });
  }
  unmount() {
    this.#dispose?.();
  }
}

// src/elements/Router.ts
var normalizePath = (path) => {
  const normalized = path.replace(/\/+$/, "");
  return normalized || "/";
};
var matchRoute = (route, pathname) => {
  const path = route.getAttribute("path");
  if (!path)
    return;
  if (path === "*")
    return { route, params: {} };
  const routeSegments = normalizePath(path).split("/").filter(Boolean);
  const pathSegments = normalizePath(pathname).split("/").filter(Boolean);
  if (routeSegments.length !== pathSegments.length)
    return;
  const params = {};
  for (let index = 0;index < routeSegments.length; index++) {
    const routeSegment = routeSegments[index];
    const pathSegment = pathSegments[index];
    if (routeSegment.startsWith(":")) {
      params[routeSegment.slice(1)] = decodeURIComponent(pathSegment);
    } else if (routeSegment !== pathSegment) {
      return;
    }
  }
  return { route, params };
};

class PhRouter extends Base {
  mount() {
    this.style.display = "contents";
    this.render();
    const onPopState = () => this.render();
    window.addEventListener("popstate", onPopState);
    this.onRemove(() => window.removeEventListener("popstate", onPopState));
    const onNavigate = (event) => {
      const { path, replace } = event.detail;
      this.navigate(path, replace);
    };
    document.addEventListener("ph:navigate", onNavigate);
    this.onRemove(() => document.removeEventListener("ph:navigate", onNavigate));
    this.on("click", (event) => {
      const mouseEvent = event;
      const target = mouseEvent.target;
      const link = target instanceof Element ? target.closest("a[href]") : undefined;
      if (!link || mouseEvent.defaultPrevented || mouseEvent.button !== 0 || mouseEvent.metaKey || mouseEvent.ctrlKey || mouseEvent.shiftKey || mouseEvent.altKey)
        return;
      if (link.target || link.hasAttribute("download"))
        return;
      const url = new URL(link.getAttribute("href"), window.location.href);
      if (url.origin !== window.location.origin)
        return;
      event.preventDefault();
      this.navigate(`${url.pathname}${url.search}${url.hash}`);
    });
  }
  navigate(path, replace = false) {
    window.history[replace ? "replaceState" : "pushState"]({}, "", path);
    this.render();
  }
  render() {
    const routes = Array.from(this.children).filter((child) => child instanceof HTMLElement && child.hasAttribute("path"));
    const match = routes.map((route) => matchRoute(route, window.location.pathname)).find(Boolean);
    for (const route of routes) {
      const isActive = route === match?.route;
      route.hidden = !isActive;
      route.style.display = isActive ? "" : "none";
    }
    const router = {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      params: match?.params ?? {},
      route: match?.route,
      push: (path) => this.navigate(path),
      replace: (path) => this.navigate(path, true),
      back: () => window.history.back(),
      forward: () => window.history.forward()
    };
    document[CONTEXT].router = router;
    if (match)
      this.emit("routechange", { path: window.location.pathname, params: match.params, route: match.route });
  }
}

// src/init.ts
var navigate = (path, replace = false) => {
  document.dispatchEvent(new CustomEvent("ph:navigate", { detail: { path, replace } }));
};
var initialRouterState = {
  pathname: window.location.pathname,
  search: window.location.search,
  hash: window.location.hash,
  params: {},
  push: (path) => navigate(path),
  replace: (path) => navigate(path, true),
  back: () => window.history.back(),
  forward: () => window.history.forward()
};
var init = async () => {
  console.group("ph init");
  !document[CONTEXT] && Object.defineProperty(document, CONTEXT, {
    value: new Context,
    writable: false
  });
  !document[CONTEXT].router && document[CONTEXT][ADD_SIGNAL]("router", d(initialRouterState));
  defineComponent("ph-signal", PhSignal);
  defineComponent("ph-computed", PhComputed);
  defineComponent("ph-const", PhConst);
  defineComponent("ph-method", PhMethod);
  defineComponent("ph-store", PhStore);
  defineComponent("ph-for", PhFor);
  defineComponent("ph-either", PhEither);
  defineComponent("ph-show", PhShow);
  defineComponent("ph-if", PhIf);
  defineComponent("ph-slot", PhSlot);
  defineComponent("ph-router", PhRouter);
  defineComponent("ph-dynamic", PhDynamic);
  defineComponent("ph-component", PhComponent);
  const tw = noTemplateTreeWalker(document.body);
  while (tw.nextNode()) {
    const element = tw.currentNode;
    renameShortcutAttributes(element);
  }
  processTemplateSyntax(document.body);
  processAttributesForChildrenElements(document.body, document[CONTEXT]);
  PhFor.processForElements(document.body);
  console.groupEnd();
};

// src/ph.ts
var ph_default = {
  init
};
export {
  ph_default as default,
  init
};
