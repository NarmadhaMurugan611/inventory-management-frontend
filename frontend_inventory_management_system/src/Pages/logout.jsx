import React, { useState, useRef } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Logout() {
  const [visible, setVisible] = useState(true);
  const toast = useRef(null);
  const navigate = useNavigate();

  const reject = () => {
    navigate('/home');
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:2001/logout');
      window.localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);

      toast.current.show({
        severity: 'error',
        summary: 'Logout Failed',
        detail: 'An error occurred during logout.',
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog
        visible={visible}
        onHide={() => setVisible(false)}
        message="Are you sure you want to logout?"
        header="Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={handleLogout}
        reject={reject}
      />
      <div className="card flex justify-content-center"></div>
    </div>
  );
}

export default Logout;
