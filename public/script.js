document.addEventListener('DOMContentLoaded', () => {
    // Initialisez et configurez vos graphiques ici avec Chart.js
    const ctx = document.getElementById('electricVsGasChart').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar', // Changez le type de graphique selon vos besoins
      data: {
        labels: ['Fabrication', 'Utilisation', 'Bilan Total'],
        datasets: [
          {
            label: 'Voiture électrique',
            data: [6.57, 2.34, 9],
            backgroundColor: 'rgba(0, 194, 203, 1)',
            borderColor: 'rgba(51, 51, 51, 1)',
            borderWidth: 2
          },
          {
            label: 'Voiture thermique',
            data: [3.74, 18.26, 22],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(51, 51, 51, 1)',
            borderWidth: 2
          }
        ]
      },
      options: {
        scales: {
          x: {
            ticks: {
              color: 'white' // Couleur des étiquettes sur l'axe X
            }
          },
          y: {
            ticks: {
              color: 'white' // Couleur des étiquettes sur l'axe Y
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'white' // Couleur du texte de légende
            }
          }
        }
      }
    });
});

/********************************************************************************************* */

function reveal() {
    var reveals = document.querySelectorAll(".reveal");
  
    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementVisible = 150;
  
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  }
  
  window.addEventListener("scroll", reveal);

  // initialisation
let allowedKeys = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  65: 'a',
  66: 'b'
};

// sequence à saisir pour le code
let konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

// variable à mémoriser
let konamiCodePosition = 0;

// lire le code
document.addEventListener('keydown', function(e) {
  // récupérer les touches
  let key = allowedKeys[e.keyCode];
  // récupérer les touches requises
  let requiredKey = konamiCode[konamiCodePosition];

  // comparer les deux clées
  if (key == requiredKey) {

    // passer à la touche suivante
    konamiCodePosition++;

    // activer à la dernière touche
    if (konamiCodePosition == konamiCode.length) {
      activateCheats();
      konamiCodePosition = 0;
    }
  } else {
    konamiCodePosition = 0;
  }
});

function activateCheats() {
  document.location.href="https://www.ipcc.ch/languages-2/francais/"; 
}
