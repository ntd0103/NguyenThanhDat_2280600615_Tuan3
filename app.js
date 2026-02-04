// API Base URL
const API_URL = 'https://api.escuelajs.co/api/v1/products';

// State
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 10;
let sortColumn = null;
let sortDirection = 'asc';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('input', function(e) {
        handleSearch(e.target.value);
    });

    // Items per page
    document.getElementById('itemsPerPage').addEventListener('change', function(e) {
        itemsPerPage = parseInt(e.target.value);
        currentPage = 1;
        renderTable();
    });

    // Sort
    document.getElementById('sortTitle').addEventListener('click', () => {
        sortBy('title');
    });

    document.getElementById('sortPrice').addEventListener('click', () => {
        sortBy('price');
    });

    // Export
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);

    // Create
    document.getElementById('createBtn').addEventListener('click', openCreateModal);
    document.getElementById('saveCreateBtn').addEventListener('click', createProduct);

    // Edit
    document.getElementById('saveEditBtn').addEventListener('click', updateProduct);
}

// Load Products from API
async function loadProducts() {
    try {
        showLoading();
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        renderTable();
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.');
    }
}

// Show Loading
function showLoading() {
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="loading">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </td>
        </tr>
    `;
}

// Show Error
function showError(message) {
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center text-danger">
                <i class="bi bi-exclamation-circle"></i> ${message}
            </td>
        </tr>
    `;
}

// Handle Search
function handleSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    renderTable();
}

// Sort By Column
function sortBy(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }

    filteredProducts.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];

        if (column === 'title') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }

        if (sortDirection === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    updateSortIcons();
    renderTable();
}

// Update Sort Icons
function updateSortIcons() {
    // Reset all icons
    document.querySelectorAll('.sortable i').forEach(icon => {
        icon.className = 'bi bi-arrow-down-up';
    });

    // Update active sort icon
    if (sortColumn) {
        const iconClass = sortDirection === 'asc' ? 'bi-sort-up' : 'bi-sort-down';
        const sortElement = sortColumn === 'title' ? 'sortTitle' : 'sortPrice';
        document.querySelector(`#${sortElement} i`).className = `bi ${iconClass}`;
    }
}

// Render Table
function renderTable() {
    const tbody = document.getElementById('productTableBody');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageProducts = filteredProducts.slice(start, end);

    if (pageProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">
                    <i class="bi bi-inbox"></i> Không tìm thấy sản phẩm nào
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = pageProducts.map(product => `
            <tr data-description="${escapeHtml(product.description)}" title="${escapeHtml(product.description)}">
                <td>${product.id}</td>
                <td>${escapeHtml(product.title)}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    ${product.category ? `
                        <span class="badge bg-secondary">${escapeHtml(product.category.name || 'N/A')}</span>
                    ` : 'N/A'}
                </td>
                <td>
                    ${product.images && product.images.length > 0 
                        ? `<img src="${product.images[0]}" alt="${escapeHtml(product.title)}" class="product-image" onerror="this.src='https://via.placeholder.com/50'">` 
                        : '<span class="text-muted">No image</span>'}
                </td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewProduct(${product.id})">
                        <i class="bi bi-eye"></i> View
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderPagination();
    updatePageInfo(start, end);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Render Pagination
function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">
                <i class="bi bi-chevron-left"></i>
            </a>
        </li>
    `;

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(1); return false;">1</a>
            </li>
        `;
        if (startPage > 2) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
            </li>
        `;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${totalPages}); return false;">${totalPages}</a>
            </li>
        `;
    }

    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">
                <i class="bi bi-chevron-right"></i>
            </a>
        </li>
    `;

    pagination.innerHTML = paginationHTML;
}

// Change Page
function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable();
}

// Update Page Info
function updatePageInfo(start, end) {
    const pageInfo = document.getElementById('pageInfo');
    const actualEnd = Math.min(end, filteredProducts.length);
    pageInfo.textContent = `Hiển thị ${start + 1} - ${actualEnd} của ${filteredProducts.length} sản phẩm`;
}

// View Product Detail
async function viewProduct(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        
        const product = await response.json();
        
        // Populate edit form
        document.getElementById('editId').value = product.id;
        document.getElementById('editTitle').value = product.title;
        document.getElementById('editPrice').value = product.price;
        document.getElementById('editDescription').value = product.description;
        document.getElementById('editCategoryId').value = product.category?.id || 1;
        document.getElementById('editImages').value = product.images?.join(', ') || '';

        // Show image preview
        const previewDiv = document.getElementById('editImagePreview');
        if (product.images && product.images.length > 0) {
            previewDiv.innerHTML = `
                <div class="row g-2">
                    ${product.images.slice(0, 3).map(img => `
                        <div class="col-md-4">
                            <img src="${img}" class="img-fluid rounded" alt="Product" onerror="this.src='https://via.placeholder.com/150'">
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            previewDiv.innerHTML = '';
        }

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('detailModal'));
        modal.show();
    } catch (error) {
        console.error('Error fetching product:', error);
        alert('Không thể tải chi tiết sản phẩm');
    }
}

// Update Product
async function updateProduct() {
    const id = document.getElementById('editId').value;
    const title = document.getElementById('editTitle').value;
    const price = parseFloat(document.getElementById('editPrice').value);
    const description = document.getElementById('editDescription').value;
    const categoryId = parseInt(document.getElementById('editCategoryId').value);
    const imagesText = document.getElementById('editImages').value;
    const images = imagesText.split(',').map(url => url.trim()).filter(url => url);

    if (!title || !price || !description || !categoryId || images.length === 0) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
    }

    const productData = {
        title,
        price,
        description,
        categoryId,
        images
    };

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) throw new Error('Failed to update product');

        const updatedProduct = await response.json();
        
        // Update local data
        const index = allProducts.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            allProducts[index] = { ...allProducts[index], ...updatedProduct };
        }
        
        // Update filtered products
        const filteredIndex = filteredProducts.findIndex(p => p.id === parseInt(id));
        if (filteredIndex !== -1) {
            filteredProducts[filteredIndex] = { ...filteredProducts[filteredIndex], ...updatedProduct };
        }

        renderTable();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('detailModal'));
        modal.hide();

        alert('Cập nhật sản phẩm thành công!');
    } catch (error) {
        console.error('Error updating product:', error);
        alert('Không thể cập nhật sản phẩm. Vui lòng thử lại.');
    }
}

// Open Create Modal
function openCreateModal() {
    document.getElementById('createForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('createModal'));
    modal.show();
}

// Create Product
async function createProduct() {
    const title = document.getElementById('createTitle').value;
    const price = parseFloat(document.getElementById('createPrice').value);
    const description = document.getElementById('createDescription').value;
    const categoryId = parseInt(document.getElementById('createCategoryId').value);
    const imagesText = document.getElementById('createImages').value;
    const images = imagesText.split(',').map(url => url.trim()).filter(url => url);

    if (!title || !price || !description || !categoryId || images.length === 0) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
    }

    const productData = {
        title,
        price,
        description,
        categoryId,
        images
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) throw new Error('Failed to create product');

        const newProduct = await response.json();
        
        // Add to local data
        allProducts.unshift(newProduct);
        filteredProducts.unshift(newProduct);
        
        currentPage = 1;
        renderTable();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('createModal'));
        modal.hide();

        alert('Tạo sản phẩm mới thành công!');
    } catch (error) {
        console.error('Error creating product:', error);
        alert('Không thể tạo sản phẩm. Vui lòng thử lại.');
    }
}

// Export to CSV
function exportToCSV() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageProducts = filteredProducts.slice(start, end);

    if (pageProducts.length === 0) {
        alert('Không có dữ liệu để export');
        return;
    }

    // CSV Header
    let csv = 'ID,Title,Price,Category,Description,Images\n';

    // CSV Rows
    pageProducts.forEach(product => {
        const row = [
            product.id,
            `"${product.title.replace(/"/g, '""')}"`,
            product.price,
            `"${product.category?.name?.replace(/"/g, '""') || 'N/A'}"`,
            `"${product.description.replace(/"/g, '""')}"`,
            `"${product.images?.join('; ') || ''}"`
        ];
        csv += row.join(',') + '\n';
    });

    // Download
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `products_page_${currentPage}_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
