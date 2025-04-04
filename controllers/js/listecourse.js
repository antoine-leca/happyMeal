document.addEventListener("DOMContentLoaded", () => {
    const shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || []; // Récupère la liste de courses
    const sidebar = document.getElementById("sidebar"); // Sidebar
    const sidebarContent = document.getElementById("sidebar-content"); // Contenu de la sidebar
    const openSidebarButton = document.getElementById("open-sidebar"); // Bouton pour ouvrir la sidebar
    const closeSidebarButton = document.getElementById("close-sidebar"); // Bouton pour fermer la sidebar
    const main = document.querySelector("main"); // Conteneur principal
    console.log("Liste de courses récupérée :", shoppingList);

    // Sélectionne l'icône dans modal.html
    const icon = document.querySelector(".fa-solid.fa-plus");
    if (icon) {
        icon.addEventListener("click", afficherIngredients);
    }

    // Fonction pour afficher les ingrédients de la recette "Poulet rôti aux herbes"
    function afficherIngredients() {
        // Charger les données depuis le fichier JSON
        fetch("../public/data.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des données JSON");
                }
                return response.json();
            })
            .then(data => {
                // Trouver la recette "Poulet rôti aux herbes"
                const recette = data.recettes.find(r => r.nom === "Poulet rôti aux herbes");

                if (recette) {
                    // Créer une liste d'ingrédients dans le DOM
                    const ingredientsList = document.createElement("ul");
                    ingredientsList.classList.add("ingredients-list");

                    recette.ingredients.forEach(ingredient => {
                        const listItem = document.createElement("li");
                        listItem.textContent = ingredient.nom; // Affiche uniquement le nom de l'ingrédient
                        ingredientsList.appendChild(listItem);
                    });

                    // Ajouter la liste au DOM
                    main.appendChild(ingredientsList);

                    // Ajouter un bouton pour télécharger en PDF
                    const downloadButton = document.createElement("button");
                    downloadButton.textContent = "Télécharger en PDF";
                    downloadButton.className = "bg-blue-500 text-white px-4 py-2 rounded mt-4";
                    downloadButton.addEventListener("click", () => telechargerPDF(recette));
                    main.appendChild(downloadButton);
                } else {
                    console.error("Recette 'Poulet rôti aux herbes' non trouvée dans le JSON.");
                }
            })
            .catch(error => {
                console.error("Erreur :", error);
            });
    }

    // Fonction pour télécharger la liste des ingrédients en PDF
    function telechargerPDF(recette) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Titre du PDF
        doc.setFontSize(16);
        doc.text(`Liste des Ingrédients - ${recette.nom}`, 10, 10);

        // Ajouter les ingrédients
        let y = 20; // Position verticale initiale
        recette.ingredients.forEach(ingredient => {
            doc.setFontSize(12);
            doc.text(`- ${ingredient.nom}`, 10, y);
            y += 10; // Espacement entre les lignes
        });

        // Télécharger le PDF
        doc.save(`${recette.nom.replace(/\s+/g, "_")}_ingredients.pdf`);
    }

    // Fonction pour afficher la liste de courses dans la sidebar
    function afficherListeDeCourses() {
        sidebarContent.innerHTML = ""; // Réinitialise le contenu

        if (shoppingList.length === 0) {
            sidebarContent.innerHTML = "<p>Aucune recette dans la liste de courses pour le moment.</p>";
            return;
        }

        // Créer un tableau pour afficher les recettes
        const table = document.createElement("table");
        table.className = "w-full border-collapse border border-gray-300";

        // Créer l'en-tête du tableau
        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th class="p-2 border">Nom de la Recette</th>
                <th class="p-2 border">Ingrédients</th>
                <th class="p-2 border">Action</th>
            </tr>
        `;
        table.appendChild(thead);

        // Créer le corps du tableau
        const tbody = document.createElement("tbody");
        shoppingList.forEach(item => {
            const row = document.createElement("tr");

            // Colonne pour le nom de la recette
            const recetteCell = document.createElement("td");
            recetteCell.textContent = item.nom;
            recetteCell.className = "p-2 border";
            row.appendChild(recetteCell);

            // Colonne pour les ingrédients
            const ingredientsCell = document.createElement("td");
            ingredientsCell.textContent = item.ingredients.join(", ");
            ingredientsCell.className = "p-2 border";
            row.appendChild(ingredientsCell);

            // Colonne pour supprimer la recette
            const actionCell = document.createElement("td");
            actionCell.className = "p-2 border text-center";
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Supprimer";
            deleteButton.className = "bg-red-500 text-white px-2 py-1 rounded";
            deleteButton.addEventListener("click", () => supprimerDeLaListe(item.nom));
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);

            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        sidebarContent.appendChild(table);

        // Ajouter un bouton pour télécharger en PDF
        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Télécharger la liste en PDF";
        downloadButton.className = "bg-blue-500 text-white px-4 py-2 rounded mt-4";
        downloadButton.addEventListener("click", telechargerListePDF);
        sidebarContent.appendChild(downloadButton);

        console.log("Tableau généré avec les données :", shoppingList);
    }

    // Fonction pour télécharger la liste de courses en PDF
    function telechargerListePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Titre du PDF
        doc.setFontSize(16);
        doc.text("Liste de Courses", 10, 10);

        // Ajouter les recettes et leurs ingrédients
        let y = 20; // Position verticale initiale
        shoppingList.forEach(item => {
            doc.setFontSize(14);
            doc.text(item.nom, 10, y);
            y += 10;

            doc.setFontSize(12);
            item.ingredients.forEach(ingredient => {
                doc.text(`- ${ingredient}`, 15, y);
                y += 7;
            });
            y += 5; // Espacement entre les recettes
        });

        // Télécharger le PDF
        doc.save("liste_de_courses.pdf");
    }

    // Fonction pour supprimer une recette de la liste de courses
    function supprimerDeLaListe(nomRecette) {
        const index = shoppingList.findIndex(item => item.nom === nomRecette);
        if (index !== -1) {
            shoppingList.splice(index, 1);
            localStorage.setItem("shoppingList", JSON.stringify(shoppingList)); // Met à jour localStorage
            afficherListeDeCourses(); // Met à jour l'affichage
        }
    }

    // Ouvrir la sidebar
    openSidebarButton.addEventListener("click", () => {
        sidebar.classList.remove("translate-x-full");
    });

    // Fermer la sidebar
    closeSidebarButton.addEventListener("click", () => {
        sidebar.classList.add("translate-x-full");
    });

    // Affiche la liste de courses au chargement de la page
    afficherListeDeCourses();
});