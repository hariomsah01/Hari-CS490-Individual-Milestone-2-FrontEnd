export default function Pager({ page, setPage, hasNext }){
  return (
    <div className="flex gap-2 mt-3">
      <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="border px-3 disabled:opacity-50">Prev</button>
      <span>Page {page}</span>
      <button disabled={!hasNext} onClick={()=>setPage(p=>p+1)} className="border px-3 disabled:opacity-50">Next</button>
    </div>
  );
}
