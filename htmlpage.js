function HtmlPage () {
}
HtmlPage.prototype.Fetch = function (url, callback, args) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4)
            return;
        var dom = document.implementation.createHTMLDocument("");
        var range = dom.createRange();
        range.selectNodeContents(dom.documentElement);
        range.deleteContents();
        var node = range.createContextualFragment(xhr.responseText);
        dom.documentElement.appendChild(node);
        if (callback)
            callback(dom, xhr.status, args);
    };
    xhr.send();
};
