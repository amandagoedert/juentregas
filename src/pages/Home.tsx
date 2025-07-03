import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Shield, Clock, MapPin, Package, Thermometer, Weight, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MapaBrasil from "@/components/MapaBrasil";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [cpf, setCpf] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRastreio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpf.trim()) {
      toast({
        title: "CPF obrigatório",
        description: "Por favor, digite seu CPF para rastrear a encomenda.",
        variant: "destructive",
      });
      return;
    }
    navigate(`/rastreio?cpf=${encodeURIComponent(cpf)}`);
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    if (formatted.length <= 14) {
      setCpf(formatted);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Sua logística com
              <span className="bg-gradient-hero bg-clip-text text-transparent"> segurança</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Entregas de encomendas, cargas refrigeradas e transporte de até 30T 
              com cobertura completa no Sul do Brasil
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" onClick={() => navigate('/cotacao')}>
                Solicitar Cotação
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/rastreio')}>
                Rastrear Encomenda
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating icons */}
        <div className="absolute top-10 left-10 animate-float">
          <Package className="h-12 w-12 text-primary/30" />
        </div>
        <div className="absolute top-20 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <Truck className="h-16 w-16 text-secondary/30" />
        </div>
        <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: '2s' }}>
          <Shield className="h-10 w-10 text-primary/30" />
        </div>
      </section>

      {/* Rastreio Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-elegant">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Rastreie sua Encomenda</CardTitle>
              <CardDescription className="text-lg">
                Digite seu CPF para acompanhar o status da sua entrega
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRastreio} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCPFChange}
                    className="h-12 text-lg"
                    maxLength={14}
                  />
                </div>
                <Button type="submit" variant="cta" size="lg" className="h-12">
                  <Search className="mr-2 h-5 w-5" />
                  Rastrear
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Serviços Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Nossos Serviços</h2>
            <p className="text-xl text-muted-foreground">
              Soluções completas em logística e transporte
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader className="text-center">
                <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Entregas de Encomendas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Transporte seguro de encomendas com rastreamento em tempo real
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader className="text-center">
                <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Thermometer className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Encomendas Refrigeradas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Transporte com controle de temperatura para produtos perecíveis
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader className="text-center">
                <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Weight className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Cargas até 30T</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Transporte de cargas pesadas com equipamentos especializados
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Diferenciais Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Por que escolher a JuEntregas?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Segurança</h3>
              <p className="text-muted-foreground">
                Suas encomendas protegidas durante todo o trajeto
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pontualidade</h3>
              <p className="text-muted-foreground">
                Compromisso com prazos e horários estabelecidos
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cobertura Regional</h3>
              <p className="text-muted-foreground">
                Atendimento completo em todo o Sul do Brasil
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <MapaBrasil />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;