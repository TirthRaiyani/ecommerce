document.addEventListener('DOMContentLoaded', () => {
    // const API_URL = 'http://localhost:5000/api/products';

    const nameInput = document.getElementById('name');
    const descriptionInput = document.getElementById('description');
    const priceInput = document.getElementById('price');
    const stockInput = document.getElementById('stock');
    const submitButton = document.getElementById('submit');
    const productList = document.getElementById('product-list');

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/getallproducts");
            const data = await response.json();
            productList.innerHTML = '';
            data.forEach(product => {
                const productItem = document.createElement('div');
                productItem.className = 'product-item';
                productItem.innerHTML = `
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p>Price: ${product.price}</p>
          <p>Stock: ${product.stock}</p>
          <button onclick="deleteProduct(${product.id})">Delete</button>
          <button onclick="editProduct(${product.id})">Edit</button>
        `;
                productList.appendChild(productItem);
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const createProduct = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: nameInput.value,
                    description: descriptionInput.value,
                    price: parseFloat(priceInput.value),
                    stock: parseInt(stockInput.value)
                })
            });
            const data = await response.json();
            console.log('Product created:', data);
            fetchProducts();
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        createProduct();
    });

    fetchProducts();
});

const deleteProduct = async (id) => {
    try {
        await fetch(`http://localhost:3000/api/updateproducts/${id}`, {
            method: 'DELETE'
        });
        console.log('Product deleted:', id);
        fetchProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
    }
};

const editProduct = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/api/updateproducts/${id}`);
        const product = await response.json();
        document.getElementById('name').value = product.name;
        document.getElementById('description').value = product.description;
        document.getElementById('price').value = product.price;
        document.getElementById('stock').value = product.stock;
        editProduct = id;
        document.getElementById('submit').textContent = 'Update Product';
    } catch (error) {
        console.error('Error fetching product:', error);
    }
};
