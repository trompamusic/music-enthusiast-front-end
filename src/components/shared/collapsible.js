import React, { useState } from 'react';

/*
  Collapsible: React Hook that renders collapsible list.
*/
function Collapsible({ children }) {
  const [ collapsed, setValue ] = useState(false);
  return <div className="collapsible">
    {children.map(child => React.cloneElement(child, { collapsed, setValue }) )}
  </div>;
}

Collapsible.Header = ({ children, collapsed, setValue }) => {
  return <div className="collapsible-header" onClick={() => setValue(!collapsed)}>
    {children}
  </div>;
};

Collapsible.Body = ({ children, collapsed }) => {
  return <div className={'collapsible-body'.concat(collapsed? ' collapsed' : '')}>
    {children}
  </div>;
};

export default Collapsible;