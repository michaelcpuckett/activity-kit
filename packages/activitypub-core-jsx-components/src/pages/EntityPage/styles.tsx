export const styles = `* {
    box-sizing: border-box;
  }
  
  html {
    min-height: 100%;
    display: flex;
    width: 100%;
    flex-direction: column;
  }
  
  body {
    font-family: system-ui, sans-serif;
    display: flex;
    height: 100%;
    width: 100%;
    margin: 0;
    flex-direction: column;
    flex: 1;
  }
  
  a {
    color: inherit;
  }
  
  * {
    box-sizing: border-box;
  }
  
  dt {
    font-weight: bold;
  }
  
  dd {
    margin-left: 20px;
  }
  
  form,
  fieldset {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    flex-direction: column;
  }
  
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }
  
  input,
  textarea {
    padding: 4px 8px;
    border: 1px solid lightgray;
    box-shadow: none;
    font: inherit;
    width: 100%;
  }
  
  figure {
    margin: 0;
    padding: 0;
    display: flex;
    gap: 12px;
    flex-direction: column;
  }
  
  .a-button,
  .tabs a,
  button,
  summary {
    padding: 8px 18px 10px;
    border: 1px solid lightgray;
    box-shadow: none;
    font: inherit;
    cursor: pointer;
    justify-self: flex-end;
    align-self: flex-end;
    line-height: 1;
    border-radius: 8px;
    font-weight: bold;
    background-color: rgb(9, 129, 129);
    color: white;
    max-width: max-content;
    text-decoration: none;
  }
  
  .a-button:hover,
  .tabs a:hover,
  button:hover,
  summary:hover {
    background: rgb(4, 117, 89);
    background-color: darkcyan;
  }
  
  textarea {
    width: 100%;
  }
  
  blockquote {
    margin-left: 20px;
    padding: 20px;
    border-radius: 6px;
    border: 1px solid gray;
    background-color: lightcyan;
  }
  
  #__next {
    display: flex;
    height: 100%;
    width: 100%;
    flex: 1;
  }
  
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex: 1;
    background: #708080;
    gap: 24px;
    padding: 24px;
  }
  
  
  .card {
    background: lightcyan;
    max-width: min(480px, 100% - 72px);
    min-height: 320px;
    width: 100%;
    border: 1px solid lightgray;
    border-radius: 12px;
    padding: 36px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
    box-shadow: 3px 3px 6px rgba(0, 0, 0, .25);
  }
  
  .card h1,
  .card h2 {
    margin: 0;
    font-size: 1.25em;
  }
  
  
  .card blockquote {
    margin: 0;
    padding: 36px;
    border: 1px solid lightgray;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
  }
  
  .card dl,
  .card dt,
  .card dd {
    margin: 0;
    padding: 0;
  }
  
  .card dt {
    font-weight: bold;
    padding-right: 4px;
  }
  
  .card dt,
  .card dd {
    width: 50%;
    padding-bottom: 5px;
    padding-top: 5px;
    border-bottom: 1px solid lightgray;
  }
  
  .card dl {
    display: flex;
    flex-wrap: wrap;
  }
  
  .card + details {
    display: flex;
    width: 100%;
    max-width: min(480px, 100% - 72px);
  }
  
  header {
    max-width: min(480px, 100% - 72px);
    display: flex;
    width: 100%;
    justify-content: center;
  }
  
  header a {
    text-decoration: none;
  }
  
  .tabpanel:not(:target) {
    display: none;
  }
  
  .tabpanel {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  
  .tabpanel ol {
    display: flex;
    gap: 36px;
    flex-direction: column;
    width: 100%;
    flex: 1;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  
  .tabs {
    display: flex;
    gap: 12px;
  }
  
  .tabpanels {
    display: flex;
    gap: 12px;
    width: 100%;
  }
  
  .tabpanels:not(:has(:target)) > .tabpanel:first-child {
    display: flex;  
  }
  
  header a {
    font-size: 36px;
  }
  
  .form-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 12px 0;
  }
  
  .form-buttons form {
    display: inline-flex;
    width: max-content;
  }
  
  .danger {
    background-color: maroon;
  }
  
  .danger:hover {
    background-color: red;
  }
  
  .action {
    background-color: darkblue;
  }
  
  .action:hover {
    background-color: blue;
  }
  
  .primary {
    background-color: green;
  }
  
  .primary:hover {
    background-color: darkgreen;
  }
  
  .intro {
    background: lightcyan;
    max-width: min(980, 100% - 72px);
    min-height: 80px;
    width: 100%;
    border: 1px solid lightgray;
    border-radius: 12px;
    padding: 36px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
    box-shadow: 3px 3px 6px rgba(0, 0, 0, .25);
    margin-bottom: 36px;
    max-width: min(480px, 100% - 72px);
  }
  
  ul:has(.card),
  ol:has(.card) {
    max-width: min(480px, 100% - 72px);
    width: 100%;
    flex-direction: column;
    display: flex;
    gap: 24px;
  }`;