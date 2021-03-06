function Poller (inst, interval_success, interval_failure, error_msg) {
    this.instance = inst;
    this._polling = false;
    this.interval_success = interval_success;
    this.interval_failure = interval_failure;
    this.error_msg = error_msg;
}
Poller.prototype.StartPolling = function(key) {
    var op = Options.get(key);
    if (op === "true" && this._polling === false) {
        this._polling = true;
        this._Poll();
    } else if (op !== "true" && this._polling !== false) {
        this._polling = false;
    }
};
Poller.prototype._Poll = function() {
    if (!this._polling) {
        return;
    }
    var self = this;
    this.instance.Check(function(result, args) {
        if (result) {
            setTimeout(self._Poll.bind(self), self.interval_success);
        } else {
            console.log(self.error_msg)
            setTimeout(self._Poll.bind(self), self.interval_failure);
        }
    }, null);
};

var information = new Poller(
        new Information(),
        1000 * 60 * 60,
        1000 * 60 * 60 * 12,
        "Information return invalid or unknown format page, then sleep half day."
        );
var diary = new Poller(
        new Diary(),
        1000 * 60 * 10,
        1000 * 60 * 60,
        "Diary return invalid or unknown format page, then sleep one hour."
        );
var twitter = new Poller(
        new Twitter(),
        1000 * 60,
        1000 * 60 * 10,
        "Twitter return invalid page, then sleep ten minutes."
        );

function updateOptions() {
    information.StartPolling("notifyInformation");
    diary.StartPolling("notifyDiary");
    twitter.StartPolling("notifyTwitter");
}
updateOptions();
