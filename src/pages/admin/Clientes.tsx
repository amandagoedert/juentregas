// src/pages/admin/Clientes.tsx
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, UserRoundSearch, Trash2, Edit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

// Importar os dados e funções de atualização do módulo centralizado
import { clientsData, updateClientsData } from "@/data/mockData";

// Definindo tipos para consistência (pode remover se já estiver em mockData.ts)
// Se você copiou as interfaces para mockData.ts, você pode remover essas declarações aqui.
// No entanto, para garantir que o tipo Client seja reconhecido, é bom tê-lo exportado de mockData.ts
// e importá-lo aqui também, ou definir aqui se mockData.ts for só para as variáveis.
interface Client {
  id: string;
  fullName: string;
  cpf: string;
  phone?: string;
  email?: string;
}

const Clientes = () => {
  // Inicializa o estado local com os dados do módulo centralizado
  const [clients, setClients] = useState<Client[]>(clientsData);
  const [newClient, setNewClient] = useState<Omit<Client, 'id'>>({ fullName: "", cpf: "", phone: "", email: "" });
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { toast } = useToast();

  // Sincroniza o estado local 'clients' com a variável global compartilhada
  // sempre que 'clients' for alterado.
  useEffect(() => {
    updateClientsData(clients);
  }, [clients]);

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

  const handleNewClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "cpf") {
      setNewClient(prev => ({ ...prev, [id]: formatCPF(value) }));
    } else if (id === "phone") {
      setNewClient(prev => ({ ...prev, [id]: formatPhone(value) }));
    } else {
      setNewClient(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleEditClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingClient) return;
    const { id, value } = e.target;
    if (id === "editCpf") {
      setEditingClient(prev => prev ? { ...prev, cpf: formatCPF(value) } : null);
    } else if (id === "editPhone") {
      setEditingClient(prev => prev ? { ...prev, phone: formatPhone(value) } : null);
    } else {
      setEditingClient(prev => prev ? { ...prev, [id.replace('edit', '').toLowerCase()]: value } : null);
    }
  };

  const addClient = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newClient.fullName || !newClient.cpf) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome completo e CPF são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const cleanedCpf = newClient.cpf.replace(/\D/g, '');
    if (cleanedCpf.length !== 11) {
      toast({
        title: "CPF inválido",
        description: "O CPF deve conter 11 dígitos.",
        variant: "destructive",
      });
      return;
    }

    // Verifica contra o estado local 'clients' que é sincronizado com clientsData
    if (clients.some(client => client.cpf.replace(/\D/g, '') === cleanedCpf)) {
      toast({
        title: "CPF duplicado",
        description: "Já existe um cliente cadastrado com este CPF.",
        variant: "destructive",
      });
      return;
    }

    const clientToAdd: Client = { ...newClient, id: crypto.randomUUID() };
    setClients(prev => [...prev, clientToAdd]); // Atualiza o estado local, que por sua vez atualiza clientsData via useEffect
    setNewClient({ fullName: "", cpf: "", phone: "", email: "" });
    toast({
      title: "Cliente cadastrado!",
      description: `${clientToAdd.fullName} foi adicionado com sucesso.`,
    });
  };

  const updateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    if (!editingClient.fullName || !editingClient.cpf) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome completo e CPF são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const cleanedCpf = editingClient.cpf.replace(/\D/g, '');
    if (cleanedCpf.length !== 11) {
      toast({
        title: "CPF inválido",
        description: "O CPF deve conter 11 dígitos.",
        variant: "destructive",
      });
      return;
    }

    // Verifica contra o estado local 'clients'
    if (clients.some(client => client.id !== editingClient.id && client.cpf.replace(/\D/g, '') === cleanedCpf)) {
      toast({
        title: "CPF duplicado",
        description: "Já existe outro cliente cadastrado com este CPF.",
        variant: "destructive",
      });
      return;
    }

    setClients(clients.map(client => client.id === editingClient.id ? editingClient : client));
    setEditingClient(null);
    toast({
      title: "Cliente atualizado!",
      description: `${editingClient.fullName} foi atualizado com sucesso.`,
    });
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id));
    toast({
      title: "Cliente removido",
      description: "O cliente foi removido com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          Gerenciar Clientes
        </h1>

        {/* Formulário de Cadastro de Novo Cliente */}
        <Card className="shadow-elegant mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="mr-2 h-6 w-6" />
              Cadastrar Novo Cliente
            </CardTitle>
            <CardDescription>
              Preencha os dados para adicionar um novo cliente ao sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addClient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Nome Completo *</Label>
                  <Input
                    id="fullName"
                    value={newClient.fullName}
                    onChange={handleNewClientChange}
                    placeholder="Nome completo do cliente"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={newClient.cpf}
                    onChange={handleNewClientChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={newClient.phone}
                    onChange={handleNewClientChange}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={handleNewClientChange}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <Button type="submit" variant="default" className="w-full">
                <UserPlus className="mr-2 h-5 w-5" />
                Cadastrar Cliente
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Clientes Cadastrados */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserRoundSearch className="mr-2 h-6 w-6" />
              Clientes Cadastrados ({clients.length})
            </CardTitle>
            <CardDescription>
              Visualize e gerencie os clientes existentes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clients.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Nenhum cliente cadastrado ainda.</p>
            ) : (
              <div className="relative w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome Completo</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map(client => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.fullName}</TableCell>
                        <TableCell>{client.cpf}</TableCell>
                        <TableCell>{client.phone || '-'}</TableCell>
                        <TableCell>{client.email || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="mr-1"
                            onClick={() => setEditingClient(client)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteClient(client.id)}
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

      {/* Modal de Edição de Cliente */}
      {editingClient && (
        <Dialog open={!!editingClient} onOpenChange={() => setEditingClient(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <CardDescription>Faça as alterações necessárias no perfil do cliente.</CardDescription>
            </DialogHeader>
            <form onSubmit={updateClient} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editFullName" className="text-right">
                  Nome
                </Label>
                <Input
                  id="editFullName"
                  value={editingClient.fullName}
                  onChange={handleEditClientChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editCpf" className="text-right">
                  CPF
                </Label>
                <Input
                  id="editCpf"
                  value={editingClient.cpf}
                  onChange={handleEditClientChange}
                  className="col-span-3"
                  maxLength={14}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editPhone" className="text-right">
                  Telefone
                </Label>
                <Input
                  id="editPhone"
                  value={editingClient.phone || ''}
                  onChange={handleEditClientChange}
                  className="col-span-3"
                  maxLength={15}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEmail" className="text-right">
                  E-mail
                </Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editingClient.email || ''}
                  onChange={handleEditClientChange}
                  className="col-span-3"
                />
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

export default Clientes;