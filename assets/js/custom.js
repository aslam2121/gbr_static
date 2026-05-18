// Navbar HTML — edit here to update nav across all pages
var GBR_NAVBAR = `
<nav class="navbar navbar-expand-lg bg-primary shadow-sm navbar-light">
    <div class="container">
        <a class="navbar-brand" href="index.html"><img class="d-inline-block align-text-top" src="assets/img/gbr%20logo.png" alt="Brand Logo" height="40"></a>
        <button data-bs-toggle="collapse" data-bs-target="#navbarNav" class="navbar-toggler ms-auto" type="button" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" style="border:2px solid var(--bs-secondary-bg);border-radius:7px;">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav text-uppercase mb-2 mb-lg-0">
                <li class="nav-item"><a class="nav-link d-flex flex-column align-items-center text-white" href="index.html"><i class="fs-5 bi bi-house-door"></i> Home</a></li>
                <li class="nav-item"><a class="nav-link d-flex flex-column align-items-center text-white" href="about.html"><i class="fs-5 bi bi-info-circle"></i> About</a></li>
                <li class="nav-item"><a class="nav-link d-flex flex-column align-items-center text-white" href="how_gbr_works.html"><i class="fs-5 bi bi-layers"></i> How GBR Works</a></li>
                <li class="nav-item"><a class="nav-link d-flex flex-column align-items-center text-white" href="company.html"><i class="fs-5 bi bi-building"></i> Company</a></li>
                <li class="nav-item"><a class="nav-link d-flex flex-column align-items-center text-white" href="investor.html"><i class="fs-5 bi bi-journal-text"></i> Investor</a></li>
                <li class="nav-item"><a class="nav-link d-flex flex-column align-items-center text-white" href="Expert.html"><i class="fs-5 bi bi-person-check"></i> Expert</a></li>
                <li class="nav-item"><a class="nav-link d-flex flex-column align-items-center text-white" href="register.html"><i class="fs-5 bi bi-person-plus"></i> New Member</a></li>
                <li class="nav-item"><a class="nav-link d-flex flex-column align-items-center text-white" href="messaging.html"><i class="fs-5 bi bi-chat-dots"></i> Messaging</a></li>
                <li class="nav-item"><a class="nav-link d-flex flex-column align-items-center text-white" href="videochat.html"><i class="fs-5 bi bi-camera-video"></i> Video Chat</a></li>
                <li class="nav-item"><a class="nav-link d-flex flex-column align-items-center text-white" href="contactus.html"><i class="fs-5 bi bi-envelope"></i> Contact Us</a></li>
                <li class="nav-item"><a class="nav-link d-flex flex-column align-items-center text-white" href="policies.html"><i class="fs-5 bi bi-shield-check"></i> Policies</a></li>
                <li class="nav-item"><a class="nav-link d-flex flex-column align-items-center text-white" href="faq.html"><i class="fs-5 bi bi-question-circle"></i> FAQ</a></li>
            </ul>
        </div>
    </div>
</nav>
<div style="height:8px;background:#0083ae;"></div>
`;

// Inject navbar
var navbarPlaceholder = document.getElementById('navbar-placeholder');
if (navbarPlaceholder) {
    navbarPlaceholder.outerHTML = GBR_NAVBAR;
    var currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-nav .nav-link').forEach(function(link) {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            link.style.opacity = '0.75';
        }
    });
}

// Footer HTML — edit here to update footer across all pages
var GBR_FOOTER = `
<footer class="gbr-footer">
    <img src="assets/img/gbr_logo_blue.png" alt="GBR" />
    <ul>
        <li><a href="register.html">Sign Up</a></li>
        <li><a href="login.html">Sign In</a></li>
        <li><a href="how_gbr_works.html">How GBR Works</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="contactus.html">Contact Us</a></li>
        <li><a href="policies.html">Policies</a></li>
        <li><a href="faq.html">FAQ</a></li>
    </ul>
</footer>
`;

// Inject footer
var footerPlaceholder = document.getElementById('footer-placeholder');
if (footerPlaceholder) {
    footerPlaceholder.outerHTML = GBR_FOOTER;
}
