import { SubmissionError } from 'redux-form'

let formSubmitStub = function (values) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {  // simulate server latency
      let result = window.confirm(`You submitted:\n${JSON.stringify(values, null, 2)}\n\nPress "cancel" to simulate a server returned general error message.`);
      if (result) {
        resolve();
      } else {
        reject(new SubmissionError({_error: 'simulated server error message'}));
      }
    }, 500);
  });
};

export {formSubmitStub};
