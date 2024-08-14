import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">Página não encontrada</h1>
      <p>
        Voltar para a{" "}
        <Link to="/" className="text-orange-600">
          Dashboard
        </Link>
      </p>
    </div>
  );
}
