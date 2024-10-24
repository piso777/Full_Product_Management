// Regular expressions for validation
var nameRegex = /^[A-Za-z\s]+$/;
var priceRegex = /^\d+(\.\d{1,2})?$/;
var descriptionRegex = /^[A-Za-z0-9\s.,!?"'()-]*$/;
var categoryRegex = /^[A-Za-z\s]+$/;

// Get elements
var productName = document.getElementById("productName");
var productPrice = document.getElementById("productPrice");
var productDescription = document.getElementById("productDescription");
var productCategory = document.getElementById("productCategory");
var tableBody = document.getElementById("tableBody");
var addAndUpdateBtn = document.getElementById("addBtn");
var productContainer = [];
var currentIndex;

// Load products from local storage
if (localStorage.getItem("allProducts") != null) {
    productContainer = JSON.parse(localStorage.getItem("allProducts"));
    displayProduct(productContainer);
} else {
    productContainer = [];
}

// Event listeners for runtime validation
productName.addEventListener('input', validateName);
productPrice.addEventListener('input', validatePrice);
productDescription.addEventListener('input', validateDescription);
productCategory.addEventListener('input', validateCategory);

function validateName() {
    var name = productName.value;
    if (!nameRegex.test(name)) {
        showError("productName", "Invalid name. Must contain letters only.");
        toggleAddButton(false);
    } else {
        hideError("productName");
        checkAllFields();
    }
}

function validatePrice() {
    var price = productPrice.value;
    if (!priceRegex.test(price)) {
        showError("productPrice", "Invalid price. Must be a positive number.");
        toggleAddButton(false);
    } else {
        hideError("productPrice");
        checkAllFields();
    }
}

function validateDescription() {
    var desc = productDescription.value;
    if (!descriptionRegex.test(desc)) {
        showError("productDescription", "Invalid description. Allowed characters: letters, numbers, and specific symbols.");
        toggleAddButton(false);
    } else {
        hideError("productDescription");
        checkAllFields();
    }
}

function validateCategory() {
    var cat = productCategory.value;
    if (!categoryRegex.test(cat)) {
        showError("productCategory", "Invalid category. Must contain letters only.");
        toggleAddButton(false);
    } else {
        hideError("productCategory");
        checkAllFields();
    }
}

function showError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var errorId = fieldId + "Error";
    var errorElem = document.getElementById(errorId);
    if (!errorElem) {
        errorElem = document.createElement("span");
        errorElem.id = errorId;
        errorElem.style.color = "red";
        field.parentElement.appendChild(errorElem);
    }
    errorElem.textContent = message;
}

function hideError(fieldId) {
    var errorId = fieldId + "Error";
    var errorElem = document.getElementById(errorId);
    if (errorElem) {
        errorElem.textContent = "";
    }
}

function toggleAddButton(enable) {
    addAndUpdateBtn.disabled = !enable;
}

function checkAllFields() {
    if (nameRegex.test(productName.value) &&
        priceRegex.test(productPrice.value) &&
        descriptionRegex.test(productDescription.value) &&
        categoryRegex.test(productCategory.value)) {
        toggleAddButton(true);
    } else {
        toggleAddButton(false);
    }
}

function productAction() {
    if (addAndUpdateBtn.innerHTML === "Add Product") {
        // Add Product
        addProduct();
    } else {
        // Update Product
        updateProduct();
    }
}

function addProduct() {
    var product = {
        name: productName.value,
        price: productPrice.value,
        desc: productDescription.value,
        cat: productCategory.value
    };
    productContainer.push(product);
    localStorage.setItem("allProducts", JSON.stringify(productContainer));
    displayProduct(productContainer);
    clearProduct();
}

function updateProduct() {
    var product = {
        name: productName.value,
        price: productPrice.value,
        desc: productDescription.value,
        cat: productCategory.value
    };
    productContainer[currentIndex] = product;
    localStorage.setItem("allProducts", JSON.stringify(productContainer));
    displayProduct(productContainer);
    clearProduct();
    addAndUpdateBtn.innerHTML = "Add Product";
}

function clearProduct() {
    productName.value = "";
    productPrice.value = "";
    productDescription.value = "";
    productCategory.value = "";
    checkAllFields(); // Recheck validation
}

function displayProduct(arrayContainer) {
    var box = ``;
    for (var i = 0; i < arrayContainer.length; i++) {
        box += `<tr>
                    <td>${i + 1}</td>
                    <td>${arrayContainer[i].name}</td>
                    <td>${arrayContainer[i].price}</td>
                    <td>${arrayContainer[i].desc}</td>
                    <td>${arrayContainer[i].cat}</td>
                    <td>
                      <button class="btn btn-success" type="button" onclick="deleteProduct(${i})">Delete</button>
                      <button class="btn btn-secondary" type="button" onclick="getObj(${i})">Update</button>
                    </td>
                  </tr>`;
    }
    tableBody.innerHTML = box;
}

function getObj(index) {
    currentIndex = index;
    productName.value = productContainer[index].name;
    productPrice.value = productContainer[index].price;
    productDescription.value = productContainer[index].desc;
    productCategory.value = productContainer[index].cat;
    addAndUpdateBtn.innerHTML = "Update Product";
    checkAllFields(); // Recheck validation on update
}

function deleteProduct(index) {
    productContainer.splice(index, 1);
    localStorage.setItem("allProducts", JSON.stringify(productContainer));
    displayProduct(productContainer);
}

function searchProduct(term) {
    var filterProduct = [];
    for (var i = 0; i < productContainer.length; i++) {
        if (productContainer[i].name.toLowerCase().includes(term.toLowerCase())) {
            filterProduct.push(productContainer[i]);
        }
    }
    displayProduct(filterProduct);
}

function deleteAll() {
    localStorage.removeItem("allProducts");
    productContainer = [];
    displayProduct(productContainer);
}
