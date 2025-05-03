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
document.getElementById('scrollLeft').addEventListener('click', () => {
  scrollContainer.scrollBy({ left: -200, behavior: 'smooth' });
});
document.getElementById('scrollRight').addEventListener('click', () => {
  scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
});

// show the taxes when switch is on, don't show otherwise.
let taxSwitch = document.getElementById("switchCheckDefault");
taxSwitch.addEventListener("click", () => {
  let taxInfo = document.getElementsByClassName("tax-info");
  for(info of taxInfo) {
    if(info.style.display != "inline") {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
});