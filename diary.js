function Diary () {
    this._url = "http://www.tamurayukari.com/diary/index.html";
    this._id = "N/A";
}
Diary.prototype.Fetch = function (callback, args) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this._url, true);
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
            callback(dom, args);
    };
    xhr.send();
};
Diary.prototype.Notify = function (entry) {
    var title = entry.getElementsByClassName("title")[0].textContent;
    var date = entry.getElementsByClassName("date")[0].textContent;
    var text = entry.getElementsByClassName("text-box")[0].textContent;
    var notification = webkitNotifications.createNotification(
            "icon.png",
            title + " (" + date + ") from Diary",
            text);
    notification.show();
};
Diary.prototype.Check = function (callback, args) {
    this.Fetch(function (dom, self) {
        try {
            var diary = dom.getElementById("diary-box");
            var entry = diary.getElementsByClassName("entry-box")[0];
            var title = entry.getElementsByClassName("title")[0].textContent;
            var date = entry.getElementsByClassName("date")[0].textContent;
            var id = title + date;
            if (title && date && id != self._id) {
                self._id = id;
                self.Notify(entry);
            }
            if (callback)
                callback(args);
        } catch (e) {
            throw e;
        }
    }, this);
};
