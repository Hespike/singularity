document.addEventListener('DOMContentLoaded', () => {
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

        const results = searchIndex.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.tags.toLowerCase().includes(query)
        );

        if (results.length > 0) {
            resultsContainer.style.display = 'block';
            results.forEach(item => {
                const link = document.createElement('a');
                link.href = item.url;
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