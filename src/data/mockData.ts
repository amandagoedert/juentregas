// src/data/mockData.ts

// Definições de tipo (garanta que estas interfaces são consistentes com as usadas em Clientes.tsx e Pedidos.tsx)
// É ideal que estas interfaces sejam definidas em um arquivo de tipos global (ex: src/types/index.ts)
// e importadas para mockData.ts, Clientes.tsx, Pedidos.tsx e Rastreio.tsx.
// Por simplicidade aqui, estou presumindo que você as manteve nas outras pages como no último exemplo.
// Se você moveu para um types/index.ts, adapte os imports nos outros arquivos.

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


  // Dados de cliente pré-carregados
  export let clientsData: Client[] = [
    {
      id: "larissa-client-id-123", // Um ID único para a Larissa
      fullName: "Larissa Hellen Calinski",
      cpf: "123.456.789-00", // CPF de exemplo para a Larissa
      phone: "(46) 99984-6550", // Telefone atualizado
      email: "larissa.calinski@email.com", // Email de exemplo
    },
  ];

  // Dados de pedido pré-carregados para a Larissa
  export let ordersData: Order[] = [
    {
      id: "larissa-order-id-456", // Um ID único para o pedido
      clientId: "12345678900", // CPF da Larissa (limpo, sem formatação)
      orderNumber: "JE98765432", // NÚMERO DE PEDIDO FIXO PARA DEMONSTRAÇÃO
      collectionAddress: "Rua Exemplo, 100 - Centro, Cascavel - PR", // Endereço de exemplo
      deliveryAddress: "Getúlio Vargas, 20 - Centro, Irati - SC, 89856-000",
      currentStatus: "Em Trânsito",
      estimatedDeliveryDate: "2025-07-05", // Previsão de entrega
      weight: "Menor que 3KG", // Peso atualizado
      dimensions: "23x23x30 cm",
      packageType: "encomenda-refrigerada", // Tipo de encomenda
      urgent: false,
      refrigerated: true,
      insured: true, // Adicionado como true para demonstração
      observations: "Conteúdo delicado, manter em temperatura controlada.", // Observações
      clientName: "Larissa Hellen Calinski",
      events: [
        {
          id: "event-1",
          status: "Pedido Criado",
          description: "Encomenda registrada no sistema.",
          location: "Cascavel - PR",
          date: "01/07/2025",
          time: "08:00",
          icon: "Package",
          completed: true,
        },
        {
          id: "event-2",
          status: "Coletado",
          description: "Encomenda coletada no remetente.",
          location: "Cascavel - PR",
          date: "01/07/2025",
          time: "10:30",
          icon: "CheckCircle",
          completed: true,
        },
        {
          id: "event-3",
          status: "Em Trânsito",
          description: "Encomenda em transporte para destino.",
          location: "Curitiba - PR", // Localização intermediária
          date: "02/07/2025",
          time: "15:00",
          icon: "Truck",
          completed: true,
        },
        // Evento de previsão, ainda não completo
        {
          id: "event-4",
          status: "Saiu para Entrega",
          description: "Encomenda saiu para entrega final.",
          location: "Irati - SC",
          date: "05/07/2025",
          time: "Previsto até 18:00",
          icon: "MapPin",
          completed: false, // Ainda não concluído
        },
      ],
    },
  ];

  // Funções para atualizar os dados
  export const updateClientsData = (newClients: Client[]) => {
    clientsData = newClients;
  };

  export const updateOrdersData = (newOrders: Order[]) => {
    ordersData = newOrders;
  };