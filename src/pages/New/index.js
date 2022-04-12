import './new.css';
import Header from '../../componets/Header';
import Title from '../../componets/Title';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useState, useContext, useEffect } from 'react';
import firebase from '../../services/fireBaseConections';
import { AuthContext } from '../../contexts/auth';
import { useHistory, useParams } from 'react-router-dom';

export default function NovoChamada() {
  const { id } = useParams();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState(' aberto');
  const [complemento, setComplemento] = useState('');

  const [usuariosCadastrados, setUsuariosCadastrados] = useState([]);
  const [usuariosLista, setUsuariosLista] = useState(0);
  const [lendoUsuarios, setLendoUsuarios] = useState(true);
  const [idCliente, setIdCliente] = useState(false);

  useEffect(() => {
    async function LendoUsuarios() {
      await firebase
        .firestore()
        .collection('clientes')
        .get()
        .then((snapshot) => {
          let lista = [];
          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nomeCliente: doc.data().nomeCliente,
            });
          });
          if (lista.length === 0) {
            toast.error('Nenhuma empresa cadastrada');
            setUsuariosCadastrados([{ id: '1', nomeCliente: '' }]);
            setLendoUsuarios(false);
            return;
          }
          setUsuariosCadastrados(lista);
          setLendoUsuarios(false);
          if (id) {
            LendoId(lista);
          }
        })
        .catch((error) => {
          toast.error('Ops, algo deu errado');
          setLendoUsuarios(false);
          setUsuariosCadastrados([{ id: '1', nomeCliente: '' }]);
        });
    }
    LendoUsuarios();
  }, []);

  async function LendoId(lista) {
    await firebase
      .firestore()
      .collection('chamados')
      .doc(id)
      .get()
      .then((snapshot) => {
        setAssunto(snapshot.data().assunto);
        setStatus(snapshot.data().status);
        setComplemento(snapshot.data().complemento);

        let index = lista.findIndex(
          (item) => item.id === snapshot.data().clienteId
        );
        setUsuariosLista(index);
        setIdCliente(true);
      })
      .catch((error) => {
        toast.error('Erro ao localizar ');
        setIdCliente(false);
      });
  }

  async function RegistrarChamado(e) {
    e.preventDefault();

    if (idCliente) {
      await firebase
        .firestore()
        .collection('chamados')
        .doc(id)
        .update({
          cliente: usuariosCadastrados[usuariosLista].nomeCliente,
          clienteId: usuariosCadastrados[usuariosLista].id,
          assunto: assunto,
          status: status,
          complemento: complemento,
          userUid: user.uid,
        })
        .then(() => {
          toast.success('Chamado editado com sucesso');
          setUsuariosLista(0);
          setComplemento('');
          history.push('/dashboard');
        })
        .catch((error) => {
          toast.error('Erro ao cadastrar, tente mais tarde');
        });
      return;
    }

    await firebase
      .firestore()
      .collection('chamados')
      .add({
        criacao: new Date(),
        cliente: usuariosCadastrados[usuariosLista].nomeCliente,
        clienteId: usuariosCadastrados[usuariosLista].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userUid: user.uid,
      })
      .then(() => {
        toast.success('Chamado cadastrado com sucesso');
        setComplemento('');
        setUsuariosLista(0);
      })
      .catch((error) => {
        toast.error('Ops, algo deu errado.');
      });
  }
  function TipoDemanda(e) {
    setAssunto(e.target.value);
    alert(e.target.value);
  }
  function AlterarStatus(e) {
    setStatus(e.target.value);
  }

  function TrazendoUsuarios(e) {
    setUsuariosLista(e.target.value);
  }

  return (
    <div>
      <Header />
      <div className='content'>
        <Title name='Cadastrando um chamado' size={25}>
          <FiPlus />
        </Title>
        <div className='container'>
          <form className='form-perfil' onSubmit={RegistrarChamado}>
            <label>Cliente</label>
            {lendoUsuarios ? (
              <input
                type='text'
                disabled={true}
                value='Carregando clientes....'
              />
            ) : (
              <select value={usuariosLista} onChange={TrazendoUsuarios}>
                {usuariosCadastrados.map((item, index) => {
                  return (
                    <option key={item.id} value={index}>
                      {item.nomeCliente}
                    </option>
                  );
                })}
              </select>
            )}
            <label>Assunto</label>
            <select value={assunto} onChange={TipoDemanda}>
              <option key={3} value='Suporte'>
                Suporte
              </option>
              <option key={4} value='Visita-técnica'>
                Visita técnica
              </option>
              <option value='Financeiro'>Financeiro</option>
            </select>
            <label>Status</label>
            <div className='status'>
              <input
                type='radio'
                name='radio'
                value='aberto'
                onChange={AlterarStatus}
                checked={status === 'aberto'}
              />
              <span>Em aberto</span>
              <input
                type='radio'
                name='radio'
                value='atendido'
                onChange={AlterarStatus}
                checked={status === 'atendido'}
              />
              <span>Atendido</span>
              <input
                type='radio'
                name='radio'
                value='em-progresso'
                onChange={AlterarStatus}
                checked={status === 'em-progresso'}
              />
              <span>Em progresso</span>
            </div>
            <label>Complemento</label>
            <textarea
              type='text'
              placeholder='Descreva sua demanda.'
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            ></textarea>
            <button type='submit'>Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
