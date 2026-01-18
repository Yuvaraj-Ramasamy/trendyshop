// Initialize AOS (Animate On Scroll)
AOS.init();
let cartItems = [];
let cartCount = 0;
const cartCountElement = document.querySelector('.cart-count');
const cartIcon = document.querySelector('.cart');

// Add to cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the product card click event from firing
        const productName = button.getAttribute('data-product');
        const productPrice = button.getAttribute('data-price');
        const productImage = button.closest('.product-card').querySelector('img').src;

        // Add to cart array
        const existingItem = cartItems.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }

        cartCount++;
        cartCountElement.textContent = cartCount;

        // Add animation to cart icon
        cartIcon.classList.add('animate__animated', 'animate__bounce');
        setTimeout(() => {
            cartIcon.classList.remove('animate__animated', 'animate__bounce');
        }, 1000);

        // Save to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('cartCount', cartCount);
    });
});

// Load cart from localStorage on page load
window.addEventListener('load', () => {
    const savedCart = localStorage.getItem('cartItems');
    const savedCount = localStorage.getItem('cartCount');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        cartCount = parseInt(savedCount) || 0;
        cartCountElement.textContent = cartCount;
    }
});

// Cart modal functionality
const cartModal = document.getElementById('cart-modal');
const cartModalContent = document.getElementById('cart-modal-content');
const cartCloseBtn = document.querySelector('.cart-close');

cartIcon.addEventListener('click', () => {
    displayCart();
    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

cartCloseBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

function displayCart() {
    cartModalContent.innerHTML = '<h2>Your Cart</h2>';
    if (cartItems.length === 0) {
        cartModalContent.innerHTML += '<p>Your cart is empty.</p>';
    } else {
        let total = 0;
        cartItems.forEach((item, index) => {
            const itemTotal = parseFloat(item.price.replace('$', '')) * item.quantity;
            total += itemTotal;
            cartModalContent.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Price: ${item.price}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <p>Total: $${itemTotal.toFixed(2)}</p>
                    </div>
                    <button class="remove-item" data-index="${index}">Remove</button>
                </div>
            `;
        });
        cartModalContent.innerHTML += `<div class="cart-total"><h3>Total: $${total.toFixed(2)}</h3></div>`;
        cartModalContent.innerHTML += '<button class="checkout-btn">Proceed to Checkout</button>';
    }

    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            const removedItem = cartItems[index];
            cartCount -= removedItem.quantity;
            cartItems.splice(index, 1);
            cartCountElement.textContent = cartCount;
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            localStorage.setItem('cartCount', cartCount);
            displayCart();
        });
    });

    // Add event listener for checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')) * item.quantity, 0);
            if (confirm(`Your total is $${total.toFixed(2)}. Proceed to payment?`)) {
                cartModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                openPaymentModal(total);
            }
        });
    }
}

// Search functionality
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase().trim();
    if (query) {
        // Filter products based on search query
        const productCards = document.querySelectorAll('.product-card');
        let found = false;
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            if (productName.includes(query)) {
                card.style.display = 'block';
                found = true;
            } else {
                card.style.display = 'none';
            }
        });
        if (!found) {
            alert(`No products found for: ${query}`);
        } else {
            // Navigate to products section
            document.querySelector('#products').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    } else {
        // Show all products if search is empty
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.style.display = 'block';
        });
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Clear search when input is cleared
searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() === '') {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.style.display = 'block';
        });
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Product modal functionality
const modal = document.getElementById('product-modal');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalDescription = document.getElementById('modal-description');
const modalPrice = document.getElementById('modal-price');
const closeBtn = document.querySelector('.close');

// Open modal when clicking on product cards
document.querySelectorAll('.product-card').forEach((card) => {
    card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const title = card.querySelector('h3').textContent;
        const price = card.querySelector('p').textContent;

        modalTitle.textContent = title;
        modalImage.src = img.src;
        modalDescription.textContent = `Discover the ${title.toLowerCase()} - a perfect addition to your collection.`;
        modalPrice.textContent = price;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    });
});

// Close modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(30, 30, 30, 0.95)';
    } else {
        header.style.backgroundColor = '#1e1e1e';
    }
});

// Payment modal functionality
function openPaymentModal(total) {
    const paymentModal = document.createElement('div');
    paymentModal.id = 'payment-modal';
    paymentModal.className = 'modal';
    paymentModal.innerHTML = `
        <div class="modal-content payment-modal-content">
            <span class="close payment-close">&times;</span>
            <h2>Payment Details</h2>
            <p>Total Amount: $${total.toFixed(2)}</p>
            <form id="payment-form">
                <div class="form-group">
                    <label for="card-number">Card Number</label>
                    <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="expiry-date">Expiry Date</label>
                        <input type="text" id="expiry-date" placeholder="MM/YY" maxlength="5" required>
                    </div>
                    <div class="form-group">
                        <label for="cvv">CVV</label>
                        <input type="text" id="cvv" placeholder="123" maxlength="4" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="card-name">Cardholder Name</label>
                    <input type="text" id="card-name" placeholder="John Doe" required>
                </div>
                <button type="submit" id="submit-payment" class="btn-primary">Complete Payment</button>
            </form>
            <div id="payment-errors" role="alert"></div>
        </div>
    `;
    document.body.appendChild(paymentModal);
    paymentModal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Format card number input
    const cardNumberInput = document.getElementById('card-number');
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });

    // Format expiry date input
    const expiryInput = document.getElementById('expiry-date');
    expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });

    // Close payment modal
    const paymentCloseBtn = paymentModal.querySelector('.payment-close');
    paymentCloseBtn.addEventListener('click', () => {
        paymentModal.remove();
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === paymentModal) {
            paymentModal.remove();
            document.body.style.overflow = 'auto';
        }
    });

    // Handle payment form submission
    const paymentForm = document.getElementById('payment-form');
    const submitBtn = document.getElementById('submit-payment');
    const errorDisplay = document.getElementById('payment-errors');

    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDisplay.textContent = '';

        // Basic validation
        const cardNumber = cardNumberInput.value.replace(/\s+/g, '');
        const expiry = expiryInput.value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('card-name').value;

        if (cardNumber.length < 13 || cardNumber.length > 19) {
            errorDisplay.textContent = 'Please enter a valid card number.';
            return;
        }

        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            errorDisplay.textContent = 'Please enter a valid expiry date (MM/YY).';
            return;
        }

        if (cvv.length < 3 || cvv.length > 4) {
            errorDisplay.textContent = 'Please enter a valid CVV.';
            return;
        }

        if (cardName.trim().length < 2) {
            errorDisplay.textContent = 'Please enter the cardholder name.';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        // Simulate payment processing
        setTimeout(() => {
            const isSuccess = Math.random() > 0.1; // 90% success rate for simulation

            if (isSuccess) {
                alert('Payment processed successfully! Thank you for your purchase.');
                // Clear cart
                cartItems = [];
                cartCount = 0;
                cartCountElement.textContent = cartCount;
                localStorage.removeItem('cartItems');
                localStorage.removeItem('cartCount');
                paymentModal.remove();
                document.body.style.overflow = 'auto';
            } else {
                errorDisplay.textContent = 'Payment failed. Please check your card details and try again.';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Complete Payment';
            }
        }, 2000); // Simulate 2-second processing time
    });
}

// Hamburger menu functionality
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-menu li a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Particles.js configuration
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#9c27b0'
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 0,
                color: '#000000'
            },
            polygon: {
                nb_sides: 5
            }
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#9c27b0',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'repulse'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 200,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
});

// Additional animation effects
function addRippleEffect(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

// Add ripple effect to buttons
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', addRippleEffect);
});

// Scroll-triggered animations
function revealOnScroll() {
    const elements = document.querySelectorAll('.category-card, .product-card, .info-item');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate__animated', 'animate__fadeInUp');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Apply typing effect to hero title
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-content h2');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
    document.body.classList.add('loaded');
});

// Carousel functionality
let currentSlide = 0;
let slides;
let indicators;
let carouselInterval;

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Show current slide
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Pause on hover
const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(nextSlide, 4000);
    });
}

// Indicator click handlers
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        showSlide(index);
        // Reset auto-play timer
        clearInterval(carouselInterval);
        carouselInterval = setInterval(nextSlide, 4000);
    });
});

// Touch/swipe support for mobile
let startX = 0;
let endX = 0;

if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    carouselContainer.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;

        if (Math.abs(diffX) > 50) { // Minimum swipe distance
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            // Reset auto-play timer
            clearInterval(carouselInterval);
            carouselInterval = setInterval(nextSlide, 4000);
        }
    });
}

// Add loading animation to page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
