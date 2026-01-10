document.addEventListener('DOMContentLoaded', () => {
    // Check if we are in a valid section
    const path = decodeURIComponent(window.location.pathname).toLowerCase();
    const validSections = ['handbook', 'history_of_humanity', 'minions&villains'];
    let currentSection = '';
    
    for (const section of validSections) {
        if (path.indexOf(section) !== -1) {
            currentSection = section;
            break;
        }
    }

    // If not in a valid section, do not inject the search bar
    if (!currentSection) {
        return;
    }

    // Helper to calculate relative paths
    function getRelativePaths() {
        const path = window.location.pathname;
        const parts = path.split('/').filter(p => p.length > 0);
        
        let sectionIndex = -1;
        for(let i=0; i<parts.length; i++) {
            if(parts[i].toLowerCase() === currentSection) {
                sectionIndex = i;
                break;
            }
        }
        
        if (sectionIndex === -1) return { toHandbook: '', toRoot: '../' };
        
        // Calculate how deep we are inside the section folder
        // parts.length - 1 is the index of the file
        // sectionIndex is the index of the section folder
        const segmentsAfterSection = (parts.length - 1) - sectionIndex;
        
        // Depth 0 means file is directly in section folder (e.g. handbook/file.html)
        const depth = segmentsAfterSection - 1; 
        
        // Path to get back to the section root
        const toSectionRootPath = depth > 0 ? '../'.repeat(depth) : '';
        
        // Path to get back to the 'singularity' folder (parent of section)
        const toRoot = '../'.repeat(depth + 1);
        
        let toHandbook = '';
        if (currentSection === 'handbook') {
            toHandbook = toSectionRootPath;
        } else {
            // From history_of_humanity root, we need ../handbook/
            toHandbook = toRoot + 'handbook/';
        }
        
        return { toHandbook, toRoot };
    }

    const paths = getRelativePaths();
    const pathPrefix = paths.toHandbook; // Used for search result links
    const rootPath = paths.toRoot;       // Used for the Home link

    // 1. Inject Navbar (Header)
    const navbar = document.createElement('nav');
    navbar.className = 'navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary fixed-top no-print';
    // Custom styling to match the theme (Dark background + Purple border)
    navbar.style.cssText = 'background-color: #0d0e12 !important; border-bottom: 1px solid #BD5FFF !important; box-shadow: 0 4px 20px rgba(0,0,0,0.5);';
    
    navbar.innerHTML = `
        <div class="container-fluid px-4">
            <a class="navbar-brand d-flex align-items-center" href="${rootPath}index.html" title="Go to Home">
                <span style="color: #BD5FFF; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">Singularity</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSearchContent" aria-controls="navbarSearchContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarSearchContent">
                <div class="d-flex position-relative mt-3 mt-lg-0" style="width: 100%; max-width: 400px;">
                    <input class="form-control bg-dark text-light border-secondary" type="search" id="searchInput" placeholder="Search" aria-label="Search">
                    <div id="searchResults" class="list-group position-absolute w-100 mt-1" style="top: 100%; z-index: 1000; display: none; max-height: 300px; overflow-y: auto; box-shadow: 0 10px 20px rgba(0,0,0,0.8);"></div>
                </div>
            </div>
        </div>
    `;

    // Insert at the very top of the body
    document.body.insertBefore(navbar, document.body.firstChild);

    // 2. Load Font Awesome for icons (if not already loaded)
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        fontAwesome.integrity = 'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==';
        fontAwesome.crossOrigin = 'anonymous';
        fontAwesome.referrerPolicy = 'no-referrer';
        document.head.appendChild(fontAwesome);
    }

    // 3. Inject Footer with Social Media Links
    const footer = document.createElement('footer');
    footer.className = 'social-footer pt-4 border-top';
    footer.style.cssText = 'border-color: rgba(189, 95, 255, 0.3) !important;';
    
    footer.innerHTML = `
        <div class="container-fluid px-4">
            <div class="row align-items-center">
                <div class="col-12 text-center">
                    <p class="mb-3 text-muted" style="color: #a0aec0 !important; font-size: 0.9rem;">Join our community</p>
                    <div class="social-links d-flex justify-content-center gap-3 flex-wrap">
                        <a href="https://discord.gg/AbBtu3XG" target="_blank" rel="noopener noreferrer" class="social-link" title="Discord" aria-label="Discord">
                            <i class="fab fa-discord"></i>
                        </a>
                        <a href="https://www.facebook.com/SingularityTTRPG/" target="_blank" rel="noopener noreferrer" class="social-link" title="Facebook" aria-label="Facebook">
                            <i class="fab fa-facebook"></i>
                        </a>
                        <a href="https://www.reddit.com/r/SingularityTTRPG/" target="_blank" rel="noopener noreferrer" class="social-link" title="Reddit" aria-label="Reddit">
                            <i class="fab fa-reddit"></i>
                        </a>
                        <a href="https://www.youtube.com/@SingularityTTRPG" target="_blank" rel="noopener noreferrer" class="social-link" title="YouTube" aria-label="YouTube">
                            <i class="fab fa-youtube"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(footer);

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