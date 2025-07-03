const MapaBrasil = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-card">
      <h3 className="text-2xl font-bold text-center mb-6">Áreas de Atendimento</h3>
      <div className="flex justify-center">
        <svg
          viewBox="0 0 400 400"
          className="w-full max-w-md h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Estados não atendidos - cinza claro */}
          <g fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1">
            {/* Acre */}
            <path d="M20 180 L60 170 L70 190 L65 210 L25 220 Z" />
            {/* Amazonas */}
            <path d="M30 80 L90 70 L120 90 L110 140 L80 150 L40 140 Z" />
            {/* Roraima */}
            <path d="M80 20 L120 25 L115 50 L85 55 Z" />
            {/* Amapá */}
            <path d="M130 30 L150 25 L155 55 L140 60 Z" />
            {/* Pará */}
            <path d="M90 70 L170 60 L180 100 L170 130 L120 140 L110 90 Z" />
            {/* Tocantins */}
            <path d="M170 130 L210 125 L220 170 L180 175 Z" />
            {/* Maranhão */}
            <path d="M180 100 L230 95 L240 130 L210 135 Z" />
            {/* Piauí */}
            <path d="M230 95 L270 100 L275 140 L240 145 Z" />
            {/* Ceará */}
            <path d="M270 70 L310 75 L315 105 L275 110 Z" />
            {/* Rio Grande do Norte */}
            <path d="M310 85 L340 90 L345 115 L315 120 Z" />
            {/* Paraíba */}
            <path d="M315 115 L340 120 L345 140 L320 145 Z" />
            {/* Pernambuco */}
            <path d="M275 140 L320 135 L325 165 L280 170 Z" />
            {/* Alagoas */}
            <path d="M320 150 L340 155 L345 175 L325 180 Z" />
            {/* Sergipe */}
            <path d="M310 175 L330 180 L335 195 L315 200 Z" />
            {/* Bahia */}
            <path d="M220 170 L280 165 L290 220 L230 225 Z" />
            {/* Rondônia */}
            <path d="M60 170 L100 165 L110 190 L70 195 Z" />
            {/* Mato Grosso */}
            <path d="M110 165 L170 160 L180 210 L120 215 Z" />
            {/* Goiás e Distrito Federal */}
            <path d="M180 175 L230 170 L240 210 L190 215 Z" />
            {/* Minas Gerais */}
            <path d="M230 210 L290 205 L300 250 L240 255 Z" />
            {/* Espírito Santo */}
            <path d="M290 220 L310 225 L315 245 L295 250 Z" />
            {/* Rio de Janeiro */}
            <path d="M260 250 L290 245 L295 265 L265 270 Z" />
            {/* São Paulo */}
            <path d="M190 240 L260 235 L270 275 L200 280 Z" />
            {/* Mato Grosso do Sul */}
            <path d="M120 215 L180 210 L190 250 L130 255 Z" />
          </g>

          {/* Estados atendidos - cor primária da empresa */}
          <g fill="hsl(220 100% 45%)" stroke="hsl(220 100% 35%)" strokeWidth="2">
            {/* Paraná */}
            <path d="M130 280 L200 275 L210 310 L140 315 Z" />
            {/* Santa Catarina */}
            <path d="M140 315 L210 310 L220 340 L150 345 Z" />
            {/* Rio Grande do Sul */}
            <path d="M100 340 L180 335 L190 380 L110 385 Z" />
          </g>

          {/* Labels dos estados atendidos */}
          <g fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">
            <text x="165" y="295">PR</text>
            <text x="175" y="325">SC</text>
            <text x="145" y="365">RS</text>
          </g>
        </svg>
      </div>
      
      <div className="mt-6 text-center">
        <div className="flex justify-center items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary rounded"></div>
            <span className="text-sm text-muted-foreground">Áreas Atendidas</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span className="text-sm text-muted-foreground">Outras Regiões</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Cobertura completa nos estados do Paraná, Santa Catarina e Rio Grande do Sul
        </p>
      </div>
    </div>
  );
};

export default MapaBrasil;