fetch("/happyMeal/public/data.json")
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
                cardImg.setAttribute("src", recette.images);
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

                // Ajouter un bouton pour ajouter aux favoris
                

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
                    const modalImage = document.getElementById("modal-image");

                    modalTitle.textContent = recette.nom;
                    modalCategory.textContent = `Catégorie : ${recette.categorie}`;
                    modalTime.textContent = `Temps de préparation : ${recette.temps_preparation}`;
                    modalIngredients.textContent = `Ingrédients : ${recette.ingredients.map(ing => `${ing.nom} (${ing.quantite})`).join(", ")}`;
                    modalImage.src = recette.images;

                    modalSteps.innerHTML = "";
                    recette.etapes.forEach((etape, index) => {
                        const stepItem = document.createElement("li");
                        stepItem.textContent = `${index + 1}. ${etape}`;
                        modalSteps.appendChild(stepItem);
                    });
                });

                const icons = document.createElement("div");
                icons.setAttribute("class", "icons");
                divBtn.appendChild(icons);

                const icon1 = document.createElement("i");
                icon1.setAttribute("class", "fa-solid fa-plus");
                icon1.style.cursor = "pointer";
                icon1.addEventListener("click", () => {
                    ajouterALaListe(recette);   
                });
                icons.appendChild(icon1);

                const icon2 = document.createElement("i");
                icon2.setAttribute("class", "fa-solid fa-heart");
                icon2.style.cursor = "pointer";
                icon2.addEventListener("click", () => {
                    ajouterAuxFavoris(recette);
                });
                icons.appendChild(icon2);

                
            }
        }

        // Fonction pour ajouter une recette aux favoris
        function ajouterAuxFavoris(recette) {
            const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            if (!favorites.some(fav => fav.nom === recette.nom)) {
                favorites.push(recette);
                localStorage.setItem("favorites", JSON.stringify(favorites));
                alert("Recette ajoutée aux favoris !");
            } else {
                alert("Cette recette est déjà dans vos favoris.");
            }
        }

        // Fonction pour ajouter une recette à la liste de courses
        function ajouterALaListe(recette) {
            const shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || []; // Récupère la liste existante

            // Vérifie si la recette est déjà dans la liste
            if (!shoppingList.some(item => item.nom === recette.nom)) {
                shoppingList.push({
                    nom: recette.nom,
                    ingredients: recette.ingredients.map(ingredient => ingredient.nom)
                });
                localStorage.setItem("shoppingList", JSON.stringify(shoppingList)); // Met à jour localStorage
                alert(`La recette "${recette.nom}" a été ajoutée à la liste de courses.`);
            } else {
                alert(`La recette "${recette.nom}" est déjà dans la liste de courses.`);
            }
        }

        function genererPagination() {
            paginationContainer.innerHTML = "";

            const totalPages = Math.ceil(data.recettes.length / recettesParPage);   

            for (let i = 1; i <= totalPages; i++) {
                const bouton = document.createElement("button");
                bouton.textContent = i;
                bouton.className = `px-3 py-1 rounded ${i === pageActuelle ? "bg-main text-white" : "bg-gray-200 text-gray-700"}`;
                bouton.addEventListener("click", () => {
                    pageActuelle = i;
                    afficherRecettes(pageActuelle);
                    genererPagination();
                });
                paginationContainer.appendChild(bouton);
            }
        }

        // Ajout de l'événement sur l'icône "fa-plus"
        const iconsPlus = document.querySelectorAll(".fa-solid.fa-plus");
        iconsPlus.forEach(icon => {
            icon.addEventListener("click", () => {
                const recetteCard = icon.closest(".divCard"); // Trouve la carte parent
                const recetteNom = recetteCard.querySelector("span").textContent; // Récupère le nom de la recette
                const recette = data.recettes.find(r => r.nom === recetteNom); // Trouve la recette correspondante

                if (recette) {
                    ajouterALaListe(recette); // Ajoute la recette à la liste de courses
                } else {
                    console.error("Recette non trouvée :", recetteNom);
                }
            });
        });

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

