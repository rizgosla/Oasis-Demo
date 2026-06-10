/* ============================================================
   Oasis Dental Care — shared page chrome
   Auto-injects the status bar + header (top) and footer (bottom)
   into every template, so markup lives in one place.
   In the Astro project these become <StatusBar/>, <Header/>,
   <Footer/> components inside Base.astro.
   Set the active nav item with: <body data-page="services">
   ============================================================ */
(function () {
  var LOGO = "https://oasisdentalcarehb.com/wp-content/uploads/2025/07/Oasis_Dental_Logo_Green_Header.png";
  var PHONE = "(714) 893-2106";
  var TEL = "tel:7148932106";

  var nav = [
    { key: "services", label: "Services", href: "services.html" },
    { key: "team", label: "Our Team", href: "team.html" },
    { key: "about", label: "Our Practice", href: "index.html#difference" },
    { key: "reviews", label: "Reviews", href: "index.html#reviews" },
    { key: "contact", label: "Contact", href: "contact.html" }
  ];

  var active = document.body.getAttribute("data-page") || "";

  var statusbar =
    '<div class="sbar"><div class="wrap">' +
      '<div class="l">' +
        '<span class="live"><span class="pulse"></span>Accepting new patients</span>' +
        '<span class="hide">Huntington Beach, CA 92647</span>' +
      '</div>' +
      '<div class="l">' +
        '<span class="hide">Mon\u2013Thu 9:00 AM \u2013 5:00 PM</span>' +
        '<a href="' + TEL + '">Call ' + PHONE + '</a>' +
      '</div>' +
    '</div></div>';

  var navHtml = nav.map(function (n) {
    return '<a href="' + n.href + '"' + (n.key === active ? ' class="active"' : "") + '>' + n.label + "</a>";
  }).join("");

  var header =
    '<header class="site-head"><div class="wrap">' +
      '<a class="brand" href="index.html"><img src="' + LOGO + '" alt="Oasis Dental Care" /></a>' +
      '<nav class="nav">' + navHtml + "</nav>" +
      '<div class="hcta">' +
        '<a class="hphone" href="' + TEL + '">' + PHONE + "</a>" +
        '<a class="btn" href="contact.html">Book now</a>' +
      "</div>" +
    "</div></header>";

  var footer =
    '<footer class="site-foot"><div class="wrap">' +
      '<div class="ftop">' +
        '<div><a class="brand" href="index.html"><img src="' + LOGO + '" alt="Oasis Dental Care" /></a>' +
          "<p>Precision, technology-forward dentistry in the heart of Huntington Beach.</p></div>" +
        '<div><h4>Services</h4><ul>' +
          '<li><a href="service.html">General</a></li>' +
          '<li><a href="service.html">Cosmetic</a></li>' +
          '<li><a href="service.html">Implants</a></li>' +
          '<li><a href="service.html">Invisalign\u00ae</a></li>' +
          '<li><a href="service.html">Emergency</a></li>' +
        "</ul></div>" +
        '<div><h4>Practice</h4><ul>' +
          '<li><a href="index.html#difference">Our Practice</a></li>' +
          '<li><a href="team.html">Our Team</a></li>' +
          '<li><a href="page.html">New Patients</a></li>' +
          '<li><a href="page.html">Patient Forms</a></li>' +
        "</ul></div>" +
        '<div><h4>Visit</h4><ul>' +
          "<li>6552 Bolsa Ave, Ste J</li>" +
          "<li>Huntington Beach, CA</li>" +
          '<li><a href="' + TEL + '">' + PHONE + "</a></li>" +
        "</ul></div>" +
      "</div>" +
      '<div class="fbot"><span>\u00a9 2026 Oasis Dental Care</span><span>Concept \u00b7 Huntington Beach, CA</span></div>' +
    "</div></footer>";

  document.body.insertAdjacentHTML("afterbegin", header);
  document.body.insertAdjacentHTML("afterbegin", statusbar);
  document.body.insertAdjacentHTML("beforeend", footer);

  // reveal-on-scroll
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { io.observe(el); });
})();
