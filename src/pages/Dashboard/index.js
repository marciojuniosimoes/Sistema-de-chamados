import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import Modal from '../../componets/modal';
import { AuthContext } from '../../contexts/auth';
import './dashboard.css';
import Header from '../../componets/Header';
import Title from '../../componets/Title';
import { FiMessageCircle, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import firebase from '../../services/fireBaseConections';
import { toast } from 'react-toastify';

export default function DashBoard() {
  const { Sair } = useContext(AuthContext);
  const [chamados, setChamados] = useState([]);
  const [lendoDados, setLendoDados] = useState(true);
  const [vazio, setVazio] = useState(false);
  const [proximaPagina, setProximaPagina] = useState(false);
  const [ultimoDoc, setUltimoDoc] = useState();
  const [abrirModal, setAbrirModal] = useState(false);
  const [detalhes, setDetalhes] = useState();

  const listaRef = firebase
    .firestore()
    .collection('chamados')
    .orderBy('criacao', 'asc');

  useEffect(() => {
    async function CarregaTabela() {
      await listaRef
        .limit(5)
        .get()
        .then((snapshot) => {
          MudandoEstado(snapshot);
        })
        .catch((error) => {
          toast.error('Deu algo errado');
          setProximaPagina(false);
        });
      setLendoDados(false);
    }

    CarregaTabela();
    return () => {};
  }, []);

  async function MudandoEstado(snapshot) {
    const colecaoVazia = snapshot.size === 0;

    if (!colecaoVazia) {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().criacao,
          dataFormatada: format(doc.data().criacao.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento,
        });
      });
      const ultimoDoc = snapshot.docs[snapshot.docs.length - 1];
      setChamados((chamados) => [...chamados, ...lista]);
      setUltimoDoc(ultimoDoc);
    } else {
      setVazio(true);
    }
    setProximaPagina(false);
  }

  async function ProximoRegistro() {
    setProximaPagina(true);
    await listaRef
      .startAfter(ultimoDoc)
      .limit(5)
      .get()
      .then((snapshot) => {
        MudandoEstado(snapshot);
      });
  }
  function AbrirModal(item) {
    setAbrirModal(!abrirModal);
    setDetalhes(item);
  }

  if (lendoDados) {
    return (
      <div>
        <Header />
        <div className='content'>
          <Title name='Atendimentos'>
            <FiMessageCircle size={25} />
          </Title>
          <div className='container dashboard'>
            <span>Buscando dados....</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className='content'>
        <Title name='Atendimentos'>
          <FiMessageCircle size={25} />
        </Title>

        {chamados.length === 0 ? (
          <div className='container dashboard'>
            <span>.....Nenhum chamado</span>
            <Link to='/new' className='novo'>
              <FiPlus size={25} color='#fff' />
              Novo chamado
            </Link>
          </div>
        ) : (
          <>
            <Link to='/new' className='novo'>
              <FiPlus size={25} color='#fff' />
              Novo chamado
            </Link>
            <table>
              <thead>
                <tr>
                  <th scope='col'>Clientes</th>
                  <th scope='col'>Assuntos</th>
                  <th scope='col'>Status</th>
                  <th scope='col'>Cadastrado em </th>
                  <th scope='col'>#</th>
                </tr>
              </thead>
              <tbody>
                {chamados.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td data-label='Clientes'>{item.cliente}</td>
                      <td data-label='Assuntos'>{item.assunto}</td>
                      <td data-label='Status'>
                        <span
                          className='badge'
                          style={{
                            backgroundColor:
                              item.status === 'aberto'
                                ? '#FFFF00'
                                : item.status === 'atendido'
                                ? '#FF0000'
                                : '#008000',
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td data-label='Cadastrado'>{item.dataFormatada}</td>
                      <td data-label='#'>
                        <button
                          className='acao'
                          style={{ backgroundColor: '#3583f6' }}
                          onClick={() => AbrirModal(item)}
                        >
                          <FiSearch color='#FFF' size={16} />
                        </button>
                        <Link
                          to={`/new/${item.id}`}
                          className='acao'
                          style={{ backgroundColor: '#F6a935' }}
                        >
                          <FiEdit2 color='#FFF' size={16} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!proximaPagina && !vazio && (
              <button className='btn-maisRegistros' onClick={ProximoRegistro}>
                Carregar registros
              </button>
            )}
          </>
        )}
      </div>
      {abrirModal && <Modal conteudo={detalhes} fechar={AbrirModal} />}
    </div>
  );
}
