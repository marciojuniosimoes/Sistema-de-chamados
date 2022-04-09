import { useContext } from 'react';

import { AuthContext } from '../../contexts/auth';

import Header from '../../componets/Header';
import Title from '../../componets/Title';
import { FiMessageCircle } from 'react-icons/fi';

export default function DashBoard() {
  const { Sair } = useContext(AuthContext);
  return (
    <div>
      <Header />
      <div className='content'>
        <Title name='Atendimentos'>
          <FiMessageCircle />
        </Title>
      </div>
    </div>
  );
}
