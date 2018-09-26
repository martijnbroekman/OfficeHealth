document.addEventListener("DOMContentLoaded", () => {
    showmodal('status');
    tab1();
});

function showmodal(id) {
    document.getElementById('modal').innerHTML =
        document.getElementById(id + '_content').innerHTML;
}

function clicker() {
    let image = document.getElementById('notifications').getAttribute("src");
    if (image == "icons/png/notifcations.png") {
        document.getElementById('notifications').src = "icons/png/notifcations-muted.png";
    } else {
        document.getElementById('notifications').src = "icons/png/notifcations.png";
    }
}

function checkClick1() {
    let image1 = document.getElementById('check1').getAttribute("src");
    console.log(image1);
    if (image1 == "icons/png/checked.png") {
        document.getElementById('check1').src = "icons/png/unchecked.png";
    } else {
        document.getElementById('check1').src = "icons/png/checked.png";
    }
}

function checkClick2() {
    let image2 = document.getElementById('check2').getAttribute("src");
    if (image2 == "icons/png/checked.png") {
        document.getElementById('check2').src = "icons/png/unchecked.png";
    } else {
        document.getElementById('check2').src = "icons/png/checked.png";
    }
}

function checkClick3() {
    let image3 = document.getElementById('check3').getAttribute("src");
    if (image3 == "icons/png/checked.png") {
        document.getElementById('check3').src = "icons/png/unchecked.png";
    } else {
        document.getElementById('check3').src = "icons/png/checked.png";
    }
}

function checkClick4() {
    let image4 = document.getElementById('check4').getAttribute("src");
    if (image4 == "icons/png/checked.png") {
        document.getElementById('check4').src = "icons/png/unchecked.png";
    } else {
        document.getElementById('check4').src = "icons/png/checked.png";
    }
}

function checkClick5() {
    let image5 = document.getElementById('game1').getAttribute("src");
    console.log(image5);
    if (image5 == "icons/png/pingpongblock.png") {
        document.getElementById('game1').src = "icons/png/pingpongblock-checked.png";
    } else {
        document.getElementById('game1').src = "icons/png/pingpongblock.png";
    }
}

function checkClick6() {
    let image6 = document.getElementById('game2').getAttribute("src");
    console.log(image6);
    if (image6 == "icons/png/chessblock.png") {
        document.getElementById('game2').src = "icons/png/chessblock-checked.png";
    } else {
        document.getElementById('game2').src = "icons/png/chessblock.png";
    }
}

function checkClick7() {
    let image7 = document.getElementById('game3').getAttribute("src");
    console.log(image7);
    if (image7 == "icons/png/walksblock.png") {
        document.getElementById('game3').src = "icons/png/walksblock-checked.png";
    } else {
        document.getElementById('game3').src = "icons/png/walksblock.png";
    }
}

function checkClick8() {
    let image8 = document.getElementById('game4').getAttribute("src");
    console.log(image8);
    if (image8 == "icons/png/blindlunchblock.png") {
        document.getElementById('game4').src = "icons/png/blindlunchblock-checked.png";
    } else {
        document.getElementById('game4').src = "icons/png/blindlunchblock.png";
    }
}

function tab1() {
    document.getElementById('status').style.backgroundColor = "#FCFAF8";
    document.getElementById('status').style.color = "#22343E";
    document.getElementById('status').style.borderTopLeftRadius = "11px";
    document.getElementById('status').style.borderTopRightRadius = "11px";

    document.getElementById('goals').style.backgroundColor = "#22343E";
    document.getElementById('goals').style.color = "rgba(255, 255, 255, 0.83)";

    document.getElementById('games').style.backgroundColor = "#22343E";
    document.getElementById('games').style.color = "rgba(255, 255, 255, 0.83)";
}

function tab2() {
    document.getElementById('goals').style.backgroundColor = "#FCFAF8";
    document.getElementById('goals').style.color = "#22343E";
    document.getElementById('goals').style.borderTopLeftRadius = "11px";
    document.getElementById('goals').style.borderTopRightRadius = "11px";

    document.getElementById('status').style.backgroundColor = "#22343E";
    document.getElementById('status').style.color = "rgba(255, 255, 255, 0.83)";

    document.getElementById('games').style.backgroundColor = "#22343E";
    document.getElementById('games').style.color = "rgba(255, 255, 255, 0.83)";
}

function tab3() {
    document.getElementById('games').style.backgroundColor = "#FCFAF8";
    document.getElementById('games').style.color = "#22343E";
    document.getElementById('games').style.borderTopLeftRadius = "11px";
    document.getElementById('games').style.borderTopRightRadius = "11px";

    document.getElementById('goals').style.backgroundColor = "#22343E";
    document.getElementById('goals').style.color = "rgba(255, 255, 255, 0.83)";

    document.getElementById('status').style.backgroundColor = "#22343E";
    document.getElementById('status').style.color = "rgba(255, 255, 255, 0.83)";
}



function closeTabs() {
    document.getElementById('games').style.backgroundColor = "#22343E";
    document.getElementById('games').style.color = "rgba(255, 255, 255, 0.83)";

    document.getElementById('goals').style.backgroundColor = "#22343E";
    document.getElementById('goals').style.color = "rgba(255, 255, 255, 0.83)";

    document.getElementById('status').style.backgroundColor = "#22343E";
    document.getElementById('status').style.color = "rgba(255, 255, 255, 0.83)";
}
