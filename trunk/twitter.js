function Twitter () {
    this._url = "http://api.twitter.com/1/statuses/user_timeline/yukari_tamura.xml";
    this._id = 0;
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
        var status = xml.getElementsByTagName("status")[0];
        if (!status)
            return false;
        var id = status.getElementsByTagName("id")[0].textContent;
        if (!id)
            return false;
        if (id != self._id) {
            self._id = id;
            self.Notify(status);
        }
        if (callback)
            callback(args);
        return true;
    }, this);
};
