function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("show");
}

let clockInterval;
let countdownInterval;

function updateClock(timezone) {
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(() => {
    const nowUTC = new Date();
    const timeOptions = {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const dateOptions = {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    document.getElementById("localTime").textContent = nowUTC.toLocaleTimeString('en-US', timeOptions);
    document.getElementById("gregorianDate").textContent = nowUTC.toLocaleDateString('en-US', dateOptions);
  }, 1000);
}

async function getPrayerTimes() {
  const city = document.getElementById("city").value.trim();
  const country = document.getElementById("country").value.trim();
  if (!city || !country) return alert("Please enter both city and country.");

  const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json.code !== 200) throw new Error(json.status);

    const { timings, date, meta } = json.data;

    // Islamic date
    const hijri = date.hijri;
    document.getElementById("hijriDate").textContent =
      `${hijri.weekday.en}, ${hijri.day} ${hijri.month.en} ${hijri.year} AH`;

    updateClock(meta.timezone);
    renderPrayerCards(timings, meta.timezone);

  } catch (err) {
    alert("Error fetching data. Please enter a valid city and country.");
    console.error(err);
  }
}

function renderPrayerCards(timings, timezone) {
  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const prayerCards = document.getElementById("prayerCards");
  prayerCards.innerHTML = "";

  const now = new Date(new Date().toLocaleString("en-US", { timeZone: timezone }));
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  let nextPrayerTime = null;

  prayers.forEach((prayer) => {
    const timeStr = timings[prayer];
    const [h, m] = timeStr.split(":").map(Number);
    const prayerTime = new Date(now);
    prayerTime.setHours(h, m, 0);

    const prayerMinutes = h * 60 + m;
    const isNext = !nextPrayerTime && prayerMinutes > nowMinutes;

    if (isNext) {
      nextPrayerTime = new Date(prayerTime);
    }

    const card = document.createElement("div");
    card.className = "prayer-card" + (isNext ? " active" : "");
    card.innerHTML = `<h3>${prayer}</h3><p>${timeStr}</p>`;
    prayerCards.appendChild(card);
  });

  if (nextPrayerTime) {
    startCountdown(nextPrayerTime);
  } else {
    document.getElementById("countdownTimer").textContent = "All prayers for today completed.";
  }
}

function startCountdown(targetTime) {
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    const now = new Date();
    const diff = targetTime - now;
    if (diff <= 0) {
      document.getElementById("countdownTimer").textContent = "Next prayer starting...";
      clearInterval(countdownInterval);
      return;
    }
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    document.getElementById("countdownTimer").textContent = `Next prayer in ${mins}m ${secs}s`;
  }, 1000);
}


// faqs
  const faqs = document.querySelectorAll('.faq');
  faqs.forEach(faq => {
    faq.querySelector('.faq-question').addEventListener('click', () => {
      faqs.forEach(f => {
        if (f !== faq) f.classList.remove('open');
      });
      faq.classList.toggle('open');
    });
  });

function handleNewsletterSubmit(e) {
    e.preventDefault();
    alert("Thank you for subscribing to our newsletter!");
    e.target.reset();
    return false;
  }

  function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("show");
}

// Form success message
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const msg = document.getElementById("successMessage");
  msg.style.display = "block";
  setTimeout(() => {
    msg.style.display = "none";
    this.reset();
  }, 4000);
});


// Contact form submit message
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  const successMsg = document.getElementById("formSuccess");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    successMsg.style.display = "block";
    setTimeout(() => {
      successMsg.style.display = "none";
      contactForm.reset();
    }, 4000);
  });
});
