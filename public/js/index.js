// Element ids
const JOIN = "join";
const CREATE = "create";
const SETTINGS = "settings";
const FINISHED = "finished";
const CANCEL = "cancel";

let settings = {};

// add button handler
function add(name) {
    settings[name] = settings[name]? settings[name] + 1 : 1;
    get("add-" + name).text = `Add (${settings[name]})`;
    console.log(settings);
}

// get element helper
function get(id) {
    return document.getElementById(id);
}

function flipHiddenStatus(id) {
    get(id).hidden = !get(id).hidden
}

function create() {
    flipHiddenStatus(CREATE);
    flipHiddenStatus(JOIN);
    flipHiddenStatus(SETTINGS);
    flipHiddenStatus(FINISHED);
    flipHiddenStatus(CANCEL);
}

function finish() {
    let query = {};
    query["settings"] = JSON.stringify(settings);
    console.log(query);
    $.post('/app/create-room', query, (data) => {
        console.log(data);
    });
}

function cancel() {
    flipHiddenStatus(CREATE);
    flipHiddenStatus(JOIN);
    flipHiddenStatus(SETTINGS);
    flipHiddenStatus(FINISHED);
    flipHiddenStatus(CANCEL);
}

get(CREATE).addEventListener("click", create);
get(FINISHED).addEventListener("click", finish);
get(CANCEL).addEventListener("click", cancel);
