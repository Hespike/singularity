document.addEventListener('DOMContentLoaded', () => {
    // Prevent the search bar from appearing on the main index.html (or any page outside the handbook)
    if (window.location.pathname.toLowerCase().indexOf('handbook') === -1) {
        return;
    }

    // Helper to calculate relative path prefix based on current depth
    function getPathPrefix() {
        const path = window.location.pathname;
        const parts = path.split('/').filter(p => p.length > 0);
        
        // Find 'handbook' index (case insensitive)
        let handbookIndex = -1;
        for(let i=0; i<parts.length; i++) {
            if(parts[i].toLowerCase() === 'handbook') {
                handbookIndex = i;
                break;
            }
        }
        
        if (handbookIndex === -1) return '';
        
        // Calculate depth: (Total segments) - (Index of handbook + 1 for handbook itself + 1 for filename)
        // This gives us how many folders deep we are relative to /handbook/
        const depth = (parts.length) - (handbookIndex + 2);
        
        if (depth <= 0) return '';
        return '../'.repeat(depth);
    }

    const pathPrefix = getPathPrefix();

    // 1. Inject Navbar (Header)
    const navbar = document.createElement('nav');
    navbar.className = 'navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary fixed-top no-print';
    // Custom styling to match the theme (Dark background + Purple border)
    navbar.style.cssText = 'background-color: #0d0e12 !important; border-bottom: 1px solid #BD5FFF !important; box-shadow: 0 4px 20px rgba(0,0,0,0.5);';
    
    navbar.innerHTML = `
        <div class="container-fluid px-4">
            <a class="navbar-brand d-flex align-items-center" href="${pathPrefix}../index.html" title="Return to Home">
                <span style="color: #BD5FFF; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">Singularity</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSearchContent" aria-controls="navbarSearchContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarSearchContent">
                <div class="d-flex position-relative mt-3 mt-lg-0" style="width: 100%; max-width: 400px;">
                    <input class="form-control bg-dark text-light border-secondary" type="search" id="searchInput" placeholder="Search the Handbook" aria-label="Search">
                    <div id="searchResults" class="list-group position-absolute w-100 mt-1" style="top: 100%; z-index: 1000; display: none; max-height: 300px; overflow-y: auto; box-shadow: 0 10px 20px rgba(0,0,0,0.8);"></div>
                </div>
            </div>
        </div>
    `;

    // Insert at the very top of the body
    document.body.insertBefore(navbar, document.body.firstChild);

    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('searchResults');

    if (!searchInput || !resultsContainer) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        resultsContainer.innerHTML = ''; // Clear previous results

        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }

        if (typeof searchIndex === 'undefined') {
            console.error("searchIndex is not defined. Make sure search_data.js is loaded.");
            return;
        }

        const results = searchIndex.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.tags.toLowerCase().includes(query)
        );

        if (results.length > 0) {
            resultsContainer.style.display = 'block';
            results.forEach(item => {
                const link = document.createElement('a');
                // Prepend the calculated prefix to the URL
                link.href = pathPrefix + item.url;
                link.className = 'list-group-item list-group-item-action bg-dark text-light border-secondary';
                link.innerHTML = `<strong>${item.title}</strong>`;
                resultsContainer.appendChild(link);
            });
        } else {
            resultsContainer.style.display = 'block';
            resultsContainer.innerHTML = '<div class="list-group-item bg-dark text-muted border-secondary">No results found</div>';
        }
    });

    // Hide results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });
});