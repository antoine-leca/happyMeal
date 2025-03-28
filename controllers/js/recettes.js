// const cards = document.getElementsByClassName("divCard");

// for (let card of cards) {
//     const divTitle = card.getElementsByClassName("divTI")[0];
//     if (divTitle) {
//         const title = divTitle.querySelector("span");
//         const ingredients = divTitle.querySelector("p");

//         if (title) {
//             title.textContent = "abc";
//         }
        
//         if (ingredients) {
//             ingredients.textContent = "def";
//         }

//         console.log(divTitle, title, ingredients);
//     }
// }

// function genererateCard(recettes) {
//     const container = document.querySelector(".bigsection");
//     const templateCard = document.querySelector(".divCard");

//     templateCard.remove();

//     recettes.forEach(recette => {
//         const card = templateCard.cloneNode(true);

//         card.querySelector(".divTI span").textContent =  recette.nom;
//         card.querySelector(".divTI p").textContent = recette.ingredients.map(ing => ing.quantite).
//     });
// }


fetch("../public/data.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur lors du chargement des données JSON");
        }
        return response.json();
    })
    .then(data => {
        console.log("Données chargées :", data);

        const bigsection = document.getElementsByClassName("bigsection")[0];
        const paginationContainer = document.getElementById("pagination");
        const recettesParPage = 9; // Nombre maximum de recettes par page
        let pageActuelle = 1;

        // Fonction pour afficher les recettes d'une page donnée
        function afficherRecettes(page) {
            // Efface les recettes existantes
            bigsection.innerHTML = "";

            // Calcul des indices de début et de fin
            const debut = (page - 1) * recettesParPage;
            const fin = Math.min(debut + recettesParPage, data.recettes.length);

            // Affiche les recettes pour la page actuelle
            for (let i = debut; i < fin; i++) {
                const recette = data.recettes[i];

                const card = document.createElement("div");
                card.setAttribute("class", "divCard");
                bigsection.appendChild(card);

                const cardImg = document.createElement("img");
                cardImg.setAttribute("src", "../public/assets/freepik__upload__76256.png");
                card.appendChild(cardImg);

                const rCard = document.createElement("div");
                rCard.setAttribute("class", "rCard");
                card.appendChild(rCard);

                const divTI = document.createElement("div");
                divTI.setAttribute("class", "divTI");
                rCard.appendChild(divTI);

                const titre = document.createElement("span");
                titre.textContent = recette.nom;
                divTI.appendChild(titre);

                const ingredients = document.createElement("p");
                ingredients.textContent = recette.ingredients.map(ingredient => ingredient.nom).join(", ");
                divTI.appendChild(ingredients);

                const divBtn = document.createElement("div");
                divBtn.setAttribute("class", "divBtn");
                rCard.appendChild(divBtn);

                const cta = document.createElement("div");
                cta.setAttribute("class", "cta");
                divBtn.appendChild(cta);

                const btn = document.createElement("button");
                btn.textContent = "Voir la recette";
                btn.setAttribute("data-modal-target", "medium-modal");
                btn.setAttribute("data-modal-toggle", "medium-modal");
                btn.setAttribute("type", "button");
                cta.appendChild(btn);

                btn.addEventListener("click", () => {
                    const modal = document.getElementById("medium-modal");
                    if (modal) {
                        modal.classList.remove("hidden");
                        modal.classList.add("flex");
                    }

                    document.querySelectorAll("[data-modal-hide]").forEach(button => {
                        button.addEventListener("click", () => {
                            const modal = document.getElementById("medium-modal");
                            if (modal) {
                                modal.classList.add("hidden");
                                modal.classList.remove("flex");
                            }
                        });
                    });

                    const modalTitle = document.getElementById("modal-title");
                    const modalCategory = document.getElementById("modal-category");
                    const modalTime = document.getElementById("modal-time");
                    const modalIngredients = document.getElementById("modal-ingredients");
                    const modalSteps = document.getElementById("modal-steps");

                    modalTitle.textContent = recette.nom;
                    modalCategory.textContent = `Catégorie : ${recette.categorie}`;
                    modalTime.textContent = `Temps de préparation : ${recette.temps_preparation}`;
                    modalIngredients.textContent = `Ingrédients : ${recette.ingredients.map(ing => `${ing.nom} (${ing.quantite})`).join(", ")}`;

                    modalSteps.innerHTML = "";
                    recette.etapes.forEach((etape, index) => {
                        const stepItem = document.createElement("li");
                        stepItem.textContent = `${index + 1}. ${etape}`;
                        modalSteps.appendChild(stepItem);
                    });
                });
            }
        }

        function genererPagination() {
            paginationContainer.innerHTML = "";

            const totalPages = Math.ceil(data.recettes.length / recettesParPage);

            for (let i = 1; i <= totalPages; i++) {
                const bouton = document.createElement("button");
                bouton.textContent = i;
                bouton.className = `px-3 py-1 rounded ${i === pageActuelle ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`;
                bouton.addEventListener("click", () => {
                    pageActuelle = i;
                    afficherRecettes(pageActuelle);
                    genererPagination();
                });
                paginationContainer.appendChild(bouton);
            }
        }

        // Appels de fonctions
        afficherRecettes(pageActuelle);
        genererPagination();
    })
    .catch(error => {
        console.error("Erreur :", error);
    });








// req.onload = function () {
//     const plats = req.response;
//     changerCarte(plats);
//     showCards(plats);
// }

// function changerCarte(jsonObj) {
// }

