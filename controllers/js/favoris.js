document.addEventListener("DOMContentLoaded", () => {
    const favoritesSection = document.getElementById("favoritesSection");

    // Charger les favoris depuis le localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Afficher les recettes favorites
    function afficherFavoris() {
        favoritesSection.innerHTML = "";

        if (favorites.length === 0) {
            favoritesSection.innerHTML = "<p>Aucune recette favorite pour le moment.</p>";
            return;
        }

        favorites.forEach(recette => {
            const card = document.createElement("div");
            card.setAttribute("class", "divCard");

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

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Retirer des favoris";
            removeBtn.classList.add("btn");
            removeBtn.addEventListener("click", () => retirerDesFavoris(recette.nom));
            divBtn.appendChild(removeBtn);

            favoritesSection.appendChild(card);
        });
    }

    // Retirer une recette des favoris
    function retirerDesFavoris(nomRecette) {
        const index = favorites.findIndex(recette => recette.nom === nomRecette);
        if (index !== -1) {
            favorites.splice(index, 1);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            afficherFavoris();
        }
    }

    afficherFavoris();
});