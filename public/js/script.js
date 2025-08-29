// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// JS Code for listings index.ejs
// working of right and left for scroll
const scrollContainer = document.getElementById('filters');
const scrollLeftBtn = document.getElementById('scrollLeft');
const scrollRightBtn = document.getElementById('scrollRight');

//  Add null checks so code doesn’t break on pages where buttons/filters don’t exist
if (scrollContainer && scrollLeftBtn) {
  scrollLeftBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: -200, behavior: 'smooth' });
  });
}
if (scrollContainer && scrollRightBtn) {
  scrollRightBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
  });
}

// show the taxes when switch is on, don't show otherwise.
let taxSwitch = document.getElementById("switchCheckDefault");

//  Add null check for pages where switch is not present
if (taxSwitch) {
  taxSwitch.addEventListener("click", () => {
    let taxInfo = document.getElementsByClassName("tax-info");
    for (let info of taxInfo) {
      if (info.style.display != "inline") {
        info.style.display = "inline";
      } else {
        info.style.display = "none";
      }
    }
  });
}
