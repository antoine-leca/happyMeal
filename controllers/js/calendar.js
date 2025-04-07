
document.addEventListener("DOMContentLoaded", () => {
    const weekCalendar = document.getElementById("weekCalendar");
    const weekRange = document.getElementById("weekRange");
    const prevWeek = document.getElementById("prevWeek");
    const nextWeek = document.getElementById("nextWeek");
    const recipeModal = document.getElementById("recipeModal");
    const closeModal = document.getElementById("closeModal");
    const recipeType = document.getElementById("recipeType");
    const recipeName = document.getElementById("recipeName");
    const addRecipe = document.getElementById("addRecipe");

    const DAYS_OF_WEEK = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    let currentDate = new Date();
    let selectedDate = null;
    let selectedRecipes = {}; // Stocke les recettes ajoutées par jour
    let recipes = []; // Stocke les recettes chargées depuis le JSON

    // Charger les recettes depuis le fichier JSON
    fetch("../public/data.json")
        .then(response => response.json())
        .then(data => {
            recipes = data.recettes;
            recipes.forEach(recipe => {
                const option = document.createElement("option");
                option.value = recipe.nom;
                option.textContent = recipe.nom;
                recipeName.appendChild(option);
            });
        })
        .catch(error => console.error("Erreur lors du chargement des recettes :", error));

    // Fonction pour obtenir le début de la semaine
    function getStartOfWeek(date) {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajuste pour que lundi soit le premier jour
        return new Date(date.setDate(diff));
    }

    // Fonction pour générer le planning hebdomadaire
    function generateWeekCalendar() {
        weekCalendar.innerHTML = ""; // Efface le contenu précédent
        const startOfWeek = getStartOfWeek(new Date(currentDate));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        // Met à jour l'affichage de la plage de dates
        weekRange.textContent = `${startOfWeek.toLocaleDateString("fr-FR")} - ${endOfWeek.toLocaleDateString("fr-FR")}`;

        // Génère les jours de la semaine
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);

            const dayKey = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;

            const dayCell = document.createElement("div");
            dayCell.classList.add("day-cell");
            dayCell.innerHTML = `<strong>${DAYS_OF_WEEK[i]}</strong><br>${day.toLocaleDateString("fr-FR")}`;
            weekCalendar.appendChild(dayCell);

            // Affiche les recettes ajoutées pour chaque jour
            if (selectedRecipes[dayKey]) {
                selectedRecipes[dayKey].forEach(recipe => {
                    const recipeDiv = document.createElement("div");
                    recipeDiv.textContent = recipe;
                    recipeDiv.classList.add("recipe");
                    dayCell.appendChild(recipeDiv);
                });
            }

            // Ajoute un événement pour ouvrir le modal
            dayCell.addEventListener("click", () => openModal(dayKey));
        }
    }

    // Fonction pour ouvrir le modal
    function openModal(dayKey) {
        selectedDate = dayKey;
        recipeModal.style.display = "flex";
    }

    // Fonction pour fermer le modal
    closeModal.addEventListener("click", () => {
        recipeModal.style.display = "none";
    });

    // Fonction pour ajouter une recette à un jour
    addRecipe.addEventListener("click", () => {
        const type = recipeType.value;
        const name = recipeName.value;

        if (!selectedRecipes[selectedDate]) {
            selectedRecipes[selectedDate] = [];
        }

        if (selectedRecipes[selectedDate].length < 7) {
            selectedRecipes[selectedDate].push(`${type}: ${name}`);
            recipeModal.style.display = "none";
            generateWeekCalendar(); // Met à jour uniquement l'affichage hebdomadaire
        } else {
            alert("Vous ne pouvez ajouter que 7 recettes par jour.");
        }
    });

    // Navigation vers la semaine précédente
    prevWeek.addEventListener("click", () => {
        currentDate.setDate(currentDate.getDate() - 7);
        generateWeekCalendar();
    });

    // Navigation vers la semaine suivante
    nextWeek.addEventListener("click", () => {
        currentDate.setDate(currentDate.getDate() + 7);
        generateWeekCalendar();
    });

    // Initialisation
    generateWeekCalendar();
});
