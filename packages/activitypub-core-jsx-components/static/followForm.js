const formElement = window.document.querySelector('#followForm');
formElement?.addEventListener('submit', (event) => {
  event.preventDefault();
  let formElements = [];
  for (const element of [...formElement.elements]) {
    if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
      formElements.push(element);
    }
  }
  const {
    actor,
    object,
  } = Object.fromEntries(formElements.map(formElement => [
    formElement.getAttribute('name'),
    formElement.value,
  ]));

  const followActivity = {
    "@context": "https://www.w3.org/ns/activitystreams#",
    type: 'Follow',
    to: [
      object,
    ],
    actor,
    object,
  };

  fetch(formElement.action, {
    method: 'POST',
    body: JSON.stringify(followActivity)
  })
    .then(async response => {
      if (response.status === 201 && response.headers.get('Location')) {
        window.location.reload();
      } else {
        throw new Error('Failed.');
      }
    });
});