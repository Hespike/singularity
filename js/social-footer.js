// Social Footer Injection for index.html
document.addEventListener('DOMContentLoaded', () => {
    // Only inject if footer doesn't already exist (to avoid duplicates from search_logic.js)
    if (document.querySelector('.social-footer')) {
        return;
    }

    const footer = document.createElement('footer');
    footer.className = 'social-footer pt-5 pb-4 border-top';
    footer.style.cssText = 'border-color: rgba(189, 95, 255, 0.3) !important;';
    
    footer.innerHTML = `
        <div class="container">
            <div class="row align-items-center">
                <div class="col-12 text-center">
                    <p class="mb-3 text-muted" style="color: #a0aec0 !important; font-size: 0.9rem;">Join our community</p>
                    <div class="social-links d-flex justify-content-center gap-3 flex-wrap">
                        <a href="https://discord.gg/pe6Bb2rHgW" target="_blank" rel="noopener noreferrer" class="social-link" title="Discord" aria-label="Discord">
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
});
