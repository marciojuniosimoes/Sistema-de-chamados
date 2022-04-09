import './title.css';

export default function Title({ children, name }) {
  return (
    <div className='titulo'>
      {children}
      <span>{name}</span>
    </div>
  );
}
