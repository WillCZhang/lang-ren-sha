// Element ids
const JOIN = "join";
const CREATE = "create";
const SETTINGS = "settings";
const ROOM = "room";
const FINISHED = "finish";
const CONFIRM = "confirm";
const CANCEL = "cancel";

let settings = {};

// add button handler
function add(index) {
    settings[index] = settings[index]? settings[index] + 1 : 1;
    // this is for multi-language support
    let currText = get("add-" + index).text;
    get("add-" + index).text = currText.replace(/\(.*\)/g, `(${settings[index]})`);
    console.log(settings);
}

// get element helper
function get(id) {
    return document.getElementById(id);
}

function hide(id) {
    get(id).hidden = true;
}

function show(id) {
    get(id).hidden = false;
}

function create() {
    hide(CREATE);
    hide(JOIN);

    show(FINISHED);
    show(CANCEL);
    show(SETTINGS);
}

function join() {
    hide(CREATE);
    hide(JOIN);

    show(ROOM);
    show(CONFIRM);
    show(CANCEL);
}

function cancel() {
    show(CREATE);
    show(JOIN);

    hide(ROOM);
    hide(CONFIRM);
    hide(SETTINGS);
    hide(FINISHED);
    hide(CANCEL);
}

function finish() {
    let query = {};
    query["settings"] = JSON.stringify(settings);
    console.log(query);
    $.post('/create-room', query, (data) => {
        console.log(data);
    });
}

function confirm() {

}

get(CREATE).addEventListener("click", create);
get(FINISHED).addEventListener("click", finish);
get(CANCEL).addEventListener("click", cancel);
get(JOIN).addEventListener("click", join);
get(CONFIRM).addEventListener("click", confirm);
