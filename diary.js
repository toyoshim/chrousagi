function Diary () {
    this._url = "http://www.tamurayukari.com/diary/index.html";
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
        if (!dom)
            return false;
        var oldId = localStorage.diaryId;
        var diary = dom.getElementById("diary-box");
        if (!diary)
            return false;
        var entries = diary.getElementsByClassName("entry-box");
        if (!entries)
            return false;
        for (var i = 0, entry, newId = false; entry = entries[i]; i++) {
            var title = entry.getElementsByClassName("title")[0].textContent;
            var date = entry.getElementsByClassName("date")[0].textContent;
            var id = title + date;
            if (!title || !date)
                continue;
            if (!newId) {
                localStorage.diaryId = id;
                newId = true;
            }
            if (id === oldId)
                break;
            self.Notify(entry);
        }
        if (callback)
            callback(args);
        return true;
    }, this);
};
