import { BookCover } from './components/BookCover';
const domCasmurro = {
  id: 'dom-casmurro',
  title: 'Dom Casmurro',
  author: 'Machado de Assis',
  genre: 'Brazilian Literature',
  color1: '#2F6B4F',
  color2: '#1F3327',
  desc: '',
};

export default function App() {
  return (
    <div className="p-10 w-44">
      <BookCover book={domCasmurro} />
    </div>
  );
}