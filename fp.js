// ==================== HAMBURGER MENU ====================
function toggleMenu() {
    $('nav ul').toggleClass('open');
}

// ==================== AUTO-SCROLL CAROUSEL ====================
function initCarousel(selector, delay = 3000) {
    const carousel = $(selector);
    if (carousel.length === 0) return;

    let autoScrollInterval;
    let isPaused = false;
    let scrollTimeout;

    function startAutoScroll() {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
        
        autoScrollInterval = setInterval(() => {
            if (isPaused) return;
            
            const scrollLeft = carousel.scrollLeft();
            const offsetWidth = carousel.outerWidth();
            const scrollWidth = carousel[0].scrollWidth;
            const cardWidth = carousel.find('[class*="card"]').first().outerWidth();

            if (scrollLeft + offsetWidth >= scrollWidth - 10) { // 
                carousel[0].scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                carousel[0].scrollTo({ 
                    left: scrollLeft + cardWidth, 
                    behavior: 'smooth' 
                });
            }
        }, delay);
    }

    // PAUSE
    carousel.on('mouseenter', () => {
        isPaused = true;
        if (autoScrollInterval) clearInterval(autoScrollInterval);
    });

    // RESUME
    carousel.on('mouseleave', () => {
        isPaused = false;
        scrollTimeout = setTimeout(startAutoScroll, 500); // DELAY
    });

    // CLEAR TIMEOUT
    carousel.on('mouseenter', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
            scrollTimeout = null;
        }
    });

    // START AUTO-SCROLL
    startAutoScroll();
}

// ==================== IMPROVED SCROLL FUNCTIONS ====================
function scrollCarousel(selector, direction) {
    const carousel = $(selector);
    const cardWidth = carousel.find('[class*="card"]').first().outerWidth();
    
    // PAUSE AUTO-SCROLL DURING MANUAL SCROLL
    const wasPaused = $(selector).data('isPaused') || false;
    $(selector).data('isPaused', true);
    
    carousel[0].scrollBy({ 
        left: direction * cardWidth, 
        behavior: 'smooth' 
    });
    
    // RESUME AUTO-SCROLL AFTER MANUAL SCROLL
    setTimeout(() => {
        $(selector).data('isPaused', wasPaused);
    }, 800); 
}

function scrollFamily(direction) {
    scrollCarousel('.f-carousel', direction);
}


// ==================== INITIALIZE ON DOCUMENT READY ====================
$(document).ready(() => {
    // INITIALIZATION
    initCarousel('.carousel', 4000);  
    initCarousel('.f-carousel', 4000);
});


/* ==================== IMAGE ZOOM ==================== */
$(document).ready(function() {
    const $modal = $("#imgModal");
    const $modalImg = $("#modalImg");

    $("img:not(.no-preview)").css("cursor", "pointer");

    $("img:not(.no-preview)").on("click", function() {
        $modal.fadeIn(200);
        $modalImg.attr("src", $(this).data("full") || $(this).attr("src"));
    });

    $(".close").on("click", function() {
        $modal.fadeOut(200);
    });

    $modal.on("click", function(e) {
        if ($(e.target).is("#imgModal")) {
            $modal.fadeOut(200);
        }
    });

    $(document).on("keydown", function(e) {
        if (e.key === "Escape") {
            $modal.fadeOut(200);
        }
    });
});

// ==================== PROJECT CARD EXPAND ====================
$(document).ready(function() {
    $('.project-card').on('click', function(e) {
        if ($(e.target).closest('.toggle-btn').length) return;
        
        const $card = $(this);
        
        if ($card.hasClass('expanded')) {
            $card.removeClass('expanded');
        } else {
            $('.project-card.expanded').removeClass('expanded');
            $card.addClass('expanded');
        }
    });
    
    $('.toggle-btn').on('click', function(e) {
        e.stopPropagation();
        const $card = $(this).closest('.project-card');
        $card.removeClass('expanded');
    });
});

// ==================== PROJECT GALLERY FUNCTIONS ====================
function scrollGallery(button, direction) {
    event.stopPropagation();

    const $gallery = $(button).closest('.project-image-gallery');
    const $carousel = $gallery.find('.gallery-carousel');
    const cardWidth = $carousel.find('.gallery-card').first().outerWidth(true);
    
    $carousel.animate({
        scrollLeft: '+=' + (direction * cardWidth)
    }, 400, 'swing');
    
    updateGalleryIndicators($gallery);
}

function updateGalleryIndicators($gallery) {
    const $carousel = $gallery.find('.gallery-carousel');
    const $cards = $carousel.find('.gallery-card');
    const scrollLeft = $carousel.scrollLeft();
    const cardWidth = $cards.first().outerWidth(true);
    
    const currentIndex = Math.round(scrollLeft / cardWidth);
    
    $gallery.find('.gallery-dot').removeClass('active');
    if ($gallery.find('.gallery-dot')[currentIndex]) {
        $($gallery.find('.gallery-dot')[currentIndex]).addClass('active');
    }
}

function initProjectGalleries() {
    $('.project-image-gallery').each(function() {
        const $gallery = $(this);
        const $carousel = $gallery.find('.gallery-carousel');
        const $cards = $carousel.find('.gallery-card');

        // PREVENT DUPLICATE INITIALIZATION
        if ($gallery.data('initialized')) return;
        $gallery.data('initialized', true);

        if ($cards.length <= 1) {
            $gallery.find('.gallery-nav').hide();
            return;
        }
        
        // INDICATORS
        const $indicators = $('<div class="gallery-indicators"></div>');
        $cards.each(function(index) {
            const $dot = $(`<div class="gallery-dot ${index === 0 ? 'active' : ''}"></div>`);
            $dot.on('click', function(e) {
                e.stopPropagation();
                $carousel.animate({
                    scrollLeft: index * $cards.first().outerWidth(true)
                }, 400);
                updateGalleryIndicators($gallery);
            });
            $indicators.append($dot);
        });
        $gallery.find('.gallery-nav').after($indicators);
    });
}

// GALLERIES INITIALIZATION ON DOCUMENT READY   
$(document).ready(function() {
    // RE-INITIALIZE GALLERIES ON PROJECT CARD TOGGLE
    $(document).on('click', '.project-card', function() {
        setTimeout(() => {
            initProjectGalleries();
        }, 100);
    });
});