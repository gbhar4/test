import {ServiceError} from 'service/ServiceError.js';

let editJSONContainer;

/**
 * Displays a popup allowing editing of a given value. The value is
 * displayed as a json.
 * @param  {string}   title         the title of this popup
 * @param             valueToEdit   the value to display and allow editing of
 * @return {Promise}  If the user presses the "proceed" button, then the promise
 *                       resolves to the value as edited by the user; if the user
 *                       presses the 'Simulate-Error' button, then the promise rejects
 *                       with a generic error string.
 */
export function editJsonPopup (title, valueToEdit, requestData) {
  return new Promise((resolve, reject) => {
    if (!editJSONContainer) {
      editJSONContainer = document.createElement('div');
      editJSONContainer.id = 'editJSONContainer';

      let acceptAll = document.createElement('button');
      acceptAll.innerHTML = 'Continue all';
      acceptAll.onclick = function (e) {
        e.preventDefault();
        while (editJSONContainer.children.length > 1) {
          editJSONContainer.children[1].children[4].onclick();
        }
      };
      acceptAll.setAttribute('style', 'margin: 0 5px; background: #000;  color: #fff; padding: 5px;');
      editJSONContainer.appendChild(acceptAll);
    }

    // create elements for the popup form
    let form = document.createElement('form');
    let formTitle = document.createElement('legend');
    let textArea = document.createElement('textArea');
    let edit = document.createElement('button');
    let showRequest = document.createElement('button');
    let proceed = document.createElement('button');
    let simulateError = document.createElement('button');

    let closeEditJSONForm = function (form) {
      form.parentNode.removeChild(form);

      if (editJSONContainer.children.length === 1) {
        editJSONContainer.parentNode.removeChild(editJSONContainer);
      }
    };

    // loading title
    formTitle.innerHTML = title;

    // give it a bit of styling
    edit.innerHTML = 'Edit Reply';
    showRequest.innerHTML = 'Show Request';
    simulateError.innerHTML = 'Simulate error';
    proceed.innerHTML = 'Continue';

    editJSONContainer.setAttribute('style', 'z-index: 999999999; overflow: auto; max-height: calc(100vh - 20px); position: fixed; left: 10px; top: 10px; width: 700px; padding: 10px; background: rgba(240,240,240,.85);');
    form.setAttribute('style', 'margin: 5px 0; width: 100%; padding: 5px 0; border-top: 1px solid #000;');
    textArea.setAttribute('style', 'width: 100%; height: 250px; margin-top: 10px; font-size: 13px;');

    let buttonStyle = 'margin: 0 5px; background: #000;  color: #fff; padding: 5px;';
    let buttonDisabledStyle = 'margin: 0 5px; background: #bbb;  color: #ccc; padding: 5px;';
    edit.setAttribute('style', buttonStyle);
    proceed.setAttribute('style', buttonStyle);
    simulateError.setAttribute('style', buttonStyle);

    if (typeof requestData !== 'undefined') {
      showRequest.setAttribute('style', buttonStyle);
    } else {
      showRequest.disabled = true;
      showRequest.setAttribute('style', buttonDisabledStyle);
    }

    textArea.value = JSON.stringify(valueToEdit, null, 4);

    // define click handlers
    edit.onclick = function (e) {
      e && e.preventDefault();
      form.appendChild(textArea);
    };

    showRequest.onclick = function (e) {
      e && e.preventDefault();
      window.alert(JSON.stringify(requestData, null, 2));
    };

    simulateError.onclick = function (e) {
      e && e.preventDefault();
      reject(new ServiceError('', {_error: `Simulated generic error from service call: '${title}'`}));
      closeEditJSONForm(form);
    };

    proceed.onclick = function (e) {
      e && e.preventDefault();
      resolve(JSON.parse(textArea.value));
      closeEditJSONForm(form);
    };

    // append elements to their parents
    form.appendChild(formTitle);
    form.appendChild(edit);
    form.appendChild(showRequest);
    form.appendChild(simulateError);
    form.appendChild(proceed);
    editJSONContainer.appendChild(form);

    document.body.insertBefore(editJSONContainer, document.body.children[0]);
  });
}
