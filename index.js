const generateBtn = document.querySelector(".genrtBtn");
const indicator = document.querySelector("[str-indicator]");
const uppercaseCheck = document.querySelector("#upcase");
const lowercaseCheck = document.querySelector("#lwcase");
const numbersCheck = document.querySelector("#nums");
const symbolsCheck = document.querySelector("#syms");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
const ipslider = document.querySelector("[data-lenSlider]");
const lenDisplay = document.querySelector("[pass-len]");
const passwordDisplay = document.querySelector("[data-passDisplay]");
const copyBtn = document.querySelector("[data-cpy]");
const copyMsg = document.querySelector("[data-cpymsg]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let plen = 10;
let checkcnt = 0;
//strength color->grey
setIndi("#ccc");

handleSlider();

function handleSlider() {
    ipslider.value = plen;
    lenDisplay.innerText = plen;
    const min = ipslider.min;
    const max = ipslider.max;
    ipslider.style.backgroundSize = ((plen - min)*100/(max - min)) + "% 100%";
}

function setIndi(color) {
    indicator.style.background = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRdmIntgr(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function getRdmNum() {
    return getRdmIntgr(0,9);
}

function getRdmLwcse() {
    return String.fromCharCode(getRdmIntgr(97,123));
}

function getRdmUpcse() {
    return String.fromCharCode(getRdmIntgr(65,91));
}

function getRdmSym() {
    const idx = getRdmIntgr(0, symbols.length);
    return symbols.charAt(idx);
}

function CalcStrength() {
    let upchk = false;
    let lwchk = false;
    let numchk = false;
    let symchk = false;
    if(uppercaseCheck.checked) upchk = true;
    if(lowercaseCheck.checked) lwchk = true;
    if(numbersCheck.checked) numchk = true;
    if(symbolsCheck.checked) symchk = true;
    if(upchk && lwchk && (numchk || symchk) && plen >= 8) setIndi('#0f0');
    else if ((upchk || lwchk) && (numchk || symchk) && plen >= 6) setIndi("#ff0");
    else setIndi("#f00");
}

async function cpyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);
}

ipslider.addEventListener('input', (e) => {
    plen = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value) {
        cpyContent();
    }
});

function chkchange() {
    checkcnt = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked) checkcnt++;
    });
    if(plen < checkcnt) {
        plen = checkcnt;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', chkchange);
})

function shuffle(arr) {
    // Fisher Yates Method
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    let stri = "";
    arr.forEach((el) => (stri += el));
    return stri;
}

generateBtn.addEventListener('click', () => {
    if(checkcnt == 0) return;
    if(plen < checkcnt) {
        plen = checkcnt;
        handleSlider();
    }

    password = "";

    let funcArr = [];
    if(uppercaseCheck.checked) funcArr.push(getRdmUpcse);
    if(lowercaseCheck.checked) funcArr.push(getRdmLwcse);
    if(numbersCheck.checked) funcArr.push(getRdmNum);
    if(symbolsCheck.checked) funcArr.push(getRdmSym);

    for(let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    for(let i = 0; i < plen - funcArr.length; i++) {
        let rdm = getRdmIntgr(0, funcArr.length);
        password += funcArr[rdm]();
    }

    //shuffle the password
    password = shuffle(Array.from(password));

    passwordDisplay.value = password;
    CalcStrength();
});