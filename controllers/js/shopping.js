document.addEventListener("DOMContentLoaded", () => {
    const ingredientTable = document.getElementById("ingredientTable");
    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");
    const shoppingListContainer = document.getElementById("shoppingListContainer");
    const shoppingList = document.getElementById("shoppingList");
    const downloadPdfButton = document.getElementById("downloadPdf");

    let ingredients = [];
    const itemsPerPage = 7; 
    let currentPage = 1;
    let selectedIngredients = [];

    // Charger les ingrédients depuis le fichier JSON
    fetch("/happyMeal/public/data.json")
        .then(response => response.json())
        .then(data => {
            ingredients = data.recettes.flatMap(recette => recette.ingredients);
            afficherPage(currentPage);
        })
        .catch(error => console.error("Erreur lors du chargement des ingrédients :", error));

    // Fonction pour afficher les ingrédients d'une page
    function afficherPage(page) {
        ingredientTable.innerHTML = ""; // Réinitialiser le tableau
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = ingredients.slice(startIndex, endIndex);

        pageItems.forEach(ingredient => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = ingredient.nom;
            nameCell.className = "px-6 py-4";
            row.appendChild(nameCell);

            const quantityCell = document.createElement("td");
            quantityCell.textContent = ingredient.quantite;
            quantityCell.className = "px-6 py-4";
            row.appendChild(quantityCell);

            const actionCell = document.createElement("td");
            actionCell.className = "px-6 py-4";
            const addButton = document.createElement("button");
            addButton.textContent = "Ajouter";
            addButton.className = "bg-red px-3 py-1 rounded";
            addButton.addEventListener("click", () => ajouterALaListe(ingredient));
            actionCell.appendChild(addButton);
            row.appendChild(actionCell);

            ingredientTable.appendChild(row);
        });

        // Mettre à jour les informations de pagination
        pageInfo.textContent = `Page ${currentPage} sur ${Math.ceil(ingredients.length / itemsPerPage)}`;

        // Activer/désactiver les boutons de navigation
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === Math.ceil(ingredients.length / itemsPerPage);
    }

    // Ajouter un ingrédient à la liste de courses
    function ajouterALaListe(ingredient) {
        if (!selectedIngredients.some(item => item.nom === ingredient.nom)) {
            selectedIngredients.push(ingredient);

            // Afficher la section de la liste de courses
            shoppingListContainer.classList.remove("hidden");

            // Ajouter l'ingrédient à la liste affichée
            const listItem = document.createElement("li");
            listItem.textContent = `${ingredient.nom} - ${ingredient.quantite}`;
            listItem.className = "text-black-700";
            shoppingList.appendChild(listItem);
        } else {
            alert(`${ingredient.nom} est déjà dans la liste de courses.`);
        }
    }

    // Télécharger la liste de courses en PDF
    downloadPdfButton.addEventListener("click", () => {
        if (selectedIngredients.length === 0) {
            alert("Votre liste de courses est vide !");
            return;
        }

        // Importer jsPDF depuis le module global
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Ajouter un titre au PDF
        doc.setFontSize(16);
        doc.text("Liste de Courses", 10, 10);

        // Ajouter les ingrédients au PDF
        doc.setFontSize(12);
        selectedIngredients.forEach((ingredient, index) => {
            doc.text(`${index + 1}. ${ingredient.nom} - ${ingredient.quantite}`, 10, 20 + index * 10);
        });

        // Sauvegarder le PDF
        doc.save("liste_de_courses.pdf");
    });

    // Gestion des clics sur les boutons de pagination
    prevPageButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            afficherPage(currentPage);
        }
    });

    nextPageButton.addEventListener("click", () => {
        if (currentPage < Math.ceil(ingredients.length / itemsPerPage)) {
            currentPage++;
            afficherPage(currentPage);
        }
    });
});