function HtmlPage () {
    this._xhr = null;
}
HtmlPage.prototype.Fetch = function (url, callback, args) {
    this._xhr = new XMLHttpRequest();
    this._xhr.open("GET", url, true);
    this._xhr._owner = this;
    this._xhr.onreadystatechange = function () {
        if (this.readyState != 4)
            return;
        var dom = document.implementation.createHTMLDocument("");
        var range = dom.createRange();
        range.selectNodeContents(dom.documentElement);
        range.deleteContents();
        var node = range.createContextualFragment(this.responseText);
        dom.documentElement.appendChild(node);
        if (callback)
            callback(dom, this.status, args);
        this._owner._xhr = null;
    };
    this._xhr.send();
};
