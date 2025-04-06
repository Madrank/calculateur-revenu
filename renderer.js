const fs = require("fs");
const path = require("path");

// Chemin du fichier d'historique
const historiqueFilePath = path.join(__dirname, "historique.json");

// Fonction pour charger l'historique des simulations
function chargerHistorique() {
  if (fs.existsSync(historiqueFilePath)) {
    const historique = JSON.parse(fs.readFileSync(historiqueFilePath));
    afficherHistorique(historique);
  }
}

// Fonction pour afficher l'historique sur l'interface
function afficherHistorique(historique) {
  const historiqueDiv = document.getElementById("historique");
  historiqueDiv.innerHTML = "<h3>Historique des simulations :</h3>";

  historique.forEach((sim, index) => {
    const simElement = document.createElement("p");
    simElement.textContent = `Simulation ${
      index + 1
    }: Revenu brut = ${sim.revenuBrut.toFixed(
      2
    )} €, Revenu net = ${sim.revenuNet.toFixed(2)} €`;
    historiqueDiv.appendChild(simElement);
  });
}

// Fonction pour sauvegarder l'historique
function sauvegarderHistorique(revenuBrut, revenuNet) {
  let historique = [];
  if (fs.existsSync(historiqueFilePath)) {
    historique = JSON.parse(fs.readFileSync(historiqueFilePath));
  }

  historique.push({ revenuBrut, revenuNet });
  fs.writeFileSync(historiqueFilePath, JSON.stringify(historique));

  afficherHistorique(historique);
}

// Fonction pour calculer et afficher les revenus
function calculer() {
  const taux = parseFloat(document.getElementById("taux").value);
  const heures = parseFloat(document.getElementById("heures").value);
  const charges = parseFloat(document.getElementById("charges").value) || 0;
  const statut = document.getElementById("statut").value;

  if (isNaN(taux) || isNaN(heures)) {
    document.getElementById("resultat").textContent =
      "Veuillez remplir tous les champs.";
    return;
  }

  let revenuBrut = taux * heures * 4.33;

  if (statut === "interim") {
    revenuBrut *= 1.2; // +20% pour IFM + congés payés
  }

  const revenuNet = revenuBrut * (1 - charges / 100);

  document.getElementById("resultat").innerHTML = `
    Revenu mensuel <strong>brut</strong> estimé : ${revenuBrut.toFixed(2)} €<br>
    Revenu mensuel <strong>net</strong> estimé : ${revenuNet.toFixed(2)} €
  `;

  // Sauvegarder cette simulation dans l'historique
  sauvegarderHistorique(revenuBrut, revenuNet);
}

window.onload = function () {
  mettreAJourCharges();
  chargerHistorique();
};
