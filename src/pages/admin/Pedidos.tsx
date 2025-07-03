// src/pages/admin/Pedidos.tsx
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  PlusCircle,
  Truck,
  MapPin,
  Calendar,
  ClipboardList,
  Edit,
  Trash2,
  History,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  UserRoundSearch
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// Importar os dados e funções de atualização do módulo centralizado
import { clientsData, ordersData, updateOrdersData } from "@/data/mockData";

// Definindo tipos para consistência (pode remover se já estiver em mockData.ts)
// Se você copiou as interfaces para mockData.ts, você pode remover essas declarações aqui.
// É altamente recomendado que as interfaces fiquem em mockData.ts e sejam importadas.
interface Client {
  id: string;
  fullName: string;
  cpf: string;
  phone?: string;
  email?: string;
}

interface OrderEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  date: string;
  time: string;
  icon: string;
  completed: boolean;
}

interface Order {
  id: string;
  clientId: string;
  orderNumber: string;
  collectionAddress: string;
  deliveryAddress: string;
  currentStatus: string;
  estimatedDeliveryDate: string;
  weight: string;
  dimensions: string;
  packageType: string;
  urgent: boolean;
  refrigerated: boolean;
  insured: boolean;
  observations: string;
  events: OrderEvent[];
  clientName?: string;
}


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

const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length > 11) return numbers.substring(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length > 11) return numbers.substring(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  if (numbers.length === 10) return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  return numbers;
};

const Pedidos = () => {
  // Inicializa o estado local com os dados do módulo centralizado
  const [orders, setOrders] = useState<Order[]>(ordersData);
  // 'clients' aqui não precisa ser um estado, pode ler diretamente de clientsData
  // const [clients, setClients] = useState<Client[]>(clientsData); // REMOVA esta linha

  const [newOrder, setNewOrder] = useState<Omit<Order, 'id' | 'orderNumber' | 'events'>>({
    clientId: "",
    collectionAddress: "",
    deliveryAddress: "",
    currentStatus: "Coletado",
    estimatedDeliveryDate: "",
    weight: "",
    dimensions: "",
    packageType: "encomenda-normal",
    urgent: false,
    refrigerated: false,
    insured: false,
    observations: "",
  });
  const [newOrderClientCpf, setNewOrderClientCpf] = useState<string>("");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [newEvolutionText, setNewEvolutionText] = useState("");
  const { toast } = useToast();

  // Sincroniza o estado local 'orders' com a variável global compartilhada
  // sempre que 'orders' for alterado.
  useEffect(() => {
    updateOrdersData(orders);
  }, [orders]);

  // Função auxiliar para encontrar o nome do cliente pelo CPF usando clientsData
  const getClientName = (cpf: string) => {
    const client = clientsData.find(c => c.cpf.replace(/\D/g, '') === cpf.replace(/\D/g, ''));
    return client ? client.fullName : "Cliente Desconhecido";
  };

  const handleNewOrderChange = (field: string, value: string | boolean) => {
    setNewOrder(prev => ({ ...prev, [field]: value }));
  };

  const handleEditingOrderChange = (field: string, value: string | boolean) => {
    setEditingOrder(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleNewOrderClientCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewOrderClientCpf(formatCPF(e.target.value));
  };

  const addOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedCpf = newOrderClientCpf.replace(/\D/g, '');
    // Verifica contra clientsData diretamente
    const clientExists = clientsData.some(client => client.cpf.replace(/\D/g, '') === cleanedCpf);

    if (!newOrder.collectionAddress || !newOrder.deliveryAddress || !newOrder.estimatedDeliveryDate || !cleanedCpf) {
      toast({
        title: "Campos obrigatórios",
        description: "Endereço de recolhimento, endereço de entrega, previsão de entrega e CPF do cliente são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!clientExists) {
        toast({
            title: "Cliente não encontrado",
            description: "Nenhum cliente com este CPF foi encontrado. Por favor, cadastre o cliente primeiro.",
            variant: "destructive",
        });
        return;
    }

    const orderNum = "JE" + Math.random().toString().slice(2, 10);
    const newId = crypto.randomUUID();
    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-BR');
    const formattedTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const orderToAdd: Order = {
      ...newOrder,
      id: newId,
      orderNumber: orderNum,
      clientId: cleanedCpf,
      clientName: getClientName(cleanedCpf),
      events: [
        {
          id: crypto.randomUUID(),
          status: newOrder.currentStatus,
          description: `Pedido registrado no sistema com status: ${newOrder.currentStatus}`,
          location: newOrder.collectionAddress,
          date: formattedDate,
          time: formattedTime,
          icon: "Package",
          completed: true,
        },
      ],
    };

    setOrders(prev => [...prev, orderToAdd]); // Atualiza o estado local, que por sua vez atualiza ordersData via useEffect
    setNewOrder({
      clientId: "",
      collectionAddress: "",
      deliveryAddress: "",
      currentStatus: "Coletado",
      estimatedDeliveryDate: "",
      weight: "",
      dimensions: "",
      packageType: "encomenda-normal",
      urgent: false,
      refrigerated: false,
      insured: false,
      observations: "",
    });
    setNewOrderClientCpf("");
    toast({
      title: "Pedido cadastrado!",
      description: `Pedido ${orderNum} para ${orderToAdd.clientName} foi adicionado.`,
    });
  };

  const updateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    if (!editingOrder.collectionAddress || !editingOrder.deliveryAddress || !editingOrder.estimatedDeliveryDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Endereço de recolhimento, endereço de entrega e previsão de entrega são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setOrders(orders.map(order => order.id === editingOrder.id ? editingOrder : order));
    setEditingOrder(null);
    toast({
      title: "Pedido atualizado!",
      description: `Pedido ${editingOrder.orderNumber} atualizado com sucesso.`,
    });
  };

  const addEvolution = (orderId: string) => {
    if (!editingOrder || newEvolutionText.trim() === "") {
      toast({
        title: "Evolução vazia",
        description: "Por favor, digite a descrição da evolução.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-BR');
    const formattedTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newEvent: OrderEvent = {
      id: crypto.randomUUID(),
      status: editingOrder.currentStatus,
      description: newEvolutionText.trim(),
      location: editingOrder.deliveryAddress,
      date: formattedDate,
      time: formattedTime,
      icon: getStatusIconName(editingOrder.currentStatus),
      completed: true,
    };

    setEditingOrder(prev => {
        if (!prev) return null;
        const updatedEvents = [...prev.events, newEvent];
        return { ...prev, events: updatedEvents };
    });
    setNewEvolutionText("");
    toast({
      title: "Evolução adicionada!",
      description: "Nova evolução registrada no histórico do pedido.",
    });
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter(order => order.id !== id));
    toast({
      title: "Pedido removido",
      description: "O pedido foi removido com sucesso.",
    });
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

  const getStatusIconName = (status: string) => {
    switch (status) {
      case "Entregue": return "CheckCircle";
      case "Em Trânsito": return "Truck";
      case "Coletado": return "Package";
      case "Saiu para Entrega": return "MapPin";
      case "Pendente": return "Clock";
      default: return "AlertCircle";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          Gerenciar Pedidos
        </h1>

        {/* Formulário de Cadastro de Novo Pedido */}
        <Card className="shadow-elegant mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PlusCircle className="mr-2 h-6 w-6" />
              Cadastrar Novo Pedido
            </CardTitle>
            <CardDescription>
              Preencha os detalhes para registrar uma nova encomenda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addOrder} className="space-y-6">
              {/* CPF do Cliente */}
              <div>
                <Label htmlFor="clientCpf">CPF do Cliente *</Label>
                <Input
                  id="clientCpf"
                  value={newOrderClientCpf}
                  onChange={handleNewOrderClientCpfChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                    Este CPF deve corresponder a um cliente já cadastrado.
                </p>
              </div>

              {/* Endereços */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="collectionAddress">Endereço de Recolhimento *</Label>
                  <Input
                    id="collectionAddress"
                    value={newOrder.collectionAddress}
                    onChange={(e) => handleNewOrderChange('collectionAddress', e.target.value)}
                    placeholder="Rua, número, cidade - UF"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryAddress">Endereço de Entrega *</Label>
                  <Input
                    id="deliveryAddress"
                    value={newOrder.deliveryAddress}
                    onChange={(e) => handleNewOrderChange('deliveryAddress', e.target.value)}
                    placeholder="Rua, número, cidade - UF"
                    required
                  />
                </div>
              </div>

              {/* Detalhes da Encomenda */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="weight">Peso</Label>
                  <Input
                    id="weight"
                    value={newOrder.weight}
                    onChange={(e) => handleNewOrderChange('weight', e.target.value)}
                    placeholder="Ex: 5kg"
                  />
                </div>
                <div>
                  <Label htmlFor="dimensions">Dimensões</Label>
                  <Input
                    id="dimensions"
                    value={newOrder.dimensions}
                    onChange={(e) => handleNewOrderChange('dimensions', e.target.value)}
                    placeholder="C x L x A (cm)"
                  />
                </div>
                <div>
                  <Label htmlFor="packageType">Tipo de Encomenda</Label>
                  <Select onValueChange={(value) => handleNewOrderChange('packageType', value)} value={newOrder.packageType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="encomenda-normal">Encomenda Normal</SelectItem>
                      <SelectItem value="encomenda-refrigerada">Encomenda Refrigerada</SelectItem>
                      <SelectItem value="carga-pesada">Carga Pesada (até 30T)</SelectItem>
                      <SelectItem value="documento">Documento</SelectItem>
                      <SelectItem value="fragil">Produto Frágil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Status e Previsão */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentStatus">Status Inicial *</Label>
                  <Select onValueChange={(value) => handleNewOrderChange('currentStatus', value)} value={newOrder.currentStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status inicial" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pedido Criado">Pedido Criado</SelectItem>
                      <SelectItem value="Coletado">Coletado</SelectItem>
                      <SelectItem value="Em Trânsito">Em Trânsito</SelectItem>
                      <SelectItem value="Saiu para Entrega">Saiu para Entrega</SelectItem>
                      <SelectItem value="Entregue">Entregue</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="estimatedDeliveryDate">Previsão de Entrega *</Label>
                  <Input
                    id="estimatedDeliveryDate"
                    type="date"
                    value={newOrder.estimatedDeliveryDate}
                    onChange={(e) => handleNewOrderChange('estimatedDeliveryDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Campo de Observações */}
              <div>
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  value={newOrder.observations}
                  onChange={(e) => handleNewOrderChange('observations', e.target.value)}
                  placeholder="Informações adicionais sobre o pedido..."
                  className="min-h-[80px]"
                />
              </div>

              {/* Serviços Adicionais */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Serviços Adicionais</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="urgent"
                    checked={newOrder.urgent}
                    onCheckedChange={(checked) => handleNewOrderChange('urgent', checked as boolean)}
                  />
                  <Label htmlFor="urgent">Entrega Urgente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="refrigerated"
                    checked={newOrder.refrigerated}
                    onCheckedChange={(checked) => handleNewOrderChange('refrigerated', checked as boolean)}
                  />
                  <Label htmlFor="refrigerated">Transporte Refrigerado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="insured"
                    checked={newOrder.insured}
                    onCheckedChange={(checked) => handleNewOrderChange('insured', checked as boolean)}
                  />
                  <Label htmlFor="insured">Com Seguro</Label>
                </div>
              </div>

              <Button type="submit" variant="default" className="w-full">
                <PlusCircle className="mr-2 h-5 w-5" />
                Cadastrar Pedido
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Pedidos Cadastrados */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2 h-6 w-6" />
              Pedidos Cadastrados ({orders.length})
            </CardTitle>
            <CardDescription>
              Visualize e gerencie as encomendas existentes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Nenhum pedido cadastrado ainda.</p>
            ) : (
              <div className="relative w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nº Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Origem</TableHead>
                      <TableHead>Destino</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Previsão</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.clientName}</TableCell>
                        <TableCell>{order.collectionAddress.split(',')[0]}</TableCell>
                        <TableCell>{order.deliveryAddress.split(',')[0]}</TableCell>
                        <TableCell>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold text-white ${getStatusColor(order.currentStatus)}`}>
                            {order.currentStatus}
                          </span>
                        </TableCell>
                        <TableCell>{order.estimatedDeliveryDate}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="mr-1"
                            onClick={() => setEditingOrder(order)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteOrder(order.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />

      {/* Modal de Edição de Pedido e Evolução */}
      {editingOrder && (
        <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Editar Pedido: {editingOrder.orderNumber}</DialogTitle>
              <CardDescription>
                Atualize as informações do pedido e adicione evoluções.
              </CardDescription>
            </DialogHeader>
            <form onSubmit={updateOrder} className="grid gap-4 py-4">
              {/* Informações Gerais do Pedido */}
              <div className="space-y-2">
                <h3 className="font-semibold">Dados Principais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editCollectionAddress">End. Recolhimento</Label>
                    <Input
                      id="editCollectionAddress"
                      value={editingOrder.collectionAddress}
                      onChange={(e) => handleEditingOrderChange('collectionAddress', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editDeliveryAddress">End. Entrega</Label>
                    <Input
                      id="editDeliveryAddress"
                      value={editingOrder.deliveryAddress}
                      onChange={(e) => handleEditingOrderChange('deliveryAddress', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="editCurrentStatus">Status Atual</Label>
                        <Select onValueChange={(value) => handleEditingOrderChange('currentStatus', value)} value={editingOrder.currentStatus}>
                            <SelectTrigger id="editCurrentStatus">
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pedido Criado">Pedido Criado</SelectItem>
                                <SelectItem value="Coletado">Coletado</SelectItem>
                                <SelectItem value="Em Trânsito">Em Trânsito</SelectItem>
                                <SelectItem value="Saiu para Entrega">Saiu para Entrega</SelectItem>
                                <SelectItem value="Entregue">Entregue</SelectItem>
                                <SelectItem value="Pendente">Pendente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="editEstimatedDeliveryDate">Previsão de Entrega</Label>
                        <Input
                            id="editEstimatedDeliveryDate"
                            type="date"
                            value={editingOrder.estimatedDeliveryDate}
                            onChange={(e) => handleEditingOrderChange('estimatedDeliveryDate', e.target.value)}
                            required
                        />
                    </div>
                </div>
                {/* Campo de Observações no modal de edição */}
                <div>
                  <Label htmlFor="editObservations">Observações</Label>
                  <Textarea
                    id="editObservations"
                    value={editingOrder.observations}
                    onChange={(e) => handleEditingOrderChange('observations', e.target.value)}
                    placeholder="Informações adicionais sobre o pedido..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              <Separator className="my-4" />

              {/* Evolução do Pedido */}
              <div className="space-y-4">
                <h3 className="font-semibold">Histórico de Evolução</h3>
                {editingOrder.events.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Nenhuma evolução registrada ainda.</p>
                ) : (
                  <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                    {editingOrder.events.map((event) => {
                        const IconComponent = getLucideIcon(event.icon);
                        return (
                            <div key={event.id} className="flex items-start space-x-3 text-sm">
                                <div className={`
                                    p-1 rounded-full shrink-0
                                    ${event.completed ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}
                                `}>
                                    <IconComponent className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-foreground">{event.description}</p>
                                    <p className="text-muted-foreground text-xs">
                                        {event.date} às {event.time} - {event.location}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <Label htmlFor="newEvolution">Adicionar Nova Evolução</Label>
                  <Textarea
                    id="newEvolution"
                    placeholder="Ex: 'Pacote chegou ao centro de distribuição de Florianópolis.'"
                    value={newEvolutionText}
                    onChange={(e) => setNewEvolutionText(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <Button type="button" onClick={() => addEvolution(editingOrder.id)} size="sm" className="w-full">
                    <History className="mr-2 h-4 w-4" />
                    Adicionar Evolução
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Pedidos;