import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav
} from 'reactstrap';

function Headers() {
  
  return (
    <div>
      <Navbar color='light'>
        <NavbarBrand href="/">Chat Application</NavbarBrand>
        <Nav className="me-auto" navbar>
            
        </Nav>
      </Navbar>
    </div>
  );
}

export default Headers;