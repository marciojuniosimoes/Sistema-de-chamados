import './modal.css';
import { FiX } from 'react-icons/fi';

export default function Modal({ conteudo, fechar }) {
  return (
    <div className='modal'>
      <div className='container'>
        <button className='close' onClick={fechar}>
          <FiX size={23} color='#fff' />
        </button>
        <div>
          <h2>Detalhes do Chamado</h2>
          <div className='dados'>
            <span>
              Cliente: <a>{conteudo.cliente} </a>
            </span>
          </div>
          <div className='dados'>
            <span>
              Assunto: <a>{conteudo.assunto} </a>
            </span>
            <span className='dataCadastro'>
              Cadastrado em : <a>{conteudo.dataFormatada} </a>
            </span>
          </div>

          <div className='dados'>
            <span>
              Status:{' '}
              <a
                style={{
                  borderRadius: '5px',
                  padding: '.5em',
                  color: '#fff',
                  backgroundColor:
                    conteudo.status === 'aberto'
                      ? '#FFFF00'
                      : conteudo.status === 'atendido'
                      ? '#FF0000'
                      : '#008000',
                }}
              >
                {conteudo.status}{' '}
              </a>
            </span>
          </div>

          {conteudo.complemento !== '' && (
            <>
              <h3>Complemento:</h3>
              <p> {conteudo.complemento} </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
