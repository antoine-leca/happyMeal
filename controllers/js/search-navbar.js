document.addEventListener("DOMContentLoaded", () => {
    fetch("/happyMeal/public/data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors du chargement des données JSON");
            }
            return response.json();
        })
        .then(data => {
            console.log("Données chargées :", data);

            const searchIn = document.getElementById("search-navbar");
            const suggestionsDiv = document.getElementById("suggestions-navbar");

            searchIn.addEventListener("keyup", function () {
                const recettes = data.recettes;
                const input = searchIn.value;

                const nomrecette = recettes.filter(recette =>
                    recette.nom.toLocaleLowerCase().includes(input.toLocaleLowerCase())
                );

                let suggestion = "";

                nomrecette.forEach(resultItem => {
                    suggestion += `
                        <div class="suggestion-item" data-id="${resultItem.nom}">
                            ${resultItem.nom}
                        </div>
                    `;
                });

                suggestionsDiv.innerHTML = suggestion;

                if (input.trim() === "") {
                    suggestionsDiv.classList.remove("suggestions-active");
                } else {
                    suggestionsDiv.classList.add("suggestions-active");
                }

                // Ajouter un événement click à chaque suggestion
                document.querySelectorAll(".suggestion-item").forEach(item => {
                    item.addEventListener("click", function () {
                        const recetteNom = this.getAttribute("data-id");
                        const recette = recettes.find(r => r.nom === recetteNom);

                        if (recette) {
                            const modal = document.getElementById("medium-modal");
                            if (modal) {
                                modal.classList.remove("hidden");
                                modal.classList.add("flex");
                            }

                            // Ajouter un événement pour fermer le modal
                            document.querySelectorAll("[data-modal-hide]").forEach(button => {
                                button.addEventListener("click", () => {
                                    if (modal) {
                                        modal.classList.add("hidden");
                                        modal.classList.remove("flex");
                                    }
                                });
                            });

                            // Mettre à jour le contenu du modal
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
                        }
                    });
                });
            });
        })
        .catch(error => {
            console.error("Erreur :", error);
        });
});