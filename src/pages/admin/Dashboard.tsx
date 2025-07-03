// src/pages/admin/Dashboard.tsx
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar"; // Reaproveite o Navbar para manter a consistência
import Footer from "@/components/Footer"; // Reaproveite o Footer
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, Package } from "lucide-react"; // Ícones para o dashboard

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-surface flex flex-col">
      <Navbar /> {/* Você pode personalizar um Navbar para admin se precisar */}

      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          Painel do Administrador
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cartão de Cadastro de Clientes */}
          <Link to="/admin/clientes">
            <Card className="shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">
                  Gerenciar Clientes
                </CardTitle>
                <Users className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Cadastre, edite e visualize os clientes.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Cartão de Cadastro de Pedidos */}
<Link to="/admin/pedidos">
  <Card className="shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xl font-medium">
        Gerenciar Pedidos
      </CardTitle>
      <Package className="h-6 w-6 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">
        Cadastre novas encomendas e atualize seus status.
      </p>
    </CardContent>
  </Card>
</Link>

          {/* Cartão de Relatórios (Exemplo) */}
          <Card className="shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2 cursor-not-allowed opacity-70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">
                Relatórios e Estatísticas
              </CardTitle>
              <BarChart className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualize dados sobre as entregas (em breve).
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;