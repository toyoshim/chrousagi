function Information () {
    this._url = "http://www.tamurayukari.com/information/index.html";
}
Information.prototype = new HtmlPage();
Information.prototype.constructor = Information;
Information.prototype.Notify = function (entry) {
    var title = entry.getElementsByTagName("h3")[0].textContent;
    var date = entry.getElementsByClassName("info-date-main")[0].textContent;
    var text = entry.getElementsByClassName("info-entry-text")[0].textContent;
    if (!title || !date || !text)
        return false;
    var notification = webkitNotifications.createNotification(
            "icon.png",
            date + " " + title + " from Information",
            text);
    notification.show();
    return true;
};
Information.prototype.Check = function (callback, args) {
    this.Fetch(this._url, function (dom, status, self) {
        if (status != 200) {
            if (callback)
                callback(false, args);
            return;
        }
        var oldId = localStorage.informationId;
        try {
            var info = dom.getElementById("info-right-box");
            if (!info)
                throw new Error("info-right-box");
            var entries = info.getElementsByTagName("div");
            if (!entries)
                throw new Error("div");
            for (var i = entries.length - 1, entry, newId = false; entry = entries[i]; i--) {
                var id = entry.getAttribute("id");
                if (!id || id.charAt(0) != "i")
                    continue;
                if (newId || (i == 0 && oldId != id)) {
                    if (!self.Notify(entry)) {
                        console.log("Unknown information format as follow");
                        console.log(entry);
                    }
                    localStorage.informationId = id;
                }
                if (oldId == id)
                    newId = true;
            }
        } catch (e) {
            console.log("Unknown information format: " + e.message + " not found.");
            if (callback)
                callback(false, args);
            return;
        }
        if (callback)
            callback(true, args);
    }, this);
};
