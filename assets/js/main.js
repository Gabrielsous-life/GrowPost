(function () {
  "use strict";

  var cfg = window.GROWPOST || {};
  var waBase = "https://wa.me/" + cfg.whatsapp;

  // Links de contato a partir de config.js
  document.querySelectorAll("[data-whatsapp]").forEach(function (a) { a.href = waBase; });
  document.querySelectorAll("[data-instagram]").forEach(function (a) {
    a.href = "https://instagram.com/" + cfg.instagram;
  });
  document.querySelectorAll("[data-email]").forEach(function (a) {
    a.href = "mailto:" + cfg.email;
    if (a.textContent.indexOf("@") !== -1) a.textContent = cfg.email;
  });
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Menu mobile
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("menu");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      document.body.classList.toggle("menu-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  // Cabeçalho com sombra ao rolar
  var header = document.querySelector(".header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Animação de entrada sutil
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Formulário: monta a mensagem e abre o WhatsApp. Nenhum dado é enviado a servidores do site.
  var form = document.getElementById("contact-form");
  if (form) {
    var error = document.getElementById("form-error");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = form.nome.value.trim();
      var empresa = form.empresa.value.trim();
      var problems = [];
      if (!nome) problems.push("seu nome");
      if (!empresa) problems.push("o nome da empresa");
      if (!form.consentimento.checked) problems.push("a confirmação da Política de Privacidade");

      if (problems.length) {
        error.textContent = "Falta preencher: " + problems.join(", ") + ".";
        error.hidden = false;
        return;
      }
      error.hidden = true;

      var lines = [
        "Olá, GrowPost! Vim pelo site.",
        "",
        "Nome: " + nome,
        "Empresa: " + empresa,
        "Interesse: " + form.servico.value
      ];
      var msg = form.mensagem.value.trim();
      if (msg) lines.push("", msg);

      window.open(waBase + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
      form.reset();
    });
  }

  // Aviso informativo de privacidade. Guarda só a confirmação de leitura no próprio navegador.
  var notice = document.getElementById("privacy-notice");
  var KEY = "growpost-aviso-privacidade";
  if (notice) {
    var seen = false;
    try { seen = localStorage.getItem(KEY) === "1"; } catch (err) { /* armazenamento indisponível */ }
    if (!seen) notice.hidden = false;
    document.getElementById("privacy-ok").addEventListener("click", function () {
      notice.hidden = true;
      try { localStorage.setItem(KEY, "1"); } catch (err) { /* ignora */ }
    });
  }
})();
