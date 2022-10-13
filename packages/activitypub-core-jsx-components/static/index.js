import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.12.0/firebase-app.js'
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.12.0/firebase-auth.js'

const formElement = window.document.querySelector('#signup');
formElement?.addEventListener('submit', (event) => {
  event.preventDefault();
  let formElements = [];
  for (const element of [...formElement.elements]) {
    if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
      formElements.push(element);
    }
  }
  const body = Object.fromEntries(formElements.map(formElement => [
    formElement.getAttribute('name'),
    formElement.value,
  ]));
  console.log(body);
  fetch(formElement.action, {
    method: 'POST',
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(({ error, success }) => {
      if (error || !success) {
        throw new Error(error);
      }
      console.log({
        success
      });
      initializeApp({
        projectId: "socialweb-id",
        apiKey: "AIzaSyAqxakBaICHBJWAxfqJ3WmIoRY8LTnuwt0",
      });
      signInWithEmailAndPassword(getAuth(), body.email, body.password).then(userCredential => {
        userCredential.user.getIdToken().then(token => {
          console.log({
            token
          });
          window.document.cookie = '__session=' + token;
          window.location.href = '/home';
        });
      });
    });
});