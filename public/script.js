/* NAV */
document.querySelectorAll(".nav-item").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".page-section").forEach(p => p.classList.remove("active"));
    document.getElementById(`${btn.dataset.page}-page`).classList.add("active");
  };
});

/* TIME */
function updateTime() {
  const n = new Date();
  timeDisplay.innerHTML = n.toLocaleTimeString();
  dateDisplay.textContent = n.toDateString();
}
setInterval(updateTime, 1000); updateTime();

/* QUOTE */
async function fetchQuote() {
  try {
    const res = await fetch("/api/quote");
    const data = await res.json();

    document.getElementById("quote").textContent = `"${data.content}"`;
    document.getElementById("author").textContent = `— ${data.author}`;
    updateBubble(data.content + " 😺");
  } catch (err) {
    document.getElementById("quote").textContent =
      "“Stay positive, even offline 🌸”";
    document.getElementById("author").textContent = "— Your Cutie Cat🐱";
    updateBubble("Internet shaky… but I’m still here 🐾");
  }
}


/* CAT */
async function fetchCat() {
  const r = await fetch("/api/cat");
  const d = await r.json();
  catImg.src = d.url;
}
document.getElementById("catImg").addEventListener("click", () => {
  meowSound.currentTime = 0;
  meowSound.play();

  updateBubble("Meow~ 🐾 Don’t poke me too much 😸");

  // cute bounce animation
  const cat = document.getElementById("catImg");
  cat.style.transform = "scale(1.1)";
  setTimeout(() => {
    cat.style.transform = "scale(1)";
  }, 200);
});

/* WEATHER + CAT MOOD */
async function fetchWeather() {
  navigator.geolocation.getCurrentPosition(async pos => {
    const r = await fetch(`/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
    const d = await r.json();
    const t = d.current.temp_c;

    temperature.textContent = t;

    let mood = t < 15 ? "Brrr… cold 🥶" :
               t < 25 ? "Perfect weather 😺" :
               t < 32 ? "A bit warm 😼" :
                        "Too hot!! 🥵";

    weatherDesc.textContent = mood;
    updateBubble(mood);
  });
}

/* SPEECH BUBBLE */
function updateBubble(text) {
  catBubble.textContent = "💬 " + text;
  catBubble.style.animation = "none";
  catBubble.offsetHeight;
  catBubble.style.animation = "bubblePop 0.4s ease";
}

newQuoteBtn.onclick = () => { fetchQuote(); fetchCat(); };
refreshWeatherBtn.onclick = fetchWeather;

fetchQuote();
fetchCat();

/* CALENDAR */
let d = new Date(), m=d.getMonth(), y=d.getFullYear();
const days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function generateCalendar(){
  miniCalendar.innerHTML="";
  monthYearDisplay.textContent = new Date(y,m).toLocaleString("default",{month:"long",year:"numeric"});
  days.forEach(x=>{const h=document.createElement("div");h.textContent=x;h.className="day header";miniCalendar.appendChild(h);});
  const f=new Date(y,m,1).getDay(), t=new Date(y,m+1,0).getDate();
  for(let i=0;i<f;i++) miniCalendar.appendChild(document.createElement("div"));
  for(let i=1;i<=t;i++){const c=document.createElement("div");c.textContent=i;c.className="day";miniCalendar.appendChild(c);}
}
prevMonthBtn.onclick=()=>{m--;if(m<0){m=11;y--;}generateCalendar();};
nextMonthBtn.onclick=()=>{m++;if(m>11){m=0;y++;}generateCalendar();};
generateCalendar();

function checkNightMode() {
  const hour = new Date().getHours();

  if (hour >= 19 || hour < 6) {
    document.body.classList.add("night");
    updateBubble("It’s night time 🌙 I’m getting sleepy 😴");
  } else {
    document.body.classList.remove("night");
  }
}
checkNightMode();
setInterval(checkNightMode, 60000);
