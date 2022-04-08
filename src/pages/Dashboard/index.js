import { useContext } from 'react';

import { AuthContext } from '../../contexts/auth';

import Header from '../../componets/Header';

export default function DashBoard() {
  const { Sair } = useContext(AuthContext);
  return (
    <div>
      <Header />
    </div>
  );
}
