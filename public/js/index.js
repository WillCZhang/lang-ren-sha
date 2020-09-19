// TODO: ideally should use view engine instead of pure html + js

const JOIN = "join";
const CREATE = "create";
const SETTINGS = "settings";
const FINISHED = "finished";

// TODO: needs abstraction
const description = {
    "狼人": "每晚可以杀一个人",
    "平民": "啥技能没有，加油吧",
    "预言家": "每晚可以验一个人，贼强",
    "女巫": "一瓶毒药一瓶解药，可以Carry可以背锅",
    "猎人": "可以死的时候杀一个人"
};

let settings = {};

// add button handler
function add(name) {
    settings[name] = settings[name] + 1;
    get("add-" + name).text = `Add (${settings[name]})`;
    console.log(settings)
}

function createCard(name, description) {
    settings[name] = 0;
    return `
    <div class="card" style="width: 18rem;">
        <img class="card-img-top" src="images/${name}.png" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <p class="card-text">${description}</p>
            <a href="#" class="btn btn-primary" onclick="add('${name}')" id="add-${name}">Add (0)</a>
        </div>
    </div>
    `
}

function generateDescription() {
    let text = '';
    for (let name of Object.keys(description)) {
        text += `
        <div class="col">
            ${createCard(name, description[name])}
        </div>`;
    }
    let table = get("settings");
    table.insertAdjacentHTML("afterbegin", text);
    return text
}

// get element helper
function get(id) {
    return document.getElementById(id);
}

// remove element helper
function remove(id) {
    get(id).parentElement.removeChild(get(id));
}

function create() {
    remove(CREATE);
    remove(JOIN);
    get(SETTINGS).hidden = false;
    get(FINISHED).hidden = false;
    generateDescription();
}

function finish() {
    let query = {};
    query["settings"] = JSON.stringify(settings);
    $.post('/app/create-room', query, (data) => {
        console.log(data);
    })
}

get(CREATE).addEventListener("click", create);
get(FINISHED).addEventListener("click", finish);
