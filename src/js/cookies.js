  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");
  const rejectBtn = document.getElementById("reject-cookies");

  function loadAnalytics() {
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=TU_ID_AQUI";
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'TU_ID_AQUI');
  }

  if (!localStorage.getItem("cookie-consent")) {
    banner.classList.remove("hidden");
  } else if (localStorage.getItem("cookie-consent") === "accepted") {
    loadAnalytics();
  }

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookie-consent", "accepted");
    loadAnalytics();
    banner.classList.add("hidden");
  });

  rejectBtn.addEventListener("click", () => {
    localStorage.setItem("cookie-consent", "rejected");
    banner.classList.add("hidden");
  });
