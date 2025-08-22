import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './QuillTest.css';

const QuillTest = () => {
  const [value, setValue] = useState('<p>Teste do React Quill</p>')

  return (
    <div className="quill-test-container">
      <h1>Teste React Quill</h1>
      <div className="quill-test-editor">
        <ReactQuill 
          theme="snow" 
          value={value} 
          onChange={setValue}
          className="quill-test-quill"
        />
      </div>
      <div className="quill-test-preview">
        <h3>Conteúdo HTML:</h3>
        <pre>{value}</pre>
      </div>
    </div>
  );
}

export default QuillTest
