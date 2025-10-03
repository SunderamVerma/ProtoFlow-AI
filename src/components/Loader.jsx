import React from 'react';

function Loader({ message }) {
  return (
    <div className="flex justify-center items-center h-full flex-col">
      <div className="loader"></div>
      <p className="ml-4 mt-4 text-gray-600">{message}</p>
    </div>
  );
}

export default Loader;