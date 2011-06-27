var Options = (function(){
var options = {
    "notifyTwitter": {"type": "checkbox", "defaultValue": "true"},
    "notifyDiary": {"type": "checkbox", "defaultValue": "true"},
    "notifyInformation": {"type": "checkbox", "defaultValue": "true"}
};

function get_option(key) {
    var option = options[key];
    if (option) {
        var value = localStorage["option." + key];
        if (value === undefined) {
            value = option["defaultValue"];
        }
        return value;
    } else {
        console.info("Undefined option is requested. Key:" + key);
        return null;
    }
}

function set_option(key, value) {
    var option = options[key];
    if (option) {
        localStorage["option." + key] = value;
    } else {
        console.info("Undefined option is requested. Key:" + key);
    }
}

// Saves options to localStorage.
function save_options() {
    for (var key in options) {
        var option = options[key];
        var element = document.getElementById(key);
        if (!element)
            continue;
        var value;
        if (option.type === "checkbox") {
            value = element.checked + "";
        } else {
            value = element.value;
        }
        set_option(key, value);
    }
    // Update status to let user know options were saved.
    var status = document.getElementById("status");
        if (status) {
        status.innerHTML = "Options Saved.";
        setTimeout(function() {
          status.innerHTML = "";
        }, 750);
    }
    
    var bg = chrome.extension.getBackgroundPage();
    bg.updateOptions();
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    for (var key in options) {
        var option = options[key];
        var element = document.getElementById(key);
        if (!element)
            continue;
        var value = get_option(key);
        if (option.type === "checkbox") {
            element.checked = (value === "true");
        } else {
            element.value = value;
        }
    }
}
    //Options
    return {
      save: save_options,
      restore: restore_options,
      get: get_option,
      set: set_option
    };
})();


