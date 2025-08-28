function main(){
  const searchShow = document.querySelector('.search-btn');
  const createShow = document.querySelector('.create-btn');

  const searchSection = document.querySelector('.search-section');
  const createSection = document.querySelector('.create-post-section');

  const sections = document.querySelectorAll("[class*='-section']");

  if(searchSection !== null){

    searchShow.addEventListener('click', e => {
      if(!searchSection.classList.contains('hidden')){
        searchSection.classList.add('hidden');
        return;
      }

      searchSection.classList.remove('hidden');
      createSection.classList.add('hidden');
    });
    createShow.addEventListener('click', e => {
      if(!createSection.classList.contains('hidden')){
        createSection.classList.add('hidden');
        return;
      }

      createSection.classList.remove('hidden');
      searchSection.classList.add('hidden');
    });
  }

  const charCount = document.querySelector('.char-count');
  const postTextarea = document.getElementById('post-content');
  if(postTextarea){
    postTextarea.addEventListener('input', e => {
      charCount.textContent = 255 - e.target.value.length
    });
  }

  const titleCharCount = document.querySelector('.title-char-counter');
  const postTitleInput = document.getElementById('post-title');
  if(titleCharCount){
    postTitleInput.addEventListener('input', e => {
      const MAX_CHARS_ALLOWED = 30;
      if(e.target.value.length > MAX_CHARS_ALLOWED){
        e.preventDefault();
        if(e.data !== 'backspace'){
          postTitleInput.value = postTitleInput.value.slice(0, MAX_CHARS_ALLOWED);
        }
      } else {
        titleCharCount.textContent = 30 - e.target.value.length
      }
    });
  }

  function changeColor(){
    const cssRules = document.styleSheets[0].cssRules;
    const hueRef = [...cssRules].find(t => t.selectorText === ':root');

    const rng = ()=> parseInt(Math.random() * 310);
    hueRef.style.setProperty('--primary', `oklch(0.3 0.04 ${rng()} / 1)`)
  }

  changeColor();
}

main()