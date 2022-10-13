const formElement = window.document.querySelector('#createForm');
formElement?.addEventListener('submit', (event) => {
  event.preventDefault();
  let formElements = [];
  for (const element of [...formElement.elements]) {
    if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
      formElements.push(element);
    }
  }
  const object = Object.fromEntries(formElements.map(formElement => [
    formElement.getAttribute('name'),
    formElement.value,
  ]));

  if (object.location) {
    object.location = {
      name: object.location,
    };
  }

  const body = {
    "@context": "https://www.w3.org/ns/activitystreams#",
    type: 'Create',
    actor: formElement.action.split('/outbox')[0],
    object
  };

  console.log(body);

  fetch(formElement.action, {
    method: 'POST',
    body: JSON.stringify(body)
  })
    .then(async response => {
      if (response.status === 201 && response.headers.get('Location')) {
        window.location.reload();
      } else {
        throw new Error('Failed.');
      }
    });
});