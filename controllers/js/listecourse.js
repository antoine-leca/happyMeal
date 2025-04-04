document.addEventListener("DOMContentLoaded", () => {
    const shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || []; // Liste de courses stockée dans localStorage

    // Fonction pour ajouter une recette à la liste de courses
    function ajouterALaListe(recette) {
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

    // Fonction pour récupérer les données de la recette et ajouter à la liste de courses
    function handleIconClick(event) {
        const recetteCard = event.target.closest(".divCard"); // Trouve la carte parent
        const recetteNom = recetteCard.querySelector("span").textContent; // Récupère le nom de la recette
        const recette = data.recettes.find(r => r.nom === recetteNom); // Trouve la recette correspondante dans les données

        if (recette) {
            ajouterALaListe(recette); // Ajoute la recette à la liste de courses
        } else {
            console.error("Recette non trouvée :", recetteNom);
        }
    }

    // Ajoute un événement à chaque icône "fa-plus"
    document.querySelectorAll(".fa-solid.fa-plus").forEach(icon => {
        icon.addEventListener("click", handleIconClick);
    });
});