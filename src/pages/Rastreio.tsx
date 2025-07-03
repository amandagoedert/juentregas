// src/pages/Rastreio.tsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Package,
  Truck,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Phone,
  History,
  MessageCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

// Importar os dados do módulo centralizado
import { clientsData, ordersData } from "@/data/mockData";

interface StatusEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  date: string;
  time: string;
  icon: string;
  completed: boolean;
}

interface TrackingData {
  orderNumber: string;
  status: string;
  recipient: string;
  phone: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  weight: string;
  type: string;
  observations?: string;
  events: StatusEvent[];
}

const Rastreio = () => {
  const [searchParams] = useSearchParams();
  // Alterado: usa 'orderNumber' do URL ou string vazia
  const [orderNumberInput, setOrderNumberInput] = useState(searchParams.get('orderNumber') || "");
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Se houver 'orderNumber' na URL, tenta rastrear
    if (searchParams.get('orderNumber')) {
      handleRastreio();
    }
  }, []); // Dependência vazia para rodar apenas uma vez na montagem

  // Removido: formatCPF não é mais necessário aqui
  // const formatCPF = (value: string) => {
  //   const numbers = value.replace(/\D/g, "");
  //   return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  // };

  // Alterado: lida com a mudança do número do pedido
  const handleOrderNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderNumberInput(e.target.value.toUpperCase()); // Converte para maiúsculas para consistência, se necessário
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Entregue": return "bg-green-500";
      case "Em Trânsito":
      case "Saiu para Entrega": return "bg-blue-500";
      case "Coletado":
      case "Pedido Criado":
      case "Pendente": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getLucideIcon = (iconName: string) => {
    switch (iconName) {
      case "Package": return Package;
      case "Truck": return Truck;
      case "MapPin": return MapPin;
      case "CheckCircle": return CheckCircle;
      case "Clock": return Clock;
      case "AlertCircle": return AlertCircle;
      case "History": return History;
      default: return AlertCircle;
    }
  };

  const handleRastreio = async () => {
    if (!orderNumberInput.trim()) {
      toast({
        title: "Número do pedido obrigatório",
        description: "Por favor, digite o número do pedido para rastrear a encomenda.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTrackingData(null); // Limpa dados anteriores

    const cleanedOrderNumber = orderNumberInput.trim().toUpperCase(); // Limpa e padroniza

    // Simulação de busca de dados
    setTimeout(() => {
        // Busca o pedido diretamente pelo número do pedido
        const foundOrder = ordersData.find(order => order.orderNumber.toUpperCase() === cleanedOrderNumber);

        if (!foundOrder) {
            setLoading(false);
            toast({
                title: "Pedido não encontrado",
                description: `Nenhum pedido com o número "${orderNumberInput}" foi encontrado. Verifique o número e tente novamente.`,
                variant: "destructive",
            });
            return;
        }

        // Se o pedido for encontrado, encontra o cliente associado
        const foundClient = clientsData.find(client => client.cpf.replace(/\D/g, '') === foundOrder.clientId);

        if (!foundClient) {
            // Caso raro, mas para garantir que o cliente associado exista
            setLoading(false);
            toast({
                title: "Erro de dados",
                description: "Pedido encontrado, mas os dados do cliente associado estão ausentes.",
                variant: "destructive",
            });
            return;
        }

        const data: TrackingData = {
            orderNumber: foundOrder.orderNumber,
            status: foundOrder.currentStatus,
            recipient: foundClient.fullName,
            phone: foundClient.phone || "Não informado",
            origin: foundOrder.collectionAddress,
            destination: foundOrder.deliveryAddress,
            estimatedDelivery: foundOrder.estimatedDeliveryDate,
            weight: foundOrder.weight,
            type: foundOrder.packageType === 'encomenda-normal' ? 'Encomenda Normal' : foundOrder.packageType === 'encomenda-refrigerada' ? 'Encomenda Refrigerada' : foundOrder.packageType === 'carga-pesada' ? 'Carga Pesada (até 30T)' : foundOrder.packageType === 'documento' ? 'Documento' : foundOrder.packageType === 'fragil' ? 'Produto Frágil' : 'Outro Tipo',
            observations: foundOrder.observations || "",
            events: foundOrder.events.map((event: any) => ({
                id: event.id,
                status: event.status,
                description: event.description,
                location: event.location,
                date: event.date,
                time: event.time,
                icon: event.icon,
                completed: event.completed,
            }))
        };

        setTrackingData(data);
        setLoading(false);

        toast({
          title: "Encomenda encontrada!",
          description: `Pedido ${data.orderNumber} - ${data.status}`,
        });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Busca */}
        <Card className="shadow-elegant mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Rastreamento de Encomenda</CardTitle>
            <CardDescription className="text-lg">
              Digite o número do seu pedido para acompanhar o status da sua entrega
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Ex: JE12345678" // Novo placeholder
                  value={orderNumberInput}
                  onChange={handleOrderNumberChange} // Nova função de tratamento
                  className="h-12 text-lg"
                  // Removido: maxLength para CPF
                />
              </div>
              <Button
                onClick={handleRastreio}
                variant="cta"
                size="lg"
                className="h-12"
                disabled={loading}
              >
                <Search className="mr-2 h-5 w-5" />
                {loading ? "Buscando..." : "Rastrear"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados do Rastreamento */}
        {trackingData && (
          <div className="space-y-6">
            {/* Informações Gerais */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Pedido {trackingData.orderNumber}</CardTitle>
                  <Badge className={`${getStatusColor(trackingData.status)} text-white`}>
                    {trackingData.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <User className="h-4 w-4 mr-2" />
                      <span className="text-sm">Destinatário</span>
                    </div>
                    <p className="font-semibold">{trackingData.recipient}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2" />
                      <span className="text-sm">Telefone</span>
                    </div>
                    <p className="font-semibold">{trackingData.phone}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">Previsão de Entrega</span>
                    </div>
                    <p className="font-semibold">{trackingData.estimatedDelivery}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <Package className="h-4 w-4 mr-2" />
                      <span className="text-sm">Tipo e Peso</span>
                    </div>
                    <p className="font-semibold">{trackingData.type}</p>
                    <p className="text-sm text-muted-foreground">{trackingData.weight}</p>
                  </div>
                </div>

                {/* Seção de Observações Adicional */}
                {trackingData.observations && trackingData.observations.trim() !== "" && (
                  <>
                    <Separator className="my-6" />
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm">Observações do Pedido</span>
                      </div>
                      <p className="text-sm text-foreground italic">"{trackingData.observations}"</p>
                    </div>
                  </>
                )}

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">Origem</span>
                    </div>
                    <p className="font-semibold">{trackingData.origin}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">Destino</span>
                    </div>
                    <p className="font-semibold">{trackingData.destination}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline de Status */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl">Histórico de Movimentação</CardTitle>
                <CardDescription>
                  Acompanhe todas as etapas da sua encomenda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingData.events.map((event, index) => {
                    const IconComponent = getLucideIcon(event.icon);
                    const isLast = index === trackingData.events.length - 1;

                    return (
                      <div key={event.id} className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <div className={`
                            p-2 rounded-full
                            ${event.completed
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 text-gray-500'
                            }
                          `}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          {!isLast && (
                            <div className={`
                              w-0.5 h-8 mt-2
                              ${event.completed ? 'bg-primary' : 'bg-gray-200'}
                            `} />
                          )}
                        </div>

                        <div className="flex-1 pb-6">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-semibold ${
                              event.completed ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {event.status}
                            </h4>
                            <div className="text-sm text-muted-foreground">
                              {event.date} às {event.time}
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm mb-1">
                            {event.description}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Informações de Contato */}
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Precisa de ajuda?</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Entre em contato conosco para esclarecimentos sobre sua encomenda
                  </p>
                  <div className="flex justify-center items-center space-x-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">(21) 98603-9803</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {loading && (
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Buscando informações da sua encomenda...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Rastreio;