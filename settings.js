const electron = require('electron')

const { ipcRenderer } = electron;

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

function radiobuttoncheck(id, group) {
    var di = document.getElementsByName(group);
    var valid = false;
    for (i = 0; i < di.length; i++) {
        if (di[i].checked == true && !valid) {
            valid = true;
            document.getElementById('modal').innerHTML =
                document.getElementById(id + '_content').innerHTML;
        }
    }
    if (!valid) {
        alert('you didn´t choose a option');
    }
}

function progressbar() {
    ipcRenderer.send('start_camera');
}

let optellen = [];
let percentage = 0;

function vraag1() {
    optellen[0] = parseInt(document.querySelector('input[name="group1"]:checked').value);
    console.log(optellen);
}

function vraag2() {
    optellen[1] = parseInt(document.querySelector('input[name="group2"]:checked').value);
    console.log(optellen);
}

function vraag3() {
    optellen[2] = parseInt(document.querySelector('input[name="group3"]:checked').value);
    console.log(optellen);
}

function vraag4() {
    optellen[3] = parseInt(document.querySelector('input[name="group4"]:checked').value);
    console.log(optellen);
}

function vraag5() {
    optellen[4] = parseInt(document.querySelector('input[name="group5"]:checked').value);
    console.log(optellen);
}

function vraag6() {
    optellen[5] = parseInt(document.querySelector('input[name="group6"]:checked').value);
    console.log(optellen);
}

function vraag7() {
    optellen[6] = parseInt(document.querySelector('input[name="group7"]:checked').value);
    console.log(optellen);
}

function vraag8() {
    optellen[7] = parseInt(document.querySelector('input[name="group8"]:checked').value);
    console.log(optellen);
}

function vraag9() {
    optellen[8] = parseInt(document.querySelector('input[name="group9"]:checked').value);
    console.log(optellen);
}

function vraag10() {
    optellen[9] = parseInt(document.querySelector('input[name="group10"]:checked').value);
    console.log(optellen);
}

function vraag11() {
    optellen[10] = parseInt(document.querySelector('input[name="group11"]:checked').value);
    console.log(optellen);
}

function vraag12() {
    optellen[11] = parseInt(document.querySelector('input[name="group12"]:checked').value);
    console.log(optellen);
}

function login() {
    let mail = document.getElementById('inputEmail').value;
    let name = document.getElementById('inputName').value;
    let password = document.getElementById('inputPassword').value;
    
    if (mail.trim() === '' || name.trim() === '' || password.trim() === '') {
        alert('Alle velden moeten gevuld zijn');
        return;
    }

    let creditials = {
        mail: mail,
        name: name,
        password: password,
        type: percentage > 50 ? 0 : 1
    }

    ipcRenderer.send('settings:login', creditials);
}

function getSum(total, num) {
    return total + num;
}

function groteoptelsom() {
    let eindresultaat = optellen.reduce(getSum)

    percentage = Math.round((eindresultaat / 84) * 100);
    console.log(percentage);

    document.getElementById('resultaatplaats').innerHTML = 'Jou resultaten zijn als volgt je competitiefheids percentage is: ' + percentage + '%.';
}

ipcRenderer.on('settings:failed', function (e, errors) {
    let errorMessage = '';

    if (errors.includes('PasswordTooShort')) {
        errorMessage = addLine(errorMessage, '- minimaal 6 characters zijn');
    }
    if (errors.includes('PasswordRequiresNonAlphanumeric')) {
        errorMessage = addLine(errorMessage, '- een vreemd teken bevatten');
    }
    if (errors.includes('PasswordRequiresDigit')) {
        errorMessage = addLine(errorMessage, '- een nummer bevatten');
    }
    if (errors.includes('PasswordRequiresUpper')) {
        errorMessage = addLine(errorMessage, '- een hoofdletter bevatten');
    }

    alert(errorMessage);
})

ipcRenderer.on('camera_started', () => {
    let timeleft = 5;
    let downloadTimer = setInterval(function () {
        document.getElementById("progressBar").value = 5 - --timeleft;
        if (timeleft <= 0) {
            ipcRenderer.send('capture');
            clearInterval(downloadTimer);
        }
    }, 1000);
});

ipcRenderer.on('proceed_login', () => {
    showmodal('login');
});

function addLine(message, line) {
    const newLine = "\r\n";

    return message === '' ? 'het wachtwoord moet: \r\n' + line : message += (newLine + line);
}