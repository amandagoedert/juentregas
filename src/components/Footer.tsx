import { Truck, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">JuEntregas</span>
            </div>
            <p className="text-gray-300 text-sm">
              Sua logística com segurança e pontualidade. Entregas em todo o Sul do Brasil.
            </p>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="font-semibold mb-4">Nossos Serviços</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Entregas de encomendas</li>
              <li>Encomendas refrigeradas</li>
              <li>Cargas até 30T</li>
              <li>Rastreamento online</li>
            </ul>
          </div>

          {/* Áreas de Atendimento */}
          <div>
            <h3 className="font-semibold mb-4">Áreas de Atendimento</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Paraná</li>
              <li>Santa Catarina</li>
              <li>Rio Grande do Sul</li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(21) 98603-9803</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contato@juentregas.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Sul do Brasil</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 JuEntregas. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;