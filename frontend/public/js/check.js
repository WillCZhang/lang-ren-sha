function get(id) {
    return document.getElementById(id);
}

function check() {
    let hide = get("hide");
    let show = get("show");
    let checkButton = get("check");
    if (hide.hidden) {
        hide.hidden = false;
        show.hidden = true;
        checkButton.text = "查看身份"
    } else {
        hide.hidden = true;
        show.hidden = false;
        checkButton.text = "隐藏"
    }
}
