
(function(){
  const p = atob("VERBMjAyNVBXT2NlYW5vMQ=="); // "TDA2025PWOceano1"
  const u = prompt("Inserisci la password per accedere alla mappa:");
  if (u !== p) {
    document.body.innerHTML = "<h1 style='text-align:center; margin-top: 20%;'>Accesso negato ❌</h1>";
    throw new Error("Accesso negato");
  }
})();
