function Diary () {
    this._url = "http://www.tamurayukari.com/diary/index.html";
}
Diary.prototype = new HtmlPage();
Diary.prototype.constructor = Diary;
Diary.prototype.Notify = function (entry) {
    var title = entry.getElementsByClassName("title")[0].textContent;
    var date = entry.getElementsByClassName("date")[0].textContent;
    var text = entry.getElementsByClassName("text-box")[0].textContent;
    if (!title || !date || !text)
        return false;
    var notification = webkitNotifications.createNotification(
            "icon.png",
            title + " (" + date + ") from Diary",
            text);
    notification.onclick = function() {
        var url = entry.getElementsByClassName("comment-count")[0]
            .getElementsByTagName("a")[0].getAttribute("href");
        chrome.tabs.create({url: url, selected: false});
        notification.cancel();
    }
    notification.show();
    return true;
};
Diary.prototype.Check = function (callback, args) {
    this.Fetch(this._url, function (dom, status, self) {
        if (status != 200) {
            if (callback)
                callback(false, args);
            return;
        }
        var oldId = localStorage.diaryId;
        try {
            var diary = dom.getElementById("diary-box");
            if (!diary)
                throw new Error("diary-box");
            var entries = diary.getElementsByClassName("entry-box");
            if (!entries)
                throw new Error("entry-box");
            for (var i = entries.length - 1, entry, newId = false; entry = entries[i]; i--) {
                var title = entry.getElementsByClassName("title")[0].textContent;
                var date = entry.getElementsByClassName("date")[0].textContent;
                var id = title + date;
                if (!title || !date) {
                    console.log("Unknown diary format as follow");
                    console.log(entry);
                    continue;
                }
                if (newId || (i == 0 && oldId != id)) {
                    if (!self.Notify(entry)) {
                        console.log("Unknown diary format as follow");
                        console.log(entry);
                    }
                    localStorage.diaryId = id;
                }
                if (oldId == id)
                    newId = true;
            }
        } catch (e) {
            console.log("Unknown diary format: " + e.message + " not found.");
            if (callback)
                callback(false, args);
            return;
        }
        if (callback)
            callback(true, args);
    }, this);
};
