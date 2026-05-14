// ---------------- NAVIGATION ----------------

const navButtons =
  document.querySelectorAll(".nav-item");

const sections =
  document.querySelectorAll(".page-section");

navButtons.forEach((button) => {

  button.addEventListener("click", () => {

    // remove active class
    navButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    // add active class
    button.classList.add("active");

    // hide all sections
    sections.forEach((section) => {
      section.classList.remove("active");
    });

    // show selected page
    const pageName =
      button.dataset.page;

    const selectedPage =
      document.getElementById(
        `${pageName}-page`
      );

    selectedPage.classList.add("active");
  });
});

function updateTime() {

  const currentDate =
    new Date();

  timeDisplay.textContent =
    currentDate.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    );

  dateDisplay.textContent =
    currentDate.toDateString();
}

updateTime();

setInterval(updateTime, 1000);


function updateGreeting() {

  const hour =
    new Date().getHours();

  let greeting = "";

  if (hour < 12) {

    greeting =
      "Good Morning";

  } else if (hour < 17) {

    greeting =
      "Good Afternoon";

  } else if (hour < 21) {

    greeting =
      "Good Evening";

  } else {

    greeting =
      "Good Night";
  }

  greetingText.textContent =
    greeting;
}

updateGreeting();



async function fetchQuote() {

  try {

    const response =
      await fetch(
        "/api/quote"
      );

    const quoteData =
      await response.json();

    quote.textContent =
      `"${quoteData.content}"`;

    author.textContent =
      `— ${quoteData.author}`;

    updateBubble(
      quoteData.content
    );

  } catch (error) {

    quote.textContent =
      "Stay positive even offline";

    author.textContent =
      "— Dashboard";

    updateBubble(
      "Unable to load quote"
    );
  }
}

async function fetchCat() {

  try {

    const response =
      await fetch(
        "/api/cat"
      );

    const catData =
      await response.json();

    catImg.src =
      catData.url;

  } catch (error) {

    updateBubble(
      "Unable to load cat image"
    );
  }
}


// ---------------- CAT CLICK ----------------

catImg.addEventListener(
  "click",
  () => {

    updateBubble(
      "You clicked the cat"
    );

    catImg.style.transform =
      "scale(1.08)";

    setTimeout(() => {

      catImg.style.transform =
        "scale(1)";

    }, 200);
  }
);


// ---------------- WEATHER ----------------

async function fetchWeather() {

  navigator.geolocation
    .getCurrentPosition(
      async (position) => {

        try {

          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          const response =
            await fetch(
              `/api/weather?lat=${latitude}&lon=${longitude}`
            );

          const weatherData =
            await response.json();

          const temperatureValue =
            weatherData.current.temp_c;

          temperature.textContent =
            temperatureValue;

   let weatherMessage = "";

let weatherTip = "";


// cold weather
if (temperatureValue < 15) {

  weatherMessage =
    "Cold weather";

  weatherTip =
    "Wear warm clothes and stay hydrated.";


// pleasant weather
} else if (temperatureValue < 25) {

  weatherMessage =
    "Pleasant weather";

  weatherTip =
    "Good time for a walk or outdoor activity.";


// warm weather
} else if (temperatureValue < 32) {

  weatherMessage =
    "Warm weather";

  weatherTip =
    "Drink enough water during the day.";


// very hot weather
} else {

  weatherMessage =
    "Very hot weather";

  weatherTip =
    "Avoid direct sunlight for long periods.";
}


// final output
weatherDesc.innerHTML = `
  <strong>${weatherMessage}</strong>
  <br>
  <span>${weatherTip}</span>
`;


// update cat bubble
updateBubble(weatherTip);

          updateBubble(
            weatherMessage
          );

        } catch (error) {

          weatherDesc.textContent =
            "Weather unavailable";
        }
      }
    );
}


// ---------------- SPEECH BUBBLE ----------------

function updateBubble(message) {

  catBubble.textContent =
    message;

  catBubble.style.animation =
    "none";

  catBubble.offsetHeight;

  catBubble.style.animation =
    "bubblePop 0.4s ease";
}


// ---------------- BUTTON EVENTS ----------------

newQuoteBtn.addEventListener(
  "click",
  () => {

    fetchQuote();

    fetchCat();
  }
);

refreshWeatherBtn
  .addEventListener(
    "click",
    fetchWeather
  );


// ---------------- INITIAL LOAD ----------------

fetchQuote();

fetchCat();

fetchWeather();


// ---------------- CALENDAR ----------------

const dayNames = [

  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"

];

let currentDate =
  new Date();

let currentMonth =
  currentDate.getMonth();

let currentYear =
  currentDate.getFullYear();


function generateCalendar() {

  miniCalendar.innerHTML =
    "";

  monthYearDisplay.textContent =
    new Date(
      currentYear,
      currentMonth
    ).toLocaleString(
      "default",
      {
        month: "long",
        year: "numeric"
      }
    );

  // day names
  dayNames.forEach((day) => {

    const header =
      document.createElement("div");

    header.textContent =
      day;

    header.className =
      "day header";

    miniCalendar.appendChild(
      header
    );
  });

  const firstDay =
    new Date(
      currentYear,
      currentMonth,
      1
    ).getDay();

  const totalDays =
    new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();

  // empty spaces
  for (
    let i = 0;
    i < firstDay;
    i++
  ) {

    const emptyCell =
      document.createElement(
        "div"
      );

    miniCalendar.appendChild(
      emptyCell
    );
  }

  const today =
    new Date();

  // generate days
  for (
    let date = 1;
    date <= totalDays;
    date++
  ) {

    const dayCell =
      document.createElement(
        "div"
      );

    dayCell.textContent =
      date;

    dayCell.className =
      "day";

    // highlight today
    if (

      date ===
      today.getDate() &&

      currentMonth ===
      today.getMonth() &&

      currentYear ===
      today.getFullYear()

    ) {

      dayCell.classList.add(
        "today"
      );
    }

    miniCalendar.appendChild(
      dayCell
    );
  }
}

generateCalendar();


// previous month
prevMonthBtn.addEventListener(
  "click",
  () => {

    currentMonth--;

    if (currentMonth < 0) {

      currentMonth = 11;

      currentYear--;
    }

    generateCalendar();
  }
);


// next month
nextMonthBtn.addEventListener(
  "click",
  () => {

    currentMonth++;

    if (currentMonth > 11) {

      currentMonth = 0;

      currentYear++;
    }

    generateCalendar();
  }
);


// ---------------- NIGHT MODE ----------------

function checkNightMode() {

  const currentHour =
    new Date().getHours();

  if (
    currentHour >= 19 ||
    currentHour < 6
  ) {

    document.body.classList.add(
      "night"
    );

  } else {

    document.body.classList.remove(
      "night"
    );
  }
}

checkNightMode();

setInterval(
  checkNightMode,
  60000
);


// ---------------- THEME BUTTON ----------------

themeBtn.addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "night"
    );

    updateBubble(
      "Theme updated"
    );
  }
);


// ---------------- MUSIC ----------------

const music =
  document.getElementById(
    "bgMusic"
  );

const musicBtn =
  document.getElementById(
    "musicBtn"
  );

let musicPlaying =
  false;

music.volume = 0.4;

musicBtn.addEventListener(
  "click",
  async () => {

    try {

      if (!musicPlaying) {

        await music.play();

        musicBtn.textContent =
          "Pause Music";

        updateBubble(
          "Music started"
        );

        musicPlaying = true;

      } else {

        music.pause();

        musicBtn.textContent =
          "Play Music";

        updateBubble(
          "Music paused"
        );

        musicPlaying = false;
      }

    } catch (error) {

      updateBubble(
        "Add music.mp3 inside public folder"
      );
    }
  }
);


// ---------------- NOTES ----------------

notesInput.value =
  sessionStorage.getItem(
    "dashboard-notes"
  ) || "";


notesInput.addEventListener(
  "input",
  () => {

    sessionStorage.setItem(
      "dashboard-notes",
      notesInput.value
    );

    updateBubble(
      "Notes saved temporarily"
    );
  }
);





let timerSeconds =
  1500;

let timerInterval;

function updateTimerUI() {

  const minutes =
    Math.floor(
      timerSeconds / 60
    );

  const seconds =
    timerSeconds % 60;

  focusTime.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

updateTimerUI();


// start timer
startTimerBtn.addEventListener(
  "click",
  () => {

    clearInterval(
      timerInterval
    );

    const customMinutes =
      Number(
        focusMinutes.value
      );

    if (
      customMinutes > 0
    ) {

      timerSeconds =
        customMinutes * 60;
    }

    updateTimerUI();

    updateBubble(
      "Focus timer started"
    );

    timerInterval =
      setInterval(() => {

        if (
          timerSeconds > 0
        ) {

          timerSeconds--;

          updateTimerUI();

        } else {

          clearInterval(
            timerInterval
          );

          updateBubble(
            "Focus session completed"
          );
        }

      }, 1000);
  }
);


// reset timer
resetTimerBtn.addEventListener(
  "click",
  () => {

    clearInterval(
      timerInterval
    );

    timerSeconds = 1500;

    updateTimerUI();

    updateBubble(
      "Timer reset"
    );
  }
);