function Twitter () {
    this._url = "http://api.twitter.com/1/statuses/user_timeline/yukari_tamura.xml";
}
Twitter.prototype.Fetch = function (callback, args) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this._url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4)
            return;
        if (callback)
            callback(xhr.responseXML, args);
    };
    xhr.send();
};
Twitter.prototype.Notify = function (status) {
    var user = status.getElementsByTagName("user")[0];
    var icon = user.getElementsByTagName("profile_image_url")[0].textContent;
    var name = user.getElementsByTagName("name")[0].textContent;
    var text = status.getElementsByTagName("text")[0].textContent;
    var notification = webkitNotifications.createNotification(
            icon,
            name + " from Twitter",
            text);
    notification.show();
};
Twitter.prototype.Check = function (callback, args) {
    this.Fetch(function (xml, self) {
        if (!xml)
            return false;
        var oldId = localStorage.twitterId;
        var statuses = xml.getElementsByTagName("status");
        if (!statuses)
            return false;
        for (var i = 0, status, newId = false; status = statuses[i]; i++) {
            var id = status.getElementsByTagName("id")[0].textContent;
            if (!newId) {
                localStorage.twitterId = id;
                newId = true;
            }
            if (id) {
                if (id === oldId) {
                    break;
                }
                self.Notify(status);
            }
        }
        if (callback)
            callback(args);
        return true;
    }, this);
};
