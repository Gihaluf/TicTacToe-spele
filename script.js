console.log("JS strāda")

const klase_x = 'x'
const klase_o = 'circle'

const teksts = document.querySelector('#virsraksts')
    
/* 
    0 1 2
    3 4 5
    6 7 8
*/

const uzv_nosacijumi = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

const visi_laucini = document.querySelectorAll('.cell')
const rezultatu_logs = document.querySelector('#resultBox')
const rezultatu_teksts = document.querySelector('.resultInfo')
const score_board = document.querySelector('.score')
const atjaunot = document.querySelector('#restartBtn')
const attelot_speletaju = document.querySelector('#display')
const logs = document.querySelector('#logs')

const krasinas = document.querySelector('#startColors')
const startGame = document.querySelector('#startButton')
const main_logs = document.querySelector('#main-menu')

const swappoga = document.querySelector('#swapbtn')

const score_reset = document.querySelector('#resetBtn')


let user1
let user2
let gamestate = false

if(localStorage.getItem("user1") !== null){
    user1 = localStorage.getItem("user1")
    attelot_speletaju.textContent = user2
    main_logs.classList.remove("show")
}
if(localStorage.getItem("user2") !== null){
    user2 = localStorage.getItem("user2")
    attelot_speletaju.textContent = user2
}


startGame.addEventListener("click", () => {
    user2 = document.querySelector('#user1').value
    user1 = document.querySelector('#user2').value
    localStorage.setItem("user1", user1)
    localStorage.setItem("user2", user2)
    attelot_speletaju.textContent = user2
    main_logs.classList.remove("show")
    Timer()
})




let x_uzv = 0
let o_uzv = 0


if(localStorage.getItem("X") !== null){
    x_uzv = localStorage.getItem("X")
}else if(localStorage.getItem("O") !== null)
    o_uzv = localStorage.getItem("O")


let speletajs_O = false
visi_laucini.forEach(laucins =>{
    laucins.addEventListener("click", veikt_gajienu, {once: true})
})

let timeleft = 5;
let timeris
let gajiensa = true

function Timer(gajiens){
    gajiensa = gajiens
    if(timeleft === 1)
        document.getElementById("laiks").innerHTML = timeleft + " sekunde atlikusi";
    else
        document.getElementById("laiks").innerHTML = timeleft + " sekundes atlikušas";
    timeris = setInterval(() => {
        if(timeleft <= 0){
            endGame();
        } else {
            if(timeleft === 1)
                document.getElementById("laiks").innerHTML = timeleft + " sekunde atlikusi";
            else
                document.getElementById("laiks").innerHTML = timeleft + " sekundes atlikušas";
        }
        if(timeleft === 0 ) clearInterval(timeris)
        timeleft -= 1;
    }, 1000);
}


gajiensa = true

if(speletajs_O) document.body.style.backgroundColor = "#2a4758"
    else document.body.style.backgroundColor = "#349b73" 


function veikt_gajienu(klikskis){
    clearInterval(timeris);
    timeleft = 5;
    Timer(speletajs_O)

    const laucins = klikskis.target
    const aktivais_speletajs = speletajs_O ? klase_o : klase_x

    laucins.classList.add(aktivais_speletajs)

    if(speletajs_O) document.body.style.backgroundColor = "#349b73"
    else document.body.style.backgroundColor = "#2a4758"

    if(parbaudit_uzvaru(aktivais_speletajs)){ 
        logs.classList.add('show')
        clearInterval(timeris);
        if(speletajs_O){
            o_uzv++
            localStorage.setItem("O", o_uzv)
        }else{
            x_uzv++
            localStorage.setItem("X", x_uzv)
        }
        setTimeout(() => {
            rezultatu_teksts.textContent = `Speletajs ${speletajs_O ? user1 : user2} uzvarēja`
            score_board.textContent = `${user2} X = ${x_uzv} | ${user1} O = ${o_uzv}`
            rezultatu_logs.classList.add('show')
        }, 1000);
        
    }else if(neizskirts()){
        rezultatu_teksts.textContent = `Neizšķirts`
        score_board.textContent = `${user2} X = ${x_uzv} | ${user1} O = ${o_uzv}`
        rezultatu_logs.classList.add('show')
    }else{
        speletajs_O = !speletajs_O
        
        if(speletajs_O) attelot_speletaju.textContent = user1
        else attelot_speletaju.textContent = user2
    }
}

function parbaudit_uzvaru(speletajs){
    for(let i=0; i < uzv_nosacijumi.length; i++){
        const kombinacija = uzv_nosacijumi [i]
        const a = kombinacija[0]
        const b = kombinacija[1]
        const c = kombinacija[2]
        
        if(visi_laucini[a].classList.contains(speletajs) && 
           visi_laucini[b].classList.contains(speletajs) &&
           visi_laucini[c].classList.contains(speletajs)){
                visi_laucini[a].classList.add("uzvaras-cell")
                visi_laucini[b].classList.add("uzvaras-cell")
                visi_laucini[c].classList.add("uzvaras-cell")
                return true
           }
    }
    return false
}

function endGame(){
    clearInterval(timeris);
    if(gajiensa){
            o_uzv++
            localStorage.setItem("O", o_uzv)
        }else{
            x_uzv++
            localStorage.setItem("X", x_uzv)
        }
    rezultatu_teksts.textContent = `Speletajs ${speletajs_O ? user2 : user1} uzvarēja`
    score_board.textContent = `${user1} = ${x_uzv} | ${user2} = ${o_uzv}`
    rezultatu_logs.classList.add('show')
}

function neizskirts(){
    for(let i=0; i<visi_laucini.length; i++){
        const laucins = visi_laucini[i]

        if(!laucins.classList.contains(klase_x) && !laucins.classList.contains(klase_o)){
            return false
        }
        
    }
    return true
}

atjaunot.addEventListener("click", () =>{
    location.reload()
})

score_reset.addEventListener("click", () => {
    localStorage.setItem("O", 0)
    localStorage.setItem("X", 0)
    localStorage.removeItem("user1")
    localStorage.removeItem("user2")
    location.reload()
})

let reize = false
let krasamTimer

function startColors(){
    krasamTimer = setInterval(() => {
        const color = "#" + Math.floor(Math.random()*16777215).toString(16)
        teksts.style.color = color
    }, 200)
}

krasinas.addEventListener("click", () => {
    if(reize){
        clearInterval(krasamTimer)
        reize = false
        localStorage.removeItem("krasas")
    }else{
        clearInterval(krasamTimer)
        startColors()
        reize = true
        localStorage.setItem("krasas", reize)
    }
})

if(localStorage.getItem("krasas")){
    startColors()
    reize = true
}else{
    clearInterval(krasamTimer)
}


swappoga.addEventListener("click", () =>{
    let userswap = [user1, user2]
    localStorage.setItem("user1", userswap[1])
    localStorage.setItem("user2", userswap[0])
    location.reload()
})