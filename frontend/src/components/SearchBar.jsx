export default function SearchBar({ value, onChange, placeholder, onSubmit }) {
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSubmit?.();}} className="flex gap-2 mb-3">
      <input className="border p-2 flex-1" value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder}/>
      <button className="border px-3">Search</button>
    </form>
  );
}
