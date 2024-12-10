
document.addEventListener('DOMContentLoaded', () => {
    loadAllMeals();
});

function loadAllMeals() {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)
        .then(response => response.json())
        .then(data => {
            const items = document.getElementById("items");
            items.innerHTML = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    const mealDiv = document.createElement("div");
                    mealDiv.className = "m-2 singleItem";
                    mealDiv.innerHTML = `
                        <div class="card" style="width: 18rem;" onclick="details(${meal.idMeal})">
                            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                            <div class="card-body">
                                <h5 class="card-title">${meal.strMeal}</h5>
                                <button class="btn btn-primary btn-sm" 
                                    onclick="addToFavorites(event, '${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}')">
                                    Add to Favorites
                                </button>
                            </div>
                        </div>`;
                    items.appendChild(mealDiv);
                });
            } else {
                document.getElementById("msg").style.display = "block";
            }
        })
}
document.getElementById("button").addEventListener('click', () => {
    let inputValue = document.getElementById('inputName').value;
    let details = document.getElementById("details");
    details.innerHTML = "";
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`)
        .then(response => response.json())
        .then(data => {
            const items = document.getElementById("items");
            items.innerHTML = "";
            if (data.meals == null) {
                document.getElementById("msg").style.display = "block";
            } else {
                document.getElementById("msg").style.display = "none";
                data.meals.forEach(meal => {
                    const mealDiv = document.createElement("div");
                    mealDiv.className = "m-2 singleItem";
                    mealDiv.innerHTML = `
                        <div class="card" style="width: 18rem;" onclick="details(${meal.idMeal})">
                            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                            <div class="card-body">
                                <h5 class="card-title">${meal.strMeal}</h5>
                                <button class="btn btn-primary btn-sm" 
                                    onclick="addToFavorites(event, '${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}')">
                                    Add to Favorites
                                </button>
                            </div>
                        </div>`;
                    items.appendChild(mealDiv);
                });
            }
        })
});

let favorites = [];

function addToFavorites(event, id, name, thumb) {
    event.stopPropagation();
    if (favorites.length >= 11) {
        alert("You can only add up to 11 favorite meals.");
        return;
    }
    if (!favorites.some(fav => fav.id === id)) {
        favorites.push({ id, name, thumb });
        updateFavorites();
    } else {
        alert("This meal is already in your favorites.");
    }
}

function removeFromFavorites(id) {
    favorites = favorites.filter(meal => meal.id !== id);
    updateFavorites();
}

function updateFavorites() {
    const favoritesContainer = document.getElementById("favorites");
    const favoriteCount = document.getElementById("favorite-count");
    favoritesContainer.innerHTML = "";

    favoriteCount.textContent = favorites.length;

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p>No favorites added yet.</p>";
        return;
    }

    favorites.forEach(meal => {
        const favDiv = document.createElement("div");
        favDiv.className = "m-2 singleItem";
        favDiv.innerHTML = `
            <div class="card" style="width: 12rem;">
                <img src="${meal.thumb}" class="card-img-top" alt="${meal.name}">
                <div class="card-body text-center">
                    <h5 class="card-text">${meal.name}</h5>
                    <button class="btn btn-danger btn-sm" onclick="removeFromFavorites('${meal.id}')">Remove</button>
                </div>
            </div>`;
        favoritesContainer.appendChild(favDiv);
    });
}

function details(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())
        .then(detail => {
            let meal = detail.meals[0];
            let details = document.getElementById("details");
            details.innerHTML = "";
            let detailsDiv = document.createElement("div");
            detailsDiv.innerHTML = `
                <div class="card" style="width: 19rem;">
                    <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                    <div class="card-body">
                        <h3 class="card-text">${meal.strMeal}</h3>
                        <h6>Ingredients</h6>
                        <ul>
                            <li>${meal.strArea}</li>
                            <li>${meal.strCategory}</li>
                            <li>${meal.strIngredient1}</li>
                            <li>${meal.strIngredient2}</li>
                            <li>${meal.strIngredient3}</li>
                            <li>${meal.strIngredient4}</li>
                            <li>${meal.strIngredient5}</li>
                        </ul>
                    </div>
                </div>`;
            details.appendChild(detailsDiv);
        })
        .catch(error => {
            console.error("Error fetching details:", error);
        });
}
