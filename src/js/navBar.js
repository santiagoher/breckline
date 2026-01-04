// Mobile menu functionality
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
    this.classList.toggle('bg-blue-50');
    this.classList.toggle('text-blue-600');
  });

  // Mobile dropdown functionality
  document.querySelectorAll('.mobile-dropdown-btn').forEach(button => {
    button.addEventListener('click', function() {
      const dropdownContent = this.nextElementSibling;
      const icon = this.querySelector('svg');
      
      dropdownContent.classList.toggle('hidden');
      icon.classList.toggle('rotate-180');
      this.classList.toggle('bg-blue-50');
      this.classList.toggle('text-blue-600');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileButton = document.getElementById('mobile-menu-button');
    
    if (!mobileMenu.contains(event.target) && !mobileButton.contains(event.target)) {
      mobileMenu.classList.add('hidden');
      mobileButton.classList.remove('bg-blue-50', 'text-blue-600');
    }
  });

