const words = [
    "Desarrollo Web",
    "Marketing Digital",
    "Producción Audiovisual"
  ];
  let currentWord = 0;
  let currentChar = 0;
  let writing = true;
  const element = document.getElementById('typed-words');

  function typeEffect() {
    const word = words[currentWord];
    if(writing){
      if(currentChar < word.length){
        element.innerHTML = word.slice(0, currentChar + 1);
        currentChar++;
        setTimeout(typeEffect, 70);
      } else {
        writing = false;
        setTimeout(typeEffect, 1200); // Wait before deleting
      }
    } else {
      if(currentChar > 0){
        element.innerHTML = word.slice(0, currentChar - 1);
        currentChar--;
        setTimeout(typeEffect, 30);
      } else {
        writing = true;
        currentWord = (currentWord + 1) % words.length;
        setTimeout(typeEffect, 350);
      }
    }
  }
  typeEffect();


  