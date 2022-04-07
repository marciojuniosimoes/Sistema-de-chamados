import { useContext } from 'react';

import { AuthContext } from '../../contexts/auth';

export default function DashBoard() {
  const { Sair } = useContext(AuthContext);
  return (
    <div>
      <h1>Página de DashBoard</h1>
      <button onClick={() => Sair()}> sair</button>
    </div>
  );
}
