// JavaScript Document

let bnmr = {};
bnmr.globals = {};
bnmr.fns = {};

bnmr.fns.initMobile = () => {
  if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)) {
    let mobileState = 'less'

    $$('.projects').css('height', '100vh');
    $$('.projects').css('overflow', 'hidden');

    let btnMore = document.createElement('div');
    btnMore.classList.add('projects__more');
    btnMore.innerHTML = 'MORE';
    $$('.projects').appendChild(btnMore);

    $$('.projects__more').on('tap', () => {
      switch (mobileState) {
        case 'less':
          $$('.projects').css('height', 'auto');
          $$('.projects__more').innerHTML = 'LESS';
          mobileState = 'more';
        break;

        case 'more':
          $$('.projects').css('height', '100vh');
          $$('.projects__more').innerHTML = 'MORE';
          mobileState = 'less';
        break;
      }
    });
  }
};

bnmr.fns.submitContactForm = () => {
  let
  name = $$('.contact__input--name input').value,
  email = $$('.contact__input--email input').value,
  msg = $$('.contact__input--msg textarea').value,
  params = new FormData(),
  valid = true;

  if (!name) {
    $$('.contact__input--name').setAttribute('data-warning', 'Who are you?');
    valid = false;
  } else {
    $$('.contact__input--name').setAttribute('data-warning', '');
  }

  if (!email) {
    $$('.contact__input--email').setAttribute('data-warning', 'Who are you?');
    valid = false;
  } else if (!email.includes('@')) {
    $$('.contact__input--email').setAttribute('data-warning', 'Real email address, please.');
    valid = false;
  } else if (!email.split('@')[1].includes('.')) {
    $$('.contact__input--email').setAttribute('data-warning', 'Real email address, please.');
    valid = false;
  } else {
    $$('.contact__input--email').setAttribute('data-warning', '');
  }

  if (!msg) {
    $$('.contact__input--msg').setAttribute('data-warning', 'What, nothing to say?');
    valid = false;
  } else {
    $$('.contact__input--msg').setAttribute('data-warning', '');
  }

  if (valid) {
    $$('.contact__loading').css('display', 'block');

    params.append('name', name);
    params.append('email', email);
    params.append('msg', msg);

    $$.ajax({
      method: 'POST',
      url: '../assets/email.php',
      params: params
    }, (data) => {
      $$.log(data);
      $$('.contact__loading').css('display', 'none');

      $$('.contact__input--name').setAttribute('data-warning', '');
      $$('.contact__input--email').setAttribute('data-warning', '');
      $$('.contact__input--msg').setAttribute('data-warning', '');

      $$('.contact__input--name input').value = '';
      $$('.contact__input--email input').value = '';
      $$('.contact__input--msg textarea').value = '';

      for (let input of $$('.contact__input input, .contact__input textarea')) {
        input.parentNode.classList.remove('active');
        input.parentNode.classList.remove('nonempty');
      }
    });
  }
};

bnmr.fns.initContact = () => {
  $$('.contact__list').css('padding-bottom', 'calc(var(--margin) * 2)');
  $$('.contact__email-link').css('display', 'none');

  let emailForm = document.createElement('div');
  emailForm.classList.add('contact__form');
  $$('.contact').insertBefore(emailForm, null);

    let formHeader = document.createElement('h3');
    formHeader.className = 'contact__form-header';
    formHeader.innerHTML = 'Or just hit me up...';
    emailForm.appendChild(formHeader);

    let name = document.createElement('div');
    name.classList.add('contact__input');
    name.classList.add('contact__input--name');
    name.setAttribute('data-label', 'Your Name');
    emailForm.appendChild(name);

      let nameInput = document.createElement('input');
      nameInput.setAttribute('type', 'text');
      name.appendChild(nameInput);

    let email = document.createElement('div');
    email.classList.add('contact__input');
    email.classList.add('contact__input--email');
    email.setAttribute('data-label', 'Email Address');
    emailForm.appendChild(email);

      let emailInput = document.createElement('input');
      emailInput.setAttribute('type', 'email');
      email.appendChild(emailInput);

    let msg = document.createElement('div');
    msg.classList.add('contact__input');
    msg.classList.add('contact__input--msg');
    msg.setAttribute('data-label', 'Tell me how you really feel...');
    emailForm.appendChild(msg);

      let msgInput = document.createElement('textarea');
      msgInput.setAttribute('rows', '6');
      msg.appendChild(msgInput);

    let submit = document.createElement('button');
    submit.classList.add('contact__submit');
    submit.innerHTML = 'Send';
    submit.onclick = bnmr.fns.submitContactForm;
    emailForm.appendChild(submit);

    let loading = document.createElement('div');
    loading.classList.add('contact__loading');
    emailForm.appendChild(loading);

    for (let input of $$('.contact__input input, .contact__input textarea')) {
      input.onfocus = (e) => {
        e.target.parentNode.classList.add('active');
      };

      input.onblur = (e) => {
        if (e.target.value == '') {
          e.target.parentNode.classList.remove('active');
          e.target.parentNode.classList.remove('nonempty');
        } else {
          e.target.parentNode.classList.remove('active');
          e.target.parentNode.classList.add('nonempty');
        }
      };
    }
};

bnmr.fns.initMenu = () => {
  $$.ajax({
    type: 'json',
    url: './assets/projects.json'
  }, (projects) => {
    $$('.projects').removeChild($$('.projects__list'));
    let list = document.createElement('div');
    list.classList.add('projects__list');
    $$('.projects').appendChild(list);

    for (let project of projects) {
      let item = document.createElement('div');
      item.classList.add('projects__item');
      list.appendChild(item);

      	let title = document.createElement('div');
    		title.classList.add('projects__name');
      	title.innerHTML = project.name;
      	item.appendChild(title);

      	let tech = document.createElement('div');
      	tech.classList.add('projects__technologies');
      	tech.innerHTML = `Technologies: ${project.technologies}`;
      	item.appendChild(tech);

      	let browsers = document.createElement('div');
      	browsers.classList.add('projects__browsers');
      	browsers.innerHTML = `Supported browsers: ${project.browsers}`;
      	item.appendChild(browsers);

      	let desc = document.createElement('div');
      	desc.classList.add('projects__description');
      	desc.innerHTML = project.description;
      	item.appendChild(desc);

    		for (let link of project.links) {
          let btn = document.createElement('a');
          btn.classList.add('projects__btn');
          btn.href = link.url;
          btn.target = '_blank';

            let highlight = document.createElement('span');
            highlight.classList.add('projects__btn-highlight');
            btn.appendChild(highlight);

            let copy = document.createElement('span');
            copy.classList.add('projects__btn-copy');
          	copy.innerHTML = link.name;
            btn.appendChild(copy);
            item.appendChild(btn);
        }
    }
  });
};

bnmr.fns.initFns = () => {
  bnmr.fns.initMenu();
  bnmr.fns.initContact();
  bnmr.fns.initMobile();
};

document.onreadystatechange = () => {
  if (document.readyState == 'complete') {
    bnmr.fns.initFns();
  }
};
