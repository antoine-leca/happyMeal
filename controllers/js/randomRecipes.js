document.addEventListener("DOMContentLoaded", () => {
    const randomRecipesContainer = document.getElementById("randomRecipes");

    // Charger les recettes depuis le fichier JSON
    fetch("./public/data.json")
        .then(response => response.json())
        .then(data => {
            const recettes = data.recettes;

            // Sélectionner 3 recettes aléatoires
            const randomRecettes = [];
            while (randomRecettes.length < 3) {
                const randomIndex = Math.floor(Math.random() * recettes.length);
                if (!randomRecettes.includes(recettes[randomIndex])) {
                    randomRecettes.push(recettes[randomIndex]);
                }
            }

            // Afficher les recettes aléatoires
            randomRecettes.forEach(recette => {
                const card = document.createElement("div");
                card.setAttribute("class", "content");

                // Ajouter l'image de la recette
                const cardImg = document.createElement("img");
                cardImg.setAttribute("src", recette.images); // Utilise le chemin défini dans le JSON
                cardImg.setAttribute("alt", recette.nom); // Texte alternatif pour l'image
                cardImg.classList.add("profile_image");
                card.appendChild(cardImg);

                // Ajouter le nom de la recette sous l'image
                const title = document.createElement("h1");
                title.textContent = recette.nom; // Nom de la recette
                title.classList.add("recipe-title");
                card.appendChild(title);

                randomRecipesContainer.appendChild(card);
            });
        })
        .catch(error => console.error("Erreur lors du chargement des recettes :", error));
});