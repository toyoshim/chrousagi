function Twitter () {
    this._xhr = null;
    this._url = "http://api.twitter.com/1/statuses/user_timeline/yukari_tamura.xml";
}
Twitter.prototype.Fetch = function (callback, args) {
    this._xhr = new XMLHttpRequest();
    this._xhr.open("GET", this._url, true);
    this._xhr._owner = this;
    this._xhr.onreadystatechange = function () {
        if (this.readyState != 4)
            return;
        if (callback)
            callback(this.responseXML, this.status, args);
        this._owner._xhr = null;
    };
    this._xhr.send();
};
Twitter.prototype.Notify = function (status) {
    var user = status.getElementsByTagName("user")[0];
    if (!user)
        return false;
    var icon = user.getElementsByTagName("profile_image_url")[0].textContent;
    var name = user.getElementsByTagName("name")[0].textContent;
    var text = status.getElementsByTagName("text")[0].textContent;
    if (!icon || !name || !text)
        return false;
    var notification = webkitNotifications.createNotification(
            icon,
            name + " from Twitter",
            text);
    notification.onclick = function() {
        var id = status.getElementsByTagName("id")[0].textContent;
        chrome.tabs.create({url: "http://twitter.com/"+name+"/status/"+id, selected: false});
        notification.cancel();
    }
    notification.show();
    return true;
};
Twitter.prototype.Check = function (callback, args) {
    this.Fetch(function (xml, stat, self) {
        if (stat != 200) {
            if (callback)
                callback(false, args);
            return;
        }
        var oldId = localStorage.twitterId;
        var statuses = xml.getElementsByTagName("status");
        for (var i = statuses.length - 1, status, newId = false; status = statuses[i]; i--) {
            var id = status.getElementsByTagName("id")[0].textContent;
            if (newId || (i == 0 && oldId != id)) {
                if (!self.Notify(status)) {
                    console.log("Unknown tweet format as follow");
                    console.log(status);
                }
                localStorage.twitterId = id;
            }
            if (oldId == id)
                newId = true;
        }
        if (callback)
            callback(true, args);
    }, this);
};
